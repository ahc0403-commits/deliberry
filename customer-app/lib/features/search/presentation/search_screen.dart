import 'package:flutter/material.dart';

import '../../../app/router/route_names.dart';
import '../../../core/data/customer_runtime_controller.dart';
import '../../../core/data/mock_data.dart';
import '../../../core/theme/app_theme.dart';
import '../../common/presentation/widgets.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  late final TextEditingController _controller;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController(
      text: CustomerRuntimeController.instance.searchQuery,
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _setQuery(String term) {
    final runtime = CustomerRuntimeController.instance;
    _controller.text = term;
    _controller.selection = TextSelection.collapsed(offset: term.length);
    runtime.setSearchQuery(term);
  }

  @override
  Widget build(BuildContext context) {
    final runtime = CustomerRuntimeController.instance;

    return ListenableBuilder(
      listenable: runtime,
      builder: (context, _) {
        final query = runtime.searchQuery;
        if (_controller.text != query) {
          _controller.value = TextEditingValue(
            text: query,
            selection: TextSelection.collapsed(offset: query.length),
          );
        }

        final results = runtime.getSearchResults(query);
        final hasQuery = query.trim().isNotEmpty;

        return Scaffold(
          backgroundColor: AppTheme.backgroundGrey,
          body: SafeArea(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  color: Colors.white,
                  padding: const EdgeInsets.fromLTRB(16, 12, 16, 16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: AppSearchBar(
                              readOnly: false,
                              autofocus: false,
                              hint: 'Search stores or cuisines',
                              controller: _controller,
                              onChanged: runtime.setSearchQuery,
                            ),
                          ),
                          if (hasQuery) ...[
                            const SizedBox(width: 10),
                            TextButton(
                              onPressed: runtime.clearSearchQuery,
                              style: TextButton.styleFrom(
                                padding: EdgeInsets.zero,
                                minimumSize: Size.zero,
                                tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                              ),
                              child: Text(
                                'Cancel',
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w600,
                                  color: AppTheme.primaryColor,
                                ),
                              ),
                            ),
                          ],
                        ],
                      ),
                      const SizedBox(height: 12),
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: [
                          InfoPill(
                            icon: Icons.search_rounded,
                            label: hasQuery
                                ? 'Searching for "$query"'
                                : 'Search stores and cuisines',
                            highlight: hasQuery,
                          ),
                          if (runtime.activeFilterCount > 0)
                            StatusBadge(
                              label:
                                  '${runtime.activeFilterCount} active filter${runtime.activeFilterCount == 1 ? '' : 's'}',
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
                            label: const Text('Filters'),
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
                Expanded(
                  child: hasQuery
                      ? _SearchResults(
                          results: results,
                          query: query,
                        )
                      : _SearchIdle(
                          recentSearches: runtime.recentSearches,
                          onRecentTap: (term) {
                            runtime.setSearchQuery(term, addToRecent: true);
                            _setQuery(term);
                          },
                          onClearRecent: runtime.recentSearches.isEmpty
                              ? null
                              : runtime.clearRecentSearches,
                        ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}

class _SearchIdle extends StatelessWidget {
  const _SearchIdle({
    required this.recentSearches,
    required this.onRecentTap,
    this.onClearRecent,
  });

  final List<String> recentSearches;
  final ValueChanged<String> onRecentTap;
  final VoidCallback? onClearRecent;

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 24, 16, 32),
      children: [
        const FeatureHeroCard(
          eyebrow: 'Search',
          title: 'Start broad, then narrow quickly',
          subtitle:
              'Recent searches stay in session, and filters stay applied until you change them.',
          icon: Icons.manage_search_rounded,
        ),
        const SizedBox(height: 24),
        SectionHeader(
          title: 'Recent Searches',
          trailing: TextButton(
            onPressed: onClearRecent,
            style: TextButton.styleFrom(
              padding: EdgeInsets.zero,
              minimumSize: Size.zero,
              tapTargetSize: MaterialTapTargetSize.shrinkWrap,
            ),
            child: const Text('Clear all'),
          ),
        ),
        if (recentSearches.isEmpty)
          Text(
            'Your recent searches will appear here.',
            style: TextStyle(
              fontSize: 14,
              color: AppTheme.textSecondary,
            ),
          )
        else
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: recentSearches.map((term) {
              return ActionChip(
                onPressed: () => onRecentTap(term),
                avatar: Icon(
                  Icons.history_rounded,
                  size: 15,
                  color: AppTheme.textSecondary,
                ),
                label: Text(term),
                backgroundColor: Colors.white,
                side: BorderSide(color: AppTheme.borderColor),
                labelStyle: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w500,
                ),
              );
            }).toList(),
          ),
        const SizedBox(height: 32),
        SectionHeader(title: 'Popular Categories'),
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 4,
            crossAxisSpacing: 10,
            mainAxisSpacing: 10,
            childAspectRatio: 0.85,
          ),
          itemCount: MockData.categories.length,
          itemBuilder: (context, index) {
            final category = MockData.categories[index];
            return InkWell(
              onTap: () => onRecentTap(category.name),
              borderRadius: BorderRadius.circular(16),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 56,
                    height: 56,
                    decoration: BoxDecoration(
                      color: category.color.withValues(alpha: 0.12),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(category.icon, color: category.color, size: 24),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    category.name,
                    style: const TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                    ),
                    textAlign: TextAlign.center,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            );
          },
        ),
        const SizedBox(height: 28),
        SectionHeader(title: 'Popular Near You'),
        ...MockData.stores.take(3).map((store) {
          return Padding(
            padding: const EdgeInsets.only(bottom: 12),
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
        }),
      ],
    );
  }
}

class _SearchResults extends StatelessWidget {
  const _SearchResults({
    required this.results,
    required this.query,
  });

  final List<MockStore> results;
  final String query;

  @override
  Widget build(BuildContext context) {
    final runtime = CustomerRuntimeController.instance;

    if (results.isEmpty) {
      return EmptyState(
        icon: Icons.search_off_rounded,
        title: 'No results for "$query"',
        subtitle: runtime.activeFilterCount > 0
            ? 'Try changing your filters or search term'
            : 'Try a different search term or browse categories',
      );
    }

    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 32),
      children: [
        Padding(
          padding: const EdgeInsets.only(bottom: 16),
          child: Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              InfoPill(
                icon: Icons.storefront_rounded,
                label:
                    '${results.length} result${results.length != 1 ? 's' : ''}',
                highlight: true,
              ),
              if (runtime.activeFilterCount > 0)
                StatusBadge(
                  label: '${runtime.activeFilterCount} filters',
                  color: AppTheme.primaryColor,
                ),
              ActionChip(
                onPressed: () =>
                    Navigator.of(context).pushNamed(RouteNames.filter),
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
        ),
        ...results.map((store) {
          return Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: StoreCard(
              name: store.name,
              cuisine: store.cuisine,
              rating: store.rating,
              deliveryTime: store.deliveryTime,
              deliveryFee: store.deliveryFee,
              imageColor: store.imageColor,
              promoText: store.promoText,
              onTap: () {
                CustomerRuntimeController.instance.setSearchQuery(
                  query,
                  addToRecent: true,
                );
                Navigator.of(context).pushNamed(
                  RouteNames.store,
                  arguments: store.id,
                );
              },
            ),
          );
        }),
      ],
    );
  }
}
