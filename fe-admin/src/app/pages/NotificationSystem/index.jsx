/**
 *
 * Manager Notification System
 *
 */
import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';
import {
  Button,
  PageWrapper,
  Table,
  BoxColor,
  EmptyPage,
  Avatar,
} from 'app/components';
import { Row, Col, Spin, Popover, Divider } from 'antd';
import constants from 'assets/constants';
// import notification from 'utils/notification';
import { CustomTitle, CustomStyle, SectionWrapper } from 'styles/commons';
import {
  selectLoading,
  selectData,
  selectPagination,
  selectListSelected,
  selectShowEmptyPage,
} from './slice/selectors';
import { useNotificationSlice } from './slice';
import styled from 'styled-components/macro';
// import request from 'utils/request';
import { FilterBar } from './Features';
import { formatDate } from 'utils/helpers';
import { StarOutlined, UserOutlined, StarFilled } from '@ant-design/icons';

export function NotificationSystem({ history }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { actions } = useNotificationSlice();
  const isLoading = useSelector(selectLoading);
  const listSelected = useSelector(selectListSelected);
  const pagination = useSelector(selectPagination);
  const data = useSelector(selectData);
  const showEmptyPage = useSelector(selectShowEmptyPage);

  const gotoPage = (data = '', isReload) => {
    dispatch(actions.getData(isReload ? history.location.search : data));
  };

  const rowSelection = {
    onChange: selectedRowKeys => {
      dispatch(actions.setListSelected(selectedRowKeys));
    },
  };

  const infoUser = dataUser => (
    <CustomDivInfoUser>
      <div className="left">
        <CustomAvatar src={dataUser?.avatar?.origin} icon={<UserOutlined />} />
      </div>
      <Divider type="vertical" />
      <div className="right">
        <div className="user-name">
          {dataUser?.full_name ? dataUser?.full_name + ' - ' : ''}
          <span className="user-source">{dataUser?.account_type}</span>
        </div>
        <div className="user-phone">{dataUser?.phone}</div>
        <div className="user-email">{dataUser?.email}</div>
      </div>
    </CustomDivInfoUser>
  );

  const columns = useMemo(
    () => [
      {
        title: '',
        width: 30,
        render: (_, record) =>
          record?.metadata?.important ? (
            <StarFilled style={{ color: '#e5bf6a' }} />
          ) : (
            <StarOutlined />
          ),
      },
      {
        title: 'Loại thông báo',
        dataIndex: 'source',
        key: 'source',
        width: 100,
        render: (text, record) => {
          return (
            <div
              style={{
                color:
                  text === 'all'
                    ? 'red'
                    : text === 'supplier'
                    ? 'green'
                    : text === 'seller'
                    ? 'blue'
                    : '',
              }}
            >
              {t(`notifications.source.${text}`)}
            </div>
          );
        },
      },
      {
        title: 'Tiêu đề',
        dataIndex: 'name',
        key: 'name',
        width: 160,
        render: text => {
          return (
            <>
              {text.slice(0, 1).toUpperCase() +
                text.slice(1, 50) +
                (text.length > 50 ? '...' : '')}
            </>
          );
        },
      },
      {
        title: 'Nội dung thông báo',
        dataIndex: 'content',
        key: 'content',
        width: 200,
        render: text => {
          return (
            <>
              {text.slice(0, 1).toUpperCase() +
                text.slice(1, 40) +
                (text.length > 40 ? '...' : '')}
            </>
          );
        },
      },
      {
        title: 'Đối tượng cụ thể',
        width: 200,
        render: record => {
          return (
            <>
              {!isEmpty(record?.metadata?.user_datas)
                ? record?.metadata?.user_datas?.map((item, index) => {
                    return (
                      <Popover
                        placement="bottomLeft"
                        content={infoUser(item)}
                        trigger="hover"
                      >
                        <CustomAvatar
                          src={item?.avatar?.origin}
                          icon={<UserOutlined />}
                          className={index < 3 ? '' : 'display-none'}
                        />
                      </Popover>
                    );
                  })
                : ''}
              {!isEmpty(record?.metadata?.user_datas) &&
              record?.metadata?.user_datas.length > 3
                ? ' ...'
                : ''}
            </>
          );
        },
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Ngày tạo</div>
          </div>
        ),
        dataIndex: 'created_at',
        key: 'created_at',
        width: 140,
        render: text => (
          <div style={{ fontSize: '14px', color: '#828282' }}>
            {formatDate(text)}
          </div>
        ),
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Trạng thái</div>
          </div>
        ),
        dataIndex: 'status',
        key: 'status',
        width: 100,
        align: 'center',
        render: (text, record) => {
          const currentStatus = constants.NOTIFICATION_STATUS.find(
            v => v.id === text,
          );
          return (
            <>
              {isEmpty(currentStatus) || (
                <BoxColor colorValue={currentStatus?.color}>
                  {currentStatus?.name}
                </BoxColor>
              )}
              <div className="action-wrapper">{getRowAction(record)}</div>
            </>
          );
        },
      },
    ],
    [],
  );

  const getRowAction = record => {
    return (
      <>
        <Button
          color="blue"
          className="btn-sm btn-action"
          onClick={() =>
            history.push(`/notification-system/${record.id}/detail`)
          }
        >
          Chi tiết
        </Button>
      </>
    );
  };

  if (showEmptyPage) {
    return (
      <PageWrapper>
        <CustomTitle
          height="calc(100vh - 120px)"
          className="d-flex flex-column"
        >
          <CustomTitle>Thông báo</CustomTitle>
          <EmptyPage>
            <CustomStyle className="d-flex justify-content-center">
              <Button
                className="btn-md"
                onClick={() => history.push('/products')}
              >
                + Tạo thông báo mới
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
        <CustomTitle>Thông báo</CustomTitle>
        <Button
          className="btn-sm"
          onClick={() => history.push(`/notification-system/create`)}
        >
          + Tạo thông báo mới
        </Button>
      </CustomStyle>
      <CustomSectionWrapper>
        <CustomStyle mb={{ xs: 's5' }}>
          <FilterBar
            isLoading={isLoading}
            gotoPage={gotoPage}
            history={history}
            showAction={!isEmpty(listSelected)}
          />
        </CustomStyle>
        <Spin tip="Đang tải..." spinning={isLoading}>
          <Row gutter={[8, 8]}>
            <Col span={24}>
              <TableWrapper>
                <Table
                  columns={columns}
                  rowSelection={{
                    selectedRowKeys: listSelected,
                    type: 'checkbox',
                    ...rowSelection,
                  }}
                  searchSchema={{
                    keyword: {
                      required: false,
                    },
                    status: {
                      required: false,
                    },
                    source: {
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
      </CustomSectionWrapper>
    </PageWrapper>
  );
}

const CustomSectionWrapper = styled(SectionWrapper)`
  padding: 0 1.5rem;
  .ant-tabs-tab {
    color: #6c798f;
    font-weight: 500;
  }
`;

const TableWrapper = styled.div`
  .anticon {
    vertical-align: 0;
    /* cursor: pointer; */
  }
  .display-none {
    display: none;
  }
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
        .btn-action {
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

const CustomAvatar = styled(Avatar)`
  width: 18px;
  height: 18px;
  margin-left: 8px;
  margin-top: -6px;
`;

const CustomDivInfoUser = styled.div`
  display: flex;
  .left {
    .ant-avatar.ant-avatar-icon {
      width: 50px;
      height: 50px;
      margin-left: -8px;
      margin-top: 4px;
    }
  }
  .ant-divider {
    height: auto;
  }
  .right {
    .user {
      &-name {
        font-weight: 500;
        font-size: 16px;
        line-height: 21px;
      }
      &-source {
        font-weight: 500;
        font-size: 16px;
        line-height: 21px;
      }
      &-phone {
        margin-top: 4px;
        font-size: 12px;
        color: rgb(130, 130, 130);
        line-height: 16px;
      }
      &-email {
        font-size: 12px;
        color: rgb(130, 130, 130);
        line-height: 16px;
      }
    }
  }
`;
