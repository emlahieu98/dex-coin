import React, { useState, useEffect } from 'react';
import { StoreInfoWrapper } from '../../styles/OrderDetail';
import { isEmpty } from 'lodash';

import { Image } from 'app/components';

import ShopifyIcon from 'assets/images/platform/shopify.svg';
import EtsyIcon from 'assets/images/platform/etsy.svg';
import ShopeeIcon from 'assets/images/platform/shopee.svg';
import LazadaIcon from 'assets/images/platform/lazada.svg';

const platforms = [
  { key: 'shopify', name: 'Shopify', icon: ShopifyIcon, isActive: false },
  { key: 'esty', name: 'Esty', icon: EtsyIcon, isActive: false },
  { key: 'shopee', name: 'Shopee', icon: ShopeeIcon, isActive: false },
  { key: 'lazada', name: 'Lazada', icon: LazadaIcon, isActive: true },
  { key: 'tiktok', name: 'Tiktok', icon: null, isActive: false },
];

export default function PaymentInfo({ order }) {
  const isLoading = isEmpty(order);

  function getPlatform(order) {
    const currPlatform =
      order &&
      order.store &&
      platforms.find(platform => platform.key === order.store.platform);
    return currPlatform ? currPlatform : null;
  }

  const currPlauform = getPlatform(order);

  return (
    !isLoading && (
      <StoreInfoWrapper className="box-df">
        <div className="store-info__top">
          <div>
            <span className="section-title">Kênh bán hàng</span>
          </div>
          <div>
            {currPlauform && (
              <img
                alt={currPlauform.name}
                src={currPlauform.icon}
                className="store-platform-icon"
              />
            )}
            <span className="store-platform__name">
              {currPlauform && currPlauform.name}
            </span>
          </div>
        </div>
        <div className="store-info_content">
          {
            <Image
              alt="Store"
              src={order.store && order.store.logo}
              height="20px"
              width="20px"
              className="store-icon"
            />
          }
          <span className="store-name">{order.store && order.store.name}</span>
        </div>
      </StoreInfoWrapper>
    )
  );
}
