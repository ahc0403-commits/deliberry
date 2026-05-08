import 'package:flutter/material.dart';

import '../../../app/router/route_names.dart';
import '../../../core/data/customer_runtime_controller.dart';
import '../../../core/data/mock_data.dart';
import '../../../core/i18n/app_localizations.dart';
import '../../../core/theme/app_theme.dart';
import '../../common/presentation/widgets.dart';

class OrderDetailScreen extends StatelessWidget {
  const OrderDetailScreen({
    this.orderId,
    super.key,
  });

  final String? orderId;

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final runtime = CustomerRuntimeController.instance;
    final record = runtime.findOrderRecordById(orderId);

    if (record == null) {
      return Scaffold(
        body: EmptyState(
          icon: Icons.receipt_long_outlined,
          title: l10n.raw('Order not found'),
          subtitle: l10n.raw(
            'This order is no longer available in the current session.',
          ),
        ),
      );
    }

    final order = record.order;
    final items = record.items;
    final usesSandboxPayment = record.paymentMethodCode == 'card' ||
        record.paymentMethodCode == 'digital_wallet';
    final paymentStillPending =
        (record.paymentStatusCode ?? 'pending') == 'pending';
    final reviewAvailable = order.status == 'delivered';
    final hasSubmittedReview = runtime.hasSubmittedReview(order.id);
    final subtotalCentavos = record.subtotalCentavos > 0
        ? record.subtotalCentavos
        : (order.total - 29900 - 14900).clamp(0, order.total);
    final deliveryFeeCentavos =
        record.deliveryFeeCentavos > 0 ? record.deliveryFeeCentavos : 29900;
    final serviceFeeCentavos =
        record.serviceFeeCentavos > 0 ? record.serviceFeeCentavos : 14900;

