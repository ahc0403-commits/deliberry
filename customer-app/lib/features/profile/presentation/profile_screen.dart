import 'package:flutter/material.dart';

import '../../../app/router/route_names.dart';
import '../../../core/session/customer_session_controller.dart';
import '../../../core/theme/app_theme.dart';
import '../../common/presentation/widgets.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  void _showUnavailable(BuildContext context, String label) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('$label is not available yet.'),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final session = CustomerSessionController.instance;

    return ListenableBuilder(
      listenable: session,
      builder: (context, _) {
        final phone = session.phoneNumber;
        final digitsOnly = (phone ?? '').replaceAll(RegExp(r'[^0-9]'), '');
        final initials = digitsOnly.isNotEmpty
            ? digitsOnly
                .substring(digitsOnly.length >= 2 ? digitsOnly.length - 2 : 0)
            : (session.isGuest ? 'G' : 'D');
        final displayTitle = session.isSignedIn
            ? (phone == null ? 'Signed-in customer' : 'Customer $phone')
            : session.isGuest
                ? 'Guest customer'
                : 'Demo customer';
        final displaySubtitle = session.isSignedIn
            ? 'Signed in with ${phone ?? 'saved phone number'}'
            : session.isGuest
                ? 'Guest checkout session'
                : 'Local demo session';
        final badgeLabel = session.isSignedIn
            ? 'Phone sign-in'
            : session.isGuest
                ? 'Guest session'
                : 'Demo account';

        return Scaffold(
          backgroundColor: AppTheme.backgroundGrey,
          appBar: AppBar(
            title: const Text('Profile'),
            backgroundColor: Colors.white,
          ),
          body: ListView(
            padding: const EdgeInsets.only(bottom: 32),
            children: [
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
                child: FeatureHeroCard(
                  eyebrow: 'Account area',
                  title: 'Manage your local account journey',
                  subtitle:
                      'Addresses, notifications, and order-linked reviews all live here for this current session.',
                  icon: Icons.account_circle_rounded,
                  badge: badgeLabel,
                ),
              ),
              Container(
                margin: const EdgeInsets.all(16),
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppTheme.borderColor),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.03),
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
                                      color: Colors.white, letterSpacing: 1),
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
                    onTap: () =>
                        Navigator.pushNamed(context, RouteNames.notifications),
                  ),
                  const AccountActionDivider(),
                  AccountActionTile(
                    icon: Icons.star_outline_rounded,
                    iconColor: AppTheme.primaryColor,
                    label: 'My Reviews',
                    trailing: Text(
                      'From orders',
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
                    trailing: Text(
                      'Unavailable',
                      style: Theme.of(context).textTheme.labelMedium,
                    ),
                    onTap: () =>
                        _showUnavailable(context, 'Promotions & Offers'),
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
                        title: const Text('Sign out'),
                        content:
                            const Text('Are you sure you want to sign out?'),
                        actions: [
                          TextButton(
                            onPressed: () => Navigator.pop(ctx, false),
                            child: const Text('Cancel'),
                          ),
                          TextButton(
                            onPressed: () => Navigator.pop(ctx, true),
                            child: Text(
                              'Sign out',
                              style: TextStyle(color: AppTheme.errorColor),
                            ),
                          ),
                        ],
                      ),
                    );
                    if (confirm == true) {
                      CustomerSessionController.instance.signOut();
                    }
                  },
                  icon: Icon(
                    Icons.logout_rounded,
                    size: 18,
                    color: AppTheme.errorColor,
                  ),
                  label: Text(
                    'Sign Out',
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
