import 'package:flutter/material.dart';

// R-010/R-011: Money fields are integer money units (not float values).
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
    this.storeType = 'direct',
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
  final int deliveryFee; // integer money units (R-010)
  final Color imageColor;
  final String storeType;
  final String distance;
  final bool isFeatured;
  final String? promoText;

  bool get isDirect => storeType == 'direct';
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
  final int price; // integer money units (R-010)
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

  int get total => menuItem.price * quantity; // integer money units (R-010)
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
  final int total; // integer money units (R-010)
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

String formatCentavos(int amount) {
  return amount.toString();
}

String formatCustomerMoney(
  int amount, {
  String currency = 'VND',
}) {
  if (currency == 'USD') {
    final dollars = (amount / 100).toStringAsFixed(2);
    return 'US\$$dollars';
  }

  final digits = amount.abs().toString();
  final buffer = StringBuffer();
  for (var i = 0; i < digits.length; i++) {
    final remaining = digits.length - i;
    buffer.write(digits[i]);
    if (remaining > 1 && remaining % 3 == 1) {
      buffer.write(',');
    }
  }
  final prefix = amount < 0 ? '-₫' : '₫';
  return '$prefix$buffer';
}

String formatOrderStatus(
  String canonicalStatus, {
  String languageCode = 'en',
}) {
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
  final label = labels[canonicalStatus] ?? canonicalStatus;
  switch (languageCode) {
    case 'ko':
      return switch (label) {
        'Draft' => '임시',
        'Pending' => '대기 중',
        'Confirmed' => '주문 확인',
        'Preparing' => '준비 중',
        'Ready' => '준비 완료',
        'On the way' => '배달 중',
        'Delivered' => '배달 완료',
        'Cancelled' => '취소됨',
        'Disputed' => '분쟁',
        _ => label,
      };
    case 'vi':
      return switch (label) {
        'Draft' => 'Nháp',
        'Pending' => 'Đang chờ',
        'Confirmed' => 'Đã xác nhận',
        'Preparing' => 'Đang chuẩn bị',
        'Ready' => 'Sẵn sàng giao',
        'On the way' => 'Đang giao',
        'Delivered' => 'Đã giao',
        'Cancelled' => 'Đã hủy',
        'Disputed' => 'Tranh chấp',
        _ => label,
      };
    default:
      return label;
  }
}

String formatRelativeTime(
  String utcIso, {
  String languageCode = 'en',
}) {
  final parsed = DateTime.tryParse(utcIso);
  if (parsed == null) return utcIso;
  final local = parsed.toLocal();
  final now = DateTime.now();
  final diff = now.difference(local);
  if (diff.inMinutes < 1) {
    return switch (languageCode) {
      'ko' => '방금 전',
      'vi' => 'Vừa xong',
      _ => 'Just now',
    };
  }
  if (diff.inMinutes < 60) {
    return switch (languageCode) {
      'ko' => '${diff.inMinutes}분 전',
      'vi' => '${diff.inMinutes} phút trước',
      _ => '${diff.inMinutes} min ago',
    };
  }
  if (diff.inHours < 24) {
    return switch (languageCode) {
      'ko' => '${diff.inHours}시간 전',
      'vi' => '${diff.inHours} giờ trước',
      _ => '${diff.inHours} hour${diff.inHours > 1 ? 's' : ''} ago',
    };
  }
  if (diff.inDays == 1) {
    return switch (languageCode) {
      'ko' => '어제',
      'vi' => 'Hôm qua',
      _ => 'Yesterday',
    };
  }
  if (diff.inDays < 7) {
    return switch (languageCode) {
      'ko' => '${diff.inDays}일 전',
      'vi' => '${diff.inDays} ngày trước',
      _ => '${diff.inDays} days ago',
    };
  }
  return _formatMonthDay(
    local,
    languageCode: languageCode,
  );
}

