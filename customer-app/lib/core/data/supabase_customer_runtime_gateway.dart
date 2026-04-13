import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../session/customer_session_controller.dart';
import '../supabase/supabase_client.dart';
import '../theme/app_theme.dart';
import 'customer_runtime_observability_service.dart';
import 'customer_runtime_gateway.dart';
import 'customer_runtime_controller.dart';
import 'mock_data.dart';

class SupabaseCustomerRuntimeGateway implements CustomerRuntimeGateway {
  const SupabaseCustomerRuntimeGateway();

  static const int _defaultOrderReadLimit = 20;
  static const int _defaultAddressReadLimit = 20;
  static const int _maxReviewHydrationBatchSize = 50;

  String _resolveActorType(User user) {
    final appMetadata = user.appMetadata;
    final userMetadata = user.userMetadata;
    return (appMetadata['actor_type'] as String?) ??
        (userMetadata?['actor_type'] as String?) ??
        (user.phone != null ? 'customer' : 'guest');
  }

  @override
  Future<List<CustomerOrderRecord>> readActiveOrders({
    int limit = _defaultOrderReadLimit,
    CustomerOrderReadCursor? cursor,
  }) async {
    return _readOrdersForStatuses(
      const [
        'pending',
        'confirmed',
        'preparing',
        'ready',
        'in_transit',
      ],
      limit: limit,
      cursor: cursor,
    );
  }

  @override
  Future<List<CustomerOrderRecord>> readPastOrders({
    int limit = _defaultOrderReadLimit,
    CustomerOrderReadCursor? cursor,
  }) async {
    return _readOrdersForStatuses(
      const [
        'delivered',
        'cancelled',
        'disputed',
      ],
      limit: limit,
      cursor: cursor,
    );
  }

  @override
  Future<List<MockAddress>> readAddresses({
    int limit = _defaultAddressReadLimit,
  }) async {
    final client = await _requireClient();
    final user = client?.auth.currentUser;
    if (client == null || user == null) {
      throw StateError('Customer Supabase session is unavailable.');
    }

    final response = await client
        .from('customer_addresses')
        .select('id, label, street, detail, is_default')
        .eq('customer_actor_id', user.id)
        .order('is_default', ascending: false)
        .order('created_at', ascending: true)
        .limit(limit);

    return List<Map<String, dynamic>>.from(response).map((row) {
      return MockAddress(
        id: row['id'] as String? ?? 'addr-unavailable',
        label: row['label'] as String? ?? 'Address',
        street: row['street'] as String? ?? '',
        detail: row['detail'] as String? ?? '',
        isDefault: row['is_default'] as bool? ?? false,
      );
    }).toList();
  }

  @override
  Future<CustomerSettingsPreferences> readSettingsPreferences() async {
    final client = await _requireClient();
    final user = client?.auth.currentUser;
    if (client == null || user == null) {
      throw StateError('Customer Supabase session is unavailable.');
    }

    final response = await client
        .from('actor_profiles')
        .select('preferences_json')
        .eq('id', user.id)
        .maybeSingle();

    if (response == null) {
      return const CustomerSettingsPreferences(
        notificationsEnabled: true,
        darkModeEnabled: false,
      );
    }

    final row = Map<String, dynamic>.from(response);
    final preferences =
        Map<String, dynamic>.from(row['preferences_json'] as Map? ?? const {});

    return CustomerSettingsPreferences(
      notificationsEnabled:
          preferences['notifications_enabled'] as bool? ?? true,
      darkModeEnabled: preferences['dark_mode_enabled'] as bool? ?? false,
    );
  }

  @override
  Future<CustomerProfileIdentity> readProfileIdentity() async {
    final client = await _requireClient();
    final user = client?.auth.currentUser;
    if (client == null || user == null) {
      throw StateError('Customer Supabase session is unavailable.');
    }

    final response = await client
        .from('actor_profiles')
        .select('display_name')
        .eq('id', user.id)
        .maybeSingle();

    final row = response == null ? null : Map<String, dynamic>.from(response);
    final displayName = row?['display_name'] as String?;

    return CustomerProfileIdentity(
      displayName: displayName?.trim().isEmpty == true ? null : displayName,
    );
  }

