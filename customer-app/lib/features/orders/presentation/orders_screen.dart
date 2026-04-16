import 'package:flutter/material.dart';

import '../../../app/router/route_names.dart';
import '../../../core/data/customer_runtime_controller.dart';
import '../../../core/data/mock_data.dart';
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
    final runtime = CustomerRuntimeController.instance;

    return ListenableBuilder(
      listenable: runtime,
      builder: (context, _) {
        return Scaffold(
          backgroundColor: AppTheme.backgroundGrey,
          appBar: AppBar(
            title: const Text('My Orders'),
            backgroundColor: Colors.white,
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
              tabs: const [
                Tab(text: 'Active'),
                Tab(text: 'History'),
              ],
            ),
          ),
          body: Column(
            children: [
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
                child: FeatureHeroCard(
                  eyebrow: 'Orders',
                  title: runtime.activeOrders.isNotEmpty
                      ? 'Keep an eye on what is in motion'
                      : 'Everything you order lands here',
                  subtitle: runtime.activeOrders.isNotEmpty
                      ? 'Open active orders for status updates, then use history to reorder from the same session.'
                      : 'Keep active orders in one tab and revisit completed ones in history.',
                  icon: Icons.delivery_dining_rounded,
                  badge:
                      '${runtime.activeOrders.length} active · ${runtime.pastOrders.length} past',
                ),
              ),
              Expanded(
                child: TabBarView(
                  controller: _tabController,
                  children: [
                    _OrderTab(
                      orders: runtime.activeOrders,
                      emptyTitle: 'No active orders',
                      emptySubtitle:
                          'Order something delicious and follow its status here.',
                      emptyIcon: Icons.delivery_dining_outlined,
                      onTap: (order) => Navigator.pushNamed(
                        context,
                        RouteNames.orderStatus,
                        arguments: order.id,
                      ),
                    ),
                    _OrderTab(
                      orders: runtime.pastOrders,
                      emptyTitle: 'No past orders',
                      emptySubtitle: 'Your completed orders will appear here.',
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
    final runtime = CustomerRuntimeController.instance;

    if (orders.isEmpty) {
      return EmptyState(
        icon: emptyIcon,
        title: emptyTitle,
        subtitle: emptySubtitle,
        actionLabel: 'Browse restaurants',
        onAction: () => Navigator.pushNamed(context, RouteNames.home),
      );
    }

    return ListView.separated(
      padding: const EdgeInsets.all(16),
      itemCount: orders.length,
      separatorBuilder: (_, __) => const SizedBox(height: 12),
      itemBuilder: (context, index) {
        final order = orders[index];
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
              onTap: () => onTap(order),
            ),
            if (showReorder)
              Container(
                decoration: BoxDecoration(
                  color: Colors.white,
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
