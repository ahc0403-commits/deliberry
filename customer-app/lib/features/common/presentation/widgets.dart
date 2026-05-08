import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../../../core/data/mock_data.dart';
import '../../../core/i18n/app_localizations.dart';
import '../../../core/theme/app_theme.dart';

class ScrollableSafeContent extends StatelessWidget {
  const ScrollableSafeContent({
    required this.child,
    this.padding = EdgeInsets.zero,
    super.key,
  });

  final Widget child;
  final EdgeInsets padding;

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: LayoutBuilder(
        builder: (context, constraints) {
          final mediaQuery = MediaQuery.of(context);
          final bottomInset = math.max(
            mediaQuery.padding.bottom,
            mediaQuery.viewInsets.bottom,
          );
          final resolvedPadding = padding.add(
            EdgeInsets.only(bottom: bottomInset),
          );
          final minHeight = math.max(
            0.0,
            constraints.maxHeight - resolvedPadding.vertical,
          );

          return SingleChildScrollView(
            keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
            padding: resolvedPadding,
            child: ConstrainedBox(
              constraints: BoxConstraints(minHeight: minHeight),
              child: IntrinsicHeight(child: child),
            ),
          );
        },
      ),
    );
  }
}

// ── Section Header ──────────────────────────────────────────────────────

class SectionHeader extends StatelessWidget {
  const SectionHeader({
    required this.title,
    this.trailing,
    this.onSeeAll,
    super.key,
  });

  final String title;
  final Widget? trailing;
  final VoidCallback? onSeeAll;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 14),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            context.l10n.raw(title),
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.w800,
                  letterSpacing: 0,
                ),
          ),
          if (trailing != null) trailing!,
          if (onSeeAll != null && trailing == null)
            TextButton(
              onPressed: onSeeAll,
              style: TextButton.styleFrom(
                padding: EdgeInsets.zero,
                minimumSize: const Size(48, 44),
                tapTargetSize: MaterialTapTargetSize.shrinkWrap,
              ),
              child: Text(
                context.l10n.raw('See all'),
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: AppTheme.primaryColor,
                ),
              ),
            ),
        ],
      ),
    );
  }
}

class FeatureHeroCard extends StatelessWidget {
  const FeatureHeroCard({
    required this.eyebrow,
    required this.title,
    required this.subtitle,
    required this.icon,
    this.badge,
    this.onTap,
    super.key,
  });

  final String eyebrow;
  final String title;
  final String subtitle;
  final IconData icon;
  final String? badge;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final content = Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [AppTheme.primaryColor, AppTheme.primaryDark],
        ),
        borderRadius: BorderRadius.circular(AppTheme.cardRadius),
        boxShadow: [
          AppTheme.softShadow(alpha: 0.10),
        ],
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  context.l10n.raw(eyebrow).toUpperCase(),
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 0.8,
                    color: AppTheme.white.withValues(alpha: 0.82),
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  context.l10n.raw(title),
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 0,
                    color: AppTheme.white,
                    height: 1.05,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 8),
                Text(
                  context.l10n.raw(subtitle),
                  style: TextStyle(
                    fontSize: 14,
                    height: 1.35,
                    color: AppTheme.white.withValues(alpha: 0.88),
                  ),
                  maxLines: 3,
                  overflow: TextOverflow.ellipsis,
                ),
                if (badge != null) ...[
                  const SizedBox(height: 14),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: AppTheme.white.withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(AppTheme.pillRadius),
                      border: Border.all(
                        color: AppTheme.white.withValues(alpha: 0.20),
                      ),
                    ),
                    child: Text(
                      context.l10n.raw(badge!),
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                        color: AppTheme.white,
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),
          const SizedBox(width: 16),
          Container(
            width: 68,
            height: 68,
            decoration: BoxDecoration(
              color: AppTheme.white.withValues(alpha: 0.09),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppTheme.white.withValues(alpha: 0.14)),
            ),
            child: Icon(icon, color: AppTheme.white, size: 34),
          ),
        ],
      ),
    );

    if (onTap == null) return content;

    return Material(
      color: Colors.transparent,
      borderRadius: BorderRadius.circular(AppTheme.cardRadius),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppTheme.cardRadius),
        child: content,
      ),
    );
  }
}

