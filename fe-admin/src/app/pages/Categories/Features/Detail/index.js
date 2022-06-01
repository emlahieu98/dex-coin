import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { globalActions } from 'app/pages/AppPrivate/slice';
import { Row, Col, Spin, Space, Form as F } from 'antd';
import { selectLoading, selectDetail } from '../../slice/selectors';
import { useCategoriesSlice } from '../../slice';
import { Button, PageWrapper, Form, Input } from 'app/components';
import { isEmpty } from 'lodash';
import { CustomStyle } from 'styles/commons';
import { Avatar } from 'app/components/Uploads';
import styled from 'styled-components';

import { SectionWrapper } from 'styles/commons';

const Item = F.Item;

export function Detail({ match, history }) {
  const id = match?.params?.id;
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { actions } = useCategoriesSlice();
  const isLoading = useSelector(selectLoading);
  const data = useSelector(selectDetail);

  useEffect(() => {
    return () => {
      dispatch(globalActions.setDataBreadcrumb({}));
      dispatch(actions.getDetailDone({}));
    };
  }, []);

  useEffect(() => {
    if (!isEmpty(data)) {
      form.setFieldsValue({
        name: data?.name || '',
        thumb: data?.thumb || null,
        description: data?.description || '',
        parent_id: data?.parent_id || null,
        parent_name: data?.parent_id + ' - ' + data?.parent_name || '',
        status: data?.status || '',
      });
    } else {
      if (id) dispatch(actions.getDetail(id));
    }
  }, [data]);

  useEffect(() => {
    const dataBreadcrumb = {
      menus: [
        {
          name: 'Danh mục',
          link: '/categories',
        },
        {
          name: 'Chi Tiết',
        },
      ],
      title: '',
      status: '',
    };
    if (!isEmpty(data)) {
      dataBreadcrumb.title = data?.name;
      dataBreadcrumb.status = data?.status;
    } else {
      if (id) dispatch(actions.getDetail(id));
    }
    dispatch(globalActions.setDataBreadcrumb(dataBreadcrumb));
  }, [data]);

  const goUpdate = () => {
    history.push(`/categories/uc/${id}`);
  };

  const layout = {
    labelCol: { xs: 24, sm: 7 },
    wrapperCol: { xs: 24, sm: 12, md: 10 },
  };
  const layoutThumb = {
    labelCol: { xs: 24, sm: 7 },
    wrapperCol: { xs: 12, sm: 6, md: 2 },
  };
  const tailLayout = {
    wrapperCol: { offset: 7, span: 16 },
  };

  return (
    <PageWrapper>
      <Spin tip="Đang tải..." spinning={isLoading}>
        <Form
          form={form}
          name="normal_login"
          className="login-form"
          disabled={true}
        >
          <>
            <Row gutter={24}>
              <Col span={24}>
                <SectionWrapper mt={{ xs: 's4' }}>
                  <div className="">
                    <CustomItem name="thumb" label="Ảnh" {...layoutThumb}>
                      <Avatar data={data?.thumb} disabled />
                    </CustomItem>
                    {data?.parent_id ? (
                      <Item
                        name="parent_name"
                        label="Ngành hàng cha"
                        {...layout}
                      >
                        <Input />
                      </Item>
                    ) : (
                      <Item label="Ngành hàng cha" {...layout}>
                        <Input />
                      </Item>
                    )}
                    <Item name="name" label="Tên ngành hàng" {...layout}>
                      <Input />
                    </Item>
                    <Item
                      name="description"
                      label="Mô tả ngành hàng"
                      {...layout}
                    >
                      <Input />
                    </Item>
                    <Item label="Trạng thái" {...layout}>
                      {data?.status === 'active' ? (
                        <Input placeholder="Hoạt động" />
                      ) : (
                        <Input placeholder="Tạm ẩn" />
                      )}
                    </Item>
                    <Item
                      name="info_mapped"
                      label="Ngành hàng shopee tương ứng:"
                      valuePropName="data"
                      {...layout}
                    >
                      {!isEmpty(data) ? (
                        <CustomStyle>
                          {isEmpty(data.info_mapped) ||
                            data.info_mapped.map(v => (
                              <CustomStyle
                                border="1px solid"
                                borderColor="stroke"
                                padding="0 12px"
                                marginBottom="5px"
                              >
                                {v?.display_path}{' '}
                                {/* <CloseOutlined
                      onClick={deleteItem(v.id)}
                      style={{ paddingLeft: 5, color: '#EE496B' }}
                    /> */}
                              </CustomStyle>
                            ))}
                        </CustomStyle>
                      ) : (
                        ''
                      )}
                      {/* <CategoryChild {...res} /> */}
                    </Item>
                    <Item shouldUpdate {...tailLayout}>
                      <Space>
                        <CustomButton
                          type="primary"
                          className="btn-sm mr-2"
                          color="blue"
                          onClick={goUpdate}
                        >
                          <span>Cập nhật</span>
                        </CustomButton>
                      </Space>
                    </Item>
                  </div>
                </SectionWrapper>
              </Col>
            </Row>
          </>
        </Form>
      </Spin>
    </PageWrapper>
  );
}

const CustomButton = styled(Button)`
  padding: 5px 16px;
  box-shadow: 0px 2px 0px rgba(0, 0, 0, 0.043);
  border-radius: 2px;
`;

const CustomItem = styled(Item)`
  .ant-upload-select span.ant-upload img {
    max-width: 100%;
  }
  .ant-form-item-label {
    margin: auto 0;
  }
`;
