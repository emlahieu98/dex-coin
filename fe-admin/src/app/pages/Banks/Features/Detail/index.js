import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components/macro';
import { isEmpty } from 'lodash';
import { globalActions } from 'app/pages/AppPrivate/slice';
import { Row, Col, Spin, Space, Form as F } from 'antd';
import { selectLoading, selectDetail } from '../../slice/selectors';
import { useBanksSlice } from '../../slice';
import { Button, PageWrapper, Input, Form, Image } from 'app/components';

import { SectionWrapper } from 'styles/commons';

const Item = F.Item;

export function Detail({ match, history }) {
  const id = match?.params?.id;
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { actions } = useBanksSlice();
  const isLoading = useSelector(selectLoading);
  // const [variations, setVariations] = useState([]);
  const data = useSelector(selectDetail);

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
          name: 'Ngân hàng',
          link: '/setting/banks',
        },
        {
          name: 'Chi Tiết',
        },
      ],
      title: '',
      status: '',
    };
    if (!isEmpty(data)) {
      dataBreadcrumb.title = data?.bank_data?.title;
      dataBreadcrumb.status = data?.status;
    } else {
      if (id) dispatch(actions.getDetail(id));
    }
    dispatch(globalActions.setDataBreadcrumb(dataBreadcrumb));
  }, [data]);

  // const goBack = () => {
  //   history.push('/setting/banks');
  // };
  const goUpdate = () => {
    history.push(`/setting/banks/uc/${id}`);
  };

  const layout = {
    labelCol: { xs: 24, sm: 7 },
    wrapperCol: { xs: 24, sm: 12, md: 10 },
  };
  const tailLayout = {
    wrapperCol: { offset: 7, span: 16 },
  };
  return (
    <CustomPageWrapper>
      <Spin tip="Đang tải..." spinning={isLoading}>
        <Form
          form={form}
          name="form-detail"
          fields={[
            {
              name: ['id'],
              value: data?.id || '',
            },
            {
              name: ['bank_info_id'],
              value: data?.bank_data?.title || '',
            },
            {
              name: ['sub_title'],
              value: data?.sub_title || '',
            },
            {
              name: ['account_number'],
              value: data?.account_number || '',
            },
            {
              name: ['account_name'],
              value: data?.account_name || '',
            },
            {
              name: ['status'],
              value: data?.status ? 'Hoạt động' : 'Dừng hoạt động' || '',
            },
          ]}
          disabled={true}
        >
          <>
            <Row gutter={24}>
              <Col span={24}>
                <SectionWrapper mt={{ xs: 's4' }}>
                  <div className="">
                    <CusItem label="Logo ngân hàng" {...layout}>
                      <div className="logo">
                        <Image
                          className="img"
                          size="108x108"
                          // src={'https://i.odii.xyz/' + data?.logo?.location}
                          src={
                            data?.bank_data?.logo?.location
                              ? 'https://i.odii.xyz/' +
                                data?.bank_data?.logo?.location
                              : ''
                          }
                          alt="logobank"
                        />
                      </div>
                    </CusItem>
                    <Item name="id" label="ID ngân hàng" {...layout}>
                      <Input />
                    </Item>
                    <Item name="bank_info_id" label="Tên ngân hàng" {...layout}>
                      <Input />
                    </Item>
                    <Item
                      name="sub_title"
                      label="Chi nhánh ngân hàng"
                      {...layout}
                    >
                      <Input />
                    </Item>
                    <Item
                      name="account_number"
                      label="Số tài khoản"
                      {...layout}
                    >
                      <Input />
                    </Item>
                    <Item name="account_name" label="Chủ tài khoản" {...layout}>
                      <Input />
                    </Item>
                    <Item name="status" label="Trạng thái:" {...layout}>
                      <Input />
                    </Item>
                    <Item shouldUpdate {...tailLayout}>
                      <Space>
                        <CustomButton
                          type="primary"
                          className="btn-md mr-2"
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
    </CustomPageWrapper>
  );
}
const CustomPageWrapper = styled(PageWrapper)`
  .ant-input[disabled] {
    color: #333333;
  }
`;

const CusItem = styled(Item)`
  .ant-image {
    border: 1px solid #ebebf0;
  }
  .ant-form-item-label {
    margin: auto 0;
  }
  .logo {
    display: flex;
  }
  .img {
    width: 108px;
    height: 108px;
    background: fff;
  }
  .btn-upload {
    margin: auto 0 auto 16px;
  }
  .noteUploadLogo {
    margin-top: 8px;
    font-size: 14px;
    line-height: 22px;
    margin-bottom: auto;
    width: max-content;
    color: rgba(0, 0, 0, 0.45);
  }
`;

const CustomButton = styled(Button)`
  padding: 5px 16px;
  box-shadow: 0px 2px 0px rgba(0, 0, 0, 0.043);
  border-radius: 2px;
`;
