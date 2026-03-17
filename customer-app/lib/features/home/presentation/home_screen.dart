import 'package:flutter/material.dart';

import '../../../app/router/route_names.dart';
import '../../../core/data/customer_runtime_controller.dart';
import '../../../core/data/mock_data.dart';
import '../../../core/theme/app_theme.dart';
import '../../common/presentation/widgets.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final featuredStores = MockData.stores.where((s) => s.isFeatured).toList();
    final nearbyStores = MockData.stores;

    return ListenableBuilder(
      listenable: CustomerRuntimeController.instance,
      builder: (context, _) {
        final address = CustomerRuntimeController.instance.deliveryAddress;
        final activeOrders =
            CustomerRuntimeController.instance.activeOrders.length;

        return Scaffold(
          backgroundColor: AppTheme.backgroundGrey,
          body: CustomScrollView(
            slivers: [
              SliverAppBar(
                pinned: true,
                floating: false,
                backgroundColor: Colors.white,
                surfaceTintColor: Colors.white,
                elevation: 0,
                scrolledUnderElevation: 0.5,
                toolbarHeight: 68,
                title: AddressPill(
                  label: address?.label ?? 'Add address',
                  address: address?.street ?? 'Tap to add a delivery address',
                  onTap: () =>
                      Navigator.of(context).pushNamed(RouteNames.addresses),
                ),
                actions: [
                  Stack(
                    clipBehavior: Clip.none,
                    children: [
                      IconButton(
                        onPressed: () => Navigator.of(context)
                            .pushNamed(RouteNames.notifications),
                        icon:
                            const Icon(Icons.notifications_outlined, size: 26),
                        color: Theme.of(context).colorScheme.onSurface,
                      ),
                      Positioned(
                        top: 8,
                        right: 8,
                        child: Container(
                          width: 9,
                          height: 9,
                          decoration: const BoxDecoration(
                            color: AppTheme.primaryColor,
                            shape: BoxShape.circle,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(width: 4),
                ],
              ),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
                  child: Column(
                    children: [
                      AppSearchBar(
                        readOnly: true,
                        hint: 'Search stores or cuisines',
                        onTap: () =>
                            Navigator.of(context).pushNamed(RouteNames.search),
                      ),
                      const SizedBox(height: 14),
                      FeatureHeroCard(
                        eyebrow: 'Customer journey',
                        title: 'Find your next order fast',
                        subtitle: activeOrders > 0
                            ? 'You have $activeOrders active order${activeOrders == 1 ? '' : 's'} and can jump back into tracking any time.'
                            : 'Browse featured spots, jump into search, and move from discovery to cart without losing context.',
                        icon: Icons.ramen_dining_rounded,
                        badge: address == null
                            ? 'Add an address for better discovery'
                            : 'Delivering to ${address.label}',
                        onTap: () => Navigator.of(context)
                            .pushNamed(RouteNames.discovery),
                      ),
                      const SizedBox(height: 14),
                      Row(
                        children: [
                          Expanded(
                            child: _QuickActionCard(
                              icon: Icons.travel_explore_rounded,
                              title: 'Explore',
                              subtitle: 'Browse every store',
                              onTap: () => Navigator.of(context)
                                  .pushNamed(RouteNames.discovery),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: _QuickActionCard(
                              icon: Icons.receipt_long_rounded,
                              title: 'Orders',
                              subtitle: activeOrders > 0
                                  ? '$activeOrders active now'
                                  : 'Track recent orders',
                              onTap: () => Navigator.of(context)
                                  .pushNamed(RouteNames.orders),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              // Promo carousel
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.only(top: 28, bottom: 4),
                  child: SizedBox(
                    height: 150,
                    child: ListView.separated(
                      scrollDirection: Axis.horizontal,
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      itemCount: MockData.promotions.length,
                      separatorBuilder: (_, __) => const SizedBox(width: 12),
                      itemBuilder: (context, index) {
                        final promo = MockData.promotions[index];
                        return PromoBanner(
                          title: promo.title,
                          subtitle: promo.subtitle,
                          discount: promo.discount,
                          gradientColors: promo.gradientColors,
                        );
                      },
                    ),
                  ),
                ),
              ),
              // Categories
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(16, 28, 16, 0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      SectionHeader(title: 'Start with a craving'),
                      SizedBox(
                        height: 96,
                        child: ListView.separated(
                          scrollDirection: Axis.horizontal,
                          itemCount: MockData.categories.length,
                          separatorBuilder: (_, __) =>
                              const SizedBox(width: 12),
                          itemBuilder: (context, index) {
                            final cat = MockData.categories[index];
                            return _CategoryCircle(
                              name: cat.name,
                              icon: cat.icon,
                              color: cat.color,
                              onTap: () {
                                CustomerRuntimeController.instance
                                    .setSearchQuery(cat.name);
                                Navigator.of(context)
                                    .pushNamed(RouteNames.search);
                              },
                            );
                          },
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              // Featured stores
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(16, 28, 16, 0),
                  child: SectionHeader(
                    title: 'Featured for tonight',
                    onSeeAll: () =>
                        Navigator.of(context).pushNamed(RouteNames.discovery),
                  ),
                ),
              ),
              SliverToBoxAdapter(
                child: SizedBox(
                  height: 258,
                  child: ListView.separated(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    itemCount: featuredStores.length,
                    separatorBuilder: (_, __) => const SizedBox(width: 12),
                    itemBuilder: (context, index) {
                      final store = featuredStores[index];
                      return SizedBox(
                        width: 250,
                        child: StoreCard(
                          name: store.name,
                          cuisine: store.cuisine,
                          rating: store.rating,
                          deliveryTime: store.deliveryTime,
                          deliveryFee: store.deliveryFee,
                          imageColor: store.imageColor,
                          promoText: store.promoText,
                          onTap: () => Navigator.of(context).pushNamed(
                            RouteNames.store,
                            arguments: store.id,
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ),
              // Nearby restaurants
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(16, 28, 16, 12),
                  child: SectionHeader(
                    title: 'Nearby and ready',
                    onSeeAll: () =>
                        Navigator.of(context).pushNamed(RouteNames.discovery),
                  ),
                ),
              ),
              SliverPadding(
                padding: const EdgeInsets.fromLTRB(16, 0, 16, 32),
                sliver: SliverList.separated(
                  itemCount: nearbyStores.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 14),
                  itemBuilder: (context, index) {
                    final store = nearbyStores[index];
                    return StoreCard(
                      name: store.name,
                      cuisine: store.cuisine,
                      rating: store.rating,
                      deliveryTime: store.deliveryTime,
                      deliveryFee: store.deliveryFee,
                      imageColor: store.imageColor,
                      promoText: store.promoText,
                      onTap: () => Navigator.of(context).pushNamed(
                        RouteNames.store,
                        arguments: store.id,
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

class _QuickActionCard extends StatelessWidget {
  const _QuickActionCard({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });

  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(18),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: AppTheme.borderColor),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: AppTheme.primaryColor.withValues(alpha: 0.08),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(icon, color: AppTheme.primaryColor, size: 20),
              ),
              const SizedBox(height: 12),
              Text(
                title,
                style: const TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                subtitle,
                style: TextStyle(
                  fontSize: 12,
                  height: 1.3,
                  color: AppTheme.textSecondary,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _CategoryCircle extends StatelessWidget {
  const _CategoryCircle({
    required this.name,
    required this.icon,
    required this.color,
    this.onTap,
  });

  final String name;
  final IconData icon;
  final Color color;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 62,
            height: 62,
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.12),
              shape: BoxShape.circle,
              border: Border.all(
                color: color.withValues(alpha: 0.25),
                width: 1.5,
              ),
            ),
            child: Icon(icon, color: color, size: 26),
          ),
          const SizedBox(height: 6),
          Text(
            name,
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w700,
              color: AppTheme.textSecondary,
            ),
          ),
        ],
      ),
    );
  }
}
