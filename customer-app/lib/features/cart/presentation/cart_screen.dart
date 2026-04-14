import 'package:flutter/material.dart';

import '../../../app/router/route_names.dart';
import '../../../core/data/customer_runtime_controller.dart';
import '../../../core/data/mock_data.dart' show MockCartItem, formatCentavos;
import '../../../core/theme/app_theme.dart';
import '../../common/presentation/widgets.dart';

class CartScreen extends StatefulWidget {
  const CartScreen({super.key});

  @override
  State<CartScreen> createState() => _CartScreenState();
}

class _CartScreenState extends State<CartScreen> {
  final _promoController = TextEditingController();

  @override
  void dispose() {
    _promoController.dispose();
    super.dispose();
  }

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
        final items = runtime.cartItems;
        final store = runtime.selectedStore;
        final blocker = runtime.lastRuntimeBlocker;
        final menuUnavailable =
            store != null && runtime.isStoreMenuUnavailable(store.id);
        final cartHasUnavailableItems =
            runtime.selectedStoreCartHasUnavailableItems();
        final checkoutBlocked = menuUnavailable || cartHasUnavailableItems;

        if (runtime.hasPromoApplied &&
            _promoController.text != runtime.promoCode) {
          _promoController.text = runtime.promoCode ?? '';
        }

        return Scaffold(
          backgroundColor: AppTheme.backgroundGrey,
          appBar: AppBar(
            title: const Text('Cart'),
            backgroundColor: Colors.white,
            leading: IconButton(
              icon: const Icon(Icons.arrow_back_rounded),
              onPressed: () => Navigator.of(context).pop(),
            ),
            actions: [
              if (items.isNotEmpty)
                TextButton(
                  onPressed: runtime.clearCart,
                  child: const Text('Clear'),
                ),
            ],
          ),
          body: items.isEmpty
              ? EmptyState(
                  icon: Icons.shopping_cart_outlined,
                  title: blocker == 'cart_line_items_unavailable'
                      ? 'Your cart was refreshed'
                      : 'Your cart is empty',
                  subtitle: blocker == 'store_menu_unavailable'
                      ? 'This store menu is unavailable right now. Please choose another store.'
                      : blocker == 'cart_line_items_unavailable'
                          ? 'Some items were removed because they are not available in the live menu anymore.'
                          : 'Add items from a restaurant to get started',
                  actionLabel: 'Browse Restaurants',
                  onAction: () =>
                      Navigator.of(context).pushNamed(RouteNames.home),
                )
              : ListView(
                  padding: const EdgeInsets.fromLTRB(16, 16, 16, 100),
                  children: [
                    FeatureHeroCard(
                      eyebrow: 'Cart',
                      title: 'Review everything before checkout',
                      subtitle:
                          'Update quantities, apply the demo promo, and confirm this basket before you place the order.',
                      icon: Icons.shopping_bag_rounded,
                      badge: '\$${formatCentavos(runtime.cartTotal)} total',
                    ),
                    const SizedBox(height: 16),
                    _StoreContextCard(
                      storeName: store?.name ?? 'Selected store',
                      itemCount: runtime.cartItemCount,
                      onAddMore: store == null
                          ? null
                          : () => Navigator.of(context).pushNamed(
                                RouteNames.store,
                                arguments: store.id,
                              ),
                    ),
                    const SizedBox(height: 12),
                    if (checkoutBlocked) ...[
                      _CartWarningCard(
                        message: menuUnavailable
                            ? 'This store menu is unavailable right now, so checkout is temporarily disabled.'
                            : 'Some items in this cart are no longer available in the live menu. Please add them again from the store menu.',
                      ),
                      const SizedBox(height: 12),
                    ],
                    Container(
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppTheme.borderColor),
                      ),
                      child: Column(
                        children: List.generate(items.length, (index) {
                          final item = items[index];
                          return _CartItemRow(
                            item: item,
                            onDismissed: () =>
                                runtime.removeCartItem(item.menuItem.id),
                            onIncrement: () =>
                                runtime.updateCartQuantity(item.menuItem.id, 1),
                            onDecrement: () => runtime.updateCartQuantity(
                                item.menuItem.id, -1),
                            showDivider: index < items.length - 1,
                          );
                        }),
                      ),
                    ),
                    const SizedBox(height: 12),
                    _PromoCodeRow(
                      controller: _promoController,
                      isApplied: runtime.hasPromoApplied,
                      promoCode: runtime.promoCode,
                      onApply: () {
                        final applied =
                            runtime.applyPromoCode(_promoController.text);
                        if (!applied) {
                          _showMessage(
                              'Use SAVE5 to apply the demo promo code.');
                          return;
                        }
                        FocusScope.of(context).unfocus();
                        _showMessage('Promo code applied.');
                      },
                      onRemove: () {
                        runtime.removePromoCode();
                        _promoController.clear();
                      },
                    ),
                    const SizedBox(height: 12),
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppTheme.borderColor),
                      ),
                      child: Column(
                        children: [
                          PriceRow(
                            label: 'Subtotal',
                            amount: '\$${formatCentavos(runtime.cartSubtotal)}',
                          ),
                          PriceRow(
                            label: 'Delivery fee',
                            amount:
                                '\$${formatCentavos(runtime.cartDeliveryFee)}',
                          ),
                          PriceRow(
                            label: 'Service fee',
                            amount:
                                '\$${formatCentavos(runtime.cartServiceFee)}',
                          ),
                          if (runtime.hasPromoApplied)
                            PriceRow(
                              label: 'Promo (${runtime.promoCode})',
                              amount:
                                  '-\$${formatCentavos(runtime.promoDiscount)}',
                              isDiscount: true,
                            ),
                          const Padding(
                            padding: EdgeInsets.symmetric(vertical: 8),
                            child: Divider(),
                          ),
                          PriceRow(
                            label: 'Total',
                            amount: '\$${formatCentavos(runtime.cartTotal)}',
                            isBold: true,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
          bottomNavigationBar: items.isEmpty
              ? null
              : BottomCTABar(
                  label: checkoutBlocked ? 'Menu Unavailable' : 'Checkout',
                  trailingText: '\$${formatCentavos(runtime.cartTotal)}',
                  onPressed: checkoutBlocked
                      ? null
                      : () => Navigator.of(context).pushNamed(
                            RouteNames.checkout,
                          ),
                ),
        );
      },
    );
  }
}

