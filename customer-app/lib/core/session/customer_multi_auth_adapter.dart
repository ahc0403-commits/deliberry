import 'customer_auth_adapter.dart';
import 'customer_supabase_oauth_adapter.dart';
import 'customer_zalo_auth_adapter.dart';

class CustomerMultiAuthAdapter implements CustomerAuthAdapter {
  const CustomerMultiAuthAdapter({
    this.socialAdapter = const CustomerSupabaseOAuthAdapter(),
    this.zaloAdapter = const CustomerZaloAuthAdapter(),
  });

  final CustomerSupabaseOAuthAdapter socialAdapter;
  final CustomerZaloAuthAdapter zaloAdapter;

  @override
  Future<CustomerAuthStartResult> beginSignIn(
    CustomerAuthProvider provider,
  ) async {
    if (socialAdapter.supports(provider)) {
      return socialAdapter.beginSignIn(provider);
    }
    if (provider == CustomerAuthProvider.zalo) {
      return zaloAdapter.beginSignIn(provider);
    }
    return CustomerAuthStartResult(
      provider: provider,
      blockerCode: 'provider_not_supported',
      message: 'Unsupported auth provider: $provider',
    );
  }

  @override
  Future<CustomerAuthCompletionResult> completeAuthCallback(
    Uri callbackUri,
  ) async {
    final callback = detectCustomerAuthCallback(callbackUri);
    if (callback == null) {
      throw StateError(
        'Customer auth callback did not match the normalized callback contract.',
      );
    }

    switch (callback.provider) {
      case CustomerAuthProvider.zalo:
        return zaloAdapter.completeAuthCallback(callback.normalizedUri);
      case CustomerAuthProvider.kakao:
        return socialAdapter.completeAuthCallback(callback.normalizedUri);
      case CustomerAuthProvider.phone:
        throw StateError(
          'Customer phone auth does not use the social auth callback contract.',
        );
    }
  }

  @override
  Future<CustomerAuthIdentity?> restoreAuthenticatedIdentity() async {
    final socialIdentity = await socialAdapter.restoreAuthenticatedIdentity();
    if (socialIdentity != null) {
      return socialIdentity;
    }
    return zaloAdapter.restoreAuthenticatedIdentity();
  }

  @override
  Future<void> signOut() async {
    await socialAdapter.signOut();
    await zaloAdapter.signOut();
  }
}
