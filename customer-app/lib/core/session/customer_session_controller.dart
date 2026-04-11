import 'package:flutter/foundation.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../supabase/supabase_client.dart';
import 'customer_auth_adapter.dart';
import 'customer_multi_auth_adapter.dart';
import 'customer_session_store.dart';

enum CustomerAuthStatus {
  signedOut,
  otpPending,
  onboardingRequired,
  authenticated,
  guest,
}

class CustomerSessionController extends ChangeNotifier {
  CustomerSessionController._();

  static final CustomerSessionController instance =
      CustomerSessionController._();
  static final CustomerSessionStore _store = SecureCustomerSessionStore();
  static final CustomerAuthAdapter _authAdapter = CustomerMultiAuthAdapter();

  CustomerAuthStatus _status = CustomerAuthStatus.signedOut;
  String? _phoneNumber;
  CustomerAuthIdentity? _identity;
  String? _lastAuthError;
  bool _hydrated = false;

  CustomerAuthStatus get status => _status;
  String? get phoneNumber => _phoneNumber;
  CustomerAuthIdentity? get identity => _identity;
  String? get lastAuthError => _lastAuthError;
  bool get isHydrated => _hydrated;

  bool get isSignedIn => hasAuthenticatedSession;
  bool get isGuest => _status == CustomerAuthStatus.guest;
  bool get isOtpPending => _status == CustomerAuthStatus.otpPending;
  bool get requiresOnboarding =>
      _status == CustomerAuthStatus.onboardingRequired;
  bool get hasAuthenticatedSession =>
      _status == CustomerAuthStatus.authenticated;
  bool get hasSupabaseBackedSession => _identity != null;
  bool get hasRestorableSupabaseSession =>
      _status == CustomerAuthStatus.authenticated ||
      _status == CustomerAuthStatus.onboardingRequired;

  Future<void> restore() async {
    debugPrint('[CustomerSession] restore:start');
    var snapshot = await _store.read();
    final shouldRestoreAuthenticatedSession =
        snapshot?.allowSupabaseRestore == true &&
            (snapshot?.status == CustomerAuthStatus.authenticated ||
                snapshot?.status == CustomerAuthStatus.onboardingRequired);
    if (shouldRestoreAuthenticatedSession) {
      final authenticatedIdentity =
          await _authAdapter.restoreAuthenticatedIdentity();
      if (authenticatedIdentity != null) {
        debugPrint(
          '[CustomerSession] restore:authenticated actor=${authenticatedIdentity.actorId} needsOnboarding=${authenticatedIdentity.needsOnboarding}',
        );
        await _applyAuthenticatedIdentity(authenticatedIdentity, persist: false);
        _hydrated = true;
        notifyListeners();
        return;
      }
      await _store.clear();
      snapshot = null;
    } else {
      await _authAdapter.signOut();
    }

    if (snapshot != null) {
      _status = snapshot.status;
      _phoneNumber = snapshot.phoneNumber;
      debugPrint(
        '[CustomerSession] restore:snapshot status=${_status.name} phone=${_phoneNumber != null}',
      );
    }
    _hydrated = true;
    debugPrint('[CustomerSession] restore:done status=${_status.name}');
    notifyListeners();
  }

  Future<void> _persist() async {
    if (_status == CustomerAuthStatus.signedOut) {
      await _store.clear();
      return;
    }

    await _store.write(
      CustomerSessionSnapshot(
        status: _status,
        phoneNumber: _phoneNumber,
        allowSupabaseRestore: hasRestorableSupabaseSession,
      ),
    );
  }

  Future<void> startPhoneEntry() async {
    await _authAdapter.signOut();
    _identity = null;
    _lastAuthError = null;
    _phoneNumber = null;
    _status = CustomerAuthStatus.signedOut;
    await _persist();
    notifyListeners();
  }

  Future<CustomerAuthStartResult> beginSignIn(
    CustomerAuthProvider provider,
  ) async {
    _lastAuthError = null;
    notifyListeners();
    return _authAdapter.beginSignIn(provider);
  }

  Future<CustomerAuthStartResult> beginPrimarySignIn() async {
    return beginSignIn(CustomerAuthProvider.zalo);
  }

