import 'package:flutter/material.dart';

import '../../../app/router/route_names.dart';
import '../../../core/i18n/app_localizations.dart';
import '../../../core/session/customer_session_controller.dart';
import '../../../core/theme/app_theme.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  static const _pages = [
    _OnboardingPage(
      title: 'Discover amazing\nlocal restaurants',
      subtitle:
          'Browse hundreds of restaurants and stores near you. From local favourites to new discoveries.',
      emoji: '🍔',
      gradientColors: [AppTheme.primaryColor, AppTheme.primaryDark],
      accentColor: AppTheme.primaryColor,
    ),
    _OnboardingPage(
      title: 'Tell us what\nyou love',
      subtitle:
          'Set your food preferences and dietary needs so we can show you the best matches every time.',
      emoji: '❤️',
      gradientColors: [AppTheme.tomatoColor, AppTheme.primaryColor],
      accentColor: AppTheme.tomatoColor,
    ),
    _OnboardingPage(
      title: 'Fast delivery\nto your door',
      subtitle:
          'Share your location for accurate delivery times and personalised restaurant suggestions nearby.',
      emoji: '📍',
      gradientColors: [AppTheme.primaryDark, AppTheme.coralColor],
      accentColor: AppTheme.primaryDark,
    ),
  ];

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _onNext() {
    if (_currentPage < _pages.length - 1) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 350),
        curve: Curves.easeInOut,
      );
    } else {
      _finish();
    }
  }

  Future<void> _finish() async {
    await CustomerSessionController.instance.completeOnboarding();
    if (!mounted) return;
    Navigator.of(context).pushReplacementNamed(RouteNames.home);
  }

  @override
  Widget build(BuildContext context) {
    final isLast = _currentPage == _pages.length - 1;

    return Scaffold(
      backgroundColor: AppTheme.white,
      body: SafeArea(
        child: Column(
          children: [
            // Skip button row
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // Page dots
                  Row(
                    children: List.generate(_pages.length, (i) {
                      return AnimatedContainer(
                        duration: const Duration(milliseconds: 250),
                        margin: const EdgeInsets.only(right: 6),
                        width: i == _currentPage ? 24 : 8,
                        height: 8,
                        decoration: BoxDecoration(
                          color: i == _currentPage
                              ? _pages[_currentPage].accentColor
                              : AppTheme.borderColor,
                          borderRadius: BorderRadius.circular(4),
                        ),
                      );
                    }),
                  ),
                  // Skip button
                  if (!isLast)
                    TextButton(
                      onPressed: _finish,
                      style: TextButton.styleFrom(
                        foregroundColor: AppTheme.textSecondary,
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 6,
                        ),
                      ),
                      child: Text(
                        context.l10n.raw('Skip'),
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    )
                  else
                    const SizedBox(width: 60),
                ],
              ),
            ),

            // Page view
            Expanded(
              child: PageView.builder(
                controller: _pageController,
                onPageChanged: (i) => setState(() => _currentPage = i),
                itemCount: _pages.length,
                itemBuilder: (context, i) =>
                    _OnboardingPageView(page: _pages[i]),
              ),
            ),

            // Bottom button
            Padding(
              padding: const EdgeInsets.fromLTRB(24, 0, 24, 32),
              child: AnimatedSwitcher(
                duration: const Duration(milliseconds: 200),
                child: FilledButton(
                  key: ValueKey(isLast),
                  onPressed: _onNext,
                  style: FilledButton.styleFrom(
                    backgroundColor: _pages[_currentPage].accentColor,
                    foregroundColor: AppTheme.white,
                  ),
                  child: Text(
                    context.l10n.raw(isLast ? 'Get Started' : 'Next'),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _OnboardingPageView extends StatelessWidget {
  final _OnboardingPage page;

  const _OnboardingPageView({required this.page});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(24, 24, 24, 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Illustration
          Expanded(
            flex: 5,
            child: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: page.gradientColors,
                ),
                borderRadius: BorderRadius.circular(28),
              ),
              child: Stack(
                alignment: Alignment.center,
                children: [
                  // Decorative circles
                  Positioned(
                    top: -20,
                    right: -20,
                    child: Container(
                      width: 120,
                      height: 120,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: AppTheme.white.withValues(alpha: 0.08),
                      ),
                    ),
                  ),
                  Positioned(
                    bottom: 10,
                    left: -10,
                    child: Container(
                      width: 80,
                      height: 80,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: AppTheme.white.withValues(alpha: 0.08),
                      ),
                    ),
                  ),
                  // Main emoji
                  Text(
                    page.emoji,
                    style: const TextStyle(fontSize: 80),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 36),

          // Text content
          Expanded(
            flex: 3,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  context.l10n.raw(page.title),
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.w800,
                    color: Theme.of(context).colorScheme.onSurface,
                    letterSpacing: 0,
                    height: 1.18,
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  context.l10n.raw(page.subtitle),
                  style: TextStyle(
                    fontSize: 16,
                    color: AppTheme.textSecondary,
                    height: 1.5,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _OnboardingPage {
  final String title;
  final String subtitle;
  final String emoji;
  final List<Color> gradientColors;
  final Color accentColor;

  const _OnboardingPage({
    required this.title,
    required this.subtitle,
    required this.emoji,
    required this.gradientColors,
    required this.accentColor,
  });
}
