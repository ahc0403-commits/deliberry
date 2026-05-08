import 'package:deliberry_customer_app/core/data/customer_runtime_controller.dart';
import 'package:deliberry_customer_app/core/data/customer_runtime_gateway.dart';
import 'package:deliberry_customer_app/core/data/mock_data.dart';
import 'package:deliberry_customer_app/core/session/customer_auth_adapter.dart';
import 'package:deliberry_customer_app/core/session/customer_session_controller.dart';
import 'package:flutter_test/flutter_test.dart';

class _FakeCustomerRuntimeGateway implements CustomerRuntimeGateway {
  _FakeCustomerRuntimeGateway({
    this.onSaveAddress,
    this.onSaveProfileIdentity,
  });

  final Future<List<MockAddress>> Function(MockAddress address)? onSaveAddress;
  final Future<CustomerProfileIdentity> Function(CustomerProfileIdentity input)?
      onSaveProfileIdentity;

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
  Future<CustomerFavoriteStoresSnapshot> readFavoriteStores() async =>
      throw UnimplementedError();

  @override
  Future<CustomerOrderReview> saveOrderReview(
          CustomerOrderReview input) async =>
      throw UnimplementedError();

  @override
  Future<CustomerProfileIdentity> saveProfileIdentity(
    CustomerProfileIdentity input,
  ) async {
    final handler = onSaveProfileIdentity;
    if (handler == null) {
      throw UnimplementedError();
    }
    return handler(input);
  }

  @override
  Future<CustomerSettingsPreferences> saveSettingsPreferences(
    CustomerSettingsPreferences input,
  ) async =>
      throw UnimplementedError();

  @override
  Future<CustomerFavoriteStoresSnapshot> saveFavoriteStores(
    CustomerFavoriteStoresSnapshot input,
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

  test(
    'guest saveProfileIdentity keeps the display name in local runtime state',
    () async {
      session.debugSetTestState(
        status: CustomerAuthStatus.guest,
        identity: null,
        phoneNumber: null,
      );

      await runtime.saveProfileIdentity(displayName: 'Alex Guest');

      expect(runtime.profileDisplayName, 'Alex Guest');
      expect(runtime.lastRuntimeBlocker, isNull);
    },
  );

  test(
    'signed-in saveProfileIdentity stays local when the runtime backend is not configured',
    () async {
      session.debugSetTestState(
        status: CustomerAuthStatus.authenticated,
        identity: const CustomerAuthIdentity(
          actorId: 'customer-3',
          actorType: 'customer',
          provider: CustomerAuthProvider.google,
        ),
      );
      runtime.debugSetGateway(
        _FakeCustomerRuntimeGateway(
          onSaveProfileIdentity: (_) async =>
              const CustomerProfileIdentity(displayName: 'Persisted Alex'),
        ),
      );

      await runtime.saveProfileIdentity(displayName: 'Alex Guest');

      expect(runtime.profileDisplayName, 'Alex Guest');
      expect(runtime.lastRuntimeBlocker, isNull);
    },
  );

  test(
    'createGroupOrderRoom creates a local room with a host participant',
    () {
      runtime.saveProfileIdentity(displayName: 'Alex Host');

      final room = runtime.createGroupOrderRoom();

      expect(room.code, startsWith('LOCAL-'));
      expect(room.participants, hasLength(1));
      expect(room.participants.single.name, 'Alex Host');
      expect(room.participants.single.role, 'host');
    },
  );

  test(
    'joinGroupOrderRoom adds a local member only when the room code matches',
    () async {
      await runtime.saveProfileIdentity(displayName: 'Alex Member');
      final room = runtime.createGroupOrderRoom();

      final joined = runtime.joinGroupOrderRoom(room.code);
      final failedJoin = runtime.joinGroupOrderRoom('LOCAL-9999');

      expect(joined, isTrue);
      expect(failedJoin, isFalse);
      expect(runtime.groupOrderRoom, isNotNull);
      expect(runtime.groupOrderRoom!.participants, hasLength(2));
      expect(runtime.groupOrderRoom!.participants.last.name, 'Alex Member');
      expect(runtime.groupOrderRoom!.participants.last.role, 'member');
    },
  );
}
