import {
  dashboard,
  order,
  product,
  home,
  employee,
  bell,
  wallet,
  category,
  setting,
  // cart,
  // search,
  // download,
  // warehouse,
} from 'assets/images/icons';

import constants from 'assets/constants';
const { roles } = constants;

export const MENU_GROUP = {
  ACCOUNTANT: {
    key: 'accountant',
    title: 'KẾ TOÁN',
  },
};

export const menus = [
  {
    name: 'Dashboard',
    icon: dashboard,
    link: '/dashboard',
  },
  {
    name: 'Sản phẩm',
    icon: product,
    link: '/products',
    requiredRoles: [roles.adminProduct, roles.superAdmin],
  },
  {
    name: 'Cửa hàng đã kết nối',
    icon: home,
    link: '/stores',
    requiredRoles: [roles.adminProduct, roles.superAdmin],
  },
  {
    name: 'Người dùng',
    icon: employee,
    link: '/users',
    requiredRoles: [roles.adminUser, roles.superAdmin],
  },
  {
    name: 'Danh mục',
    icon: category,
    link: '/categories',
    requiredRoles: [roles.adminProduct, roles.superAdmin],
    ignore: true,
  },
  {
    name: 'Design template',
    icon: category,
    link: '/artwork-templates',
    requiredRoles: [roles.adminProduct, roles.superAdmin],
    ignore: true,
  },
  {
    name: 'Ngân hàng',
    icon: home,
    link: '/setting/banks',
    requiredRoles: [roles.adminBalance, roles.superAdmin],
    ignore: true,
  },
  {
    name: 'Admin',
    icon: home,
    link: '/admins',
    requiredRoles: [roles.superAdmin, roles.superAdmin],
    ignore: true,
  },
  {
    name: 'Đơn hàng',
    icon: order,
    link: '/orders',
    requiredRoles: [roles.adminOrder, roles.superAdmin],
  },
  {
    name: 'Nhà cung cấp',
    icon: home,
    link: '/suppliers',
    requiredRoles: [roles.adminUser, roles.superAdmin],
  },
  // {
  //   name: 'Báo cáo',
  //   icon: home,
  //   link: '/incoming3',
  //   requiredRoles: [roles.superAdmin, roles.superAdmin],
  // },
  {
    name: 'Thông báo',
    icon: bell,
    link: '/notification-system',
    requiredRoles: [roles.superAdmin],
    ignore: true,
  },
  {
    name: 'Phân hệ kế toán',
    subMenus: [
      {
        name: 'Giao dịch',
        icon: wallet,
        link: '/transactions',
        requiredRoles: [
          roles.adminBalance,
          roles.adminChiefAccountant,
          roles.adminAccountant,
          roles.superAdmin,
        ],
      },
      {
        name: 'Yêu cầu nạp tiền',
        icon: wallet,
        link: '/accountant/deposit',
        requiredRoles: [
          roles.adminChiefAccountant,
          roles.adminAccountant,
          roles.superAdmin,
        ],
      },
      {
        name: 'Yêu cầu rút tiền',
        icon: wallet,
        link: '/accountant/withdrawal',
        requiredRoles: [
          roles.adminChiefAccountant,
          roles.adminAccountant,
          roles.superAdmin,
        ],
      },
      {
        name: 'Thanh toán đối tác',
        icon: wallet,
        link: '/accountant/partnership',
        requiredRoles: [
          roles.adminChiefAccountant,
          roles.adminAccountant,
          roles.superAdmin,
        ],
      },
      {
        name: 'Tổng quan công nợ',
        icon: dashboard,
        link: '/accountant/debt-overview',
        requiredRoles: [
          roles.adminChiefAccountant,
          roles.adminAccountant,
          roles.superAdmin,
        ],
        group: MENU_GROUP.ACCOUNTANT,
      },
    ],
  },
  {
    name: 'Quản lí hệ thống',
    subMenus: [
      {
        name: 'Quản trị',
        icon: setting,
        link: '/setting',
        requiredRoles: [roles.adminUser, roles.superAdmin],
      },
    ],
  },
];
