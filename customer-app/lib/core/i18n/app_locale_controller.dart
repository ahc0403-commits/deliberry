import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

const List<Locale> customerSupportedLocales = [
  Locale('en'),
  Locale('ko'),
  Locale('vi'),
];

class AppLocaleController extends ChangeNotifier {
  AppLocaleController._();

  static final AppLocaleController instance = AppLocaleController._();
  static const _storageKey = 'dlb_locale';

  Locale _locale = const Locale('en');

  Locale get locale => _locale;

  Future<void> restore() async {
    final prefs = await SharedPreferences.getInstance();
    final stored = prefs.getString(_storageKey);
    if (stored == null) return;
    final matching = customerSupportedLocales.where(
      (locale) => locale.languageCode == stored,
    );
    if (matching.isNotEmpty) {
      _locale = matching.first;
      notifyListeners();
    }
  }

  Future<void> setLocale(Locale locale) async {
    if (_locale == locale) return;
    _locale = locale;
    notifyListeners();
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_storageKey, locale.languageCode);
  }
}