  Future<void> handleAuthCallback(Uri callbackUri) async {
    debugPrint('[CustomerSession] callback:start host=${callbackUri.host} path=${callbackUri.path} hasCode=${callbackUri.queryParameters.containsKey("code")}');
    try {
      final authenticatedIdentity =
          await _authAdapter.completeAuthCallback(callbackUri);
      debugPrint(
        '[CustomerSession] callback:identity actor=${authenticatedIdentity.actorId} needsOnboarding=${authenticatedIdentity.needsOnboarding}',
      );
      await _applyAuthenticatedIdentity(authenticatedIdentity);
      _lastAuthError = null;
      debugPrint('[CustomerSession] callback:status=${_status.name}');
      notifyListeners();
    } on CustomerIgnoredAuthCallback catch (ignored) {
      debugPrint('[CustomerSession] callback:ignored $ignored');
    } catch (error) {
      _lastAuthError = error.toString();
      debugPrint('[CustomerSession] callback:error $_lastAuthError');
      notifyListeners();
    }
  }

  Future<void> requestOtp({
    String phoneNumber = '+0000000000',
  }) async {
    _identity = null;
    _lastAuthError = null;
    _phoneNumber = phoneNumber;
    _status = CustomerAuthStatus.otpPending;
    await _persist();
    notifyListeners();
  }

  Future<void> verifyOtp() async {
    _identity = null;
    _lastAuthError = null;
    _status = CustomerAuthStatus.onboardingRequired;
    await _persist();
    notifyListeners();
  }

  Future<void> completeOnboarding() async {
    _status = CustomerAuthStatus.authenticated;
    await _persist();
    notifyListeners();

    // Best-effort: clear the remote needs_onboarding flag so future session
    // restores don't re-trigger onboarding. Failure is non-fatal because the
    // local snapshot already records authenticated status.
    try {
      final client = CustomerSupabaseClient.maybeClient;
      if (client?.auth.currentUser != null) {
        await client!.auth.updateUser(
          UserAttributes(data: {'needs_onboarding': false}),
        );
        debugPrint('[CustomerSession] completeOnboarding: remote flag cleared');
      }
    } catch (e) {
      debugPrint(
        '[CustomerSession] completeOnboarding: remote sync failed (non-fatal): $e',
      );
    }
  }

  Future<void> continueAsGuest() async {
    await _authAdapter.signOut();
    _identity = null;
    _lastAuthError = null;
    _phoneNumber = null;
    _status = CustomerAuthStatus.guest;
    await _persist();
    notifyListeners();
  }

  Future<void> signOut() async {
    debugPrint('[CustomerSession] signOut:start');
    await _authAdapter.signOut();
    _identity = null;
    _lastAuthError = null;
    _phoneNumber = null;
    _status = CustomerAuthStatus.signedOut;
    await _persist();
    debugPrint('[CustomerSession] signOut:done');
    notifyListeners();
  }

  Future<void> _applyAuthenticatedIdentity(
    CustomerAuthIdentity authenticatedIdentity, {
    bool persist = true,
  }) async {
    _identity = authenticatedIdentity;
    _phoneNumber = authenticatedIdentity.phoneNumber;

    // Determine effective onboarding requirement.
    // completeOnboarding() sets local status to authenticated but cannot update
    // the remote user metadata. If the locally-persisted session already shows
    // onboarding was completed (status == authenticated), don't let the stale
    // remote needs_onboarding flag re-trigger onboarding.
    var needsOnboarding = authenticatedIdentity.needsOnboarding;
    if (needsOnboarding) {
      final snapshot = await _store.read();
      if (snapshot?.status == CustomerAuthStatus.authenticated) {
        debugPrint(
          '[CustomerSession] applyIdentity: suppressing needsOnboarding (local onboarding already completed)',
        );
        needsOnboarding = false;
      }
    }

    _status = needsOnboarding
        ? CustomerAuthStatus.onboardingRequired
        : CustomerAuthStatus.authenticated;
    debugPrint(
      '[CustomerSession] applyIdentity status=${_status.name} persist=$persist provider=${authenticatedIdentity.provider.name}',
    );
    if (persist) {
      await _persist();
    }
  }
}
