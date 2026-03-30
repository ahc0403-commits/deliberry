import 'dart:async';

import 'package:flutter/material.dart';

import '../backend/runtime_backend_config.dart';
import '../session/customer_session_controller.dart';
import '../supabase/supabase_client.dart';
import '../theme/app_theme.dart';
import 'customer_runtime_gateway.dart';
import 'mock_data.dart';
import 'supabase_customer_runtime_gateway.dart';

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
    required this.paymentStatusLabel,
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
  final String paymentStatusLabel;
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
    String? paymentStatusLabel,
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
      paymentStatusLabel: paymentStatusLabel ?? this.paymentStatusLabel,
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
    _stores = List<MockStore>.from(MockData.stores);
    _selectedStoreId = _cartItems.isEmpty ? null : _stores.first.id;
    _addresses = _cloneAddresses(MockData.addresses);
    _activeOrderRecords = const <CustomerOrderRecord>[];
    _pastOrderRecords = const <CustomerOrderRecord>[];
    CustomerSessionController.instance.addListener(_handleSessionChanged);
    unawaited(refreshPersistedRuntime());
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
  late List<MockAddress> _addresses;
  int _nextAddressId = 100;
  late List<MockStore> _stores;
  Map<String, List<MockMenuItem>> _menuItemsByStore =
      <String, List<MockMenuItem>>{};
  final CustomerRuntimeGateway _gateway =
      const SupabaseCustomerRuntimeGateway();
  bool _isHydratingPersistedRuntime = false;
  bool _persistedRuntimeLoaded = false;
  bool _usesPersistedStoreData = false;
  String? _lastRuntimeBlocker;

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
  List<MockStore> get stores => List.unmodifiable(_stores);
  List<MockStore> get featuredStores =>
      _stores.where((store) => store.isFeatured).toList();
  String? get lastRuntimeBlocker => _lastRuntimeBlocker;
  bool get usesPersistedStoreData => _usesPersistedStoreData;
  bool get hasPersistedRuntimeLoaded => _persistedRuntimeLoaded;

  Future<CustomerOrderReview?> readOrderReview(String orderId) async {
    return _gateway.readOrderReview(orderId);
  }

  Future<CustomerOrderReview> submitOrderReview({
    required String orderId,
    required String storeId,
    required int rating,
    required String reviewText,
    required List<String> tags,
  }) async {
    return _gateway.saveOrderReview(
      CustomerOrderReview(
        orderId: orderId,
        storeId: storeId,
        rating: rating,
        reviewText: reviewText,
        tags: tags,
      ),
    );
  }

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

  int get cartDeliveryFee => _cartItems.isEmpty ? 0 : MockData.cartDeliveryFee;
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
    return _stores.firstWhere(
      (store) => store.id == id,
      orElse: () => _stores.isNotEmpty ? _stores.first : MockData.stores.first,
    );
  }

  MockStore? findPersistedStoreById(String? id) {
    if (id == null || id.isEmpty) {
      return null;
    }
    for (final store in _stores) {
      if (store.id == id) {
        return store;
      }
    }
    return null;
  }

  MockMenuItem? findPersistedMenuItemByName(String storeId, String name) {
    final normalizedName = name.trim().toLowerCase();
    if (normalizedName.isEmpty) {
      return null;
    }
    final candidates = _menuItemsByStore[storeId];
    if (candidates == null) {
      return null;
    }
    for (final item in candidates) {
      if (item.name.trim().toLowerCase() == normalizedName) {
        return item;
      }
    }
    return null;
  }

  MockStore resolveStore([String? storeId]) {
    final resolvedId = storeId ?? _selectedStoreId ?? _stores.first.id;
    return findStoreById(resolvedId);
  }

  List<MockMenuItem> menuItemsForStore(String storeId) {
    openStore(storeId, notify: false);
    final persisted = _menuItemsByStore[storeId];
    if (persisted != null && persisted.isNotEmpty) {
      return List<MockMenuItem>.from(persisted);
    }
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

  Future<CustomerOrderRecord?> submitOrder({
    required String instructions,
    required int paymentMethodIndex,
  }) async {
    // R-024: Order placement requires authentication. Guests must not place orders.
    if (CustomerSessionController.instance.isGuest ||
        !CustomerSessionController.instance.hasSupabaseBackedSession) {
      _lastRuntimeBlocker = 'authenticated_customer_session_required';
      notifyListeners();
      return null;
    }

    final store = selectedStore;
    final address = deliveryAddress;
    if (store == null || _cartItems.isEmpty || address == null) {
      _lastRuntimeBlocker = 'checkout_input_missing';
      return null;
    }

    final now = DateTime.now().toUtc();
    final paymentMethod = paymentMethodIndex == 0 ? 'cash' : 'card';
    final created = await _gateway.createOrder(
      CustomerOrderCreateInput(
        traceId: 'cust-${now.microsecondsSinceEpoch}',
        storeId: store.id,
        storeName: store.name,
        customerPhone: CustomerSessionController.instance.phoneNumber ??
            CustomerSessionController.instance.identity?.phoneNumber ??
            '',
        paymentStatus: 'pending',
        paymentMethod: paymentMethod,
        totalCentavos: cartTotal,
        itemCount: cartItemCount,
        subtotalCentavos: cartSubtotal,
        deliveryFeeCentavos: cartDeliveryFee,
        deliveryAddress:
            '${address.street}${address.detail.isEmpty ? '' : ', ${address.detail}'}',
        instructions: instructions,
        estimatedDeliveryAtUtc:
            now.add(const Duration(minutes: 30)).toIso8601String(),
        lineItems: _cartItems
            .map(
              (item) => CustomerOrderCreateLineItem(
                name: item.menuItem.name,
                quantity: item.quantity,
                unitPriceCentavos: item.menuItem.price,
                modifiers: item.modifiers,
              ),
            )
            .toList(),
      ),
    );

    if (created == null) {
      _lastRuntimeBlocker = 'persisted_order_create_failed';
      notifyListeners();
      return null;
    }

    _cartItems = [];
    _promoCode = null;
    _promoDiscount = 0;
    _lastRuntimeBlocker = null;
    await refreshPersistedRuntime();
    notifyListeners();
    return findOrderRecordById(created.id);
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
      _stores.where((store) {
        final q = trimmed.toLowerCase();
        return store.name.toLowerCase().contains(q) ||
            store.cuisine.toLowerCase().contains(q);
      }).toList(),
    );
  }

  List<MockStore> getDiscoveryResults({String? categoryName}) {
    var stores = List<MockStore>.from(_stores);
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
      orElse: () =>
          const MockAddress(id: '', label: '', street: '', detail: ''),
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

  void _handleSessionChanged() {
    unawaited(refreshPersistedRuntime());
  }

  Future<void> refreshPersistedRuntime() async {
    if (_isHydratingPersistedRuntime) {
      return;
    }

    _isHydratingPersistedRuntime = true;
    try {
      if (!RuntimeBackendConfig.current.isConfigured ||
          CustomerSupabaseClient.maybeClient == null &&
              !CustomerSessionController.instance.hasSupabaseBackedSession) {
        _activeOrderRecords = const <CustomerOrderRecord>[];
        _pastOrderRecords = const <CustomerOrderRecord>[];
        _stores = List<MockStore>.from(MockData.stores);
        _menuItemsByStore = <String, List<MockMenuItem>>{};
        _usesPersistedStoreData = false;
        _persistedRuntimeLoaded = false;
        _lastRuntimeBlocker = null;
        notifyListeners();
        return;
      }

      await CustomerSupabaseClient.ensureInitialized();
      final client = CustomerSupabaseClient.maybeClient;
      if (client == null) {
        _lastRuntimeBlocker = 'supabase_runtime_unavailable';
        notifyListeners();
        return;
      }

      final storeRows = await client
          .from('stores')
          .select(
              'id, name, cuisine_type, rating, review_count, avg_prep_time, delivery_radius, status')
          .eq('accepting_orders', true)
          .order('rating', ascending: false);

      final persistedStores = List<Map<String, dynamic>>.from(storeRows)
          .asMap()
          .entries
          .map((entry) => _mapPersistedStore(entry.value, entry.key))
          .toList();

      final menuRows = await client
          .from('store_menu_items')
          .select(
            'id, store_id, name, description, category, price_centavos, image_color_hex, is_popular',
          )
          .eq('is_available', true)
          .order('sort_order', ascending: true)
          .order('id', ascending: true);

      final groupedMenu = <String, List<MockMenuItem>>{};
      for (final row in List<Map<String, dynamic>>.from(menuRows)) {
        final storeId = row['store_id'] as String?;
        if (storeId == null || storeId.isEmpty) {
          continue;
        }
        groupedMenu.putIfAbsent(storeId, () => <MockMenuItem>[]);
        groupedMenu[storeId]!.add(_mapPersistedMenuItem(row));
      }

      _stores = persistedStores.isEmpty
          ? List<MockStore>.from(MockData.stores)
          : persistedStores;
      _menuItemsByStore = groupedMenu;
      _usesPersistedStoreData = persistedStores.isNotEmpty;
      if (CustomerSessionController.instance.hasSupabaseBackedSession) {
        _activeOrderRecords = await _gateway.readActiveOrders();
        _pastOrderRecords = await _gateway.readPastOrders();
      } else {
        _activeOrderRecords = const <CustomerOrderRecord>[];
        _pastOrderRecords = const <CustomerOrderRecord>[];
      }
      _persistedRuntimeLoaded = true;
      _lastRuntimeBlocker = null;
      if (_selectedStoreId != null &&
          !_stores.any((store) => store.id == _selectedStoreId)) {
        _selectedStoreId = _stores.isEmpty ? null : _stores.first.id;
      }
      notifyListeners();
    } catch (error) {
      _lastRuntimeBlocker = error.toString();
      notifyListeners();
    } finally {
      _isHydratingPersistedRuntime = false;
    }
  }

  MockStore _mapPersistedStore(Map<String, dynamic> row, int index) {
    return MockStore(
      id: row['id'] as String? ?? 'persisted-store-$index',
      name: row['name'] as String? ?? 'Saved store',
      cuisine: row['cuisine_type'] as String? ?? 'Open now',
      rating: (row['rating'] as num?)?.toDouble() ?? 4.6,
      reviewCount: (row['review_count'] as num?)?.toInt() ?? 0,
      deliveryTime: row['avg_prep_time'] as String? ?? '25-35 min',
      deliveryFee: 299,
      imageColor:
          index.isEven ? AppTheme.primaryColor : AppTheme.secondaryColor,
      distance: row['delivery_radius'] as String? ?? 'Nearby',
      isFeatured: index < 3,
      promoText: row['status'] == 'open' ? 'Open now' : null,
    );
  }

  MockMenuItem _mapPersistedMenuItem(Map<String, dynamic> row) {
    return MockMenuItem(
      id: row['id'] as String? ?? 'persisted-menu-item',
      name: row['name'] as String? ?? 'Menu item',
      description: row['description'] as String? ?? '',
      price: (row['price_centavos'] as num?)?.toInt() ?? 0,
      category: row['category'] as String? ?? 'Menu',
      imageColor:
          _parseHexColor(row['image_color_hex'] as String? ?? '#FF6B6B'),
      isPopular: row['is_popular'] as bool? ?? false,
    );
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

  static Color _parseHexColor(String value) {
    final normalized = value.replaceFirst('#', '');
    final withAlpha =
        normalized.length == 6 ? 'FF$normalized' : normalized.padLeft(8, 'F');
    return Color(int.tryParse(withAlpha, radix: 16) ?? 0xFFFF6B6B);
  }
}
