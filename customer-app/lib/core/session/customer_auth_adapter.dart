class CustomerAuthIdentity {
  const CustomerAuthIdentity({
    required this.actorId,
    required this.actorType,
    required this.provider,
    this.displayName,
    this.phoneNumber,
    this.needsOnboarding = false,
  });

  final String actorId;
  final String actorType;
  final CustomerAuthProvider provider;
  final String? displayName;
  final String? phoneNumber;
  final bool needsOnboarding;
}

enum CustomerAuthProvider {
  zalo,
  phone,
}

class CustomerAuthStartResult {
  const CustomerAuthStartResult({
    required this.provider,
    this.authorizationUri,
    this.blockerCode,
    this.message,
  });

  final CustomerAuthProvider provider;
  final Uri? authorizationUri;
  final String? blockerCode;
  final String? message;

  bool get isReady => blockerCode == null;
}

abstract class CustomerAuthAdapter {
  Future<CustomerAuthIdentity?> restoreAuthenticatedIdentity();
  Future<CustomerAuthStartResult> beginPrimarySignIn();
  Future<CustomerAuthIdentity> completeAuthCallback(Uri callbackUri);
  Future<void> signOut();
}
