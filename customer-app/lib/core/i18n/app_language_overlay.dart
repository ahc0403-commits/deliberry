import 'package:flutter/material.dart';

import 'app_locale_controller.dart';
import 'app_localizations.dart';

class AppLanguageOverlay extends StatelessWidget {
  const AppLanguageOverlay({super.key});

  @override
  Widget build(BuildContext context) {
    final localeController = AppLocaleController.instance;

    return SafeArea(
      child: Align(
        alignment: Alignment.topCenter,
        child: Padding(
          padding: const EdgeInsets.only(top: 10, left: 12, right: 12),
          child: Material(
            color: Colors.white.withValues(alpha: 0.94),
            elevation: 3,
            borderRadius: BorderRadius.circular(12),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              child: AnimatedBuilder(
                animation: localeController,
                builder: (context, _) => Wrap(
                  crossAxisAlignment: WrapCrossAlignment.center,
                  spacing: 8,
                  runSpacing: 6,
                  alignment: WrapAlignment.center,
                  children: const [
                    _LanguageLabel(),
                    _LanguageChip(languageCode: 'en', label: 'English'),
                    _LanguageChip(languageCode: 'ko', label: '한국어'),
                    _LanguageChip(languageCode: 'vi', label: 'Tiếng Việt'),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _LanguageLabel extends StatelessWidget {
  const _LanguageLabel();

  @override
  Widget build(BuildContext context) {
    return Text(
      context.l10n.text('language'),
      style: const TextStyle(
        fontSize: 12,
        fontWeight: FontWeight.w700,
      ),
    );
  }
}

class _LanguageChip extends StatelessWidget {
  final String languageCode;
  final String label;

  const _LanguageChip({
    required this.languageCode,
    required this.label,
  });

  @override
  Widget build(BuildContext context) {
    final localeController = AppLocaleController.instance;
    final isSelected =
        localeController.locale.languageCode == languageCode;

    return GestureDetector(
      onTap: () {
        localeController.setLocale(Locale(languageCode));
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 180),
        curve: Curves.easeOut,
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected ? Theme.of(context).colorScheme.primary : Colors.transparent,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(
            color: isSelected
                ? Theme.of(context).colorScheme.primary
                : Colors.black.withValues(alpha: 0.08),
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w700,
            color: isSelected
                ? Theme.of(context).colorScheme.onPrimary
                : Theme.of(context).colorScheme.onSurface,
          ),
        ),
      ),
    );
  }
}
