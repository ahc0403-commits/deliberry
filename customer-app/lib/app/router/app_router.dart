import 'package:flutter/material.dart';

import '../../core/session/customer_session_controller.dart';
import '../entry/customer_entry_screen.dart';
import '../../features/addresses/presentation/addresses_screen.dart';
import '../../features/auth/presentation/auth_otp_screen.dart';
import '../../features/auth/presentation/auth_phone_screen.dart';
import '../../features/auth/presentation/auth_screen.dart';
import '../../features/auth/presentation/guest_entry_screen.dart';
import '../../features/cart/presentation/cart_screen.dart';
import '../../features/checkout/presentation/checkout_screen.dart';
import '../../features/group_order/presentation/group_order_share_screen.dart';
import '../../features/group_order/presentation/group_order_screen.dart';
import '../../features/home/presentation/discovery_screen.dart';
import '../../features/home/presentation/home_screen.dart';
import '../../features/notifications/presentation/notifications_screen.dart';
import '../../features/onboarding/presentation/onboarding_screen.dart';
import '../../features/orders/presentation/order_detail_screen.dart';
import '../../features/orders/presentation/order_status_screen.dart';
import '../../features/orders/presentation/orders_screen.dart';
import '../../features/profile/presentation/profile_screen.dart';
import '../../features/reviews/presentation/reviews_screen.dart';
import '../../features/search/presentation/filter_screen.dart';
import '../../features/search/presentation/search_screen.dart';
import '../../features/settings/presentation/settings_screen.dart';
import '../../features/store/presentation/menu_browsing_screen.dart';
import '../../features/store/presentation/store_screen.dart';
import '../shells/main_shell.dart';
import 'route_names.dart';

class AppRouter {
  static Route<dynamic> onGenerateRoute(RouteSettings settings) {
    final session = CustomerSessionController.instance;

    switch (settings.name) {
      case RouteNames.root:
      case RouteNames.entry:
        return _route(const CustomerEntryScreen(), settings);
      case RouteNames.home:
        return _guardRoute(
          session: session,
          access: _CustomerAccess.customerFlow,
          fallbackRouteName: RouteNames.entry,
          child: const MainShell(
            currentRouteName: RouteNames.home,
            child: HomeScreen(),
          ),
          settings: settings,
        );
      case RouteNames.search:
        return _guardRoute(
          session: session,
          access: _CustomerAccess.customerFlow,
          fallbackRouteName: RouteNames.entry,
          child: const MainShell(
            currentRouteName: RouteNames.search,
            child: SearchScreen(),
          ),
          settings: settings,
        );
      case RouteNames.orders:
        return _guardRoute(
          session: session,
          access: _CustomerAccess.authenticatedOnly,
          fallbackRouteName: RouteNames.authLogin,
          child: const MainShell(
            currentRouteName: RouteNames.orders,
            child: OrdersListScreen(),
          ),
          settings: settings,
        );
      case RouteNames.profile:
        return _guardRoute(
          session: session,
          access: _CustomerAccess.authenticatedOnly,
          fallbackRouteName: RouteNames.authLogin,
          child: const MainShell(
            currentRouteName: RouteNames.profile,
            child: ProfileScreen(),
          ),
          settings: settings,
        );
      case RouteNames.auth:
      case RouteNames.authLogin:
        if (session.requiresOnboarding) {
          return _redirectRoute(RouteNames.onboarding, settings);
        }
        if (session.hasAuthenticatedSession || session.isGuest) {
          return _redirectRoute(RouteNames.home, settings);
        }
        if (session.isOtpPending) {
          return _redirectRoute(RouteNames.authOtp, settings);
        }
        return _route(const AuthScreen(), settings);
      case RouteNames.authPhone:
        if (session.requiresOnboarding) {
          return _redirectRoute(RouteNames.onboarding, settings);
        }
        if (session.hasAuthenticatedSession || session.isGuest) {
          return _redirectRoute(RouteNames.home, settings);
        }
        if (session.isOtpPending) {
          return _redirectRoute(RouteNames.authOtp, settings);
        }
        return _route(const AuthPhoneScreen(), settings);
      case RouteNames.authOtp:
        if (session.requiresOnboarding) {
          return _redirectRoute(RouteNames.onboarding, settings);
        }
        if (session.hasAuthenticatedSession || session.isGuest) {
          return _redirectRoute(RouteNames.home, settings);
        }
        if (!session.isOtpPending) {
          return _redirectRoute(RouteNames.authPhone, settings);
        }
        return _route(const AuthOtpScreen(), settings);
      case RouteNames.guest:
        if (session.requiresOnboarding) {
          return _redirectRoute(RouteNames.onboarding, settings);
        }
        if (session.isGuest || session.hasAuthenticatedSession) {
          return _redirectRoute(RouteNames.home, settings);
        }
        if (session.isOtpPending) {
          return _redirectRoute(RouteNames.authOtp, settings);
        }
        return _route(const GuestEntryScreen(), settings);
      case RouteNames.onboarding:
        return _guardRoute(
          session: session,
          access: _CustomerAccess.onboardingOnly,
          fallbackRouteName: RouteNames.entry,
          child: const OnboardingScreen(),
          settings: settings,
        );
      case RouteNames.discovery:
        return _guardRoute(
          session: session,
          access: _CustomerAccess.customerFlow,
          fallbackRouteName: RouteNames.entry,
          child: const DiscoveryScreen(),
          settings: settings,
        );
      case RouteNames.filter:
        return _guardRoute(
          session: session,
          access: _CustomerAccess.customerFlow,
          fallbackRouteName: RouteNames.entry,
          child: const FilterScreen(),
          settings: settings,
        );
      case RouteNames.store:
        return _guardRoute(
          session: session,
          access: _CustomerAccess.customerFlow,
          fallbackRouteName: RouteNames.entry,
          child: StoreDetailScreen(
            storeId: settings.arguments as String?,
          ),
          settings: settings,
        );
      case RouteNames.storeMenu:
        return _guardRoute(
          session: session,
          access: _CustomerAccess.customerFlow,
          fallbackRouteName: RouteNames.entry,
          child: MenuBrowsingScreen(
            storeId: settings.arguments as String?,
          ),
          settings: settings,
        );
      case RouteNames.groupOrder:
        return _guardRoute(
          session: session,
          access: _CustomerAccess.customerFlow,
          fallbackRouteName: RouteNames.entry,
          child: const GroupOrderRoomScreen(),
          settings: settings,
        );
      case RouteNames.groupOrderShare:
        return _guardRoute(
          session: session,
          access: _CustomerAccess.customerFlow,
          fallbackRouteName: RouteNames.entry,
          child: GroupOrderShareScreen(
            roomCode: settings.arguments as String?,
          ),
          settings: settings,
        );
      case RouteNames.cart:
        return _guardRoute(
          session: session,
          access: _CustomerAccess.customerFlow,
          fallbackRouteName: RouteNames.entry,
          child: const CartScreen(),
          settings: settings,
        );
      case RouteNames.checkout:
        return _guardRoute(
          session: session,
          access: _CustomerAccess.customerFlow,
          fallbackRouteName: RouteNames.entry,
          child: const CheckoutScreen(),
          settings: settings,
        );
      case RouteNames.orderDetail:
        return _guardRoute(
          session: session,
          access: _CustomerAccess.authenticatedOnly,
          fallbackRouteName: RouteNames.authLogin,
          child: OrderDetailScreen(
            orderId: settings.arguments as String?,
          ),
          settings: settings,
        );
      case RouteNames.orderStatus:
        return _guardRoute(
          session: session,
          access: _CustomerAccess.authenticatedOnly,
          fallbackRouteName: RouteNames.authLogin,
          child: OrderStatusScreen(
            orderId: settings.arguments as String?,
          ),
          settings: settings,
        );
      case RouteNames.reviews:
        return _guardRoute(
          session: session,
          access: _CustomerAccess.authenticatedOnly,
          fallbackRouteName: RouteNames.authLogin,
          child: ReviewsScreen(
            orderId: settings.arguments as String?,
          ),
          settings: settings,
        );
      case RouteNames.settings:
        return _guardRoute(
          session: session,
          access: _CustomerAccess.authenticatedOnly,
          fallbackRouteName: RouteNames.authLogin,
          child: const SettingsScreen(),
          settings: settings,
        );
      case RouteNames.addresses:
        return _guardRoute(
          session: session,
          access: _CustomerAccess.authenticatedOnly,
          fallbackRouteName: RouteNames.authLogin,
          child: const AddressesScreen(),
          settings: settings,
        );
      case RouteNames.notifications:
        return _guardRoute(
          session: session,
          access: _CustomerAccess.authenticatedOnly,
          fallbackRouteName: RouteNames.authLogin,
          child: const NotificationsScreen(),
          settings: settings,
        );
      default:
        return _route(
          _StubScreen(title: 'Route Not Found', subtitle: settings.name),
          settings,
        );
    }
  }

