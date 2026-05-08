import 'package:flutter/foundation.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../backend/runtime_backend_config.dart';
import '../supabase/supabase_client.dart';
import 'customer_auth_adapter.dart';

class CustomerSupabaseOAuthAdapter {
  const CustomerSupabaseOAuthAdapter();

  bool supports(CustomerAuthProvider provider) {
    return switch (provider) {
      CustomerAuthProvider.kakao ||
      CustomerAuthProvider.google ||
      CustomerAuthProvider.apple =>
        true,
      CustomerAuthProvider.zalo || CustomerAuthProvider.phone => false,
    };
  }

  Future<CustomerAuthStartResult> beginSignIn(
    CustomerAuthProvider provider,
  ) async {
    if (!supports(provider)) {
      return CustomerAuthStartResult(
        provider: provider,
        blockerCode: 'provider_not_supported',
        message: 'Unsupported auth provider: $provider',
      );
    }

    if (!RuntimeBackendConfig.current.isConfigured) {
      return CustomerAuthStartResult(
        provider: provider,
        blockerCode: 'supabase_runtime_unconfigured',
        message:
            'Customer Supabase runtime config is missing. Set SUPABASE_URL and SUPABASE_ANON_KEY.',
      );
    }

    await CustomerSupabaseClient.ensureInitialized();
    final client = CustomerSupabaseClient.maybeClient;
    if (client == null) {
      return CustomerAuthStartResult(
        provider: provider,
        blockerCode: 'supabase_runtime_unavailable',
        message: 'Customer Supabase runtime is unavailable.',
      );
    }

    final oauthProvider = _toSupabaseProvider(provider);

    final redirectTo = _redirectUriFor(provider).toString();

    await client.auth.signInWithOAuth(
      oauthProvider,
      redirectTo: redirectTo,
    );

    return CustomerAuthStartResult(
      provider: provider,
      authorizationUri:
          kIsWeb ? null : CustomerAuthRedirectConfig.current.callbackUri,
    );
  }

  Future<CustomerAuthIdentity?> restoreAuthenticatedIdentity() async {
    await CustomerSupabaseClient.ensureInitialized();
    final user = CustomerSupabaseClient.maybeClient?.auth.currentUser;
    if (user == null) {
      return null;
    }
    return _mapUser(user);
  }

  Future<CustomerAuthCompletionResult> completeAuthCallback(
    Uri callbackUri,
  ) async {
    final callback = detectCustomerAuthCallback(callbackUri);
    if (callback == null || !supports(callback.provider)) {
      throw StateError(
        'Customer auth callback did not match the configured callback URI.',
      );
    }

    final providerError = callbackUri.queryParameters['error_description'] ??
        callbackUri.queryParameters['error'];
    if (providerError != null && providerError.trim().isNotEmpty) {
      throw StateError('Customer social auth callback failed: $providerError');
    }

    await CustomerSupabaseClient.ensureInitialized();
    final client = CustomerSupabaseClient.maybeClient;
    if (client == null) {
      throw StateError('Customer Supabase runtime is unavailable.');
    }

    var currentUser = client.auth.currentUser;
    final authorizationCode = callbackUri.queryParameters['code']?.trim();
    if (currentUser == null &&
        authorizationCode != null &&
        authorizationCode.isNotEmpty) {
      await client.auth.exchangeCodeForSession(authorizationCode);
      currentUser = client.auth.currentUser;
    }

    if (currentUser == null) {
      throw StateError(
        'Customer social auth callback did not create a usable Supabase session.',
      );
    }

    final identity = _mapUser(currentUser);
    if (identity == null) {
      throw StateError(
        'Customer social auth callback resolved to an unsupported provider identity.',
      );
    }

    return CustomerAuthCompletionResult(
      provider: callback.provider,
      callback: callback,
      sessionTransport: CustomerAuthSessionTransport.existingSupabaseSession,
    );
  }

  Future<void> signOut() async {
    await CustomerSupabaseClient.ensureInitialized();
    final client = CustomerSupabaseClient.maybeClient;
    if (client == null) {
      return;
    }
    await client.auth.signOut();
  }

  CustomerAuthIdentity? _mapUser(User user) {
    final appMetadata = user.appMetadata;
    final userMetadata = user.userMetadata;
    final actorType = (appMetadata['actor_type'] as String?) ??
        (userMetadata?['actor_type'] as String?) ??
        'customer';
    final displayName = (userMetadata?['display_name'] as String?)?.trim();
    final provider = _resolveSupabaseIdentityProvider(appMetadata);
    if (provider == null) {
      return null;
    }

    return CustomerAuthIdentity(
      actorId: user.id,
      actorType: actorType,
      provider: provider,
      displayName: _resolveDisplayName(userMetadata, displayName),
      phoneNumber: user.phone,
      needsOnboarding: (userMetadata?['needs_onboarding'] as bool?) ?? false,
    );
  }

  OAuthProvider _toSupabaseProvider(CustomerAuthProvider provider) {
    return switch (provider) {
      CustomerAuthProvider.kakao => OAuthProvider.kakao,
      CustomerAuthProvider.google => OAuthProvider.google,
      CustomerAuthProvider.apple => OAuthProvider.apple,
      CustomerAuthProvider.zalo ||
      CustomerAuthProvider.phone =>
        throw StateError('Unsupported Supabase OAuth provider: $provider'),
    };
  }

  Uri _redirectUriFor(CustomerAuthProvider provider) {
    if (kIsWeb) {
      final current = Uri.base;
      final query = <String, String>{
        ...current.queryParameters,
        'provider': provider.name,
      };
      return current.replace(queryParameters: query, fragment: '');
    }

    return CustomerAuthRedirectConfig.current.callbackUri.replace(
      queryParameters: {'provider': provider.name},
    );
  }

  CustomerAuthProvider? _resolveSupabaseIdentityProvider(
    Map<String, dynamic> appMetadata,
  ) {
    final providerName = (appMetadata['provider'] as String?)?.toLowerCase();
    return switch (providerName) {
      'kakao' => CustomerAuthProvider.kakao,
      'google' => CustomerAuthProvider.google,
      'apple' => CustomerAuthProvider.apple,
      _ => null,
    };
  }

  String? _resolveDisplayName(
    Map<String, dynamic>? userMetadata,
    String? displayName,
  ) {
    final candidates = [
      displayName,
      userMetadata?['full_name'] as String?,
      userMetadata?['name'] as String?,
      userMetadata?['preferred_username'] as String?,
    ];

    for (final candidate in candidates) {
      final trimmed = candidate?.trim();
      if (trimmed != null && trimmed.isNotEmpty) {
        return trimmed;
      }
    }

    return null;
  }
}
