import 'package:flutter/material.dart';

abstract final class AppTheme {
  static const _primary = Color(0xFFE91400);
  static const _primaryDark = Color(0xFFB91005);
  static const _primaryPressed = Color(0xFF9F0F06);
  static const _primarySoft = Color(0xFFFFF0EE);
  static const _primaryTint = Color(0xFFFFDFDA);
  static const _primaryMist = Color(0xFFFFF7F5);
  static const _secondary = Color(0xFFFFB020);
  static const _secondarySoft = Color(0xFFFFF3D6);
  static const _tomato = Color(0xFFFF4B32);
  static const _coral = Color(0xFFFF7A59);
  static const _surface = Color(0xFFFFFFFF);
  static const _surfaceMuted = Color(0xFFF6F6F6);
  static const _background = Color(0xFFFBFAF9);
  static const _onSurface = Color(0xFF141414);
  static const _onSurfaceVariant = Color(0xFF6A6A6A);
  static const _border = Color(0xFFE6E2DF);
  static const _disabled = Color(0xFFE1E1E1);
  static const _success = Color(0xFF087A3A);
  static const _warning = Color(0xFFB86B00);
  static const _error = Color(0xFFD92D20);

  static const primaryColor = _primary;
  static const primaryDark = _primaryDark;
  static const primaryPressed = _primaryPressed;
  static const primarySoft = _primarySoft;
  static const primaryTint = _primaryTint;
  static const primaryMist = _primaryMist;
  static const secondaryColor = _secondary;
  static const tomatoColor = _tomato;
  static const coralColor = _coral;
  static const successColor = _success;
  static const warningColor = _warning;
  static const errorColor = _error;
  static const borderColor = _border;
  static const disabledColor = _disabled;
  static const backgroundGrey = _background;
  static const surfaceMuted = _surfaceMuted;
  static const textSecondary = _onSurfaceVariant;
  static const inkColor = _onSurface;
  static const white = _surface;
  static const cardRadius = 16.0;
  static const pillRadius = 999.0;
  static const spaceXs = 4.0;
  static const spaceSm = 8.0;
  static const spaceMd = 12.0;
  static const spaceLg = 16.0;
  static const spaceXl = 24.0;
  static const space2Xl = 32.0;

  static BoxShadow softShadow({double alpha = 0.08}) => BoxShadow(
        color: _onSurface.withValues(alpha: alpha),
        blurRadius: 20,
        offset: const Offset(0, 8),
      );

  static ThemeData get theme => ThemeData(
        useMaterial3: true,
        brightness: Brightness.light,
        colorScheme: ColorScheme.light(
          primary: _primary,
          secondary: _secondary,
          surface: _surface,
          onSurface: _onSurface,
          onSurfaceVariant: _onSurfaceVariant,
          error: _error,
          primaryContainer: _primarySoft,
          secondaryContainer: _secondarySoft,
          outline: _border,
          surfaceContainerHighest: _surfaceMuted,
        ),
        scaffoldBackgroundColor: _background,
        textTheme: const TextTheme(
          headlineLarge: TextStyle(
            fontSize: 28,
            fontWeight: FontWeight.w900,
            letterSpacing: 0,
            color: _onSurface,
          ),
          headlineMedium: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.w900,
            letterSpacing: 0,
            color: _onSurface,
          ),
          headlineSmall: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w800,
            letterSpacing: 0,
            color: _onSurface,
          ),
          titleLarge: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w800,
            color: _onSurface,
          ),
          titleMedium: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: _onSurface,
          ),
          titleSmall: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            color: _onSurface,
          ),
          bodyLarge: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w400,
            color: _onSurface,
          ),
          bodyMedium: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w400,
            color: _onSurface,
          ),
          bodySmall: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w400,
            color: _onSurfaceVariant,
          ),
          labelLarge: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            color: _onSurface,
          ),
          labelMedium: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w500,
            color: _onSurfaceVariant,
          ),
          labelSmall: TextStyle(
            fontSize: 10,
            fontWeight: FontWeight.w500,
            color: _onSurfaceVariant,
          ),
        ),
        appBarTheme: const AppBarTheme(
          centerTitle: false,
          elevation: 0,
          scrolledUnderElevation: 0.5,
          backgroundColor: _surface,
          foregroundColor: _onSurface,
          titleTextStyle: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w900,
            letterSpacing: 0,
            color: _onSurface,
          ),
        ),
        cardTheme: CardThemeData(
          elevation: 0,
          shadowColor: _onSurface.withValues(alpha: 0.08),
          color: _surface,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(cardRadius),
          ),
          clipBehavior: Clip.antiAlias,
          margin: EdgeInsets.zero,
        ),
        filledButtonTheme: FilledButtonThemeData(
          style: FilledButton.styleFrom(
            backgroundColor: _primary,
            foregroundColor: _surface,
            disabledBackgroundColor: _disabled,
            disabledForegroundColor: _onSurfaceVariant.withValues(alpha: 0.58),
            minimumSize: const Size(double.infinity, 52),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            textStyle: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w700,
            ),
          ),
        ),
        outlinedButtonTheme: OutlinedButtonThemeData(
          style: OutlinedButton.styleFrom(
            foregroundColor: _onSurface,
            disabledForegroundColor: _onSurfaceVariant.withValues(alpha: 0.58),
            minimumSize: const Size(double.infinity, 52),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            side: const BorderSide(color: _border),
            textStyle: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
        textButtonTheme: TextButtonThemeData(
          style: TextButton.styleFrom(
            foregroundColor: _primary,
            textStyle: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: _surface,
          contentPadding:
              const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: _border),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: _border),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: _primary, width: 2),
          ),
          hintStyle: const TextStyle(
            color: _onSurfaceVariant,
            fontWeight: FontWeight.w400,
          ),
        ),
        chipTheme: ChipThemeData(
          backgroundColor: _surface,
          selectedColor: _primarySoft,
          labelStyle: const TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w500,
          ),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(pillRadius),
            side: const BorderSide(color: _border),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        ),
        navigationBarTheme: NavigationBarThemeData(
          elevation: 0,
          backgroundColor: _surface,
          indicatorColor: _primarySoft,
          indicatorShape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
          height: 72,
          labelTextStyle: WidgetStateProperty.resolveWith((states) {
            if (states.contains(WidgetState.selected)) {
              return const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w700,
                color: _primary,
              );
            }
            return const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w500,
              color: _onSurfaceVariant,
            );
          }),
          iconTheme: WidgetStateProperty.resolveWith((states) {
            if (states.contains(WidgetState.selected)) {
              return const IconThemeData(color: _primary, size: 24);
            }
            return const IconThemeData(color: _onSurfaceVariant, size: 24);
          }),
        ),
        dividerTheme: const DividerThemeData(
          color: _border,
          thickness: 1,
          space: 1,
        ),
        bottomSheetTheme: const BottomSheetThemeData(
          backgroundColor: _surface,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
          ),
        ),
      );
}
