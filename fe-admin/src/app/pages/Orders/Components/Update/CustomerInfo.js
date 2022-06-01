import React, { useState, useEffect } from 'react';
import { CustomerInfoWrapper } from '../../styles/OrderDetail';
import { isEmpty } from 'lodash';
import { Skeleton } from 'antd';

export default function CustomerInfo({ order }) {
  const isLoading = isEmpty(order);
  const emptyData = (text = 'Hiện chưa có') => (
    <span className="value-empty">{text}</span>
  );

  function getShippingAddress(shipping_address, separator = ', ') {
    return (
      shipping_address &&
      shipping_address.address1 +
        separator +
        shipping_address.address5 +
        separator +
        shipping_address.address4 +
        separator +
        shipping_address.address3 +
        separator
    );
  }

  if (isLoading) {
    return (
      <CustomerInfoWrapper loading className="box-df">
        <Skeleton active paragraph={{ rows: 12 }} />
      </CustomerInfoWrapper>
    );
  }

  return (
    <CustomerInfoWrapper className="box-df">
      <div className="customer-info__top">
        <div className="customer-top__title section-title">Khách hàng</div>
        <div className="customer-top__name">{order.customer_full_name}</div>
      </div>
      <div className="customer-info__center">
        {/* <div className="customer-center__item center-item__one">
          <div>
            <div>Lượt đăng hàng</div>
            <div>{emptyData}</div>
          </div>
          <div>
            <div>Tiền tích lũy</div>
            <div>{emptyData}</div>
          </div>
        </div> */}
        <div className="customer-center__item center-item__two">
          <div>
            <div>Email</div>
            <div className="customer-mail__value">
              {order.customer_email || emptyData('Không có email')}
            </div>
          </div>
          <div>
            <div>Điện thoại</div>
            <div>
              {order.shipping_address.phone ||
                order.customer_phone ||
                emptyData('Không có SĐT')}
            </div>
          </div>
        </div>
      </div>
      <div className="customer-info__bottom">
        <div className="customer-bottom__title section-title">Giao hàng</div>
        <div className="customer-bottom__content">
          <div className="bottom-content__item">
            <div>Địa chỉ</div>
            <div>{getShippingAddress(order.shipping_address)}</div>
          </div>
          <div className="bottom-content__item">
            <div>Ghi chú</div>
            <div>{order.note || emptyData('Không có ghi chú')}</div>
          </div>
        </div>
      </div>
    </CustomerInfoWrapper>
  );
}
