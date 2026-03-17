import 'customer_repository.dart';
import 'in_memory_customer_repository.dart';

class CustomerQueryServices {
  const CustomerQueryServices(this._repository);

  final CustomerRepository _repository;

  List<String> getHomeSections() => _repository.getHomeSections();
  List<String> getDiscoverySections() => _repository.getDiscoverySections();
  List<String> getSearchInputs() => _repository.getSearchInputs();
  List<String> getFilterGroups() => _repository.getFilterGroups();
  List<String> getStoreSections() => _repository.getStoreSections();
  List<String> getMenuGroups() => _repository.getMenuGroups();
  List<String> getCartSections() => _repository.getCartSections();
  List<String> getOrderGroups() => _repository.getOrderGroups();
  List<String> getOrderDetailSections() => _repository.getOrderDetailSections();
  List<String> getOrderStatusMilestones() =>
      _repository.getOrderStatusMilestones();
  List<String> getCheckoutSections() => _repository.getCheckoutSections();
  List<String> getReviewSections() => _repository.getReviewSections();
  List<String> getProfileSections() => _repository.getProfileSections();
  List<String> getAddressSections() => _repository.getAddressSections();
  List<String> getNotificationSections() =>
      _repository.getNotificationSections();
  List<String> getSettingsSections() => _repository.getSettingsSections();
}

final customerQueryServices = CustomerQueryServices(customerRepository);
