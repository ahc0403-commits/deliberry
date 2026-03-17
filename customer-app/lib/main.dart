import 'package:flutter/material.dart';
import 'app/app.dart';
import 'core/session/customer_session_controller.dart';

void main() {
  CustomerSessionController.instance.restore();
  runApp(const DeliberryApp());
}
