import 'package:app_links/app_links.dart';
import 'package:flutter/material.dart';

import 'app/app.dart';
import 'core/session/customer_session_controller.dart';
import 'core/supabase/supabase_client.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await CustomerSupabaseClient.ensureInitialized();
  await CustomerSessionController.instance.restore();
  final appLinks = AppLinks();
  final initialLink = await appLinks.getInitialLink();
  if (initialLink != null) {
    await CustomerSessionController.instance.handleAuthCallback(initialLink);
  }
  appLinks.uriLinkStream.listen((uri) {
    CustomerSessionController.instance.handleAuthCallback(uri);
  });
  runApp(const DeliberryApp());
}
