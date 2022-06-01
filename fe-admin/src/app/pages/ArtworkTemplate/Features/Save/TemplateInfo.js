import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Input, Form, Select, Button, PageWrapper } from 'app/components';
import { Row, Col, Spin, Form as F, Card, Space } from 'antd';

import { Avatar } from 'app/components/Uploads';
import { globalActions } from 'app/pages/AppPrivate/slice';
import { selectLoading, selectDetail } from '../../slice/selectors';
import { useSelector, useDispatch } from 'react-redux';
import { useArtWorkTemplateSlice } from '../../slice';
import styled from 'styled-components';

const typeOptions = [
  { label: 'Sample frame template', value: 'sample_frame_template' },
  { label: 'Artwork template', value: 'artwork_template' },
];

export function TemplateInfo({ history }) {
  const { id } = useParams();
  const isPageUpdate = id && true;
  const isLoading = useSelector(selectLoading);
  const data = useSelector(selectDetail);
  const [dataThumb, setDataThumb] = useState(data?.thumb);
  const [form] = Form.useForm();
  const { actions } = useArtWorkTemplateSlice();
  const dispatch = useDispatch();

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    setDefaultData();
  }, [data]);

  useEffect(() => {
    const dataBreadcrumb = {
      menus: [
        {
          name: 'Artwork template',
          link: '/artwork-templates',
        },
        {
          name: isPageUpdate ? 'Cập nhật' : 'Tạo mới',
        },
      ],
      fixWidth: true,
      title: isPageUpdate ? 'Cập nhật template' : 'Tạo template',
    };
    dispatch(globalActions.setDataBreadcrumb(dataBreadcrumb));
    return () => {
      dispatch(globalActions.setDataBreadcrumb({}));
    };
  }, []);

  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 7,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 12,
      },
      md: {
        span: 10,
      },
    },
  };

  const tailLayout = {
    wrapperCol: { offset: 7, span: 16 },
  };

  const setDefaultData = () => {
    if (isPageUpdate) {
      form.setFieldsValue({
        name: data?.name || '',
        thumb: data?.thumb || null,
        type: data?.type || '',
        description: data?.description || '',
        status: data?.status || null,
      });
    } else {
      form.setFieldsValue({
        name: '',
        thumb: null,
        type: '',
        description: '',
        status: null,
      });
    }
  };

  const getData = () => {
    if (isPageUpdate) {
      dispatch(actions.getDetail(id));
    }
  };

  const onClear = () => {
    if (isPageUpdate) {
      setDefaultData();
    } else {
      form.resetFields();
    }
  };

  const handleChange = responThumb => {
    setDataThumb(responThumb);
  };

  const onFinish = values => {
    if (isPageUpdate) {
      dispatch(
        actions.update({
          id,
          data: {
            thumb: dataThumb,
            name: values.name.trim(),
            description: values.description.trim(),
            type: values.type,
          },
        }),
      );
      return;
    }
    dispatch(
      actions.create({
        data: {
          thumb: dataThumb,
          name: values.name.trim(),
          description: values.description.trim(),
          type: values.type,
        },
      }),
    );
  };

  return (
    <PageWrapper>
      <Spin tip="Đang tải..." spinning={isLoading}>
        <Card>
          <FormWrapper
            initialValues={{ type: typeOptions[0].value }}
            {...formItemLayout}
            form={form}
            name="artwork"
            onFinish={onFinish}
            scrollToFirstError
          >
            <Form.Item name="thumb" label="Ảnh thumbnail">
              <div className="thumbnail-wrapper">
                <Avatar
                  data={isPageUpdate && data?.thumb}
                  onChange={handleChange}
                />
              </div>
            </Form.Item>
            <Form.Item
              name="name"
              label="Tên"
              rules={[
                {
                  required: true,
                  message: 'Tên không được để trống!',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="description"
              label="Mô tả"
              rules={[
                {
                  required: true,
                  message: 'Mô tả không được để trống!',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="type"
              label="Loại"
              rules={[
                {
                  required: true,
                  message: 'Loại không được để trống!',
                },
              ]}
            >
              <Select options={typeOptions} />
            </Form.Item>
            <Form.Item shouldUpdate {...tailLayout}>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="btn-sm mr-2"
                  color="blue"
                >
                  <span>{isPageUpdate ? 'Cập nhật' : 'Lưu'}</span>
                </Button>
                {isPageUpdate ? (
                  <Button
                    context="secondary"
                    className="btn-sm mr-2"
                    onClick={() =>
                      history.push(`/artwork-templates/${id}/designs`)
                    }
                  >
                    <i class="fa fa-edit"></i>
                    &nbsp;Edit designs
                  </Button>
                ) : (
                  <Button
                    context="secondary"
                    className="btn-sm mr-2"
                    onClick={onClear}
                  >
                    &nbsp;Clear
                  </Button>
                )}
                <Button
                  context="secondary"
                  color="default"
                  onClick={() => {
                    history.push('/artwork-templates');
                  }}
                  className="btn-sm"
                >
                  <span>Trở về danh sách</span>
                </Button>
              </Space>
            </Form.Item>
          </FormWrapper>
        </Card>
      </Spin>
    </PageWrapper>
  );
}

const FormWrapper = styled(Form)`
  .thumbnail-wrapper {
    width: 150px;
  }
`;
