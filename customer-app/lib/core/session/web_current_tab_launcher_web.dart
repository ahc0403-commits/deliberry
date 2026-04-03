// ignore_for_file: avoid_web_libraries_in_flutter, deprecated_member_use

import 'dart:html' as html;

Future<bool> launchInCurrentTab(String url) async {
  // Try anchor-click first — the most universally supported navigation
  // method across regular browsers, mobile WebViews, and in-app browsers.
  try {
    final anchor = html.AnchorElement(href: url)
      ..style.display = 'none';
    html.document.body?.append(anchor);
    anchor.click();
    anchor.remove();
    return true;
  } catch (_) {}

  // Fallback: direct location mutation.
  try {
    html.window.location.assign(url);
    return true;
  } catch (_) {}

  try {
    html.window.location.href = url;
    return true;
  } catch (_) {}

  return false;
}
