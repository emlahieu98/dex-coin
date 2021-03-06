import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useOrdersSlice } from '../../slice';
import { selectDetail, selectShowEmptyPage } from '../../slice/selectors';

import { Row, Col, Form as F, Space } from 'antd';

import { Button, PageWrapper, EmptyPage } from 'app/components';
import Confirm from 'app/components/Modal/Confirm';
import { globalActions } from 'app/pages/AppPrivate/slice';

import styled from 'styled-components/macro';
import { CustomTitle, CustomStyle } from 'styles/commons';
import { PageWrapperDefault } from '../../styles/OrderDetail';

import GeneralStatistic from '../../Components/Update/GeneralStatistic';
import ListOrderItem from '../../Components/Update/ListOrderItem';
import PaymentInfo from '../../Components/Update/PaymentInfo';
import CustomerInfo from '../../Components/Update/CustomerInfo';
import StoreInfo from '../../Components/Update/StoreInfo';
import OrderHistory from '../../Components/Update/OrderHistory';

import { formatVND } from 'utils/helpers';
import constants from 'assets/constants';
import request from 'utils/request';
import notification from 'utils/notification';

const Item = F.Item;

//fulfillment action
const confirmAction = constants.SELLER_FULFILLMENT_ACTION.CONFIRM;
const cancelAction = constants.SELLER_FULFILLMENT_ACTION.CANCEL;
const ignoreAction = constants.SELLER_FULFILLMENT_ACTION.IGNORE;

