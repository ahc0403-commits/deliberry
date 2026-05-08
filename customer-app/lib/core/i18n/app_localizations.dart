import 'package:flutter/widgets.dart';

class AppLocalizations {
  const AppLocalizations(this.locale);

  final Locale locale;

  static const supportedLanguageCodes = ['en', 'ko', 'vi'];

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  static AppLocalizations of(BuildContext context) {
    final value = Localizations.of<AppLocalizations>(
      context,
      AppLocalizations,
    );
    assert(value != null, 'No AppLocalizations found in context');
    return value!;
  }

  static const Map<String, Map<String, String>> _strings = {
    'en': {
      'language': 'Language',
      'nav.home': 'Home',
      'nav.search': 'Search',
      'nav.orders': 'Orders',
      'nav.profile': 'Profile',
      'settings.title': 'Settings',
      'settings.language': 'App language',
      'settings.openPageFailed': 'We could not open that page right now.',
      'settings.changePhoneTitle': 'Switch phone number on this device',
      'settings.changePhoneBody':
          'This signs you out on this device and starts phone sign-in again so you can continue with a different number. Orders already created on your account remain in Deliberry.',
      'settings.changePhoneContinue': 'Continue with phone sign-in',
      'entry.tagline': 'Food & groceries delivered\nfast to your door.',
      'entry.trust.time': '20 min avg',
      'entry.trust.stores': '500+ stores',
      'entry.trust.rating': '4.8 rating',
      'entry.startTitle': 'Get started today',
      'entry.startBody':
          'Sign in with Zalo, Google, or Kakao. You can also continue as guest while phone verification remains environment-dependent.',
      'entry.getStarted': 'Get Started',
      'entry.guest': 'Continue as Guest',
      'entry.terms': 'By continuing you agree to our Terms & Privacy Policy',
      'auth.welcome': 'Welcome back',
      'auth.subtitle':
          'Sign in to track orders, save favourites,\nand get personalised recommendations.',
      'auth.zalo': 'Continue with Zalo',
      'auth.phone': 'Phone Sign-In',
      'auth.or': 'or',
      'auth.google': 'Continue with Google',
      'auth.kakao': 'Continue with Kakao',
      'auth.justBrowsing': 'Just browsing? ',
      'auth.providerHint':
          'Social sign-in requires the matching Supabase provider to be enabled. Phone sign-in is environment-dependent and may be unavailable until the Supabase phone provider is enabled.',
      'auth.terms': 'By continuing you agree to our Terms & Privacy Policy',
      'auth.providerUnavailable': '{provider} sign-in is unavailable.',
      'auth.providerError': '{provider} sign-in error: {error}',
      'cart.title': 'Cart',
      'cart.clear': 'Clear',
      'cart.empty': 'Your cart is empty',
      'cart.refreshed': 'Your cart was refreshed',
      'cart.emptySubtitle': 'Add items from a restaurant to get started',
      'cart.browse': 'Browse Restaurants',
      'cart.selectedStore': 'Selected store',
      'cart.menuUnavailable': 'Menu Unavailable',
      'cart.checkout': 'Continue to checkout',
      'cart.subtotal': 'Subtotal',
      'cart.deliveryFee': 'Delivery fee',
      'cart.serviceFee': 'Service fee',
      'cart.total': 'Total',
      'cart.promo': 'Promo',
      'cart.apply': 'Apply',
      'cart.addMore': 'Add more',
      'checkout.minimumOrderNotice':
          'Minimum order is {minimum}. Add {shortfall} more to continue.',
      'profile.customerWithPhone': 'Customer {phone}',
      'profile.signedInWith': 'Signed in on this device with {account}',
      'profile.savedAccount': 'your saved account',
      'profile.displayNameFallback': 'Customer',
      'profile.nameSaved': 'Profile updated for this session',
      'profile.editTitle': 'Edit profile',
      'profile.displayNameLabel': 'Display name',
      'profile.displayNameHint': 'How should Deliberry address you?',
      'profile.save': 'Save profile',
      'profile.saveFailed': 'We could not save your profile right now.',
      'profile.offersTitle': 'Promotions & offers',
      'profile.offersSubtitle':
          'Current customer-facing deals and the promo state tied to this device session.',
      'profile.offersApplied': 'Applied at checkout',
      'profile.offersAvailable': 'Available now',
      'profile.offersEmpty': 'No active offers right now.',
      'profile.favoriteStore.one': '1 favorite store',
      'profile.favoriteStore.other': '{count} favorite stores',
      'search.noResultsFor': 'No results for "{query}"',
      'search.tryFilters': 'Try changing your filters or search term',
      'search.tryDifferent': 'Try a different search term or browse categories',
      'search.result.one': '1 result',
      'search.result.other': '{count} results',
      'search.filter.one': '1 filter',
      'search.filter.other': '{count} filters',
      'settings.unavailable': '{label} is not available yet.',
      'notification.summary': '{unread} unread · {total} total',
      'notification.unread.one': '1 unread notification',
      'notification.unread.other': '{count} unread notifications',
      'notification.heroSubtitle':
          'This inbox stays connected for the current session. Mark items as read here and your account surfaces will reflect the same state.',
      'notification.emptySubtitle':
          "You're all caught up. We'll let you know when something new arrives.",
      'notification.sessionInbox': 'Session inbox',
      'notification.sessionReadState': 'Session read state',
      'store.favoriteAdded': '{store} saved to favorites',
      'store.favoriteRemoved': '{store} removed from favorites',
      'groupOrder.localParticipant.one': '1 local participant',
      'groupOrder.localParticipant.other': '{count} local participants',
      'settings.resetAccountTitle': 'Remove account from this device',
      'settings.resetAccountBody':
          'This signs you out and clears saved cart, addresses, favorites, and app preferences on this device. Orders already created on your account remain in Deliberry.',
      'settings.resetAccountSuccess':
          'This device was signed out and cleared for the current customer session.',
      'home.activeOrder.one': '1 active order',
      'home.activeOrder.other': '{count} active orders',
      'home.cartItem.one': '1 item',
      'home.cartItem.other': '{count} items',
      'home.deliveryNow': 'Deliver now',
      'home.browseFirst': 'Browse restaurants first',
      'home.checkoutReady': 'Sign in at checkout when you are ready.',
      'home.trackStatus': 'Tap to track delivery status.',
      'home.manageAddress': 'Tap to manage your delivery address.',
      'home.noAddressYet': 'No address yet',
      'home.searchHint': 'Search food, restaurants, groceries',
      'home.fastDelivery': 'Fast delivery',
      'home.freeDelivery': 'Free delivery',
      'home.deliveryFeeLabel': '{amount} fee',
      'Popular': 'Popular',
      'Browse restaurants': 'Browse restaurants',
      'Pending payment': 'Pending payment',
      'VNPAY test': 'VNPAY test',
      'Add address': 'Add address',
      'Tap to add a delivery address': 'Tap to add a delivery address',
      'Browse by category': 'Browse by category',
      'Popular near you': 'Popular near you',
      'My Addresses': 'My Addresses',
      'Manage your saved delivery addresses':
          'Manage your saved delivery addresses',
      'Addresses': 'Addresses',
      'Address required before home': 'Address required before home',
      'Account-synced when signed in': 'Account-synced when signed in',
      'No map or geocoding': 'No map or geocoding',
      'No saved addresses': 'No saved addresses',
      'Add New Address': 'Add New Address',
      'Edit Address': 'Edit Address',
      'Delete address': 'Delete address',
      'Remove saved address?': 'Remove saved address?',
      'Remove this address from your saved addresses?':
          'Remove this address from your saved addresses?',
      'We could not update the default address. Try again.':
          'We could not update the default address. Try again.',
      'We could not remove that address. Try again.':
          'We could not remove that address. Try again.',
      'Default': 'Default',
      'Edit': 'Edit',
      'Set as default': 'Set as default',
      'Delete': 'Delete',
      'Label and street address are required.':
          'Label and street address are required.',
      'We could not save that address. Try again.':
          'We could not save that address. Try again.',
      'Label (Home, Work...)': 'Label (Home, Work...)',
      'Street address': 'Street address',
      'Apt, floor, notes': 'Apt, floor, notes',
      'Save Address': 'Save Address',
      'Signed-in addresses sync with your customer account so they stay available after refresh and on future visits.':
          'Signed-in addresses sync with your customer account so they stay available after refresh and on future visits.',
      'Add an address to start using this account area for checkout and delivery.':
          'Add an address to start using this account area for checkout and delivery.',
      'address.saved.one': '1 saved address',
      'address.saved.other': '{count} saved addresses',
      'review.savedForStore':
          'Thanks for rating {store}. Your feedback is now saved to this order-linked review flow.',
      'review.savedWithStars': 'Thanks for the {rating}-star rating.',
      'review.pendingForStore':
          'Your {store} order is not marked as delivered yet, so reviews stay locked until delivery is confirmed.',
    },
    'ko': {
      'language': '언어',
      'nav.home': '홈',
      'nav.search': '검색',
      'nav.orders': '주문',
      'nav.profile': '프로필',
      'settings.title': '설정',
      'settings.language': '앱 언어',
      'settings.openPageFailed': '지금은 해당 페이지를 열 수 없습니다.',
      'settings.changePhoneTitle': '이 기기에서 전화번호 전환',
      'settings.changePhoneBody':
          '이 작업은 현재 기기에서 로그아웃한 뒤 휴대폰 로그인을 다시 시작하여 다른 번호로 계속할 수 있게 합니다. 이미 생성된 주문은 Deliberry 계정에 남아 있습니다.',
      'settings.changePhoneContinue': '휴대폰 로그인으로 계속',
      'entry.tagline': '음식과 식료품을\n빠르게 문 앞까지 배달합니다.',
      'entry.trust.time': '평균 20분',
      'entry.trust.stores': '500+ 매장',
      'entry.trust.rating': '평점 4.8',
      'entry.startTitle': '오늘 바로 시작하세요',
      'entry.startBody':
          'Zalo, Google, Kakao로 로그인하세요. 휴대폰 인증은 환경에 따라 제한될 수 있으며 게스트로도 계속할 수 있습니다.',
      'entry.getStarted': '시작하기',
      'entry.guest': '게스트로 계속',
      'entry.terms': '계속하면 이용약관 및 개인정보 처리방침에 동의하는 것으로 간주됩니다',
      'auth.welcome': '다시 오신 것을 환영합니다',
      'auth.subtitle': '주문을 추적하고, 즐겨찾기를 저장하고,\n개인화 추천을 받아보세요.',
      'auth.zalo': 'Zalo로 계속',
      'auth.phone': '휴대폰 로그인',
      'auth.or': '또는',
      'auth.google': 'Google로 계속',
      'auth.kakao': 'Kakao로 계속',
      'auth.justBrowsing': '둘러보는 중인가요? ',
      'auth.providerHint':
          '소셜 로그인을 사용하려면 해당 Supabase 제공자가 활성화되어 있어야 합니다. 휴대폰 로그인은 환경에 따라 달라지며 Supabase 전화 제공자가 활성화되기 전까지 사용할 수 없을 수 있습니다.',
      'auth.terms': '계속하면 이용약관 및 개인정보 처리방침에 동의하는 것으로 간주됩니다',
      'auth.providerUnavailable': '{provider} 로그인은 현재 사용할 수 없습니다.',
      'auth.providerError': '{provider} 로그인 오류: {error}',
      'cart.title': '장바구니',
      'cart.clear': '비우기',
      'cart.empty': '장바구니가 비어 있습니다',
      'cart.refreshed': '장바구니가 새로고침되었습니다',
      'cart.emptySubtitle': '레스토랑에서 메뉴를 담아 시작하세요',
      'cart.browse': '레스토랑 둘러보기',
      'cart.selectedStore': '선택한 매장',
      'cart.menuUnavailable': '메뉴 이용 불가',
      'cart.checkout': '체크아웃으로 이동',
      'cart.subtotal': '소계',
      'cart.deliveryFee': '배달비',
      'cart.serviceFee': '서비스 수수료',
      'cart.total': '합계',
      'cart.promo': '프로모션',
      'cart.apply': '적용',
      'cart.addMore': '더 담기',
      'checkout.minimumOrderNotice':
          '최소 주문 금액은 {minimum}입니다. 계속하려면 {shortfall} 더 담아주세요.',
      'profile.customerWithPhone': '고객 {phone}',
      'profile.signedInWith': '이 기기에서 {account}(으)로 로그인됨',
      'profile.savedAccount': '저장된 계정',
      'profile.displayNameFallback': '고객',
      'profile.nameSaved': '현재 세션에 프로필이 업데이트되었습니다',
      'profile.editTitle': '프로필 수정',
      'profile.displayNameLabel': '표시 이름',
      'profile.displayNameHint': 'Deliberry에서 어떻게 불러드릴까요?',
      'profile.save': '프로필 저장',
      'profile.saveFailed': '지금은 프로필을 저장할 수 없습니다.',
      'profile.offersTitle': '프로모션 및 혜택',
      'profile.offersSubtitle': '현재 고객에게 노출되는 혜택과 이 기기 세션에 연결된 프로모션 상태입니다.',
      'profile.offersApplied': '체크아웃에 적용됨',
      'profile.offersAvailable': '현재 사용 가능',
      'profile.offersEmpty': '현재 활성 혜택이 없습니다.',
      'profile.favoriteStore.one': '즐겨찾기 매장 1곳',
      'profile.favoriteStore.other': '즐겨찾기 매장 {count}곳',
      'search.noResultsFor': '"{query}"에 대한 결과가 없습니다',
      'search.tryFilters': '필터 또는 검색어를 변경해보세요',
      'search.tryDifferent': '다른 검색어를 입력하거나 카테고리를 둘러보세요',
      'search.result.one': '결과 1개',
      'search.result.other': '결과 {count}개',
      'search.filter.one': '필터 1개',
      'search.filter.other': '필터 {count}개',
      'settings.unavailable': '{label}은(는) 아직 사용할 수 없습니다.',
      'notification.summary': '읽지 않음 {unread}건 · 전체 {total}건',
      'notification.unread.one': '읽지 않은 알림 1건',
      'notification.unread.other': '읽지 않은 알림 {count}건',
      'notification.heroSubtitle':
          '이 알림함은 현재 세션과 연결되어 있습니다. 여기서 읽음 처리하면 계정 화면에도 같은 상태가 반영됩니다.',
      'notification.emptySubtitle': '모든 알림을 확인했습니다. 새로운 소식이 생기면 알려드릴게요.',
      'notification.sessionInbox': '세션 알림함',
      'notification.sessionReadState': '세션 읽음 상태',
      'store.favoriteAdded': '{store} 매장이 즐겨찾기에 저장되었습니다',
      'store.favoriteRemoved': '{store} 매장이 즐겨찾기에서 제거되었습니다',
      'groupOrder.localParticipant.one': '로컬 참가자 1명',
      'groupOrder.localParticipant.other': '로컬 참가자 {count}명',
      'settings.resetAccountTitle': '이 기기에서 계정 제거',
      'settings.resetAccountBody':
          '이 작업은 현재 기기에서 로그아웃하고 저장된 장바구니, 주소, 즐겨찾기, 앱 설정을 정리합니다. 이미 생성된 주문은 Deliberry 계정에 남아 있습니다.',
      'settings.resetAccountSuccess': '이 기기에서 현재 고객 세션이 로그아웃되고 정리되었습니다.',
      'home.activeOrder.one': '활성 주문 1건',
      'home.activeOrder.other': '활성 주문 {count}건',
      'home.cartItem.one': '상품 1개',
      'home.cartItem.other': '상품 {count}개',
      'home.deliveryNow': '지금 배달',
      'home.browseFirst': '먼저 매장을 둘러보세요',
      'home.checkoutReady': '준비되면 체크아웃에서 로그인하세요.',
      'home.trackStatus': '탭해서 배달 상태를 확인하세요.',
      'home.manageAddress': '탭해서 배달 주소를 관리하세요.',
      'home.noAddressYet': '아직 주소가 없습니다',
      'home.searchHint': '음식, 레스토랑, 식료품 검색',
      'home.fastDelivery': '빠른 배달',
      'home.freeDelivery': '무료 배달',
      'home.deliveryFeeLabel': '{amount} 요금',
      'Popular': '인기 메뉴',
      'Browse restaurants': '매장 둘러보기',
      'Pending payment': '결제 대기 중',
      'VNPAY test': 'VNPAY 테스트',
      'Add address': '주소 추가',
      'Tap to add a delivery address': '탭해서 배달 주소를 추가하세요',
      'Browse by category': '카테고리별로 둘러보기',
      'Popular near you': '내 주변 인기 매장',
      'My Addresses': '내 주소',
      'Manage your saved delivery addresses': '저장된 배달 주소 관리',
      'Addresses': '주소',
      'Address required before home': '홈 진입 전 주소 필요',
      'Account-synced when signed in': '로그인 시 계정과 동기화',
      'No map or geocoding': '지도/지오코딩 없음',
      'No saved addresses': '저장된 주소가 없습니다',
      'Add New Address': '새 주소 추가',
      'Edit Address': '주소 수정',
      'Delete address': '주소 삭제',
      'Remove saved address?': '저장된 주소를 삭제할까요?',
      'Remove this address from your saved addresses?':
          '이 주소를 저장된 주소 목록에서 제거합니다.',
      'We could not update the default address. Try again.':
          '기본 주소를 변경할 수 없습니다. 다시 시도해 주세요.',
      'We could not remove that address. Try again.':
          '해당 주소를 삭제할 수 없습니다. 다시 시도해 주세요.',
      'Default': '기본',
      'Edit': '수정',
      'Set as default': '기본 주소로 설정',
      'Delete': '삭제',
      'Label and street address are required.': '라벨과 도로명 주소는 필수입니다.',
      'We could not save that address. Try again.':
          '주소를 저장할 수 없습니다. 다시 시도해 주세요.',
      'Label (Home, Work...)': '라벨 (집, 회사 등)',
      'Street address': '도로명 주소',
      'Apt, floor, notes': '호수, 층수, 메모',
      'Save Address': '주소 저장',
      'Signed-in addresses sync with your customer account so they stay available after refresh and on future visits.':
          '로그인한 주소는 고객 계정과 동기화되어 새로고침 후나 다음 방문에도 계속 사용할 수 있습니다.',
      'Add an address to start using this account area for checkout and delivery.':
          '체크아웃과 배달에 이 계정 영역을 사용하려면 주소를 추가하세요.',
      'address.saved.one': '저장된 주소 1개',
      'address.saved.other': '저장된 주소 {count}개',
      'review.savedForStore':
          '{store}에 대한 평가를 남겨주셔서 감사합니다. 피드백은 이제 이 주문 연결 리뷰 흐름에 저장되었습니다.',
      'review.savedWithStars': '{rating}점 평가를 남겨주셔서 감사합니다.',
      'review.pendingForStore':
          '{store} 주문은 아직 배달 완료로 표시되지 않아, 배달이 확인될 때까지 리뷰가 잠겨 있습니다.',
    },
    'vi': {
      'language': 'Ngôn ngữ',
      'nav.home': 'Trang chủ',
      'nav.search': 'Tìm kiếm',
      'nav.orders': 'Đơn hàng',
      'nav.profile': 'Hồ sơ',
      'settings.title': 'Cài đặt',
      'settings.language': 'Ngôn ngữ ứng dụng',
      'settings.openPageFailed': 'Hiện chưa thể mở trang đó.',
      'settings.changePhoneTitle': 'Chuyển số điện thoại trên thiết bị này',
      'settings.changePhoneBody':
          'Thao tác này sẽ đăng xuất trên thiết bị này và bắt đầu lại đăng nhập bằng điện thoại để bạn tiếp tục với số khác. Các đơn đã tạo vẫn còn trong tài khoản Deliberry của bạn.',
      'settings.changePhoneContinue': 'Tiếp tục với đăng nhập điện thoại',
      'entry.tagline': 'Đồ ăn và hàng tạp hóa\nđược giao nhanh đến tận cửa.',
      'entry.trust.time': 'TB 20 phút',
      'entry.trust.stores': '500+ cửa hàng',
      'entry.trust.rating': 'Đánh giá 4.8',
      'entry.startTitle': 'Bắt đầu ngay hôm nay',
      'entry.startBody':
          'Đăng nhập bằng Zalo, Google hoặc Kakao. Bạn cũng có thể tiếp tục với tư cách khách khi xác minh điện thoại phụ thuộc môi trường.',
      'entry.getStarted': 'Bắt đầu',
      'entry.guest': 'Tiếp tục với tư cách khách',
      'entry.terms':
          'Khi tiếp tục, bạn đồng ý với Điều khoản và Chính sách quyền riêng tư',
      'auth.welcome': 'Chào mừng trở lại',
      'auth.subtitle':
          'Đăng nhập để theo dõi đơn hàng, lưu mục yêu thích\nvà nhận đề xuất cá nhân hóa.',
      'auth.zalo': 'Tiếp tục với Zalo',
      'auth.phone': 'Đăng nhập bằng điện thoại',
      'auth.or': 'hoặc',
      'auth.google': 'Tiếp tục với Google',
      'auth.kakao': 'Tiếp tục với Kakao',
      'auth.justBrowsing': 'Chỉ xem trước? ',
      'auth.providerHint':
          'Đăng nhập mạng xã hội yêu cầu bật đúng nhà cung cấp Supabase tương ứng. Đăng nhập bằng điện thoại phụ thuộc vào môi trường và có thể chưa khả dụng cho đến khi nhà cung cấp điện thoại Supabase được bật.',
      'auth.terms':
          'Khi tiếp tục, bạn đồng ý với Điều khoản và Chính sách quyền riêng tư',
      'auth.providerUnavailable':
          'Đăng nhập bằng {provider} hiện chưa khả dụng.',
      'auth.providerError': 'Lỗi đăng nhập {provider}: {error}',
      'cart.title': 'Giỏ hàng',
      'cart.clear': 'Xóa',
      'cart.empty': 'Giỏ hàng của bạn đang trống',
      'cart.refreshed': 'Giỏ hàng đã được làm mới',
      'cart.emptySubtitle': 'Thêm món từ nhà hàng để bắt đầu',
      'cart.browse': 'Xem nhà hàng',
      'cart.selectedStore': 'Cửa hàng đã chọn',
      'cart.menuUnavailable': 'Thực đơn không khả dụng',
      'cart.checkout': 'Tiếp tục thanh toán',
      'cart.subtotal': 'Tạm tính',
      'cart.deliveryFee': 'Phí giao hàng',
      'cart.serviceFee': 'Phí dịch vụ',
      'cart.total': 'Tổng cộng',
      'cart.promo': 'Khuyến mãi',
      'cart.apply': 'Áp dụng',
      'cart.addMore': 'Thêm món',
      'checkout.minimumOrderNotice':
          'Đơn tối thiểu là {minimum}. Hãy thêm {shortfall} nữa để tiếp tục.',
      'profile.customerWithPhone': 'Khách hàng {phone}',
      'profile.signedInWith': 'Đã đăng nhập trên thiết bị này bằng {account}',
      'profile.savedAccount': 'tài khoản đã lưu của bạn',
      'profile.displayNameFallback': 'Khách hàng',
      'profile.nameSaved': 'Hồ sơ đã được cập nhật cho phiên hiện tại',
      'profile.editTitle': 'Sửa hồ sơ',
      'profile.displayNameLabel': 'Tên hiển thị',
      'profile.displayNameHint': 'Deliberry nên gọi bạn là gì?',
      'profile.save': 'Lưu hồ sơ',
      'profile.saveFailed': 'Hiện chưa thể lưu hồ sơ của bạn.',
      'profile.offersTitle': 'Khuyến mãi và ưu đãi',
      'profile.offersSubtitle':
          'Các ưu đãi hiện đang hiển thị cho khách hàng và trạng thái promo gắn với phiên trên thiết bị này.',
      'profile.offersApplied': 'Đã áp dụng khi thanh toán',
      'profile.offersAvailable': 'Đang khả dụng',
      'profile.offersEmpty': 'Hiện chưa có ưu đãi hoạt động.',
      'profile.favoriteStore.one': '1 cửa hàng yêu thích',
      'profile.favoriteStore.other': '{count} cửa hàng yêu thích',
      'search.noResultsFor': 'Không có kết quả cho "{query}"',
      'search.tryFilters': 'Hãy đổi bộ lọc hoặc từ khóa tìm kiếm',
      'search.tryDifferent': 'Hãy thử từ khóa khác hoặc duyệt danh mục',
      'search.result.one': '1 kết quả',
      'search.result.other': '{count} kết quả',
      'search.filter.one': '1 bộ lọc',
      'search.filter.other': '{count} bộ lọc',
      'settings.unavailable': '{label} hiện chưa khả dụng.',
      'notification.summary': '{unread} chưa đọc · {total} tổng cộng',
      'notification.unread.one': '1 thông báo chưa đọc',
      'notification.unread.other': '{count} thông báo chưa đọc',
      'notification.heroSubtitle':
          'Hộp thư này luôn gắn với phiên hiện tại. Đánh dấu đã đọc ở đây và các màn hình tài khoản cũng sẽ phản ánh cùng trạng thái đó.',
      'notification.emptySubtitle':
          'Bạn đã xem hết rồi. Khi có điều gì mới, chúng tôi sẽ báo cho bạn.',
      'notification.sessionInbox': 'Hộp thư phiên',
      'notification.sessionReadState': 'Trạng thái đã đọc của phiên',
      'store.favoriteAdded': 'Đã lưu {store} vào mục yêu thích',
      'store.favoriteRemoved': 'Đã xóa {store} khỏi mục yêu thích',
      'groupOrder.localParticipant.one': '1 người tham gia cục bộ',
      'groupOrder.localParticipant.other': '{count} người tham gia cục bộ',
      'settings.resetAccountTitle': 'Gỡ tài khoản khỏi thiết bị này',
      'settings.resetAccountBody':
          'Thao tác này sẽ đăng xuất và xóa giỏ hàng, địa chỉ, mục yêu thích, cùng tùy chọn ứng dụng đã lưu trên thiết bị này. Các đơn đã tạo vẫn còn trong tài khoản Deliberry của bạn.',
      'settings.resetAccountSuccess':
          'Thiết bị này đã được đăng xuất và dọn sạch cho phiên khách hàng hiện tại.',
      'home.activeOrder.one': '1 đơn đang hoạt động',
      'home.activeOrder.other': '{count} đơn đang hoạt động',
      'home.cartItem.one': '1 món',
      'home.cartItem.other': '{count} món',
      'home.deliveryNow': 'Giao ngay',
      'home.browseFirst': 'Duyệt nhà hàng trước',
      'home.checkoutReady': 'Hãy đăng nhập khi thanh toán nếu bạn đã sẵn sàng.',
      'home.trackStatus': 'Nhấn để theo dõi trạng thái giao hàng.',
      'home.manageAddress': 'Nhấn để quản lý địa chỉ giao hàng của bạn.',
      'home.noAddressYet': 'Chưa có địa chỉ',
      'home.searchHint': 'Tìm món ăn, nhà hàng, hàng tạp hóa',
      'home.fastDelivery': 'Giao nhanh',
      'home.freeDelivery': 'Miễn phí giao hàng',
      'home.deliveryFeeLabel': 'phí {amount}',
      'Popular': 'Phổ biến',
      'Browse restaurants': 'Xem nhà hàng',
      'Pending payment': 'Đang chờ thanh toán',
      'VNPAY test': 'VNPAY thử nghiệm',
      'Add address': 'Thêm địa chỉ',
      'Tap to add a delivery address': 'Nhấn để thêm địa chỉ giao hàng',
      'Browse by category': 'Duyệt theo danh mục',
      'Popular near you': 'Phổ biến gần bạn',
      'My Addresses': 'Địa chỉ của tôi',
      'Manage your saved delivery addresses':
          'Quản lý các địa chỉ giao hàng đã lưu',
      'Addresses': 'Địa chỉ',
      'Address required before home': 'Cần có địa chỉ trước khi vào trang chủ',
      'Account-synced when signed in': 'Đồng bộ với tài khoản khi đăng nhập',
      'No map or geocoding': 'Không có bản đồ hoặc geocoding',
      'No saved addresses': 'Chưa có địa chỉ đã lưu',
      'Add New Address': 'Thêm địa chỉ mới',
      'Edit Address': 'Sửa địa chỉ',
      'Delete address': 'Xóa địa chỉ',
      'Remove saved address?': 'Xóa địa chỉ đã lưu?',
      'Remove this address from your saved addresses?':
          'Gỡ địa chỉ này khỏi danh sách địa chỉ đã lưu của bạn?',
      'We could not update the default address. Try again.':
          'Hiện chưa thể cập nhật địa chỉ mặc định. Hãy thử lại.',
      'We could not remove that address. Try again.':
          'Hiện chưa thể xóa địa chỉ đó. Hãy thử lại.',
      'Default': 'Mặc định',
      'Edit': 'Sửa',
      'Set as default': 'Đặt làm mặc định',
      'Delete': 'Xóa',
      'Label and street address are required.':
          'Nhãn và địa chỉ đường là bắt buộc.',
      'We could not save that address. Try again.':
          'Hiện chưa thể lưu địa chỉ đó. Hãy thử lại.',
      'Label (Home, Work...)': 'Nhãn (Nhà, Công ty...)',
      'Street address': 'Địa chỉ đường',
      'Apt, floor, notes': 'Căn hộ, tầng, ghi chú',
      'Save Address': 'Lưu địa chỉ',
      'Signed-in addresses sync with your customer account so they stay available after refresh and on future visits.':
          'Địa chỉ khi đã đăng nhập sẽ đồng bộ với tài khoản khách hàng để vẫn khả dụng sau khi tải lại và trong các lần truy cập sau.',
      'Add an address to start using this account area for checkout and delivery.':
          'Hãy thêm địa chỉ để bắt đầu dùng khu vực tài khoản này cho thanh toán và giao hàng.',
      'address.saved.one': '1 địa chỉ đã lưu',
      'address.saved.other': '{count} địa chỉ đã lưu',
      'review.savedForStore':
          'Cảm ơn bạn đã đánh giá {store}. Phản hồi của bạn hiện đã được lưu vào luồng đánh giá gắn với đơn hàng này.',
      'review.savedWithStars': 'Cảm ơn bạn vì đánh giá {rating} sao.',
      'review.pendingForStore':
          'Đơn hàng từ {store} của bạn chưa được đánh dấu là đã giao, nên phần đánh giá sẽ bị khóa cho đến khi giao hàng được xác nhận.',
    },
  };

