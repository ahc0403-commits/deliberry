import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';

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
  Future<CustomerSessionSnapshot?> read();
  Future<void> write(CustomerSessionSnapshot snapshot);
  Future<void> clear();
}

class SharedPreferencesCustomerSessionStore implements CustomerSessionStore {
  static const _storageKey = 'customer_session_snapshot_v1';

  @override
  Future<CustomerSessionSnapshot?> read() async {
    final preferences = await SharedPreferences.getInstance();
    final raw = preferences.getString(_storageKey);
    if (raw == null || raw.isEmpty) {
      return null;
    }

    try {
      final payload = jsonDecode(raw);
      if (payload is! Map<String, dynamic>) {
        await clear();
        return null;
      }

      final statusName = payload['status'];
      final phoneNumber = payload['phoneNumber'];
      if (statusName is! String) {
        await clear();
        return null;
      }

      final status =
          CustomerAuthStatus.values.where((value) => value.name == statusName);
      if (status.isEmpty) {
        await clear();
        return null;
      }

      return CustomerSessionSnapshot(
        status: status.first,
        phoneNumber: phoneNumber is String && phoneNumber.isNotEmpty
            ? phoneNumber
            : null,
      );
    } catch (_) {
      await clear();
      return null;
    }
  }

  @override
  Future<void> write(CustomerSessionSnapshot snapshot) async {
    final preferences = await SharedPreferences.getInstance();
    await preferences.setString(
      _storageKey,
      jsonEncode({
        'status': snapshot.status.name,
        'phoneNumber': snapshot.phoneNumber,
      }),
    );
  }

  @override
  Future<void> clear() async {
    final preferences = await SharedPreferences.getInstance();
    await preferences.remove(_storageKey);
  }
}
