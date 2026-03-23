import 'package:flutter/material.dart';

import '../session/customer_session_controller.dart';
import '../theme/app_theme.dart';
import 'mock_data.dart';

enum CartAddOutcome {
  added,
  replacedStore,
}

class CustomerOrderRecord {
  const CustomerOrderRecord({
    required this.order,
    required this.store,
    required this.items,
    required this.address,
    required this.instructions,
    required this.paymentLabel,
    required this.statusHeadline,
    required this.etaLabel,
    required this.milestones,
    required this.isActive,
    this.subtotalCentavos = 0,
    this.deliveryFeeCentavos = 0,
    this.serviceFeeCentavos = 0,
  });

  final MockOrder order;
  final MockStore store;
  final List<MockCartItem> items;
  final MockAddress address;
  final String instructions;
  final String paymentLabel;
  final String statusHeadline;
  final String etaLabel;
  final List<OrderMilestone> milestones;
  final bool isActive;
  final int subtotalCentavos;
  final int deliveryFeeCentavos;
  final int serviceFeeCentavos;

  CustomerOrderRecord copyWith({
    MockOrder? order,
    MockStore? store,
    List<MockCartItem>? items,
    MockAddress? address,
    String? instructions,
    String? paymentLabel,
    String? statusHeadline,
    String? etaLabel,
    List<OrderMilestone>? milestones,
    bool? isActive,
    int? subtotalCentavos,
    int? deliveryFeeCentavos,
    int? serviceFeeCentavos,
  }) {
    return CustomerOrderRecord(
      order: order ?? this.order,
      store: store ?? this.store,
      items: items ?? this.items,
      address: address ?? this.address,
      instructions: instructions ?? this.instructions,
      paymentLabel: paymentLabel ?? this.paymentLabel,
      statusHeadline: statusHeadline ?? this.statusHeadline,
      etaLabel: etaLabel ?? this.etaLabel,
      milestones: milestones ?? this.milestones,
      isActive: isActive ?? this.isActive,
      subtotalCentavos: subtotalCentavos ?? this.subtotalCentavos,
      deliveryFeeCentavos: deliveryFeeCentavos ?? this.deliveryFeeCentavos,
      serviceFeeCentavos: serviceFeeCentavos ?? this.serviceFeeCentavos,
    );
  }
}

class OrderMilestone {
  const OrderMilestone({
    required this.label,
    required this.time,
    required this.isDone,
    this.isCurrent = false,
  });

  final String label;
  final String time;
  final bool isDone;
  final bool isCurrent;
}

class CustomerRuntimeController extends ChangeNotifier {
  CustomerRuntimeController._() {
    _recentSearches = List<String>.from(MockData.recentSearches);
    _searchQuery = '';
    _filterSelections = Map<String, int>.from(_defaultFilterSelections);
    _cartItems = _cloneCartItems(MockData.cartItems);
    _selectedStoreId = _cartItems.isEmpty ? null : MockData.stores.first.id;
    _addresses = _cloneAddresses(MockData.addresses);
    _seedOrders();
  }

  static final CustomerRuntimeController instance =
      CustomerRuntimeController._();

  static const Map<String, int> _defaultFilterSelections = {
    'Sort by': 0,
    'Cuisine': 0,
    'Price range': -1,
    'Dietary': -1,
  };

  static const Map<String, int> _priceTierByStore = {
    'store-1': 2,
    'store-2': 3,
    'store-3': 2,
    'store-4': 2,
    'store-5': 1,
    'store-6': 1,
  };

  static const Map<String, Set<String>> _dietaryTagsByStore = {
    'store-1': {'Halal'},
    'store-2': {'Gluten-free'},
    'store-3': {'Vegetarian'},
    'store-4': {'Vegetarian', 'Vegan', 'Gluten-free'},
    'store-5': {'Halal'},
    'store-6': {'Vegetarian'},
  };