class DeliveryMetaRow extends StatelessWidget {
  const DeliveryMetaRow({
    required this.rating,
    required this.deliveryTime,
    required this.deliveryFee,
    this.distance,
    this.compact = false,
    super.key,
  });

  final double rating;
  final String deliveryTime;
  final int deliveryFee;
  final String? distance;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final deliveryLabel = deliveryFee == 0
        ? context.l10n.text('home.freeDelivery')
        : context.l10n.deliveryFeeLabel(formatCustomerMoney(deliveryFee));
    final style = TextStyle(
      fontSize: compact ? 11 : 12,
      color: AppTheme.textSecondary,
      fontWeight: FontWeight.w600,
    );

    return Wrap(
      spacing: 6,
      runSpacing: 4,
      crossAxisAlignment: WrapCrossAlignment.center,
      children: [
        _MetaItem(
          icon: Icons.star_rounded,
          label: rating.toStringAsFixed(1),
          style: style.copyWith(color: AppTheme.inkColor),
          iconColor: AppTheme.secondaryColor,
        ),
        Text('•', style: style),
        Text(context.l10n.deliveryWindow(deliveryTime), style: style),
        Text('•', style: style),
        Text(deliveryLabel, style: style),
        if (distance != null) ...[
          Text('•', style: style),
          Text(distance!, style: style),
        ],
      ],
    );
  }
}

class _MetaItem extends StatelessWidget {
  const _MetaItem({
    required this.icon,
    required this.label,
    required this.style,
    required this.iconColor,
  });

  final IconData icon;
  final String label;
  final TextStyle style;
  final Color iconColor;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 14, color: iconColor),
        const SizedBox(width: 2),
        Text(context.l10n.raw(label), style: style),
      ],
    );
  }
}

class InfoPill extends StatelessWidget {
  const InfoPill({
    required this.icon,
    required this.label,
    this.highlight = false,
    super.key,
  });

  final IconData icon;
  final String label;
  final bool highlight;

  @override
  Widget build(BuildContext context) {
    final color = highlight ? AppTheme.primaryColor : AppTheme.textSecondary;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: highlight
            ? AppTheme.primaryColor.withValues(alpha: 0.08)
            : AppTheme.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: highlight
              ? AppTheme.primaryColor.withValues(alpha: 0.15)
              : AppTheme.borderColor,
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 15, color: color),
          const SizedBox(width: 6),
          Text(
            context.l10n.raw(label),
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w700,
              color: color,
            ),
          ),
        ],
      ),
    );
  }
}

// ── Store Card ───────────────────────────────────────────────────────────

class StoreCard extends StatelessWidget {
  const StoreCard({
    required this.name,
    required this.cuisine,
    required this.rating,
    required this.deliveryTime,
    required this.deliveryFee,
    required this.imageColor,
    this.isDirect = false,
    this.promoText,
    this.onTap,
    this.compact = false,
    super.key,
  });

  final String name;
  final String cuisine;
  final double rating;
  final String deliveryTime;
  final int deliveryFee;
  final Color imageColor;
  final bool isDirect;
  final String? promoText;
  final VoidCallback? onTap;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final radius = compact ? 14.0 : AppTheme.cardRadius;
    final heroHeight = compact ? 108.0 : 146.0;
    final heroIconSize = compact ? 38.0 : 50.0;
    final contentPadding = compact
        ? const EdgeInsets.fromLTRB(10, 9, 10, 10)
        : const EdgeInsets.fromLTRB(14, 12, 14, 14);
    final titleFontSize = compact ? 14.0 : 17.0;
    final cuisineMaxLines = compact ? 2 : 1;
    final detailGap = compact ? 6.0 : 8.0;

