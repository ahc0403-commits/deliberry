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
  Future<CustomerAuthIdentity> completeAuthCallback(Uri callbackUri) async {
    if (callbackUri.queryParameters.containsKey('code') &&
        callbackUri.queryParameters.containsKey('provider')) {
      return zaloAdapter.completeAuthCallback(callbackUri);
    }

    try {
      return await socialAdapter.completeAuthCallback(callbackUri);
    } catch (_) {
      return zaloAdapter.completeAuthCallback(callbackUri);
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
