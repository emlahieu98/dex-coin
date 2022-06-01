import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components/macro';
import { isEmpty } from 'lodash';
import { Row, Col, Spin, Form as F, message, Space, Select } from 'antd';
import { selectLoading, selectDetail } from '../../slice/selectors';
import { useBanksSlice } from '../../slice';
import { Button, PageWrapper, Form, Input } from 'app/components';
import { globalActions } from 'app/pages/AppPrivate/slice';
import { SectionWrapper } from 'styles/commons';
import request from 'utils/request';

const Item = F.Item;

export function CreateAndUpdateBanks({ match, history }) {
  const id = match?.params?.id;
  const dispatch = useDispatch();
  const { actions } = useBanksSlice();
  const [form] = Form.useForm();
  const isLoading = useSelector(selectLoading);
  const data = useSelector(selectDetail);
  const { Option } = Select;
  const [dataBankVN, setDataBankVN] = useState('');

  useEffect(() => {
    return () => {
      dispatch(globalActions.setDataBreadcrumb({}));
      dispatch(actions.getDetailDone({}));
    };
  }, []);

  React.useEffect(() => {
    request(`user-service/banks-info?page=1&page_size=100`, {})
      .then(result => {
        setDataBankVN(result?.data ?? {});
      })
      .catch(err => {});
  }, []);

  useEffect(() => {
    const dataBreadcrumb = {
      menus: [
        {
          name: 'Ngân hàng',
          link: '/setting/banks',
        },
        {
          name: id ? 'Cập nhật ngân hàng' : 'Thêm mới',
        },
      ],
      title: id ? '' : 'Thêm ngân hàng',
      status: '',
    };
    if (!isEmpty(data)) {
      dataBreadcrumb.title = data?.bank_data?.title;
      dataBreadcrumb.status = data?.status;
    }
    dispatch(globalActions.setDataBreadcrumb(dataBreadcrumb));
  }, [data]);

  useEffect(() => {
    if (!isEmpty(data)) {
      form.setFieldsValue({
        bank_info_id: data?.bank_info_id || null,
        account_number: data?.account_number || '',
        account_name: data?.account_name || '',
        sub_title: data?.sub_title || '',
        status: data?.status || '',
        exp_date: data?.exp_date || '',
      });
    } else {
      if (id) dispatch(actions.getDetail(id));
    }
  }, [data]);

  function onChange(value) {
    console.log(`selected ${value}`);
  }

  const onClear = () => {
    if (id) {
      form.setFieldsValue({
        bank_info_id: data?.bank_info_id || null,
        account_number: data?.account_number || '',
        account_name: data?.account_name || '',
        sub_title: data?.sub_title || '',
        status: data?.status || '',
        exp_date: data?.exp_date || '',
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
              'bank_info_id',
              'account_number',
              'account_name',
              'sub_title',
              'status',
            ]
          : [
              'bank_info_id',
              'account_number',
              'account_name',
              'sub_title',
              'status',
            ],
      )
    ) {
      return message.error('Vui lòng thêm thông tin!');
    }
    if (id) {
      dispatch(
        actions.update({
          id,
          data: {
            ...data,
            bank_info_id: values.bank_info_id,
            account_number: values.account_number,
            account_name: values.account_name.trim(),
            sub_title: values.sub_title.trim(),
            status: values.status,
            exp_date: values.exp_date,
          },
        }),
      );
    } else {
      dispatch(
        actions.create({
          data: {
            ...data,
            bank_info_id: values.bank_info_id,
            account_number: values.account_number,
            account_name: values.account_name.trim(),
            sub_title: values.sub_title.trim(),
            exp_date: values.exp_date,
          },
        }),
      );
    }
  };

  const layout = {
    labelCol: { xs: 24, sm: 7 },
    wrapperCol: { xs: 24, sm: 12, md: 10 },
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
          onFinish={onFinish}
        >
          <>
            <Row gutter={24}>
              <Col span={24}>
                <SectionWrapper mt={{ xs: 's4' }}>
                  <div>
                    <Item
                      name="bank_info_id"
                      label="Ngân hàng"
                      {...layout}
                      rules={[
                        {
                          required: true,
                          message: 'Vui lòng chọn ngân hàng',
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        placeholder="Chọn ngân hàng "
                        filterOption={(input, option) =>
                          option.props.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {!isEmpty(dataBankVN) &&
                          dataBankVN?.map(v => (
                            <Select.Option key={v.id} value={v.id}>
                              {v.title}
                            </Select.Option>
                          ))}
                      </Select>
                    </Item>
                    <Item
                      name="sub_title"
                      label="Chi nhánh ngân hàng"
                      {...layout}
                      rules={[
                        {
                          required: true,
                          message: 'Vui lòng chọn chi nhánh ngân hàng ',
                        },
                      ]}
                    >
                      <Input placeholder="Vui lòng nhập Chi nhánh ngân hàng" />
                    </Item>
                    <Item
                      name="account_number"
                      label="Số tài khoản"
                      {...layout}
                      rules={[
                        {
                          required: true,
                          message: 'Vui lòng nhập số tài khoản ',
                        },
                      ]}
                    >
                      <Input placeholder="Vui lòng nhập Số tài khoản" />
                    </Item>
                    <Item
                      name="account_name"
                      label="Chủ tài khoản"
                      {...layout}
                      rules={[
                        {
                          required: true,
                          message: 'Vui lòng nhập Tên chủ tài khoản ',
                        },
                      ]}
                    >
                      <Input placeholder="Vui lòng nhập Tên Tài khoản" />
                    </Item>
                    <Item
                      name="exp_date"
                      label="Ngày hết hạn"
                      {...layout}
                      rules={[
                        {
                          required: true,
                          message: 'Vui lòng nhập Ngày hết hạn ',
                        },
                      ]}
                    >
                      <Input placeholder="Vui lòng nhập Ngày hết hạn" />
                    </Item>
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
                    <Item shouldUpdate {...tailLayout}>
                      <Space>
                        <CustomButton
                          type="primary"
                          htmlType="submit"
                          className="btn-sm mr-2"
                          color="blue"
                        >
                          <span>{id ? 'Cập nhật' : 'Thêm ngân hàng'}</span>
                        </CustomButton>
                        <CustomButton
                          context="secondary"
                          color="default"
                          onClick={onClear}
                          className="btn-sm"
                        >
                          <span>Hủy bỏ</span>
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
