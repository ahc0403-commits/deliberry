import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';

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

  static Future<CustomerAuthAttempt?> read() async {
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
    final preferences = await SharedPreferences.getInstance();
    await preferences.setString(
      _storageKey,
      jsonEncode({
        'provider': attempt.provider.name,
        'state': attempt.state,
        'codeVerifier': attempt.codeVerifier,
      }),
    );
  }

  static Future<void> clear() async {
    final preferences = await SharedPreferences.getInstance();
    await preferences.remove(_storageKey);
  }
}