String formatOrderDate(
  String utcIso, {
  String languageCode = 'en',
}) {
  final parsed = DateTime.tryParse(utcIso);
  if (parsed == null) return utcIso;
  final local = parsed.toLocal();
  final now = DateTime.now();
  final today = DateTime(now.year, now.month, now.day);
  final orderDay = DateTime(local.year, local.month, local.day);
  final timeStr = _formatLocalTime(local);
  if (orderDay == today) {
    return switch (languageCode) {
      'ko' => '오늘 · $timeStr',
      'vi' => 'Hôm nay · $timeStr',
      _ => 'Today · $timeStr',
    };
  }
  if (orderDay == today.subtract(const Duration(days: 1))) {
    return switch (languageCode) {
      'ko' => '어제 · $timeStr',
      'vi' => 'Hôm qua · $timeStr',
      _ => 'Yesterday · $timeStr',
    };
  }
  return '${_formatMonthDay(local, languageCode: languageCode)} · $timeStr';
}

String formatItemCount(
  int count, {
  String languageCode = 'en',
}) {
  return switch (languageCode) {
    'ko' => '$count개',
    'vi' => '$count món',
    _ => '$count item${count == 1 ? '' : 's'}',
  };
}

String _formatLocalTime(DateTime local) {
  final hour = local.hour.toString().padLeft(2, '0');
  final minute = local.minute.toString().padLeft(2, '0');
  return '$hour:$minute';
}

String _formatMonthDay(
  DateTime local, {
  String languageCode = 'en',
}) {
  switch (languageCode) {
    case 'ko':
      return '${local.month}월 ${local.day}일';
    case 'vi':
      return '${local.day} thg ${local.month}';
    default:
      final month = _monthAbbr(local.month);
      return '$month ${local.day}';
  }
}

String _monthAbbr(int month) {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return months[month - 1];
}

// ── Mock Data Instances ─────────────────────────────────────────────────

abstract final class MockData {
  static const categories = [
    MockCategory(
      id: 'pho',
      name: 'Pho',
      icon: Icons.ramen_dining_outlined,
      color: Color(0xFFE91400),
    ),
    MockCategory(
      id: 'com',
      name: 'Com',
      icon: Icons.lunch_dining_outlined,
      color: Color(0xFFFF4B32),
    ),
    MockCategory(
      id: 'banh-mi',
      name: 'Banh Mi',
      icon: Icons.breakfast_dining_outlined,
      color: Color(0xFFB91005),
    ),
    MockCategory(
      id: 'bun',
      name: 'Bun',
      icon: Icons.eco_outlined,
      color: Color(0xFF087A3A),
    ),
    MockCategory(
      id: 'dessert',
      name: 'Desserts',
      icon: Icons.cake_outlined,
      color: Color(0xFFFF7A59),
    ),
    MockCategory(
      id: 'coffee',
      name: 'Coffee',
      icon: Icons.coffee_outlined,
      color: Color(0xFF141414),
    ),
    MockCategory(
      id: 'tra-sua',
      name: 'Tra Sua',
      icon: Icons.local_cafe_outlined,
      color: Color(0xFFD92D20),
    ),
    MockCategory(
      id: 'seafood',
      name: 'Seafood',
      icon: Icons.set_meal_outlined,
      color: Color(0xFFB86B00),
    ),
  ];

  static const stores = [
    MockStore(
      id: 'store-1',
      name: 'Com Tam 1989',
      cuisine: 'Com Tam',
      rating: 4.8,
      reviewCount: 324,
      deliveryTime: '20-30 min',
      deliveryFee: 29900,
      imageColor: Color(0xFFFF4B32),
      isFeatured: true,
      promoText: 'Save ₫50,000 on your first order',
    ),
    MockStore(
      id: 'store-2',
      name: 'Pho Thi',
      cuisine: 'Pho & Bun',
      rating: 4.9,
      reviewCount: 512,
      deliveryTime: '25-35 min',
      deliveryFee: 34900,
      imageColor: Color(0xFFB91005),
      isFeatured: true,
    ),
    MockStore(
      id: 'store-3',
      name: 'Banh Mi 362',
      cuisine: 'Banh Mi & Snacks',
      rating: 4.6,
      reviewCount: 891,
      deliveryTime: '15-25 min',
      deliveryFee: 19900,
      imageColor: Color(0xFFE91400),
      promoText: 'Free delivery over ₫150,000',
    ),
    MockStore(
      id: 'store-4',
      name: 'Bep Nha Sai Gon',
      cuisine: 'Home-style Vietnamese',
      rating: 4.7,
      reviewCount: 203,
      deliveryTime: '20-30 min',
      deliveryFee: 24900,
      imageColor: Color(0xFF087A3A),
    ),
    MockStore(
      id: 'store-5',
      name: 'Tra Sua Nha Lam',
      cuisine: 'Milk Tea & Desserts',
      rating: 4.5,
      reviewCount: 167,
      deliveryTime: '25-40 min',
      deliveryFee: 29900,
      imageColor: Color(0xFFD92D20),
      isFeatured: true,
      promoText: 'Buy 1 get 1 every Tuesday',
    ),
    MockStore(
      id: 'store-6',
      name: 'Ca Phe Nha Lam',
      cuisine: 'Coffee & Pastries',
      rating: 4.8,
      reviewCount: 445,
      deliveryTime: '15-20 min',
      deliveryFee: 14900,
      imageColor: Color(0xFF141414),
    ),
  ];

