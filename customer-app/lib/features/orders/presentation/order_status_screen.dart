import 'package:flutter/material.dart';

import '../../../app/router/route_names.dart';
import '../../../core/data/customer_runtime_controller.dart';
import '../../../core/data/mock_data.dart';
import '../../../core/i18n/app_localizations.dart';
import '../../../core/theme/app_theme.dart';
import '../../common/presentation/widgets.dart';

class OrderStatusScreen extends StatelessWidget {
  const OrderStatusScreen({
    this.orderId,
    super.key,
  });

  final String? orderId;

  @override
  Widget build(BuildContext context) {
    final runtime = CustomerRuntimeController.instance;
    final record = runtime.findOrderRecordById(orderId);

    if (record == null) {
      return Scaffold(
        body: EmptyState(
          icon: Icons.delivery_dining_outlined,
          title: context.l10n.raw('Order not found'),
          subtitle: context.l10n.raw(
            'This order is no longer available in the current session.',
          ),
        ),
      );
    }
    final l10n = context.l10n;

    final order = record.order;
    final usesSandboxPayment = record.paymentMethodCode == 'card' ||
        record.paymentMethodCode == 'digital_wallet';
    final paymentStillPending =
        (record.paymentStatusCode ?? 'pending') == 'pending';

    return Scaffold(
      backgroundColor: AppTheme.backgroundGrey,
      appBar: AppBar(
        title: Text(l10n.raw('Order Status')),
        backgroundColor: AppTheme.white,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded),
          onPressed: () => Navigator.pushReplacementNamed(
            context,
            RouteNames.orders,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.receipt_long_outlined),
            tooltip: l10n.raw('Order details'),
            onPressed: () => Navigator.pushNamed(
              context,
              RouteNames.orderDetail,
              arguments: order.id,
            ),
          ),
        ],
      ),
      body: ListView(
        children: [
          Container(
            width: double.infinity,
            margin: const EdgeInsets.all(16),
            padding: const EdgeInsets.symmetric(vertical: 32, horizontal: 24),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  AppTheme.primaryColor,
                  AppTheme.primaryDark,
                ],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Column(
              children: [
                Container(
                  width: 80,
                  height: 80,
                  decoration: BoxDecoration(
                    color: AppTheme.white.withValues(alpha: 0.2),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.restaurant_rounded,
                    size: 40,
                    color: AppTheme.white,
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  l10n.raw(record.statusHeadline),
                  style: const TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.w800,
                    color: AppTheme.white,
                    letterSpacing: 0,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  '${l10n.raw('ETA')} ${l10n.raw(record.etaLabel)}',
                  style: TextStyle(
                    fontSize: 16,
                    color: AppTheme.white.withValues(alpha: 0.85),
                    fontWeight: FontWeight.w800,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  '${order.storeName} · ${order.id}',
                  style: TextStyle(
                    fontSize: 13,
                    color: AppTheme.white.withValues(alpha: 0.7),
                  ),
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
            child: Row(
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: Theme.of(context).colorScheme.primaryContainer,
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: Icon(
                    Icons.schedule_rounded,
                    color: AppTheme.primaryColor,
                    size: 24,
                  ),
                ),
                const SizedBox(width: 16),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      l10n.raw('Estimated Delivery'),
                      style: TextStyle(
                        fontSize: 13,
                        color: AppTheme.textSecondary,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      l10n.raw(record.etaLabel),
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                  ],
                ),
                const Spacer(),
                StatusBadge(
                  label: l10n.raw(formatOrderStatus(order.status)),
                  color: AppTheme.successColor,
                ),
              ],
            ),
          ),
          if (usesSandboxPayment && paymentStillPending)
            Container(
              margin: const EdgeInsets.fromLTRB(16, 16, 16, 0),
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
                  l10n.raw('Order Progress'),
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 20),
                ...List.generate(record.milestones.length, (index) {
                  final milestone = record.milestones[index];
                  final isLast = index == record.milestones.length - 1;
                  return _MilestoneRow(
                    milestone: milestone,
                    showConnector: !isLast,
                  );
                }),
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
                  l10n.raw('Delivery Details'),
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 14),
                _DetailRow(
                  icon: Icons.location_on_rounded,
                  label: '${record.address.street}, ${record.address.detail}',
                ),
                const SizedBox(height: 10),
                _DetailRow(
                  icon: Icons.storefront_rounded,
                  label: order.storeName,
                ),
                const SizedBox(height: 10),
                _DetailRow(
                  icon: Icons.receipt_outlined,
                  label:
                      '${order.itemCount} ${l10n.raw('items')} · ${formatCustomerMoney(order.total)}',
                ),
                const SizedBox(height: 10),
                _DetailRow(
                  icon: Icons.payments_outlined,
                  label:
                      '${l10n.raw(record.paymentLabel)} · ${l10n.raw(record.paymentStatusLabel)}',
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16),
            child: OutlinedButton.icon(
              onPressed: () => Navigator.pushNamed(
                context,
                RouteNames.orderDetail,
                arguments: order.id,
              ),
              icon: const Icon(Icons.receipt_long_outlined, size: 18),
              label: Text(l10n.raw('View Order Details')),
            ),
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }
}

class _MilestoneRow extends StatelessWidget {
  const _MilestoneRow({
    required this.milestone,
    required this.showConnector,
  });

  final OrderMilestone milestone;
  final bool showConnector;

  @override
  Widget build(BuildContext context) {
    final dotColor = milestone.isDone
        ? AppTheme.successColor
        : milestone.isCurrent
            ? AppTheme.primaryColor
            : AppTheme.borderColor;

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          width: 32,
          child: Column(
            children: [
              Container(
                width: 28,
                height: 28,
                decoration: BoxDecoration(
                  color: milestone.isDone || milestone.isCurrent
                      ? dotColor.withValues(alpha: 0.12)
                      : AppTheme.backgroundGrey,
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: dotColor,
                    width: milestone.isCurrent ? 2.5 : 2,
                  ),
                ),
                child: milestone.isDone
                    ? Icon(Icons.check_rounded, size: 14, color: dotColor)
                    : milestone.isCurrent
                        ? Center(
                            child: Container(
                              width: 10,
                              height: 10,
                              decoration: BoxDecoration(
                                color: dotColor,
                                shape: BoxShape.circle,
                              ),
                            ),
                          )
                        : null,
              ),
              if (showConnector)
                Container(
                  width: 2,
                  height: 34,
                  margin: const EdgeInsets.symmetric(vertical: 4),
                  color: AppTheme.borderColor,
                ),
            ],
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Padding(
            padding: const EdgeInsets.only(top: 4),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  context.l10n.raw(milestone.label),
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight:
                        milestone.isCurrent ? FontWeight.w700 : FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  milestone.time,
                  style: TextStyle(
                    fontSize: 12,
                    color: AppTheme.textSecondary,
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

class _DetailRow extends StatelessWidget {
  const _DetailRow({
    required this.icon,
    required this.label,
  });

  final IconData icon;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Row(
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
          child: Text(
            label,
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w500,
            ),
          ),
        ),
      ],
    );
  }
}
