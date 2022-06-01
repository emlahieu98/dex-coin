import React from 'react';
import Container from 'app/components/commons/Container';
import { useSelector, useDispatch } from 'react-redux';
import Pagination from 'app/components/Pagination';
import StoreListing from './components/Listing';
import * as Store from './styles';
import { PlusCircleOutlined } from '@ant-design/icons';
import { useStoresSlice } from './slice';
import { useLocation, useHistory } from 'react-router-dom';
import ShopifyIcon from 'assets/images/platform/shopify.svg';
import EtsyIcon from 'assets/images/platform/etsy.svg';
import ShopeeIcon from 'assets/images/platform/shopee.svg';
import LazadaIcon from 'assets/images/platform/lazada.svg';
import { selectPagination } from './slice/selectors';

const initialSearchParams = {
  page: 1,
  page_size: 10,
};

const platforms = [
  { key: 'shopify', name: 'Shopify', icon: ShopifyIcon, isActive: false },
  { key: 'esty', name: 'Esty', icon: EtsyIcon, isActive: false },
  { key: 'shopee', name: 'Shopee', icon: ShopeeIcon, isActive: false },
  { key: 'lazada', name: 'Lazada', icon: LazadaIcon, isActive: true },
  { key: 'tiktok', name: 'Tiktok', icon: null, isActive: false },
];

export function Stores() {
  const [searchParams, setSearchParams] = React.useState(initialSearchParams);
  const [isShowModal, setIsShowModal] = React.useState(false);

  const location = useLocation();
  const history = useHistory();

  const dispatch = useDispatch();
  const { actions } = useStoresSlice();
  const pagination = useSelector(selectPagination);

  React.useEffect(() => {
    if (!location.search) {
      setSearchParams(initialSearchParams);
    } else {
      const searchObject = Object.fromEntries(
        new URLSearchParams(location.search),
      );

      const newSearchParams = {};

      Object.keys(searchObject).forEach(key => {
        newSearchParams[key] = searchObject[key];
      });

      setSearchParams(newSearchParams);
    }
  }, []);

  // React.useEffect(() => {
  //   dispatch(actions.getStoresList(searchParams));
  // }, [searchParams]);

  const handleToggleModal = () => {
    setIsShowModal(!isShowModal);
  };

  const redirectToConnectPlatform = platform => {
    switch (platform.key) {
      case 'lazada':
        window.location.href = `https://api.lazada.com/oauth/authorize?response_type=code&force_auth=true&redirect_uri=https://seller.odii.xyz/connect-sale-channel/lazada&client_id=113691&country=vn`;
        break;
      default:
        break;
    }
  };

  const gotoPage = (data = '') => {
    dispatch(actions.getStoresList(data));
  };

  return (
    <Store.Wrapper>
      <Container>
        <Store.Header.Wrapper>
          <Store.Header.Title>Cửa hàng</Store.Header.Title>

          {/* <Store.Header.Button>
            <Button
              className="btn-sm"
              // context="secondary"
              type="primary"
              icon="far fa-plus"
              onClick={handleToggleModal}
            >
              <PlusCircleOutlined /> &ensp;Kết nối cửa hàng
            </Button>
          </Store.Header.Button> */}
        </Store.Header.Wrapper>

        <Store.Body>
          <StoreListing />
          <Pagination data={{ pagination }} actions={gotoPage} />
        </Store.Body>
      </Container>

      <Store.Modal.Wrapper
        visible={isShowModal}
        onCancel={handleToggleModal}
        closeIcon={<i className="far fa-times" />}
        footer={null}
        width={660}
      >
        <Store.Modal.Title>Thêm cửa hàng</Store.Modal.Title>

        <Store.Modal.Desc>
          Vui lòng chọn và kết nối với cửa hàng kinh doanh của bạn.
        </Store.Modal.Desc>

        <Store.Modal.PlatForm.List>
          {platforms.map(platform => (
            <Store.Modal.PlatForm.Item
              key={platform.key}
              onClick={() => redirectToConnectPlatform(platform)}
            >
              <Store.Modal.PlatForm.Icon active={platform.isActive}>
                <img src={platform.icon} alt="" />
              </Store.Modal.PlatForm.Icon>

              <Store.Modal.PlatForm.Name>
                {platform.name}
              </Store.Modal.PlatForm.Name>
            </Store.Modal.PlatForm.Item>
          ))}
        </Store.Modal.PlatForm.List>
      </Store.Modal.Wrapper>
    </Store.Wrapper>
  );
}