  static const menuItems = [
    MockMenuItem(
      id: 'item-1',
      name: 'Com tam suon nuong',
      description: 'Grilled pork chop with broken rice, egg, and pickles',
      price: 129900,
      category: 'Popular',
      imageColor: Color(0xFFFF4B32),
      isPopular: true,
    ),
    MockMenuItem(
      id: 'item-2',
      name: 'Cha gio hai san',
      description: 'Crispy seafood spring rolls with sweet chili dip',
      price: 74900,
      category: 'Sides',
      imageColor: Color(0xFFB86B00),
    ),
    MockMenuItem(
      id: 'item-3',
      name: 'Banh mi ga nuong',
      description: 'Charcoal grilled chicken with pate and pickled vegetables',
      price: 114900,
      category: 'Popular',
      imageColor: Color(0xFFFF7A59),
      isPopular: true,
    ),
    MockMenuItem(
      id: 'item-4',
      name: 'Goi cuon tom thit',
      description: 'Fresh rice paper rolls with shrimp, pork, and herbs',
      price: 99900,
      category: 'Salads',
      imageColor: Color(0xFF087A3A),
    ),
    MockMenuItem(
      id: 'item-5',
      name: 'Tra dao cam sa',
      description: 'Peach tea with lemongrass, orange, and aloe',
      price: 69900,
      category: 'Drinks',
      imageColor: Color(0xFFB91005),
    ),
    MockMenuItem(
      id: 'item-6',
      name: 'Bun bo Hue dac biet',
      description: 'Spicy beef noodle soup with cha, beef shank, and herbs',
      price: 149900,
      category: 'Popular',
      imageColor: Color(0xFFD92D20),
      isPopular: true,
    ),
    MockMenuItem(
      id: 'item-7',
      name: 'Banh flan caramel',
      description: 'Silky caramel custard served chilled',
      price: 64900,
      category: 'Sides',
      imageColor: Color(0xFFFFB020),
    ),
    MockMenuItem(
      id: 'item-8',
      name: 'Ca phe sua da',
      description: 'Vietnamese iced coffee with condensed milk',
      price: 44900,
      category: 'Drinks',
      imageColor: Color(0xFFB86B00),
    ),
  ];

  static final cartItems = [
    MockCartItem(
      menuItem: menuItems[0],
      quantity: 2,
      modifiers: ['Extra egg', 'Less fish sauce'],
    ),
    MockCartItem(
      menuItem: menuItems[1],
      quantity: 1,
    ),
    MockCartItem(
      menuItem: menuItems[4],
      quantity: 1,
      notes: 'Less ice',
    ),
  ];

  static const activeOrders = [
    MockOrder(
      id: 'ORD-2847',
      storeName: 'Com Tam 1989',
      status: 'preparing',
      total: 334700,
      itemCount: 3,
      createdAt: '2026-03-17T17:30:00Z',
      statusColor: Color(0xFFB86B00),
    ),
    MockOrder(
      id: 'ORD-2845',
      storeName: 'Pho Thi',
      status: 'in_transit',
      total: 289700,
      itemCount: 2,
      createdAt: '2026-03-17T16:15:00Z',
      statusColor: Color(0xFFE91400),
    ),
  ];