  late List<String> _recentSearches;
  late String _searchQuery;
  late Map<String, int> _filterSelections;
  late List<MockCartItem> _cartItems;
  String? _selectedStoreId;
  String? _promoCode;
  int _promoDiscount = 0;
  late List<CustomerOrderRecord> _activeOrderRecords;
  late List<CustomerOrderRecord> _pastOrderRecords;
  int _nextOrderNumber = 2900;
  late List<MockAddress> _addresses;
  int _nextAddressId = 100;

  List<String> get recentSearches => List.unmodifiable(_recentSearches);
  String get searchQuery => _searchQuery;
  Map<String, int> get filterSelections => Map.unmodifiable(_filterSelections);
  List<MockCartItem> get cartItems => List.unmodifiable(_cartItems);
  String? get selectedStoreId => _selectedStoreId;
  String? get promoCode => _promoCode;
  bool get hasPromoApplied => _promoDiscount > 0;
  int get promoDiscount => _promoDiscount;
  List<MockOrder> get activeOrders =>
      _activeOrderRecords.map((record) => record.order).toList();
  List<MockOrder> get pastOrders =>
      _pastOrderRecords.map((record) => record.order).toList();
  List<MockAddress> get addresses => List.unmodifiable(_addresses);

  MockAddress? get deliveryAddress {
    if (_addresses.isEmpty) return null;
    return _addresses.firstWhere(
      (a) => a.isDefault,
      orElse: () => _addresses.first,
    );
  }

  MockStore? get selectedStore =>
      _selectedStoreId == null ? null : findStoreById(_selectedStoreId!);

  int get cartItemCount =>
      _cartItems.fold<int>(0, (sum, item) => sum + item.quantity);

  int get cartSubtotal =>
      _cartItems.fold<int>(0, (sum, item) => sum + item.total);

  int get cartDeliveryFee =>
      _cartItems.isEmpty ? 0 : MockData.cartDeliveryFee;
  int get cartServiceFee => _cartItems.isEmpty ? 0 : MockData.cartServiceFee;
  int get cartTotal =>
      cartSubtotal + cartDeliveryFee + cartServiceFee - _promoDiscount;

  int get activeFilterCount {
    var count = 0;
    if ((_filterSelections['Sort by'] ?? 0) > 0) count++;
    if ((_filterSelections['Cuisine'] ?? 0) > 0) count++;
    if ((_filterSelections['Price range'] ?? -1) >= 0) count++;
    if ((_filterSelections['Dietary'] ?? -1) >= 0) count++;
    return count;
  }

  MockStore findStoreById(String id) {
    return MockData.stores.firstWhere(
      (store) => store.id == id,
      orElse: () => MockData.stores.first,
    );
  }

  MockStore resolveStore([String? storeId]) {
    final resolvedId = storeId ?? _selectedStoreId ?? MockData.stores.first.id;
    return findStoreById(resolvedId);
  }

  List<MockMenuItem> menuItemsForStore(String storeId) {
    openStore(storeId, notify: false);
    return List<MockMenuItem>.from(MockData.menuItems);
  }

  CustomerOrderRecord? findOrderRecordById(String? orderId) {
    if (orderId == null) {
      return _activeOrderRecords.isNotEmpty
          ? _activeOrderRecords.first
          : (_pastOrderRecords.isNotEmpty ? _pastOrderRecords.first : null);
    }

    for (final record in [..._activeOrderRecords, ..._pastOrderRecords]) {
      if (record.order.id == orderId) {
        return record;
      }
    }
    return null;
  }

  void openStore(String storeId, {bool notify = true}) {
    _selectedStoreId = storeId;
    if (notify) {
      notifyListeners();
    }
  }

