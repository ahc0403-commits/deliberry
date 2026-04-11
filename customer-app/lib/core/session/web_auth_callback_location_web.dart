import 'dart:js_interop';

Future<void> clearHandledWebAuthCallbackLocation(Uri currentUri) async {
  final origin = currentUri.origin.trim();
  final target = origin.isEmpty ? currentUri.path : '$origin/#/entry';
  _replaceWindowHistoryState(null, ''.toJS, target.toJS);
}

@JS('window.history.replaceState')
external void _replaceWindowHistoryState(
  JSAny? data,
  JSString title,
  JSString url,
);