  String text(String key) {
    final languageCode = locale.languageCode;
    return _strings[languageCode]?[key] ?? _strings['en']![key] ?? key;
  }

  String format(String key, Map<String, Object> values) {
    return values.entries.fold(
      text(key),
      (message, entry) =>
          message.replaceAll('{${entry.key}}', '${entry.value}'),
    );
  }

  String customerWithPhone(String phone) {
    return format('profile.customerWithPhone', {'phone': phone});
  }

  String signedInWith(String? account) {
    return format(
      'profile.signedInWith',
      {'account': account ?? text('profile.savedAccount')},
    );
  }

  String favoriteStoreCountLabel(int count) {
    return format(
      count == 1 ? 'profile.favoriteStore.one' : 'profile.favoriteStore.other',
      {'count': count},
    );
  }

  String savedAddressCountLabel(int count) {
    return format(
      count == 1 ? 'address.saved.one' : 'address.saved.other',
      {'count': count},
    );
  }

  String reviewSavedForStore(String store) {
    return format('review.savedForStore', {'store': store});
  }

  String reviewSavedWithStars(int rating) {
    return format('review.savedWithStars', {'rating': rating});
  }

  String reviewPendingForStore(String store) {
    return format('review.pendingForStore', {'store': store});
  }

  String get profileDisplayNameFallback => text('profile.displayNameFallback');
  String get profileNameSaved => text('profile.nameSaved');
  String get profileEditTitle => text('profile.editTitle');
  String get profileDisplayNameLabel => text('profile.displayNameLabel');
  String get profileDisplayNameHint => text('profile.displayNameHint');
  String get profileSave => text('profile.save');
  String get profileSaveFailed => text('profile.saveFailed');
  String get profileOffersTitle => text('profile.offersTitle');
  String get profileOffersSubtitle => text('profile.offersSubtitle');
  String get profileOffersApplied => text('profile.offersApplied');
  String get profileOffersAvailable => text('profile.offersAvailable');
  String get profileOffersEmpty => text('profile.offersEmpty');
  String get settingsChangePhoneTitle => text('settings.changePhoneTitle');
  String get settingsChangePhoneBody => text('settings.changePhoneBody');
  String get settingsChangePhoneContinue =>
      text('settings.changePhoneContinue');

