import 'package:flutter/material.dart';

import '../../../app/router/route_names.dart';
import '../../../core/data/customer_runtime_controller.dart';
import '../../../core/data/mock_data.dart';
import '../../../core/i18n/app_localizations.dart';
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
      return Scaffold(
        body: EmptyState(
          icon: Icons.check_circle_outline_rounded,
          title: context.l10n.raw('Order created'),
          subtitle: context.l10n.raw(
            'Open your orders to view the latest status.',
          ),
        ),
      );
    }

    final order = record.order;
    final l10n = context.l10n;

    return Scaffold(
      backgroundColor: AppTheme.backgroundGrey,
      appBar: AppBar(
        title: Text(l10n.raw('Order Placed')),
        backgroundColor: AppTheme.white,
        automaticallyImplyLeading: false,
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 24),
        children: [
          FeatureHeroCard(
            eyebrow: l10n.raw('Order submitted'),
            title: l10n.raw('Order placed'),
            subtitle: l10n.raw(
              'Track the ETA and delivery progress from the status screen.',
            ),
            icon: Icons.check_circle_rounded,
            badge: order.id,
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppTheme.borderColor),
            ),
            child: Column(
              children: [
                PriceRow(
                  label: l10n.raw('Store'),
                  amount: order.storeName,
                ),
                PriceRow(
                  label: l10n.raw('Items'),
                  amount:
                      '${order.itemCount} item${order.itemCount == 1 ? '' : 's'}',
                ),
                PriceRow(
                  label: l10n.raw('Total'),
                  amount: formatCustomerMoney(order.total),
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
            label: Text(l10n.raw('Track Order Status')),
          ),
          const SizedBox(height: 8),
          OutlinedButton.icon(
            onPressed: () => Navigator.of(context).pushNamedAndRemoveUntil(
              RouteNames.orders,
              (route) => route.isFirst,
            ),
            icon: const Icon(Icons.receipt_long_outlined, size: 18),
            label: Text(l10n.raw('Go to My Orders')),
          ),
          const SizedBox(height: 8),
          TextButton(
            onPressed: () => Navigator.of(context).pushNamedAndRemoveUntil(
              RouteNames.home,
              (route) => route.isFirst,
            ),
            child: Text(l10n.raw('Back to Home')),
          ),
        ],
      ),
    );
  }
}
