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
  final startupWebCallback = kIsWeb ? _extractWebAuthCallback(Uri.base) : null;

  // On native platforms, attach the deep-link listener BEFORE runApp so that
  // a warm-start URI event is never lost to a race with widget mounting.
  AppLinks? appLinks;
  Uri? nativeInitialLink;
  if (!kIsWeb) {
    appLinks = AppLinks();
    // Subscribe to the stream immediately so events are buffered from the
    // platform channel even while getInitialLink() and runApp() execute.
    appLinks.uriLinkStream.listen((uri) {
      debugPrint('[main] deeplink:stream uri=$uri');
      CustomerSessionController.instance.handleAuthCallback(uri);
    });
    nativeInitialLink = await appLinks.getInitialLink();
  }

  runApp(const DeliberryApp());

  if (kIsWeb) {
    if (startupWebCallback != null &&
        !CustomerSessionController.instance.hasAuthenticatedSession) {
      // Keep first paint responsive on callback return.
      CustomerSessionController.instance.handleAuthCallback(startupWebCallback);
    }
    return;
  }

  // Handle cold-start deep link (app was not running when the link arrived).
  if (nativeInitialLink != null) {
    debugPrint('[main] deeplink:initial uri=$nativeInitialLink');
    await CustomerSessionController.instance
        .handleAuthCallback(nativeInitialLink);
  }
}


Uri? _extractWebAuthCallback(Uri uri) {
  if (!(uri.scheme == 'http' || uri.scheme == 'https')) {
    return null;
  }

  final query = <String, String>{...uri.queryParameters};
  final fragment = uri.fragment;
  final fragmentQueryIndex = fragment.indexOf('?');
  if (fragmentQueryIndex >= 0 && fragmentQueryIndex < fragment.length - 1) {
    final fragmentQuery = Uri.splitQueryString(
      fragment.substring(fragmentQueryIndex + 1),
    );
    query.addAll(fragmentQuery);
  }

  return query.containsKey('code') ||
          query.containsKey('error') ||
          query.containsKey('error_description') ||
          query.containsKey('provider')
      ? uri.replace(queryParameters: query)
      : null;
}
