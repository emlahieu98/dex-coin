import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { isEmpty } from 'lodash';
import {
  Row,
  Col,
  Spin,
  Form as F,
  message,
  Space,
  TreeSelect,
  Select,
} from 'antd';
import { selectLoading, selectDetail, selectData } from '../../slice/selectors';
import { useCategoriesSlice } from '../../slice';
import { Button, PageWrapper, Form, Input } from 'app/components';
import { globalActions } from 'app/pages/AppPrivate/slice';
import { SectionWrapper } from 'styles/commons';
import { Avatar } from 'app/components/Uploads';
import styled from 'styled-components';
import Category from './Category';

const Item = F.Item;

export function CreateAndUpdateCategories({ match, history }) {
  const id = match?.params?.id;
  const dispatch = useDispatch();
  const { actions } = useCategoriesSlice();
  const [form] = Form.useForm();
  const isLoading = useSelector(selectLoading);
  const data = useSelector(selectDetail);
  const dataParent = useSelector(selectData);

  const { Option } = Select;
  const [Parent, setParent] = useState('');
  const [dataThumb, setDataThumb] = useState(data?.thumb);
  const [dataIcon, setDataIcon] = useState(data?.icon);

  useEffect(() => {
    return () => {
      dispatch(globalActions.setDataBreadcrumb({}));
      dispatch(actions.getDetailDone({}));
    };
  }, []);

  useEffect(() => {
    const dataBreadcrumb = {
      menus: [
        {
          name: 'Danh mục',
          link: '/categories',
        },
        {
          name: id ? 'Cập nhật ' : 'Thêm mới',
        },
      ],
      title: id ? '' : 'Thêm danh mục',
      status: '',
    };
    if (!isEmpty(data)) {
      dataBreadcrumb.title = data?.name;
      dataBreadcrumb.status = data?.status;
    }
    dispatch(globalActions.setDataBreadcrumb(dataBreadcrumb));
  }, [data]);

  useEffect(() => {
    if (!isEmpty(data)) {
      form.setFieldsValue({
        name: data?.name || '',
        thumb: data?.thumb || null,
        icon: data?.icon || null,
        // description: data?.description || '',
        parent_id: data?.parent_id || null,
        parent_name: data?.parent_id + ' - ' + data?.parent_name || '',
        priority: data?.priority || null,
        status: data?.status || '',
        info_mapped: data?.info_mapped || [],
      });
    } else {
      if (id) dispatch(actions.getDetail(id));
    }
  }, [data]);

  const onClear = () => {
    if (id) {
      form.setFieldsValue({
        name: data?.name || '',
        thumb: data?.thumb || null,
        icon: data?.icon || null,
        // description: data?.description || '',
        parent_id: data?.parent_id || null,
        parent_name: data?.parent_id + ' - ' + data?.parent_name || '',
        priority: data?.priority || null,
        status: data?.status || '',
        info_mapped: data?.info_mapped || [],
      });
    } else {
      form.resetFields();
    }
  };

  const onFinish = values => {
    if (
      !form.isFieldsTouched(
        id
          ? [
              'name',
              'thumb',
              'icon',
              // 'description',
              'parent_id',
              'status',
              'priority',
            ]
          : [
              'name',
              'thumb',
              'icon',
              // 'description',
              'parent_id',
              'status',
              'priority',
            ],
      )
    ) {
      return message.error('Vui lòng thêm thông tin!');
    }
    const { info_mapped } = values;
    console.log(`shopee_cat_ids_mapped`, values.shopee_cat_ids_mapped);
    const shopeeCatIdsMapped = info_mapped.map(v => v.shop_cat_id);
    if (id) {
      dispatch(
        actions.update({
          id,
          data: {
            ...data,
            thumb: dataThumb,
            icon: dataIcon,
            name: values.name.trim(),
            // description: values.description.trim(),
            status: values.status.trim(),
            priority: values.priority,
            shopee_cat_ids_mapped: shopeeCatIdsMapped,
          },
        }),
      );
    } else {
      dispatch(
        actions.create({
          data: {
            ...data,
            thumb: dataThumb,
            icon: dataIcon,
            name: values.name.trim(),
            // description: values.description.trim(),
            parent_id: values.parent_id || null,
            priority: values.priority,
            shopee_cat_ids_mapped: shopeeCatIdsMapped,
          },
        }),
      );
    }
  };

  const ConvertDataTree = dataParent?.map(item => {
    if (!isEmpty(item.children)) {
      return {
        ...item,
        value: item.id,
        title: item.id + ' - ' + item.name,
        children: item.children?.map(item2 => ({
          ...item2,
          value: item2.id,
          title: item2.id + ' - ' + item2.name,
          children: item2.children?.map(item3 => ({
            ...item3,
            value: item3.id,
            title: item3.id + ' - ' + item3.name,
          })),
        })),
      };
    }
    return {
      ...item,
      value: item.id,
      title: item.id + ' - ' + item.name,
    };
  });

  const onSelectParen = value => {
    setParent(value);
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

  const handleChange = responThumb => {
    setDataThumb(responThumb);
  };
  const handleChangeIcon = responIcon => {
    setDataIcon(responIcon);
  };
  function onChange(value) {}
  return (
    <PageWrapper>
      <Spin tip="Đang tải..." spinning={isLoading}>
        <Form
          form={form}
          name="normal_login"
          className="login-form"
          onFinish={onFinish}
        >
          <>
            <Row gutter={24}>
              <Col span={24}>
                <SectionWrapper mt={{ xs: 's4' }}>
                  <>
                    <CustomItem name="thumb" label="Ảnh" {...layoutThumb}>
                      <Avatar data={data?.thumb} onChange={handleChange} />
                    </CustomItem>

                    <CustomItemIcon name="icon" label="Icon" {...layoutThumb}>
                      <Avatar data={data?.icon} onChange={handleChangeIcon} />
                    </CustomItemIcon>
                    {!id ? (
                      <Item name="parent_id" label="Ngành hàng cha" {...layout}>
                        <TreeSelect
                          showSearch
                          style={{ width: '100%' }}
                          value={Parent}
                          treeData={ConvertDataTree}
                          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                          placeholder="Chọn ngành hàng cha"
                          allowClear
                          treeDefaultExpandAll
                          onChange={onSelectParen}
                        />
                      </Item>
                    ) : (
                      <Item
                        name={data?.parent_id ? 'parent_name' : ''}
                        label="Ngành hàng cha"
                        {...layout}
                      >
                        <Input placeholder=" " disabled />
                      </Item>
                    )}

                    <Item
                      name="name"
                      label="Tên ngành hàng"
                      {...layout}
                      rules={[
                        {
                          required: true,
                          message: 'Bắt buộc Nhập tên ngành hàng',
                        },
                      ]}
                    >
                      <Input placeholder="Nhập tên ngành hàng" />
                    </Item>
                    {/* <Item
                      name="description"
                      label="Mô tả ngành hàng"
                      {...layout}
                    >
                      <Input placeholder="Nhập mô tả ngành hàng" />
                    </Item> */}
                    {id ? (
                      <Item
                        name="priority"
                        label="Độ ưu tiên hiển thị:"
                        {...layout}
                      >
                        <Input placeholder="Nhập độ ưu tiên hiển thị ( 1 - 99 )" />
                      </Item>
                    ) : (
                      ''
                    )}
                    {id ? (
                      <Item name="status" label="Trạng thái:" {...layout}>
                        <Select
                          defaultValue={id ? '' : 'Hoạt động'}
                          style={{ color: 'blue' }}
                          onChange={onChange}
                        >
                          <Option value="active">Hoạt động</Option>
                          <Option value="inactive">Tạm ẩn</Option>
                        </Select>
                      </Item>
                    ) : (
                      ''
                    )}
                    <Category layout={layout} />
                    <Item shouldUpdate {...tailLayout}>
                      <Space>
                        <Button
                          type="primary"
                          htmlType="submit"
                          className="btn-sm mr-2"
                          color="blue"
                        >
                          <span>{id ? 'Cập nhật' : 'Lưu'}</span>
                        </Button>
                        {id ? (
                          ''
                        ) : (
                          <Button
                            context="secondary"
                            color="default"
                            onClick={onClear}
                            className="btn-sm"
                          >
                            <span>Reset</span>
                          </Button>
                        )}
                      </Space>
                    </Item>
                  </>
                </SectionWrapper>
              </Col>
            </Row>
          </>
        </Form>
      </Spin>
    </PageWrapper>
  );
}

const CustomItem = styled(Item)`
  .ant-upload-select span.ant-upload img {
    max-width: 100%;
    max-height: 132px;
  }
  .ant-form-item-label {
    margin: auto 0;
  }
`;

const CustomItemIcon = styled(Item)`
  .ant-upload-select span.ant-upload img {
    max-width: 22px;
    max-height: 26px;
  }
  .ant-form-item {
    &-control-input {
      width: 80px;
    }
    &-label {
      margin: auto 0;
    }
  }
`;
