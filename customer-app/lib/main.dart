import 'package:app_links/app_links.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

import 'app/app.dart';
import 'core/session/customer_session_controller.dart';
import 'core/supabase/supabase_client.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await CustomerSupabaseClient.ensureInitialized();
  await CustomerSessionController.instance.restore();
  final startupWebCallback =
      kIsWeb && Uri.base.queryParameters['provider'] == 'zalo'
          ? Uri.base
          : null;

  runApp(const DeliberryApp());

  if (startupWebCallback != null) {
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      // Yield so widget-tree mount microtasks finish and listeners attach
      await Future<void>.delayed(Duration.zero);
      CustomerSessionController.instance.handleAuthCallback(startupWebCallback);
    });
    return;
  }

  if (kIsWeb) {
    return;
  }

  final appLinks = AppLinks();
  final initialLink = await appLinks.getInitialLink();
  if (initialLink != null) {
    await CustomerSessionController.instance.handleAuthCallback(initialLink);
  }
  appLinks.uriLinkStream.listen((uri) {
    CustomerSessionController.instance.handleAuthCallback(uri);
  });
}
