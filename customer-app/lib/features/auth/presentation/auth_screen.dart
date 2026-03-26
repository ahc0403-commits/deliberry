import 'package:flutter/material.dart';

import '../../../app/router/route_names.dart';
import '../../../core/session/customer_auth_adapter.dart';
import '../../../core/session/customer_session_controller.dart';
import '../../../core/theme/app_theme.dart';

class AuthScreen extends StatelessWidget {
  const AuthScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(24, 48, 24, 32),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
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
                          letterSpacing: -1,
                        ),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 28),
                Text(
                  'Welcome back',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.w800,
                    color: Theme.of(context).colorScheme.onSurface,
                    letterSpacing: -0.8,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Sign in to track orders, save favourites,\nand get personalised recommendations.',
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
                    final result = await CustomerSessionController.instance
                        .beginSignIn(CustomerAuthProvider.zalo);
                    if (!context.mounted) return;
                    if (!result.isReady) {
                      final message = result.message ??
                          'Zalo login is not available right now.';
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text(message)),
                      );
                    }
                  },
                  icon: const Icon(Icons.chat_bubble_rounded, size: 20),
                  label: const Text('Continue with Zalo'),
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
                    backgroundColor: Colors.white,
                    foregroundColor: AppTheme.primaryColor,
                    side: BorderSide(color: AppTheme.borderColor),
                  ),
                  icon: const Icon(Icons.phone_iphone_rounded, size: 20),
                  label: const Text('Use Phone Instead'),
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
                        'or',
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
                  icon: _GoogleIcon(),
                  label: 'Continue with Google',
                  onTap: () async {
                    final result = await CustomerSessionController.instance
                        .beginSignIn(CustomerAuthProvider.google);
                    if (!context.mounted) return;
                    if (!result.isReady) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text(
                            result.message ?? 'Google sign-in is unavailable.',
                          ),
                        ),
                      );
                    }
                  },
                ),
                const SizedBox(height: 12),
                _SocialLoginButton(
                  icon: Icon(Icons.apple,
                      size: 22, color: Theme.of(context).colorScheme.onSurface),
                  label: 'Continue with Apple',
                  onTap: () async {
                    final result = await CustomerSessionController.instance
                        .beginSignIn(CustomerAuthProvider.apple);
                    if (!context.mounted) return;
                    if (!result.isReady) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text(
                            result.message ?? 'Apple sign-in is unavailable.',
                          ),
                        ),
                      );
                    }
                  },
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
                        text: 'Just browsing? ',
                        style: TextStyle(
                          fontSize: 14,
                          color: AppTheme.textSecondary,
                        ),
                        children: const [
                          TextSpan(
                            text: 'Continue as Guest',
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
                    'Zalo is the primary sign-in path. Phone verification remains available as fallback.',
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
          ),
        ),
      ),
    );
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

class _GoogleIcon extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 22,
      height: 22,
      child: CustomPaint(painter: _GoogleIconPainter()),
    );
  }
}

class _GoogleIconPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final cx = size.width / 2;
    final cy = size.height / 2;
    final r = size.width / 2;

    // Simplified G shape using arcs
    final paint = Paint()..style = PaintingStyle.fill;

    // Blue segment
    paint.color = const Color(0xFF4285F4);
    canvas.drawArc(
      Rect.fromCircle(center: Offset(cx, cy), radius: r),
      -0.52,
      1.57,
      true,
      paint,
    );

    // Red segment
    paint.color = const Color(0xFFEA4335);
    canvas.drawArc(
      Rect.fromCircle(center: Offset(cx, cy), radius: r),
      -2.09,
      1.57,
      true,
      paint,
    );

    // Yellow segment
    paint.color = const Color(0xFFFBBC05);
    canvas.drawArc(
      Rect.fromCircle(center: Offset(cx, cy), radius: r),
      2.62,
      1.57,
      true,
      paint,
    );

    // Green segment
    paint.color = const Color(0xFF34A853);
    canvas.drawArc(
      Rect.fromCircle(center: Offset(cx, cy), radius: r),
      1.05,
      1.57,
      true,
      paint,
    );

    // White center circle
    paint.color = Colors.white;
    canvas.drawCircle(Offset(cx, cy), r * 0.6, paint);

    // White G bar
    final barPaint = Paint()
      ..color = const Color(0xFF4285F4)
      ..style = PaintingStyle.fill;
    canvas.drawRect(
      Rect.fromLTWH(cx, cy - r * 0.15, r * 0.9, r * 0.3),
      barPaint,
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
