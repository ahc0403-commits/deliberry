import 'package:flutter/foundation.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../backend/runtime_backend_config.dart';
import '../supabase/supabase_client.dart';
import 'customer_auth_adapter.dart';

class CustomerSupabaseOAuthAdapter {
  const CustomerSupabaseOAuthAdapter();

  bool supports(CustomerAuthProvider provider) {
    return provider == CustomerAuthProvider.kakao;
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

    final oauthProvider = switch (provider) {
      CustomerAuthProvider.kakao => OAuthProvider.kakao,
      _ => OAuthProvider.kakao,
    };

    final redirectTo = kIsWeb
        ? Uri.base.origin
        : CustomerAuthRedirectConfig.current.callbackUri.toString();

    await client.auth.signInWithOAuth(
      oauthProvider,
      redirectTo: redirectTo,
    );

    return CustomerAuthStartResult(
      provider: provider,
      authorizationUri: kIsWeb ? Uri.parse(redirectTo) : CustomerAuthRedirectConfig.current.callbackUri,
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

  Future<CustomerAuthIdentity> completeAuthCallback(Uri callbackUri) async {
    if (!CustomerAuthRedirectConfig.current.matches(callbackUri)) {
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

    final currentUser = client.auth.currentUser;
    if (currentUser == null) {
      throw StateError(
        'Customer social auth callback did not create a usable Supabase session.',
      );
    }

    return _mapUser(currentUser);
  }

  Future<void> signOut() async {
    await CustomerSupabaseClient.ensureInitialized();
    final client = CustomerSupabaseClient.maybeClient;
    if (client == null) {
      return;
    }
    await client.auth.signOut();
  }

  CustomerAuthIdentity _mapUser(User user) {
    final appMetadata = user.appMetadata;
    final userMetadata = user.userMetadata;
    final actorType = (appMetadata['actor_type'] as String?) ??
        (userMetadata?['actor_type'] as String?) ??
        'customer';
    final displayName = (userMetadata?['display_name'] as String?)?.trim();
    final providerName = (appMetadata['provider'] as String?)?.toLowerCase();
    final provider = switch (providerName) {
      'kakao' => CustomerAuthProvider.kakao,
      _ => CustomerAuthProvider.kakao,
    };

    return CustomerAuthIdentity(
      actorId: user.id,
      actorType: actorType,
      provider: provider,
      displayName: displayName?.isEmpty == true ? null : displayName,
      phoneNumber: user.phone,
      needsOnboarding: (userMetadata?['needs_onboarding'] as bool?) ?? false,
    );
  }
}