  @override
  Future<CustomerProfileIdentity> saveProfileIdentity(
    CustomerProfileIdentity input,
  ) async {
    final client = await _requireClient();
    final user = client?.auth.currentUser;
    if (client == null || user == null) {
      throw StateError('Customer Supabase session is unavailable.');
    }

    final normalizedDisplayName = input.displayName?.trim();
    final response = await client
        .from('actor_profiles')
        .upsert({
          'id': user.id,
          'actor_type': _resolveActorType(user),
          'display_name': normalizedDisplayName?.isEmpty == true
              ? null
              : normalizedDisplayName,
          'phone_number': user.phone,
        })
        .select('display_name')
        .single();

    final row = Map<String, dynamic>.from(response);
    final displayName = row['display_name'] as String?;

    return CustomerProfileIdentity(
      displayName: displayName?.trim().isEmpty == true ? null : displayName,
    );
  }

  @override
  Future<CustomerOrderReview?> readOrderReview(String orderId) async {
    final client = await _requireClient();
    final user = client?.auth.currentUser;
    if (client == null || user == null) {
      throw StateError('Customer Supabase session is unavailable.');
    }

    final response = await client
        .from('customer_reviews')
        .select('order_id, store_id, rating, review_text, tags_json')
        .eq('customer_actor_id', user.id)
        .eq('order_id', orderId)
        .maybeSingle();

    if (response == null) {
      return null;
    }

    final row = Map<String, dynamic>.from(response);
    return CustomerOrderReview(
      orderId: row['order_id'] as String? ?? orderId,
      storeId: row['store_id'] as String? ?? '',
      rating: (row['rating'] as num?)?.toInt() ?? 0,
      reviewText: row['review_text'] as String? ?? '',
      tags: (row['tags_json'] as List?)?.whereType<String>().toList() ??
          const <String>[],
    );
  }

  @override
  Future<Map<String, CustomerOrderReview>> readOrderReviewsBatch(
    Iterable<String> orderIds,
  ) async {
    final normalizedOrderIds = orderIds
        .map((orderId) => orderId.trim())
        .where((orderId) => orderId.isNotEmpty)
        .toSet()
        .toList();
    if (normalizedOrderIds.isEmpty) {
      return const <String, CustomerOrderReview>{};
    }
    if (normalizedOrderIds.length > _maxReviewHydrationBatchSize) {
      throw ArgumentError.value(
        normalizedOrderIds.length,
        'orderIds',
        'Customer review hydration batch exceeded $_maxReviewHydrationBatchSize order ids.',
      );
    }

    final client = await _requireClient();
    final user = client?.auth.currentUser;
    if (client == null || user == null) {
      throw StateError('Customer Supabase session is unavailable.');
    }

    final response = await client
        .from('customer_reviews')
        .select('order_id, store_id, rating, review_text, tags_json')
        .eq('customer_actor_id', user.id)
        .inFilter('order_id', normalizedOrderIds);

    final rows = List<Map<String, dynamic>>.from(response);
    final reviews = <String, CustomerOrderReview>{};

    for (final row in rows) {
      final orderId = row['order_id'] as String?;
      if (orderId == null || orderId.isEmpty) {
        continue;
      }

      reviews[orderId] = CustomerOrderReview(
        orderId: orderId,
        storeId: row['store_id'] as String? ?? '',
        rating: (row['rating'] as num?)?.toInt() ?? 0,
        reviewText: row['review_text'] as String? ?? '',
        tags: (row['tags_json'] as List?)?.whereType<String>().toList() ??
            const <String>[],
      );
    }

    return reviews;
  }