    return Scaffold(
      backgroundColor: AppTheme.backgroundGrey,
      appBar: AppBar(
        title: Text(l10n.raw('Order Details')),
        backgroundColor: AppTheme.white,
      ),
      body: ListView(
        children: [
          Container(
            margin: const EdgeInsets.all(16),
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppTheme.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppTheme.borderColor),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: Theme.of(context).colorScheme.primaryContainer,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    Icons.storefront_rounded,
                    color: AppTheme.primaryColor,
                    size: 24,
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        order.storeName,
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: [
                          InfoPill(
                            icon: Icons.tag_rounded,
                            label: order.id,
                          ),
                          InfoPill(
                            icon: Icons.shopping_bag_outlined,
                            label: formatItemCount(
                              order.itemCount,
                              languageCode: l10n.locale.languageCode,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        formatOrderDate(
                          order.createdAt,
                          languageCode: l10n.locale.languageCode,
                        ),
                        style: TextStyle(
                          fontSize: 13,
                          color: AppTheme.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
                StatusBadge(
                  label: formatOrderStatus(
                    order.status,
                    languageCode: l10n.locale.languageCode,
                  ),
                  color: order.statusColor,
                ),
              ],
            ),
          ),
          if (usesSandboxPayment && paymentStillPending)
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 16),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppTheme.primarySoft,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppTheme.primaryTint),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Icon(
                    Icons.hourglass_top_rounded,
                    size: 20,
                    color: AppTheme.warningColor,
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          l10n.raw('Payment pending in VNPAY sandbox'),
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w800,
                            color: AppTheme.inkColor,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          l10n.raw(
                            'This test order was created before payment confirmation. No live charge or payment completion is recorded here.',
                          ),
                          style: TextStyle(
                            fontSize: 13,
                            height: 1.4,
                            color: AppTheme.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          Container(
            margin: const EdgeInsets.symmetric(horizontal: 16),
            decoration: BoxDecoration(
              color: AppTheme.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppTheme.borderColor),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(
                  padding: const EdgeInsets.fromLTRB(20, 18, 20, 8),
                  child: Text(
                    l10n.raw('Items Ordered'),
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
                const Divider(height: 1),
                ...List.generate(items.length, (index) {
                  final item = items[index];
                  return Column(
                    children: [
                      Padding(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 20,
                          vertical: 14,
                        ),
                        child: Row(
                          children: [
                            Container(
                              width: 44,
                              height: 44,
                              decoration: BoxDecoration(
                                color: item.menuItem.imageColor
                                    .withValues(alpha: 0.15),
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: Icon(
                                Icons.restaurant_rounded,
                                size: 20,
                                color: item.menuItem.imageColor
                                    .withValues(alpha: 0.8),
                              ),
                            ),
                            const SizedBox(width: 14),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    item.menuItem.name,
                                    style: const TextStyle(
                                      fontSize: 14,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    'x${item.quantity}',
                                    style: TextStyle(
                                      fontSize: 13,
                                      color: AppTheme.textSecondary,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            Text(
                              formatCustomerMoney(item.total),
                              style: const TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ],
                        ),
                      ),
                      if (index < items.length - 1)
                        Divider(
                          height: 1,
                          indent: 20,
                          endIndent: 20,
                          color: AppTheme.borderColor,
                        ),
                    ],
                  );
                }),
              ],
            ),
          ),
          Container(
            margin: const EdgeInsets.all(16),
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppTheme.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppTheme.borderColor),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  l10n.raw('Order Summary'),
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 14),
                PriceRow(
                  label: l10n.text('cart.subtotal'),
                  amount: formatCustomerMoney(subtotalCentavos),
                ),
                PriceRow(
                  label: l10n.text('cart.deliveryFee'),
                  amount: formatCustomerMoney(deliveryFeeCentavos),
                ),
                PriceRow(
                  label: l10n.text('cart.serviceFee'),
                  amount: formatCustomerMoney(serviceFeeCentavos),
                ),
                const SizedBox(height: 8),
                const Divider(),
                const SizedBox(height: 8),
                PriceRow(
                  label: l10n.raw('Total'),
                  amount: formatCustomerMoney(order.total),
                  isBold: true,
                ),
              ],
            ),
          ),
          Container(
            margin: const EdgeInsets.symmetric(horizontal: 16),
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppTheme.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppTheme.borderColor),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  l10n.raw('Delivery Information'),
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 14),
                _InfoRow(
                  icon: Icons.location_on_rounded,
                  label: l10n.raw('Delivered to'),
                  value: '${record.address.street}, ${record.address.detail}',
                ),
                const SizedBox(height: 12),
                _InfoRow(
                  icon: Icons.payments_outlined,
                  label: l10n.raw('Payment method'),
                  value: l10n.raw(record.paymentLabel),
                ),
                const SizedBox(height: 12),
                _InfoRow(
                  icon: Icons.receipt_long_outlined,
                  label: l10n.raw('Payment status'),
                  value: l10n.raw(record.paymentStatusLabel),
                ),
                if (record.instructions.isNotEmpty) ...[
                  const SizedBox(height: 12),
                  _InfoRow(
                    icon: Icons.sticky_note_2_outlined,
                    label: l10n.raw('Instructions'),
                    value: record.instructions,
                  ),
                ],
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: reviewAvailable
                        ? () => Navigator.pushNamed(
                              context,
                              RouteNames.reviews,
                              arguments: order.id,
                            )
                        : null,
                    icon: const Icon(Icons.star_outline_rounded, size: 18),
                    label: Text(
                      l10n.raw(
                        reviewAvailable
                            ? hasSubmittedReview
                                ? 'Edit Review'
                                : 'Leave Review'
                            : 'Review available after delivery',
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: FilledButton.icon(
                    onPressed: () {
                      runtime.reorder(order.id);
                      Navigator.pushNamed(context, RouteNames.cart);
                    },
                    icon: const Icon(Icons.replay_rounded, size: 18),
                    label: Text(l10n.raw('Reorder')),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  const _InfoRow({
    required this.icon,
    required this.label,
    required this.value,
  });

  final IconData icon;
  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 36,
          height: 36,
          decoration: BoxDecoration(
            color: AppTheme.backgroundGrey,
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(icon, size: 18, color: AppTheme.textSecondary),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                context.l10n.raw(label),
                style: TextStyle(
                  fontSize: 12,
                  color: AppTheme.textSecondary,
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                value,
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
