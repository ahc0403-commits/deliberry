import 'package:flutter/foundation.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

/// Placeholder external sales recording service.
///
/// Records completed/cancelled order events to Supabase for analytics.
/// Currently a no-op stub — will be wired to the real RPC once the
/// backend integration is live.
class ExternalSalesService {
  ExternalSalesService(this._client);

  final SupabaseClient _client;

  Future<void> recordCompleted({
    required String restaurantId,
    required String orderId,
    required int grossAmount,
    required int discountAmount,
    required int deliveryFee,
    required String paymentMethod,
    required String? customerId,
    required List<Map<String, dynamic>> items,
  }) async {
    debugPrint(
      '[ExternalSales] recordCompleted order=$orderId (stub, not yet wired)',
    );
  }

  Future<void> recordCancelled({
    required String restaurantId,
    required String orderId,
    required int grossAmount,
    required String reason,
  }) async {
    debugPrint(
      '[ExternalSales] recordCancelled order=$orderId (stub, not yet wired)',
    );
  }
}
