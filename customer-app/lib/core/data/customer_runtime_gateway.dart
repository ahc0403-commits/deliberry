import 'customer_runtime_controller.dart';
import 'mock_data.dart';

class CustomerOrderReadCursor {
  const CustomerOrderReadCursor({
    required this.createdAtUtc,
    required this.id,
  });

  final String createdAtUtc;
  final String id;
}

class CustomerSettingsPreferences {
  const CustomerSettingsPreferences({
    required this.notificationsEnabled,
    required this.darkModeEnabled,
  });

  final bool notificationsEnabled;
  final bool darkModeEnabled;
}

class CustomerProfileIdentity {
  const CustomerProfileIdentity({
    this.displayName,
  });

  final String? displayName;
}

class CustomerOrderReview {
  const CustomerOrderReview({
    required this.orderId,
    required this.storeId,
    required this.rating,
    required this.reviewText,
    required this.tags,
  });

  final String orderId;
  final String storeId;
  final int rating;
  final String reviewText;
  final List<String> tags;
}

class CustomerOrderCreateLineItem {
  const CustomerOrderCreateLineItem({
    this.menuItemId,
    required this.name,
    required this.quantity,
    required this.unitPriceCentavos,
    this.modifiers = const <String>[],
  });

  final String? menuItemId;
  final String name;
  final int quantity;
  final int unitPriceCentavos;
  final List<String> modifiers;
}

class CustomerOrderCreateInput {
  const CustomerOrderCreateInput({
    required this.traceId,
    required this.storeId,
    required this.storeName,
    required this.customerPhone,
    this.promoCode,
    required this.paymentStatus,
    required this.paymentMethod,
    required this.totalCentavos,
    required this.itemCount,
    required this.subtotalCentavos,
    required this.deliveryFeeCentavos,
    required this.deliveryAddress,
    required this.instructions,
    required this.estimatedDeliveryAtUtc,
    required this.lineItems,
  });

  final String traceId;
  final String storeId;
  final String storeName;
  final String customerPhone;
  final String? promoCode;
  final String paymentStatus;
  final String paymentMethod;
  final int totalCentavos;
  final int itemCount;
  final int subtotalCentavos;
  final int deliveryFeeCentavos;
  final String deliveryAddress;
  final String instructions;
  final String estimatedDeliveryAtUtc;
  final List<CustomerOrderCreateLineItem> lineItems;
}

class PersistedCustomerOrder {
  const PersistedCustomerOrder({
    required this.id,
    required this.orderNumber,
    required this.status,
    required this.totalCentavos,
    required this.itemCount,
    required this.createdAtUtc,
    required this.storeName,
    required this.paymentStatus,
    required this.paymentMethod,
    required this.estimatedDeliveryAtUtc,
  });

  final String id;
  final String orderNumber;
  final String status;
  final int totalCentavos;
  final int itemCount;
  final String createdAtUtc;
  final String storeName;
  final String paymentStatus;
  final String paymentMethod;
  final String estimatedDeliveryAtUtc;
}

abstract class CustomerRuntimeGateway {
  Future<List<CustomerOrderRecord>> readActiveOrders({
    int limit,
    CustomerOrderReadCursor? cursor,
  });
  Future<List<CustomerOrderRecord>> readPastOrders({
    int limit,
    CustomerOrderReadCursor? cursor,
  });
  Future<List<MockAddress>> readAddresses({
    int limit,
  });
  Future<CustomerSettingsPreferences> readSettingsPreferences();
  Future<CustomerSettingsPreferences> saveSettingsPreferences(
    CustomerSettingsPreferences input,
  );
  Future<CustomerProfileIdentity> readProfileIdentity();
  Future<CustomerProfileIdentity> saveProfileIdentity(
    CustomerProfileIdentity input,
  );
  Future<CustomerOrderReview?> readOrderReview(String orderId);
  Future<Map<String, CustomerOrderReview>> readOrderReviewsBatch(
    Iterable<String> orderIds,
  );
  Future<CustomerOrderReview> saveOrderReview(CustomerOrderReview input);
  Future<List<MockAddress>> saveAddress(MockAddress address);
  Future<List<MockAddress>> deleteAddress(String addressId);
  Future<List<MockAddress>> setDefaultAddress(String addressId);
  Future<Map<String, dynamic>> exportMaskedOrderBundleForExternalLlm({
    String profile,
  });
  Future<PersistedCustomerOrder?> createOrder(CustomerOrderCreateInput input);
}
