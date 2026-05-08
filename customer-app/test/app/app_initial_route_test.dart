import 'package:deliberry_customer_app/app/app.dart';
import 'package:deliberry_customer_app/app/router/route_names.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('resolveCustomerInitialRoute', () {
    test('falls back to entry for the default root route', () {
      expect(
        resolveCustomerInitialRoute(Navigator.defaultRouteName),
        RouteNames.entry,
      );
    });

    test('falls back to entry for a blank route name', () {
      expect(resolveCustomerInitialRoute('   '), RouteNames.entry);
    });

    test('preserves deep links for guarded customer routes', () {
      expect(resolveCustomerInitialRoute(RouteNames.orders), RouteNames.orders);
      expect(resolveCustomerInitialRoute(RouteNames.profile), RouteNames.profile);
    });
  });
}
