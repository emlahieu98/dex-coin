/**
 *
 * Categories
 *
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Spin, Switch, Space, Dropdown, Menu, List } from 'antd';
import { MoreOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Table, PageWrapper, Link, Image } from 'app/components';
import { CustomH3, SectionWrapper } from 'styles/commons';
import { useCategoriesSlice } from './slice';
import { FilterBar } from './Features';
import { selectLoading, selectData } from './slice/selectors';
import { messages } from './messages';

export function Categories({ history }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { actions } = useCategoriesSlice();
  const isLoading = useSelector(selectLoading);
  const data = useSelector(selectData);

  const gotoPage = (data = '', isReload) => {
    dispatch(actions.getData(isReload ? history.location.search : data));
  };

  const goTransfer = record => {
    if (record.status === 'active') {
      dispatch(
        actions.update({
          id: record.id,
          data: {
            ...record,
            status: 'inactive',
          },
        }),
      );
    } else if (record.status === 'inactive') {
      dispatch(
        actions.update({
          id: record.id,
          data: {
            ...record,
            status: 'active',
          },
        }),
      );
    }
  };

  const menu = record => {
    return (
      <Menu style={{ width: 120 }}>
        <Menu.Item key="1">
          <CustomLink
            style={{ textDecoration: 'none', color: 'blue' }}
            to={`/categories/${record.id}/detail`}
          >
            <EyeOutlined />
            &ensp; Xem
          </CustomLink>
        </Menu.Item>
        <Menu.Item key="2">
          <CustomLink
            style={{ textDecoration: 'none', color: 'green' }}
            to={`/categories/uc/${record.id}`}
          >
            <EditOutlined />
            &ensp; Chỉnh sửa
          </CustomLink>
        </Menu.Item>
      </Menu>
    );
  };

  const columns = React.useMemo(
    () => [
      {
        title: '',
        width: 60,
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Ngành hàng</div>
          </div>
        ),
        dataIndex: 'name',
        key: 'name',
        width: 220,
        render: (text, record) => (
          <WrapperOption>
            <List.Item>
              <List.Item.Meta
                avatar={<Image size="40x40" src={record?.thumb?.location} />}
                title={
                  <Link
                    style={{ textDecoration: 'none', fontWeight: '400' }}
                    to={`/categories/${record.id}/detail`}
                  >
                    {record.id}. {text}
                  </Link>
                }
              />
            </List.Item>
          </WrapperOption>
        ),
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Mô tả</div>
          </div>
        ),
        dataIndex: 'description',
        key: 'description',
        width: 250,
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Thumb</div>
          </div>
        ),
        dataIndex: 'icon',
        key: 'icon',
        width: 60,
        align: 'center',
        render: (_, record) => (
          <WrapperImg>
            <List.Item>
              <List.Item.Meta
                avatar={<Image size="26x26" src={record?.icon?.location} />}
              />
            </List.Item>
          </WrapperImg>
        ),
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">SL Con</div>
          </div>
        ),
        width: 70,
        align: 'center',
        render: (_, record) => (
          <p>{record?.children?.length > 0 ? record?.children?.length : ''}</p>
        ),
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Ưu tiên hiển thị</div>
          </div>
        ),
        width: 70,
        align: 'center',
        render: (_, record) => <p>{record?.priority}</p>,
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Trạng thái</div>
          </div>
        ),
        dataIndex: 'status',
        key: 'status',
        width: 70,
        align: 'center',
        render: (_, record) => (
          <CustomSwitch
            defaultChecked={record?.status === 'active'}
            onChange={() => goTransfer(record)}
          />
        ),
      },
      {
        title: '',
        key: 'action',
        width: 30,
        align: 'center',
        render: (_, record) => (
          <Space size="middle">
            <Dropdown overlay={menu(record)} trigger={['click']}>
              <CustomLink
                className="ant-dropdown-link"
                onClick={e => e.preventDefault()}
              >
                <div className="classicon-more">
                  <MoreOutlined />
                </div>
              </CustomLink>
            </Dropdown>
          </Space>
        ),
      },
    ],
    [data],
  );
  return (
    <PageWrapper>
      <CustomSectionWrapper mt={{ xs: 's4' }}>
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
              <div>
                <Table
                  className="custom tableCategory"
                  columns={columns}
                  rowClassName="pointer"
                  searchSchema={{
                    page: {
                      required: true,
                      default: 1,
                      test: value => {
                        return /^\d+$/.test(value);
                      },
                    },
                    page_size: {
                      required: true,
                      default: 100,
                      test: value => Number(value) <= 100,
                    },
                    keyword: {
                      required: false,
                    },
                    status: {
                      required: false,
                    },
                  }}
                  data={{ data }}
                  scroll={{ x: 1100 }}
                  actions={gotoPage}
                  hideExpandIcon
                  defaultExpandAllRows={false}
                  expandIconAsCell={false}
                  // expandedRowKeys
                  // expandIconColumnIndex={-1}
                  // indentSize={15}
                  rowKey={record => record.id}
                />
              </div>
            </Col>
          </Row>
        </Spin>
      </CustomSectionWrapper>
    </PageWrapper>
  );
}

const CustomSectionWrapper = styled(SectionWrapper)`
  .tableCategory tr td {
    height: 80px;
    padding: 20px 16px;
    .ant-list-item {
      padding: 0;
      &-meta-avatar {
        height: 40px;
      }
    }
  }
`;

const CustomLink = styled(Link)`
  .anticon {
    vertical-align: 0;
  }
  .classicon-more {
    border-radius: 50%;
    width: 36px;
    height: 36px;
    .anticon-more {
      margin-top: 5px;
    }
    &:hover {
      background-color: #f0f2fb;
    }
    svg {
      color: #4d4d4d;
      font-size: 26px;
      &:hover {
        color: #4869de;
      }
    }
  }
`;

const WrapperOption = styled.div`
  .ant-image {
    width: 40px;
    &-img {
      border-radius: 4px;
    }
  }
  .ant-list-item-meta {
    align-items: center;
    &-meta-title {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    &-meta-description {
      font-weight: 400;
      font-size: 12;
      color: rgba(0, 0, 0, 0.4);
    }
  }
`;

const WrapperImg = styled.div`
  .ant-list-item-meta-avatar {
    margin: 0 auto;
  }
  .ant-image {
    border-radius: 4px;
    width: 26px;
    background-color: #3d56a6;
    border-radius: 3px;
    &-img {
      height: 26px;
    }
  }
`;

const CustomSwitch = styled(Switch)`
  &.ant-switch-checked {
    background: #4869de;
  }
`;
