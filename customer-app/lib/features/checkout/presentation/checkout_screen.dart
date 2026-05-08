import 'package:flutter/material.dart';

import '../../../app/router/route_names.dart';
import '../../../core/data/customer_runtime_controller.dart';
import '../../../core/data/mock_data.dart' show formatCustomerMoney;
import '../../../core/i18n/app_localizations.dart';
import '../../../core/payments/vnpay_sandbox_payment_service.dart';
import '../../../core/session/customer_session_controller.dart';
import '../../../core/theme/app_theme.dart';
import '../../common/presentation/widgets.dart';

class CheckoutScreen extends StatefulWidget {
  const CheckoutScreen({super.key});

  @override
  State<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends State<CheckoutScreen> {
  final _instructionsController = TextEditingController();
  int _selectedPaymentIndex = 0;
  bool _isSubmitting = false;

  static const _paymentMethods = [
    _PaymentOption(
      icon: Icons.payments_outlined,
      label: 'Cash',
      detail: 'Pay on delivery',
      paymentMethodCode: 'cash',
    ),
    _PaymentOption(
      icon: Icons.credit_card_rounded,
      label: 'VNPAY Card Test',
      detail: 'Sandbox card flow with bank selection on VNPAY',
      paymentMethodCode: 'card',
      isVnpaySandbox: true,
    ),
    _PaymentOption(
      icon: Icons.account_balance_wallet_outlined,
      label: 'VNPAY Pay Test',
      detail: 'Sandbox QR and mobile banking flow',
      paymentMethodCode: 'digital_wallet',
      isVnpaySandbox: true,
      vnpayBankCode: 'VNPAYQR',
    ),
  ];

  @override
  void dispose() {
    _instructionsController.dispose();
    super.dispose();
  }

  Future<void> _placeOrder() async {
    final runtime = CustomerRuntimeController.instance;
    debugPrint(
      '[Checkout] placeOrder:tap submitting=$_isSubmitting cartItems=${runtime.cartItems.length}',
    );
    if (_isSubmitting || runtime.cartItems.isEmpty) {
      debugPrint(
        '[Checkout] placeOrder:validation_failed submitting=$_isSubmitting cartItems=${runtime.cartItems.length}',
      );
      return;
    }
    if (CustomerSessionController.instance.isGuest) {
      debugPrint('[Checkout] placeOrder:validation_failed guest_session');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            context.l10n.raw(
              'Sign in to place your order. Your cart will stay here.',
            ),
          ),
        ),
      );
      Navigator.of(context).pushNamed(RouteNames.auth);
      return;
    }

    setState(() => _isSubmitting = true);
    try {
      debugPrint('[Checkout] placeOrder:validation_passed');
      await Future<void>.delayed(const Duration(milliseconds: 500));
      final selectedPayment = _paymentMethods[_selectedPaymentIndex];
      debugPrint(
        '[Checkout] placeOrder:submit_start payment=${selectedPayment.paymentMethodCode}',
      );

      final order = await runtime.submitOrder(
        instructions: _instructionsController.text,
        paymentMethod: selectedPayment.paymentMethodCode,
      );

      if (!mounted) return;

      if (order == null) {
        final blocker = runtime.lastRuntimeBlocker;
        debugPrint(
          '[Checkout] placeOrder:submit_failure blocker=${blocker ?? 'unknown'}',
        );
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(_messageForBlocker(blocker)),
          ),
        );
        if (blocker == 'checkout_input_missing' &&
            runtime.deliveryAddress == null) {
          Navigator.of(context).pushNamed(RouteNames.addresses);
        }
        return;
      }

      debugPrint(
        '[Checkout] placeOrder:submit_success orderId=${order.order.id}',
      );
      if (selectedPayment.isVnpaySandbox) {
        final paymentResult =
            await const VnpaySandboxPaymentService().openSandboxPayment(
          VnpaySandboxPaymentRequest(
            orderId: order.order.id,
            bankCode: selectedPayment.vnpayBankCode,
          ),
        );
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(paymentResult.launched
                ? 'Opening VNPAY sandbox. Order payment remains pending.'
                : paymentResult.message ??
                    'VNPAY sandbox could not be opened.'),
          ),
        );
        Navigator.of(context).pushReplacementNamed(
          RouteNames.orderStatus,
          arguments: order.order.id,
        );
        return;
      }
      debugPrint(
        '[Checkout] placeOrder:navigate route=${RouteNames.orderCompletion} orderId=${order.order.id}',
      );
      Navigator.of(context).pushReplacementNamed(
        RouteNames.orderCompletion,
        arguments: order.order.id,
      );
    } catch (error, stackTrace) {
      debugPrint('[Checkout] placeOrder:submit_exception error=$error');
      debugPrintStack(
        stackTrace: stackTrace,
        label: '[Checkout] placeOrder:submit_exception_stack',
      );
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            context.l10n.raw(
              'Unable to place order right now. Please try again.',
            ),
          ),
        ),
      );
    } finally {
      if (mounted) {
        setState(() => _isSubmitting = false);
      }
    }
  }

  String _messageForBlocker(String? blocker) {
    switch (blocker) {
      case 'authenticated_customer_session_required':
        return 'Sign in to a supported customer account session to place a real order.';
      case 'checkout_input_missing':
        return 'Add a delivery address before placing your order.';
      case 'minimum_order_not_met':
        return 'Minimum order is ${formatCustomerMoney(CustomerRuntimeController.minimumOrderCentavos)} before checkout.';
      case 'store_menu_unavailable':
        return 'This store menu is unavailable right now. Please try another store.';
      case 'cart_line_items_unavailable':
        return 'Some cart items are no longer available in the live menu. Please add them again.';
      case 'persisted_order_submit_in_progress':
        return 'This order request is still finishing. Please wait a moment and try again.';
      case 'persisted_order_request_changed':
        return 'Checkout details changed during retry. Review them once and place the order again.';
      case 'persisted_order_request_invalid':
        return 'This order request could not be validated. Please try checkout again.';
      default:
        return 'Unable to place order right now. Please review checkout details.';
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final runtime = CustomerRuntimeController.instance;

    return ListenableBuilder(
      listenable: runtime,
      builder: (context, _) {
        final selectedAddress = runtime.deliveryAddress;
        final store = runtime.selectedStore;
        final cartItems = runtime.cartItems;
        final blocker = runtime.lastRuntimeBlocker;
        final menuUnavailable =
            store != null && runtime.isStoreMenuUnavailable(store.id);
        final cartHasUnavailableItems =
            runtime.selectedStoreCartHasUnavailableItems();
        final isPlaceOrderEnabled = !_isSubmitting &&
            selectedAddress != null &&
            runtime.meetsMinimumOrder &&
            !menuUnavailable &&
            !cartHasUnavailableItems;

        return Scaffold(
          backgroundColor: AppTheme.backgroundGrey,
          appBar: AppBar(
            title: Text(l10n.raw('Checkout')),
            backgroundColor: AppTheme.backgroundGrey,
            leading: IconButton(
              icon: const Icon(Icons.arrow_back_rounded),
              onPressed: () => Navigator.of(context).pop(),
            ),
          ),
          body: cartItems.isEmpty
              ? EmptyState(
                  icon: Icons.shopping_bag_outlined,
                  title: blocker == 'cart_line_items_unavailable'
                      ? l10n.raw('Cart updated for live menu')
                      : l10n.raw('Nothing to check out yet'),
                  subtitle: blocker == 'store_menu_unavailable'
                      ? l10n.raw(
                          'This store menu is unavailable right now. Please choose another store.',
                        )
                      : blocker == 'cart_line_items_unavailable'
                          ? l10n.raw(
                              'Some items were removed because they are not available in the live menu anymore.',
                            )
                          : l10n.raw(
                              'Add items to your cart before placing an order.',
                            ),
                  actionLabel: l10n.raw('Back to Home'),
                  onAction: () =>
                      Navigator.of(context).pushNamed(RouteNames.home),
                )
              : ListView(
                  padding: const EdgeInsets.fromLTRB(16, 16, 16, 100),
                  children: [
                    const _InfoNoticeCard(
                      message: 'VNPAY options open sandbox only. '
                          'No live charges or payment completion will run.',
                    ),
                    if (menuUnavailable || cartHasUnavailableItems) ...[
                      const SizedBox(height: 16),
                      _InfoNoticeCard(
                        message: menuUnavailable
                            ? l10n.raw(
                                'This store does not have a live orderable menu right now, so placing an order is temporarily disabled.')
                            : l10n.raw(
                                'Some items in this cart are no longer available in the live menu. Please return to the store and add items again.'),
                      ),
                    ],
                    const SizedBox(height: 16),
                    _SectionCard(
                      title: l10n.raw('Delivery Address'),
                      trailingLabel: l10n.raw('Manage'),
                      onTrailingTap: () =>
                          Navigator.of(context).pushNamed(RouteNames.addresses),
                      child: selectedAddress == null
                          ? Row(
                              children: [
                                Icon(
                                  Icons.location_off_outlined,
                                  size: 22,
                                  color: AppTheme.textSecondary,
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Text(
                                    l10n.raw(
                                      'No delivery address saved. Tap Manage to add one.',
                                    ),
                                    style: TextStyle(
                                      fontSize: 14,
                                      color: AppTheme.textSecondary,
                                    ),
                                  ),
                                ),
                              ],
                            )
                          : Row(
                              children: [
                                Container(
                                  width: 44,
                                  height: 44,
                                  decoration: BoxDecoration(
                                    color: AppTheme.primaryColor
                                        .withValues(alpha: 0.1),
                                    borderRadius: BorderRadius.circular(10),
                                  ),
                                  child: Icon(
                                    Icons.location_on_rounded,
                                    size: 22,
                                    color: AppTheme.primaryColor,
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        children: [
                                          Text(
                                            selectedAddress.label,
                                            style: const TextStyle(
                                              fontSize: 15,
                                              fontWeight: FontWeight.w700,
                                            ),
                                          ),
                                          if (selectedAddress.isDefault) ...[
                                            const SizedBox(width: 6),
                                            Container(
                                              padding:
                                                  const EdgeInsets.symmetric(
                                                horizontal: 6,
                                                vertical: 2,
                                              ),
                                              decoration: BoxDecoration(
                                                color: AppTheme.primaryColor
                                                    .withValues(alpha: 0.1),
                                                borderRadius:
                                                    BorderRadius.circular(5),
                                              ),
                                              child: Text(
                                                l10n.raw('Default'),
                                                style: TextStyle(
                                                  fontSize: 10,
                                                  fontWeight: FontWeight.w700,
                                                  color: AppTheme.primaryColor,
                                                ),
                                              ),
                                            ),
                                          ],
                                        ],
                                      ),
                                      const SizedBox(height: 2),
                                      Text(
                                        selectedAddress.street,
                                        style: const TextStyle(
                                          fontSize: 14,
                                          fontWeight: FontWeight.w500,
                                        ),
                                      ),
                                      Text(
                                        selectedAddress.detail,
                                        style: TextStyle(
                                          fontSize: 13,
                                          color: AppTheme.textSecondary,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                    ),
                    const SizedBox(height: 12),
                    _SectionCard(
                      title: l10n.raw('Delivery Instructions'),
                      child: TextField(
                        controller: _instructionsController,
                        maxLines: 3,
                        minLines: 2,
                        decoration: InputDecoration(
                          hintText: l10n.raw(
                            'E.g. Leave at the door, ring the bell...',
                          ),
                          filled: true,
                          fillColor: AppTheme.backgroundGrey,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide(color: AppTheme.borderColor),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide(color: AppTheme.borderColor),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide(
                              color: AppTheme.primaryColor,
                              width: 2,
                            ),
                          ),
                          contentPadding: const EdgeInsets.all(12),
                        ),
                        style: const TextStyle(fontSize: 14),
                      ),
                    ),
                    const SizedBox(height: 12),
                    _SectionCard(
                      title: l10n.raw('Payment Method'),
                      child: Column(
                        children:
                            List.generate(_paymentMethods.length, (index) {
                          final method = _paymentMethods[index];
                          final isSelected = index == _selectedPaymentIndex;
                          return InkWell(
                            onTap: () =>
                                setState(() => _selectedPaymentIndex = index),
                            borderRadius: BorderRadius.circular(12),
                            child: Container(
                              margin: EdgeInsets.only(
                                bottom:
                                    index < _paymentMethods.length - 1 ? 10 : 0,
                              ),
                              padding: const EdgeInsets.all(14),
                              decoration: BoxDecoration(
                                color: isSelected
                                    ? AppTheme.primaryColor
                                        .withValues(alpha: 0.05)
                                    : AppTheme.backgroundGrey,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(
                                  color: isSelected
                                      ? AppTheme.primaryColor
                                      : AppTheme.borderColor,
                                  width: isSelected ? 2 : 1,
                                ),
                              ),
                              child: Row(
                                children: [
                                  Icon(
                                    method.icon,
                                    size: 22,
                                    color: isSelected
                                        ? AppTheme.primaryColor
                                        : AppTheme.textSecondary,
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          l10n.raw(method.label),
                                          style: TextStyle(
                                            fontSize: 14,
                                            fontWeight: FontWeight.w700,
                                            color: isSelected
                                                ? AppTheme.primaryColor
                                                : null,
                                          ),
                                        ),
                                        Text(
                                          l10n.raw(method.detail),
                                          style: TextStyle(
                                            fontSize: 12,
                                            color: AppTheme.textSecondary,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                  if (isSelected)
                                    Icon(
                                      Icons.check_circle_rounded,
                                      size: 20,
                                      color: AppTheme.primaryColor,
                                    ),
                                ],
                              ),
                            ),
                          );
                        }),
                      ),
                    ),
                    const SizedBox(height: 12),
                    _SectionCard(
                      title: l10n.raw('Order Summary'),
                      child: Column(
                        children: [
                          Row(
                            children: [
                              Container(
                                width: 44,
                                height: 44,
                                decoration: BoxDecoration(
                                  color: AppTheme.secondaryColor
                                      .withValues(alpha: 0.15),
                                  borderRadius: BorderRadius.circular(10),
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
                                      store?.name ?? l10n.raw('Selected store'),
                                      style: const TextStyle(
                                        fontSize: 15,
                                        fontWeight: FontWeight.w700,
                                      ),
                                    ),
                                    Text(
                                      l10n.cartItemCount(runtime.cartItemCount),
                                      style: TextStyle(
                                        fontSize: 13,
                                        color: AppTheme.textSecondary,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 14),
                          ...cartItems.map((cartItem) {
                            return Padding(
                              padding: const EdgeInsets.only(bottom: 6),
                              child: Row(
                                children: [
                                  Container(
                                    width: 24,
                                    height: 24,
                                    decoration: BoxDecoration(
                                      color: AppTheme.backgroundGrey,
                                      borderRadius: BorderRadius.circular(6),
                                      border: Border.all(
                                          color: AppTheme.borderColor),
                                    ),
                                    child: Center(
                                      child: Text(
                                        '${cartItem.quantity}',
                                        style: const TextStyle(
                                          fontSize: 11,
                                          fontWeight: FontWeight.w700,
                                        ),
                                      ),
                                    ),
                                  ),
                                  const SizedBox(width: 10),
                                  Expanded(
                                    child: Text(
                                      cartItem.menuItem.name,
                                      style: const TextStyle(
                                        fontSize: 14,
                                        fontWeight: FontWeight.w500,
                                      ),
                                    ),
                                  ),
                                  Text(
                                    formatCustomerMoney(cartItem.total),
                                    style: const TextStyle(
                                      fontSize: 14,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ],
                              ),
                            );
                          }),
                        ],
                      ),
                    ),
                    const SizedBox(height: 12),
                    _SectionCard(
                      title: l10n.raw('Price Breakdown'),
                      child: Column(
                        children: [
                          PriceRow(
                            label: l10n.text('cart.subtotal'),
                            amount: formatCustomerMoney(runtime.cartSubtotal),
                          ),
                          PriceRow(
                            label: l10n.text('cart.deliveryFee'),
                            amount:
                                formatCustomerMoney(runtime.cartDeliveryFee),
                          ),
                          PriceRow(
                            label: l10n.text('cart.serviceFee'),
                            amount: formatCustomerMoney(runtime.cartServiceFee),
                          ),
                          if (runtime.hasPromoApplied)
                            PriceRow(
                              label:
                                  '${l10n.raw('Promo')} (${runtime.promoCode})',
                              amount:
                                  '-${formatCustomerMoney(runtime.promoDiscount)}',
                              isDiscount: true,
                            ),
                          const Padding(
                            padding: EdgeInsets.symmetric(vertical: 8),
                            child: Divider(),
                          ),
                          PriceRow(
                            label: l10n.text('cart.total'),
                            amount: formatCustomerMoney(runtime.cartTotal),
                            isBold: true,
                          ),
                        ],
                      ),
                    ),
                    if (!runtime.meetsMinimumOrder) ...[
                      const SizedBox(height: 12),
                      _InfoNoticeCard(
                        message: l10n.minimumOrderNotice(
                          minimum: formatCustomerMoney(
                            CustomerRuntimeController.minimumOrderCentavos,
                          ),
                          shortfall: formatCustomerMoney(
                            runtime.minimumOrderShortfallCentavos,
                          ),
                        ),
                      ),
                    ],
                  ],
                ),
          bottomNavigationBar: cartItems.isEmpty
              ? null
              : BottomCTABar(
                  label: _isSubmitting
                      ? l10n.raw('Placing Order...')
                      : menuUnavailable || cartHasUnavailableItems
                          ? l10n.raw('Menu Unavailable')
                          : l10n.raw('Place Order'),
                  sublabel: selectedAddress == null
                      ? l10n.raw('Add delivery address')
                      : store?.name ?? l10n.raw('Ready to submit'),
                  trailingText: formatCustomerMoney(runtime.cartTotal),
                  onPressed: isPlaceOrderEnabled ? _placeOrder : null,
                ),
        );
      },
    );
  }
}

class _PaymentOption {
  const _PaymentOption({
    required this.icon,
    required this.label,
    required this.detail,
    required this.paymentMethodCode,
    this.isVnpaySandbox = false,
    this.vnpayBankCode,
  });

  final IconData icon;
  final String label;
  final String detail;
  final String paymentMethodCode;
  final bool isVnpaySandbox;
  final String? vnpayBankCode;
}

class _SectionCard extends StatelessWidget {
  const _SectionCard({
    required this.title,
    required this.child,
    this.trailingLabel,
    this.onTrailingTap,
  });

  final String title;
  final Widget child;
  final String? trailingLabel;
  final VoidCallback? onTrailingTap;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(AppTheme.cardRadius),
        border: Border.all(color: AppTheme.borderColor),
        boxShadow: [AppTheme.softShadow(alpha: 0.03)],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                context.l10n.raw(title),
                style: const TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w700,
                ),
              ),
              if (trailingLabel != null)
                TextButton(
                  onPressed: onTrailingTap,
                  style: TextButton.styleFrom(
                    padding: EdgeInsets.zero,
                    minimumSize: Size.zero,
                    tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                  ),
                  child: Text(
                    context.l10n.raw(trailingLabel!),
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: AppTheme.primaryColor,
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 14),
          child,
        ],
      ),
    );
  }
}

class _InfoNoticeCard extends StatelessWidget {
  const _InfoNoticeCard({required this.message});

  final String message;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppTheme.surfaceMuted,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(
            Icons.info_outline_rounded,
            size: 18,
            color: AppTheme.textSecondary,
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              context.l10n.raw(message),
              style: TextStyle(
                fontSize: 13,
                color: AppTheme.textSecondary,
                fontWeight: FontWeight.w400,
                height: 1.4,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
