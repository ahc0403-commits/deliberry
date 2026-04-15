import 'dart:convert';
import 'dart:math';

import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import 'customer_auth_adapter.dart';

class CustomerAuthAttempt {
  const CustomerAuthAttempt({
    required this.provider,
    required this.state,
    required this.codeVerifier,
  });

  final CustomerAuthProvider provider;
  final String state;
  final String codeVerifier;
}

class CustomerAuthAttemptStore {
  CustomerAuthAttemptStore._();

  static const _storageKey = 'customer_auth_attempt_v1';
  static const _consumedCallbackKey = 'customer_auth_consumed_callback_v1';
  static const _ttl = Duration(minutes: 10);
  static const _storage = FlutterSecureStorage(
    aOptions: AndroidOptions(encryptedSharedPreferences: true),
    mOptions: MacOsOptions(useDataProtectionKeyChain: false),
    webOptions: WebOptions.defaultOptions,
  );

  static Future<CustomerAuthAttempt?> read() async {
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

      final createdAtMs = payload['createdAt'];
      if (createdAtMs is int) {
        final age = DateTime.now().millisecondsSinceEpoch - createdAtMs;
        if (age > _ttl.inMilliseconds) {
          await clear();
          return null;
        }
      }

      final providerName = payload['provider'];
      final state = payload['state'];
      final codeVerifier = payload['codeVerifier'];
      if (providerName is! String ||
          state is! String ||
          codeVerifier is! String ||
          state.isEmpty ||
          codeVerifier.isEmpty) {
        await clear();
        return null;
      }

      final provider = CustomerAuthProvider.values.where(
        (value) => value.name == providerName,
      );
      if (provider.isEmpty) {
        await clear();
        return null;
      }

      return CustomerAuthAttempt(
        provider: provider.first,
        state: state,
        codeVerifier: codeVerifier,
      );
    } catch (_) {
      await clear();
      return null;
    }
  }

  static Future<void> write(CustomerAuthAttempt attempt) async {
    await _storage.write(
      key: _storageKey,
      value: jsonEncode({
        'provider': attempt.provider.name,
        'state': attempt.state,
        'codeVerifier': attempt.codeVerifier,
        'createdAt': DateTime.now().millisecondsSinceEpoch,
      }),
    );
  }

  static Future<bool> isConsumedCallback(String fingerprint) async {
    final consumed = await _storage.read(key: _consumedCallbackKey);
    return consumed == fingerprint;
  }

  static Future<void> markCallbackConsumed(String fingerprint) async {
    await _storage.write(key: _consumedCallbackKey, value: fingerprint);
  }

  static Future<void> clearConsumedCallback() async {
    await _storage.delete(key: _consumedCallbackKey);
  }

  static Future<void> clearAll() async {
    await _storage.delete(key: _storageKey);
    await _storage.delete(key: _consumedCallbackKey);
  }

  static Future<void> clear() async {
    await _storage.delete(key: _storageKey);
  }
}

String customerAuthCallbackFingerprint({
  required CustomerAuthProvider provider,
  required String? code,
  required String? state,
  required String? error,
  required String? errorDescription,
}) {
  final random = Random.secure();
  final normalizedCode = code?.trim() ?? '';
  final normalizedState = state?.trim() ?? '';
  final normalizedError = error?.trim() ?? '';
  final normalizedErrorDescription = errorDescription?.trim() ?? '';

  if (normalizedCode.isEmpty &&
      normalizedState.isEmpty &&
      normalizedError.isEmpty &&
      normalizedErrorDescription.isEmpty) {
    return '${provider.name}-empty-${random.nextInt(1 << 32)}';
  }

  return [
    provider.name,
    normalizedCode,
    normalizedState,
    normalizedError,
    normalizedErrorDescription,
  ].join('|');
}
