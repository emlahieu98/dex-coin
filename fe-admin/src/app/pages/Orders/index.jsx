/**
 *
 * Orders
 *
 */
import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Spin } from 'antd';
import { Image } from 'app/components';
import { isEmpty } from 'lodash';
import {
  Button,
  PageWrapper,
  // Image,
  // Divider,
  Table,
  // Select,
  BoxColor,
  EmptyPage,
  Link,
} from 'app/components';
import constants from 'assets/constants';
import notification from 'utils/notification';
import { formatVND } from 'utils/helpers';
import { CustomTitle, CustomStyle, SectionWrapper } from 'styles/commons';
import {
  selectLoading,
  selectData,
  selectPagination,
  selectListStores,
  selectShowEmptyPage,
} from './slice/selectors';
import { useOrdersSlice } from './slice';
import Confirm from 'app/components/Modal/Confirm';
import styled from 'styled-components/macro';
import { getStores } from 'utils/providers';
import request from 'utils/request';
import { FilterBar } from './Features';
import { formatDate } from 'utils/helpers';

//fulfillment action
const confirmAction = constants.SELLER_FULFILLMENT_ACTION.CONFIRM;
const cancelAction = constants.SELLER_FULFILLMENT_ACTION.CANCEL;
const ignoreAction = constants.SELLER_FULFILLMENT_ACTION.IGNORE;

