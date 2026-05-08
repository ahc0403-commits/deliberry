import 'package:flutter/material.dart';

import '../../../app/router/route_names.dart';
import '../../../core/data/customer_runtime_controller.dart';
import '../../../core/data/mock_data.dart';
import '../../../core/i18n/app_localizations.dart';
import '../../../core/theme/app_theme.dart';
import '../../common/presentation/widgets.dart';

class OrdersListScreen extends StatefulWidget {
  const OrdersListScreen({super.key});

  @override
  State<OrdersListScreen> createState() => _OrdersListScreenState();
}

class _OrdersListScreenState extends State<OrdersListScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final runtime = CustomerRuntimeController.instance;

    return ListenableBuilder(
      listenable: runtime,
      builder: (context, _) {
        return Scaffold(
          backgroundColor: AppTheme.backgroundGrey,
          appBar: AppBar(
            automaticallyImplyLeading: false,
            title: Text(l10n.raw('Orders')),
            backgroundColor: AppTheme.white,
            bottom: TabBar(
              controller: _tabController,
              labelColor: AppTheme.primaryColor,
              unselectedLabelColor: AppTheme.textSecondary,
              indicatorColor: AppTheme.primaryColor,
              indicatorWeight: 3,
              labelStyle: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w700,
              ),
              unselectedLabelStyle: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w500,
              ),
              tabs: [
                Tab(text: l10n.raw('Active')),
                Tab(text: l10n.raw('History')),
              ],
            ),
          ),
          body: Column(
            children: [
              _OrdersSummaryStrip(
                activeCount: runtime.activeOrders.length,
                historyCount: runtime.pastOrders.length,
              ),
              Expanded(
                child: TabBarView(
                  controller: _tabController,
                  children: [
                    _OrderTab(
                      orders: runtime.activeOrders,
                      emptyTitle: l10n.raw('No active orders'),
                      emptySubtitle: l10n.raw(
                        'Order something delicious and follow its status here.',
                      ),
                      emptyIcon: Icons.delivery_dining_outlined,
                      onTap: (order) => Navigator.pushNamed(
                        context,
                        RouteNames.orderStatus,
                        arguments: order.id,
                      ),
                    ),
                    _OrderTab(
                      orders: runtime.pastOrders,
                      emptyTitle: l10n.raw('No past orders'),
                      emptySubtitle:
                          l10n.raw('Your completed orders will appear here.'),
                      emptyIcon: Icons.receipt_long_outlined,
                      onTap: (order) => Navigator.pushNamed(
                        context,
                        RouteNames.orderDetail,
                        arguments: order.id,
                      ),
                      showReorder: true,
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

class _OrdersSummaryStrip extends StatelessWidget {
  const _OrdersSummaryStrip({
    required this.activeCount,
    required this.historyCount,
  });

  final int activeCount;
  final int historyCount;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.fromLTRB(16, 16, 16, 0),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.white,
        borderRadius: BorderRadius.circular(AppTheme.cardRadius),
        border: Border.all(color: AppTheme.borderColor),
      ),
      child: Row(
        children: [
          Expanded(
            child: _OrderSummaryMetric(
              label: 'Active',
              value: '$activeCount',
              color: AppTheme.primaryColor,
            ),
          ),
          Container(width: 1, height: 34, color: AppTheme.borderColor),
          Expanded(
            child: _OrderSummaryMetric(
              label: 'History',
              value: '$historyCount',
              color: AppTheme.inkColor,
            ),
          ),
        ],
      ),
    );
  }
}

class _OrderSummaryMetric extends StatelessWidget {
  const _OrderSummaryMetric({
    required this.label,
    required this.value,
    required this.color,
  });

  final String label;
  final String value;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          value,
          style: TextStyle(
            fontSize: 22,
            fontWeight: FontWeight.w900,
            color: color,
          ),
        ),
        const SizedBox(height: 2),
        Text(
          context.l10n.raw(label),
          style: TextStyle(
            fontSize: 12,
            color: AppTheme.textSecondary,
            fontWeight: FontWeight.w700,
          ),
        ),
      ],
    );
  }
}

class _OrderTab extends StatelessWidget {
  const _OrderTab({
    required this.orders,
    required this.emptyTitle,
    required this.emptySubtitle,
    required this.emptyIcon,
    required this.onTap,
    this.showReorder = false,
  });

  final List<MockOrder> orders;
  final String emptyTitle;
  final String emptySubtitle;
  final IconData emptyIcon;
  final void Function(MockOrder order) onTap;
  final bool showReorder;

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final runtime = CustomerRuntimeController.instance;

    if (orders.isEmpty) {
      return EmptyState(
        icon: emptyIcon,
        title: emptyTitle,
        subtitle: emptySubtitle,
        actionLabel: l10n.raw('Browse restaurants'),
        onAction: () => Navigator.pushNamed(context, RouteNames.home),
      );
    }

    return ListView.separated(
      padding: const EdgeInsets.all(16),
      itemCount: orders.length,
      separatorBuilder: (_, __) => const SizedBox(height: 12),
      itemBuilder: (context, index) {
        final order = orders[index];
        final record = runtime.findOrderRecordById(order.id);
        final usesSandboxPayment = record?.paymentMethodCode == 'card' ||
            record?.paymentMethodCode == 'digital_wallet';
        final paymentStillPending =
            (record?.paymentStatusCode ?? 'pending') == 'pending';
        return Column(
          children: [
            OrderCard(
              orderId: order.id,
              storeName: order.storeName,
              status: order.status,
              total: order.total,
              itemCount: order.itemCount,
              createdAt: order.createdAt,
              statusColor: order.statusColor,
              paymentContextLabel: usesSandboxPayment && paymentStillPending
                  ? '${record?.paymentLabel ?? l10n.raw('VNPAY test')} · ${record?.paymentStatusLabel ?? l10n.raw('Pending payment')}'
                  : null,
              paymentContextColor: usesSandboxPayment && paymentStillPending
                  ? AppTheme.warningColor
                  : null,
              onTap: () => onTap(order),
            ),
            if (showReorder)
              Container(
                decoration: BoxDecoration(
                  color: AppTheme.white,
                  borderRadius: const BorderRadius.only(
                    bottomLeft: Radius.circular(14),
                    bottomRight: Radius.circular(14),
                  ),
                  border: Border(
                    left: BorderSide(color: AppTheme.borderColor),
                    right: BorderSide(color: AppTheme.borderColor),
                    bottom: BorderSide(color: AppTheme.borderColor),
                  ),
                ),
                child: InkWell(
                  onTap: () {
                    runtime.reorder(order.id);
                    Navigator.pushNamed(context, RouteNames.cart);
                  },
                  borderRadius: const BorderRadius.only(
                    bottomLeft: Radius.circular(14),
                    bottomRight: Radius.circular(14),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 10,
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.replay_rounded,
                          size: 16,
                          color: AppTheme.primaryColor,
                        ),
                        const SizedBox(width: 6),
                        Text(
                          'Reorder',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: AppTheme.primaryColor,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
          ],
        );
      },
    );
  }
}
