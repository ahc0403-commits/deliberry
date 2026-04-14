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

const customerAuthCompletionContractVersion = 'customer_auth_completion_v1';

enum CustomerAuthSessionTransport {
  existingSupabaseSession,
  refreshTokenExchange,
}

class CustomerAuthCallbackContract {
  const CustomerAuthCallbackContract({
    required this.originalUri,
    required this.normalizedUri,
    required this.provider,
    required this.hasAuthorizationCode,
    required this.hasProviderError,
    required this.hasSessionTokens,
  });

  final Uri originalUri;
  final Uri normalizedUri;
  final CustomerAuthProvider provider;
  final bool hasAuthorizationCode;
  final bool hasProviderError;
  final bool hasSessionTokens;

  bool get isInteractiveCallback =>
      hasAuthorizationCode || hasProviderError || hasSessionTokens;
}

class CustomerAuthCompletionResult {
  const CustomerAuthCompletionResult({
    required this.provider,
    required this.callback,
    required this.sessionTransport,
    this.refreshToken,
    this.accessToken,
    this.expiresInSeconds,
  });

  final CustomerAuthProvider provider;
  final CustomerAuthCallbackContract callback;
  final CustomerAuthSessionTransport sessionTransport;
  final String? refreshToken;
  final String? accessToken;
  final int? expiresInSeconds;

  bool get requiresSessionAdoption =>
      sessionTransport == CustomerAuthSessionTransport.refreshTokenExchange;
}

abstract class CustomerAuthAdapter {
  Future<CustomerAuthIdentity?> restoreAuthenticatedIdentity();
  Future<CustomerAuthStartResult> beginSignIn(CustomerAuthProvider provider);
  Future<CustomerAuthCompletionResult> completeAuthCallback(Uri callbackUri);
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

class CustomerZaloRedirectAuthority {
  const CustomerZaloRedirectAuthority._();

  static const expectedExchangePath = '/customer-zalo-auth-exchange';

  static String? validate(String redirectUri) {
    final trimmed = redirectUri.trim();
    if (trimmed.isEmpty) {
      return 'ZALO_REDIRECT_URI must not be empty.';
    }

    final uri = Uri.tryParse(trimmed);
    if (uri == null || !uri.hasScheme || uri.host.trim().isEmpty) {
      return 'ZALO_REDIRECT_URI must be an absolute URI.';
    }
    if (uri.scheme != 'https' && uri.scheme != 'http') {
      return 'ZALO_REDIRECT_URI must use http or https.';
    }
    if (uri.path != expectedExchangePath) {
      return 'ZALO_REDIRECT_URI must point to $expectedExchangePath.';
    }
    if (uri.queryParameters.isNotEmpty || uri.fragment.isNotEmpty) {
      return 'ZALO_REDIRECT_URI must not include query parameters or fragments.';
    }

    return null;
  }
}

CustomerAuthCallbackContract? detectCustomerAuthCallback(Uri uri) {
  final normalizedUri = _normalizeCustomerAuthCallbackUri(uri);
  final query = normalizedUri.queryParameters;
  final hasAuthorizationCode = query.containsKey('code');
  final hasProviderError =
      query.containsKey('error') || query.containsKey('error_description');
  final hasSessionTokens =
      query.containsKey('access_token') || query.containsKey('refresh_token');
  final provider = _resolveCallbackProvider(normalizedUri);

  if (provider == null ||
      (!hasAuthorizationCode && !hasProviderError && !hasSessionTokens)) {
    return null;
  }

  return CustomerAuthCallbackContract(
    originalUri: uri,
    normalizedUri: normalizedUri,
    provider: provider,
    hasAuthorizationCode: hasAuthorizationCode,
    hasProviderError: hasProviderError,
    hasSessionTokens: hasSessionTokens,
  );
}

bool hasPendingCustomerAuthCallback(Uri uri) {
  return detectCustomerAuthCallback(uri) != null;
}

Uri _normalizeCustomerAuthCallbackUri(Uri uri) {
  final query = <String, String>{...uri.queryParameters};
  final fragment = uri.fragment.trim();

  if (fragment.isNotEmpty) {
    if (fragment.contains('?')) {
      final fragmentQueryIndex = fragment.indexOf('?');
      if (fragmentQueryIndex >= 0 && fragmentQueryIndex < fragment.length - 1) {
        query.addAll(
          Uri.splitQueryString(fragment.substring(fragmentQueryIndex + 1)),
        );
      }
    } else if (fragment.contains('=')) {
      query.addAll(Uri.splitQueryString(fragment));
    }
  }

  return uri.replace(queryParameters: query);
}

CustomerAuthProvider? _resolveCallbackProvider(Uri uri) {
  if (CustomerAuthRedirectConfig.current.matches(uri)) {
    final providerName = uri.queryParameters['provider']?.trim().toLowerCase();
    if (providerName == 'zalo') {
      return CustomerAuthProvider.zalo;
    }
    return CustomerAuthProvider.kakao;
  }

  final isWebCallback = uri.scheme == 'http' || uri.scheme == 'https';
  if (!isWebCallback) {
    return null;
  }

  final providerName = uri.queryParameters['provider']?.trim().toLowerCase();
  if (providerName == 'zalo') {
    return CustomerAuthProvider.zalo;
  }

  if (uri.queryParameters.containsKey('code') ||
      uri.queryParameters.containsKey('error') ||
      uri.queryParameters.containsKey('error_description') ||
      uri.queryParameters.containsKey('access_token') ||
      uri.queryParameters.containsKey('refresh_token')) {
    return CustomerAuthProvider.kakao;
  }

  return null;
}
