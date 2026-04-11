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
    await CustomerAuthAttemptStore.clearConsumedCallback();
    await CustomerAuthAttemptStore.write(attempt);

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
    debugPrint('[CustomerZaloAuth] callback:received host=${callbackUri.host} path=${callbackUri.path} hasCode=${callbackUri.queryParameters.containsKey("code")}');
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
    debugPrint('[CustomerZaloAuth] callback:code_present');

    final state = callbackUri.queryParameters['state']?.trim();
    final callbackFingerprint = customerAuthCallbackFingerprint(
      provider: CustomerAuthProvider.zalo,
      code: code,
      state: state,
      error: callbackUri.queryParameters['error'],
      errorDescription: callbackUri.queryParameters['error_description'],
    );
    if (await CustomerAuthAttemptStore.isConsumedCallback(
        callbackFingerprint)) {
      throw const CustomerIgnoredAuthCallback(
        'Customer Zalo auth callback was already consumed.',
      );
    }
    final attempt = await CustomerAuthAttemptStore.read();
    final recoveredAttempt = _resolveAttempt(
      storedAttempt: attempt,
      callbackState: state,
    );
    if (recoveredAttempt == null) {
      throw StateError(
        'Customer Zalo auth callback is missing the matching auth attempt.',
      );
    }
    debugPrint('[CustomerZaloAuth] callback:attempt_recovered');
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
    debugPrint(
      '[CustomerZaloAuth] exchange:http_status=${response.statusCode}',
    );

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw StateError(
        'Customer Zalo auth exchange failed with HTTP ${response.statusCode}: ${response.body}',
      );
    }

    final payload = jsonDecode(response.body);
    if (payload is! Map) {
      throw StateError(
          'Customer Zalo auth exchange returned an invalid payload.');
    }

    final json = Map<String, dynamic>.from(payload);
    if (json['error_code'] is String) {
      throw StateError(
        'Customer Zalo auth exchange failed: ${json['error_code']}',
      );
    }
    debugPrint('[CustomerZaloAuth] exchange:payload_ok');

    final refreshToken = json['refresh_token'] as String?;
    if (refreshToken == null || refreshToken.isEmpty) {
      throw StateError(
        'Customer Zalo auth exchange did not return a refresh token.',
      );
    }
    debugPrint('[CustomerZaloAuth] exchange:refresh_token_present');

    final authResponse = await client.auth.setSession(refreshToken);
    debugPrint(
      '[CustomerZaloAuth] setSession:done hasSession=${authResponse.session != null} hasUser=${authResponse.user != null} currentUser=${client.auth.currentUser != null}',
    );
    final user = authResponse.user ?? client.auth.currentUser;
    if (user == null) {
      throw StateError(
        'Customer Zalo auth exchange did not create a usable Supabase session.',
      );
    }
    debugPrint('[CustomerZaloAuth] callback:user_ready id=${user.id}');
    await CustomerAuthAttemptStore.markCallbackConsumed(callbackFingerprint);

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
    final needsOnboarding =
        (userMetadata?['needs_onboarding'] as bool?) ?? fallbackNeedsOnboarding;

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
  });

  static const CustomerZaloAuthConfig current = CustomerZaloAuthConfig(
    appId: String.fromEnvironment('ZALO_APP_ID', defaultValue: ''),
    redirectUri: String.fromEnvironment('ZALO_REDIRECT_URI', defaultValue: ''),
  );

  final String appId;
  final String redirectUri;

  bool get isConfigured =>
      appId.trim().isNotEmpty && redirectUri.trim().isNotEmpty;
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

CustomerAuthAttempt? _resolveAttempt({
  required CustomerAuthAttempt? storedAttempt,
  required String? callbackState,
}) {
  if (storedAttempt == null ||
      storedAttempt.provider != CustomerAuthProvider.zalo ||
      callbackState == null ||
      callbackState.isEmpty ||
      callbackState != storedAttempt.state) {
    return null;
  }

  return storedAttempt;
}

extension on CustomerZaloAuthAdapter {
  bool _matchesSupportedCallback(Uri callbackUri) {
    if (CustomerAuthRedirectConfig.current.matches(callbackUri)) {
      return true;
    }

    if (!kIsWeb) {
      return false;
    }

    final provider =
        callbackUri.queryParameters['provider']?.trim().toLowerCase();
    return (callbackUri.scheme == 'http' || callbackUri.scheme == 'https') &&
        provider == 'zalo' &&
        callbackUri.queryParameters.containsKey('code');
  }
}