  CartAddOutcome addMenuItem({
    required String storeId,
    required MockMenuItem item,
  }) {
    var outcome = CartAddOutcome.added;
    if (_selectedStoreId != null &&
        _selectedStoreId != storeId &&
        _cartItems.isNotEmpty) {
      _cartItems = [];
      _promoCode = null;
      _promoDiscount = 0;
      outcome = CartAddOutcome.replacedStore;
    }

    _selectedStoreId = storeId;

    final index = _cartItems.indexWhere(
      (cartItem) => cartItem.menuItem.id == item.id,
    );

    if (index >= 0) {
      final existing = _cartItems[index];
      _cartItems[index] = MockCartItem(
        menuItem: existing.menuItem,
        quantity: existing.quantity + 1,
        notes: existing.notes,
        modifiers: existing.modifiers,
      );
    } else {
      _cartItems = [
        ..._cartItems,
        MockCartItem(menuItem: item, quantity: 1),
      ];
    }

    notifyListeners();
    return outcome;
  }

  void updateCartQuantity(String menuItemId, int delta) {
    final index = _cartItems.indexWhere(
      (cartItem) => cartItem.menuItem.id == menuItemId,
    );
    if (index < 0) return;

    final existing = _cartItems[index];
    final nextQuantity = existing.quantity + delta;
    if (nextQuantity <= 0) {
      removeCartItem(menuItemId);
      return;
    }

    _cartItems[index] = MockCartItem(
      menuItem: existing.menuItem,
      quantity: nextQuantity,
      notes: existing.notes,
      modifiers: existing.modifiers,
    );
    notifyListeners();
  }

  void removeCartItem(String menuItemId) {
    _cartItems = _cartItems
        .where((cartItem) => cartItem.menuItem.id != menuItemId)
        .toList();
    if (_cartItems.isEmpty) {
      _promoCode = null;
      _promoDiscount = 0;
    }
    notifyListeners();
  }

  void clearCart() {
    _cartItems = [];
    _promoCode = null;
    _promoDiscount = 0;
    notifyListeners();
  }

  bool applyPromoCode(String code) {
    final normalized = code.trim().toUpperCase();
    if (normalized != 'SAVE5') {
      return false;
    }
    _promoCode = normalized;
    _promoDiscount = 500;
    notifyListeners();
    return true;
  }

  void removePromoCode() {
    _promoCode = null;
    _promoDiscount = 0;
    notifyListeners();
  }

  CustomerOrderRecord? submitOrder({
    required String instructions,
    required int paymentMethodIndex,
  }) {
    // R-024: Order placement requires authentication. Guests must not place orders.
    if (CustomerSessionController.instance.isGuest) {
      return null;
    }

    final store = selectedStore;
    final address = deliveryAddress;
    if (store == null || _cartItems.isEmpty || address == null) {
      return null;
    }

    final now = DateTime.now().toUtc();
    final order = MockOrder(
      id: 'ORD-${_nextOrderNumber++}',
      storeName: store.name,
      status: 'preparing',
      total: cartTotal,
      itemCount: cartItemCount,
      createdAt: now.toIso8601String(),
      statusColor: AppTheme.secondaryColor,
    );

    final paymentLabel = paymentMethodIndex == 0 ? 'Cash' : 'Card •••• 4242';
    final record = CustomerOrderRecord(
      order: order,
      store: store,
      items: _cloneCartItems(_cartItems),
      address: address,
      instructions: instructions.trim(),
      paymentLabel: paymentLabel,
      statusHeadline: 'Preparing Your Order',
      etaLabel: '25-35 minutes',
      milestones: [
        OrderMilestone(
          label: 'Order Placed',
          time: _formatTime(now),
          isDone: true,
        ),
        OrderMilestone(
          label: 'Confirmed',
          time: _formatTime(now.add(const Duration(minutes: 2))),
          isDone: true,
        ),
        const OrderMilestone(
          label: 'Preparing',
          time: '--',
          isDone: false,
          isCurrent: true,
        ),
        const OrderMilestone(
          label: 'On the Way',
          time: '--',
          isDone: false,
        ),
        const OrderMilestone(
          label: 'Delivered',
          time: '--',
          isDone: false,
        ),
      ],
      isActive: true,
    );

    _activeOrderRecords = [record, ..._activeOrderRecords];
    _cartItems = [];
    _promoCode = null;
    _promoDiscount = 0;
    notifyListeners();
    return record;
  }

