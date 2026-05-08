import 'package:flutter/material.dart';

import '../../../app/router/route_names.dart';
import '../../../core/i18n/app_localizations.dart';
import '../../../core/session/customer_auth_adapter.dart';
import '../../../core/session/customer_session_controller.dart';
import '../../../core/theme/app_theme.dart';

class AuthScreen extends StatelessWidget {
  const AuthScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;

    return Scaffold(
      backgroundColor: AppTheme.backgroundGrey,
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(24, 48, 24, 32),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Surface any auth callback error from the redirect flow.
                ListenableBuilder(
                  listenable: CustomerSessionController.instance,
                  builder: (context, _) {
                    final error =
                        CustomerSessionController.instance.lastAuthError;
                    if (error == null || error.isEmpty) {
                      return const SizedBox.shrink();
                    }
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 16),
                      child: Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: AppTheme.primarySoft,
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: AppTheme.primaryTint),
                        ),
                        child: Text(
                          context.l10n.authCallbackError(error),
                          style: TextStyle(
                            fontSize: 13,
                            color: AppTheme.errorColor,
                          ),
                        ),
                      ),
                    );
                  },
                ),
                // Header
                Center(
                  child: Container(
                    width: 64,
                    height: 64,
                    decoration: BoxDecoration(
                      color: Theme.of(context).colorScheme.primaryContainer,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: const Center(
                      child: Text(
                        'D',
                        style: TextStyle(
                          fontSize: 32,
                          fontWeight: FontWeight.w900,
                          color: AppTheme.primaryColor,
                          letterSpacing: 0,
                        ),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 28),
                Text(
                  l10n.text('auth.welcome'),
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.w800,
                    color: Theme.of(context).colorScheme.onSurface,
                    letterSpacing: 0,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  l10n.text('auth.subtitle'),
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 15,
                    color: AppTheme.textSecondary,
                    height: 1.45,
                  ),
                ),
                const SizedBox(height: 40),

                FilledButton.icon(
                  onPressed: () async {
                    try {
                      final result = await CustomerSessionController.instance
                          .beginSignIn(CustomerAuthProvider.zalo);
                      if (!context.mounted) return;
                      if (!result.isReady) {
                        final message = result.message ??
                            l10n.providerUnavailable('Zalo');
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text(message),
                            duration: const Duration(seconds: 6),
                          ),
                        );
                      }
                    } catch (error) {
                      if (!context.mounted) return;
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text(
                            l10n.providerError('Zalo', error),
                          ),
                          duration: const Duration(seconds: 10),
                          backgroundColor: AppTheme.errorColor,
                        ),
                      );
                    }
                  },
                  icon: const Icon(Icons.chat_bubble_rounded, size: 20),
                  label: Text(l10n.text('auth.zalo')),
                ),
                const SizedBox(height: 12),

                // Phone login fallback CTA
                FilledButton.icon(
                  onPressed: () async {
                    await CustomerSessionController.instance.startPhoneEntry();
                    if (!context.mounted) return;
                    Navigator.of(context).pushNamed(RouteNames.authPhone);
                  },
                  style: FilledButton.styleFrom(
                    backgroundColor: AppTheme.white,
                    foregroundColor: AppTheme.primaryColor,
                    side: BorderSide(color: AppTheme.borderColor),
                  ),
                  icon: const Icon(Icons.phone_iphone_rounded, size: 20),
                  label: Text(l10n.text('auth.phone')),
                ),
                const SizedBox(height: 16),

                // Divider
                Row(
                  children: [
                    Expanded(
                      child: Divider(color: AppTheme.borderColor, thickness: 1),
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      child: Text(
                        l10n.text('auth.or'),
                        style: TextStyle(
                          fontSize: 13,
                          color: AppTheme.textSecondary,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                    Expanded(
                      child: Divider(color: AppTheme.borderColor, thickness: 1),
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                // Social login options
                _SocialLoginButton(
                  icon: const _GoogleIcon(),
                  label: l10n.text('auth.google'),
                  onTap: () => _beginSocialSignIn(
                    context,
                    CustomerAuthProvider.google,
                    'Google',
                  ),
                ),
                const SizedBox(height: 12),
                _SocialLoginButton(
                  icon: const _KakaoIcon(),
                  label: l10n.text('auth.kakao'),
                  onTap: () => _beginSocialSignIn(
                    context,
                    CustomerAuthProvider.kakao,
                    'Kakao',
                  ),
                ),
                const SizedBox(height: 32),

                // Guest option
                Center(
                  child: TextButton(
                    onPressed: () =>
                        Navigator.of(context).pushNamed(RouteNames.guest),
                    style: TextButton.styleFrom(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 12, vertical: 8),
                      minimumSize: const Size(48, 44),
                      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                    ),
                    child: RichText(
                      text: TextSpan(
                        text: l10n.text('auth.justBrowsing'),
                        style: TextStyle(
                          fontSize: 14,
                          color: AppTheme.textSecondary,
                        ),
                        children: [
                          TextSpan(
                            text: l10n.text('entry.guest'),
                            style: TextStyle(
                              color: AppTheme.primaryColor,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                Center(
                  child: Text(
                    l10n.text('auth.providerHint'),
                    style: TextStyle(
                      fontSize: 12,
                      color: AppTheme.textSecondary,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ),
                const SizedBox(height: 12),
                Center(
                  child: Text(
                    l10n.text('auth.terms'),
                    style: TextStyle(
                      fontSize: 11,
                      color: AppTheme.textSecondary,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Future<void> _beginSocialSignIn(
    BuildContext context,
    CustomerAuthProvider provider,
    String providerLabel,
  ) async {
    try {
      final result =
          await CustomerSessionController.instance.beginSignIn(provider);
      if (!context.mounted) return;
      if (!result.isReady) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              result.message ?? context.l10n.providerUnavailable(providerLabel),
            ),
            duration: const Duration(seconds: 6),
          ),
        );
      }
    } catch (error) {
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(context.l10n.providerError(providerLabel, error)),
          duration: const Duration(seconds: 10),
          backgroundColor: AppTheme.errorColor,
        ),
      );
    }
  }
}

class _SocialLoginButton extends StatelessWidget {
  final Widget icon;
  final String label;
  final VoidCallback onTap;

  const _SocialLoginButton({
    required this.icon,
    required this.label,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return OutlinedButton(
      onPressed: onTap,
      style: OutlinedButton.styleFrom(
        side: BorderSide(color: AppTheme.borderColor),
        padding: const EdgeInsets.symmetric(vertical: 14),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          icon,
          const SizedBox(width: 10),
          Text(
            label,
            style: TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.w600,
              color: Theme.of(context).colorScheme.onSurface,
            ),
          ),
        ],
      ),
    );
  }
}

class _KakaoIcon extends StatelessWidget {
  const _KakaoIcon();

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 22,
      height: 22,
      decoration: const BoxDecoration(
        color: Color(0xFFFEE500),
        shape: BoxShape.circle,
      ),
      child: const Center(
        child: Icon(Icons.chat_bubble, size: 13, color: Color(0xFF3C1E1E)),
      ),
    );
  }
}

class _GoogleIcon extends StatelessWidget {
  const _GoogleIcon();

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 22,
      height: 22,
      decoration: BoxDecoration(
        color: AppTheme.white,
        shape: BoxShape.circle,
        border: Border.all(color: AppTheme.borderColor),
      ),
      child: const Center(
        child: Text(
          'G',
          style: TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w800,
            color: Color(0xFF4285F4),
          ),
        ),
      ),
    );
  }
}
