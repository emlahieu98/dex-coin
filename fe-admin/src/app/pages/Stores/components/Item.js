import React from 'react';
import * as Store from '../styles';
import ShopifyIcon from 'assets/images/platform/shopify.svg';
import EtsyIcon from 'assets/images/platform/etsy.svg';
import ShopeeIcon from 'assets/images/platform/shopee.svg';
import LazadaIcon from 'assets/images/platform/lazada.svg';
import { Image } from 'antd';
import StoreFallback from 'assets/images/icons/store_fallback.png';

const { Item } = Store;

const platforms = [
  { key: 'shopify', icon: ShopifyIcon },
  { key: 'esty', icon: EtsyIcon },
  { key: 'shopee', icon: ShopeeIcon },
  { key: 'lazada', icon: LazadaIcon },
  { key: 'tiktok', icon: null },
];

export default function StoreListing(props) {
  const [img, setImg] = React.useState(props.store.logo);
  const genPlatformIcon = platform => {
    const cureentPlatform = platforms.find(item => item.key === platform);

    return cureentPlatform?.icon || null;
  };
  const handleThumbError = () => {
    setImg(<i className="far fa-store" />);
  };
  return (
    <Item.Wrapper>
      <Item.Thumb>
        {props.store.logo ? (
          <Image
            style={{ width: '20px' }}
            src={props.store.logo}
            fallback={StoreFallback}
          />
        ) : (
          <i className="far fa-store" />
        )}
      </Item.Thumb>
      <Item.Info.Wrapper>
        <Item.Info.Title>
          {props.store.account_info?.name || props.store.name}
        </Item.Info.Title>
        <Item.Info.Email>
          {props.store.account_info?.email || props.store.email}
        </Item.Info.Email>
      </Item.Info.Wrapper>

      {props.store.status === 'active' ? (
        <Item.Status active>Đang kết nối</Item.Status>
      ) : (
        <Item.Status>Ngắt kết nối</Item.Status>
      )}

      <Item.Platform>
        <span>
          <img src={genPlatformIcon(props.store.platform)} alt="" />
          {props.store.platform}
        </span>
      </Item.Platform>

      <Item.Detail.Wrapper>
        <Item.Detail.Item.Wrapper>
          <Item.Detail.Item.Title>Sản phẩm</Item.Detail.Item.Title>
          <Item.Detail.Item.Number>
            {props.store.number_of_product}
          </Item.Detail.Item.Number>
        </Item.Detail.Item.Wrapper>

        <Item.Detail.Item.Wrapper>
          <Item.Detail.Item.Title>Đơn hàng</Item.Detail.Item.Title>
          <Item.Detail.Item.Number>
            {props.store.number_of_order}
          </Item.Detail.Item.Number>
        </Item.Detail.Item.Wrapper>
      </Item.Detail.Wrapper>

      {/* <Item.Action.Wrapper>
        <Item.Action.Dropdown placement="bottomRight" overlay={ActionMenu}>
          <i className="far fa-ellipsis-v" />
        </Item.Action.Dropdown>
      </Item.Action.Wrapper> */}
    </Item.Wrapper>
  );
}

function ActionMenu() {
  return (
    <Item.Action.Menu>
      {/* <Item.Action.MenuItem key="0">
        <i className="far fa-link" />
        Kết nối lại cửa hàng
      </Item.Action.MenuItem> */}
      {/* <Item.Action.MenuItem key="1">
        <i className="far fa-trash-alt" />
        Xóa cửa hàng
      </Item.Action.MenuItem> */}
    </Item.Action.Menu>
  );
}