    return Material(
      color: Theme.of(context).colorScheme.surface,
      borderRadius: BorderRadius.circular(radius),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(radius),
        child: Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(radius),
            border: Border.all(color: AppTheme.borderColor),
            boxShadow: [
              AppTheme.softShadow(alpha: 0.045),
            ],
          ),
          clipBehavior: Clip.antiAlias,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Stack(
                children: [
                  Container(
                    height: heroHeight,
                    width: double.infinity,
                    decoration: BoxDecoration(
                      color: imageColor.withValues(alpha: 0.13),
                    ),
                    child: Stack(
                      fit: StackFit.expand,
                      children: [
                        Positioned(
                          right: -28,
                          bottom: -22,
                          child: Container(
                            width: compact ? 86 : 122,
                            height: compact ? 86 : 122,
                            decoration: BoxDecoration(
                              color: AppTheme.white.withValues(alpha: 0.18),
                              shape: BoxShape.circle,
                            ),
                          ),
                        ),
                        Center(
                          child: Icon(
                            Icons.restaurant_rounded,
                            size: heroIconSize,
                            color: imageColor,
                          ),
                        ),
                      ],
                    ),
                  ),
                  if (promoText != null)
                    Positioned(
                      top: 12,
                      left: 12,
                      child: Container(
                        padding: EdgeInsets.symmetric(
                          horizontal: compact ? 8 : 10,
                          vertical: compact ? 4 : 6,
                        ),
                        decoration: BoxDecoration(
                          color: AppTheme.primaryColor,
                          borderRadius:
                              BorderRadius.circular(AppTheme.pillRadius),
                        ),
                        child: Text(
                          context.l10n.raw(promoText!),
                          style: TextStyle(
                            color: AppTheme.white,
                            fontSize: compact ? 10 : 11,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                      ),
                    ),
                ],
              ),
              Padding(
                padding: contentPadding,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      name,
                      style: TextStyle(
                        fontSize: titleFontSize,
                        fontWeight: FontWeight.w700,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    Text(
                      context.l10n.raw(cuisine),
                      style: TextStyle(
                        fontSize: 13,
                        color: AppTheme.textSecondary,
                        height: 1.25,
                      ),
                      maxLines: cuisineMaxLines,
                      overflow: TextOverflow.ellipsis,
                    ),
                    SizedBox(height: detailGap),
                    DeliveryMetaRow(
                      rating: rating,
                      deliveryTime: deliveryTime,
                      deliveryFee: deliveryFee,
                      compact: compact,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ── Compact Store Card (horizontal) ─────────────────────────────────────

class CompactStoreCard extends StatelessWidget {
  const CompactStoreCard({
    required this.name,
    required this.cuisine,
    required this.rating,
    required this.deliveryTime,
    required this.imageColor,
    this.onTap,
    super.key,
  });

  final String name;
  final String cuisine;
  final double rating;
  final String deliveryTime;
  final Color imageColor;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 178,
      child: Material(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(14),
        clipBehavior: Clip.antiAlias,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(14),
          child: Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(16),
            ),
            clipBehavior: Clip.antiAlias,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  height: 90,
                  width: double.infinity,
                  decoration: BoxDecoration(
                    color: imageColor.withValues(alpha: 0.12),
                    borderRadius: const BorderRadius.vertical(
                      top: Radius.circular(16),
                    ),
                  ),
                  child: Center(
                    child: Icon(Icons.restaurant_rounded,
                        size: 32, color: imageColor),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(10),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        name,
                        style: const TextStyle(
                            fontSize: 14, fontWeight: FontWeight.w700),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 3),
                      DeliveryMetaRow(
                        rating: rating,
                        deliveryTime: deliveryTime,
                        deliveryFee: 0,
                        compact: true,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// ── Menu Item Card ──────────────────────────────────────────────────────

class MenuItemCard extends StatelessWidget {
  const MenuItemCard({
    required this.name,
    required this.description,
    required this.price,
    required this.imageColor,
    this.isPopular = false,
    this.onAdd,
    super.key,
  });

  final String name;
  final String description;
  final int price;
  final Color imageColor;
  final bool isPopular;
  final VoidCallback? onAdd;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(AppTheme.cardRadius),
        border: Border.all(color: AppTheme.borderColor),
        boxShadow: [AppTheme.softShadow(alpha: 0.035)],
      ),
      child: Row(
        children: [
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (isPopular)
                    Padding(
                      padding: const EdgeInsets.only(bottom: 4),
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: Theme.of(context).colorScheme.primaryContainer,
                          borderRadius:
                              BorderRadius.circular(AppTheme.pillRadius),
                        ),
                        child: Text(
                          context.l10n.raw('Popular'),
                          style:
                              Theme.of(context).textTheme.labelSmall!.copyWith(
                                    fontWeight: FontWeight.w700,
                                    color: AppTheme.primaryColor,
                                  ),
                        ),
                      ),
                    ),
                  Text(
                    name,
                    style: const TextStyle(
                        fontSize: 16, fontWeight: FontWeight.w800),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    description,
                    style:
                        TextStyle(fontSize: 13, color: AppTheme.textSecondary),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    formatCustomerMoney(price),
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ],
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(right: 12),
            child: Stack(
              alignment: Alignment.bottomCenter,
              children: [
                Container(
                  width: 96,
                  height: 96,
                  decoration: BoxDecoration(
                    color: imageColor.withValues(alpha: 0.10),
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: Icon(Icons.restaurant_rounded,
                      size: 32, color: imageColor),
                ),
                Transform.translate(
                  offset: const Offset(0, 10),
                  child: SizedBox(
                    width: 44,
                    height: 44,
                    child: Material(
                      color: Colors.transparent,
                      shape: const CircleBorder(),
                      clipBehavior: Clip.antiAlias,
                      child: InkWell(
                        onTap: onAdd,
                        customBorder: const CircleBorder(),
                        child: Center(
                          child: Container(
                            width: 32,
                            height: 32,
                            decoration: BoxDecoration(
                              color: AppTheme.primaryColor,
                              borderRadius: BorderRadius.circular(11),
                              boxShadow: [
                                BoxShadow(
                                  color: AppTheme.primaryColor
                                      .withValues(alpha: 0.3),
                                  blurRadius: 8,
                                  offset: const Offset(0, 2),
                                ),
                              ],
                            ),
                            child: const Icon(Icons.add_rounded,
                                color: AppTheme.white, size: 20),
                          ),
                        ),
                      ),
                    ),
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

// ── Quantity Control ─────────────────────────────────────────────────────

class QuantityControl extends StatelessWidget {
  const QuantityControl({
    required this.quantity,
    this.onIncrement,
    this.onDecrement,
    super.key,
  });

  final int quantity;
  final VoidCallback? onIncrement;
  final VoidCallback? onDecrement;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppTheme.surfaceMuted,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          _button(Icons.remove_rounded, onDecrement),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 14),
            child: Text(
              '$quantity',
              style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700),
            ),
          ),
          _button(Icons.add_rounded, onIncrement),
        ],
      ),
    );
  }

  Widget _button(IconData icon, VoidCallback? onTap) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: SizedBox(
        width: 44,
        height: 44,
        child: Center(
          child: Icon(icon, size: 18, color: AppTheme.primaryColor),
        ),
      ),
    );
  }
}

// ── Price Row ────────────────────────────────────────────────────────────

class PriceRow extends StatelessWidget {
  const PriceRow({
    required this.label,
    required this.amount,
    this.isBold = false,
    this.isDiscount = false,
    super.key,
  });

  final String label;
  final String amount;
  final bool isBold;
  final bool isDiscount;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              fontSize: isBold ? 16 : 14,
              fontWeight: isBold ? FontWeight.w700 : FontWeight.w400,
              color: isBold ? null : AppTheme.textSecondary,
            ),
          ),
          Text(
            amount,
            style: TextStyle(
              fontSize: isBold ? 18 : 14,
              fontWeight: isBold ? FontWeight.w800 : FontWeight.w500,
              color: isDiscount ? AppTheme.successColor : null,
            ),
          ),
        ],
      ),
    );
  }
}

