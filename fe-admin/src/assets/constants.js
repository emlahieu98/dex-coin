/* eslint-disable import/no-anonymous-default-export */
export default {
  roles: {
    owner: 'owner',
    superAdmin: 'super_admin',

    partnerProduct: 'partner_product',
    partnerOrder: 'partner_order',
    partnerBalance: 'partner_balance',
    partnerMember: 'partner_member',

    adminProduct: 'admin_product',
    adminOrder: 'admin_order',
    adminUser: 'admin_user',
    adminBalance: 'admin_balance',

    adminChiefAccountant: 'admin_chief_accountant',
    adminAccountant: 'admin_accountant',
  },
  COMMON_STATUS: [
    { id: 'active', name: 'Hoạt động', color: 'greenMedium' },
    { id: 'inactive', name: 'Tạm ẩn', color: 'secondary2' },
    { id: 'pending_for_review', name: 'Đang chờ', color: 'primary' },
    {
      id: 'pending_for_review_after_update',
      name: 'Chờ duyệt lại',
      color: 'primary',
    },
    { id: 'pending', name: 'Đang chờ', color: 'primary' },
    { id: 'succeeded', name: 'Thành công', color: 'greenMedium' },
    { id: 'created', name: 'Khởi tạo', color: 'secondary2' },
    { id: 'failed', name: 'Đã hủy', color: 'blackPrimary' },
    { id: 'reject', name: 'Đã từ chối', color: 'blackPrimary' },
    { id: 'cancelled', name: 'Đã hủy', color: 'blackPrimary' },

    { id: 'platform_cancelled', name: 'Đã từ chối', color: 'blackPrimary' },
    { id: 'platform_confirmed', name: 'Đã duyệt', color: 'greenMedium' },

    { id: 'accountant_confirm', name: 'Đang chờ', color: 'primary' },
    { id: 'chief_accountant_confirm', name: 'Đã duyệt', color: 'greenMedium' },

    { id: 'accountant_confirmed', name: 'Đang chờ', color: 'primary' },
    {
      id: 'chief_accountant_confirmed',
      name: 'Đã duyệt',
      color: 'greenMedium',
    },

    { id: 'accountant_rejected', name: 'Đã từ chối', color: 'secondary2' },
    {
      id: 'chief_accountant_rejected',
      name: 'Đã từ chối',
      color: 'secondary2',
    },

    { id: 'seller_cancelled', name: 'Seller đã hủy', color: 'blackPrimary' },
    {
      id: 'seller_confirmed',
      name: 'Seller đã xác nhận',
      color: 'greenMedium',
    },

    { id: 'rejected', name: 'Đã từ chối', color: 'blackPrimary' },
    { id: 'completed', name: 'Đã duyệt', color: 'greenMedium' },
    { id: 'confirm', name: 'Đã duyệt', color: 'greenMedium' },
    { id: 'confirmed', name: 'Đã duyệt', color: 'greenMedium' },
  ],

  USER_STATUS: [
    { id: 'active', name: 'Hoạt động', color: 'greenMedium' },
    { id: 'inactive', name: 'Dừng hoạt động', color: 'secondary2' },
    { id: null, name: 'Không có trạng thái ', color: 'secondary2' },
  ],
  USER_STATUS_SEARCH: [
    { id: 'active', name: 'Hoạt động', color: 'greenMedium' },
    { id: 'inactive', name: 'Dừng hoạt động', color: 'secondary2' },
  ],
  PRODUCT_STATUS: [
    { id: 'active', name: 'Hoạt động', color: 'greenMedium' },
    { id: 'inactive', name: 'Tạm ẩn', color: 'secondary2' },
    { id: 'pending_for_review', name: 'Đang chờ', color: 'primary' },
  ],
  CATEGORY_STATUS: [
    { id: 'active', name: 'Hoạt động', color: 'greenMedium' },
    { id: 'inactive', name: 'Tạm ẩn', color: 'secondary2' },
    { id: 'pending', name: 'Đang chờ', color: 'primary' },
  ],

  TRANSACTION_STATUS_SEARCH: [
    { id: 'created', name: 'Khởi tạo', color: 'secondary2' },
    {
      id: 'pending_all',
      name: 'Đang chờ',
      color: 'primary',
    },
    {
      id: 'chief_accountant_confirmed',
      name: 'Đã duyệt',
      color: 'greenMedium',
    },
    {
      id: 'chief_accountant_rejected',
      name: 'Đã từ chối',
      color: 'blackPrimary',
    },
    { id: 'failed', name: 'Đã hủy', color: 'blackPrimary' },
  ],
  TRANSACTION_STATUS: [
    { id: 'succeeded', name: 'Đã duyệt', color: 'greenMedium' },
    { id: 'created', name: 'Khởi tạo', color: 'secondary2' },
    { id: 'pending', name: 'Đang chờ', color: 'primary' },
    { id: 'failed', name: 'Đã hủy', color: 'blackPrimary' },
    { id: 'cancelled', name: 'Đã hủy', color: 'blackPrimary' },

    { id: 'confirm', name: 'Đã duyệt', color: 'greenMedium' },
    { id: 'confirmed', name: 'Đã duyệt', color: 'greenMedium' },
    { id: 'reject', name: 'Đã từ chối', color: 'secondary2' },
    { id: 'rejected', name: 'Đã từ chối', color: 'secondary2' },

    {
      id: 'accountant_confirmed',
      name: 'Đã duyệt',
      color: 'greenMedium',
    },
    {
      id: 'accountant_confirm',
      name: 'Đã duyệt',
      color: 'greenMedium',
    },

    {
      id: 'chief_accountant_confirmed',
      name: 'Đã duyệt',
      color: 'greenMedium',
    },
    {
      id: 'chief_accountant_confirm',
      name: 'Đã duyệt',
      color: 'greenMedium',
    },

    {
      id: 'accountant_rejected',
      name: 'Đã từ chối',
      color: 'secondary2',
    },
    {
      id: 'chief_accountant_rejected',
      name: 'Đã từ chối',
      color: 'secondary2',
    },
  ],
  ACCOUNTANT_STATUS: [
    { id: 'succeeded', name: 'Đã duyệt', color: 'greenMedium' },
    { id: 'created', name: 'Khởi tạo', color: 'secondary2' },
    { id: 'pending', name: 'Đang chờ', color: 'primary' },
    { id: 'failed', name: 'Đã hủy', color: 'blackPrimary' },
    { id: 'cancelled', name: 'Đã hủy', color: 'blackPrimary' },

    { id: 'confirm', name: 'Đã duyệt', color: 'greenMedium' },
    { id: 'confirmed', name: 'Đã duyệt', color: 'greenMedium' },
    { id: 'reject', name: 'Đã từ chối', color: 'blackPrimary' },
    { id: 'rejected', name: 'Đã từ chối', color: 'blackPrimary' },

    { id: 'accountant_confirm', name: 'Đang duyệt', color: 'primary' },
    { id: 'chief_accountant_confirm', name: 'Đã duyệt', color: 'greenMedium' },
    { id: 'accountant_confirmed', name: 'Đang duyệt', color: 'primary' },
    {
      id: 'chief_accountant_confirmed',
      name: 'Đã duyệt',
      color: 'greenMedium',
    },

    { id: 'accountant_rejected', name: 'Đã từ chối', color: 'blackPrimary' },
    {
      id: 'chief_accountant_rejected',
      name: 'Đã từ chối',
      color: 'secondary2',
    },
  ],
  SUPPLIER_STATUS: [
    { id: 'active', name: 'Hoạt động', color: 'greenMedium' },
    { id: 'inactive', name: 'Tạm ẩn', color: 'secondary2' },
    { id: 'pending_for_review', name: 'Đang chờ', color: 'primary' },
    {
      id: 'pending_for_review_after_update',
      name: 'Chờ duyệt lại',
      color: 'primary',
    },
    { id: 'reject', name: 'Đã từ chối', color: 'blackPrimary' },
  ],
  SUPPLIER_STATUS_FILTER: [
    { id: 'active_all', name: 'Hoạt động', color: 'greenMedium' },
    { id: 'inactive_all', name: 'Tạm ẩn', color: 'secondary2' },
    { id: 'pending_for_review', name: 'Đang chờ', color: 'primary' },
    {
      id: 'pending_for_review_after_update',
      name: 'Chờ duyệt lại',
      color: 'primary',
    },
    { id: 'reject', name: 'Đã từ chối', color: 'blackPrimary' },
  ],
  BANK_STATUS: [
    { id: 'active', name: 'Hoạt động', color: 'greenMedium' },
    { id: 'inactive', name: 'Tạm ẩn', color: 'secondary2' },
  ],
  NOTIFICATION_STATUS: [
    { id: 'success', name: 'Đã gửi', color: 'greenMedium' },
    { id: 'active', name: 'Đã gửi', color: 'greenMedium' },
    { id: 'cancelled', name: 'Đã thu hồi', color: 'secondary2' },
    { id: 'pending_for_send', name: 'Đã lên lịch', color: 'primary' },
    { id: 'inactive', name: 'Đã thu hồi', color: 'secondary2' },
    { id: null, name: 'Lỗi', color: 'secondary2' },
  ],
  NOTIFICATION_STATUS_FILTER: [
    { id: 'success', name: 'Đã gửi', color: 'greenMedium' },
    { id: 'active', name: 'Đã gửi', color: 'greenMedium' },
    { id: 'cancelled', name: 'Đã thu hồi', color: 'secondary2' },
    { id: 'pending_for_send', name: 'Đã lên lịch', color: 'primary' },
    // { id: 'inactive', name: 'Đã thu hồi', color: 'secondary2' },
    { id: null, name: 'Lỗi', color: 'secondary2' },
  ],
  CURRENCY_LIST: [
    {
      id: 'vnd',
      name: 'Việt Nam đồng',
    },
    {
      id: 'usd',
      name: 'Dollar',
    },
  ],
  COUNTRY_LIST: [
    {
      id: 'vn',
      name: 'Việt Nam',
    },
    {
      id: 'usa',
      name: 'Mỹ',
    },
    {
      id: 'rusia',
      name: 'Nga',
    },
    {
      id: 'english',
      name: 'Anh',
    },
  ],
  ORDER_PAYMENT_STATUS: [
    { id: 'PENDING', name: 'Đang chờ', color: 'darkBlue2' },
    { id: 'PARTIAL_PAID', name: 'Thanh toán 1 phần', color: 'gray1' },
    {
      id: 'PAID',
      name: 'Đã thanh toán',
      color: 'greenMedium1',
    },
    { id: 'PARTIAL_REFUNDED', name: 'Hoàn trả 1 phần', color: 'secondary2' },
    { id: 'SELLER_CANCELED', name: 'Seller huỷ', color: 'secondary2' },
    { id: 'REFUNDED', name: 'Đã hoàn tiền', color: 'secondary2' },
    { id: 'VOIDED', name: 'Vô hiệu', color: 'secondary2' },
  ],
  ORDER_FULFILLMENT_STATUS: [
    { id: null, name: 'Đang chờ', color: 'gray1' },
    { id: 'pending', name: 'Đang chờ', color: 'gray1' },
    { id: 'seller_confirmed', name: 'Seller đã xác nhận', color: 'darkBlue2' },
    {
      id: 'seller_ignored',
      name: 'Seller bỏ qua',
      color: 'secondary2',
    },
    {
      id: 'supplier_confirmed',
      name: 'Supplier đã xác nhận',
      color: 'greenMedium1',
    },
    { id: 'supplier_rejected', name: 'Supplier từ chối', color: 'secondary2' },
    { id: 'completed', name: 'Hoàn thành', color: 'gray1' },
    { id: 'cancel', name: 'Bị hủy', color: 'secondary2' },
  ],
  SELLER_FULFILLMENT_ACTION: {
    CONFIRM: 'seller_confirmed',
    CANCEL: 'seller_cancelled',
    IGNORE: 'seller_ignored',
  },
  ACCOUNTANT_PARTNERSHIP_FULFILLMENT_STATUS: [
    { id: true, name: 'Đã thanh toán', color: 'greenMedium' },
    { id: false, name: 'Chờ thanh toán', color: 'primary' },
  ],
};
