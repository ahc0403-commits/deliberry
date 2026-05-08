import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';

import '../core/i18n/app_language_overlay.dart';
import '../core/i18n/app_locale_controller.dart';
import '../core/i18n/app_localizations.dart';
import '../core/session/customer_session_controller.dart';
import '../core/theme/app_theme.dart';
import 'router/app_router.dart';
import 'router/route_names.dart';

String resolveCustomerInitialRoute(String platformRouteName) {
  final normalizedRoute = platformRouteName.trim();
  if (normalizedRoute.isEmpty || normalizedRoute == Navigator.defaultRouteName) {
    return RouteNames.entry;
  }

  return normalizedRoute;
}

class DeliberryApp extends StatelessWidget {
  const DeliberryApp({super.key});

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: Listenable.merge([
        CustomerSessionController.instance,
        AppLocaleController.instance,
      ]),
      builder: (context, _) {
        return MaterialApp(
          title: 'Deliberry',
          debugShowCheckedModeBanner: false,
          locale: AppLocaleController.instance.locale,
          supportedLocales: customerSupportedLocales,
          localizationsDelegates: const [
            AppLocalizations.delegate,
            GlobalMaterialLocalizations.delegate,
            GlobalWidgetsLocalizations.delegate,
            GlobalCupertinoLocalizations.delegate,
          ],
          initialRoute: resolveCustomerInitialRoute(
            WidgetsBinding.instance.platformDispatcher.defaultRouteName,
          ),
          onGenerateRoute: AppRouter.onGenerateRoute,
          theme: AppTheme.theme,
          builder: (context, child) => Stack(
            children: [
              if (child != null) child,
              const AppLanguageOverlay(),
            ],
          ),
        );
      },
    );
  }
}
