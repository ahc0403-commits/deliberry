import 'customer_repository.dart';
import '../shared_contracts/domain_contract_bridge.dart';

class InMemoryCustomerRepository implements CustomerRepository {
  @override
  List<String> getHomeSections() {
    return const [
      'featured stores',
      'repeat orders',
      'seasonal promotions',
    ];
  }

  @override
  List<String> getDiscoverySections() {
    return const [
      'trending',
      'nearby',
      'group-friendly',
    ];
  }

  @override
  List<String> getSearchInputs() {
    return const [
      'query',
      'recent searches',
      'search suggestions',
    ];
  }

  @override
  List<String> getFilterGroups() {
    return const [
      'cuisine',
      'delivery type',
      'price',
      'rating',
    ];
  }

  @override
  List<String> getStoreSections() {
    return const [
      'hero summary',
      'ratings summary',
      'availability',
    ];
  }

  @override
  List<String> getMenuGroups() {
    return const [
      'featured items',
      'categories',
      'item modifiers',
    ];
  }

  @override
  List<String> getCartSections() {
    return const [
      'items',
      'notes',
      'quantity controls',
      'price summary',
    ];
  }

  @override
  List<String> getOrderGroups() {
    return const [
      'active orders',
      'past orders',
      'review prompts',
    ];
  }

  @override
  List<String> getOrderDetailSections() {
    return const [
      'line items',
      'totals',
      'delivery summary',
    ];
  }

  @override
  List<String> getOrderStatusMilestones() {
    return DomainContractBridge.orderStatusMilestoneLabels;
  }

  @override
  List<String> getCheckoutSections() {
    return [
      'delivery address',
      'delivery notes',
      'payment method selection',
      ...DomainContractBridge.paymentMethodLabels,
      'order summary',
    ];
  }

  @override
  List<String> getReviewSections() {
    return const [
      'rating summary',
      'feedback entry',
      'review media',
    ];
  }

  @override
  List<String> getProfileSections() {
    return const [
      'account summary',
      'preferences',
      'saved addresses',
      'notification settings',
    ];
  }

  @override
  List<String> getAddressSections() {
    return const [
      'saved addresses',
      'default address marker',
      'address entry',
    ];
  }

  @override
  List<String> getNotificationSections() {
    return const [
      'order alerts',
      'marketing messages',
      'read state',
    ];
  }

  @override
  List<String> getSettingsSections() {
    return const [
      'account controls',
      'notification preferences',
      'privacy settings',
      'support links',
    ];
  }
}

final CustomerRepository customerRepository = InMemoryCustomerRepository();