// ── Category Chip ────────────────────────────────────────────────────────

class CategoryChipRow extends StatelessWidget {
  const CategoryChipRow({
    required this.categories,
    required this.selectedIndex,
    this.onSelected,
    super.key,
  });

  final List<String> categories;
  final int selectedIndex;
  final ValueChanged<int>? onSelected;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 46,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: categories.length,
        separatorBuilder: (_, __) => const SizedBox(width: 8),
        itemBuilder: (context, index) {
          final isSelected = index == selectedIndex;
          return Material(
            color: isSelected
                ? AppTheme.primaryColor
                : Theme.of(context).colorScheme.surface,
            borderRadius: BorderRadius.circular(AppTheme.pillRadius),
            clipBehavior: Clip.antiAlias,
            child: InkWell(
              onTap: () => onSelected?.call(index),
              borderRadius: BorderRadius.circular(AppTheme.pillRadius),
              child: Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 18, vertical: 11),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(AppTheme.pillRadius),
                  border: Border.all(
                    color: isSelected
                        ? AppTheme.primaryColor
                        : AppTheme.borderColor,
                  ),
                ),
                child: Text(
                  categories[index],
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w800,
                    color: isSelected ? AppTheme.white : AppTheme.textSecondary,
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}

class MenuSectionList extends StatelessWidget {
  const MenuSectionList({
    required this.categories,
    required this.selectedIndex,
    required this.onSelected,
    required this.items,
    required this.onAddItem,
    this.headerTitle,
    this.headerCount,
    this.emptyTitle = 'No items in this category',
    this.emptySubtitle = 'Try a different category',
    this.includeHeaderCount = false,
    super.key,
  });

  final List<String> categories;
  final int selectedIndex;
  final ValueChanged<int> onSelected;
  final List<MockMenuItem> items;
  final void Function(MockMenuItem item) onAddItem;
  final String? headerTitle;
  final int? headerCount;
  final String emptyTitle;
  final String emptySubtitle;
  final bool includeHeaderCount;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (categories.isNotEmpty) ...[
          CategoryChipRow(
            categories: categories,
            selectedIndex: selectedIndex,
            onSelected: onSelected,
          ),
          const SizedBox(height: 12),
        ],
        if (headerTitle != null) ...[
          Row(
            children: [
              Text(
                headerTitle!,
                style: Theme.of(context).textTheme.titleMedium,
              ),
              if (includeHeaderCount && headerCount != null) ...[
                const SizedBox(width: 8),
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(
                    color: AppTheme.backgroundGrey,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: AppTheme.borderColor),
                  ),
                  child: Text(
                    '$headerCount',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: AppTheme.textSecondary,
                    ),
                  ),
                ),
              ],
            ],
          ),
          const SizedBox(height: 12),
        ],
        if (items.isEmpty)
          EmptyState(
            icon: Icons.restaurant_menu_rounded,
            title: emptyTitle,
            subtitle: emptySubtitle,
          )
        else
          Column(
            children: items
                .map(
                  (item) => Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: MenuItemCard(
                      name: item.name,
                      description: item.description,
                      price: item.price,
                      imageColor: item.imageColor,
                      isPopular: item.isPopular,
                      onAdd: () => onAddItem(item),
                    ),
                  ),
                )
                .toList(),
          ),
      ],
    );
  }
}