  @override
  Future<CustomerOrderReview> saveOrderReview(CustomerOrderReview input) async {
    final client = await _requireClient();
    final user = client?.auth.currentUser;
    if (client == null || user == null) {
      throw StateError('Customer Supabase session is unavailable.');
    }

    final response = await client.rpc(
      'upsert_customer_review_with_store_projection',
      params: {
        'p_order_id': input.orderId,
        'p_actor_id': user.id,
        'p_rating': input.rating,
        'p_review_text': input.reviewText.trim(),
        'p_tags_json': input.tags,
      },
    );

    final row = Map<String, dynamic>.from(response as Map);
    return CustomerOrderReview(
      orderId: row['order_id'] as String? ?? input.orderId,
      storeId: row['store_id'] as String? ?? input.storeId,
      rating: (row['rating'] as num?)?.toInt() ?? input.rating,
      reviewText: row['review_text'] as String? ?? input.reviewText,
      tags: (row['tags_json'] as List?)?.whereType<String>().toList() ??
          input.tags,
    );
  }

  @override
  @Deprecated(
    'Internal-only masked export primitive. Do not treat as an approved external LLM outbound path. '
    'Use CustomerExternalLlmExportService instead.',
  )
  Future<Map<String, dynamic>> exportMaskedOrderBundleForExternalLlm({
    String profile = 'external_llm_retrieval',
  }) async {
    final client = await _requireClient();
    final user = client?.auth.currentUser;
    if (client == null || user == null) {
      throw StateError('Customer Supabase session is unavailable.');
    }

    final response = await client.rpc(
      'export_masked_customer_order_bundle_for_llm',
      params: {
        'p_actor_id': user.id,
        'p_profile': profile,
      },
    );

    return Map<String, dynamic>.from(response as Map);
  }

  Future<SupabaseClient?> _requireClient() async {
    await CustomerSupabaseClient.ensureInitialized();
    return CustomerSupabaseClient.maybeClient;
  }

  Future<List<CustomerOrderRecord>> _readOrdersForStatuses(
    List<String> statuses, {
    int limit = _defaultOrderReadLimit,
    CustomerOrderReadCursor? cursor,
  }) async {
    final client = await _requireClient();
    final user = client?.auth.currentUser;
    if (client == null || user == null) {
      throw StateError('Customer Supabase session is unavailable.');
    }

    var query = client.from('orders').select('''
          id,
          order_number,
          store_id,
          customer_name,
          customer_phone,
          status,
          payment_status,
          payment_method,
          total_centavos,
          created_at,
          updated_at,
          estimated_delivery_at,
          delivery_address,
          notes,
          subtotal_centavos,
          delivery_fee_centavos,
          line_items_summary,
          confirmed_at,
          preparing_at,
          ready_at,
          picked_up_at,
          delivered_at,
          cancelled_at,
          disputed_at
        ''').eq('customer_actor_id', user.id).inFilter('status', statuses);

    if (cursor != null) {
      query = query.or(_buildDescendingCursorFilter(cursor));
    }

    final response = await query
        .order('created_at', ascending: false)
        .order('id', ascending: false)
        .limit(limit);

    final rows = List<Map<String, dynamic>>.from(response);
    return rows.map(_mapPersistedOrderRecord).toList();
  }

  String _buildOrderNumber(DateTime now) {
    final suffix =
        (now.microsecondsSinceEpoch % 100000).toString().padLeft(5, '0');
    return '#$suffix';
  }

  String _resolveCustomerName(User user, String fallbackPhone) {
    final metadata = user.userMetadata;
    final displayName = metadata?['display_name'];
    if (displayName is String && displayName.trim().isNotEmpty) {
      return displayName.trim();
    }

    final maskedPhone = fallbackPhone.length >= 4
        ? 'Customer ${fallbackPhone.substring(fallbackPhone.length - 4)}'
        : 'Customer';
    return maskedPhone;
  }

