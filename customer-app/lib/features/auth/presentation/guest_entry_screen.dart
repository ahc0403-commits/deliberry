import 'package:flutter/material.dart';

import '../../../app/router/route_names.dart';
import '../../../core/i18n/app_localizations.dart';
import '../../../core/session/customer_session_controller.dart';
import '../../../core/theme/app_theme.dart';
import '../../common/presentation/widgets.dart';

class GuestEntryScreen extends StatelessWidget {
  const GuestEntryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    return Scaffold(
      backgroundColor: AppTheme.backgroundGrey,
      appBar: AppBar(
        backgroundColor: AppTheme.backgroundGrey,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20),
          onPressed: () => Navigator.of(context).maybePop(),
        ),
      ),
      body: ScrollableSafeContent(
        padding: const EdgeInsets.fromLTRB(24, 8, 24, 24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            FeatureHeroCard(
              eyebrow: l10n.raw('Guest browsing'),
              title: l10n.raw('Browse first, sign in later'),
              subtitle: l10n.raw(
                'Explore stores and menus without creating an account. Checkout will ask you to sign in when it matters.',
              ),
              icon: Icons.person_outline_rounded,
              badge: l10n.raw('No account needed yet'),
            ),
            const SizedBox(height: 32),

            Text(
              l10n.raw('Browse without\nan account'),
              style: TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.w800,
                color: AppTheme.inkColor,
                letterSpacing: 0,
                height: 1.15,
              ),
            ),
            const SizedBox(height: 10),
            Text(
              l10n.raw(
                'Explore stores and menus right away. Create an account when you\'re ready to order.',
              ),
              style: TextStyle(
                fontSize: 15,
                color: AppTheme.textSecondary,
                height: 1.4,
              ),
            ),
            const SizedBox(height: 28),

            // Comparison
            const _ComparisonSection(),

            const Spacer(),

            FilledButton(
              onPressed: () async {
                await CustomerSessionController.instance.continueAsGuest();
                if (!context.mounted) return;
                Navigator.of(context).pushReplacementNamed(RouteNames.home);
              },
              child: Text(l10n.raw('Browse as Guest')),
            ),
            const SizedBox(height: 12),
            OutlinedButton(
              onPressed: () {
                Navigator.of(context).pushNamed(RouteNames.authPhone);
              },
              child: Text(l10n.raw('Create Account')),
            ),
          ],
        ),
      ),
    );
  }
}

class _ComparisonSection extends StatelessWidget {
  const _ComparisonSection();

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [AppTheme.softShadow(alpha: 0.04)],
      ),
      child: Column(
        children: [
          _ComparisonRow(
            feature: l10n.raw('Browse stores & menus'),
            guestAllowed: true,
            accountRequired: false,
          ),
          Divider(height: 1, color: AppTheme.borderColor),
          _ComparisonRow(
            feature: l10n.raw('Place orders'),
            guestAllowed: false,
            accountRequired: true,
          ),
          Divider(height: 1, color: AppTheme.borderColor),
          _ComparisonRow(
            feature: l10n.raw('Save favourites'),
            guestAllowed: false,
            accountRequired: true,
          ),
          Divider(height: 1, color: AppTheme.borderColor),
          _ComparisonRow(
            feature: l10n.raw('Track deliveries'),
            guestAllowed: false,
            accountRequired: true,
          ),
          Divider(height: 1, color: AppTheme.borderColor),
          _ComparisonRow(
            feature: l10n.raw('Earn rewards'),
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
                color: AppTheme.inkColor,
              ),
            ),
          ),
          _StatusIcon(allowed: guestAllowed, label: context.l10n.raw('Guest')),
          const SizedBox(width: 24),
          _StatusIcon(
            allowed: accountRequired,
            label: context.l10n.raw('Account'),
          ),
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
