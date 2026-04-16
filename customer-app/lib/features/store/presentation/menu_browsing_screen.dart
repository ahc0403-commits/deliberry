import 'package:flutter/material.dart';

import '../../../app/router/route_names.dart';
import '../../../core/data/customer_runtime_controller.dart';
import '../../../core/data/mock_data.dart';
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
            title: Text('${store.name} Menu'),
            backgroundColor: Colors.white,
            leading: IconButton(
              icon: const Icon(Icons.arrow_back_rounded),
              onPressed: () => Navigator.of(context).pop(),
            ),
            actions: [
              IconButton(
                icon: const Icon(Icons.search_rounded),
                tooltip: 'Search all stores',
                onPressed: () {
                  runtime.setSearchQuery(store.name);
                  Navigator.of(context).pushNamed(RouteNames.search);
                },
              ),
            ],
            bottom: PreferredSize(
              preferredSize: const Size.fromHeight(70),
              child: Container(
                color: Colors.white,
                padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
                child: Column(
                  children: [
                    Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        'Browse by section',
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
              FeatureHeroCard(
                eyebrow: 'Menu browsing',
                title: 'Pick items and keep your cart in view',
                subtitle:
                    'Your cart stays attached to ${store.name} while you move between categories.',
                icon: Icons.restaurant_menu_rounded,
                badge: runtime.cartItemCount > 0
                    ? '${runtime.cartItemCount} item${runtime.cartItemCount == 1 ? '' : 's'} ready'
                    : 'No items added yet',
              ),
              const SizedBox(height: 16),
              if (menuUnavailable)
                EmptyState(
                  icon: Icons.menu_book_outlined,
                  title: 'Menu unavailable right now',
                  subtitle:
                      'This store does not have a live orderable menu yet. Please try another store.',
                  actionLabel: 'Browse Restaurants',
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
                  emptyTitle: 'No items here',
                  emptySubtitle: 'This category has no items right now',
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
                ? 'View Cart'
                : menuUnavailable
                    ? 'Menu Unavailable'
                    : 'Start Order',
            sublabel: runtime.cartItemCount > 0
                ? '${runtime.cartItemCount} items'
                : menuUnavailable
                    ? 'Try another store'
                    : store.name,
            trailingText: runtime.cartItemCount > 0
                ? '\$${formatCentavos(runtime.cartTotal)}'
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
