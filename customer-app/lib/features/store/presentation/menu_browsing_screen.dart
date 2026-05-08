import 'package:flutter/material.dart';

import '../../../app/router/route_names.dart';
import '../../../core/data/customer_runtime_controller.dart';
import '../../../core/data/mock_data.dart';
import '../../../core/i18n/app_localizations.dart';
import '../../../core/theme/app_theme.dart';
import '../../common/presentation/widgets.dart';

class MenuBrowsingScreen extends StatefulWidget {
  const MenuBrowsingScreen({
    this.storeId,
    super.key,
  });

  final String? storeId;

  @override
  State<MenuBrowsingScreen> createState() => _MenuBrowsingScreenState();
}

class _MenuBrowsingScreenState extends State<MenuBrowsingScreen> {
  int _selectedCategoryIndex = 0;

  void _showMessage(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message)),
    );
  }

  @override
  Widget build(BuildContext context) {
    final runtime = CustomerRuntimeController.instance;

    return ListenableBuilder(
      listenable: runtime,
      builder: (context, _) {
        final store = runtime.resolveStore(widget.storeId);
        final menuItems = runtime.menuItemsForStore(store.id);
        final menuUnavailable = runtime.isStoreMenuUnavailable(store.id);
        final categories =
            menuItems.map((item) => item.category).toSet().toList();
        final selectedIndex = categories.isEmpty
            ? 0
            : _selectedCategoryIndex.clamp(0, categories.length - 1);
        final selectedCategory =
            categories.isEmpty ? null : categories[selectedIndex];
        final filteredItems = selectedCategory == null
            ? const <MockMenuItem>[]
            : menuItems
                .where((item) => item.category == selectedCategory)
                .toList();

        runtime.openStore(store.id, notify: false);

        return Scaffold(
          backgroundColor: AppTheme.backgroundGrey,
          appBar: AppBar(
            title: Text(store.name),
            backgroundColor: AppTheme.white,
            leading: IconButton(
              icon: const Icon(Icons.arrow_back_rounded),
              onPressed: () => Navigator.of(context).pop(),
            ),
            actions: [
              IconButton(
                icon: const Icon(Icons.search_rounded),
                tooltip: context.l10n.raw('Search all stores'),
                onPressed: () {
                  runtime.setSearchQuery(store.name);
                  Navigator.of(context).pushNamed(RouteNames.search);
                },
              ),
            ],
            bottom: PreferredSize(
              preferredSize: const Size.fromHeight(70),
              child: Container(
                color: AppTheme.white,
                padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
                child: Column(
                  children: [
                    Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        context.l10n.raw('Menu categories'),
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w700,
                          letterSpacing: 0.2,
                          color: AppTheme.textSecondary,
                        ),
                      ),
                    ),
                    const SizedBox(height: 8),
                    CategoryChipRow(
                      categories: categories,
                      selectedIndex: selectedIndex,
                      onSelected: (index) =>
                          setState(() => _selectedCategoryIndex = index),
                    ),
                  ],
                ),
              ),
            ),
          ),
          body: ListView(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 100),
            children: [
              _StoreMenuHeader(
                storeName: store.name,
                deliveryTime: store.deliveryTime,
                deliveryFee: store.deliveryFee,
                rating: store.rating,
                cartItemCount: runtime.cartItemCount,
              ),
              const SizedBox(height: 16),
              if (menuUnavailable)
                EmptyState(
                  icon: Icons.menu_book_outlined,
                  title: context.l10n.raw('Menu unavailable right now'),
                  subtitle: context.l10n.raw(
                    'This store does not have a live orderable menu yet. Please try another store.',
                  ),
                  actionLabel: context.l10n.raw('Browse Restaurants'),
                  onAction: () =>
                      Navigator.of(context).pushNamed(RouteNames.home),
                )
              else
                MenuSectionList(
                  categories: const [],
                  selectedIndex: 0,
                  onSelected: (_) {},
                  headerTitle: selectedCategory,
                  headerCount: filteredItems.length,
                  includeHeaderCount: true,
                  items: filteredItems,
                  emptyTitle: context.l10n.raw('No items here'),
                  emptySubtitle: context.l10n.raw(
                    'This category has no items right now',
                  ),
                  onAddItem: (item) {
                    final outcome = runtime.addMenuItem(
                      storeId: store.id,
                      item: item,
                    );
                    if (outcome == CartAddOutcome.unavailable) {
                      _showMessage(
                        'This store menu is unavailable right now. Please try another store.',
                      );
                      return;
                    }
                    _showMessage(
                      outcome == CartAddOutcome.replacedStore
                          ? 'Started a new cart for ${store.name}.'
                          : '${item.name} added to cart.',
                    );
                  },
                ),
            ],
          ),
          bottomNavigationBar: BottomCTABar(
            label: runtime.cartItemCount > 0
                ? context.l10n.raw('View cart')
                : menuUnavailable
                    ? context.l10n.raw('Menu Unavailable')
                    : context.l10n.raw('Add items'),
            sublabel: runtime.cartItemCount > 0
                ? '${runtime.cartItemCount} items'
                : menuUnavailable
                    ? context.l10n.raw('Try another store')
                    : store.name,
            trailingText: runtime.cartItemCount > 0
                ? formatCustomerMoney(runtime.cartTotal)
                : null,
            onPressed: runtime.cartItemCount > 0
                ? () => Navigator.of(context).pushNamed(RouteNames.cart)
                : menuUnavailable
                    ? null
                    : () => Navigator.of(context).pushNamed(RouteNames.cart),
          ),
        );
      },
    );
  }
}

class _StoreMenuHeader extends StatelessWidget {
  const _StoreMenuHeader({
    required this.storeName,
    required this.deliveryTime,
    required this.deliveryFee,
    required this.rating,
    required this.cartItemCount,
  });

  final String storeName;
  final String deliveryTime;
  final int deliveryFee;
  final double rating;
  final int cartItemCount;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.white,
        borderRadius: BorderRadius.circular(AppTheme.cardRadius),
        border: Border.all(color: AppTheme.borderColor),
        boxShadow: [AppTheme.softShadow(alpha: 0.03)],
      ),
      child: Row(
        children: [
          Container(
            width: 56,
            height: 56,
            decoration: BoxDecoration(
              color: AppTheme.primaryColor.withValues(alpha: 0.10),
              borderRadius: BorderRadius.circular(16),
            ),
            child: const Icon(
              Icons.restaurant_menu_rounded,
              color: AppTheme.primaryColor,
              size: 28,
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  storeName,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w900,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 4),
                DeliveryMetaRow(
                  rating: rating,
                  deliveryTime: deliveryTime,
                  deliveryFee: deliveryFee,
                  compact: true,
                ),
                const SizedBox(height: 4),
                Text(
                  cartItemCount > 0
                      ? '$cartItemCount item${cartItemCount == 1 ? '' : 's'} in cart'
                      : 'Choose items to start your order',
                  style: TextStyle(
                    fontSize: 12,
                    color: AppTheme.textSecondary,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
