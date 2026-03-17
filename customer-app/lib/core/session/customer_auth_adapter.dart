import 'customer_session_controller.dart';

class CustomerAuthIdentity {
  const CustomerAuthIdentity({
    required this.actorId,
    required this.actorType,
    this.phoneNumber,
  });

  final String actorId;
  final String actorType;
  final String? phoneNumber;
}

class CustomerSessionSnapshot {
  const CustomerSessionSnapshot({
    required this.status,
    required this.identity,
  });

  final CustomerAuthStatus status;
  final CustomerAuthIdentity identity;
}

abstract class CustomerAuthAdapter {
  Future<CustomerSessionSnapshot?> restoreSession();
  Future<CustomerSessionSnapshot> requestOtp({required String phoneNumber});
  Future<CustomerSessionSnapshot> verifyOtp({required String otpCode});
  Future<CustomerSessionSnapshot> continueAsGuest();
  Future<void> signOut();
}
