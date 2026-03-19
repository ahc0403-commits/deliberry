import 'package:flutter/foundation.dart';

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
  static final CustomerSessionStore _store =
      SharedPreferencesCustomerSessionStore();

  CustomerAuthStatus _status = CustomerAuthStatus.signedOut;
  String? _phoneNumber;
  bool _hydrated = false;

  CustomerAuthStatus get status => _status;
  String? get phoneNumber => _phoneNumber;
  bool get isHydrated => _hydrated;

  bool get isSignedIn => _status == CustomerAuthStatus.authenticated;
  bool get isGuest => _status == CustomerAuthStatus.guest;
  bool get isOtpPending => _status == CustomerAuthStatus.otpPending;
  bool get requiresOnboarding =>
      _status == CustomerAuthStatus.onboardingRequired;

  Future<void> restore() async {
    final snapshot = await _store.read();
    if (snapshot != null) {
      _status = snapshot.status;
      _phoneNumber = snapshot.phoneNumber;
    }
    _hydrated = true;
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
      ),
    );
  }

  Future<void> startPhoneEntry() async {
    _status = CustomerAuthStatus.signedOut;
    await _persist();
    notifyListeners();
  }

  Future<void> requestOtp({
    String phoneNumber = '+0000000000',
  }) async {
    _phoneNumber = phoneNumber;
    _status = CustomerAuthStatus.otpPending;
    await _persist();
    notifyListeners();
  }

  Future<void> verifyOtp() async {
    _status = CustomerAuthStatus.onboardingRequired;
    await _persist();
    notifyListeners();
  }

  Future<void> completeOnboarding() async {
    _status = CustomerAuthStatus.authenticated;
    await _persist();
    notifyListeners();
  }

  Future<void> continueAsGuest() async {
    _status = CustomerAuthStatus.guest;
    await _persist();
    notifyListeners();
  }

  Future<void> signOut() async {
    _phoneNumber = null;
    _status = CustomerAuthStatus.signedOut;
    await _persist();
    notifyListeners();
  }
}
