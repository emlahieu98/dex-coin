/**
 *
 * Banks
 *
 */
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Spin, Space, Menu, Dropdown } from 'antd';
import { MoreOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import constants from 'assets/constants';
import { Table, PageWrapper, Link, Image, BoxColor } from 'app/components';
import { CustomH3, SectionWrapper } from 'styles/commons';
import { useBanksSlice } from './slice';
import { FilterBar } from './Features';
import { selectLoading, selectData, selectPagination } from './slice/selectors';
import { messages } from './messages';
import styled from 'styled-components';
import moment from 'moment';

export function Banks({ history }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { actions } = useBanksSlice();
  const isLoading = useSelector(selectLoading);
  const data = useSelector(selectData);
  const pagination = useSelector(selectPagination);

  const gotoPage = (data = '') => {
    dispatch(actions.getData(data));
  };

  const menu = record => {
    return (
      <Menu style={{ width: 110 }}>
        <Menu.Item key="1">
          <CustomLink
            style={{ textDecoration: 'none', color: 'green' }}
            to={`/setting/banks/${record.id}/detail`}
          >
            <EyeOutlined />
            &ensp; Xem
          </CustomLink>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="2">
          <CustomLink
            style={{ textDecoration: 'none', color: 'blue' }}
            to={`/setting/banks/uc/${record.id}`}
          >
            <EditOutlined /> &ensp; Cập nhật
          </CustomLink>
        </Menu.Item>
      </Menu>
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
            <div className="title-box">Tên Ngân hàng</div>
          </div>
        ),
        // dataIndex: 'title',
        // key: 'title',
        width: 240,
        render: (text, record) => (
          <Link
            style={{ textDecoration: 'none', fontWeight: 'bold' }}
            to={`/setting/banks/${record.id}/detail`}
          >
            {record?.bank_data?.title}
          </Link>
        ),
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Số tài khoản</div>
          </div>
        ),
        dataIndex: 'account_number',
        key: 'account_number',
        width: 120,
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Chủ tài khoản</div>
          </div>
        ),
        dataIndex: 'account_name',
        key: 'account_name',
        width: 150,
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Chi nhánh</div>
          </div>
        ),
        dataIndex: 'sub_title',
        key: 'sub_title',
        width: 170,
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Logo</div>
          </div>
        ),
        // dataIndex: 'logo',
        // key: 'logo',
        width: 100,
        align: 'center',
        render: (_, record) => (
          <CustomImage
            size="32x32"
            src={
              record?.bank_data?.logo?.location
                ? 'https://i.odii.xyz/' + record?.bank_data?.logo?.location
                : ''
            }
            alt="logobank"
          />
        ),
      },
      {
        title: (
          <div className="exp_date">
            <div className="title-box">Hết hạn</div>
          </div>
        ),
        dataIndex: 'exp_date',
        key: 'exp_date',
        width: 120,
        render: (_, record) => (
          <div>{moment(record?.exp_date).format('DD/MM/YYYY')}</div>
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
        width: 120,
        align: 'center',
        render: (text, record) => {
          const currentStatus = constants.BANK_STATUS.find(v => v.id === text);
          return (
            <BoxColor fontWeight="medium" colorValue={currentStatus?.color}>
              {currentStatus?.name || ''}
            </BoxColor>
          );
        },
      },
      {
        title: '',
        key: 'action',
        width: 70,
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
      <SectionWrapper mt={{ xs: 's4' }}>
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
                  className="custom"
                  columns={columns}
                  searchSchema={{
                    keyword: {
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
              </div>
            </Col>
          </Row>
        </Spin>
      </SectionWrapper>
    </PageWrapper>
  );
}
const CustomImage = styled(Image)`
  width: 60px;
  border: 1px solid #ebebf0;
  border-radius: 4px;
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
