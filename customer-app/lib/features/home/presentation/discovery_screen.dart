import 'package:flutter/material.dart';

import '../../../app/router/route_names.dart';
import '../../../core/data/customer_runtime_controller.dart';
import '../../../core/data/mock_data.dart';
import '../../../core/theme/app_theme.dart';
import '../../common/presentation/widgets.dart';

class DiscoveryScreen extends StatefulWidget {
  const DiscoveryScreen({super.key});

  @override
  State<DiscoveryScreen> createState() => _DiscoveryScreenState();
}

class _DiscoveryScreenState extends State<DiscoveryScreen> {
  int _selectedCategoryIndex = 0;

  static const _allLabel = 'All';

  List<String> get _categoryLabels => [
        _allLabel,
        ...MockData.categories.map((category) => category.name),
      ];

  @override
  Widget build(BuildContext context) {
    final runtime = CustomerRuntimeController.instance;

    return ListenableBuilder(
      listenable: runtime,
      builder: (context, _) {
        final selectedLabel = _categoryLabels[_selectedCategoryIndex];
        final stores = runtime.getDiscoveryResults(
          categoryName: selectedLabel == _allLabel ? null : selectedLabel,
        );

        return Scaffold(
          backgroundColor: AppTheme.backgroundGrey,
          body: CustomScrollView(
            slivers: [
              SliverAppBar(
                pinned: true,
                backgroundColor: Colors.white,
                surfaceTintColor: Colors.white,
                elevation: 0,
                scrolledUnderElevation: 0.5,
                toolbarHeight: 60,
                leading: IconButton(
                  icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20),
                  onPressed: () => Navigator.of(context).pop(),
                ),
                title: const Text(
                  'Explore',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w800,
                    letterSpacing: -0.3,
                  ),
                ),
                actions: [
                  IconButton(
                    onPressed: () =>
                        Navigator.of(context).pushNamed(RouteNames.filter),
                    icon: const Icon(Icons.tune_rounded, size: 22),
                    tooltip: 'Filters',
                  ),
                  const SizedBox(width: 4),
                ],
                bottom: PreferredSize(
                  preferredSize: const Size.fromHeight(66),
                  child: Container(
                    color: Colors.white,
                    padding: const EdgeInsets.fromLTRB(16, 4, 16, 12),
                    child: CategoryChipRow(
                      categories: _categoryLabels,
                      selectedIndex: _selectedCategoryIndex,
                      onSelected: (index) =>
                          setState(() => _selectedCategoryIndex = index),
                    ),
                  ),
                ),
              ),
              SliverPadding(
                padding: const EdgeInsets.fromLTRB(16, 20, 16, 0),
                sliver: SliverToBoxAdapter(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const FeatureHeroCard(
                        eyebrow: 'Browse',
                        title: 'Compare stores at a glance',
                        subtitle:
                            'Refine by category, then use filters to narrow the restaurants that still fit your session.',
                        icon: Icons.store_mall_directory_rounded,
                      ),
                      const SizedBox(height: 16),
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: [
                          InfoPill(
                            icon: Icons.storefront_rounded,
                            label:
                                '${stores.length} restaurant${stores.length == 1 ? '' : 's'}',
                            highlight: true,
                          ),
                          if (runtime.activeFilterCount > 0)
                            StatusBadge(
                              label: '${runtime.activeFilterCount} filters',
                              color: AppTheme.primaryColor,
                            ),
                          ActionChip(
                            onPressed: () => Navigator.of(context)
                                .pushNamed(RouteNames.filter),
                            avatar: const Icon(
                              Icons.tune_rounded,
                              size: 16,
                              color: AppTheme.primaryColor,
                            ),
                            label: const Text('Adjust filters'),
                            backgroundColor: Colors.white,
                            side: BorderSide(color: AppTheme.borderColor),
                            labelStyle: const TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w700,
                              color: AppTheme.primaryColor,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              if (stores.isEmpty)
                const SliverFillRemaining(
                  child: EmptyState(
                    icon: Icons.storefront_outlined,
                    title: 'No restaurants found',
                    subtitle: 'Try a different category or clear filters',
                  ),
                )
              else
                SliverPadding(
                  padding: const EdgeInsets.fromLTRB(16, 16, 16, 32),
                  sliver: SliverGrid.builder(
                    gridDelegate:
                        const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      crossAxisSpacing: 12,
                      mainAxisSpacing: 12,
                      childAspectRatio: 0.72,
                    ),
                    itemCount: stores.length,
                    itemBuilder: (context, index) {
                      final store = stores[index];
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
