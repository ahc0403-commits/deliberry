import 'customer_session_controller.dart';

class CustomerSessionSnapshot {
  const CustomerSessionSnapshot({
    required this.status,
    this.phoneNumber,
  });

  final CustomerAuthStatus status;
  final String? phoneNumber;
}

abstract class CustomerSessionStore {
  CustomerSessionSnapshot? read();
  void write(CustomerSessionSnapshot snapshot);
  void clear();
}

class MemoryCustomerSessionStore implements CustomerSessionStore {
  CustomerSessionSnapshot? _snapshot;

  @override
  CustomerSessionSnapshot? read() => _snapshot;

  @override
  void write(CustomerSessionSnapshot snapshot) {
    _snapshot = snapshot;
  }

  @override
  void clear() {
    _snapshot = null;
  }
}