  CustomerOrderRecord _mapPersistedOrderRecord(Map<String, dynamic> row) {
    final storeId = row['store_id'] as String?;
    final store = _resolveStore(
      storeId,
      row['store_name'] as String?,
    );
    final items = _mapLineItems(row['line_items_summary'], store.id);
    final address = _mapAddress(row['delivery_address'] as String?);
    final status = (row['status'] as String?) ?? 'pending';
    final createdAt = (row['created_at'] as String?) ??
        DateTime.now().toUtc().toIso8601String();
    final estimatedDeliveryAt = row['estimated_delivery_at'] as String?;
    final totalCentavos = (row['total_centavos'] as num?)?.toInt() ?? 0;
    final subtotalCentavos = (row['subtotal_centavos'] as num?)?.toInt() ?? 0;
    final deliveryFeeCentavos =
        (row['delivery_fee_centavos'] as num?)?.toInt() ?? 0;
    final serviceFeeCentavos =
        (totalCentavos - subtotalCentavos - deliveryFeeCentavos)
            .clamp(0, totalCentavos);
    final itemCount = (row['item_count'] as num?)?.toInt() ??
        items.fold<int>(0, (sum, item) => sum + item.quantity);
    final order = MockOrder(
      id: (row['id'] as String?) ?? 'order-unavailable',
      storeName: (row['store_name'] as String?) ?? store.name,
      status: status,
      total: totalCentavos,
      itemCount: itemCount,
      createdAt: createdAt,
      statusColor: _statusColor(status),
    );

    return CustomerOrderRecord(
      order: order,
      store: store,
      items: items,
      address: address,
      instructions: (row['notes'] as String?) ?? '',
      paymentLabel: _paymentLabel((row['payment_method'] as String?) ?? 'cash'),
      paymentStatusLabel:
          _paymentStatusLabel((row['payment_status'] as String?) ?? 'pending'),
      statusHeadline: _statusHeadline(status),
      etaLabel: _etaLabel(status, estimatedDeliveryAt),
      milestones: _buildMilestones(
        createdAt: createdAt,
        confirmedAt: row['confirmed_at'] as String?,
        preparingAt: row['preparing_at'] as String?,
        readyAt: row['ready_at'] as String?,
        pickedUpAt: row['picked_up_at'] as String?,
        deliveredAt: row['delivered_at'] as String?,
        cancelledAt: row['cancelled_at'] as String?,
        disputedAt: row['disputed_at'] as String?,
        status: status,
      ),
      isActive: const [
        'pending',
        'confirmed',
        'preparing',
        'ready',
        'in_transit',
      ].contains(status),
      subtotalCentavos: subtotalCentavos,
      deliveryFeeCentavos: deliveryFeeCentavos,
      serviceFeeCentavos: serviceFeeCentavos,
    );
  }

  MockStore _resolveStore(String? storeId, String? storeName) {
    final runtimeStore =
        CustomerRuntimeController.instance.findPersistedStoreById(storeId);
    if (runtimeStore != null) {
      return runtimeStore;
    }

    return MockStore(
      id: storeId ?? 'persisted-store',
      name: storeName ?? 'Saved store',
      cuisine: 'Saved order',
      rating: 4.7,
      reviewCount: 0,
      deliveryTime: '30-40 min',
      deliveryFee: 299,
      imageColor: AppTheme.primaryColor,
      distance: 'Saved',
    );
  }

  List<MockCartItem> _mapLineItems(dynamic rawLineItems, String storeId) {
    if (rawLineItems is! List) {
      return const [];
    }

    return rawLineItems.whereType<Map>().map((item) {
      final name =
          item['name'] is String ? item['name'] as String : 'Order item';
      final quantity = (item['quantity'] as num?)?.toInt() ?? 1;
      final unitPriceCentavos =
          (item['unit_price_centavos'] as num?)?.toInt() ?? 0;
      final modifiers =
          (item['modifiers'] as List?)?.whereType<String>().toList() ??
              const <String>[];

      final matchedMenuItem =
          CustomerRuntimeController.instance.findPersistedMenuItemByName(
        storeId,
        name,
      );
      final menuItem = matchedMenuItem ??
          MockMenuItem(
            id: 'persisted-$name',
            name: name,
            description: 'Persisted order item',
            price: unitPriceCentavos,
            category: 'Saved order',
            imageColor: AppTheme.secondaryColor,
          );

      return MockCartItem(
        menuItem: menuItem,
        quantity: quantity,
        modifiers: modifiers,
      );
    }).toList();
  }

