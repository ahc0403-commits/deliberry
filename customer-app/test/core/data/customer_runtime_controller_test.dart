import 'package:deliberry_customer_app/core/data/customer_runtime_controller.dart';
import 'package:deliberry_customer_app/core/data/customer_runtime_gateway.dart';
import 'package:deliberry_customer_app/core/data/mock_data.dart';
import 'package:deliberry_customer_app/core/session/customer_auth_adapter.dart';
import 'package:deliberry_customer_app/core/session/customer_session_controller.dart';
import 'package:flutter_test/flutter_test.dart';

class _FakeCustomerRuntimeGateway implements CustomerRuntimeGateway {
  _FakeCustomerRuntimeGateway({
    this.onSaveAddress,
  });

  final Future<List<MockAddress>> Function(MockAddress address)? onSaveAddress;

  @override
  Future<List<MockAddress>> saveAddress(MockAddress address) async {
    final handler = onSaveAddress;
    if (handler == null) {
      throw UnimplementedError();
    }
    return handler(address);
  }

  @override
  Future<List<CustomerOrderRecord>> readActiveOrders({
    int limit = 20,
    CustomerOrderReadCursor? cursor,
  }) async =>
      throw UnimplementedError();

  @override
  Future<List<MockAddress>> readAddresses({int limit = 20}) async =>
      throw UnimplementedError();

  @override
  Future<PersistedCustomerOrder?> createOrder(
    CustomerOrderCreateInput input,
  ) async =>
      throw UnimplementedError();

  @override
  Future<List<MockAddress>> deleteAddress(String addressId) async =>
      throw UnimplementedError();

  @override
  Future<Map<String, dynamic>> exportMaskedOrderBundleForExternalLlm({
    String profile = 'external_llm_retrieval',
  }) async =>
      throw UnimplementedError();

  @override
  Future<CustomerOrderReview?> readOrderReview(String orderId) async =>
      throw UnimplementedError();

  @override
  Future<Map<String, CustomerOrderReview>> readOrderReviewsBatch(
    Iterable<String> orderIds,
  ) async =>
      throw UnimplementedError();

  @override
  Future<List<CustomerOrderRecord>> readPastOrders({
    int limit = 20,
    CustomerOrderReadCursor? cursor,
  }) async =>
      throw UnimplementedError();

  @override
  Future<CustomerProfileIdentity> readProfileIdentity() async =>
      throw UnimplementedError();

  @override
  Future<CustomerSettingsPreferences> readSettingsPreferences() async =>
      throw UnimplementedError();

  @override
  Future<CustomerOrderReview> saveOrderReview(
          CustomerOrderReview input) async =>
      throw UnimplementedError();

  @override
  Future<CustomerProfileIdentity> saveProfileIdentity(
    CustomerProfileIdentity input,
  ) async =>
      throw UnimplementedError();

  @override
  Future<CustomerSettingsPreferences> saveSettingsPreferences(
    CustomerSettingsPreferences input,
  ) async =>
      throw UnimplementedError();

  @override
  Future<List<MockAddress>> setDefaultAddress(String addressId) async =>
      throw UnimplementedError();
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  final runtime = CustomerRuntimeController.instance;
  final session = CustomerSessionController.instance;

  setUp(() {
    runtime.debugResetForTest();
  });

  tearDown(() {
    session.debugSetTestState(
      status: CustomerAuthStatus.signedOut,
      identity: null,
      phoneNumber: null,
    );
    runtime.debugResetForTest();
  });

  test(
    'signed-in addAddress does not keep an optimistic local address when persistence fails',
    () async {
      session.debugSetTestState(
        status: CustomerAuthStatus.authenticated,
        identity: const CustomerAuthIdentity(
          actorId: 'customer-1',
          actorType: 'customer',
          provider: CustomerAuthProvider.kakao,
        ),
      );
      runtime.debugSetGateway(
        _FakeCustomerRuntimeGateway(
          onSaveAddress: (_) async =>
              throw StateError('Customer address save failed'),
        ),
      );

      await expectLater(
        runtime.addAddress(
          const MockAddress(
            id: '',
            label: 'Home',
            street: '123 Test Street',
            detail: 'Apt 5',
          ),
        ),
        throwsStateError,
      );

      expect(runtime.addresses, isEmpty);
      expect(runtime.lastRuntimeBlocker, 'address_save_failed');
    },
  );

  test(
    'signed-in addAddress adopts the persisted address list returned by the gateway',
    () async {
      session.debugSetTestState(
        status: CustomerAuthStatus.authenticated,
        identity: const CustomerAuthIdentity(
          actorId: 'customer-2',
          actorType: 'customer',
          provider: CustomerAuthProvider.zalo,
        ),
      );
      runtime.debugSetGateway(
        _FakeCustomerRuntimeGateway(
          onSaveAddress: (_) async => const [
            MockAddress(
              id: 'addr-persisted-1',
              label: 'Home',
              street: '456 Persisted Ave',
              detail: 'Floor 2',
              isDefault: true,
            ),
          ],
        ),
      );

      await runtime.addAddress(
        const MockAddress(
          id: '',
          label: 'Home',
          street: '456 Persisted Ave',
          detail: 'Floor 2',
        ),
      );

      expect(runtime.addresses, hasLength(1));
      expect(runtime.addresses.single.id, 'addr-persisted-1');
      expect(runtime.addresses.single.isDefault, isTrue);
      expect(runtime.lastRuntimeBlocker, isNull);
    },
  );
}
