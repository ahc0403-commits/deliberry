import 'package:flutter/material.dart';

import '../../../core/theme/app_theme.dart';
import '../../common/presentation/widgets.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool _notificationsEnabled = true;
  bool _darkModeEnabled = false;

  void _showUnavailable(String label) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('$label is not available yet.'),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundGrey,
      appBar: AppBar(
        title: const Text('Settings'),
        backgroundColor: Colors.white,
      ),
      body: ListView(
        children: [
          const AccountSectionLabel(label: 'Account'),
          AccountActionGroup(
            children: [
              AccountActionTile(
                icon: Icons.person_outline_rounded,
                iconColor: AppTheme.primaryColor,
                label: 'Edit Profile',
                onTap: () => _showUnavailable('Edit Profile'),
              ),
              const AccountActionDivider(),
              AccountActionTile(
                icon: Icons.phone_outlined,
                iconColor: AppTheme.secondaryColor,
                label: 'Change Phone Number',
                onTap: () => _showUnavailable('Change Phone Number'),
              ),
            ],
          ),
          const AccountSectionLabel(label: 'Preferences'),
          AccountActionGroup(
            children: [
              AccountToggleTile(
                icon: Icons.notifications_outlined,
                iconColor: AppTheme.secondaryColor,
                label: 'Push Notifications',
                value: _notificationsEnabled,
                onChanged: (value) =>
                    setState(() => _notificationsEnabled = value),
              ),
              const AccountActionDivider(),
              AccountToggleTile(
                icon: Icons.dark_mode_outlined,
                iconColor: AppTheme.textSecondary,
                label: 'Dark Mode',
                value: _darkModeEnabled,
                onChanged: (value) => setState(() => _darkModeEnabled = value),
              ),
            ],
          ),
          const AccountSectionLabel(label: 'Support'),
          AccountActionGroup(
            children: [
              AccountActionTile(
                icon: Icons.help_outline_rounded,
                iconColor: AppTheme.successColor,
                label: 'Help Center',
                onTap: () => _showUnavailable('Help Center'),
              ),
              const AccountActionDivider(),
              AccountActionTile(
                icon: Icons.headset_mic_outlined,
                iconColor: AppTheme.primaryColor,
                label: 'Contact Us',
                onTap: () => _showUnavailable('Contact Us'),
              ),
              const AccountActionDivider(),
              AccountActionTile(
                icon: Icons.star_outline_rounded,
                iconColor: AppTheme.secondaryColor,
                label: 'Rate the App',
                onTap: () => _showUnavailable('Rate the App'),
              ),
            ],
          ),
          const AccountSectionLabel(label: 'Legal'),
          AccountActionGroup(
            children: [
              AccountActionTile(
                icon: Icons.privacy_tip_outlined,
                iconColor: AppTheme.textSecondary,
                label: 'Privacy Policy',
                onTap: () => _showUnavailable('Privacy Policy'),
              ),
              const AccountActionDivider(),
              AccountActionTile(
                icon: Icons.description_outlined,
                iconColor: AppTheme.textSecondary,
                label: 'Terms of Service',
                onTap: () => _showUnavailable('Terms of Service'),
              ),
              const AccountActionDivider(),
              AccountActionTile(
                icon: Icons.info_outline_rounded,
                iconColor: AppTheme.textSecondary,
                label: 'App Version',
                trailing: Text(
                  '1.0.0',
                  style: Theme.of(context).textTheme.bodySmall,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: AccountActionGroup(
              margin: EdgeInsets.zero,
              children: [
                AccountActionTile(
                  icon: Icons.delete_outline_rounded,
                  iconColor: AppTheme.errorColor,
                  label: 'Delete Account',
                  labelColor: AppTheme.errorColor,
                  onTap: () => _confirmDeleteAccount(context),
                  trailing: Icon(
                    Icons.chevron_right_rounded,
                    size: 20,
                    color: AppTheme.errorColor.withValues(alpha: 0.6),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 32),
        ],
      ),
    );
  }

  void _confirmDeleteAccount(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete account'),
        content: const Text(
          'This action is permanent. All your data, orders, and addresses will be deleted and cannot be recovered.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () {
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Account deletion is not available yet.'),
                ),
              );
            },
            style: FilledButton.styleFrom(
              backgroundColor: AppTheme.errorColor,
              minimumSize: const Size(0, 44),
            ),
            child: const Text('Delete account'),
          ),
        ],
      ),
    );
  }
}