  MockAddress _mapAddress(String? deliveryAddress) {
    if (deliveryAddress == null || deliveryAddress.trim().isEmpty) {
      return const MockAddress(
        id: 'addr-persisted',
        label: 'Delivery',
        street: 'Saved delivery address',
        detail: '',
      );
    }

    final parts = deliveryAddress.split(',');
    final street = parts.first.trim();
    final detail = parts.length > 1 ? parts.sublist(1).join(',').trim() : '';

    return MockAddress(
      id: 'addr-${street.hashCode}',
      label: 'Delivery',
      street: street,
      detail: detail,
    );
  }

  Color _statusColor(String status) {
    switch (status) {
      case 'pending':
      case 'confirmed':
      case 'preparing':
      case 'ready':
        return AppTheme.primaryColor;
      case 'in_transit':
        return AppTheme.secondaryColor;
      case 'delivered':
        return AppTheme.successColor;
      case 'cancelled':
      case 'disputed':
        return AppTheme.textSecondary;
      default:
        return AppTheme.primaryColor;
    }
  }

  String _paymentLabel(String paymentMethod) {
    switch (paymentMethod) {
      case 'cash':
        return 'Cash';
      case 'card':
        return 'Card •••• 4242';
      case 'digital_wallet':
        return 'Digital wallet';
      default:
        return paymentMethod;
    }
  }

  String _paymentStatusLabel(String paymentStatus) {
    switch (paymentStatus) {
      case 'pending':
        return 'Pending payment';
      case 'captured':
        return 'Payment captured';
      case 'settled':
        return 'Paid';
      case 'failed':
        return 'Payment failed';
      case 'refunded':
        return 'Refunded';
      case 'partially_refunded':
        return 'Partially refunded';
      default:
        return paymentStatus;
    }
  }

  String _statusHeadline(String status) {
    switch (status) {
      case 'pending':
        return 'Waiting for store confirmation';
      case 'confirmed':
        return 'Store confirmed your order';
      case 'preparing':
        return 'Preparing Your Order';
      case 'ready':
        return 'Order is ready for handoff';
      case 'in_transit':
        return 'Order On the Way';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Order cancelled';
      case 'disputed':
        return 'Order needs support review';
      default:
        return formatOrderStatus(status);
    }
  }

  String _etaLabel(String status, String? estimatedDeliveryAt) {
    if (status == 'delivered') return 'Delivered';
    if (status == 'cancelled') return 'Cancelled';
    if (status == 'disputed') return 'Support review';
    if (estimatedDeliveryAt == null || estimatedDeliveryAt.isEmpty) {
      return 'ETA unavailable';
    }

    return formatOrderDate(estimatedDeliveryAt);
  }