  bool reorder(String orderId) {
    final record = findOrderRecordById(orderId);
    if (record == null) return false;

    _selectedStoreId = record.store.id;
    _cartItems = _cloneCartItems(record.items);
    _promoCode = null;
    _promoDiscount = 0;
    notifyListeners();
    return true;
  }

  void setSearchQuery(String value, {bool addToRecent = false}) {
    _searchQuery = value.trimLeft();
    if (addToRecent && _searchQuery.trim().isNotEmpty) {
      _addRecentSearch(_searchQuery.trim());
    }
    notifyListeners();
  }

  void clearSearchQuery() {
    _searchQuery = '';
    notifyListeners();
  }

  void clearRecentSearches() {
    _recentSearches = [];
    notifyListeners();
  }

  void setFilters(Map<String, int> filters) {
    _filterSelections = Map<String, int>.from(filters);
    notifyListeners();
  }

  void resetFilters() {
    _filterSelections = Map<String, int>.from(_defaultFilterSelections);
    notifyListeners();
  }

  List<MockStore> getSearchResults(String query) {
    final trimmed = query.trim();
    if (trimmed.isEmpty) return [];
    return _applyStoreFilters(
      MockData.stores.where((store) {
        final q = trimmed.toLowerCase();
        return store.name.toLowerCase().contains(q) ||
            store.cuisine.toLowerCase().contains(q);
      }).toList(),
    );
  }

  List<MockStore> getDiscoveryResults({String? categoryName}) {
    var stores = List<MockStore>.from(MockData.stores);
    if (categoryName != null &&
        categoryName.isNotEmpty &&
        categoryName != 'All') {
      final lowered = categoryName.toLowerCase();
      stores = stores.where((store) {
        return store.cuisine.toLowerCase().contains(lowered) ||
            store.name.toLowerCase().contains(lowered);
      }).toList();
    }
    return _applyStoreFilters(stores);
  }

  List<MockStore> _applyStoreFilters(List<MockStore> stores) {
    var filtered = List<MockStore>.from(stores);

    final cuisineIndex = _filterSelections['Cuisine'] ?? 0;
    if (cuisineIndex > 0) {
      final cuisine = MockData.filterOptions['Cuisine']![cuisineIndex];
      filtered = filtered.where((store) {
        return store.cuisine.toLowerCase().contains(cuisine.toLowerCase());
      }).toList();
    }

    final priceIndex = _filterSelections['Price range'] ?? -1;
    if (priceIndex >= 0) {
      filtered = filtered.where((store) {
        return (_priceTierByStore[store.id] ?? 1) == priceIndex + 1;
      }).toList();
    }

    final dietaryIndex = _filterSelections['Dietary'] ?? -1;
    if (dietaryIndex >= 0) {
      final dietary = MockData.filterOptions['Dietary']![dietaryIndex];
      filtered = filtered.where((store) {
        final tags = _dietaryTagsByStore[store.id] ?? const <String>{};
        return tags.contains(dietary);
      }).toList();
    }

    final sortIndex = _filterSelections['Sort by'] ?? 0;
    switch (sortIndex) {
      case 1:
        filtered.sort(
          (a, b) => _parseDeliveryMinutes(a.deliveryTime)
              .compareTo(_parseDeliveryMinutes(b.deliveryTime)),
        );
        break;
      case 2:
        filtered.sort((a, b) => b.rating.compareTo(a.rating));
        break;
      case 3:
        filtered.sort((a, b) => _parseDistance(a.distance).compareTo(
              _parseDistance(b.distance),
            ));
        break;
      default:
        filtered.sort((a, b) {
          if (a.isFeatured == b.isFeatured) {
            return b.rating.compareTo(a.rating);
          }
          return a.isFeatured ? -1 : 1;
        });
        break;
    }

    return filtered;
  }

