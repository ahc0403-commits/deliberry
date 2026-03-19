import 'package:flutter/material.dart';
import 'app/app.dart';
import 'core/session/customer_session_controller.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await CustomerSessionController.instance.restore();
  runApp(const DeliberryApp());
}