  String noResultsForQuery(String query) {
    return format('search.noResultsFor', {'query': query});
  }

  String searchResultCount(int count) {
    return format(
      count == 1 ? 'search.result.one' : 'search.result.other',
      {'count': count},
    );
  }

  String activeFilterCount(int count) {
    return format(
      count == 1 ? 'search.filter.one' : 'search.filter.other',
      {'count': count},
    );
  }

  String unavailable(String label) {
    return format('settings.unavailable', {'label': raw(label)});
  }

  String notificationSummary({
    required int unread,
    required int total,
  }) {
    return format('notification.summary', {
      'unread': unread,
      'total': total,
    });
  }

  String unreadNotificationCountLabel(int count) {
    return format(
      count == 1 ? 'notification.unread.one' : 'notification.unread.other',
      {'count': count},
    );
  }

  String favoriteAdded(String store) {
    return format('store.favoriteAdded', {'store': store});
  }

  String favoriteRemoved(String store) {
    return format('store.favoriteRemoved', {'store': store});
  }

  String localParticipantCountLabel(int count) {
    return format(
      count == 1
          ? 'groupOrder.localParticipant.one'
          : 'groupOrder.localParticipant.other',
      {'count': count},
    );
  }

  String activeOrderCount(int count) {
    return format(
      count == 1 ? 'home.activeOrder.one' : 'home.activeOrder.other',
      {'count': count},
    );
  }

  String cartItemCount(int count) {
    return format(
      count == 1 ? 'home.cartItem.one' : 'home.cartItem.other',
      {'count': count},
    );
  }

  String minimumOrderNotice({
    required String minimum,
    required String shortfall,
  }) {
    return format('checkout.minimumOrderNotice', {
      'minimum': minimum,
      'shortfall': shortfall,
    });
  }

  String deliveryFeeLabel(String amount) {
    return format('home.deliveryFeeLabel', {'amount': amount});
  }

  String deliveryWindow(String value) {
    if (!value.endsWith(' min')) {
      return raw(value);
    }

    final range = value.substring(0, value.length - 4);
    switch (locale.languageCode) {
      case 'ko':
        return '$range분';
      case 'vi':
        return '$range phút';
      default:
        return value;
    }
  }

  String providerUnavailable(String provider) {
    return format('auth.providerUnavailable', {'provider': provider});
  }

  String providerError(String provider, Object error) {
    return format('auth.providerError', {
      'provider': provider,
      'error': error,
    });
  }

  String authCallbackError(Object error) {
    final message = '$error';
    if (message.contains('redirect_uri') ||
        message.contains('session adoption') ||
        message.contains('restorable authenticated identity') ||
        message.contains('callback completion')) {
      return raw(
        'We could not finish that sign-in callback. Try the same provider again.',
      );
    }
    if (message.contains('access_denied') || message.contains('cancelled')) {
      return raw(
        'That sign-in was cancelled before Deliberry could finish the callback.',
      );
    }
    return message;
  }

  String authPhoneError(
    Object error, {
    bool isResend = false,
  }) {
    final message = '$error';
    if (message.contains('phone_provider_disabled') ||
        message.contains('Unsupported phone provider')) {
      return raw(
        isResend
            ? 'Phone sign-in is not enabled in this environment yet. Use Zalo, Google, or Kakao for now, or enable the Supabase phone provider before requesting a new code.'
            : 'Phone sign-in is not enabled in this environment yet. Use Zalo, Google, or Kakao for now, or enable the Supabase phone provider before trying again.',
      );
    }
    if (message.contains('Customer Supabase runtime config is missing')) {
      return raw('Customer auth runtime is not configured on this build.');
    }
    if (message.contains('Customer phone number is unavailable')) {
      return raw(
        'Start from the phone number screen again before requesting a new code.',
      );
    }
    return message;
  }