  List<OrderMilestone> _buildMilestones({
    required String createdAt,
    required String? confirmedAt,
    required String? preparingAt,
    required String? readyAt,
    required String? pickedUpAt,
    required String? deliveredAt,
    required String? cancelledAt,
    required String? disputedAt,
    required String status,
  }) {
    final activeLabels = const [
      'pending',
      'confirmed',
      'preparing',
      'ready',
      'in_transit'
    ];
    final currentIndex = switch (status) {
      'pending' => 0,
      'confirmed' => 1,
      'preparing' => 2,
      'ready' => 3,
      'in_transit' => 4,
      _ => -1,
    };

    final milestones = <OrderMilestone>[
      OrderMilestone(
        label: 'Order Placed',
        time: formatOrderDate(createdAt),
        isDone: true,
        isCurrent: currentIndex == 0 && status == 'pending',
      ),
      OrderMilestone(
        label: 'Confirmed',
        time: confirmedAt == null ? '--' : formatOrderDate(confirmedAt),
        isDone: activeLabels.indexOf(status) > 1 || status == 'delivered',
        isCurrent: currentIndex == 1,
      ),
      OrderMilestone(
        label: 'Preparing',
        time: preparingAt == null ? '--' : formatOrderDate(preparingAt),
        isDone: activeLabels.indexOf(status) > 2 || status == 'delivered',
        isCurrent: currentIndex == 2,
      ),
      OrderMilestone(
        label: 'Ready',
        time: readyAt == null ? '--' : formatOrderDate(readyAt),
        isDone: activeLabels.indexOf(status) > 3 || status == 'delivered',
        isCurrent: currentIndex == 3,
      ),
      OrderMilestone(
        label: 'On the Way',
        time: pickedUpAt == null ? '--' : formatOrderDate(pickedUpAt),
        isDone: status == 'delivered',
        isCurrent: currentIndex == 4,
      ),
      OrderMilestone(
        label: status == 'cancelled'
            ? 'Cancelled'
            : status == 'disputed'
                ? 'Support Review'
                : 'Delivered',
        time: status == 'cancelled'
            ? (cancelledAt == null ? '--' : formatOrderDate(cancelledAt))
            : status == 'disputed'
                ? (disputedAt == null ? '--' : formatOrderDate(disputedAt))
                : (deliveredAt == null ? '--' : formatOrderDate(deliveredAt)),
        isDone: status == 'delivered' ||
            status == 'cancelled' ||
            status == 'disputed',
        isCurrent: status == 'delivered' ||
            status == 'cancelled' ||
            status == 'disputed',
      ),
    ];

    return milestones;
  }

  List<MockAddress> _mapAddressRows(List<dynamic> response) {
    return List<Map<String, dynamic>>.from(response).map((row) {
      return MockAddress(
        id: row['id'] as String? ?? 'addr-unavailable',
        label: row['label'] as String? ?? 'Address',
        street: row['street'] as String? ?? '',
        detail: row['detail'] as String? ?? '',
        isDefault: row['is_default'] as bool? ?? false,
      );
    }).toList();
  }

  @override
  Future<List<MockAddress>> saveAddress(MockAddress address) async {
    final client = await _requireClient();
    final user = client?.auth.currentUser;
    if (client == null || user == null) {
      throw StateError('Customer Supabase session is unavailable.');
    }

    final addressId = address.id.isEmpty
        ? 'addr-${DateTime.now().toUtc().microsecondsSinceEpoch}'
        : address.id;

    await client.from('customer_addresses').upsert({
      'id': addressId,
      'customer_actor_id': user.id,
      'label': address.label,
      'street': address.street,
      'detail': address.detail,
      'is_default': address.isDefault,
      'updated_at': DateTime.now().toUtc().toIso8601String(),
    });

    // P2: Use atomic RPC to ensure exactly one default after save.
    final response = await client.rpc(
      'set_customer_default_address',
      params: {
        'p_actor_id': user.id,
        'p_address_id': address.isDefault ? addressId : '',
      },
    );

    // If the saved address is not default, re-read to get the canonical list.
    if (!address.isDefault) {
      return readAddresses(limit: _defaultAddressReadLimit);
    }

    return _mapAddressRows(List<dynamic>.from(response as List));
  }

  @override
  Future<List<MockAddress>> deleteAddress(String addressId) async {
    final client = await _requireClient();
    final user = client?.auth.currentUser;
    if (client == null || user == null) {
      throw StateError('Customer Supabase session is unavailable.');
    }

    // P2: Atomic delete with default repair via DB RPC.
    final response = await client.rpc(
      'delete_customer_address_with_default_ensure',
      params: {
        'p_actor_id': user.id,
        'p_address_id': addressId,
      },
    );

    return _mapAddressRows(List<dynamic>.from(response as List));
  }