  void addAddress(MockAddress address) {
    final id = 'addr-rt-${_nextAddressId++}';
    final isFirst = _addresses.isEmpty;
    final newAddress = MockAddress(
      id: id,
      label: address.label,
      street: address.street,
      detail: address.detail,
      isDefault: isFirst || address.isDefault,
    );
    if (newAddress.isDefault) {
      _addresses = _addresses
          .map((a) => MockAddress(
                id: a.id,
                label: a.label,
                street: a.street,
                detail: a.detail,
                isDefault: false,
              ))
          .toList();
    }
    _addresses = [..._addresses, newAddress];
    notifyListeners();
  }

  void updateAddress(MockAddress updated) {
    final index = _addresses.indexWhere((a) => a.id == updated.id);
    if (index < 0) return;
    if (updated.isDefault) {
      _addresses = _addresses
          .map((a) => MockAddress(
                id: a.id,
                label: a.label,
                street: a.street,
                detail: a.detail,
                isDefault: false,
              ))
          .toList();
    }
    _addresses[index] = updated;
    notifyListeners();
  }

  void deleteAddress(String id) {
    final target = _addresses.firstWhere(
      (a) => a.id == id,
      orElse: () => const MockAddress(
          id: '', label: '', street: '', detail: ''),
    );
    if (target.id.isEmpty) return;
    _addresses = _addresses.where((a) => a.id != id).toList();
    // If we removed the default, promote first remaining to default.
    if (target.isDefault && _addresses.isNotEmpty) {
      final first = _addresses.first;
      _addresses[0] = MockAddress(
        id: first.id,
        label: first.label,
        street: first.street,
        detail: first.detail,
        isDefault: true,
      );
    }
    notifyListeners();
  }

  void setDefaultAddress(String id) {
    _addresses = _addresses
        .map((a) => MockAddress(
              id: a.id,
              label: a.label,
              street: a.street,
              detail: a.detail,
              isDefault: a.id == id,
            ))
        .toList();
    notifyListeners();
  }

  void _addRecentSearch(String term) {
    _recentSearches = [
      term,
      ..._recentSearches.where(
        (existing) => existing.toLowerCase() != term.toLowerCase(),
      ),
    ];
    if (_recentSearches.length > 6) {
      _recentSearches = _recentSearches.take(6).toList();
    }
  }

