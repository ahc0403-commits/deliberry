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

    final state = _randomToken();
    final codeVerifier = _randomToken(length: 64);
    final codeChallenge = _codeChallengeFor(codeVerifier);

    await CustomerAuthAttemptStore.write(
      CustomerAuthAttempt(
        provider: CustomerAuthProvider.zalo,
        state: state,
        codeVerifier: codeVerifier,
      ),
    );

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

    final launched = await launchUrl(
      authorizationUri,
      mode: kIsWeb ? LaunchMode.platformDefault : LaunchMode.externalApplication,
      webOnlyWindowName: kIsWeb ? '_self' : null,
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
    if (!CustomerAuthRedirectConfig.current.matches(callbackUri)) {
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
    final attempt = await CustomerAuthAttemptStore.read();
    if (attempt == null || attempt.provider != CustomerAuthProvider.zalo) {
      throw StateError(
        'Customer Zalo auth callback is missing the matching auth attempt.',
      );
    }
    if (state == null || state.isEmpty || state != attempt.state) {
      throw StateError(
        'Customer Zalo auth callback state did not match the pending auth attempt.',
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
        'code_verifier': attempt.codeVerifier,
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
