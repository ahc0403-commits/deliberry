import 'package:flutter/material.dart';

// R-010/R-011: Money fields are integer centavos (not float dollars).
// R-040/R-041: Status values use canonical enum values from DomainContractBridge.
// R-050/DATE.md: Timestamps are UTC ISO 8601 strings ending with Z.

// ── Models ──────────────────────────────────────────────────────────────

class MockStore {
  const MockStore({
    required this.id,
    required this.name,
    required this.cuisine,
    required this.rating,
    required this.reviewCount,
    required this.deliveryTime,
    required this.deliveryFee,
    required this.imageColor,
    this.distance = '1.2 km',
    this.isFeatured = false,
    this.promoText,
  });

  final String id;
  final String name;
  final String cuisine;
  final double rating;
  final int reviewCount;
  final String deliveryTime;
  final int deliveryFee; // centavos (R-010)
  final Color imageColor;
  final String distance;
  final bool isFeatured;
  final String? promoText;
}

class MockMenuItem {
  const MockMenuItem({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    required this.category,
    required this.imageColor,
    this.isPopular = false,
  });

  final String id;
  final String name;
  final String description;
  final int price; // centavos (R-010)
  final String category;
  final Color imageColor;
  final bool isPopular;
}

class MockCartItem {
  const MockCartItem({
    required this.menuItem,
    required this.quantity,
    this.notes,
    this.modifiers = const [],
  });

  final MockMenuItem menuItem;
  final int quantity;
  final String? notes;
  final List<String> modifiers;

  int get total => menuItem.price * quantity; // centavos (R-010)
}

class MockOrder {
  const MockOrder({
    required this.id,
    required this.storeName,
    required this.status,
    required this.total,
    required this.itemCount,
    required this.createdAt,
    required this.statusColor,
  });

  final String id;
  final String storeName;
  final String status; // canonical enum value (R-041)
  final int total; // centavos (R-010)
  final int itemCount;
  final String createdAt; // UTC ISO 8601 (R-050)
  final Color statusColor;
}

class MockAddress {
  const MockAddress({
    required this.id,
    required this.label,
    required this.street,
    required this.detail,
    this.isDefault = false,
  });

  final String id;
  final String label;
  final String street;
  final String detail;
  final bool isDefault;
}

class MockNotification {
  const MockNotification({
    required this.id,
    required this.title,
    required this.body,
    required this.createdAt,
    required this.icon,
    this.isRead = false,
  });

  final String id;
  final String title;
  final String body;
  final String createdAt; // UTC ISO 8601 (R-050)
  final IconData icon;
  final bool isRead;
}

class MockCategory {
  const MockCategory({
    required this.id,
    required this.name,
    required this.icon,
    required this.color,
  });

  final String id;
  final String name;
  final IconData icon;
  final Color color;
}

class MockPromotion {
  const MockPromotion({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.discount,
    required this.gradientColors,
  });

  final String id;
  final String title;
  final String subtitle;
  final String discount;
  final List<Color> gradientColors;
}

// ── Display Helpers (presentation layer) ────────────────────────────────

String formatCentavos(int centavos) {
  return (centavos / 100).toStringAsFixed(2);
}

String formatOrderStatus(String canonicalStatus) {
  const labels = {
    'draft': 'Draft',
    'pending': 'Pending',
    'confirmed': 'Confirmed',
    'preparing': 'Preparing',
    'ready': 'Ready',
    'in_transit': 'On the way',
    'delivered': 'Delivered',
    'cancelled': 'Cancelled',
    'disputed': 'Disputed',
  };
  return labels[canonicalStatus] ?? canonicalStatus;
}

String formatRelativeTime(String utcIso) {
  final parsed = DateTime.tryParse(utcIso);
  if (parsed == null) return utcIso;
  final now = DateTime.now().toUtc();
  final diff = now.difference(parsed);
  if (diff.inMinutes < 1) return 'Just now';
  if (diff.inMinutes < 60) return '${diff.inMinutes} min ago';
  if (diff.inHours < 24) return '${diff.inHours} hour${diff.inHours > 1 ? 's' : ''} ago';
  if (diff.inDays == 1) return 'Yesterday';
  if (diff.inDays < 7) return '${diff.inDays} days ago';
  final month = _monthAbbr(parsed.month);
  return '$month ${parsed.day}';
}