export function UpdateOrder({ match, history }) {
  const [isShowConfirmStatus, setIsShowConfirmStatus] = React.useState(false);
  const [isLoadingConfirm, setLoadingConfirm] = React.useState(false);
  const [actionType, setActionType] = React.useState();
  const [orderConfirm, setOrderConfirm] = React.useState({});

  const { id } = useParams();
  const dispatch = useDispatch();
  const { actions } = useOrdersSlice();
  const order = useSelector(selectDetail);
  const isEmptyPage = useSelector(selectShowEmptyPage);

  useEffect(() => {
    loadOrderData();
    return () => {
      dispatch(actions.getDetailDone([]));
    };
  }, []);

  useEffect(() => {
    return () => {
      if (isEmptyPage) {
        dispatch(actions.clearEmptyPage());
      }
    };
  });

  useEffect(() => {
    const dataBreadcrumb = {
      menus: [
        {
          name: '????n h??ng',
          link: '/orders',
        },
        {
          name: 'Chi ti???t ????n h??ng',
        },
      ],
      fixWidth: true,
      actions: (
        <Item className="m-0" shouldUpdate>
          <div className="d-flex justify-content-between">
            {/* <Space>{getPageAction()}</Space> */}
          </div>
        </Item>
      ),
    };
    const orderCode = order?.code;
    dataBreadcrumb.title = orderCode ? `#${orderCode}` : '';
    dispatch(globalActions.setDataBreadcrumb(dataBreadcrumb));
    return () => {
      dispatch(globalActions.setDataBreadcrumb({}));
    };
  }, [order]);

  const loadOrderData = () => {
    dispatch(actions.getDetail(id));
  };

  const getPageAction = () => {
    //fulfillment status
    const nullStatus = constants.ORDER_FULFILLMENT_STATUS[0].id;
    const pendingStatus = constants.ORDER_FULFILLMENT_STATUS[1].id;
    const confirmedStatus = constants.ORDER_FULFILLMENT_STATUS[2].id;

    if (order?.fulfillment_status === confirmedStatus) {
      return (
        <Button
          context="secondary"
          className="btn-cancel btn-sm"
          color="red"
          onClick={handlPageeAction(cancelAction)}
          width="80px"
        >
          H???y b???
        </Button>
      );
    }

    if (
      // order?.fulfillment_status === nullStatus ||
      order?.fulfillment_status === pendingStatus
    ) {
      return (
        <>
          <Button
            context="secondary"
            color="orange"
            onClick={handlPageeAction(ignoreAction)}
            className="btn-cancel btn-sm p-0"
            width="80px"
          >
            B??? qua
          </Button>
          <Button
            onClick={handlPageeAction(confirmAction)}
            className="btn-sm p-0"
            width="80px"
          >
            X??c nh???n
          </Button>
        </>
      );
    }
  };

  const handlPageeAction = type => () => {
    setActionType(type);
    toggleConfirmModal();
  };

  const toggleConfirmModal = () => {
    if (isShowConfirmStatus) {
      setActionType('');
    } else {
      loadOrderConfirmInfo(order);
    }
    setIsShowConfirmStatus(!isShowConfirmStatus);
  };

  const loadOrderConfirmInfo = async order => {
    setLoadingConfirm(true);
    const response = await request(
      `oms/seller/order/${order.id}/confirm-info`,
      {
        method: 'get',
      },
    );
    if (response.is_success) {
      setOrderConfirm(response.data);
    }
    setLoadingConfirm(false);
  };

  const getConfirmMessage = () => {
    const total_price = formatVND(orderConfirm.total_fulfill_price);
    switch (actionType) {
      case confirmAction:
        return (
          <span>
            B???n c?? ch???c ch???n mu???n tr??? cho Odii&nbsp;
            <SpanPrice>{total_price}</SpanPrice>
            <br></br>????? cung c???p ????n h??ng n??y kh??ng?
          </span>
        );
      case cancelAction:
        return (
          <span>
            B???n c?? ch???c ch???n mu???n h???y b??? ????n h??ng n??y<br></br>v?? Odii s??? ho??n
            tr??? cho b???n <SpanPrice>{total_price}</SpanPrice>&nbsp; kh??ng?
          </span>
        );
      case ignoreAction:
        return <span>B???n c?? ch???c ch???n mu???n b??? qua ????n h??ng n??y kh??ng?</span>;
      default:
        return <span></span>;
    }
  };

  const submitAction = () => {
    request(`oms/admin/orders/${order.id}/change-fulfill-status`, {
      method: 'put',
      data: {
        fulfillment_status: actionType,
      },
    })
      .then(response => {
        if (response.is_success) {
          notification(
            'success',
            `Order #${order?.code} ???? ${
              actionType === confirmAction
                ? '???????c x??c nh???n'
                : actionType === cancelAction
                ? '???????c h???y b???'
                : '???????c b??? qua'
            }!`,
            'Th??nh c??ng!',
          );
          toggleConfirmModal();
          loadOrderData();
        }
      })
      .catch(err => err);
  };

  return isEmptyPage ? (
    <PageWrapper fixWidth>
      <CustomTitle height="calc(100vh - 120px)" className="d-flex flex-column">
        <CustomTitle>????n h??ng</CustomTitle>
        <EmptyPage>
          <CustomStyle className="d-flex justify-content-center">
            <Button className="btn-md" onClick={() => history.push('/orders')}>
              Tr??? v??? danh s??ch
            </Button>
          </CustomStyle>
        </EmptyPage>
      </CustomTitle>
    </PageWrapper>
  ) : (
    <PageWrapperDefault fixWidth>
      <div className="page-detail-title font-sm">T???ng quan ????n h??ng</div>
      <GeneralStatistic order={order}></GeneralStatistic>
      <Row gutter="26">
        <Col span={16}>
          <ListOrderItem order={order}></ListOrderItem>
          <PaymentInfo order={order}></PaymentInfo>
          <OrderHistory orderData={order} orderId={id}></OrderHistory>
        </Col>
        <Col span={8}>
          <CustomerInfo order={order}></CustomerInfo>
          <StoreInfo order={order}></StoreInfo>
        </Col>
      </Row>
      {isShowConfirmStatus && (
        <Confirm
          isLoading={isLoadingConfirm}
          isFullWidthBtn
          isModalVisible={isShowConfirmStatus}
          color={actionType === confirmAction ? 'blue' : 'red'}
          title={`${
            actionType === confirmAction
              ? 'X??c nh???n cung c???p'
              : actionType === cancelAction
              ? 'H???y b??? cung c???p'
              : 'B??? qua'
          } ????n h??ng`}
          data={{
            message: getConfirmMessage(),
          }}
          handleConfirm={submitAction}
          handleCancel={toggleConfirmModal}
        />
      )}
    </PageWrapperDefault>
  );
}

const SpanPrice = styled.span`
  color: orange;
  font-weight: bold;
`;
