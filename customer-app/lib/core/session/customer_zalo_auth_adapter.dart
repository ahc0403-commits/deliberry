import 'dart:convert';
import 'dart:math';

import 'package:crypto/crypto.dart';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:url_launcher/url_launcher.dart';

import '../backend/runtime_backend_config.dart';
import '../supabase/supabase_client.dart';
import 'customer_auth_adapter.dart';
import 'customer_auth_attempt_store.dart';
import 'web_current_tab_launcher.dart';

class CustomerZaloAuthAdapter implements CustomerAuthAdapter {
  const CustomerZaloAuthAdapter();

  @override
  Future<CustomerAuthStartResult> beginSignIn(
    CustomerAuthProvider provider,
  ) async {
    if (provider != CustomerAuthProvider.zalo) {
      return CustomerAuthStartResult(
        provider: provider,
        blockerCode: 'provider_not_supported',
        message: 'Unsupported auth provider: $provider',
      );
    }

    if (!RuntimeBackendConfig.current.isConfigured) {
      return const CustomerAuthStartResult(
        provider: CustomerAuthProvider.zalo,
        blockerCode: 'supabase_runtime_unconfigured',
        message:
            'Customer Supabase runtime config is missing. Set SUPABASE_URL and SUPABASE_ANON_KEY.',
      );
    }

    if (!CustomerZaloAuthConfig.current.isConfigured) {
      return const CustomerAuthStartResult(
        provider: CustomerAuthProvider.zalo,
        blockerCode: 'zalo_config_missing',
        message:
            'Zalo auth config is missing. Set ZALO_APP_ID and ZALO_REDIRECT_URI.',
      );
    }

    final nonce = _randomToken(length: 16);
    final codeVerifier = _randomToken(length: 43);
    final state = kIsWeb
        ? _webStateFor(
            nonce: nonce,
            returnTo: _canonicalWebReturnTo(Uri.base),
            codeVerifier: codeVerifier,
          )
        : nonce;
    final codeChallenge = _codeChallengeFor(codeVerifier);

    final attempt = CustomerAuthAttempt(
      provider: CustomerAuthProvider.zalo,
      state: state,
      codeVerifier: codeVerifier,
    );
    if (kIsWeb) {
      // Keep web launch in the active user gesture path.
      CustomerAuthAttemptStore.write(attempt);
    } else {
      await CustomerAuthAttemptStore.write(attempt);
    }

    final authorizationUri = Uri.https(
      'oauth.zaloapp.com',
      '/v4/permission',
      {
        'app_id': CustomerZaloAuthConfig.current.appId,
        'redirect_uri': CustomerZaloAuthConfig.current.redirectUri,
        'state': state,
        'code_challenge': codeChallenge,
        'code_challenge_method': 'S256',
      },
    );

    final launched = kIsWeb
        ? await launchInCurrentTab(authorizationUri.toString())
        : await launchUrl(
            authorizationUri,
            mode: LaunchMode.externalApplication,
          );
    if (!launched) {
      return CustomerAuthStartResult(
        provider: CustomerAuthProvider.zalo,
        authorizationUri: authorizationUri,
        blockerCode: 'zalo_launch_failed',
        message: 'Zalo login could not be launched on this device.',
      );
    }

    return CustomerAuthStartResult(
      provider: CustomerAuthProvider.zalo,
      authorizationUri: authorizationUri,
      message: 'Opening Zalo sign-in…',
    );
  }

