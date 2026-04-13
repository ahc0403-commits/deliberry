import 'package:flutter/material.dart';

import '../../../app/router/route_names.dart';
import '../../../core/data/customer_runtime_controller.dart';
import '../../../core/data/mock_data.dart';
import '../../../core/theme/app_theme.dart';
import '../../common/presentation/widgets.dart';

class OrderCompletionScreen extends StatelessWidget {
  const OrderCompletionScreen({
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
          icon: Icons.check_circle_outline_rounded,
          title: 'Order created',
          subtitle: 'Open your orders to view the latest status.',
        ),
      );
    }

    final order = record.order;

    return Scaffold(
      backgroundColor: AppTheme.backgroundGrey,
      appBar: AppBar(
        title: const Text('Order Placed'),
        backgroundColor: Colors.white,
        automaticallyImplyLeading: false,
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 24),
        children: [
          FeatureHeroCard(
            eyebrow: 'Order complete',
            title: 'Your order is confirmed',
            subtitle:
                'We created a real order and handed it off for fulfillment. Track updates from the status screen.',
            icon: Icons.check_circle_rounded,
            badge: order.id,
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
                  label: 'Store',
                  amount: order.storeName,
                ),
                PriceRow(
                  label: 'Items',
                  amount:
                      '${order.itemCount} item${order.itemCount == 1 ? '' : 's'}',
                ),
                PriceRow(
                  label: 'Total',
                  amount: '\$${formatCentavos(order.total)}',
                  isBold: true,
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          FilledButton.icon(
            onPressed: () => Navigator.of(context).pushReplacementNamed(
              RouteNames.orderStatus,
              arguments: order.id,
            ),
            icon: const Icon(Icons.delivery_dining_rounded, size: 18),
            label: const Text('Track Order Status'),
          ),
          const SizedBox(height: 8),
          OutlinedButton.icon(
            onPressed: () => Navigator.of(context).pushNamedAndRemoveUntil(
              RouteNames.orders,
              (route) => route.isFirst,
            ),
            icon: const Icon(Icons.receipt_long_outlined, size: 18),
            label: const Text('Go to My Orders'),
          ),
          const SizedBox(height: 8),
          TextButton(
            onPressed: () => Navigator.of(context).pushNamedAndRemoveUntil(
              RouteNames.home,
              (route) => route.isFirst,
            ),
            child: const Text('Back to Home'),
          ),
        ],
      ),
    );
  }
}