  void _seedOrders() {
    final burgerStore =
        MockData.stores.firstWhere((store) => store.id == 'store-1');
    final sushiStore =
        MockData.stores.firstWhere((store) => store.id == 'store-2');
    final pizzaStore =
        MockData.stores.firstWhere((store) => store.id == 'store-3');
    final tacoStore =
        MockData.stores.firstWhere((store) => store.id == 'store-5');
    final cafeStore =
        MockData.stores.firstWhere((store) => store.id == 'store-6');
    final address = _addresses.firstWhere(
      (a) => a.isDefault,
      orElse: () => _addresses.first,
    );

    _activeOrderRecords = [
      CustomerOrderRecord(
        order: MockData.activeOrders[0],
        store: burgerStore,
        items: _cloneCartItems(MockData.cartItems),
        address: address,
        instructions: 'Leave at the door',
        paymentLabel: 'Cash',
        statusHeadline: 'Preparing Your Order',
        etaLabel: '25-35 minutes',
        milestones: const [
          OrderMilestone(label: 'Order Placed', time: '2:30 PM', isDone: true),
          OrderMilestone(label: 'Confirmed', time: '2:32 PM', isDone: true),
          OrderMilestone(
            label: 'Preparing',
            time: '--',
            isDone: false,
            isCurrent: true,
          ),
          OrderMilestone(label: 'On the Way', time: '--', isDone: false),
          OrderMilestone(label: 'Delivered', time: '--', isDone: false),
        ],
        isActive: true,
      ),
      CustomerOrderRecord(
        order: MockData.activeOrders[1],
        store: sushiStore,
        items: _cloneCartItems([
          MockCartItem(menuItem: MockData.menuItems[1], quantity: 1),
          MockCartItem(menuItem: MockData.menuItems[2], quantity: 1),
        ]),
        address: address,
        instructions: '',
        paymentLabel: 'Card •••• 4242',
        statusHeadline: 'Order On the Way',
        etaLabel: '10-15 minutes',
        milestones: const [
          OrderMilestone(label: 'Order Placed', time: '1:15 PM', isDone: true),
          OrderMilestone(label: 'Confirmed', time: '1:17 PM', isDone: true),
          OrderMilestone(label: 'Preparing', time: '1:24 PM', isDone: true),
          OrderMilestone(
            label: 'On the Way',
            time: '--',
            isDone: false,
            isCurrent: true,
          ),
          OrderMilestone(label: 'Delivered', time: '--', isDone: false),
        ],
        isActive: true,
      ),
    ];

    _pastOrderRecords = [
      CustomerOrderRecord(
        order: MockData.pastOrders[0],
        store: pizzaStore,
        items: _cloneCartItems([
          MockCartItem(menuItem: MockData.menuItems[0], quantity: 1),
          MockCartItem(menuItem: MockData.menuItems[1], quantity: 1),
        ]),
        address: address,
        instructions: '',
        paymentLabel: 'Card •••• 4242',
        statusHeadline: 'Delivered',
        etaLabel: 'Delivered',
        milestones: const [],
        isActive: false,
      ),
      CustomerOrderRecord(
        order: MockData.pastOrders[1],
        store: tacoStore,
        items: _cloneCartItems([
          MockCartItem(menuItem: MockData.menuItems[2], quantity: 2),
          MockCartItem(menuItem: MockData.menuItems[7], quantity: 2),
        ]),
        address: address,
        instructions: '',
        paymentLabel: 'Cash',
        statusHeadline: 'Delivered',
        etaLabel: 'Delivered',
        milestones: const [],
        isActive: false,
      ),
      CustomerOrderRecord(
        order: MockData.pastOrders[2],
        store: cafeStore,
        items: _cloneCartItems([
          MockCartItem(menuItem: MockData.menuItems[4], quantity: 1),
          MockCartItem(menuItem: MockData.menuItems[7], quantity: 1),
        ]),
        address: address,
        instructions: '',
        paymentLabel: 'Card •••• 4242',
        statusHeadline: 'Delivered',
        etaLabel: 'Delivered',
        milestones: const [],
        isActive: false,
      ),
    ];
  }

  static List<MockAddress> _cloneAddresses(List<MockAddress> addresses) {
    return addresses
        .map(
          (a) => MockAddress(
            id: a.id,
            label: a.label,
            street: a.street,
            detail: a.detail,
            isDefault: a.isDefault,
          ),
        )
        .toList();
  }

  static List<MockCartItem> _cloneCartItems(List<MockCartItem> items) {
    return items
        .map(
          (item) => MockCartItem(
            menuItem: item.menuItem,
            quantity: item.quantity,
            notes: item.notes,
            modifiers: List<String>.from(item.modifiers),
          ),
        )
        .toList();
  }

  static int _parseDeliveryMinutes(String value) {
    final match = RegExp(r'(\d+)').firstMatch(value);
    return int.tryParse(match?.group(1) ?? '999') ?? 999;
  }

  static double _parseDistance(String value) {
    final match = RegExp(r'(\d+(\.\d+)?)').firstMatch(value);
    return double.tryParse(match?.group(1) ?? '999') ?? 999;
  }

  static String _formatTime(DateTime value) {
    final hour =
        value.hour > 12 ? value.hour - 12 : (value.hour == 0 ? 12 : value.hour);
    final minute = value.minute.toString().padLeft(2, '0');
    final suffix = value.hour >= 12 ? 'PM' : 'AM';
    return '$hour:$minute $suffix';
  }
}