class _CartWarningCard extends StatelessWidget {
  const _CartWarningCard({
    required this.message,
  });

  final String message;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppTheme.secondaryColor.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppTheme.borderColor),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(
            Icons.info_outline_rounded,
            size: 20,
            color: AppTheme.secondaryColor,
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              message,
              style: TextStyle(
                fontSize: 13,
                color: AppTheme.textSecondary,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _StoreContextCard extends StatelessWidget {
  const _StoreContextCard({
    required this.storeName,
    required this.itemCount,
    this.onAddMore,
  });

  final String storeName;
  final int itemCount;
  final VoidCallback? onAddMore;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppTheme.borderColor),
      ),
      child: Row(
        children: [
          Container(
            width: 46,
            height: 46,
            decoration: BoxDecoration(
              color: AppTheme.secondaryColor.withValues(alpha: 0.15),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Icon(
              Icons.storefront_rounded,
              size: 22,
              color: AppTheme.secondaryColor,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  storeName,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                Text(
                  '$itemCount item${itemCount == 1 ? '' : 's'} ready for checkout',
                  style: TextStyle(
                    fontSize: 13,
                    color: AppTheme.textSecondary,
                  ),
                ),
              ],
            ),
          ),
          TextButton(
            onPressed: onAddMore,
            child: const Text('Add more'),
          ),
        ],
      ),
    );
  }
}

class _CartItemRow extends StatelessWidget {
  const _CartItemRow({
    required this.item,
    required this.onDismissed,
    required this.onIncrement,
    required this.onDecrement,
    required this.showDivider,
  });

  final MockCartItem item;
  final VoidCallback onDismissed;
  final VoidCallback onIncrement;
  final VoidCallback onDecrement;
  final bool showDivider;

