import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectLoading,
  selectTransactions,
  selectTransactionsPagination,
} from '../slice/selectors';
import { Skeleton } from 'antd';
import { useAccountDebtPeriodOverviewSlice } from '../slice';
import { Row, Col, Spin } from 'antd';
import { CustomH3, SectionWrapper } from 'styles/commons';
import styled from 'styled-components/macro';
import { Table, BoxColor, Button } from 'app/components';
// import { FilterBar } from '../Features';
import * as moment from 'moment';
import constants from 'assets/constants';
import { formatVND } from 'utils/helpers';

export default function TableListTransaction({}) {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const userId = new URLSearchParams(location.search).get('user_id');

  const dispatch = useDispatch();
  const { actions } = useAccountDebtPeriodOverviewSlice();

  const isLoading = useSelector(selectLoading);
  const transactions = useSelector(selectTransactions);
  const pagination = useSelector(selectTransactionsPagination);

  const gotoPage = (data = '') => {
    dispatch(actions.getTransactions(data));
  };

  const getRowAction = data => {
    return (
      <Button
        className="btn-sm"
        onClick={() => {
          history.push(
            `/accountant/detail-debt-transaction/${data.id}?user_id=${userId}`,
          );
        }}
      >
        Chi tiết
      </Button>
    );
  };

  const columns = useMemo(
    () => [
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Ngày giao dịch</div>
          </div>
        ),
        dataIndex: 'created_at',
        key: 'created_at',
        width: 160,
        render: (text, record) => (
          <>{moment(text).format('HH:mm DD/MM/YYYY')}</>
        ),
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Mã giao dịch</div>
          </div>
        ),
        dataIndex: 'long_code',
        key: 'long_code',
        width: 140,
        render: (text, record) => <>#{text}</>,
      },
      // {
      //   title: (
      //     <div className="custome-header">
      //       <div className="title-box">Loại giao dịch</div>
      //     </div>
      //   ),
      //   dataIndex: 'type',
      //   key: 'type',
      //   width: 120,
      //   render: (text, record) => (
      //     <>{t(`accountant.type_transaction.${text}`)}</>
      //   ),
      // },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Mã đơn hàng</div>
          </div>
        ),
        width: 100,
        render: (_, record) => {
          return <>#{record.order_code}</>;
        },
      },
      // {
      //   title: (
      //     <div className="custome-header">
      //       <div className="title-box text-right">Số sản phẩm</div>
      //     </div>
      //   ),
      //   dataIndex: 'number_of_order',
      //   key: 'number_of_order',
      //   width: 100,
      //   render: (text, record) => {
      //     return <div className="text-right">{text}</div>;
      //   },
      // },
      {
        title: (
          <div className="custome-header">
            <div className="title-box text-right ">Số tiền</div>
          </div>
        ),
        dataIndex: 'amount',
        key: 'amount',
        width: 140,
        align: 'end',
        render: (text, record) => {
          return <div> {formatVND(Math.abs(text))} đ</div>;
        },
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box text-right text-space">
              Ghi chú giao dịch
            </div>
          </div>
        ),
        dataIndex: 'note',
        key: 'note',
        width: 240,
        render: (text, record) => {
          return <div className="text-space">{text}</div>;
        },
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">TT Thanh toán</div>
          </div>
        ),
        dataIndex: 'confirm_status',
        key: 'confirm_status',
        width: 160,
        align: 'center',
        render: (text, record) => {
          const currentStatus = constants.ACCOUNTANT_STATUS.find(
            v => v.id === text,
          );
          return (
            <>
              {currentStatus && (
                <>
                  <BoxColor
                    fontWeight="medium"
                    colorValue={currentStatus?.color}
                  >
                    {currentStatus?.name || ''}
                  </BoxColor>
                  <div className="action-wrapper">{getRowAction(record)}</div>
                </>
              )}
            </>
          );
        },
      },
    ],
    [transactions],
  );

  const pageContent = (
    <>
      <div>
        <CustomH3>Danh sách giao dịch</CustomH3>
      </div>

      <CustomH3 className="title text-left" mb={{ xs: 's5' }}>
        {/* <FilterBar isLoading={isLoading} gotoPage={gotoPage} /> */}
      </CustomH3>
      <Spin tip="Đang tải..." spinning={isLoading}>
        <Row gutter={24}>
          <Col span={24}>
            <div>
              <TableWrapper
                className="table-custom"
                actions={gotoPage}
                columns={columns}
                searchSchema={{
                  partner_id: {
                    required: false,
                  },
                  debt_period_key: {
                    required: false,
                  },
                  user_id: {
                    required: false,
                  },
                }}
                data={{ data: transactions, pagination }}
                scroll={{ x: 1100, y: 5000 }}
                rowKey={record => record.id}
              />
            </div>
          </Col>
        </Row>
      </Spin>
    </>
  );
  return (
    <SectionWrapper className="box-df" style={{ marginTop: '10px' }}>
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 10 }} className="loading" />
      ) : (
        pageContent
      )}
    </SectionWrapper>
  );
}

export const TableWrapper = styled(Table)`
  .text-space {
    padding-left: 35px;
  }
  tr:hover {
    .action-wrapper {
      display: inline-flex;
    }
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
`;
