import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../../app/router/route_names.dart';
import '../../../core/data/customer_runtime_controller.dart';
import '../../../core/data/mock_data.dart';
import '../../../core/theme/app_theme.dart';
import '../../common/presentation/widgets.dart';

class StoreDetailScreen extends StatefulWidget {
  const StoreDetailScreen({
    this.storeId,
    super.key,
  });

  final String? storeId;

  @override
  State<StoreDetailScreen> createState() => _StoreDetailScreenState();
}

class _StoreDetailScreenState extends State<StoreDetailScreen> {
  int _selectedCategoryIndex = 0;

  void _showMessage(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message)),
    );
  }

  void _handleAddItem({
    required String storeId,
    required MockMenuItem item,
  }) {
    final runtime = CustomerRuntimeController.instance;
    final outcome = runtime.addMenuItem(storeId: storeId, item: item);
    if (!mounted) return;

    if (outcome == CartAddOutcome.unavailable) {
      _showMessage(
        'This store menu is unavailable right now. Please try another store.',
      );
      return;
    }

    final store = runtime.resolveStore(storeId);
    final replaced = outcome == CartAddOutcome.replacedStore;
    _showMessage(
      replaced
          ? 'Started a new cart for ${store.name}.'
          : '${item.name} added to cart.',
    );
  }

  @override
  Widget build(BuildContext context) {
    final runtime = CustomerRuntimeController.instance;

    return ListenableBuilder(
      listenable: runtime,
      builder: (context, _) {
        final store = runtime.resolveStore(widget.storeId);
        final categories = runtime
            .menuItemsForStore(store.id)
            .map((item) => item.category)
            .toSet()
            .toList();
        final selectedIndex = categories.isEmpty
            ? 0
            : _selectedCategoryIndex.clamp(0, categories.length - 1);
        final selectedCategory =
            categories.isEmpty ? null : categories[selectedIndex];
        final filteredItems = selectedCategory == null
            ? const <MockMenuItem>[]
            : runtime
                .menuItemsForStore(store.id)
                .where((item) => item.category == selectedCategory)
                .toList();

        runtime.openStore(store.id, notify: false);

        return Scaffold(
          body: CustomScrollView(
            slivers: [
              SliverAppBar(
                expandedHeight: 240,
                pinned: true,
                stretch: true,
                backgroundColor: store.imageColor.withValues(alpha: 0.95),
                foregroundColor: Colors.white,
                leading: Padding(
                  padding: const EdgeInsets.all(8),
                  child: CircleAvatar(
                    backgroundColor: Colors.black.withValues(alpha: 0.25),
                    child: IconButton(
                      icon: const Icon(Icons.arrow_back_rounded, size: 20),
                      color: Colors.white,
                      onPressed: () => Navigator.of(context).pop(),
                    ),
                  ),
                ),
                actions: [
                  Padding(
                    padding: const EdgeInsets.all(8),
                    child: CircleAvatar(
                      backgroundColor: Colors.black.withValues(alpha: 0.25),
                      child: IconButton(
                        icon:
                            const Icon(Icons.favorite_border_rounded, size: 20),
                        color: Colors.white,
                        tooltip: 'Favorites are not available yet',
                        onPressed: () => _showMessage(
                          'Favorites are not available yet in this build.',
                        ),
                      ),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.only(right: 8, top: 8, bottom: 8),
                    child: CircleAvatar(
                      backgroundColor: Colors.black.withValues(alpha: 0.25),
                      child: IconButton(
                        icon: const Icon(Icons.share_rounded, size: 20),
                        color: Colors.white,
                        tooltip: 'Copy store name',
                        onPressed: () async {
                          await Clipboard.setData(
                            ClipboardData(text: '${store.name} on Deliberry'),
                          );
                          if (mounted) {
                            _showMessage('Store name copied to clipboard.');
                          }
                        },
                      ),
                    ),
                  ),
                ],
                flexibleSpace: FlexibleSpaceBar(
                  background: Stack(
                    fit: StackFit.expand,
                    children: [
                      Container(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [
                              store.imageColor.withValues(alpha: 0.4),
                              store.imageColor.withValues(alpha: 0.85),
                            ],
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                          ),
                        ),
                      ),
                      Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const SizedBox(height: 48),
                            Container(
                              width: 80,
                              height: 80,
                              decoration: BoxDecoration(
                                color: Colors.white.withValues(alpha: 0.2),
                                shape: BoxShape.circle,
                              ),
                              child: Icon(
                                Icons.storefront_rounded,
                                size: 44,
                                color: Colors.white.withValues(alpha: 0.9),
                              ),
                            ),
                            const SizedBox(height: 12),
                            Text(
                              store.name,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 24,
                                fontWeight: FontWeight.w800,
                                letterSpacing: -0.3,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              store.cuisine,
                              style: TextStyle(
                                color: Colors.white.withValues(alpha: 0.85),
                                fontSize: 14,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ],
                        ),
                      ),
                      if (store.promoText != null)
                        Positioned(
                          bottom: 16,
                          left: 16,
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 12,
                              vertical: 6,
                            ),
                            decoration: BoxDecoration(
                              color: AppTheme.primaryColor,
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: Text(
                              store.promoText!,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 12,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
              ),
              SliverToBoxAdapter(
                child: Container(
                  color: Colors.white,
                  padding: const EdgeInsets.fromLTRB(16, 20, 16, 16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: [
                          InfoPill(
                            icon: Icons.storefront_rounded,
                            label: 'Store details',
                            highlight: true,
                          ),
                          InfoPill(
                            icon: Icons.shopping_cart_outlined,
                            label: runtime.cartItemCount > 0
                                ? '${runtime.cartItemCount} item${runtime.cartItemCount == 1 ? '' : 's'} in cart'
                                : 'Cart starts here',
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      Row(
                        children: [
                          RatingStars(rating: store.rating, size: 16),
                          const SizedBox(width: 6),
                          Text(
                            store.rating.toStringAsFixed(1),
                            style: const TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                          const SizedBox(width: 4),
                          Text(
                            '(${store.reviewCount} reviews)',
                            style: TextStyle(
                              fontSize: 13,
                              color: AppTheme.textSecondary,
                            ),
                          ),
                          const Spacer(),
                          TextButton(
                            onPressed: () => Navigator.of(context).pushNamed(
                              RouteNames.storeMenu,
                              arguments: store.id,
                            ),
                            child: const Text('Open menu'),
                          ),
                        ],
                      ),
                      const SizedBox(height: 14),
                      Row(
                        children: [
                          _InfoChip(
                            icon: Icons.schedule_rounded,
                            label: store.deliveryTime,
                          ),
                          const SizedBox(width: 10),
                          _InfoChip(
                            icon: Icons.delivery_dining_rounded,
                            label: store.deliveryFee == 0
                                ? 'Free delivery'
                                : '\$${formatCentavos(store.deliveryFee)} delivery',
                            highlight: store.deliveryFee == 0,
                          ),
                          const SizedBox(width: 10),
                          _InfoChip(
                            icon: Icons.place_rounded,
                            label: store.distance,
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              SliverToBoxAdapter(
                child: Container(
                  height: 1,
                  color: AppTheme.borderColor,
                ),
              ),
              SliverToBoxAdapter(
                child: Container(
                  color: Colors.white,
                  padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Menu',
                        style: Theme.of(context).textTheme.titleLarge,
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Start here, then move into cart when you are ready.',
                        style: TextStyle(
                          fontSize: 13,
                          color: AppTheme.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              SliverPersistentHeader(
                pinned: true,
                delegate: _CategoryHeaderDelegate(
                  child: Container(
                    color: Colors.white,
                    padding: const EdgeInsets.fromLTRB(16, 8, 16, 12),
                    child: CategoryChipRow(
                      categories: categories,
                      selectedIndex: selectedIndex,
                      onSelected: (index) =>
                          setState(() => _selectedCategoryIndex = index),
                    ),
                  ),
                ),
              ),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(16, 8, 16, 100),
                  child: MenuSectionList(
                    categories: const [],
                    selectedIndex: 0,
                    onSelected: (_) {},
                    items: filteredItems,
                    onAddItem: (item) => _handleAddItem(
                      storeId: store.id,
                      item: item,
                    ),
                    emptyTitle: 'No items in this category',
                    emptySubtitle: 'Try a different category',
                  ),
                ),
              ),
            ],
          ),
          bottomNavigationBar: BottomCTABar(
            label: runtime.cartItemCount > 0 ? 'View Cart' : 'Start Order',
            sublabel: runtime.cartItemCount > 0
                ? '${runtime.cartItemCount} items'
                : store.name,
            trailingText: runtime.cartItemCount > 0
                ? '\$${formatCentavos(runtime.cartTotal)}'
                : null,
            onPressed: () => Navigator.of(context).pushNamed(
              runtime.cartItemCount > 0
                  ? RouteNames.cart
                  : RouteNames.storeMenu,
              arguments: store.id,
            ),
          ),
        );
      },
    );
  }
}

class _InfoChip extends StatelessWidget {
  const _InfoChip({
    required this.icon,
    required this.label,
    this.highlight = false,
  });

  final IconData icon;
  final String label;
  final bool highlight;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: highlight
            ? AppTheme.successColor.withValues(alpha: 0.08)
            : AppTheme.backgroundGrey,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: highlight
              ? AppTheme.successColor.withValues(alpha: 0.3)
              : AppTheme.borderColor,
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            icon,
            size: 14,
            color: highlight ? AppTheme.successColor : AppTheme.textSecondary,
          ),
          const SizedBox(width: 4),
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: highlight ? AppTheme.successColor : AppTheme.textSecondary,
            ),
          ),
        ],
      ),
    );
  }
}

class _CategoryHeaderDelegate extends SliverPersistentHeaderDelegate {
  const _CategoryHeaderDelegate({required this.child});

  final Widget child;

  @override
  double get minExtent => 60;

  @override
  double get maxExtent => 60;

  @override
  Widget build(
    BuildContext context,
    double shrinkOffset,
    bool overlapsContent,
  ) {
    return child;
  }

  @override
  bool shouldRebuild(_CategoryHeaderDelegate oldDelegate) => false;
}