String formatOrderDate(String utcIso) {
  final parsed = DateTime.tryParse(utcIso);
  if (parsed == null) return utcIso;
  final local = parsed.toLocal();
  final now = DateTime.now();
  final today = DateTime(now.year, now.month, now.day);
  final orderDay = DateTime(local.year, local.month, local.day);
  final hour = local.hour > 12
      ? local.hour - 12
      : (local.hour == 0 ? 12 : local.hour);
  final minute = local.minute.toString().padLeft(2, '0');
  final suffix = local.hour >= 12 ? 'PM' : 'AM';
  final timeStr = '$hour:$minute $suffix';
  if (orderDay == today) return 'Today, $timeStr';
  if (orderDay == today.subtract(const Duration(days: 1))) {
    return 'Yesterday';
  }
  final month = _monthAbbr(local.month);
  return '$month ${local.day}';
}

String _monthAbbr(int month) {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  return months[month - 1];
}

// ── Mock Data Instances ─────────────────────────────────────────────────

abstract final class MockData {
  static const categories = [
    MockCategory(
      id: 'pizza',
      name: 'Pizza',
      icon: Icons.local_pizza_outlined,
      color: Color(0xFFFF6B6B),
    ),
    MockCategory(
      id: 'burger',
      name: 'Burgers',
      icon: Icons.lunch_dining_outlined,
      color: Color(0xFFFFB74D),
    ),
    MockCategory(
      id: 'sushi',
      name: 'Sushi',
      icon: Icons.set_meal_outlined,
      color: Color(0xFF4FC3F7),
    ),
    MockCategory(
      id: 'salad',
      name: 'Healthy',
      icon: Icons.eco_outlined,
      color: Color(0xFF81C784),
    ),
    MockCategory(
      id: 'dessert',
      name: 'Desserts',
      icon: Icons.cake_outlined,
      color: Color(0xFFCE93D8),
    ),
    MockCategory(
      id: 'coffee',
      name: 'Coffee',
      icon: Icons.coffee_outlined,
      color: Color(0xFFA1887F),
    ),
    MockCategory(
      id: 'mexican',
      name: 'Mexican',
      icon: Icons.restaurant_outlined,
      color: Color(0xFFE57373),
    ),
    MockCategory(
      id: 'asian',
      name: 'Asian',
      icon: Icons.ramen_dining_outlined,
      color: Color(0xFFFFD54F),
    ),
  ];

  static const stores = [
    MockStore(
      id: 'store-1',
      name: 'Burger Republic',
      cuisine: 'Burgers & Fries',
      rating: 4.8,
      reviewCount: 324,
      deliveryTime: '20-30 min',
      deliveryFee: 299,
      imageColor: Color(0xFFFFB74D),
      isFeatured: true,
      promoText: '20% off first order',
    ),
    MockStore(
      id: 'store-2',
      name: 'Sushi Master',
      cuisine: 'Japanese',
      rating: 4.9,
      reviewCount: 512,
      deliveryTime: '25-35 min',
      deliveryFee: 349,
      imageColor: Color(0xFF4FC3F7),
      isFeatured: true,
    ),
    MockStore(
      id: 'store-3',
      name: 'Pizza Nova',
      cuisine: 'Italian Pizza',
      rating: 4.6,
      reviewCount: 891,
      deliveryTime: '15-25 min',
      deliveryFee: 199,
      imageColor: Color(0xFFFF6B6B),
      promoText: 'Free delivery',
    ),
    MockStore(
      id: 'store-4',
      name: 'Green Bowl',
      cuisine: 'Healthy & Salads',
      rating: 4.7,
      reviewCount: 203,
      deliveryTime: '20-30 min',
      deliveryFee: 249,
      imageColor: Color(0xFF81C784),
    ),
    MockStore(
      id: 'store-5',
      name: 'Taco Loco',
      cuisine: 'Mexican',
      rating: 4.5,
      reviewCount: 167,
      deliveryTime: '25-40 min',
      deliveryFee: 299,
      imageColor: Color(0xFFE57373),
      isFeatured: true,
      promoText: '2x1 Tuesdays',
    ),
    MockStore(
      id: 'store-6',
      name: 'Café Aroma',
      cuisine: 'Coffee & Pastries',
      rating: 4.8,
      reviewCount: 445,
      deliveryTime: '15-20 min',
      deliveryFee: 149,
      imageColor: Color(0xFFA1887F),
    ),
  ];

