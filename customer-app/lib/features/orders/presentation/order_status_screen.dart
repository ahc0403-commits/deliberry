import 'package:flutter/material.dart';

import '../../../app/router/route_names.dart';
import '../../../core/data/customer_runtime_controller.dart';
import '../../../core/data/mock_data.dart';
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
      return const Scaffold(
        body: EmptyState(
          icon: Icons.delivery_dining_outlined,
          title: 'Order not found',
          subtitle: 'This order is no longer available in the current session.',
        ),
      );
    }

    final order = record.order;

    return Scaffold(
      backgroundColor: AppTheme.backgroundGrey,
      appBar: AppBar(
        title: const Text('Order Status'),
        backgroundColor: Colors.white,
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
            tooltip: 'Order details',
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
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
            child: FeatureHeroCard(
              eyebrow: 'Order tracking',
              title: 'Follow your live order progress',
              subtitle:
                  'This view reflects the persisted order state and milestone updates for the selected order.',
              icon: Icons.route_rounded,
              badge: formatOrderStatus(order.status),
            ),
          ),
          Container(
            width: double.infinity,
            margin: const EdgeInsets.all(16),
            padding: const EdgeInsets.symmetric(vertical: 32, horizontal: 24),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  AppTheme.primaryColor,
                  AppTheme.primaryColor.withValues(alpha: 0.7),
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
                    color: Colors.white.withValues(alpha: 0.2),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.restaurant_rounded,
                    size: 40,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  record.statusHeadline,
                  style: const TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.w800,
                    color: Colors.white,
                    letterSpacing: -0.3,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  order.storeName,
                  style: TextStyle(
                    fontSize: 15,
                    color: Colors.white.withValues(alpha: 0.85),
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  order.id,
                  style: TextStyle(
                    fontSize: 13,
                    color: Colors.white.withValues(alpha: 0.7),
                  ),
                ),
              ],
            ),
          ),
          Container(
            margin: const EdgeInsets.symmetric(horizontal: 16),
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
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
                      'Estimated Delivery',
                      style: TextStyle(
                        fontSize: 13,
                        color: AppTheme.textSecondary,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      record.etaLabel,
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                  ],
                ),
                const Spacer(),
                StatusBadge(
                  label: formatOrderStatus(order.status),
                  color: AppTheme.successColor,
                ),
              ],
            ),
          ),
          Container(
            margin: const EdgeInsets.all(16),
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppTheme.borderColor),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Order Progress',
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
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppTheme.borderColor),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Delivery Details',
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
                      '${order.itemCount} items · \$${formatCentavos(order.total)}',
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
              label: const Text('View Order Details'),
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
                  milestone.label,
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
