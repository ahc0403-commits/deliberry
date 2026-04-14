import 'package:flutter/material.dart';

import '../../core/data/customer_runtime_controller.dart';
import '../../core/session/customer_session_controller.dart';
import '../../core/theme/app_theme.dart';
import '../router/route_names.dart';

class CustomerEntryScreen extends StatefulWidget {
  const CustomerEntryScreen({super.key});

  @override
  State<CustomerEntryScreen> createState() => _CustomerEntryScreenState();
}

class _CustomerEntryScreenState extends State<CustomerEntryScreen> {
  bool _navigating = false;

  void _navigateOnce(String routeName, {Object? arguments}) {
    if (_navigating) return;
    _navigating = true;
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) {
        Navigator.of(context).pushReplacementNamed(
          routeName,
          arguments: arguments,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final session = CustomerSessionController.instance;
    final runtime = CustomerRuntimeController.instance;

    return ListenableBuilder(
      listenable: Listenable.merge([session, runtime]),
      builder: (context, _) {
        if (!session.isHydrated) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }

        if (session.isSignedIn && !runtime.hasPersistedRuntimeLoaded) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }

        if (session.isSignedIn && runtime.addresses.isEmpty) {
          _navigateOnce(
            RouteNames.addresses,
            arguments: const AddressRouteArgs(
              returnRouteName: RouteNames.home,
              isRequiredGate: true,
            ),
          );
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }

        if (session.isSignedIn || session.isGuest) {
          _navigateOnce(RouteNames.home);
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }

        if (session.requiresOnboarding) {
          _navigateOnce(RouteNames.onboarding);
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }

        if (session.isOtpPending) {
          _navigateOnce(RouteNames.authOtp);
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }

        return const _EntryLandingScreen();
      },
    );
  }
}

class _EntryLandingScreen extends StatelessWidget {
  const _EntryLandingScreen();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              flex: 5,
              child: _HeroSection(),
            ),
            Expanded(
              flex: 4,
              child: _BottomSection(),
            ),
          ],
        ),
      ),
    );
  }
}

class _HeroSection extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Color(0xFFFF4B3A),
            Color(0xFFFF7A35),
            Color(0xFFFFB74D),
          ],
          stops: [0.0, 0.55, 1.0],
        ),
      ),
      child: Stack(
        children: [
          // Decorative circles
          Positioned(
            top: -40,
            right: -40,
            child: Container(
              width: 160,
              height: 160,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.white.withValues(alpha: 0.08),
              ),
            ),
          ),
          Positioned(
            bottom: 20,
            left: -30,
            child: Container(
              width: 120,
              height: 120,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.white.withValues(alpha: 0.06),
              ),
            ),
          ),
          Positioned(
            top: 60,
            left: 30,
            child: Container(
              width: 60,
              height: 60,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.white.withValues(alpha: 0.10),
              ),
            ),
          ),
          // Content
          Padding(
            padding: const EdgeInsets.fromLTRB(32, 48, 32, 32),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Logo mark
                Container(
                  width: 56,
                  height: 56,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.15),
                        blurRadius: 20,
                        offset: const Offset(0, 8),
                      ),
                    ],
                  ),
                  child: const Center(
                    child: Text(
                      'D',
                      style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.w900,
                        color: AppTheme.primaryColor,
                        letterSpacing: -1,
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                const Text(
                  'Deliberry',
                  style: TextStyle(
                    fontSize: 42,
                    fontWeight: FontWeight.w900,
                    color: Colors.white,
                    letterSpacing: -1.5,
                    height: 1.0,
                  ),
                ),
                const SizedBox(height: 10),
                Text(
                  'Food & groceries delivered\nfast to your door.',
                  style: TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.w400,
                    color: Colors.white.withValues(alpha: 0.88),
                    height: 1.4,
                  ),
                ),
                const Spacer(),
                // Trust indicators
                Row(
                  children: [
                    _TrustBadge(icon: Icons.bolt, label: '20 min avg'),
                    const SizedBox(width: 12),
                    _TrustBadge(
                        icon: Icons.storefront_outlined, label: '500+ stores'),
                    const SizedBox(width: 12),
                    _TrustBadge(icon: Icons.star_rounded, label: '4.8 rating'),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _TrustBadge extends StatelessWidget {
  final IconData icon;
  final String label;

  const _TrustBadge({required this.icon, required this.label});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.18),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withValues(alpha: 0.3)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: Colors.white, size: 14),
          const SizedBox(width: 5),
          Text(
            label,
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: Colors.white,
            ),
          ),
        ],
      ),
    );
  }
}

class _BottomSection extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(24, 32, 24, 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const Text(
            'Get started today',
            style: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w800,
              color: Color(0xFF1A1A2E),
              letterSpacing: -0.5,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            'Sign in with Zalo or Kakao, continue as guest, or use phone verification as fallback.',
            style: TextStyle(
              fontSize: 14,
              color: AppTheme.textSecondary,
              height: 1.4,
            ),
          ),
          const SizedBox(height: 24),
          FilledButton(
            onPressed: () {
              Navigator.of(context).pushNamed(RouteNames.auth);
            },
            child: const Text('Get Started'),
          ),
          const SizedBox(height: 12),
          OutlinedButton(
            onPressed: () {
              Navigator.of(context).pushNamed(RouteNames.guest);
            },
            child: const Text('Continue as Guest'),
          ),
          const Spacer(),
          Center(
            child: Text(
              'By continuing you agree to our Terms & Privacy Policy',
              style: TextStyle(
                fontSize: 11,
                color: AppTheme.textSecondary,
              ),
              textAlign: TextAlign.center,
            ),
          ),
        ],
      ),
    );
  }
}
