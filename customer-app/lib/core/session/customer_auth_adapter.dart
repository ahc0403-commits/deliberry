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
  kakao,
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
  Future<CustomerAuthStartResult> beginSignIn(CustomerAuthProvider provider);
  Future<CustomerAuthIdentity> completeAuthCallback(Uri callbackUri);
  Future<void> signOut();
}

class CustomerIgnoredAuthCallback implements Exception {
  const CustomerIgnoredAuthCallback(this.message);

  final String message;

  @override
  String toString() => message;
}

class CustomerAuthRedirectConfig {
  const CustomerAuthRedirectConfig({
    required this.callbackScheme,
    required this.callbackHost,
    required this.callbackPath,
  });

  static const CustomerAuthRedirectConfig current = CustomerAuthRedirectConfig(
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

  final String callbackScheme;
  final String callbackHost;
  final String callbackPath;

  Uri get callbackUri => Uri(
        scheme: callbackScheme,
        host: callbackHost,
        path: callbackPath,
      );

  bool matches(Uri uri) {
    return uri.scheme == callbackScheme &&
        uri.host == callbackHost &&
        uri.path == callbackPath;
  }
}