  static MaterialPageRoute<dynamic> _route(
    Widget child,
    RouteSettings settings,
  ) {
    return MaterialPageRoute<dynamic>(
      settings: settings,
      builder: (_) => child,
    );
  }

  static MaterialPageRoute<dynamic> _redirectRoute(
    String routeName,
    RouteSettings settings,
  ) {
    return MaterialPageRoute<dynamic>(
      settings: settings,
      builder: (context) {
        WidgetsBinding.instance.addPostFrameCallback((_) {
          Navigator.of(context).pushReplacementNamed(routeName);
        });
        return const SizedBox.shrink();
      },
    );
  }

  static MaterialPageRoute<dynamic> _guardRoute({
    required CustomerSessionController session,
    required _CustomerAccess access,
    required String fallbackRouteName,
    required Widget child,
    required RouteSettings settings,
  }) {
    final allowed = switch (access) {
      _CustomerAccess.customerFlow =>
        session.isSignedIn || session.isGuest || session.requiresOnboarding,
      _CustomerAccess.authenticatedOnly => session.isSignedIn,
      _CustomerAccess.onboardingOnly => session.requiresOnboarding,
    };

    if (!allowed) {
      return _redirectRoute(fallbackRouteName, settings);
    }

    if (access == _CustomerAccess.customerFlow && session.requiresOnboarding) {
      return _redirectRoute(RouteNames.onboarding, settings);
    }

    return _route(child, settings);
  }
}

enum _CustomerAccess {
  customerFlow,
  authenticatedOnly,
  onboardingOnly,
}

class _StubScreen extends StatelessWidget {
  const _StubScreen({
    required this.title,
    this.subtitle,
  });

  final String title;
  final String? subtitle;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(title),
            if (subtitle != null) ...[
              const SizedBox(height: 8),
              Text(subtitle!),
            ],
          ],
        ),
      ),
    );
  }
}
