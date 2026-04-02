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
      kIsWeb && _isWebAuthCallback(Uri.base) ? Uri.base : null;

  if (startupWebCallback != null &&
      !CustomerSessionController.instance.hasAuthenticatedSession) {
    await CustomerSessionController.instance.handleAuthCallback(
      startupWebCallback,
    );
  }

  runApp(const DeliberryApp());

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


bool _isWebAuthCallback(Uri uri) {
  if (!(uri.scheme == 'http' || uri.scheme == 'https')) {
    return false;
  }

  final query = uri.queryParameters;
  return query.containsKey('code') ||
      query.containsKey('error') ||
      query.containsKey('error_description') ||
      query.containsKey('provider');
}