// ── Promo Banner ─────────────────────────────────────────────────────────

class PromoBanner extends StatelessWidget {
  const PromoBanner({
    required this.title,
    required this.subtitle,
    required this.discount,
    required this.gradientColors,
    this.onTap,
    super.key,
  });

  final String title;
  final String subtitle;
  final String discount;
  final List<Color> gradientColors;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      borderRadius: BorderRadius.circular(AppTheme.cardRadius),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppTheme.cardRadius),
        child: Container(
          width: 302,
          padding: const EdgeInsets.fromLTRB(18, 16, 18, 16),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: gradientColors,
            ),
            borderRadius: BorderRadius.circular(AppTheme.cardRadius),
            boxShadow: [AppTheme.softShadow(alpha: 0.075)],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.start,
            children: [
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                decoration: BoxDecoration(
                  color: AppTheme.white.withValues(alpha: 0.16),
                  borderRadius: BorderRadius.circular(AppTheme.pillRadius),
                  border: Border.all(
                    color: AppTheme.white.withValues(alpha: 0.16),
                  ),
                ),
                child: Text(
                  context.l10n.raw('Limited'),
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w700,
                    color: AppTheme.white,
                  ),
                ),
              ),
              const SizedBox(height: 10),
              Text(
                context.l10n.raw(discount),
                style: const TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.w900,
                  color: AppTheme.white,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                title,
                style: const TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w700,
                  color: AppTheme.white,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 2),
              Text(
                subtitle,
                style: TextStyle(
                  fontSize: 12,
                  color: AppTheme.white.withValues(alpha: 0.86),
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ── Order Status Badge ──────────────────────────────────────────────────

class StatusBadge extends StatelessWidget {
  const StatusBadge({
    required this.label,
    required this.color,
    super.key,
  });

  final String label;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(9),
      ),
      child: Text(
        label,
        style: TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w700,
          color: color,
        ),
      ),
    );
  }
}