  String authOtpError(Object error) {
    final message = '$error';
    if (message.contains('phone_provider_disabled') ||
        message.contains('Unsupported phone provider')) {
      return raw(
        'Phone sign-in is not enabled in this environment yet. Use Zalo, Google, or Kakao for now, or enable the Supabase phone provider before requesting a new code.',
      );
    }
    if (message.contains('invalid') || message.contains('expired')) {
      return raw(
        'That verification code is invalid or expired. Request a new code and try again.',
      );
    }
    if (message.contains('Customer phone number is unavailable')) {
      return raw(
        'Start from the phone number screen again before requesting a new code.',
      );
    }
    if (message.contains('Customer Supabase runtime config is missing')) {
      return raw('Customer auth runtime is not configured on this build.');
    }
    return message;
  }

  String raw(String value) {
    final languageCode = locale.languageCode;
    return _rawStrings[languageCode]?[value] ?? value;
  }

  static const Map<String, Map<String, String>> _rawStrings = {
    'ko': {
      'See all': '전체 보기',
      'Browse by category': '카테고리별 둘러보기',
      'Popular near you': '내 주변 인기 매장',
      'Search food, restaurants, groceries': '음식, 레스토랑, 식료품 검색',
      'Search restaurants, food...': '레스토랑, 음식 검색...',
      'Add address': '주소 추가',
      'Tap to add a delivery address': '배달 주소를 추가하려면 탭하세요',
      'No address yet': '아직 주소가 없습니다',
      'Pizza': '피자',
      'Burgers': '버거',
      'Sushi': '스시',
      'Pho': '포',
      'Com': '껌',
      'Banh Mi': '반미',
      'Bun': '분',
      'Desserts': '디저트',
      'Coffee': '커피',
      'Tra Sua': '밀크티',
      'Seafood': '해산물',
      'Asian': '아시안',
      'Recommended for you': '추천 메뉴',
      'Recent orders': '최근 주문',
      'Notifications': '알림',
      'Addresses': '주소',
      'Checkout': '체크아웃',
      'Orders': '주문',
      'Profile': '프로필',
      'Reviews': '리뷰',
      'Settings': '설정',
      'Your cart is empty': '장바구니가 비어 있습니다',
      'Add items from a restaurant to get started': '레스토랑에서 메뉴를 담아 시작하세요',
      'Browse Restaurants': '레스토랑 둘러보기',
      'Browse restaurants': '매장 둘러보기',
      'Account': '계정',
      'Activity': '활동',
      'Preferences': '환경설정',
      'Support': '지원',
      'Legal': '법률',
      'Edit Profile': '프로필 수정',
      'Change Phone Number': '전화번호 변경',
      'Push Notifications': '푸시 알림',
      'Dark Mode': '다크 모드',
      'Help Center': '도움말 센터',
      'Contact Us': '문의하기',
      'Rate the App': '앱 평가하기',
      'Privacy Policy': '개인정보 처리방침',
      'Terms of Service': '이용약관',
      'App Version': '앱 버전',
      'Delete Account': '계정 삭제',
      'My Addresses': '내 주소',
      'My Reviews': '내 리뷰',
      'Order History': '주문 내역',
      'Promotions & Offers': '프로모션 및 혜택',
      'From orders': '주문에서',
      'Later': '나중에',
      'Reviews stay order-linked': '리뷰는 주문과 연결됩니다',
      'Account area': '계정 영역',
      'Manage your account journey': '계정 여정 관리',
      'Addresses, notifications, and order-linked reviews stay connected from here for this current session.':
          '현재 세션의 주소, 알림, 주문 연결 리뷰를 여기에서 관리할 수 있습니다.',
      'Signed-in session': '로그인 세션',
      'Guest session': '게스트 세션',
      'Demo account': '데모 계정',
      'Signed-in customer': '로그인 고객',
      'Guest customer': '게스트 고객',
      'Customer account': '고객 계정',
      'Guest browsing session': '게스트 탐색 세션',
      'Session details are available after sign-in': '세션 정보는 로그인 후 확인할 수 있습니다',
      'Sign out': '로그아웃',
      'Cancel': '취소',
      'Delivery Address': '배달 주소',
      'Manage': '관리',
      'Payment Method': '결제 수단',
      'Order Summary': '주문 요약',
      'Place Order': '주문하기',
      'Cash': '현금',
      'Pay on delivery': '배달 시 결제',
      'VNPAY Card Test': 'VNPAY 카드 테스트',
      'VNPAY Pay Test': 'VNPAY 페이 테스트',
      'Nothing to check out yet': '아직 체크아웃할 항목이 없습니다',
      'Add items to your cart before placing an order.':
          '주문하기 전에 장바구니에 메뉴를 담아주세요.',
      'Cart updated for live menu': '실시간 메뉴에 맞게 장바구니가 업데이트되었습니다',
      'Instructions': '요청사항',
      'Delivered to': '배달 주소',
      'Payment method': '결제 수단',
      'Payment status': '결제 상태',
      'Leave Review': '리뷰 남기기',
      'Reorder': '다시 주문',
      'Order Details': '주문 상세',
      'Order Status': '주문 상태',
      'View Order Details': '주문 상세 보기',
      'Order Placed': '주문 완료',
      'Confirmed': '주문 확인',
      'Preparing': '준비 중',
      'Ready': '준비 완료',
      'On the Way': '배달 중',
      'Delivered': '배달 완료',
      'Cancelled': '취소됨',
      'Support Review': '고객지원 검토',
      'Track Order Status': '주문 상태 추적',
      'Go to My Orders': '내 주문으로 이동',
      'Back to Home': '홈으로 돌아가기',
      'Items Ordered': '주문한 메뉴',
      'Delivery Information': '배달 정보',
      'Active': '진행 중',
      'History': '내역',
      'No active orders': '진행 중인 주문이 없습니다',
      'Order something delicious and follow its status here.':
          '맛있는 음식을 주문하고 여기에서 상태를 확인하세요.',
      'No past orders': '지난 주문이 없습니다',
      'Your completed orders will appear here.': '완료된 주문이 여기에 표시됩니다.',
      'Delivery Instructions': '배달 요청사항',
      'E.g. Leave at the door, ring the bell...': '예: 문 앞에 두고 벨을 눌러주세요...',
      'Selected store': '선택한 매장',
      'Price Breakdown': '금액 상세',
      'Promo': '프로모션',
      'Placing Order...': '주문 중...',
      'Add delivery address': '배달 주소 추가',
      'Ready to submit': '주문 준비 완료',
      'Default': '기본',
      'No delivery address saved. Tap Manage to add one.':
          '저장된 배달 주소가 없습니다. 관리를 눌러 추가하세요.',
      'VNPAY options open sandbox only. No live charges or payment completion will run.':
          'VNPAY 옵션은 샌드박스만 엽니다. 실제 청구나 결제 완료 처리는 실행되지 않습니다.',
      'This store does not have a live orderable menu right now, so placing an order is temporarily disabled.':
          '이 매장은 현재 실시간 주문 가능한 메뉴가 없어 주문이 일시적으로 비활성화되어 있습니다.',
      'Some items in this cart are no longer available in the live menu. Please return to the store and add items again.':
          '이 장바구니의 일부 메뉴는 실시간 메뉴에서 더 이상 제공되지 않습니다. 매장으로 돌아가 다시 담아주세요.',
      'Sandbox card flow with bank selection on VNPAY':
          'VNPAY에서 은행을 선택하는 샌드박스 카드 흐름',
      'Sandbox QR and mobile banking flow': '샌드박스 QR 및 모바일 뱅킹 흐름',
      'ETA': '예상',
      'items': '개',
      'Pending payment': '결제 대기 중',
      'Payment captured': '결제 승인 완료',
      'Paid': '결제 완료',
      'Payment failed': '결제 실패',
      'Refunded': '환불 완료',
      'Partially refunded': '부분 환불',
      'Digital wallet': '디지털 지갑',
      'Waiting for store confirmation': '매장 확인 대기 중',
      'Store confirmed your order': '매장에서 주문을 확인했습니다',
      'Preparing Your Order': '주문을 준비하고 있습니다',
      'Order is ready for handoff': '주문이 전달 준비되었습니다',
      'Order On the Way': '주문이 배달 중입니다',
      'Order cancelled': '주문이 취소되었습니다',
      'Order needs support review': '주문에 고객지원 검토가 필요합니다',
      'Support review': '고객지원 검토',
      'Manage your saved delivery addresses': '저장된 배달 주소 관리',
      'Signed-in addresses sync with your customer account so they stay available after refresh and on future visits.':
          '로그인한 주소는 고객 계정과 동기화되어 새로고침 후에도 계속 사용할 수 있습니다.',
      'Address required before home': '홈으로 가기 전 주소 필요',
      'Account-synced when signed in': '로그인 시 계정 동기화',
      'No map or geocoding': '지도 또는 지오코딩 없음',
      'No saved addresses': '저장된 주소가 없습니다',
      'Add an address to start using this account area for checkout and delivery.':
          '체크아웃과 배달에 사용할 주소를 추가하세요.',
      'Add New Address': '새 주소 추가',
      'Edit Address': '주소 수정',
      'Delete address': '주소 삭제',
      'Delete': '삭제',
      'Edit': '수정',
      'Set as default': '기본으로 설정',
      'Save Address': '주소 저장',
      'Label (Home, Work...)': '라벨 (집, 회사...)',
      'Street address': '도로명 주소',
      'Apt, floor, notes': '동/호수, 층, 메모',
      'Label and street address are required.': '라벨과 도로명 주소는 필수입니다.',
      'We could not update the default address. Try again.':
          '기본 주소를 업데이트하지 못했습니다. 다시 시도하세요.',
      'We could not remove that address. Try again.':
          '해당 주소를 삭제하지 못했습니다. 다시 시도하세요.',
      'We could not save that address. Try again.': '주소를 저장하지 못했습니다. 다시 시도하세요.',
      'Mark all read': '모두 읽음',
      'Stay on top of account activity': '계정 활동을 놓치지 마세요',
      'This inbox keeps a local session feed for now. You can mark items as read here, but it does not sync with a backend inbox yet.':
          '현재 이 받은편지함은 로컬 세션 기록만 보관합니다. 읽음 처리는 가능하지만 백엔드와 동기화되지는 않습니다.',
      'Local session inbox': '로컬 세션 받은편지함',
      'Nothing new in this inbox': '새 알림이 없습니다',
      'This screen holds local notification history for the current build and remains intentionally backend-free.':
          '이 화면은 현재 빌드의 로컬 알림 기록만 보관하며 백엔드를 사용하지 않습니다.',
      'Local read state only': '로컬 읽음 상태만',
      'No notifications': '알림 없음',
      "You're all caught up. We'll let you know when something new arrives.":
          '모두 확인했습니다. 새 소식이 오면 알려드릴게요.',
      'Group Order': '그룹 주문',
      'Order Together': '함께 주문하기',
      'Preview the invite flow for a shared order. Live multi-person syncing is not supported yet.':
          '공유 주문 초대 흐름을 미리 봅니다. 실시간 다중 사용자 동기화는 아직 지원되지 않습니다.',
      'Create a local room code, copy the invite, and reuse it on this device. Live multi-person syncing is still not supported.':
          '로컬 방 코드를 만들고 초대를 복사한 뒤 이 기기에서 다시 사용할 수 있습니다. 실시간 다중 사용자 동기화는 아직 지원되지 않습니다.',
      'Preview a host invite': '호스트 초대 미리보기',
      'Open Invite Preview': '초대 미리보기 열기',
      'Create Local Room': '로컬 방 만들기',
      'This creates a local preview only. It does not open a live shared room.':
          '로컬 미리보기만 생성하며 실제 공유 방은 열리지 않습니다.',
      'This creates a local room on this device only. You can reopen it and test invite copy flows, but it does not sync across devices.':
          '이 작업은 현재 기기에서만 로컬 방을 만듭니다. 다시 열어서 초대 복사 흐름을 시험할 수 있지만 다른 기기와 동기화되지는 않습니다.',
      'Current local room': '현재 로컬 방',
      'Open room': '방 열기',
      'Join an existing room': '기존 방 참가',
      'Enter room code': '방 코드 입력',
      'Join Room': '방 참가',
      'This code is not active on this device yet. Create the room here first, then join it locally.':
          '이 코드는 아직 이 기기에서 활성화되지 않았습니다. 먼저 여기에서 방을 만든 뒤 로컬로 참가하세요.',
      'How it works': '작동 방식',
      'Open a local invite preview': '로컬 초대 미리보기 열기',
      'Copy the preview code or message': '미리보기 코드 또는 메시지 복사',
      'Return here later for live shared-cart support':
          '실시간 공유 장바구니 지원 시 다시 사용',
      'Reuse the same code on this device to simulate a member join':
          '같은 코드를 이 기기에서 다시 사용해 멤버 참가를 시뮬레이션하세요',
      'Invite Preview': '초대 미리보기',
      'Local Preview Code': '로컬 미리보기 코드',
      'Local Room Code': '로컬 방 코드',
      'Copy Code': '코드 복사',
      'Room code copied.': '방 코드가 복사되었습니다.',
      'Copy Preview Invite': '미리보기 초대 복사',
      'Local invite copied.': '로컬 초대가 복사되었습니다.',
      'Copy Preview Message': '미리보기 메시지 복사',
      'Local room message copied.': '로컬 방 메시지가 복사되었습니다.',
      'Preview Participants': '미리보기 참가자',
      'You': '나',
      'Preview host': '미리보기 호스트',
      'Local member': '로컬 멤버',
      'Live participant updates are not available yet.':
          '실시간 참가자 업데이트는 아직 제공되지 않습니다.',
      'Create or join a local room from the previous screen to populate this participant list.':
          '이 참가자 목록을 채우려면 이전 화면에서 로컬 방을 만들거나 참가하세요.',
      'Search food or restaurants': '음식 또는 레스토랑 검색',
      'Search stores and cuisines': '매장 및 음식 종류 검색',
      'Filters': '필터',
      'Recent searches': '최근 검색',
      'Clear all': '모두 지우기',
      'Recent searches from this session will appear here.':
          '현재 세션의 최근 검색어가 여기에 표시됩니다.',
      'Top categories': '인기 카테고리',
      'Reset': '초기화',
      'Apply Filters': '필터 적용',
      'Sort by': '정렬',
      'Cuisine': '음식 종류',
      'Price range': '가격대',
      'Dietary': '식단',
      'Menu': '메뉴',
      'Cart starts here': '여기서 장바구니 시작',
      'Favorites are not available yet': '즐겨찾기는 아직 사용할 수 없습니다',
      'Save to favorites': '즐겨찾기에 저장',
      'Remove from favorites': '즐겨찾기에서 제거',
      'Saved to favorites': '즐겨찾기에 저장됨',
      'We could not save that favorite right now.': '지금은 이 즐겨찾기를 저장할 수 없습니다.',
      'We could not update favorites right now.': '지금은 즐겨찾기를 업데이트할 수 없습니다.',
      'Copy store name': '매장 이름 복사',
      'Free delivery': '무료 배달',
      'Search all stores': '모든 매장 검색',
      'Menu categories': '메뉴 카테고리',
      'Menu unavailable right now': '현재 메뉴를 사용할 수 없습니다',
      'No items here': '여기에 메뉴가 없습니다',
      'This category has no items right now': '현재 이 카테고리에 메뉴가 없습니다',
      'Limited': '한정',
      'View cart': '장바구니 보기',
      'Add items': '메뉴 담기',
      'Try another store': '다른 매장 시도',
      'Adjust filters': '필터 조정',
      'Recommended': '추천순',
      'Delivery time': '배달 시간',
      'Rating': '평점',
      'Distance': '거리',
      'All': '전체',
      'American': '아메리칸',
      'Japanese': '일식',
      'Burgers & Fries': '버거와 감자튀김',
      'Com Tam': '껌땀',
      'Pho & Bun': '포와 분',
      'Banh Mi & Snacks': '반미와 스낵',
      'Home-style Vietnamese': '가정식 베트남 음식',
      'Milk Tea & Desserts': '밀크티와 디저트',
      '2x1 Tuesdays': '화요일 2개를 1개 가격에',
      'Italian': '이탈리안',
      'Mexican': '멕시칸',
      'Healthy': '건강식',
      'Vegetarian': '채식',
      'Vegan': '비건',
      'Gluten-free': '글루텐 프리',
      'Halal': '할랄',
      'Leave a Review': '리뷰 작성',
      'Edit Review': '리뷰 수정',
      'Review Preview': '리뷰 미리보기',
      'Please select a rating': '평점을 선택하세요',
      'Unable to submit review:': '리뷰를 제출할 수 없습니다:',
      'Leave feedback for one completed order': '완료된 주문 하나에 대한 피드백 남기기',
      'This form stays tied to the current order context so signed-in review history and order detail stay aligned.':
          '이 양식은 현재 주문 컨텍스트에 연결되어 로그인된 리뷰 이력과 주문 상세가 같은 기준을 유지합니다.',
      'Order-linked only': '주문 연결 전용',
      'Live review submission': '실시간 리뷰 제출',
      'How was your experience?': '경험은 어떠셨나요?',
      'Terrible': '매우 나쁨',
      'Bad': '나쁨',
      'Okay': '보통',
      'Good': '좋음',
      'Excellent!': '훌륭해요!',
      'Tap to rate': '탭하여 평가',
      'Tell us more (optional)': '더 알려주세요 (선택)',
      'What did you love? What could be better? Your feedback helps other customers and the restaurant.':
          '무엇이 좋았나요? 개선할 점은 무엇인가요? 피드백은 다른 고객과 레스토랑에 도움이 됩니다.',
      'Quick tags': '빠른 태그',
      'Great food': '맛있는 음식',
      'Good packaging': '좋은 포장',
      'Fresh ingredients': '신선한 재료',
      'Worth the price': '가격 대비 만족',
      'Accurate order': '정확한 주문',
      'Submitting...': '제출 중...',
      'Submit Review': '리뷰 제출',
      'Feedback saved': '피드백 저장됨',
      'Review submitted': '리뷰 제출 완료',
      'Review saved': '리뷰 저장됨',
      'Submitted': '제출됨',
      'Done': '완료',
      'Feedback needs a real order context': '실제 주문 컨텍스트가 필요합니다',
      'This route only supports order-linked review entry, so it stays tied to the right completed order.':
          '이 경로는 주문 연결 리뷰 입력만 지원하므로 올바른 완료 주문에 연결됩니다.',
      'Order detail entry only': '주문 상세에서만 진입',
      'Open a completed order to leave feedback': '완료된 주문을 열어 피드백을 남기세요',
      'This profile entry is only a review preview. Start from an order detail screen so the review stays tied to the right order context.':
          '이 프로필 진입점은 리뷰 미리보기입니다. 리뷰가 올바른 주문 컨텍스트에 연결되도록 주문 상세 화면에서 시작하세요.',
      'Go to Orders': '주문으로 이동',
      'Review available after delivery': '배달 후 리뷰 가능',
      'Delivery pending': '배달 대기 중',
      'Check back after delivery': '배달 후 다시 확인하세요',
      'Once the order is delivered, you can rate and share feedback from this screen.':
          '주문이 배달되면 이 화면에서 평가와 피드백을 남길 수 있습니다.',
      'Order not found': '주문을 찾을 수 없습니다',
      'This order is no longer available in the current session.':
          '이 주문은 현재 세션에서 더 이상 사용할 수 없습니다.',
      'Order details': '주문 상세',
      'Estimated Delivery': '예상 배달',
      'Payment pending in VNPAY sandbox': 'VNPAY 샌드박스 결제 대기 중',
      'This test order was created before payment confirmation. No live charge or payment completion is recorded here.':
          '이 테스트 주문은 결제 확인 전에 생성되었습니다. 실제 청구나 결제 완료 기록은 없습니다.',
      'Order Progress': '주문 진행',
      'Delivery Details': '배달 상세',
      'Order created': '주문 생성됨',
      'Open your orders to view the latest status.': '최신 상태를 보려면 주문 목록을 여세요.',
      'Order submitted': '주문 제출됨',
      'Order placed': '주문이 접수되었습니다',
      'Track the ETA and delivery progress from the status screen.':
          '상태 화면에서 예상 시간과 배달 진행을 추적하세요.',
      'Store': '매장',
      'Items': '상품',
      'Total': '합계',
      'Guest browsing': '게스트 둘러보기',
      'Browse first, sign in later': '먼저 둘러보고 나중에 로그인',
      'Explore stores and menus without creating an account. Checkout will ask you to sign in when it matters.':
          '계정 없이 매장과 메뉴를 둘러보세요. 체크아웃 시 필요한 순간에 로그인을 요청합니다.',
      'No account needed yet': '아직 계정이 필요 없습니다',
      'Browse without\nan account': '계정 없이\n둘러보기',
      'Explore stores and menus right away. Create an account when you\'re ready to order.':
          '매장과 메뉴를 바로 둘러보세요. 주문할 준비가 되면 계정을 만드세요.',
      'Browse as Guest': '게스트로 둘러보기',
      'Create Account': '계정 만들기',
      'Browse stores & menus': '매장 및 메뉴 둘러보기',
      'Place orders': '주문하기',
      'Save favourites': '즐겨찾기 저장',
      'Track deliveries': '배달 추적',
      'Earn rewards': '리워드 적립',
      'Guest': '게스트',
      'Enter your\nphone number': '전화번호를\n입력하세요',
      'Use phone verification only when this environment has the Supabase phone provider enabled.':
          '이 환경에서 Supabase 전화 인증 제공자가 활성화된 경우에만 전화 인증을 사용하세요.',
      'Enter your number in international format, for example +84 912 345 678.':
          '예: +84 912 345 678 형식으로 국제 전화번호를 입력하세요.',
      'Standard message & data rates may apply.': '일반 문자 및 데이터 요금이 부과될 수 있습니다.',
      'Request Code': '코드 요청',
      'Enter a valid international phone number, for example +84 912 345 678.':
          '예: +84 912 345 678 같은 올바른 국제 전화번호를 입력하세요.',
      'Phone sign-in is not enabled in this environment yet. Use Zalo, Google, or Kakao for now, or enable the Supabase phone provider before trying again.':
          '이 환경에서는 아직 전화 로그인이 활성화되지 않았습니다. 지금은 Zalo, Google 또는 Kakao를 사용하거나 Supabase 전화 제공자를 활성화한 뒤 다시 시도하세요.',
      'Customer auth runtime is not configured on this build.':
          '이 빌드에는 고객 인증 런타임이 설정되어 있지 않습니다.',
      'We could not finish that sign-in callback. Try the same provider again.':
          '해당 로그인 콜백을 완료할 수 없습니다. 같은 제공자로 다시 시도하세요.',
      'That sign-in was cancelled before Deliberry could finish the callback.':
          'Deliberry가 콜백을 마치기 전에 해당 로그인이 취소되었습니다.',
      'Verify your\nphone number': '전화번호를\n인증하세요',
      'Enter the 6-digit verification code sent to ':
          '다음 번호로 전송된 6자리 인증 코드를 입력하세요: ',
      'Resend code': '코드 재전송',
      'Verify': '인증',
      'Wrong number? ': '번호가 잘못되었나요? ',
      'Change it': '변경하기',
      'Phone sign-in is not enabled in this environment yet. Use Zalo, Google, or Kakao for now, or enable the Supabase phone provider before requesting a new code.':
          '이 환경에서는 아직 전화 로그인이 활성화되지 않았습니다. 지금은 Zalo, Google 또는 Kakao를 사용하거나 새 코드를 요청하기 전에 Supabase 전화 제공자를 활성화하세요.',
      'That verification code is invalid or expired. Request a new code and try again.':
          '인증 코드가 유효하지 않거나 만료되었습니다. 새 코드를 요청한 뒤 다시 시도하세요.',
      'Start from the phone number screen again before requesting a new code.':
          '새 코드를 요청하기 전에 전화번호 화면에서 다시 시작하세요.',
      'Delete account': '계정 삭제',
      'This action is permanent. All your data, orders, and addresses will be deleted and cannot be recovered.':
          '이 작업은 되돌릴 수 없습니다. 모든 데이터, 주문, 주소가 삭제되며 복구할 수 없습니다.',
      'Account deletion is not available yet.': '계정 삭제는 아직 사용할 수 없습니다.',
      'Are you sure you want to sign out?': '정말 로그아웃하시겠습니까?',
      'Promo code': '프로모션 코드',
      'Promo applied': '프로모션 적용됨',
      'Sign in to place your order. Your cart will stay here.':
          '주문하려면 로그인하세요. 장바구니는 그대로 유지됩니다.',
      'Unable to place order right now. Please try again.':
          '지금은 주문할 수 없습니다. 다시 시도하세요.',
      'Discover amazing\nlocal restaurants': '멋진 동네\n레스토랑 발견',
      'Browse hundreds of restaurants and stores near you. From local favourites to new discoveries.':
          '주변의 수백 개 레스토랑과 매장을 둘러보세요. 동네 인기 매장부터 새로운 발견까지 함께합니다.',
      'Tell us what\nyou love': '좋아하는 것을\n알려주세요',
      'Set your food preferences and dietary needs so we can show you the best matches every time.':
          '음식 취향과 식단 요구를 설정하면 매번 가장 잘 맞는 추천을 보여드릴 수 있습니다.',
      'Fast delivery\nto your door': '문 앞까지\n빠른 배달',
      'Share your location for accurate delivery times and personalised restaurant suggestions nearby.':
          '정확한 배달 시간과 주변 맞춤 레스토랑 추천을 위해 위치를 공유하세요.',
      'Skip': '건너뛰기',
      'Get Started': '시작하기',
      'Next': '다음',
      'Route Not Found': '경로를 찾을 수 없습니다',
      'Route Redirect Loop': '경로 리다이렉트 반복',
      'Zalo sign-in error:': 'Zalo 로그인 오류:',
      'Zalo login is not available right now.': '현재 Zalo 로그인을 사용할 수 없습니다.',
      'Remove saved address?': '저장된 주소를 삭제할까요?',
      'Remove this address from your saved addresses?':
          '저장된 주소 목록에서 이 주소를 삭제할까요?',
      'Your order is on the way!': '주문이 이동 중입니다!',
      'Com Tam 1989 driver is heading to you. ETA 10 min.':
          'Com Tam 1989 기사님이 이동 중입니다. 예상 10분.',
      'Burger Republic driver is heading to you. ETA 10 min.':
          'Burger Republic 기사님이 이동 중입니다. 예상 10분.',
      'Save ₫50,000 on your next order': '다음 주문에 ₫50,000 할인',
      '20% off your next order': '다음 주문 20% 할인',
      'Use code SAVE50K at checkout. Valid until Sunday.':
          '체크아웃에서 SAVE50K 코드를 사용하세요. 일요일까지 유효합니다.',
      'Use SAVE50K to apply the sample promo code.':
          '샘플 프로모션 코드를 적용하려면 SAVE50K를 사용하세요.',
      'Promo code applied.': '프로모션 코드가 적용되었습니다.',
      'off your order': '주문 할인',
      'Rate your Pho Thi order': 'Pho Thi 주문 평가하기',
      'Rate your Sushi Master order': 'Sushi Master 주문 평가하기',
      'How was your recent order? Leave a review and help others.':
          '최근 주문은 어떠셨나요? 리뷰를 남겨 다른 고객에게 도움을 주세요.',
      'New store near you': '근처 새 매장',
      'Bep Nha Sai Gon just opened 0.5 km from your location!':
          'Bep Nha Sai Gon이 현재 위치에서 0.5km 거리에 새로 열었습니다!',
      'Green Bowl just opened 0.5 km from your location!':
          'Green Bowl이 현재 위치에서 0.5km 거리에 새로 열었습니다!',
      'Weekend Delivery Perk': '주말 배달 혜택',
      'Free Delivery Weekend': '주말 무료 배달',
      'FREE': '무료',
      '30% OFF': '30% 할인',
      '₫50K OFF': '₫50,000 할인',
      'Save ₫50,000 on your first order': '첫 주문에 ₫50,000 할인',
      '20% off first order': '첫 주문 20% 할인',
      'On all orders over ₫150,000': '₫150,000 이상 모든 주문에 적용',
      'Free delivery over ₫150,000': '₫150,000 이상 주문 시 무료 배달',
      'Buy 1 get 1 every Tuesday': '매주 화요일 1+1',
      'New User Welcome': '신규 고객 환영 혜택',
      'New User Special': '신규 고객 특별 혜택',
      'Your first 3 orders': '첫 3회 주문',
      'Office Lunch Deal': '오피스 점심 특가',
      'Lunch Deal': '점심 특가',
      'Mon-Fri, 11am-2pm': '월-금, 오전 11시-오후 2시',
      'No restaurants found': '레스토랑을 찾을 수 없습니다',
      'Try another category or loosen your filters.':
          '다른 카테고리를 선택하거나 필터를 완화해보세요.',
      'No items in this category': '이 카테고리에 메뉴가 없습니다',
      'Try a different category': '다른 카테고리를 시도하세요',
      'This store does not have a live orderable menu yet. Please try another store.':
          '이 매장은 아직 주문 가능한 실시간 메뉴가 없습니다. 다른 매장을 시도하세요.',
    },
    'vi': {
      'See all': 'Xem tất cả',
      'Browse by category': 'Duyệt theo danh mục',
      'Popular near you': 'Phổ biến gần bạn',
      'Search food, restaurants, groceries':
          'Tìm món ăn, nhà hàng, hàng tạp hóa',
      'Search restaurants, food...': 'Tìm nhà hàng, món ăn...',
      'Add address': 'Thêm địa chỉ',
      'Tap to add a delivery address': 'Nhấn để thêm địa chỉ giao hàng',
      'No address yet': 'Chưa có địa chỉ',
      'Pizza': 'Pizza',
      'Burgers': 'Burger',
      'Sushi': 'Sushi',
      'Pho': 'Pho',
      'Com': 'Cơm',
      'Banh Mi': 'Bánh mì',
      'Bun': 'Bún',
      'Desserts': 'Món tráng miệng',
      'Coffee': 'Cà phê',
      'Tra Sua': 'Trà sữa',
      'Seafood': 'Hải sản',
      'Asian': 'Món Á',
      'Recommended for you': 'Gợi ý cho bạn',
      'Recent orders': 'Đơn hàng gần đây',
      'Notifications': 'Thông báo',
      'Addresses': 'Địa chỉ',
      'Checkout': 'Thanh toán',
      'Orders': 'Đơn hàng',
      'Profile': 'Hồ sơ',
      'Reviews': 'Đánh giá',
      'Settings': 'Cài đặt',
      'Your cart is empty': 'Giỏ hàng của bạn đang trống',
      'Add items from a restaurant to get started':
          'Thêm món từ nhà hàng để bắt đầu',
      'Browse Restaurants': 'Xem nhà hàng',
      'Browse restaurants': 'Xem nhà hàng',
      'Account': 'Tài khoản',
      'Activity': 'Hoạt động',
      'Preferences': 'Tùy chọn',
      'Support': 'Hỗ trợ',
      'Legal': 'Pháp lý',
      'Edit Profile': 'Sửa hồ sơ',
      'Change Phone Number': 'Đổi số điện thoại',
      'Push Notifications': 'Thông báo đẩy',
      'Dark Mode': 'Chế độ tối',
      'Help Center': 'Trung tâm trợ giúp',
      'Contact Us': 'Liên hệ',
      'Rate the App': 'Đánh giá ứng dụng',
      'Privacy Policy': 'Chính sách quyền riêng tư',
      'Terms of Service': 'Điều khoản dịch vụ',
      'App Version': 'Phiên bản ứng dụng',
      'Delete Account': 'Xóa tài khoản',
      'My Addresses': 'Địa chỉ của tôi',
      'My Reviews': 'Đánh giá của tôi',
      'Order History': 'Lịch sử đơn hàng',
      'Promotions & Offers': 'Khuyến mãi và ưu đãi',
      'From orders': 'Từ đơn hàng',
      'Later': 'Sau',
      'Reviews stay order-linked': 'Đánh giá luôn gắn với đơn hàng',
      'Account area': 'Khu vực tài khoản',
      'Manage your account journey': 'Quản lý hành trình tài khoản',
      'Addresses, notifications, and order-linked reviews stay connected from here for this current session.':
          'Địa chỉ, thông báo và đánh giá gắn với đơn hàng được quản lý tại đây trong phiên hiện tại.',
      'Signed-in session': 'Phiên đã đăng nhập',
      'Guest session': 'Phiên khách',
      'Demo account': 'Tài khoản demo',
      'Signed-in customer': 'Khách hàng đã đăng nhập',
      'Guest customer': 'Khách hàng khách',
      'Customer account': 'Tài khoản khách hàng',
      'Guest browsing session': 'Phiên duyệt khách',
      'Session details are available after sign-in':
          'Chi tiết phiên sẽ có sau khi đăng nhập',
      'Sign out': 'Đăng xuất',
      'Cancel': 'Hủy',
      'Delivery Address': 'Địa chỉ giao hàng',
      'Manage': 'Quản lý',
      'Payment Method': 'Phương thức thanh toán',
      'Order Summary': 'Tóm tắt đơn hàng',
      'Place Order': 'Đặt hàng',
      'Cash': 'Tiền mặt',
      'Pay on delivery': 'Thanh toán khi nhận hàng',
      'VNPAY Card Test': 'Kiểm thử thẻ VNPAY',
      'VNPAY Pay Test': 'Kiểm thử VNPAY Pay',
      'Nothing to check out yet': 'Chưa có gì để thanh toán',
      'Add items to your cart before placing an order.':
          'Thêm món vào giỏ trước khi đặt hàng.',
      'Cart updated for live menu':
          'Giỏ hàng đã cập nhật theo thực đơn hiện tại',
      'Instructions': 'Ghi chú',
      'Delivered to': 'Giao đến',
      'Payment method': 'Phương thức thanh toán',
      'Payment status': 'Trạng thái thanh toán',
      'Leave Review': 'Viết đánh giá',
      'Reorder': 'Đặt lại',
      'Order Details': 'Chi tiết đơn hàng',
      'Order Status': 'Trạng thái đơn hàng',
      'View Order Details': 'Xem chi tiết đơn hàng',
      'Order Placed': 'Đã đặt hàng',
      'Confirmed': 'Đã xác nhận',
      'Preparing': 'Đang chuẩn bị',
      'Ready': 'Sẵn sàng giao',
      'On the Way': 'Đang giao',
      'Delivered': 'Đã giao',
      'Cancelled': 'Đã hủy',
      'Support Review': 'Hỗ trợ xem xét',
      'Track Order Status': 'Theo dõi trạng thái đơn',
      'Go to My Orders': 'Đến đơn hàng của tôi',
      'Back to Home': 'Về trang chủ',
      'Items Ordered': 'Món đã đặt',
      'Delivery Information': 'Thông tin giao hàng',
      'Active': 'Đang xử lý',
      'History': 'Lịch sử',
      'No active orders': 'Không có đơn đang xử lý',
      'Order something delicious and follow its status here.':
          'Đặt món ngon và theo dõi trạng thái tại đây.',
      'No past orders': 'Chưa có đơn đã hoàn tất',
      'Your completed orders will appear here.':
          'Các đơn đã hoàn tất sẽ xuất hiện tại đây.',
      'Delivery Instructions': 'Ghi chú giao hàng',
      'E.g. Leave at the door, ring the bell...':
          'VD: Để trước cửa, bấm chuông...',
      'Selected store': 'Cửa hàng đã chọn',
      'Price Breakdown': 'Chi tiết giá',
      'Promo': 'Khuyến mãi',
      'Placing Order...': 'Đang đặt hàng...',
      'Add delivery address': 'Thêm địa chỉ giao hàng',
      'Ready to submit': 'Sẵn sàng gửi',
      'Default': 'Mặc định',
      'No delivery address saved. Tap Manage to add one.':
          'Chưa lưu địa chỉ giao hàng. Nhấn Quản lý để thêm.',
      'VNPAY options open sandbox only. No live charges or payment completion will run.':
          'Tùy chọn VNPAY chỉ mở sandbox. Không có thanh toán thật hoặc hoàn tất thanh toán.',
      'This store does not have a live orderable menu right now, so placing an order is temporarily disabled.':
          'Cửa hàng này hiện không có thực đơn đặt món trực tiếp, nên việc đặt hàng đang tạm thời bị vô hiệu hóa.',
      'Some items in this cart are no longer available in the live menu. Please return to the store and add items again.':
          'Một số món trong giỏ hàng này không còn có trong thực đơn trực tiếp. Vui lòng quay lại cửa hàng và thêm món lại.',
      'Sandbox card flow with bank selection on VNPAY':
          'Luồng thẻ sandbox với lựa chọn ngân hàng trên VNPAY',
      'Sandbox QR and mobile banking flow':
          'Luồng QR sandbox và ngân hàng di động',
      'ETA': 'Dự kiến',
      'items': 'món',
      'Pending payment': 'Đang chờ thanh toán',
      'Payment captured': 'Đã xác nhận thanh toán',
      'Paid': 'Đã thanh toán',
      'Payment failed': 'Thanh toán thất bại',
      'Refunded': 'Đã hoàn tiền',
      'Partially refunded': 'Hoàn tiền một phần',
      'Digital wallet': 'Ví điện tử',
      'Waiting for store confirmation': 'Đang chờ cửa hàng xác nhận',
      'Store confirmed your order': 'Cửa hàng đã xác nhận đơn của bạn',
      'Preparing Your Order': 'Đơn hàng đang được chuẩn bị',
      'Order is ready for handoff': 'Đơn đã sẵn sàng để bàn giao',
      'Order On the Way': 'Đơn đang trên đường giao',
      'Order cancelled': 'Đơn đã bị hủy',
      'Order needs support review': 'Đơn cần bộ phận hỗ trợ xem xét',
      'Support review': 'Đang hỗ trợ xem xét',
      'Manage your saved delivery addresses':
          'Quản lý địa chỉ giao hàng đã lưu',
      'Signed-in addresses sync with your customer account so they stay available after refresh and on future visits.':
          'Địa chỉ khi đăng nhập sẽ đồng bộ với tài khoản để vẫn có sẵn sau khi làm mới và ở lần truy cập sau.',
      'Address required before home': 'Cần địa chỉ trước khi vào trang chủ',
      'Account-synced when signed in': 'Đồng bộ tài khoản khi đăng nhập',
      'No map or geocoding': 'Không dùng bản đồ hoặc mã hóa địa lý',
      'No saved addresses': 'Chưa có địa chỉ đã lưu',
      'Add an address to start using this account area for checkout and delivery.':
          'Thêm địa chỉ để dùng khu vực tài khoản này cho thanh toán và giao hàng.',
      'Add New Address': 'Thêm địa chỉ mới',
      'Edit Address': 'Sửa địa chỉ',
      'Delete address': 'Xóa địa chỉ',
      'Delete': 'Xóa',
      'Edit': 'Sửa',
      'Set as default': 'Đặt làm mặc định',
      'Save Address': 'Lưu địa chỉ',
      'Label (Home, Work...)': 'Nhãn (Nhà, Công ty...)',
      'Street address': 'Địa chỉ đường',
      'Apt, floor, notes': 'Căn hộ, tầng, ghi chú',
      'Label and street address are required.':
          'Cần nhập nhãn và địa chỉ đường.',
      'We could not update the default address. Try again.':
          'Không thể cập nhật địa chỉ mặc định. Vui lòng thử lại.',
      'We could not remove that address. Try again.':
          'Không thể xóa địa chỉ đó. Vui lòng thử lại.',
      'We could not save that address. Try again.':
          'Không thể lưu địa chỉ đó. Vui lòng thử lại.',
      'Mark all read': 'Đánh dấu tất cả đã đọc',
      'Stay on top of account activity': 'Theo dõi hoạt động tài khoản',
      'This inbox keeps a local session feed for now. You can mark items as read here, but it does not sync with a backend inbox yet.':
          'Hộp thư này hiện chỉ lưu luồng phiên cục bộ. Bạn có thể đánh dấu đã đọc nhưng chưa đồng bộ với backend.',
      'Local session inbox': 'Hộp thư phiên cục bộ',
      'Nothing new in this inbox': 'Không có gì mới trong hộp thư',
      'This screen holds local notification history for the current build and remains intentionally backend-free.':
          'Màn hình này giữ lịch sử thông báo cục bộ cho bản dựng hiện tại và không dùng backend.',
      'Local read state only': 'Chỉ trạng thái đọc cục bộ',
      'No notifications': 'Không có thông báo',
      "You're all caught up. We'll let you know when something new arrives.":
          'Bạn đã xem hết. Chúng tôi sẽ báo khi có nội dung mới.',
      'Group Order': 'Đặt nhóm',
      'Order Together': 'Đặt cùng nhau',
      'Preview the invite flow for a shared order. Live multi-person syncing is not supported yet.':
          'Xem trước luồng mời cho đơn hàng chung. Đồng bộ nhiều người theo thời gian thực chưa được hỗ trợ.',
      'Create a local room code, copy the invite, and reuse it on this device. Live multi-person syncing is still not supported.':
          'Tạo mã phòng cục bộ, sao chép lời mời và dùng lại trên thiết bị này. Đồng bộ nhiều người theo thời gian thực vẫn chưa được hỗ trợ.',
      'Preview a host invite': 'Xem trước lời mời của chủ phòng',
      'Open Invite Preview': 'Mở xem trước lời mời',
      'Create Local Room': 'Tạo phòng cục bộ',
      'This creates a local preview only. It does not open a live shared room.':
          'Thao tác này chỉ tạo bản xem trước cục bộ, không mở phòng chia sẻ thật.',
      'This creates a local room on this device only. You can reopen it and test invite copy flows, but it does not sync across devices.':
          'Thao tác này chỉ tạo phòng cục bộ trên thiết bị này. Bạn có thể mở lại và thử luồng sao chép lời mời, nhưng nó không đồng bộ giữa các thiết bị.',
      'Current local room': 'Phòng cục bộ hiện tại',
      'Open room': 'Mở phòng',
      'Join an existing room': 'Tham gia phòng hiện có',
      'Enter room code': 'Nhập mã phòng',
      'Join Room': 'Tham gia phòng',
      'This code is not active on this device yet. Create the room here first, then join it locally.':
          'Mã này chưa hoạt động trên thiết bị này. Hãy tạo phòng ở đây trước rồi tham gia cục bộ.',
      'How it works': 'Cách hoạt động',
      'Open a local invite preview': 'Mở bản xem trước lời mời cục bộ',
      'Copy the preview code or message': 'Sao chép mã hoặc tin nhắn xem trước',
      'Return here later for live shared-cart support':
          'Quay lại khi có hỗ trợ giỏ hàng chung trực tiếp',
      'Reuse the same code on this device to simulate a member join':
          'Dùng lại cùng mã trên thiết bị này để mô phỏng một thành viên tham gia',
      'Invite Preview': 'Xem trước lời mời',
      'Local Preview Code': 'Mã xem trước cục bộ',
      'Local Room Code': 'Mã phòng cục bộ',
      'Copy Code': 'Sao chép mã',
      'Room code copied.': 'Đã sao chép mã phòng.',
      'Copy Preview Invite': 'Sao chép lời mời xem trước',
      'Local invite copied.': 'Đã sao chép lời mời cục bộ.',
      'Copy Preview Message': 'Sao chép tin nhắn xem trước',
      'Local room message copied.': 'Đã sao chép tin nhắn phòng cục bộ.',
      'Preview Participants': 'Người tham gia xem trước',
      'You': 'Bạn',
      'Preview host': 'Chủ phòng xem trước',
      'Local member': 'Thành viên cục bộ',
      'Live participant updates are not available yet.':
          'Cập nhật người tham gia trực tiếp chưa khả dụng.',
      'Create or join a local room from the previous screen to populate this participant list.':
          'Tạo hoặc tham gia một phòng cục bộ từ màn hình trước để điền danh sách người tham gia này.',
      'Search food or restaurants': 'Tìm món ăn hoặc nhà hàng',
      'Search stores and cuisines': 'Tìm cửa hàng và loại món',
      'Filters': 'Bộ lọc',
      'Recent searches': 'Tìm kiếm gần đây',
      'Clear all': 'Xóa tất cả',
      'Recent searches from this session will appear here.':
          'Tìm kiếm gần đây trong phiên này sẽ xuất hiện tại đây.',
      'Top categories': 'Danh mục nổi bật',
      'Reset': 'Đặt lại',
      'Apply Filters': 'Áp dụng bộ lọc',
      'Sort by': 'Sắp xếp',
      'Cuisine': 'Ẩm thực',
      'Price range': 'Khoảng giá',
      'Dietary': 'Chế độ ăn',
      'Menu': 'Thực đơn',
      'Cart starts here': 'Giỏ hàng bắt đầu tại đây',
      'Favorites are not available yet': 'Mục yêu thích chưa khả dụng',
      'Save to favorites': 'Lưu vào mục yêu thích',
      'Remove from favorites': 'Xóa khỏi mục yêu thích',
      'Saved to favorites': 'Đã lưu vào mục yêu thích',
      'We could not save that favorite right now.':
          'Hiện chưa thể lưu mục yêu thích này.',
      'We could not update favorites right now.':
          'Hiện chưa thể cập nhật mục yêu thích.',
      'Copy store name': 'Sao chép tên cửa hàng',
      'Free delivery': 'Miễn phí giao hàng',
      'Search all stores': 'Tìm tất cả cửa hàng',
      'Menu categories': 'Danh mục thực đơn',
      'Menu unavailable right now': 'Thực đơn hiện không khả dụng',
      'No items here': 'Không có món tại đây',
      'This category has no items right now': 'Danh mục này hiện chưa có món',
      'Limited': 'Giới hạn',
      'View cart': 'Xem giỏ hàng',
      'Add items': 'Thêm món',
      'Try another store': 'Thử cửa hàng khác',
      'Adjust filters': 'Điều chỉnh bộ lọc',
      'Recommended': 'Đề xuất',
      'Delivery time': 'Thời gian giao',
      'Rating': 'Đánh giá',
      'Distance': 'Khoảng cách',
      'All': 'Tất cả',
      'American': 'Món Mỹ',
      'Japanese': 'Món Nhật',
      'Burgers & Fries': 'Burger & khoai tây chiên',
      'Com Tam': 'Cơm tấm',
      'Pho & Bun': 'Phở & bún',
      'Banh Mi & Snacks': 'Bánh mì & đồ ăn nhẹ',
      'Home-style Vietnamese': 'Món Việt kiểu cơm nhà',
      'Milk Tea & Desserts': 'Trà sữa & tráng miệng',
      '2x1 Tuesdays': 'Thứ Ba mua 2 tính 1',
      'Italian': 'Món Ý',
      'Mexican': 'Món Mexico',
      'Healthy': 'Lành mạnh',
      'Vegetarian': 'Chay',
      'Vegan': 'Thuần chay',
      'Gluten-free': 'Không gluten',
      'Halal': 'Halal',
      'Leave a Review': 'Viết đánh giá',
      'Edit Review': 'Chỉnh sửa đánh giá',
      'Review Preview': 'Xem trước đánh giá',
      'Please select a rating': 'Vui lòng chọn điểm đánh giá',
      'Unable to submit review:': 'Không thể gửi đánh giá:',
      'Leave feedback for one completed order':
          'Gửi phản hồi cho một đơn đã hoàn tất',
      'This form stays tied to the current order context so signed-in review history and order detail stay aligned.':
          'Biểu mẫu này luôn gắn với ngữ cảnh đơn hàng hiện tại để lịch sử đánh giá khi đăng nhập và chi tiết đơn hàng luôn khớp với nhau.',
      'Order-linked only': 'Chỉ gắn với đơn hàng',
      'Live review submission': 'Gửi đánh giá trực tiếp',
      'How was your experience?': 'Trải nghiệm của bạn thế nào?',
      'Terrible': 'Rất tệ',
      'Bad': 'Tệ',
      'Okay': 'Ổn',
      'Good': 'Tốt',
      'Excellent!': 'Xuất sắc!',
      'Tap to rate': 'Nhấn để đánh giá',
      'Tell us more (optional)': 'Chia sẻ thêm (tùy chọn)',
      'What did you love? What could be better? Your feedback helps other customers and the restaurant.':
          'Bạn thích điều gì? Có gì cần cải thiện? Phản hồi của bạn giúp khách hàng khác và nhà hàng.',
      'Quick tags': 'Thẻ nhanh',
      'Great food': 'Món ngon',
      'Good packaging': 'Đóng gói tốt',
      'Fresh ingredients': 'Nguyên liệu tươi',
      'Worth the price': 'Đáng giá',
      'Accurate order': 'Đơn chính xác',
      'Submitting...': 'Đang gửi...',
      'Submit Review': 'Gửi đánh giá',
      'Feedback saved': 'Đã lưu phản hồi',
      'Review submitted': 'Đã gửi đánh giá',
      'Review saved': 'Đã lưu đánh giá',
      'Submitted': 'Đã gửi',
      'Done': 'Xong',
      'Feedback needs a real order context':
          'Phản hồi cần ngữ cảnh đơn hàng thật',
      'This route only supports order-linked review entry, so it stays tied to the right completed order.':
          'Đường dẫn này chỉ hỗ trợ đánh giá gắn với đơn hàng, nên luôn liên kết với đúng đơn đã hoàn tất.',
      'Order detail entry only': 'Chỉ vào từ chi tiết đơn',
      'Open a completed order to leave feedback':
          'Mở một đơn đã hoàn tất để gửi phản hồi',
      'This profile entry is only a review preview. Start from an order detail screen so the review stays tied to the right order context.':
          'Mục hồ sơ này chỉ là xem trước đánh giá. Hãy bắt đầu từ màn hình chi tiết đơn để đánh giá gắn đúng ngữ cảnh.',
      'Go to Orders': 'Đến đơn hàng',
      'Review available after delivery': 'Có thể đánh giá sau khi giao hàng',
      'Delivery pending': 'Đang chờ giao',
      'Check back after delivery': 'Kiểm tra lại sau khi giao hàng',
      'Once the order is delivered, you can rate and share feedback from this screen.':
          'Khi đơn được giao, bạn có thể chấm điểm và gửi phản hồi từ màn hình này.',
      'Order not found': 'Không tìm thấy đơn hàng',
      'This order is no longer available in the current session.':
          'Đơn hàng này không còn khả dụng trong phiên hiện tại.',
      'Order details': 'Chi tiết đơn hàng',
      'Estimated Delivery': 'Thời gian giao dự kiến',
      'Payment pending in VNPAY sandbox':
          'Thanh toán đang chờ trong sandbox VNPAY',
      'This test order was created before payment confirmation. No live charge or payment completion is recorded here.':
          'Đơn thử nghiệm này được tạo trước khi xác nhận thanh toán. Không có khoản thu thật hoặc hoàn tất thanh toán nào được ghi nhận.',
      'Order Progress': 'Tiến trình đơn hàng',
      'Delivery Details': 'Chi tiết giao hàng',
      'Order created': 'Đã tạo đơn',
      'Open your orders to view the latest status.':
          'Mở đơn hàng của bạn để xem trạng thái mới nhất.',
      'Order submitted': 'Đã gửi đơn',
      'Order placed': 'Đơn đã được đặt',
      'Track the ETA and delivery progress from the status screen.':
          'Theo dõi ETA và tiến trình giao hàng từ màn hình trạng thái.',
      'Store': 'Cửa hàng',
      'Items': 'Món',
      'Total': 'Tổng',
      'Guest browsing': 'Duyệt với tư cách khách',
      'Browse first, sign in later': 'Duyệt trước, đăng nhập sau',
      'Explore stores and menus without creating an account. Checkout will ask you to sign in when it matters.':
          'Khám phá cửa hàng và thực đơn mà không cần tạo tài khoản. Khi thanh toán, ứng dụng sẽ yêu cầu đăng nhập.',
      'No account needed yet': 'Chưa cần tài khoản',
      'Browse without\nan account': 'Duyệt không cần\ntài khoản',
      'Explore stores and menus right away. Create an account when you\'re ready to order.':
          'Khám phá cửa hàng và thực đơn ngay. Tạo tài khoản khi bạn sẵn sàng đặt hàng.',
      'Browse as Guest': 'Duyệt với tư cách khách',
      'Create Account': 'Tạo tài khoản',
      'Browse stores & menus': 'Duyệt cửa hàng & thực đơn',
      'Place orders': 'Đặt đơn',
      'Save favourites': 'Lưu yêu thích',
      'Track deliveries': 'Theo dõi giao hàng',
      'Earn rewards': 'Tích điểm thưởng',
      'Guest': 'Khách',
      'Enter your\nphone number': 'Nhập số\nđiện thoại',
      'Use phone verification only when this environment has the Supabase phone provider enabled.':
          'Chỉ dùng xác minh điện thoại khi môi trường này đã bật nhà cung cấp điện thoại Supabase.',
      'Enter your number in international format, for example +84 912 345 678.':
          'Nhập số theo định dạng quốc tế, ví dụ +84 912 345 678.',
      'Standard message & data rates may apply.':
          'Có thể áp dụng phí tin nhắn và dữ liệu tiêu chuẩn.',
      'Request Code': 'Yêu cầu mã',
      'Enter a valid international phone number, for example +84 912 345 678.':
          'Nhập số điện thoại quốc tế hợp lệ, ví dụ +84 912 345 678.',
      'Phone sign-in is not enabled in this environment yet. Use Zalo, Google, or Kakao for now, or enable the Supabase phone provider before trying again.':
          'Đăng nhập bằng điện thoại chưa được bật trong môi trường này. Hiện hãy dùng Zalo, Google hoặc Kakao, hoặc bật nhà cung cấp điện thoại Supabase trước khi thử lại.',
      'Customer auth runtime is not configured on this build.':
          'Runtime xác thực khách hàng chưa được cấu hình trong bản dựng này.',
      'We could not finish that sign-in callback. Try the same provider again.':
          'Không thể hoàn tất callback đăng nhập đó. Hãy thử lại với cùng nhà cung cấp.',
      'That sign-in was cancelled before Deliberry could finish the callback.':
          'Lần đăng nhập đó đã bị hủy trước khi Deliberry kịp hoàn tất callback.',
      'Verify your\nphone number': 'Xác minh số\nđiện thoại',
      'Enter the 6-digit verification code sent to ':
          'Nhập mã xác minh 6 chữ số đã gửi đến ',
      'Resend code': 'Gửi lại mã',
      'Verify': 'Xác minh',
      'Wrong number? ': 'Sai số điện thoại? ',
      'Change it': 'Đổi số',
      'Phone sign-in is not enabled in this environment yet. Use Zalo, Google, or Kakao for now, or enable the Supabase phone provider before requesting a new code.':
          'Đăng nhập bằng điện thoại chưa được bật trong môi trường này. Hiện hãy dùng Zalo, Google hoặc Kakao, hoặc bật nhà cung cấp điện thoại Supabase trước khi yêu cầu mã mới.',
      'That verification code is invalid or expired. Request a new code and try again.':
          'Mã xác minh không hợp lệ hoặc đã hết hạn. Hãy yêu cầu mã mới và thử lại.',
      'Start from the phone number screen again before requesting a new code.':
          'Hãy bắt đầu lại từ màn hình số điện thoại trước khi yêu cầu mã mới.',
      'Delete account': 'Xóa tài khoản',
      'This action is permanent. All your data, orders, and addresses will be deleted and cannot be recovered.':
          'Thao tác này là vĩnh viễn. Tất cả dữ liệu, đơn hàng và địa chỉ sẽ bị xóa và không thể khôi phục.',
      'Account deletion is not available yet.': 'Chưa thể xóa tài khoản.',
      'Are you sure you want to sign out?': 'Bạn có chắc muốn đăng xuất?',
      'Promo code': 'Mã khuyến mãi',
      'Promo applied': 'Đã áp dụng khuyến mãi',
      'Sign in to place your order. Your cart will stay here.':
          'Hãy đăng nhập để đặt hàng. Giỏ hàng của bạn sẽ được giữ lại.',
      'Unable to place order right now. Please try again.':
          'Hiện không thể đặt hàng. Vui lòng thử lại.',
      'Discover amazing\nlocal restaurants':
          'Khám phá nhà hàng\nđịa phương tuyệt vời',
      'Browse hundreds of restaurants and stores near you. From local favourites to new discoveries.':
          'Duyệt hàng trăm nhà hàng và cửa hàng gần bạn, từ địa điểm quen thuộc đến những lựa chọn mới.',
      'Tell us what\nyou love': 'Cho chúng tôi biết\nbạn thích gì',
      'Set your food preferences and dietary needs so we can show you the best matches every time.':
          'Thiết lập sở thích ăn uống và nhu cầu dinh dưỡng để chúng tôi gợi ý lựa chọn phù hợp nhất.',
      'Fast delivery\nto your door': 'Giao nhanh\nđến tận cửa',
      'Share your location for accurate delivery times and personalised restaurant suggestions nearby.':
          'Chia sẻ vị trí để có thời gian giao chính xác và gợi ý nhà hàng gần bạn phù hợp hơn.',
      'Skip': 'Bỏ qua',
      'Get Started': 'Bắt đầu',
      'Next': 'Tiếp',
      'Route Not Found': 'Không tìm thấy tuyến',
      'Route Redirect Loop': 'Vòng lặp chuyển hướng',
      'Zalo sign-in error:': 'Lỗi đăng nhập Zalo:',
      'Zalo login is not available right now.':
          'Hiện chưa thể đăng nhập bằng Zalo.',
      'Remove saved address?': 'Xóa địa chỉ đã lưu?',
      'Remove this address from your saved addresses?':
          'Xóa địa chỉ này khỏi danh sách đã lưu?',
      'Your order is on the way!': 'Đơn hàng đang trên đường!',
      'Com Tam 1989 driver is heading to you. ETA 10 min.':
          'Tài xế Com Tam 1989 đang đến. ETA 10 phút.',
      'Burger Republic driver is heading to you. ETA 10 min.':
          'Tài xế Burger Republic đang đến. ETA 10 phút.',
      'Save ₫50,000 on your next order': 'Tiết kiệm ₫50.000 cho đơn tiếp theo',
      '20% off your next order': 'Giảm 20% cho đơn tiếp theo',
      'Use code SAVE50K at checkout. Valid until Sunday.':
          'Dùng mã SAVE50K khi thanh toán. Có hiệu lực đến Chủ nhật.',
      'Use SAVE50K to apply the sample promo code.':
          'Dùng SAVE50K để áp dụng mã khuyến mãi mẫu.',
      'Promo code applied.': 'Đã áp dụng mã khuyến mãi.',
      'off your order': 'giảm cho đơn hàng của bạn',
      'Rate your Pho Thi order': 'Đánh giá đơn Pho Thi',
      'Rate your Sushi Master order': 'Đánh giá đơn Sushi Master',
      'How was your recent order? Leave a review and help others.':
          'Đơn gần đây của bạn thế nào? Hãy để lại đánh giá để giúp người khác.',
      'New store near you': 'Cửa hàng mới gần bạn',
      'Bep Nha Sai Gon just opened 0.5 km from your location!':
          'Bếp Nhà Sài Gòn vừa mở cách vị trí của bạn 0,5 km!',
      'Green Bowl just opened 0.5 km from your location!':
          'Green Bowl vừa mở cách vị trí của bạn 0,5 km!',
      'Weekend Delivery Perk': 'Ưu đãi giao hàng cuối tuần',
      'Free Delivery Weekend': 'Cuối tuần miễn phí giao hàng',
      'FREE': 'MIỄN PHÍ',
      '30% OFF': 'GIẢM 30%',
      '₫50K OFF': 'GIẢM ₫50K',
      'Save ₫50,000 on your first order': 'Tiết kiệm ₫50.000 cho đơn đầu tiên',
      '20% off first order': 'Giảm 20% cho đơn đầu tiên',
      'On all orders over ₫150,000': 'Cho mọi đơn trên ₫150.000',
      'Free delivery over ₫150,000': 'Miễn phí giao hàng cho đơn trên ₫150.000',
      'Buy 1 get 1 every Tuesday': 'Mua 1 tặng 1 mỗi thứ Ba',
      'New User Welcome': 'Chào mừng khách hàng mới',
      'New User Special': 'Ưu đãi người dùng mới',
      'Your first 3 orders': '3 đơn đầu tiên của bạn',
      'Office Lunch Deal': 'Ưu đãi bữa trưa văn phòng',
      'Lunch Deal': 'Ưu đãi bữa trưa',
      'Mon-Fri, 11am-2pm': 'Thứ 2-6, 11:00-14:00',
      'No restaurants found': 'Không tìm thấy nhà hàng',
      'Try another category or loosen your filters.':
          'Thử danh mục khác hoặc nới lỏng bộ lọc.',
      'No items in this category': 'Không có món trong danh mục này',
      'Try a different category': 'Thử danh mục khác',
      'This store does not have a live orderable menu yet. Please try another store.':
          'Cửa hàng này chưa có thực đơn đặt hàng trực tiếp. Vui lòng thử cửa hàng khác.',
    },
  };
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  bool isSupported(Locale locale) =>
      AppLocalizations.supportedLanguageCodes.contains(locale.languageCode);

  @override
  Future<AppLocalizations> load(Locale locale) async =>
      AppLocalizations(locale);

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}

extension AppLocalizationsBuildContextX on BuildContext {
  AppLocalizations get l10n => AppLocalizations.of(this);
}
