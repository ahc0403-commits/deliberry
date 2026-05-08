import 'package:flutter/material.dart';

import '../../core/data/customer_runtime_controller.dart';
import '../../core/i18n/app_localizations.dart';
import '../../core/session/customer_session_controller.dart';
import '../../core/theme/app_theme.dart';
import '../../features/common/presentation/widgets.dart';
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
      backgroundColor: AppTheme.backgroundGrey,
      body: ScrollableSafeContent(
        padding: const EdgeInsets.only(bottom: 24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            _HeroSection(),
            _BottomSection(),
          ],
        ),
      ),
    );
  }
}

class _HeroSection extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;

    return Container(
      width: double.infinity,
      margin: const EdgeInsets.fromLTRB(16, 16, 16, 0),
      decoration: BoxDecoration(
        color: AppTheme.inkColor,
        borderRadius: BorderRadius.circular(28),
        boxShadow: [AppTheme.softShadow(alpha: 0.16)],
      ),
      child: Stack(
        children: [
          Positioned(
            top: 28,
            right: 24,
            child: Container(
              width: 96,
              height: 132,
              decoration: BoxDecoration(
                color: AppTheme.white.withValues(alpha: 0.08),
                borderRadius: BorderRadius.circular(28),
              ),
            ),
          ),
          Positioned(
            bottom: 28,
            right: 92,
            child: Container(
              width: 74,
              height: 74,
              decoration: BoxDecoration(
                color: AppTheme.secondaryColor.withValues(alpha: 0.2),
                borderRadius: BorderRadius.circular(24),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(32, 48, 32, 32),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: 56,
                  height: 56,
                  decoration: BoxDecoration(
                    color: AppTheme.surfaceMuted,
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      AppTheme.softShadow(alpha: 0.1),
                    ],
                  ),
                  child: const Center(
                    child: Text(
                      'D',
                      style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.w900,
                        color: AppTheme.primaryColor,
                        letterSpacing: 0,
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
                    color: AppTheme.white,
                    letterSpacing: 0,
                    height: 1.0,
                  ),
                ),
                const SizedBox(height: 10),
                Text(
                  l10n.text('entry.tagline'),
                  style: TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.w400,
                    color: AppTheme.white.withValues(alpha: 0.88),
                    height: 1.4,
                  ),
                ),
                const SizedBox(height: 48),
                Wrap(
                  spacing: 10,
                  runSpacing: 10,
                  children: [
                    _TrustBadge(
                      icon: Icons.bolt,
                      label: l10n.text('entry.trust.time'),
                    ),
                    _TrustBadge(
                      icon: Icons.storefront_outlined,
                      label: l10n.text('entry.trust.stores'),
                    ),
                    _TrustBadge(
                      icon: Icons.star_rounded,
                      label: l10n.text('entry.trust.rating'),
                    ),
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
        color: AppTheme.white.withValues(alpha: 0.11),
        borderRadius: BorderRadius.circular(11),
        border: Border.all(color: AppTheme.white.withValues(alpha: 0.15)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: AppTheme.white, size: 14),
          const SizedBox(width: 5),
          Text(
            label,
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: AppTheme.white,
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
    final l10n = context.l10n;

    return Padding(
      padding: const EdgeInsets.fromLTRB(24, 32, 24, 0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(
            l10n.text('entry.startTitle'),
            style: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w800,
              color: AppTheme.inkColor,
              letterSpacing: 0,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            l10n.text('entry.startBody'),
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
            child: Text(l10n.text('entry.getStarted')),
          ),
          const SizedBox(height: 12),
          OutlinedButton(
            onPressed: () {
              Navigator.of(context).pushNamed(RouteNames.guest);
            },
            child: Text(l10n.text('entry.guest')),
          ),
          const SizedBox(height: 20),
          Center(
            child: Text(
              l10n.text('entry.terms'),
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
