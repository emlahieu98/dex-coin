import React from 'react';
import {
  BellOutlined,
  GiftOutlined,
  ApiOutlined,
  PercentageOutlined,
  FileProtectOutlined,
} from '@ant-design/icons';

export const TABPANES_TYPE = {
  all: {
    color: 'blue',
    width: '130px',
    colorLabel: 'primary',
    label: 'Toàn hệ thống',
  },
  supplier: {
    color: 'red',
    colorLabel: 'primary',
    label: 'Supplier',
  },
  seller: {
    color: 'blue',
    width: '140px',
    colorLabel: 'grayBlue',
    label: 'Seller',
  },
  user: {
    color: 'blue',
    width: '140px',
    colorLabel: 'orange',
    label: 'Cá nhân',
  },
};

export const PROPOSAL_FORM = [
  {
    id: 1,
    name: 'Thông báo cơ bản',
    icon: <BellOutlined />,
    // icon: BellOutlined,
    key: 'FORM_BASIC',
  },
  {
    id: 2,
    name: 'Thông báo bảo trì',
    icon: <ApiOutlined />,
    // icon: ApiOutlined,
    key: 'FORM_MAINTAIN',
  },
  {
    id: 3,
    name: 'Thông báo khuyến mại',
    icon: <PercentageOutlined />,
    // icon: PercentageOutlined,
    key: 'FORM_SALE',
  },
  {
    id: 4,
    name: 'Thay đổi chính sách',
    icon: <FileProtectOutlined />,
    key: 'FORM_CHANGE_POLICY',
  },
  {
    id: 5,
    name: 'Chúc mừng sinh nhật',
    icon: <GiftOutlined />,
    // icon: GiftOutlined,
    key: 'FORM_HAPPY_BIRTH_DAY',
  },
];

export const OPTION_TYPE_NOTIFY = [
  {
    id: 1,
    label: 'Toàn hệ thống',
    value: 'all',
  },
  // {
  //   id: 2,
  //   label: 'Dành cho user Admin',
  //   value: 'admin',
  // },
  {
    id: 3,
    label: 'Dành cho user Supplier',
    value: 'supplier',
  },
  {
    id: 4,
    label: 'Dành cho user Seller',
    value: 'seller',
  },
  {
    id: 5,
    label: 'Dành cho user cụ thể',
    value: 'user',
  },
];

export const OPTION_REPEAT = [
  {
    id: 0,
    label: 'Không',
    value: 'none',
  },
  {
    id: 1,
    label: 'Hàng giờ',
    value: 'hourly',
  },
  {
    id: 2,
    label: 'Hàng ngày',
    value: 'dayly',
  },
  {
    id: 3,
    label: 'Hàng tuần',
    value: 'weekly',
  },
  {
    id: 4,
    label: 'Hàng tháng',
    value: 'monthly',
  },
  {
    id: 5,
    label: 'Hàng năm',
    value: 'yearly',
  },
];
