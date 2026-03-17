import 'package:flutter/material.dart';

import '../../../app/router/route_names.dart';
import '../../../core/session/customer_session_controller.dart';
import '../../../core/theme/app_theme.dart';

class GuestEntryScreen extends StatelessWidget {
  const GuestEntryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20),
          onPressed: () => Navigator.of(context).maybePop(),
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(24, 8, 24, 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Illustration area
              Container(
                height: 180,
                margin: const EdgeInsets.only(bottom: 32),
                decoration: BoxDecoration(
                  color: const Color(0xFFFFF0EE),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    Positioned(
                      right: 24,
                      top: 20,
                      child: Container(
                        width: 60,
                        height: 60,
                        decoration: BoxDecoration(
                          color: AppTheme.primaryColor.withValues(alpha: 0.15),
                          shape: BoxShape.circle,
                        ),
                      ),
                    ),
                    Positioned(
                      left: 20,
                      bottom: 20,
                      child: Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          color:
                              AppTheme.secondaryColor.withValues(alpha: 0.25),
                          shape: BoxShape.circle,
                        ),
                      ),
                    ),
                    Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          width: 72,
                          height: 72,
                          decoration: BoxDecoration(
                            color: Colors.white,
                            shape: BoxShape.circle,
                            boxShadow: [
                              BoxShadow(
                                color: AppTheme.primaryColor
                                    .withValues(alpha: 0.15),
                                blurRadius: 20,
                                offset: const Offset(0, 6),
                              ),
                            ],
                          ),
                          child: const Icon(
                            Icons.person_outline_rounded,
                            size: 36,
                            color: AppTheme.primaryColor,
                          ),
                        ),
                        const SizedBox(height: 12),
                        const Text(
                          'Guest Mode',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                            color: AppTheme.primaryColor,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              const Text(
                'Browse without\nan account',
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.w800,
                  color: Color(0xFF1A1A2E),
                  letterSpacing: -0.8,
                  height: 1.15,
                ),
              ),
              const SizedBox(height: 10),
              Text(
                'Explore stores and menus right away. Create an account when you\'re ready to order.',
                style: TextStyle(
                  fontSize: 15,
                  color: AppTheme.textSecondary,
                  height: 1.4,
                ),
              ),
              const SizedBox(height: 28),

              // Comparison
              _ComparisonSection(),

              const Spacer(),

              FilledButton(
                onPressed: () {
                  CustomerSessionController.instance.continueAsGuest();
                  Navigator.of(context).pushReplacementNamed(RouteNames.home);
                },
                child: const Text('Browse as Guest'),
              ),
              const SizedBox(height: 12),
              OutlinedButton(
                onPressed: () {
                  Navigator.of(context).pushNamed(RouteNames.authPhone);
                },
                child: const Text('Create Account'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _ComparisonSection extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        border: Border.all(color: AppTheme.borderColor),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        children: [
          _ComparisonRow(
            feature: 'Browse stores & menus',
            guestAllowed: true,
            accountRequired: false,
          ),
          Divider(height: 1, color: AppTheme.borderColor),
          _ComparisonRow(
            feature: 'Place orders',
            guestAllowed: false,
            accountRequired: true,
          ),
          Divider(height: 1, color: AppTheme.borderColor),
          _ComparisonRow(
            feature: 'Save favourites',
            guestAllowed: false,
            accountRequired: true,
          ),
          Divider(height: 1, color: AppTheme.borderColor),
          _ComparisonRow(
            feature: 'Track deliveries',
            guestAllowed: false,
            accountRequired: true,
          ),
          Divider(height: 1, color: AppTheme.borderColor),
          _ComparisonRow(
            feature: 'Earn rewards',
            guestAllowed: false,
            accountRequired: true,
            isLast: true,
          ),
        ],
      ),
    );
  }
}

class _ComparisonRow extends StatelessWidget {
  final String feature;
  final bool guestAllowed;
  final bool accountRequired;
  final bool isLast;

  const _ComparisonRow({
    required this.feature,
    required this.guestAllowed,
    required this.accountRequired,
    this.isLast = false,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.fromLTRB(16, isLast ? 12 : 12, 16, isLast ? 12 : 12),
      child: Row(
        children: [
          Expanded(
            child: Text(
              feature,
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w500,
                color: Color(0xFF1A1A2E),
              ),
            ),
          ),
          _StatusIcon(allowed: guestAllowed, label: 'Guest'),
          const SizedBox(width: 24),
          _StatusIcon(allowed: accountRequired, label: 'Account'),
        ],
      ),
    );
  }
}

class _StatusIcon extends StatelessWidget {
  final bool allowed;
  final String label;

  const _StatusIcon({required this.allowed, required this.label});

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(
          allowed
              ? Icons.check_circle_rounded
              : Icons.remove_circle_outline_rounded,
          size: 20,
          color: allowed ? AppTheme.successColor : AppTheme.borderColor,
        ),
        const SizedBox(height: 2),
        Text(
          label,
          style: TextStyle(
            fontSize: 10,
            color: AppTheme.textSecondary,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }
}
