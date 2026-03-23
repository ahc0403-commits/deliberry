class CustomerRuntimeObservabilityService {
  const CustomerRuntimeObservabilityService();

  Future<void> recordEvent({
    required String layer,
    required String operation,
    required String outcome,
    String? traceId,
    String? attemptSource,
    String? failureClass,
    String? actorType,
    String? storeId,
    String? orderId,
    int? itemCount,
    String? paymentMethod,
    String? resourceType,
    String? resourceScope,
    int? durationMs,
    Map<String, dynamic>? metadata,
  }) async {}

  static String classifyRuntimeFailure(Object error) {
    final message = error.toString().toLowerCase();
    if (message.contains('auth')) {
      return 'auth_missing';
    }
    if (message.contains('row level security') || message.contains('rls')) {
      return 'rls_denied';
    }
    if (message.contains('membership')) {
      return 'membership_denied';
    }
    return 'unknown';
  }
}