// ── Empty State ──────────────────────────────────────────────────────────

class EmptyState extends StatelessWidget {
  const EmptyState({
    required this.icon,
    required this.title,
    this.subtitle,
    this.actionLabel,
    this.onAction,
    super.key,
  });

  final IconData icon;
  final String title;
  final String? subtitle;
  final String? actionLabel;
  final VoidCallback? onAction;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(40),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: AppTheme.surfaceMuted,
                borderRadius: BorderRadius.circular(18),
              ),
              child: Icon(icon, size: 48, color: AppTheme.textSecondary),
            ),
            const SizedBox(height: 20),
            Text(
              context.l10n.raw(title),
              style: const TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.w800,
                letterSpacing: 0,
              ),
              textAlign: TextAlign.center,
            ),
            if (subtitle != null) ...[
              const SizedBox(height: 8),
              Text(
                context.l10n.raw(subtitle!),
                style: TextStyle(
                  fontSize: 14,
                  color: AppTheme.textSecondary,
                ),
                textAlign: TextAlign.center,
              ),
            ],
            if (actionLabel != null) ...[
              const SizedBox(height: 20),
              FilledButton(
                onPressed: onAction,
                style: FilledButton.styleFrom(
                  minimumSize: const Size(200, 48),
                ),
                child: Text(context.l10n.raw(actionLabel!)),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class LoadingSkeleton extends StatelessWidget {
  const LoadingSkeleton({
    this.height = 96,
    this.radius = AppTheme.cardRadius,
    super.key,
  });

  final double height;
  final double radius;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: height,
      decoration: BoxDecoration(
        color: AppTheme.surfaceMuted,
        borderRadius: BorderRadius.circular(radius),
        border: Border.all(color: AppTheme.borderColor),
      ),
    );
  }
}

// ── Bottom CTA Bar ──────────────────────────────────────────────────────

class BottomCTABar extends StatelessWidget {
  const BottomCTABar({
    required this.label,
    this.sublabel,
    this.onPressed,
    this.trailingText,
    super.key,
  });

  final String label;
  final String? sublabel;
  final VoidCallback? onPressed;
  final String? trailingText;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.only(
        left: 20,
        right: 20,
        top: 14,
        bottom: MediaQuery.of(context).padding.bottom + 14,
      ),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        border: Border(
            top:
                BorderSide(color: AppTheme.borderColor.withValues(alpha: 0.7))),
        boxShadow: [
          BoxShadow(
            color: AppTheme.inkColor.withValues(alpha: 0.10),
            blurRadius: 18,
            offset: const Offset(0, -6),
          ),
        ],
      ),
      child: FilledButton(
        onPressed: onPressed,
        style: FilledButton.styleFrom(
          minimumSize: const Size(double.infinity, 60),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
        child: Row(
          children: [
            Expanded(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(label),
                  if (sublabel != null)
                    Padding(
                      padding: const EdgeInsets.only(top: 2),
                      child: Text(
                        sublabel!,
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                          color: AppTheme.white.withValues(alpha: 0.82),
                        ),
                      ),
                    ),
                ],
              ),
            ),
            if (trailingText != null)
              Text(
                trailingText!,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w900,
                ),
              ),
          ],
        ),
      ),
    );
  }
}

// ── Search Bar ──────────────────────────────────────────────────────────

class AppSearchBar extends StatelessWidget {
  const AppSearchBar({
    this.hint = 'Search restaurants, food...',
    this.onTap,
    this.readOnly = true,
    this.controller,
    this.onChanged,
    this.autofocus = false,
    super.key,
  });

  final String hint;
  final VoidCallback? onTap;
  final bool readOnly;
  final TextEditingController? controller;
  final ValueChanged<String>? onChanged;
  final bool autofocus;

