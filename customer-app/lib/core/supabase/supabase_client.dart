import 'package:supabase_flutter/supabase_flutter.dart';

import '../backend/runtime_backend_config.dart';

class CustomerSupabaseClient {
  CustomerSupabaseClient._();

  static bool _initialized = false;

  static SupabaseClient? get maybeClient {
    if (!_initialized || !RuntimeBackendConfig.current.isConfigured) {
      return null;
    }
    return Supabase.instance.client;
  }

  static Future<void> ensureInitialized() async {
    if (_initialized || !RuntimeBackendConfig.current.isConfigured) {
      return;
    }

    await Supabase.initialize(
      url: RuntimeBackendConfig.current.url,
      anonKey: RuntimeBackendConfig.current.anonKey,
    );
    _initialized = true;
  }
}
