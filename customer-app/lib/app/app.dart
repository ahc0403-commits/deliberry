import 'package:flutter/material.dart';

import '../core/session/customer_session_controller.dart';
import '../core/theme/app_theme.dart';
import 'router/app_router.dart';
import 'router/route_names.dart';

class DeliberryApp extends StatelessWidget {
  const DeliberryApp({super.key});

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: CustomerSessionController.instance,
      builder: (context, _) {
        return MaterialApp(
          title: 'Deliberry',
          debugShowCheckedModeBanner: false,
          initialRoute: RouteNames.entry,
          onGenerateRoute: AppRouter.onGenerateRoute,
          theme: AppTheme.theme,
        );
      },
    );
  }
}