  @override
  Future<List<MockAddress>> setDefaultAddress(String addressId) async {
    final client = await _requireClient();
    final user = client?.auth.currentUser;
    if (client == null || user == null) {
      throw StateError('Customer Supabase session is unavailable.');
    }

    // P2: Atomic default switch via DB RPC.
    final response = await client.rpc(
      'set_customer_default_address',
      params: {
        'p_actor_id': user.id,
        'p_address_id': addressId,
      },
    );

    return _mapAddressRows(List<dynamic>.from(response as List));
  }

  @override
  Future<CustomerSettingsPreferences> saveSettingsPreferences(
    CustomerSettingsPreferences input,
  ) async {
    final client = await _requireClient();
    final user = client?.auth.currentUser;
    if (client == null || user == null) {
      throw StateError('Customer Supabase session is unavailable.');
    }

    final now = DateTime.now().toUtc();
    final actorType = _resolveActorType(user);
    final customerName = await _resolveStoredDisplayName(
      client,
      user,
      _resolveCustomerName(
        user,
        user.phone ?? CustomerSessionController.instance.phoneNumber ?? '',
      ),
    );

    await client.from('actor_profiles').upsert({
      'id': user.id,
      'actor_type': actorType,
      'display_name': customerName,
      'phone_number':
          user.phone ?? CustomerSessionController.instance.phoneNumber,
      'preferences_json': {
        'notifications_enabled': input.notificationsEnabled,
        'dark_mode_enabled': input.darkModeEnabled,
      },
      'updated_at': now.toIso8601String(),
    });

    return readSettingsPreferences();
  }

  Future<String> _resolveStoredDisplayName(
    SupabaseClient client,
    User user,
    String fallbackName,
  ) async {
    final response = await client
        .from('actor_profiles')
        .select('display_name')
        .eq('id', user.id)
        .maybeSingle();

    final row = response == null ? null : Map<String, dynamic>.from(response);
    final persistedDisplayName = row?['display_name'] as String?;
    if (persistedDisplayName != null &&
        persistedDisplayName.trim().isNotEmpty) {
      return persistedDisplayName.trim();
    }

    return fallbackName;
  }