  static const menuItems = [
    MockMenuItem(
      id: 'item-1',
      name: 'Classic Smash Burger',
      description: 'Double patty, cheddar, pickles, special sauce',
      price: 1299,
      category: 'Popular',
      imageColor: Color(0xFFFFB74D),
      isPopular: true,
    ),
    MockMenuItem(
      id: 'item-2',
      name: 'Truffle Fries',
      description: 'Crispy fries with truffle oil and parmesan',
      price: 749,
      category: 'Sides',
      imageColor: Color(0xFFFFD54F),
    ),
    MockMenuItem(
      id: 'item-3',
      name: 'Spicy Chicken Sandwich',
      description: 'Crispy chicken, jalapeño slaw, chipotle mayo',
      price: 1149,
      category: 'Popular',
      imageColor: Color(0xFFFF8A65),
      isPopular: true,
    ),
    MockMenuItem(
      id: 'item-4',
      name: 'Caesar Salad',
      description: 'Romaine, croutons, parmesan, caesar dressing',
      price: 999,
      category: 'Salads',
      imageColor: Color(0xFF81C784),
    ),
    MockMenuItem(
      id: 'item-5',
      name: 'Oreo Milkshake',
      description: 'Creamy vanilla shake with crushed Oreos',
      price: 699,
      category: 'Drinks',
      imageColor: Color(0xFFCE93D8),
    ),
    MockMenuItem(
      id: 'item-6',
      name: 'BBQ Bacon Burger',
      description: 'Smoked bacon, BBQ glaze, onion rings, cheddar',
      price: 1499,
      category: 'Popular',
      imageColor: Color(0xFFE57373),
      isPopular: true,
    ),
    MockMenuItem(
      id: 'item-7',
      name: 'Mozzarella Sticks',
      description: 'Breaded mozzarella with marinara dip',
      price: 649,
      category: 'Sides',
      imageColor: Color(0xFFFFCC80),
    ),
    MockMenuItem(
      id: 'item-8',
      name: 'Lemonade',
      description: 'Fresh-squeezed lemonade with mint',
      price: 449,
      category: 'Drinks',
      imageColor: Color(0xFFFFF176),
    ),
  ];

  static final cartItems = [
    MockCartItem(
      menuItem: menuItems[0],
      quantity: 2,
      modifiers: ['Extra cheese', 'No pickles'],
    ),
    MockCartItem(
      menuItem: menuItems[1],
      quantity: 1,
    ),
    MockCartItem(
      menuItem: menuItems[4],
      quantity: 1,
      notes: 'Extra whipped cream',
    ),
  ];

  static const activeOrders = [
    MockOrder(
      id: 'ORD-2847',
      storeName: 'Burger Republic',
      status: 'preparing',
      total: 3347,
      itemCount: 3,
      createdAt: '2026-03-17T17:30:00Z',
      statusColor: Color(0xFFFFB74D),
    ),
    MockOrder(
      id: 'ORD-2845',
      storeName: 'Sushi Master',
      status: 'in_transit',
      total: 2897,
      itemCount: 2,
      createdAt: '2026-03-17T16:15:00Z',
      statusColor: Color(0xFF4FC3F7),
    ),
  ];