export function Orders({ history }) {
  const dispatch = useDispatch();
  const { actions } = useOrdersSlice();
  const isLoading = useSelector(selectLoading);
  const pagination = useSelector(selectPagination);
  const data = useSelector(selectData);
  const listStores = useSelector(selectListStores);
  const showEmptyPage = useSelector(selectShowEmptyPage);

  const [isShowConfirmStatus, setIsShowConfirmStatus] = React.useState(false);
  const [isLoadingConfirm, setLoadingConfirm] = React.useState(false);
  const [orderConfirm, setOrderConfirm] = React.useState({});
  const [detail, setDetail] = React.useState({});
  const [actionType, setActionType] = React.useState();

  React.useEffect(() => {
    getStores()
      .then(res => {
        if (!isEmpty(res?.data)) dispatch(actions.setListStores(res?.data));
      })
      .catch(() => null);
    return () => {
      dispatch(actions.resetWhenLeave());
    };
  }, []);

  React.useEffect(() => {
    const delaySecond = 10000;
    let reloadPageInterval;
    let reloadPageTimeout;
    reloadPageTimeout = setTimeout(() => {
      reloadPageInterval = setInterval(() => {
        gotoPage('', true);
      }, delaySecond);
    }, delaySecond);
    return () => {
      clearInterval(reloadPageInterval);
      clearTimeout(reloadPageTimeout);
    };
  }, []);

  const columns = React.useMemo(
    () => [
      {
        title: (
          <div className="custome-header">
            <div className="order-code title-box">????n h??ng</div>
          </div>
        ),
        dataIndex: 'code',
        key: 'code',
        // width: 190,
        className: 'order-code',
        render: (text, record) => (
          <CustomLink to={`/orders/update/${record.id}`}>
            {text || record.id}
          </CustomLink>
        ),
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Ng??y t???o</div>
          </div>
        ),
        dataIndex: 'created_at',
        key: 'created_at',
        width: 180,
        render: text => !!text && formatDate(text),
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Kh??ch h??ng</div>
          </div>
        ),
        dataIndex: 'customer_full_name',
        key: 'customer_full_name',
        width: 170,
        render: text => !!text && text,
      },
      {
        title: (
          <div className="custome-header">
            <div className="th-number title-box">S??? l?????ng</div>
          </div>
        ),
        dataIndex: 'total_product_item',
        key: 'total_product_item',
        width: 100,
        render: text => text && <div class="order-quantity">{text}</div>,
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box text-right">Th??nh ti???n</div>
          </div>
        ),
        className: 'total-price',
        dataIndex: 'total_retail_price',
        key: 'total_retail_price',
        width: 210,
        render: text =>
          text && (
            <CustomStyle color="orange" className="text-right">
              {formatVND(text)}??
            </CustomStyle>
          ),
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">H??nh th???c TT</div>
            {/* <div className="addition"></div> */}
          </div>
        ),
        dataIndex: 'payment_method',
        key: 'payment_method',
        width: 170,
        render: text =>
          text && (
            <CustomStyle color="green">
              {normalizePaymentMethod(text)}
            </CustomStyle>
          ),
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Tr???ng th??i</div>
          </div>
        ),
        dataIndex: 'fulfillment_status',
        key: 'fulfillment_status',
        width: 160,
        render: text => {
          const currentStatus = constants.ORDER_FULFILLMENT_STATUS.find(
            v => v.id === text,
          );
          return (
            isEmpty(currentStatus) || (
              <BoxColor
                className="order-status"
                colorValue={currentStatus?.color}
              >
                {currentStatus?.name}
              </BoxColor>
            )
          );
        },
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">C???a h??ng</div>
          </div>
        ),
        dataIndex: 'store',
        key: 'store',
        // width: 140,
        className: 'order-store',
        render: (store, record) =>
          !isEmpty(store) && (
            <CustomStyle
              className="store-info"
              color="text"
              fontSize={{ xs: 'f2' }}
            >
              <Image
                alt="Baobao Store"
                src={store.logo}
                height="20px"
                width="20px"
                className="store-icon"
              />
              <span className="store-name">{store.name}</span>
              {/* <div className="action-wrapper">{getRowAction(record)}</div> */}
            </CustomStyle>
          ),
      },
    ],
    [],
  );

  const getRowAction = item => {
    //fulfillment status
    const nullStatus = constants.ORDER_FULFILLMENT_STATUS[0].id;
    const pendingStatus = constants.ORDER_FULFILLMENT_STATUS[1].id;
    const confirmedStatus = constants.ORDER_FULFILLMENT_STATUS[2].id;

    if (item.fulfillment_status === confirmedStatus) {
      return (
        <Button
          context="secondary"
          className="btn-cancel btn-sm"
          color="red"
          onClick={handleRowAction(cancelAction, item)}
          width="80px"
        >
          H???y b???
        </Button>
      );
    }

    if (
      // item.fulfillment_status === nullStatus ||
      item.fulfillment_status === pendingStatus
    ) {
      return (
        <div>
          <Button
            context="secondary"
            color="orange"
            onClick={handleRowAction(ignoreAction, item)}
            className="btn-cancel btn-sm p-0"
            width="80px"
          >
            B??? qua
          </Button>
          <Button
            onClick={handleRowAction(confirmAction, item)}
            className="btn-sm p-0"
            width="80px"
          >
            X??c nh???n
          </Button>
        </div>
      );
    }
  };

  const normalizePaymentMethod = payment => {
    return payment.replaceAll('_', ' ');
  };

  const toggleConfirmModal = order => {
    // if (needRefresh === true) gotoPage();
    if (isShowConfirmStatus) {
      setActionType('');
      setDetail({});
    } else {
      loadOrderConfirmInfo(order);
    }
    setIsShowConfirmStatus(!isShowConfirmStatus);
  };

  const loadOrderConfirmInfo = async order => {
    setLoadingConfirm(true);
    const response = await request(`oms/admin/order/${order.id}/confirm-info`, {
      method: 'get',
    });
    if (response.is_success) {
      setOrderConfirm(response.data);
    }
    setLoadingConfirm(false);
  };

  const submitAction = () => {
    request(`oms/admin/orders/${detail.id}/change-fulfill-status`, {
      method: 'put',
      data: {
        fulfillment_status: actionType,
      },
    })
      .then(response => {
        if (response.is_success) {
          notification(
            'success',
            `Order #${detail?.code} ???? ${
              actionType === confirmAction
                ? '???????c x??c nh???n'
                : actionType === cancelAction
                ? '???????c h???y b???'
                : '???????c b??? qua'
            }!`,
            'Th??nh c??ng!',
          );
          toggleConfirmModal();
          dispatch(
            actions.updateLists({
              id: detail.id,
              status: response.data.fulfillment_status,
            }),
          );
        }
      })
      .catch(err => err);
  };

  const handleRowAction = (type, record) => () => {
    setActionType(type);
    setDetail(record);
    toggleConfirmModal(record);
  };

  const goCreate = () => {
    // history.push('orders/uc');
  };

  const gotoPage = (data = '', isReload) => {
    dispatch(actions.getData(isReload ? history.location.search : data));
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

  if (showEmptyPage) {
    return (
      <PageWrapper>
        <CustomTitle
          height="calc(100vh - 120px)"
          className="d-flex flex-column"
        >
          <CustomTitle>????n h??ng</CustomTitle>
          <EmptyPage>
            <CustomStyle className="d-flex justify-content-center">
              {/* <Button
                className="btn-md"
                // width="152px"
                onClick={goCreate}
                context="secondary"
              >
                <img src={fileExcel} alt="" />
                &nbsp;Import ????n h??ng
              </Button>
              <Button className="btn-md" onClick={goCreate}>
                + Th??m ????n h??ng
              </Button> */}
              <Button
                className="btn-md"
                onClick={() => history.push('/products')}
              >
                T??m s???n ph???m ngay
              </Button>
            </CustomStyle>
          </EmptyPage>
        </CustomTitle>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <CustomStyle className="d-flex justify-content-between">
        <CustomTitle>????n h??ng</CustomTitle>
        <Button className="btn-sm" onClick={goCreate}>
          + T???o ????n h??ng
        </Button>
      </CustomStyle>
      <SectionWrapper className="">
        <CustomStyle className="title text-left" my={{ xs: 's5' }}>
          <FilterBar
            isLoading={isLoading}
            gotoPage={gotoPage}
            history={history}
            listStores={listStores}
          />
        </CustomStyle>
        <Spin tip="??ang t???i..." spinning={isLoading}>
          <Row gutter={24}>
            <Col span={24}>
              <TableWrapper>
                <Table
                  className="order-tbl"
                  columns={columns}
                  rowSelection={{}}
                  searchSchema={{
                    keyword: {
                      required: false,
                    },
                    fulfillment_status: {
                      required: false,
                    },
                    status: {
                      required: false,
                    },
                    store_id: {
                      required: false,
                    },
                    from_time: {
                      required: false,
                    },
                    to_time: {
                      required: false,
                    },
                  }}
                  data={{ data, pagination }}
                  scroll={{ x: 1100 }}
                  // rowClassName="pointer"
                  actions={gotoPage}
                  // onRow={record => ({
                  //   onClick: goDetail(record),
                  // })}
                />
              </TableWrapper>
            </Col>
          </Row>
        </Spin>
      </SectionWrapper>
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
    </PageWrapper>
  );
}

const TableWrapper = styled.div`
  table {
    .text-right {
      text-align: right;
    }
    tr {
      position: relative;
      /* display: unset; */

      th:last-child,
      .order-code {
        font-weight: 500;
      }
      .order-quantity,
      .th-number {
        text-align: right;
      }
      .order-status {
        width: unset;
        min-width: 130px;
        text-align: center;
      }
      .total-price {
        font-size: 14px;
        padding-left: 20px !important;
        padding-right: 60px !important;
      }
      .order-store {
        min-width: 150px;
      }
      .store-info {
        display: inline-flex;
        position: relative;
        align-items: center;
        width: 100%;
      }
      .store-icon {
        width: 20px;
        border-radius: 100%;
        object-fit: cover;
        border: 1px solid #e1e1e1;
      }
      .store-name {
        margin-left: 7px;
      }
      .action-wrapper {
        display: none;
        position: absolute;
        padding: 0;
        top: 50%;
        left: 0;
        right: 0;
        transform: translateY(-50%);
        white-space: nowrap;
        word-break: keep-all;
        > div {
          display: inline-flex;
          > button {
            margin-left: 11px;
          }
        }
        .btn-cancel {
          background: #fff;
          &:hover {
            color: #fff;
            background: red;
          }
        }
        button {
          margin: auto;
        }
      }
    }
    tr:hover {
      .action-wrapper {
        display: inline-flex;
      }
    }
    .order-code {
      min-width: 120px;
    }
  }
`;

const CustomLink = styled(Link)`
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #333333;
`;

const SpanPrice = styled.span`
  color: orange;
  font-weight: bold;
`;
