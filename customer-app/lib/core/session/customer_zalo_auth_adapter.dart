import 'package:supabase_flutter/supabase_flutter.dart';

import '../backend/runtime_backend_config.dart';
import '../supabase/supabase_client.dart';
import 'customer_auth_adapter.dart';

class CustomerZaloAuthAdapter implements CustomerAuthAdapter {
  const CustomerZaloAuthAdapter();

  static const _functionName = 'customer-zalo-auth-exchange';

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
            'Zalo auth config is missing. Set ZALO_APP_ID and callback scheme values.',
      );
    }

    return CustomerAuthStartResult(
      provider: CustomerAuthProvider.zalo,
      authorizationUri: CustomerAuthRedirectConfig.current.callbackUri,
      blockerCode: 'zalo_launch_pending',
      message:
          'Zalo callback wiring is ready, but provider launch still requires app credentials and native SDK/browser handoff.',
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

    await CustomerSupabaseClient.ensureInitialized();
    final client = CustomerSupabaseClient.maybeClient;
    if (client == null) {
      throw StateError(
        'Customer Supabase runtime is unavailable for Zalo auth exchange.',
      );
    }

    final response = await client.functions.invoke(
      _functionName,
      body: {
        'authorization_code': code,
        'redirect_uri': CustomerAuthRedirectConfig.current.callbackUri.toString(),
      },
    );

    final payload = response.data;
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
    required this.callbackScheme,
    required this.callbackHost,
    required this.callbackPath,
  });

  static const CustomerZaloAuthConfig current = CustomerZaloAuthConfig(
    appId: String.fromEnvironment('ZALO_APP_ID', defaultValue: ''),
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
  final String callbackScheme;
  final String callbackHost;
  final String callbackPath;

  bool get isConfigured => appId.trim().isNotEmpty;

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