  static const pastOrders = [
    MockOrder(
      id: 'ORD-2831',
      storeName: 'Pizza Nova',
      status: 'delivered',
      total: 2298,
      itemCount: 2,
      createdAt: '2026-03-16T19:45:00Z',
      statusColor: Color(0xFF81C784),
    ),
    MockOrder(
      id: 'ORD-2820',
      storeName: 'Taco Loco',
      status: 'delivered',
      total: 1847,
      itemCount: 4,
      createdAt: '2026-03-12T21:00:00Z',
      statusColor: Color(0xFF81C784),
    ),
    MockOrder(
      id: 'ORD-2815',
      storeName: 'Café Aroma',
      status: 'delivered',
      total: 1248,
      itemCount: 2,
      createdAt: '2026-03-10T18:30:00Z',
      statusColor: Color(0xFF81C784),
    ),
  ];

  static const addresses = [
    MockAddress(
      id: 'addr-1',
      label: 'Home',
      street: '742 Evergreen Terrace',
      detail: 'Apt 3B, Springfield',
      isDefault: true,
    ),
    MockAddress(
      id: 'addr-2',
      label: 'Work',
      street: '100 Innovation Drive',
      detail: 'Floor 5, Tech Park',
    ),
    MockAddress(
      id: 'addr-3',
      label: 'Gym',
      street: '55 Fitness Blvd',
      detail: 'Unit 12',
    ),
  ];

  static const notifications = [
    MockNotification(
      id: 'notif-1',
      title: 'Your order is on the way!',
      body: 'Burger Republic driver is heading to you. ETA 10 min.',
      createdAt: '2026-03-17T20:28:00Z',
      icon: Icons.delivery_dining,
    ),
    MockNotification(
      id: 'notif-2',
      title: '20% off your next order',
      body: 'Use code SAVE20 at checkout. Valid until Sunday.',
      createdAt: '2026-03-17T19:30:00Z',
      icon: Icons.local_offer_outlined,
      isRead: true,
    ),
    MockNotification(
      id: 'notif-3',
      title: 'Rate your Sushi Master order',
      body: 'How was your recent order? Leave a review and help others.',
      createdAt: '2026-03-17T17:30:00Z',
      icon: Icons.star_outline,
      isRead: true,
    ),
    MockNotification(
      id: 'notif-4',
      title: 'New store near you',
      body: 'Green Bowl just opened 0.5 km from your location!',
      createdAt: '2026-03-16T15:00:00Z',
      icon: Icons.storefront_outlined,
      isRead: true,
    ),
  ];

  static const promotions = [
    MockPromotion(
      id: 'promo-1',
      title: 'Free Delivery Weekend',
      subtitle: 'On all orders over \$15',
      discount: 'FREE',
      gradientColors: [Color(0xFFFF4B3A), Color(0xFFFF8A65)],
    ),
    MockPromotion(
      id: 'promo-2',
      title: 'New User Special',
      subtitle: 'Your first 3 orders',
      discount: '30% OFF',
      gradientColors: [Color(0xFF7C4DFF), Color(0xFFB388FF)],
    ),
    MockPromotion(
      id: 'promo-3',
      title: 'Lunch Deal',
      subtitle: 'Mon-Fri, 11am-2pm',
      discount: '\$5 OFF',
      gradientColors: [Color(0xFF00BCD4), Color(0xFF4DD0E1)],
    ),
  ];

  static const menuCategories = [
    'Popular',
    'Sides',
    'Salads',
    'Drinks',
  ];

  static const recentSearches = [
    'Burger',
    'Pizza',
    'Sushi',
    'Healthy bowls',
    'Coffee',
  ];

  static const filterOptions = {
    'Sort by': ['Recommended', 'Delivery time', 'Rating', 'Distance'],
    'Cuisine': ['All', 'American', 'Japanese', 'Italian', 'Mexican', 'Healthy'],
    'Price range': ['\$', '\$\$', '\$\$\$', '\$\$\$\$'],
    'Dietary': ['Vegetarian', 'Vegan', 'Gluten-free', 'Halal'],
  };

  static int get cartSubtotal =>
      cartItems.fold(0, (sum, item) => sum + item.total);
  static int get cartDeliveryFee => 299;
  static int get cartServiceFee => 149;
  static int get cartTotal =>
      cartSubtotal + cartDeliveryFee + cartServiceFee;
}
