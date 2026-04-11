import 'dart:convert';

import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import 'customer_session_controller.dart';

class CustomerSessionSnapshot {
  const CustomerSessionSnapshot({
    required this.status,
    this.phoneNumber,
    this.allowSupabaseRestore = false,
  });

  final CustomerAuthStatus status;
  final String? phoneNumber;
  final bool allowSupabaseRestore;
}

abstract class CustomerSessionStore {
  Future<CustomerSessionSnapshot?> read();
  Future<void> write(CustomerSessionSnapshot snapshot);
  Future<void> clear();
}

class SecureCustomerSessionStore implements CustomerSessionStore {
  static const _storageKey = 'customer_session_snapshot_v1';
  static const _storage = FlutterSecureStorage(
    aOptions: AndroidOptions(encryptedSharedPreferences: true),
    mOptions: MacOsOptions(useDataProtectionKeyChain: false),
    webOptions: WebOptions.defaultOptions,
  );

  @override
  Future<CustomerSessionSnapshot?> read() async {
    final raw = await _storage.read(key: _storageKey);
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
      final allowSupabaseRestore = payload['allowSupabaseRestore'];
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
        allowSupabaseRestore: allowSupabaseRestore is bool
            ? allowSupabaseRestore
            : status.first == CustomerAuthStatus.authenticated ||
                status.first == CustomerAuthStatus.onboardingRequired,
      );
    } catch (_) {
      await clear();
      return null;
    }
  }

  @override
  Future<void> write(CustomerSessionSnapshot snapshot) async {
    await _storage.write(
      key: _storageKey,
      value: jsonEncode({
        'status': snapshot.status.name,
        'phoneNumber': snapshot.phoneNumber,
        'allowSupabaseRestore': snapshot.allowSupabaseRestore,
      }),
    );
  }

  @override
  Future<void> clear() async {
    await _storage.delete(key: _storageKey);
  }
}
