import 'package:flutter/material.dart';

import '../../../app/router/route_names.dart';
import '../../../core/data/customer_runtime_controller.dart';
import '../../../core/i18n/app_localizations.dart';
import '../../../core/services/public_website_handoff_service.dart';
import '../../../core/session/customer_session_controller.dart';
import '../../../core/theme/app_theme.dart';
import '../../common/presentation/widgets.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  static const _publicWebsite = PublicWebsiteHandoffService();

  Future<void> _openPublicWebsitePath(String path) async {
    final opened = await _publicWebsite.openPath(path);
    if (!mounted || opened) {
      return;
    }

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(context.l10n.text('settings.openPageFailed')),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final runtime = CustomerRuntimeController.instance;

    return ListenableBuilder(
      listenable: runtime,
      builder: (context, _) => Scaffold(
        backgroundColor: AppTheme.backgroundGrey,
        appBar: AppBar(
          title: Text(l10n.text('settings.title')),
          backgroundColor: AppTheme.white,
        ),
        body: ListView(
          children: [
            AccountSectionLabel(label: l10n.text('settings.language')),
            AccountActionGroup(
              children: [
                AccountActionTile(
                  icon: Icons.language_rounded,
                  iconColor: AppTheme.primaryColor,
                  label: l10n.text('settings.language'),
                  trailing: Text(
                    Localizations.localeOf(context).languageCode.toUpperCase(),
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                ),
              ],
            ),
            AccountSectionLabel(label: l10n.raw('Account')),
            AccountActionGroup(
              children: [
                AccountActionTile(
                  icon: Icons.person_outline_rounded,
                  iconColor: AppTheme.primaryColor,
                  label: l10n.raw('Edit Profile'),
                  trailing: runtime.profileDisplayName == null
                      ? null
                      : Text(
                          runtime.profileDisplayName!,
                          style: Theme.of(context).textTheme.labelMedium,
                          overflow: TextOverflow.ellipsis,
                        ),
                  onTap: () => _openEditProfileDialog(context, runtime),
                ),
                const AccountActionDivider(),
                AccountActionTile(
                  icon: Icons.phone_outlined,
                  iconColor: AppTheme.secondaryColor,
                  label: l10n.raw('Change Phone Number'),
                  onTap: () => _confirmChangePhoneNumber(context, runtime),
                ),
              ],
            ),
            AccountSectionLabel(label: l10n.raw('Preferences')),
            AccountActionGroup(
              children: [
                AccountToggleTile(
                  icon: Icons.notifications_outlined,
                  iconColor: AppTheme.secondaryColor,
                  label: l10n.raw('Push Notifications'),
                  value: runtime.notificationsEnabled,
                  onChanged: (value) {
                    runtime.saveSettingsPreferences(
                      notificationsEnabled: value,
                    );
                  },
                ),
                const AccountActionDivider(),
                AccountToggleTile(
                  icon: Icons.dark_mode_outlined,
                  iconColor: AppTheme.textSecondary,
                  label: l10n.raw('Dark Mode'),
                  value: runtime.darkModeEnabled,
                  onChanged: (value) {
                    runtime.saveSettingsPreferences(
                      darkModeEnabled: value,
                    );
                  },
                ),
              ],
            ),
            AccountSectionLabel(label: l10n.raw('Support')),
            AccountActionGroup(
              children: [
                AccountActionTile(
                  icon: Icons.help_outline_rounded,
                  iconColor: AppTheme.successColor,
                  label: l10n.raw('Help Center'),
                  onTap: () => _openPublicWebsitePath('/support'),
                ),
                const AccountActionDivider(),
                AccountActionTile(
                  icon: Icons.headset_mic_outlined,
                  iconColor: AppTheme.primaryColor,
                  label: l10n.raw('Contact Us'),
                  onTap: () => _openPublicWebsitePath('/support'),
                ),
                const AccountActionDivider(),
                AccountActionTile(
                  icon: Icons.star_outline_rounded,
                  iconColor: AppTheme.secondaryColor,
                  label: l10n.raw('Rate the App'),
                  onTap: () => _openPublicWebsitePath('/download'),
                ),
              ],
            ),
            AccountSectionLabel(label: l10n.raw('Legal')),
            AccountActionGroup(
              children: [
                AccountActionTile(
                  icon: Icons.privacy_tip_outlined,
                  iconColor: AppTheme.textSecondary,
                  label: l10n.raw('Privacy Policy'),
                  onTap: () => _openPublicWebsitePath('/privacy'),
                ),
                const AccountActionDivider(),
                AccountActionTile(
                  icon: Icons.description_outlined,
                  iconColor: AppTheme.textSecondary,
                  label: l10n.raw('Terms of Service'),
                  onTap: () => _openPublicWebsitePath('/terms'),
                ),
                const AccountActionDivider(),
                AccountActionTile(
                  icon: Icons.info_outline_rounded,
                  iconColor: AppTheme.textSecondary,
                  label: l10n.raw('App Version'),
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
                    label: l10n.text('settings.resetAccountTitle'),
                    labelColor: AppTheme.errorColor,
                    onTap: () => _confirmDeleteAccount(context, runtime),
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
      ),
    );
  }

  Future<void> _openEditProfileDialog(
    BuildContext context,
    CustomerRuntimeController runtime,
  ) async {
    final controller = TextEditingController(
      text: runtime.profileDisplayName ?? '',
    );

    final submitted = await showDialog<String>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text(context.l10n.profileEditTitle),
        content: TextField(
          controller: controller,
          autofocus: true,
          textCapitalization: TextCapitalization.words,
          decoration: InputDecoration(
            labelText: context.l10n.profileDisplayNameLabel,
            hintText: context.l10n.profileDisplayNameHint,
          ),
          maxLength: 40,
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: Text(context.l10n.raw('Cancel')),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(ctx, controller.text.trim()),
            child: Text(context.l10n.profileSave),
          ),
        ],
      ),
    );

    controller.dispose();
    if (submitted == null) {
      return;
    }

    try {
      await runtime.saveProfileIdentity(displayName: submitted);
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(context.l10n.profileNameSaved)),
      );
    } catch (_) {
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(context.l10n.profileSaveFailed)),
      );
    }
  }

  void _confirmDeleteAccount(
    BuildContext context,
    CustomerRuntimeController runtime,
  ) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text(context.l10n.text('settings.resetAccountTitle')),
        content: Text(
          context.l10n.text('settings.resetAccountBody'),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: Text(context.l10n.raw('Cancel')),
          ),
          FilledButton(
            onPressed: () async {
              Navigator.pop(ctx);
              await CustomerSessionController.instance.signOut();
              await runtime.clearSessionOwnedState();
              if (!context.mounted) return;
              Navigator.of(context)
                  .pushNamedAndRemoveUntil('/', (route) => false);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(
                    context.l10n.text('settings.resetAccountSuccess'),
                  ),
                ),
              );
            },
            style: FilledButton.styleFrom(
              backgroundColor: AppTheme.errorColor,
              minimumSize: const Size(0, 44),
            ),
            child: Text(context.l10n.text('settings.resetAccountTitle')),
          ),
        ],
      ),
    );
  }

  void _confirmChangePhoneNumber(
    BuildContext context,
    CustomerRuntimeController runtime,
  ) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text(context.l10n.text('settings.changePhoneTitle')),
        content: Text(
          context.l10n.text('settings.changePhoneBody'),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: Text(context.l10n.raw('Cancel')),
          ),
          FilledButton(
            onPressed: () async {
              Navigator.pop(ctx);
              await CustomerSessionController.instance.startPhoneEntry();
              await runtime.clearSessionOwnedState();
              if (!context.mounted) return;
              Navigator.of(context).pushNamedAndRemoveUntil(
                RouteNames.authPhone,
                (route) => false,
              );
            },
            child: Text(context.l10n.text('settings.changePhoneContinue')),
          ),
        ],
      ),
    );
  }
}
