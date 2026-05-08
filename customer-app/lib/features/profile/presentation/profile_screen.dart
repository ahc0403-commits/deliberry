import 'package:flutter/material.dart';

import '../../../app/router/route_names.dart';
import '../../../core/data/customer_runtime_controller.dart';
import '../../../core/data/mock_data.dart' show MockData, formatCustomerMoney;
import '../../../core/i18n/app_localizations.dart';
import '../../../core/session/customer_session_controller.dart';
import '../../../core/theme/app_theme.dart';
import '../../common/presentation/widgets.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  Future<void> _openOffersSheet(BuildContext context) async {
    final l10n = context.l10n;
    final runtime = CustomerRuntimeController.instance;

    await showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppTheme.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(20, 20, 20, 28),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 42,
                  height: 4,
                  decoration: BoxDecoration(
                    color: AppTheme.borderColor,
                    borderRadius: BorderRadius.circular(999),
                  ),
                ),
              ),
              const SizedBox(height: 18),
              Text(
                l10n.profileOffersTitle,
                style: Theme.of(context).textTheme.headlineSmall,
              ),
              const SizedBox(height: 8),
              Text(
                l10n.profileOffersSubtitle,
                style: Theme.of(context)
                    .textTheme
                    .bodyMedium!
                    .copyWith(color: AppTheme.textSecondary),
              ),
              const SizedBox(height: 18),
              if (runtime.promoCode != null)
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: AppTheme.backgroundGrey,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppTheme.borderColor),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        l10n.profileOffersApplied,
                        style: Theme.of(context).textTheme.labelLarge,
                      ),
                      const SizedBox(height: 6),
                      Text(
                        '${runtime.promoCode} · -${formatCustomerMoney(runtime.promoDiscount)}',
                        style: Theme.of(context)
                            .textTheme
                            .titleMedium!
                            .copyWith(fontWeight: FontWeight.w800),
                      ),
                    ],
                  ),
                ),
              if (runtime.promoCode != null) const SizedBox(height: 14),
              Text(
                l10n.profileOffersAvailable,
                style: Theme.of(context).textTheme.titleMedium,
              ),
              const SizedBox(height: 12),
              if (MockData.promotions.isEmpty)
                Text(
                  l10n.profileOffersEmpty,
                  style: Theme.of(context)
                      .textTheme
                      .bodyMedium!
                      .copyWith(color: AppTheme.textSecondary),
                )
              else
                ...MockData.promotions.map(
                  (promo) => Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: PromoBanner(
                      title: l10n.raw(promo.title),
                      subtitle: l10n.raw(promo.subtitle),
                      discount: promo.discount,
                      gradientColors: promo.gradientColors,
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final session = CustomerSessionController.instance;
    final runtime = CustomerRuntimeController.instance;

    return ListenableBuilder(
      listenable: Listenable.merge([session, runtime]),
      builder: (context, _) {
        final phone = session.phoneNumber;
        final savedDisplayName = runtime.profileDisplayName?.trim();
        final unreadNotifications = runtime.unreadNotificationCount;
        final digitsOnly = (phone ?? '').replaceAll(RegExp(r'[^0-9]'), '');
        final displayName = savedDisplayName?.isNotEmpty == true
            ? savedDisplayName!
            : null;
        final nameInitials = displayName == null
            ? ''
            : displayName
                .split(RegExp(r'\s+'))
                .where((part) => part.isNotEmpty)
                .take(2)
                .map((part) => part.substring(0, 1).toUpperCase())
                .join();
        final initials = nameInitials.isNotEmpty
            ? nameInitials
            : digitsOnly.isNotEmpty
                ? digitsOnly.substring(
                    digitsOnly.length >= 2 ? digitsOnly.length - 2 : 0,
                  )
                : (session.isGuest ? 'G' : 'D');
        final displayTitle = session.isSignedIn
            ? (displayName ??
                (phone == null
                    ? l10n.profileDisplayNameFallback
                    : l10n.customerWithPhone(phone)))
            : session.isGuest
                ? l10n.raw('Guest customer')
                : l10n.raw('Customer account');
        final displaySubtitle = session.isSignedIn
            ? l10n.signedInWith(phone)
            : session.isGuest
                ? l10n.raw('Guest browsing session')
                : l10n.raw('Session details are available after sign-in');
        final badgeLabel = session.isSignedIn
            ? l10n.raw('Signed-in session')
            : session.isGuest
                ? l10n.raw('Guest session')
                : l10n.raw('Demo account');

        return Scaffold(
          backgroundColor: AppTheme.backgroundGrey,
          appBar: AppBar(
            title: Text(l10n.raw('Profile')),
            backgroundColor: AppTheme.white,
          ),
          body: ListView(
            padding: const EdgeInsets.only(bottom: 32),
            children: [
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
                child: FeatureHeroCard(
                  eyebrow: 'Account area',
                  title: 'Manage your account journey',
                  subtitle:
                      'Addresses, notifications, and order-linked reviews stay connected from here for this current session.',
                  icon: Icons.account_circle_rounded,
                  badge: badgeLabel,
                ),
              ),
              Container(
                margin: const EdgeInsets.all(16),
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: AppTheme.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppTheme.borderColor),
                  boxShadow: [
                    BoxShadow(
                      color: AppTheme.inkColor.withValues(alpha: 0.03),
                      blurRadius: 16,
                      offset: const Offset(0, 8),
                    ),
                  ],
                ),
                child: Column(
                  children: [
                    Row(
                      children: [
                        Container(
                          width: 78,
                          height: 78,
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: [
                                AppTheme.primaryColor,
                                AppTheme.primaryColor.withValues(alpha: 0.65),
                              ],
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                            ),
                            shape: BoxShape.circle,
                          ),
                          child: Center(
                            child: Text(
                              initials,
                              style: Theme.of(context)
                                  .textTheme
                                  .headlineSmall!
                                  .copyWith(
                                      color: AppTheme.white, letterSpacing: 1),
                            ),
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                displayTitle,
                                style:
                                    Theme.of(context).textTheme.headlineSmall,
                              ),
                              const SizedBox(height: 4),
                              Text(
                                displaySubtitle,
                                style: Theme.of(context)
                                    .textTheme
                                    .bodyMedium!
                                    .copyWith(color: AppTheme.textSecondary),
                              ),
                            ],
                          ),
                        ),
                        IconButton(
                          onPressed: () => Navigator.pushNamed(
                            context,
                            RouteNames.settings,
                          ),
                          icon: Icon(
                            Icons.tune_rounded,
                            size: 20,
                            color: AppTheme.textSecondary,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: [
                        InfoPill(
                          icon: Icons.badge_outlined,
                          label: badgeLabel,
                          highlight: true,
                        ),
                        InfoPill(
                          icon: Icons.receipt_long_outlined,
                          label: 'Reviews stay order-linked',
                        ),
                        InfoPill(
                          icon: Icons.favorite_rounded,
                          label: l10n.favoriteStoreCountLabel(
                            runtime.favoriteStoreCount,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const AccountSectionLabel(label: 'Account'),
              AccountActionGroup(
                children: [
                  AccountActionTile(
                    icon: Icons.location_on_outlined,
                    iconColor: AppTheme.secondaryColor,
                    label: 'My Addresses',
                    onTap: () =>
                        Navigator.pushNamed(context, RouteNames.addresses),
                  ),
                  const AccountActionDivider(),
                  AccountActionTile(
                    icon: Icons.notifications_outlined,
                    iconColor: AppTheme.secondaryColor,
                    label: 'Notifications',
                    trailing: unreadNotifications > 0
                        ? Text(
                            l10n.unreadNotificationCountLabel(unreadNotifications),
                            style: Theme.of(context).textTheme.labelMedium,
                          )
                        : null,
                    onTap: () =>
                        Navigator.pushNamed(context, RouteNames.notifications),
                  ),
                  const AccountActionDivider(),
                  AccountActionTile(
                    icon: Icons.star_outline_rounded,
                    iconColor: AppTheme.primaryColor,
                    label: 'My Reviews',
                    trailing: Text(
                      l10n.raw('From orders'),
                      style: Theme.of(context).textTheme.labelMedium,
                    ),
                    onTap: () =>
                        Navigator.pushNamed(context, RouteNames.orders),
                  ),
                  const AccountActionDivider(),
                  AccountActionTile(
                    icon: Icons.settings_outlined,
                    iconColor: AppTheme.textSecondary,
                    label: 'Settings',
                    onTap: () =>
                        Navigator.pushNamed(context, RouteNames.settings),
                  ),
                ],
              ),
              const AccountSectionLabel(label: 'Activity'),
              AccountActionGroup(
                children: [
                  AccountActionTile(
                    icon: Icons.receipt_long_outlined,
                    iconColor: AppTheme.successColor,
                    label: 'Order History',
                    onTap: () =>
                        Navigator.pushNamed(context, RouteNames.orders),
                  ),
                  const AccountActionDivider(),
                  AccountActionTile(
                    icon: Icons.local_offer_outlined,
                    iconColor: AppTheme.primaryColor,
                    label: 'Promotions & Offers',
                    trailing: runtime.promoCode != null
                        ? Text(
                            runtime.promoCode!,
                            style: Theme.of(context).textTheme.labelMedium,
                          )
                        : null,
                    onTap: () => _openOffersSheet(context),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: OutlinedButton.icon(
                  onPressed: () async {
                    final confirm = await showDialog<bool>(
                      context: context,
                      builder: (ctx) => AlertDialog(
                        title: Text(context.l10n.raw('Sign out')),
                        content: Text(
                          context.l10n.raw(
                            'Are you sure you want to sign out?',
                          ),
                        ),
                        actions: [
                          TextButton(
                            onPressed: () => Navigator.pop(ctx, false),
                            child: Text(context.l10n.raw('Cancel')),
                          ),
                          TextButton(
                            onPressed: () => Navigator.pop(ctx, true),
                            child: Text(
                              context.l10n.raw('Sign out'),
                              style: TextStyle(color: AppTheme.errorColor),
                            ),
                          ),
                        ],
                      ),
                    );
                    if (confirm == true) {
                      await CustomerSessionController.instance.signOut();
                    }
                  },
                  icon: Icon(
                    Icons.logout_rounded,
                    size: 18,
                    color: AppTheme.errorColor,
                  ),
                  label: Text(
                    context.l10n.raw('Sign out'),
                    style: TextStyle(color: AppTheme.errorColor),
                  ),
                  style: OutlinedButton.styleFrom(
                    side: BorderSide(
                      color: AppTheme.errorColor.withValues(alpha: 0.4),
                    ),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
