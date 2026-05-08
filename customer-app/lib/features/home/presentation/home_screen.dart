import 'package:flutter/material.dart';

import '../../../app/router/route_names.dart';
import '../../../core/data/customer_runtime_controller.dart';
import '../../../core/data/mock_data.dart' show MockData, formatCustomerMoney;
import '../../../core/i18n/app_localizations.dart';
import '../../../core/session/customer_session_controller.dart';
import '../../../core/theme/app_theme.dart';
import '../../common/presentation/widgets.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;

    return ListenableBuilder(
      listenable: CustomerRuntimeController.instance,
      builder: (context, _) {
        final runtime = CustomerRuntimeController.instance;
        final featuredStores = runtime.featuredStores;
        final nearbyStores = runtime.getDiscoveryResults();
        final address = runtime.deliveryAddress;
        final activeOrders = runtime.activeOrders.length;
        final unreadNotifications = runtime.unreadNotificationCount;
        final isGuest = CustomerSessionController.instance.isGuest;

        return Scaffold(
          backgroundColor: AppTheme.backgroundGrey,
          floatingActionButton: runtime.cartItemCount > 0
              ? Padding(
                  padding: const EdgeInsets.only(bottom: 80),
                  child: FloatingActionButton.extended(
                    onPressed: () =>
                        Navigator.of(context).pushNamed(RouteNames.cart),
                    icon: const Icon(Icons.shopping_cart_rounded, size: 20),
                    label: Text(
                      '${l10n.cartItemCount(runtime.cartItemCount)} · ${formatCustomerMoney(runtime.cartTotal)}',
                      style: const TextStyle(fontWeight: FontWeight.w700),
                    ),
                    backgroundColor: AppTheme.primaryColor,
                    foregroundColor: AppTheme.white,
                  ),
                )
              : null,
          body: CustomScrollView(
            slivers: [
              SliverAppBar(
                automaticallyImplyLeading: false,
                pinned: true,
                floating: false,
                backgroundColor: AppTheme.backgroundGrey,
                surfaceTintColor: AppTheme.backgroundGrey,
                elevation: 0,
                scrolledUnderElevation: 0.5,
                toolbarHeight: 68,
                title: AddressPill(
                  label: address?.label ?? l10n.raw('Add address'),
                  address: address?.street ??
                      l10n.raw('Tap to add a delivery address'),
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
                      if (unreadNotifications > 0)
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
                      _DeliveryHeaderCard(
                        addressLabel:
                            address?.label ?? l10n.text('home.noAddressYet'),
                        activeOrders: activeOrders,
                        isGuest: isGuest,
                        onTap: () => Navigator.of(context).pushNamed(
                            address == null
                                ? RouteNames.addresses
                                : RouteNames.orders),
                      ),
                      const SizedBox(height: 14),
                      AppSearchBar(
                        readOnly: true,
                        hint: l10n.text('home.searchHint'),
                        onTap: () =>
                            Navigator.of(context).pushNamed(RouteNames.search),
                      ),
                    ],
                  ),
                ),
              ),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.only(top: 20, bottom: 4),
                  child: SizedBox(
                    height: 154,
                    child: ListView.separated(
                      scrollDirection: Axis.horizontal,
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      itemCount: MockData.promotions.length,
                      separatorBuilder: (_, __) => const SizedBox(width: 12),
                      itemBuilder: (context, index) {
                        final promo = MockData.promotions[index];
                        return PromoBanner(
                          title: context.l10n.raw(promo.title),
                          subtitle: context.l10n.raw(promo.subtitle),
                          discount: promo.discount,
                          gradientColors: promo.gradientColors,
                        );
                      },
                    ),
                  ),
                ),
              ),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(16, 28, 16, 0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      SectionHeader(title: l10n.raw('Browse by category')),
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
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(16, 28, 16, 0),
                  child: SectionHeader(
                    title: l10n.raw('Popular near you'),
                    onSeeAll: () =>
                        Navigator.of(context).pushNamed(RouteNames.discovery),
                  ),
                ),
              ),
              SliverToBoxAdapter(
                child: SizedBox(
                  height: 318,
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
                          isDirect: store.isDirect,
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
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(16, 28, 16, 12),
                  child: SectionHeader(
                    title: l10n.text('home.fastDelivery'),
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
                      isDirect: store.isDirect,
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

class _DeliveryHeaderCard extends StatelessWidget {
  const _DeliveryHeaderCard({
    required this.addressLabel,
    required this.activeOrders,
    required this.isGuest,
    required this.onTap,
  });

  final String addressLabel;
  final int activeOrders;
  final bool isGuest;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;

    return Material(
      color: AppTheme.white,
      borderRadius: BorderRadius.circular(AppTheme.cardRadius),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            color: Theme.of(context).colorScheme.surface,
            borderRadius: BorderRadius.circular(AppTheme.cardRadius),
            border: Border.all(color: AppTheme.borderColor),
            boxShadow: [AppTheme.softShadow(alpha: 0.035)],
          ),
          child: Row(
            children: [
              Container(
                width: 46,
                height: 46,
                decoration: BoxDecoration(
                  color: AppTheme.primaryColor,
                  borderRadius: BorderRadius.circular(AppTheme.pillRadius),
                ),
                child: const Icon(
                  Icons.delivery_dining_rounded,
                  color: AppTheme.white,
                  size: 24,
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      l10n.text('home.deliveryNow'),
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w800,
                        color: AppTheme.primaryColor,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      isGuest
                          ? l10n.text('home.browseFirst')
                          : activeOrders > 0
                              ? l10n.activeOrderCount(activeOrders)
                              : addressLabel,
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w900,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 2),
                    Text(
                      isGuest
                          ? l10n.text('home.checkoutReady')
                          : activeOrders > 0
                              ? l10n.text('home.trackStatus')
                              : l10n.text('home.manageAddress'),
                      style: TextStyle(
                        fontSize: 13,
                        color: AppTheme.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
              Icon(
                Icons.chevron_right_rounded,
                color: AppTheme.textSecondary,
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
              borderRadius: BorderRadius.circular(18),
            ),
            child: Icon(icon, color: color, size: 26),
          ),
          const SizedBox(height: 6),
          Text(
            context.l10n.raw(name),
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
