// ignore_for_file: avoid_web_libraries_in_flutter, deprecated_member_use

import 'dart:html' as html;

Future<bool> launchInCurrentTab(String url) async {
  try {
    // Force same-tab navigation for OAuth redirects on web.
    html.window.location.assign(url);
    return true;
  } catch (_) {
    try {
      html.window.location.href = url;
      return true;
    } catch (_) {
      return false;
    }
  }
}