  @override
  Future<CustomerAuthIdentity> completeAuthCallback(Uri callbackUri) async {
    if (!_matchesSupportedCallback(callbackUri)) {
      throw StateError(
        'Customer Zalo auth callback did not match the configured callback URI.',
      );
    }

    final code = callbackUri.queryParameters['code']?.trim();
    if (code == null || code.isEmpty) {
      throw StateError(
        'Customer Zalo auth callback is missing the authorization code.',
      );
    }

    final state = callbackUri.queryParameters['state']?.trim();
    final stateRecovery = kIsWeb ? _decodeWebState(state) : null;
    final attempt = await CustomerAuthAttemptStore.read();
    final recoveredAttempt = _resolveAttempt(
      storedAttempt: attempt,
      callbackState: state,
      stateRecovery: stateRecovery,
    );
    if (recoveredAttempt == null) {
      throw StateError(
        'Customer Zalo auth callback is missing the matching auth attempt.',
      );
    }
    await CustomerAuthAttemptStore.clear();

    await CustomerSupabaseClient.ensureInitialized();
    final client = CustomerSupabaseClient.maybeClient;
    if (client == null) {
      throw StateError(
        'Customer Supabase runtime is unavailable for Zalo auth exchange.',
      );
    }

    final response = await http.post(
      Uri.parse(
        CustomerZaloAuthConfig.current.redirectUri,
      ),
      headers: {
        'content-type': 'application/json',
      },
      body: jsonEncode({
        'authorization_code': code,
        'redirect_uri': CustomerZaloAuthConfig.current.redirectUri,
        'code_verifier': recoveredAttempt.codeVerifier,
        'device_context': {
          'platform': defaultTargetPlatform.name,
          'runtime': kIsWeb ? 'web' : 'native',
        },
      }),
    );

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw StateError(
        'Customer Zalo auth exchange failed with HTTP ${response.statusCode}.',
      );
    }

    final payload = jsonDecode(response.body);
    if (payload is! Map) {
      throw StateError('Customer Zalo auth exchange returned an invalid payload.');
    }

    final json = Map<String, dynamic>.from(payload);
    if (json['error_code'] is String) {
      throw StateError(
        'Customer Zalo auth exchange failed: ${json['error_code']}',
      );
    }

    final refreshToken = json['refresh_token'] as String?;
    if (refreshToken == null || refreshToken.isEmpty) {
      throw StateError(
        'Customer Zalo auth exchange did not return a refresh token.',
      );
    }

    final authResponse = await client.auth.setSession(refreshToken);
    final user = authResponse.user ?? client.auth.currentUser;
    if (user == null) {
      throw StateError(
        'Customer Zalo auth exchange did not create a usable Supabase session.',
      );
    }

    return _mapUser(
      user,
      fallbackNeedsOnboarding: json['needs_onboarding'] as bool? ?? false,
    );
  }

  @override
  Future<CustomerAuthIdentity?> restoreAuthenticatedIdentity() async {
    await CustomerSupabaseClient.ensureInitialized();
    final user = CustomerSupabaseClient.maybeClient?.auth.currentUser;
    if (user == null) {
      return null;
    }
    return _mapUser(user);
  }

  @override
  Future<void> signOut() async {
    await CustomerSupabaseClient.ensureInitialized();
    final client = CustomerSupabaseClient.maybeClient;
    if (client == null) {
      return;
    }
    await client.auth.signOut();
  }

  CustomerAuthIdentity _mapUser(
    User user, {
    bool fallbackNeedsOnboarding = false,
  }) {
    final appMetadata = user.appMetadata;
    final userMetadata = user.userMetadata;
    final actorType = (appMetadata['actor_type'] as String?) ??
        (userMetadata?['actor_type'] as String?) ??
        'customer';
    final displayName = (userMetadata?['display_name'] as String?)?.trim();
    final phoneNumber = user.phone;
    final providerName = (appMetadata['provider'] as String?)?.toLowerCase();
    final needsOnboarding = (userMetadata?['needs_onboarding'] as bool?) ??
        fallbackNeedsOnboarding;

    return CustomerAuthIdentity(
      actorId: user.id,
      actorType: actorType,
      provider: providerName == 'phone'
          ? CustomerAuthProvider.phone
          : CustomerAuthProvider.zalo,
      displayName: displayName?.isEmpty == true ? null : displayName,
      phoneNumber: phoneNumber,
      needsOnboarding: needsOnboarding,
    );
  }
}

class CustomerZaloAuthConfig {
  const CustomerZaloAuthConfig({
    required this.appId,
    required this.redirectUri,
    required this.callbackScheme,
    required this.callbackHost,
    required this.callbackPath,
  });

