/**
 *
 * Suppliers
 *
 */
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Spin } from 'antd';
import { ShopOutlined } from '@ant-design/icons';
import {
  Button,
  Table,
  PageWrapper,
  Link,
  BoxColor,
  Avatar,
} from 'app/components';
import constants from 'assets/constants';
import { CustomH3, SectionWrapper } from 'styles/commons';
import { useSuppliersSlice } from './slice';
import { FilterBar } from './Features';
import { selectLoading, selectData, selectPagination } from './slice/selectors';
import { messages } from './messages';
import { flagVN } from 'assets/images';
import { isEmpty } from 'lodash';
import request from 'utils/request';

import styled from 'styled-components';

export function Suppliers({ history }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { actions } = useSuppliersSlice();
  const isLoading = useSelector(selectLoading);
  const data = useSelector(selectData);
  const pagination = useSelector(selectPagination);

  const [categories, setCategories] = React.useState([]);

  const host = 'https://i.odii.xyz/';

  const gotoPage = (data = '', isReload) => {
    dispatch(actions.getData(isReload ? history.location.search : data));
  };

  React.useEffect(() => {
    const delaySecond = 20000;
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

  React.useEffect(() => {
    dispatch(actions.reload());
    dispatch(actions.getData(history.location.search));
  }, []);

  React.useEffect(() => {
    if (isEmpty(categories)) {
      fetchCategories();
    }
  }, [categories]);

  const fetchCategories = async () => {
    const digit = () => `${Math.round(Math.random() * 255)}`;

    const response = await request(
      'product-service/categories-listing?page=1&page_size=100&is_top=true',
      {},
    )
      .then(response => response)
      .catch(error => error);
    if (response.is_success) {
      if (!isEmpty(response.data)) {
        let new_array = response.data.map((item, index) => {
          return {
            ...item,
            color: `rgb(${digit()},${digit()},${digit()})`,
          };
        });
        await setCategories(new_array);
      }
    }
  };

  const goDetail = record => {
    history.push(`/suppliers/${record.id}/detail`);
  };

  const getListCategoryRecord = record => {
    let listCategory = [];
    for (let category_id of record.category_ids) {
      for (let category of categories) {
        if (category_id === category.id) {
          listCategory.push({
            name: category.name,
            color: category.color,
          });
        }
      }
    }
    return (
      <>
        <div className="category-list">
          {!isEmpty(listCategory) ? (
            <>
              <div
                className="category-item-tag"
                style={{ color: listCategory[0].color }}
              >
                {listCategory[0].name}
              </div>
              {listCategory?.length > 1 ? (
                <div
                  className="category-item-tag"
                  style={{ color: listCategory[1].color }}
                >
                  {listCategory[1].name}
                </div>
              ) : (
                ''
              )}
            </>
          ) : (
            ''
          )}
        </div>
        {listCategory?.length > 2 ? <div>...</div> : ''}
      </>
    );
  };

  const columns = React.useMemo(
    () => [
      {
        title: (
          <div className="custome-header">
            <div className="title-box">ID</div>
          </div>
        ),
        dataIndex: 'id',
        key: 'id',
        width: 60,
        render: text => (
          <p style={{ fontWeight: 'bold', margin: '0' }}>{text}</p>
        ),
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Nhà cung cấp</div>
          </div>
        ),
        dataIndex: 'name',
        key: 'name',
        width: 200,
        render: (text, record) => {
          return (
            <>
              <CustomAvatar
                src={
                  record.thumb?.location
                    ? host + record.thumb?.location
                    : record.thumb?.origin
                }
                icon={<ShopOutlined />}
              />
              &emsp;
              <CustomLink to={`/suppliers/${record.id}/detail`}>
                {text || 'N/A'}
              </CustomLink>
            </>
          );
        },
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Email</div>
          </div>
        ),
        dataIndex: 'contact_email',
        key: 'contact_email',
        width: 170,
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Số điện thoại</div>
          </div>
        ),
        dataIndex: 'phone_number',
        key: 'phone_number',
        width: 120,
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Tỉnh thành</div>
          </div>
        ),
        width: 120,
        render: (_, record) => {
          return <p>{record?.address?.city}</p>;
        },
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Quốc gia</div>
          </div>
        ),
        width: 120,
        render: (_, record) => {
          return (
            <p>
              <img className="img-flag" src={flagVN} alt="" />
              {'   '}
              {record?.address?.country}
            </p>
          );
        },
      },

      {
        title: (
          <div className="custome-header">
            <div className="title-box">Ngành hàng</div>
          </div>
        ),
        width: 200,
        render: (_, record) => {
          return <div>{getListCategoryRecord(record)}</div>;
        },
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Trạng thái</div>
          </div>
        ),
        width: 120,
        align: 'center',
        render: (_, record) => {
          const currentStatus = constants.SUPPLIER_STATUS.find(
            v =>
              v.id ===
              (record.register_status === 'pending_for_review'
                ? record.register_status
                : record.register_status === 'pending_for_review_after_update'
                ? record.register_status
                : record.register_status === 'reject'
                ? record.register_status
                : record.status),
          );
          return (
            <>
              <BoxColor
                fontWeight="medium"
                colorValue={currentStatus?.color}
                className="box-status"
                width="120px"
              >
                {currentStatus?.name || ''}
              </BoxColor>
              <div className="action-wrapper">{getRowAction(record)}</div>
            </>
          );
        },
      },
    ],
    [data],
  );

  const getRowAction = record => {
    return (
      <Button color="blue" className="btn-sm" onClick={() => goDetail(record)}>
        Chi tiết
      </Button>
    );
  };

  return (
    <PageWrapper>
      <CustomSectionWrapper>
        <div className="header">
          <CustomH3 className="title text-left" mb={{ xs: 's6' }}>
            {t(messages.title())}
          </CustomH3>
        </div>
        <CustomH3 className="title text-left" mb={{ xs: 's5' }}>
          <FilterBar
            isLoading={isLoading}
            gotoPage={gotoPage}
            categories={categories}
          />
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
                    province_id: {
                      required: false,
                    },
                    register_status: {
                      required: false,
                    },
                    category_id: {
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
          &:last-child {
            margin-top: 4px;
          }
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
      &:hover {
        .action-wrapper {
          display: inline-flex;
        }
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
