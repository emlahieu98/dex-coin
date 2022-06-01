/**
 *
 * Users
 *
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Spin } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Table, PageWrapper, Link, BoxColor, Avatar } from 'app/components';
import constants from 'assets/constants';
import { CustomH3, SectionWrapper } from 'styles/commons';
import { useUsersSlice } from './slice';
import { FilterBar } from './Features';
import { selectLoading, selectData, selectPagination } from './slice/selectors';
import { messages } from './messages';
import styled from 'styled-components';
import { formatDate } from 'utils/helpers';

export function Users({ history }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { actions } = useUsersSlice();
  const isLoading = useSelector(selectLoading);
  const data = useSelector(selectData);
  const pagination = useSelector(selectPagination);

  const gotoPage = (data = '', isReload) => {
    dispatch(actions.getData(isReload ? history.location.search : data));
  };

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
        title: t('user.id'),
        dataIndex: 'id',
        width: 80,
        render: text => (
          <div style={{ fontWeight: 'bold', margin: '0' }}>{text}</div>
        ),
      },
      {
        title: t('user.user'),
        width: 300,
        render: (_, record) => {
          return (
            <>
              <CustomAvatar
                src={record.avatar?.origin}
                icon={<UserOutlined />}
              />
              &emsp;
              <CustomLink to={`/users/detail/${record.id}/profile`}>
                {record.full_name || 'N/A'}
              </CustomLink>
            </>
          );
        },
      },
      {
        title: t('user.email'),
        dataIndex: 'email',
        width: 230,
      },
      {
        title: t('user.phone'),
        dataIndex: 'phone',
      },
      {
        title: t('user.account_type'),
        dataIndex: 'account_type',
        // render: (text, record) => (
        //   <div className="d-flex">
        //     <CustomP className="admin">
        //       {record.is_admin ? 'Admin' : ''}
        //     </CustomP>
        //     <CustomP className="divider">
        //       {record.is_admin && (record.is_seller || record.is_supplier)
        //         ? '|'
        //         : ''}
        //     </CustomP>
        //     <CustomP className="seller">
        //       {record.is_seller ? 'Seller' : ''}
        //     </CustomP>
        //     <CustomP className="divider">
        //       {record.is_seller && record.is_supplier ? '|' : ''}
        //     </CustomP>
        //     <CustomP className="supplier">
        //       {record.is_supplier ? 'Supplier' : ''}
        //     </CustomP>
        //   </div>
        // ),
        render: text => (
          <div
            style={{
              fontWeight: 'bold',
              color:
                text === 'admin'
                  ? 'red'
                  : text === 'supplier'
                  ? 'green'
                  : text === 'seller'
                  ? 'blue'
                  : 'blue',
            }}
          >
            {text === 'admin'
              ? 'Admin'
              : text === 'supplier'
              ? 'Supplier'
              : text === 'seller'
              ? 'Seller'
              : ''}
          </div>
        ),
      },
      {
        title: t('user.created_at'),
        dataIndex: 'created_at',
        render: text => <p>{formatDate(text)}</p>,
      },
      {
        title: t('user.status'),
        dataIndex: 'status',
        align: 'center',
        render: (text, user) => {
          const currentStatus = constants.USER_STATUS.find(v => v.id === text);
          return (
            <BoxColor
              fontWeight="medium"
              colorValue={currentStatus?.color}
              width="120"
            >
              {currentStatus?.name || ''}
            </BoxColor>
          );
        },
      },
    ],
    [data],
  );

  return (
    <PageWrapper>
      <CustomSectionWrapper>
        <div className="header">
          <CustomH3 className="title text-left" mb={{ xs: 's6' }}>
            {t(messages.title())}
          </CustomH3>
        </div>
        <CustomH3 className="title text-left" mb={{ xs: 's5' }}>
          <FilterBar isLoading={isLoading} gotoPage={gotoPage} />
        </CustomH3>
        <Spin tip="Đang tải..." spinning={isLoading}>
          <Row gutter={24}>
            <Col span={24}>
              <TableWrapper>
                <Table
                  className="custom"
                  columns={columns}
                  searchSchema={{
                    keyword: {
                      required: false,
                    },
                    account_type: {
                      required: false,
                    },
                    status: {
                      required: false,
                    },
                  }}
                  data={{ data, pagination }}
                  scroll={{ x: 1100, y: 5000 }}
                  actions={gotoPage}
                  rowKey={record => record.id}
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
  p {
    margin-top: 14px;
  }
  .hide {
    visibility: hidden;
  }
  .group-btn {
    display: none;
  }
  .box-status:hover .group-btn {
    display: block;
  }
`;

const TableWrapper = styled.div`
  table {
    tr {
      position: relative;
      .category-list {
        .category-item-tag {
          border: 1px dashed;
          padding: 2px 6px;
          border-radius: 4px;
          width: max-content;
        }
        .green {
          color: #389e0d;
          background: #f6ffed;
          border-color: #b7eb8f;
        }
        .red {
          margin-top: 4px;
          color: #ff4d4f;
          background-color: rgba(255, 77, 79, 0.2);
          border-color: #ff4d4f;
        }
      }
      .action-wrapper {
        display: none;
        position: absolute;
        padding: 0;
        top: 50%;
        right: 0px;
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
      }
    }
    tr:hover {
      .action-wrapper {
        display: inline-flex;
      }
    }
  }
`;

const CustomAvatar = styled(Avatar)`
  width: 45px;
  height: 45px;
`;

const CustomLink = styled(Link)`
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #333333;
`;