  static const pastOrders = [
    MockOrder(
      id: 'ORD-2831',
      storeName: 'Banh Mi 362',
      status: 'delivered',
      total: 229800,
      itemCount: 2,
      createdAt: '2026-03-16T19:45:00Z',
      statusColor: Color(0xFF087A3A),
    ),
    MockOrder(
      id: 'ORD-2820',
      storeName: 'Tra Sua Nha Lam',
      status: 'delivered',
      total: 184700,
      itemCount: 4,
      createdAt: '2026-03-12T21:00:00Z',
      statusColor: Color(0xFF087A3A),
    ),
    MockOrder(
      id: 'ORD-2815',
      storeName: 'Ca Phe Nha Lam',
      status: 'delivered',
      total: 124800,
      itemCount: 2,
      createdAt: '2026-03-10T18:30:00Z',
      statusColor: Color(0xFF087A3A),
    ),
  ];

  static const addresses = [
    MockAddress(
      id: 'addr-1',
      label: 'Home',
      street: '120 Nguyen Huu Canh',
      detail: 'Ward 22, Binh Thanh',
      isDefault: true,
    ),
    MockAddress(
      id: 'addr-2',
      label: 'Work',
      street: '25 Le Duan',
      detail: 'Floor 8, District 1',
    ),
    MockAddress(
      id: 'addr-3',
      label: 'Gym',
      street: '88 Vo Van Tan',
      detail: 'Ward 6, District 3',
    ),
  ];

  static const notifications = [
    MockNotification(
      id: 'notif-1',
      title: 'Your order is on the way!',
      body: 'Com Tam 1989 driver is heading to you. ETA 10 min.',
      createdAt: '2026-03-17T20:28:00Z',
      icon: Icons.delivery_dining,
    ),
    MockNotification(
      id: 'notif-2',
      title: 'Save ₫50,000 on your next order',
      body: 'Use code SAVE50K at checkout. Valid until Sunday.',
      createdAt: '2026-03-17T19:30:00Z',
      icon: Icons.local_offer_outlined,
      isRead: true,
    ),
    MockNotification(
      id: 'notif-3',
      title: 'Rate your Pho Thi order',
      body: 'How was your recent order? Leave a review and help others.',
      createdAt: '2026-03-17T17:30:00Z',
      icon: Icons.star_outline,
      isRead: true,
    ),
    MockNotification(
      id: 'notif-4',
      title: 'New store near you',
      body: 'Bep Nha Sai Gon just opened 0.5 km from your location!',
      createdAt: '2026-03-16T15:00:00Z',
      icon: Icons.storefront_outlined,
      isRead: true,
    ),
  ];

  static const promotions = [
    MockPromotion(
      id: 'promo-1',
      title: 'Weekend Delivery Perk',
      subtitle: 'On all orders over ₫150,000',
      discount: 'FREE',
      gradientColors: [Color(0xFFE91400), Color(0xFFB91005)],
    ),
    MockPromotion(
      id: 'promo-2',
      title: 'New User Welcome',
      subtitle: 'Your first 3 orders',
      discount: '30% OFF',
      gradientColors: [Color(0xFFFF4B32), Color(0xFFE91400)],
    ),
    MockPromotion(
      id: 'promo-3',
      title: 'Office Lunch Deal',
      subtitle: 'Mon-Fri, 11am-2pm',
      discount: '₫50K OFF',
      gradientColors: [Color(0xFFB91005), Color(0xFFFF7A59)],
    ),
  ];

  static const menuCategories = [
    'Popular',
    'Sides',
    'Salads',
    'Drinks',
  ];

  static const recentSearches = [
    'Pho',
    'Com tam',
    'Banh mi',
    'Tra sua',
    'Coffee',
  ];

  static const filterOptions = {
    'Sort by': ['Recommended', 'Delivery time', 'Rating', 'Distance'],
    'Cuisine': [
      'All',
      'Vietnamese',
      'Coffee',
      'Milk tea',
      'Desserts',
      'Seafood'
    ],
    'Price range': ['\$', '\$\$', '\$\$\$', '\$\$\$\$'],
    'Dietary': ['Vegetarian', 'Vegan', 'Gluten-free', 'Halal'],
  };

  static int get cartSubtotal =>
      cartItems.fold(0, (sum, item) => sum + item.total);
  static int get cartDeliveryFee => 29900;
  static int get cartServiceFee => 14900;
  static int get cartTotal => cartSubtotal + cartDeliveryFee + cartServiceFee;
}
