import 'package:flutter/material.dart';

import '../../core/theme/app_theme.dart';
import '../router/route_names.dart';

class MainShell extends StatelessWidget {
  const MainShell({
    required this.currentRouteName,
    required this.child,
    super.key,
  });

  static const List<_ShellDestination> _destinations = [
    _ShellDestination(
      routeName: RouteNames.home,
      label: 'Home',
      icon: Icons.home_outlined,
      selectedIcon: Icons.home_rounded,
    ),
    _ShellDestination(
      routeName: RouteNames.search,
      label: 'Search',
      icon: Icons.search_outlined,
      selectedIcon: Icons.search_rounded,
    ),
    _ShellDestination(
      routeName: RouteNames.orders,
      label: 'Orders',
      icon: Icons.receipt_long_outlined,
      selectedIcon: Icons.receipt_long_rounded,
    ),
    _ShellDestination(
      routeName: RouteNames.profile,
      label: 'Profile',
      icon: Icons.person_outline_rounded,
      selectedIcon: Icons.person_rounded,
    ),
  ];

  final String currentRouteName;
  final Widget child;

  int _selectedIndex() {
    return _destinations.indexWhere(
      (destination) => destination.routeName == currentRouteName,
    );
  }

  @override
  Widget build(BuildContext context) {
    final selectedIndex = _selectedIndex();
    final activeIndex = selectedIndex >= 0 ? selectedIndex : 0;

    return Scaffold(
      backgroundColor: AppTheme.backgroundGrey,
      body: child,
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          border: Border(
            top: BorderSide(color: AppTheme.borderColor, width: 1),
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.06),
              blurRadius: 16,
              offset: const Offset(0, -4),
            ),
          ],
        ),
        child: NavigationBar(
          selectedIndex: activeIndex,
          backgroundColor: Colors.transparent,
          surfaceTintColor: Colors.transparent,
          shadowColor: Colors.transparent,
          elevation: 0,
          onDestinationSelected: (index) {
            final destination = _destinations[index];
            if (destination.routeName == currentRouteName) return;
            Navigator.of(context).pushReplacementNamed(destination.routeName);
          },
          destinations: _destinations
              .map(
                (destination) => NavigationDestination(
                  icon: Icon(destination.icon),
                  selectedIcon: Icon(
                    destination.selectedIcon,
                    color: AppTheme.primaryColor,
                  ),
                  label: destination.label,
                ),
              )
              .toList(),
        ),
      ),
    );
  }
}

class _ShellDestination {
  const _ShellDestination({
    required this.routeName,
    required this.label,
    required this.icon,
    required this.selectedIcon,
  });

  final String routeName;
  final String label;
  final IconData icon;
  final IconData selectedIcon;
}
