import 'customer_runtime_controller.dart';

abstract class CustomerRuntimeGateway {
  Future<List<CustomerOrderRecord>> readActiveOrders();
  Future<List<CustomerOrderRecord>> readPastOrders();
  Future<CustomerOrderRecord> submitOrder();
}