  @override
  Widget build(BuildContext context) {
    final inner = Container(
      constraints: const BoxConstraints(minHeight: 56),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 15),
      decoration: BoxDecoration(
        color: AppTheme.surfaceMuted,
        borderRadius: BorderRadius.circular(AppTheme.pillRadius),
        border: Border.all(color: AppTheme.borderColor),
        boxShadow: [
          AppTheme.softShadow(alpha: 0.025),
        ],
      ),
      child: Row(
        children: [
          Icon(Icons.search_rounded, size: 22, color: AppTheme.textSecondary),
          const SizedBox(width: 10),
          Expanded(
            child: readOnly
                ? Text(
                    context.l10n.raw(hint),
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w600,
                      color: AppTheme.textSecondary,
                    ),
                  )
                : TextField(
                    controller: controller,
                    onChanged: onChanged,
                    autofocus: autofocus,
                    decoration: InputDecoration(
                      hintText: context.l10n.raw(hint),
                      border: InputBorder.none,
                      enabledBorder: InputBorder.none,
                      focusedBorder: InputBorder.none,
                      contentPadding: EdgeInsets.zero,
                      isDense: true,
                      filled: false,
                    ),
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
          ),
        ],
      ),
    );

    if (!readOnly) return inner;

    return Material(
      color: Colors.transparent,
      borderRadius: BorderRadius.circular(AppTheme.pillRadius),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppTheme.pillRadius),
        child: inner,
      ),
    );
  }
}

// ── Address Pill ─────────────────────────────────────────────────────────

class AddressPill extends StatelessWidget {
  const AddressPill({
    required this.label,
    required this.address,
    this.onTap,
    super.key,
  });

  final String label;
  final String address;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(14),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 34,
            height: 34,
            decoration: BoxDecoration(
              color: AppTheme.primaryColor.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(AppTheme.pillRadius),
            ),
            child: Icon(
              Icons.location_on_rounded,
              size: 18,
              color: AppTheme.primaryColor,
            ),
          ),
          const SizedBox(width: 6),
          Flexible(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      label,
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(width: 4),
                    Icon(Icons.keyboard_arrow_down_rounded,
                        size: 18, color: AppTheme.textSecondary),
                  ],
                ),
                Text(
                  address,
                  style: TextStyle(
                    fontSize: 12,
                    color: AppTheme.textSecondary,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ── Rating Stars ─────────────────────────────────────────────────────────

class RatingStars extends StatelessWidget {
  const RatingStars({
    required this.rating,
    this.size = 18,
    this.interactive = false,
    this.onChanged,
    super.key,
  });

  final double rating;
  final double size;
  final bool interactive;
  final ValueChanged<double>? onChanged;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: List.generate(5, (index) {
        final starValue = index + 1.0;
        final isFull = rating >= starValue;
        final isHalf = rating >= starValue - 0.5 && rating < starValue;

        final iconData = isFull
            ? Icons.star_rounded
            : isHalf
                ? Icons.star_half_rounded
                : Icons.star_outline_rounded;

        if (interactive) {
          return IconButton(
            onPressed: () => onChanged?.call(starValue),
            icon: Icon(iconData, color: AppTheme.secondaryColor),
            iconSize: size,
            padding: const EdgeInsets.only(right: 2),
            constraints: BoxConstraints(minWidth: size + 2, minHeight: size),
            visualDensity: VisualDensity.compact,
          );
        }

        return Padding(
          padding: const EdgeInsets.only(right: 2),
          child: Icon(iconData, size: size, color: AppTheme.secondaryColor),
        );
      }),
    );
  }
}

// ── Order Card ───────────────────────────────────────────────────────────

class OrderCard extends StatelessWidget {
  const OrderCard({
    required this.orderId,
    required this.storeName,
    required this.status,
    required this.total,
    required this.itemCount,
    required this.createdAt,
    required this.statusColor,
    this.paymentContextLabel,
    this.paymentContextColor,
    this.onTap,
    super.key,
  });

