abstract final class DomainContractBridge {
  // Mirrors `shared/constants/domain.constants.json` until an approved
  // language-neutral generation step exists for Flutter consumption.
  static const orderStatuses = [
    'draft',
    'pending',
    'confirmed',
    'preparing',
    'ready',
    'in_transit',
    'delivered',
    'cancelled',
    'disputed',
  ];

  static const paymentMethods = [
    'cash',
    'card',
    'digital_wallet',
  ];

  static const paymentStatuses = [
    'pending',
    'captured',
    'settled',
    'failed',
    'refunded',
    'partially_refunded',
  ];

  static const promotionTypes = [
    'percentage',
    'fixed',
    'free_delivery',
    'coupon',
    'discount',
  ];

  static const authActorTypes = [
    'guest',
    'customer',
    'merchant_owner',
    'merchant_staff',
    'rider',
    'admin',
    'system',
  ];

  static const supportTicketStatuses = [
    'open',
    'in_progress',
    'awaiting_reply',
    'resolved',
    'closed',
  ];

  static const paymentMethodLabels = [
    'Cash',
    'Card',
    'Digital Wallet',
  ];

  static const orderStatusMilestoneLabels = [
    'confirmed',
    'preparing',
    'ready',
    'in transit',
    'delivered',
  ];
}
