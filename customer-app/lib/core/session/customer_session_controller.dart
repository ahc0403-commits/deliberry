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
  static final CustomerSessionStore _store = MemoryCustomerSessionStore();

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

  void restore() {
    final snapshot = _store.read();
    if (snapshot != null) {
      _status = snapshot.status;
      _phoneNumber = snapshot.phoneNumber;
    }
    _hydrated = true;
    notifyListeners();
  }

  void _persist() {
    if (_status == CustomerAuthStatus.signedOut) {
      _store.clear();
      return;
    }

    _store.write(
      CustomerSessionSnapshot(
        status: _status,
        phoneNumber: _phoneNumber,
      ),
    );
  }

  void startPhoneEntry() {
    _status = CustomerAuthStatus.signedOut;
    _persist();
    notifyListeners();
  }

  void requestOtp({
    String phoneNumber = '+0000000000',
  }) {
    _phoneNumber = phoneNumber;
    _status = CustomerAuthStatus.otpPending;
    _persist();
    notifyListeners();
  }

  void verifyOtp() {
    _status = CustomerAuthStatus.onboardingRequired;
    _persist();
    notifyListeners();
  }

  void completeOnboarding() {
    _status = CustomerAuthStatus.authenticated;
    _persist();
    notifyListeners();
  }

  void continueAsGuest() {
    _status = CustomerAuthStatus.guest;
    _persist();
    notifyListeners();
  }

  void signOut() {
    _phoneNumber = null;
    _status = CustomerAuthStatus.signedOut;
    _persist();
    notifyListeners();
  }
}