  final String orderId;
  final String storeName;
  final String status;
  final int total;
  final int itemCount;
  final String createdAt;
  final Color statusColor;
  final String? paymentContextLabel;
  final Color? paymentContextColor;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: AppTheme.white,
      borderRadius: BorderRadius.circular(18),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(18),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: AppTheme.borderColor),
            boxShadow: [
              BoxShadow(
                color: AppTheme.inkColor.withValues(alpha: 0.04),
                blurRadius: 16,
                offset: const Offset(0, 8),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Text(
                      storeName,
                      style: const TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  StatusBadge(
                      label: formatOrderStatus(
                        status,
                        languageCode: context.l10n.locale.languageCode,
                      ),
                      color: statusColor),
                ],
              ),
              const SizedBox(height: 12),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: [
                  InfoPill(
                    icon: Icons.receipt_long_outlined,
                    label: orderId,
                  ),
                  InfoPill(
                    icon: Icons.shopping_bag_outlined,
                    label: formatItemCount(
                      itemCount,
                      languageCode: context.l10n.locale.languageCode,
                    ),
                  ),
                  InfoPill(
                    icon: Icons.payments_outlined,
                    label: formatCustomerMoney(total),
                    highlight: true,
                  ),
                ],
              ),
              const SizedBox(height: 10),
              Text(
                formatOrderDate(
                  createdAt,
                  languageCode: context.l10n.locale.languageCode,
                ),
                style: TextStyle(fontSize: 12, color: AppTheme.textSecondary),
              ),
              if (paymentContextLabel != null) ...[
                const SizedBox(height: 8),
                Text(
                  paymentContextLabel!,
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                    color: paymentContextColor ?? AppTheme.warningColor,
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

class AccountSectionLabel extends StatelessWidget {
  const AccountSectionLabel({
    required this.label,
    super.key,
  });

  final String label;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 24, 20, 10),
      child: Text(
        context.l10n.raw(label).toUpperCase(),
        style: TextStyle(
          fontSize: 11,
          fontWeight: FontWeight.w800,
          color: AppTheme.textSecondary,
          letterSpacing: 1,
        ),
      ),
    );
  }
}

class AccountActionGroup extends StatelessWidget {
  const AccountActionGroup({
    required this.children,
    this.margin = const EdgeInsets.symmetric(horizontal: 16),
    super.key,
  });

  final List<Widget> children;
  final EdgeInsets margin;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: margin,
      decoration: BoxDecoration(
        color: AppTheme.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppTheme.borderColor),
        boxShadow: [
          BoxShadow(
            color: AppTheme.inkColor.withValues(alpha: 0.03),
            blurRadius: 16,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: children,
      ),
    );
  }
}

class AccountActionDivider extends StatelessWidget {
  const AccountActionDivider({super.key});

  @override
  Widget build(BuildContext context) {
    return Divider(
      height: 1,
      indent: 66,
      endIndent: 0,
      color: AppTheme.borderColor,
    );
  }
}

class AccountActionTile extends StatelessWidget {
  const AccountActionTile({
    required this.icon,
    required this.iconColor,
    required this.label,
    this.onTap,
    this.labelColor,
    this.trailing,
    super.key,
  });

  final IconData icon;
  final Color iconColor;
  final String label;
  final VoidCallback? onTap;
  final Color? labelColor;
  final Widget? trailing;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(18),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
        child: Row(
          children: [
            Container(
              width: 42,
              height: 42,
              decoration: BoxDecoration(
                color: iconColor.withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(13),
              ),
              child: Icon(icon, size: 20, color: iconColor),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Text(
                context.l10n.raw(label),
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w600,
                  color: labelColor ?? Theme.of(context).colorScheme.onSurface,
                ),
              ),
            ),
            trailing ??
                (onTap != null
                    ? Icon(
                        Icons.chevron_right_rounded,
                        size: 20,
                        color: AppTheme.textSecondary,
                      )
                    : const SizedBox.shrink()),
          ],
        ),
      ),
    );
  }
}

class AccountToggleTile extends StatelessWidget {
  const AccountToggleTile({
    required this.icon,
    required this.iconColor,
    required this.label,
    required this.value,
    required this.onChanged,
    super.key,
  });

  final IconData icon;
  final Color iconColor;
  final String label;
  final bool value;
  final ValueChanged<bool> onChanged;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      child: Row(
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: iconColor.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, size: 18, color: iconColor),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Text(
              context.l10n.raw(label),
              style: const TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
          Switch(
            value: value,
            onChanged: onChanged,
            activeTrackColor: AppTheme.primaryColor,
          ),
        ],
      ),
    );
  }
}
