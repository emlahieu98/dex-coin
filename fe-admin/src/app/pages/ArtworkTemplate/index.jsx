import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Spin, Switch, Button } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Table, PageWrapper, Link, Image } from 'app/components';
import { CustomH3, SectionWrapper } from 'styles/commons';
import { useArtWorkTemplateSlice } from './slice';
import { genImgUrl, formatDate } from 'utils/helpers';

import { selectLoading, selectData } from './slice/selectors';

export function ArtWorkTemplates({ history }) {
  const dispatch = useDispatch();
  const { actions } = useArtWorkTemplateSlice();
  const isLoading = useSelector(selectLoading);
  const data = useSelector(selectData);

  useEffect(() => {
    loadData();
  }, []);

  const gotoCreate = () => {
    history.push(`/artwork-templates/uc`);
  };

  const updateTemplate = record => {
    if (record.status === 'active') {
      dispatch(
        actions.update({
          id: record.id,
          data: {
            // ...record,
            status: 'inactive',
          },
        }),
      );
    } else if (record.status === 'inactive') {
      dispatch(
        actions.update({
          id: record.id,
          data: {
            // ...record,
            status: 'active',
          },
        }),
      );
    }
  };

  const loadData = (data = '') => {
    dispatch(actions.getData(data));
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'id',
      key: 'id',
      width: 50,
      render: (text, record, index) => <span>{index}</span>,
    },
    {
      title: 'Tên',
      width: 250,
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <WrapperName>
          <Image
            className="thumbnail-img"
            src={genImgUrl({ location: record.thumb?.location })}
          />
          <Link
            className="custom-link"
            to={`/artwork-templates/uc/${record.id}`}
          >
            {text}
          </Link>
        </WrapperName>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      render: (text, record) => <span>{text}</span>,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 150,
      render: (text, record) => <span>{formatDate(text)}</span>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 150,
      render: (text, record) => <span>{text}</span>,
    },
    {
      title: (
        <div className="custome-header">
          <div className="title-box">Status</div>
        </div>
      ),
      dataIndex: 'status',
      key: 'status',
      width: 60,
      align: 'center',
      render: (_, record) => (
        <CustomSwitch
          size="small"
          defaultChecked={record?.status === 'active'}
          onChange={() => updateTemplate(record)}
        />
      ),
    },
    {
      title: 'Action',
      dataIndex: 'id',
      key: 'id',
      width: 150,
      render: (text, record) => (
        <ActionLink
          className="custom-link"
          to={`/artwork-templates/${record.id}/designs`}
        >
          <i class="fa fa-edit"></i>
          Edit designs
        </ActionLink>
      ),
    },
  ];

  return (
    <PageWrapper>
      <CustomSectionWrapper mt={{ xs: 's4' }}>
        <div className="header">
          <CustomH3 className="title text-left" mb={{ xs: 's6' }}>
            ARTWORK TEMPLATE
          </CustomH3>
          <Button
            className="btn-sm page-action"
            // context="secondary"
            type="primary"
            // icon="far fa-plus"
            onClick={gotoCreate}
          >
            <PlusCircleOutlined />
            Thêm template
          </Button>
        </div>
        <Spin tip="Đang tải..." spinning={isLoading}>
          <Row gutter={24}>
            <Col span={24}>
              <div>
                <Table
                  className="artwork-tbl"
                  columns={columns}
                  data={{ data }}
                  scroll={{ x: 1100 }}
                  notNeedRedirect="true"
                  pagination={false}
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
  .header {
    display: flex;
  }
  .page-action {
    display: inline-flex;
    align-items: center;
    background-color: #4869de;
    border-color: #4869de;
    margin-left: auto;
  }
`;

const WrapperName = styled.div`
  display: flex;
  align-items: center;
  .thumbnail-img {
    width: 35px;
    height: 35px;
    object-fit: cover;
  }
  .custom-link {
    /* text-decoration: none; */
    color: #4869de;
  }
`;

const ActionLink = styled(Link)`
  i {
    margin-right: 7px;
  }
  color: #4869de;
`;

const CustomSwitch = styled(Switch)`
  &.ant-switch-checked {
    background: #4869de;
  }
`;