  @override
  Widget build(BuildContext context) {
    return Dismissible(
      key: ValueKey(item.menuItem.id),
      direction: DismissDirection.endToStart,
      onDismissed: (_) => onDismissed(),
      background: Container(
        alignment: Alignment.centerRight,
        padding: const EdgeInsets.only(right: 20),
        decoration: BoxDecoration(
          color: AppTheme.errorColor.withValues(alpha: 0.1),
          borderRadius: showDivider
              ? BorderRadius.zero
              : const BorderRadius.only(
                  bottomLeft: Radius.circular(16),
                  bottomRight: Radius.circular(16),
                ),
        ),
        child: Icon(
          Icons.delete_outline_rounded,
          color: AppTheme.errorColor,
          size: 24,
        ),
      ),
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(14),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: 56,
                  height: 56,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        item.menuItem.imageColor.withValues(alpha: 0.2),
                        item.menuItem.imageColor.withValues(alpha: 0.5),
                      ],
                    ),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(
                    Icons.restaurant_rounded,
                    size: 24,
                    color: item.menuItem.imageColor.withValues(alpha: 0.8),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        item.menuItem.name,
                        style: const TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      if (item.modifiers.isNotEmpty) ...[
                        const SizedBox(height: 4),
                        Wrap(
                          spacing: 6,
                          runSpacing: 4,
                          children: item.modifiers.map((modifier) {
                            return Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 8,
                                vertical: 3,
                              ),
                              decoration: BoxDecoration(
                                color: AppTheme.backgroundGrey,
                                borderRadius: BorderRadius.circular(6),
                                border: Border.all(color: AppTheme.borderColor),
                              ),
                              child: Text(
                                modifier,
                                style: TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w500,
                                  color: AppTheme.textSecondary,
                                ),
                              ),
                            );
                          }).toList(),
                        ),
                      ],
                      if (item.notes != null) ...[
                        const SizedBox(height: 4),
                        Text(
                          item.notes!,
                          style: TextStyle(
                            fontSize: 12,
                            fontStyle: FontStyle.italic,
                            color: AppTheme.textSecondary,
                          ),
                        ),
                      ],
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            '\$${formatCentavos(item.total)}',
                            style: const TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.w800,
                            ),
                          ),
                          QuantityControl(
                            quantity: item.quantity,
                            onIncrement: onIncrement,
                            onDecrement: onDecrement,
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          if (showDivider)
            Divider(
              height: 1,
              indent: 14,
              endIndent: 14,
              color: AppTheme.borderColor,
            ),
        ],
      ),
    );
  }
}

class _PromoCodeRow extends StatelessWidget {
  const _PromoCodeRow({
    required this.controller,
    required this.isApplied,
    required this.onApply,
    required this.onRemove,
    this.promoCode,
  });

  final TextEditingController controller;
  final bool isApplied;
  final VoidCallback onApply;
  final VoidCallback onRemove;
  final String? promoCode;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppTheme.borderColor),
      ),
      child: Row(
        children: [
          Icon(
            Icons.local_offer_outlined,
            size: 20,
            color: isApplied ? AppTheme.successColor : AppTheme.primaryColor,
          ),
          const SizedBox(width: 10),
          Expanded(
            child: isApplied
                ? Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Promo applied',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      Text(
                        '${promoCode ?? 'SAVE5'} — \$5.00 off your order',
                        style: TextStyle(
                          fontSize: 12,
                          color: AppTheme.successColor,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  )
                : TextField(
                    controller: controller,
                    decoration: const InputDecoration(
                      hintText: 'Promo code',
                      border: InputBorder.none,
                      enabledBorder: InputBorder.none,
                      focusedBorder: InputBorder.none,
                      contentPadding: EdgeInsets.zero,
                      isDense: true,
                      filled: false,
                    ),
                    style: const TextStyle(fontSize: 14),
                    textCapitalization: TextCapitalization.characters,
                  ),
          ),
          const SizedBox(width: 8),
          isApplied
              ? InkWell(
                  onTap: onRemove,
                  borderRadius: BorderRadius.circular(8),
                  child: Icon(
                    Icons.close_rounded,
                    size: 18,
                    color: AppTheme.textSecondary,
                  ),
                )
              : FilledButton(
                  onPressed: onApply,
                  style: FilledButton.styleFrom(
                    minimumSize: const Size(0, 40),
                    padding: const EdgeInsets.symmetric(horizontal: 14),
                  ),
                  child: const Text('Apply'),
                ),
        ],
      ),
    );
  }
}