  static const CustomerZaloAuthConfig current = CustomerZaloAuthConfig(
    appId: String.fromEnvironment('ZALO_APP_ID', defaultValue: ''),
    redirectUri: String.fromEnvironment('ZALO_REDIRECT_URI', defaultValue: ''),
    callbackScheme: String.fromEnvironment(
      'AUTH_CALLBACK_SCHEME',
      defaultValue: 'deliberry-customer-auth',
    ),
    callbackHost: String.fromEnvironment(
      'AUTH_CALLBACK_HOST',
      defaultValue: 'zalo-callback',
    ),
    callbackPath: String.fromEnvironment(
      'AUTH_CALLBACK_PATH',
      defaultValue: '/auth',
    ),
  );

  final String appId;
  final String redirectUri;
  final String callbackScheme;
  final String callbackHost;
  final String callbackPath;

  bool get isConfigured =>
      appId.trim().isNotEmpty && redirectUri.trim().isNotEmpty;

  Uri get callbackUri => Uri(
        scheme: callbackScheme,
        host: callbackHost,
        path: callbackPath,
      );

  bool matchesCallback(Uri uri) {
    return uri.scheme == callbackScheme &&
        uri.host == callbackHost &&
        uri.path == callbackPath;
  }
}

final _random = Random.secure();

String _randomToken({int length = 43}) {
  const alphabet =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  return List.generate(
    length,
    (_) => alphabet[_random.nextInt(alphabet.length)],
  ).join();
}

String _codeChallengeFor(String verifier) {
  final digest = sha256.convert(utf8.encode(verifier));
  return base64Url.encode(digest.bytes).replaceAll('=', '');
}

String _webStateFor({
  required String nonce,
  required String returnTo,
  required String codeVerifier,
}) {
  final payload = jsonEncode({
    'nonce': nonce,
    'return_to': returnTo,
    'code_verifier': codeVerifier,
  });
  return base64Url.encode(utf8.encode(payload)).replaceAll('=', '');
}

String _canonicalWebReturnTo(Uri uri) {
  final origin = uri.origin.trim();
  if (origin.isEmpty) {
    return uri.toString();
  }
  return '$origin/#/entry';
}

_WebStateRecovery? _decodeWebState(String? state) {
  if (state == null || state.isEmpty) {
    return null;
  }

  try {
    final normalized = state.replaceAll('-', '+').replaceAll('_', '/');
    final padded = normalized.padRight(
      normalized.length + ((4 - normalized.length % 4) % 4),
      '=',
    );
    final payload = jsonDecode(
      utf8.decode(base64.decode(padded)),
    );
    if (payload is! Map<String, dynamic>) {
      return null;
    }

    final nonce = payload['nonce'];
    final codeVerifier = payload['code_verifier'];
    if (nonce is! String ||
        nonce.isEmpty ||
        codeVerifier is! String ||
        codeVerifier.isEmpty) {
      return null;
    }

    return _WebStateRecovery(
      nonce: nonce,
      codeVerifier: codeVerifier,
    );
  } catch (_) {
    return null;
  }
}

CustomerAuthAttempt? _resolveAttempt({
  required CustomerAuthAttempt? storedAttempt,
  required String? callbackState,
  required _WebStateRecovery? stateRecovery,
}) {
  if (storedAttempt != null &&
      storedAttempt.provider == CustomerAuthProvider.zalo) {
    if (callbackState == null || callbackState.isEmpty) {
      return storedAttempt;
    }
    if (callbackState == storedAttempt.state) {
      return storedAttempt;
    }
  }

  if (!kIsWeb || callbackState == null || callbackState.isEmpty) {
    return null;
  }

  if (stateRecovery == null) {
    return null;
  }

  return CustomerAuthAttempt(
    provider: CustomerAuthProvider.zalo,
    state: callbackState,
    codeVerifier: stateRecovery.codeVerifier,
  );
}

class _WebStateRecovery {
  const _WebStateRecovery({
    required this.nonce,
    required this.codeVerifier,
  });

  final String nonce;
  final String codeVerifier;
}

extension on CustomerZaloAuthAdapter {
  bool _matchesSupportedCallback(Uri callbackUri) {
    if (CustomerAuthRedirectConfig.current.matches(callbackUri)) {
      return true;
    }

    if (!kIsWeb) {
      return false;
    }

    final provider = callbackUri.queryParameters['provider']?.trim().toLowerCase();
    return (callbackUri.scheme == 'http' || callbackUri.scheme == 'https') &&
        provider == 'zalo' &&
        callbackUri.queryParameters.containsKey('code');
  }
}