  @override
  Future<PersistedCustomerOrder?> createOrder(
      CustomerOrderCreateInput input) async {
    final observability = const CustomerRuntimeObservabilityService();
    final stopwatch = Stopwatch()..start();
    final client = await _requireClient();
    final user = client?.auth.currentUser;
    if (client == null || user == null) {
      try {
        await observability.recordEvent(
          layer: 'gateway',
          operation: 'runtime.access_denied',
          outcome: 'failed',
          traceId: input.traceId,
          attemptSource: 'persisted',
          failureClass: 'auth_missing',
          actorType:
              CustomerSessionController.instance.isGuest ? 'guest' : 'customer',
          storeId: input.storeId,
          itemCount: input.itemCount,
          paymentMethod: input.paymentMethod,
          resourceType: 'Order',
          resourceScope: input.storeId,
          durationMs: stopwatch.elapsedMilliseconds,
          metadata: {
            'triggeringOperation': 'customer.order.create',
          },
        );
      } catch (_) {}
      return null;
    }

    final now = DateTime.now().toUtc();
    final actorType =
        CustomerSessionController.instance.isGuest ? 'guest' : 'customer';

    try {
      await observability.recordEvent(
        layer: 'gateway',
        operation: 'customer.order.create',
        outcome: 'started',
        traceId: input.traceId,
        attemptSource: 'persisted',
        actorType: actorType,
        storeId: input.storeId,
        itemCount: input.itemCount,
        paymentMethod: input.paymentMethod,
      );
    } catch (_) {}

    try {
      final rpcResponse = await client.rpc(
        'create_customer_order',
        params: {
          'p_store_id': input.storeId,
          'p_payment_method': input.paymentMethod,
          'p_delivery_address': input.deliveryAddress,
          'p_notes': input.instructions.trim(),
          'p_line_items': input.lineItems
              .map(
                (item) => {
                  'menu_item_id': item.menuItemId,
                  'quantity': item.quantity,
                  'modifiers': item.modifiers,
                },
              )
              .toList(),
          'p_promo_code': input.promoCode,
          'p_estimated_delivery_at': input.estimatedDeliveryAtUtc,
        },
      );
      final orderRow = Map<String, dynamic>.from(rpcResponse as Map);
      final returnedOrderId = orderRow['id'] as String?;

      try {
        await observability.recordEvent(
          layer: 'gateway',
          operation: 'customer.order.create',
          outcome: 'succeeded',
          traceId: input.traceId,
          attemptSource: 'persisted',
          actorType: actorType,
          storeId: input.storeId,
          orderId: returnedOrderId ?? 'order-unavailable',
          itemCount: input.itemCount,
          paymentMethod: input.paymentMethod,
          durationMs: stopwatch.elapsedMilliseconds,
        );
      } catch (_) {}

      return PersistedCustomerOrder(
        id: returnedOrderId ?? 'order-unavailable',
        orderNumber: (orderRow['order_number'] as String?) ??
            _buildOrderNumber(now),
        status: (orderRow['status'] as String?) ?? 'pending',
        totalCentavos: (orderRow['total_centavos'] as num?)?.toInt() ??
            input.totalCentavos,
        itemCount: (orderRow['item_count'] as num?)?.toInt() ?? input.itemCount,
        createdAtUtc:
            (orderRow['created_at'] as String?) ?? now.toIso8601String(),
        storeName: (orderRow['store_name'] as String?) ?? input.storeName,
        paymentStatus:
            (orderRow['payment_status'] as String?) ?? input.paymentStatus,
        paymentMethod:
            (orderRow['payment_method'] as String?) ?? input.paymentMethod,
        estimatedDeliveryAtUtc:
            (orderRow['estimated_delivery_at'] as String?) ??
                input.estimatedDeliveryAtUtc,
      );
    } catch (error) {
      final failureClass =
          CustomerRuntimeObservabilityService.classifyRuntimeFailure(error);
      try {
        await observability.recordEvent(
          layer: 'gateway',
          operation: 'customer.order.create',
          outcome: 'failed',
          traceId: input.traceId,
          attemptSource: 'persisted',
          failureClass: failureClass,
          actorType: actorType,
          storeId: input.storeId,
          itemCount: input.itemCount,
          paymentMethod: input.paymentMethod,
          durationMs: stopwatch.elapsedMilliseconds,
        );
        if (failureClass == 'auth_missing' ||
            failureClass == 'rls_denied' ||
            failureClass == 'membership_denied') {
          await observability.recordEvent(
            layer: 'gateway',
            operation: 'runtime.access_denied',
            outcome: 'failed',
            traceId: input.traceId,
            attemptSource: 'persisted',
            failureClass: failureClass,
            actorType: actorType,
            storeId: input.storeId,
            itemCount: input.itemCount,
            paymentMethod: input.paymentMethod,
            resourceType: 'Order',
            resourceScope: input.storeId,
            durationMs: stopwatch.elapsedMilliseconds,
            metadata: {
              'triggeringOperation': 'customer.order.create',
            },
          );
        }
      } catch (_) {}
      rethrow;
    }
  }

  String _buildDescendingCursorFilter(CustomerOrderReadCursor cursor) {
    final createdAt = _escapePostgrestValue(cursor.createdAtUtc);
    final id = _escapePostgrestValue(cursor.id);
    return 'created_at.lt."$createdAt",and(created_at.eq."$createdAt",id.lt."$id")';
  }

  String _escapePostgrestValue(String value) {
    return value.replaceAll(r'\', r'\\').replaceAll('"', r'\"');
  }
}
