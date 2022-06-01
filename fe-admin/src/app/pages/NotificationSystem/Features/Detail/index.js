import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { isEmpty } from 'lodash';
import {
  Row,
  Col,
  Spin,
  Form as F,
  // message,
  Radio,
  Popover,
  Divider,
} from 'antd';
import { selectLoading, selectDetail } from '../../slice/selectors';
import { useNotificationSlice } from '../../slice';
import { PageWrapper, Form, Input, Avatar, BoxColor } from 'app/components';
import { Avatar as AvatarUpload } from 'app/components/Uploads';
import { globalActions } from 'app/pages/AppPrivate/slice';
import { SectionWrapper } from 'styles/commons';
// import request from 'utils/request';
import constants from 'assets/constants';
import { UserOutlined } from '@ant-design/icons';
import { formatDate } from 'utils/helpers';
// import { bellNotification } from 'assets/images';
// import Content from './Content';

const Item = F.Item;
const { TextArea } = Input;

export function Detail({ match, history }) {
  const id = match?.params?.id;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { actions } = useNotificationSlice();
  const isLoading = useSelector(selectLoading);
  const data = useSelector(selectDetail);
  const [currentStatus, setCurrentStatus] = useState('');

  useEffect(() => {
    return () => {
      dispatch(globalActions.setDataBreadcrumb({}));
      dispatch(actions.getDetailDone({}));
    };
  }, []);

  useEffect(() => {
    if (!isEmpty(data)) {
      let temp = constants.NOTIFICATION_STATUS.find(v => v.id === data?.status);
      setCurrentStatus(temp);
      form.setFieldsValue({
        id: data?.id || '',
        name: data?.name || '',
        // thumb: data?.metadata?.thumb || null,
        content: data?.content || '',
        source: t(`notifications.source.${data?.source}`) || '',
        important: data?.metadata?.important || '',
        url: data?.metadata?.url || '',
        users_ids: data?.metadata?.users_ids || [],
        auto_send: data?.metadata?.auto_send || '',
        repeat: t(`notifications.repeat.${data?.metadata?.repeat}`) || '',
        created_at: formatDate(data?.created_at) || '',
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
          name: 'Danh sách thông báo',
          link: '/notification-system',
        },
        {
          name: 'Chi tiết thông báo',
        },
      ],
      title: '',
      status: '',
      fixWidth: true,
    };
    if (!isEmpty(data)) {
      dataBreadcrumb.title = data?.name;
      dataBreadcrumb.status = data?.status;
    } else {
      if (id) dispatch(actions.getDetail(id));
    }
    dispatch(globalActions.setDataBreadcrumb(dataBreadcrumb));
  }, [data]);

  const layout = {
    labelCol: { xs: 24, sm: 7 },
    wrapperCol: { xs: 24, sm: 12, md: 10 },
  };
  const layoutThumb = {
    labelCol: { xs: 24, sm: 7 },
    wrapperCol: { xs: 12, sm: 6, md: 2 },
  };

  const infoUser = dataUser => (
    <CustomDivInfoUser>
      <div className="left">
        <CustomAvatar src={dataUser?.avatar?.origin} icon={<UserOutlined />} />
      </div>
      <Divider type="vertical" />
      <div className="right">
        <div className="user-name">
          {dataUser?.full_name ? dataUser?.full_name + ' - ' : ''}
          <span className="user-source">{dataUser?.account_type}</span>
        </div>
        <div className="user-phone">{dataUser?.phone}</div>
        <div className="user-email">{dataUser?.email}</div>
      </div>
    </CustomDivInfoUser>
  );

  return (
    <PageWrapper fixWidth>
      <Spin tip="Đang tải..." spinning={isLoading}>
        <CustomSectionWrapper>
          <Form
            form={form}
            name="form-content-notify"
            // onFinish={onFinish}
            disabled={true}
          >
            <>
              <Row gutter={24}>
                <Col span={24}>
                  <Item name="thumb" label="Ảnh" {...layoutThumb}>
                    <AvatarUpload
                      // src={data?.metadata?.thumb?.origin}
                      data={data?.metadata?.thumb}
                      disabled={true}
                    />
                  </Item>
                  <Item
                    name="name"
                    label="Tiêu đề thông báo"
                    {...layout}
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập tiêu đề thông báo ',
                      },
                    ]}
                  >
                    <Input placeholder="Tiêu đề thông báo" />
                  </Item>
                  <Item
                    name="source"
                    label="Loại thông báo"
                    {...layout}
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng chọn loại thông báo ',
                      },
                    ]}
                  >
                    <Input placeholder="Loại thông báo" />
                  </Item>
                  <Item
                    name="users_ids"
                    label="Đối tượng nhận thông báo cụ thể"
                    {...layout}
                  >
                    <div>
                      {data?.source === 'user' &&
                      !isEmpty(data?.metadata?.user_datas)
                        ? data?.metadata?.user_datas?.map((item, index) => {
                            return (
                              <Popover
                                placement="bottomLeft"
                                content={infoUser(item)}
                                trigger="hover"
                              >
                                <CustomAvatar
                                  src={item?.avatar?.origin}
                                  icon={<UserOutlined />}
                                />
                              </Popover>
                            );
                          })
                        : 'Không'}
                    </div>
                  </Item>
                  <Item
                    name="important"
                    label="Quan trọng"
                    {...layout}
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng chọn',
                      },
                    ]}
                  >
                    <Radio.Group
                      // defaultValue={data?.metadata?.important}
                      style={{ color: 'blue' }}
                      disabled={true}
                    >
                      <Radio value={true}>Có</Radio>
                      <Radio value={false}>Không</Radio>
                    </Radio.Group>
                  </Item>
                  <Item
                    name="content"
                    label="Nội dung"
                    {...layout}
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập nội dung thông báo ',
                      },
                    ]}
                  >
                    <TextArea
                      className="textArea"
                      showCount
                      maxLength={300}
                      rows={5}
                      placeholder="Nội dung thông báo"
                      disabled={true}
                    />
                  </Item>
                  <Item name="url" label="Đường dẫn url" {...layout}>
                    <Input placeholder="Đường dẫn url" />
                  </Item>

                  <Item name="type_send" label="Hình thức gửi" {...layout}>
                    <div className="d-flex">
                      <Radio.Group
                        value={data?.metadata?.auto_send ? true : false}
                        style={{ color: 'blue' }}
                        className="radio-group"
                        disabled={true}
                      >
                        <Radio value={false}>Thủ công</Radio>
                        <Radio value={true}>Tự động</Radio>
                      </Radio.Group>
                      <Input
                        value={
                          data?.metadata?.auto_send &&
                          data?.metadata?.time_auto_send
                            ? data?.metadata?.time_auto_send
                            : ''
                        }
                        placeholder="Mốc thời gian gửi"
                        style={{ width: '200px' }}
                      />
                    </div>
                  </Item>
                  <Item name="repeat" label="Lặp lại" {...layout}>
                    <Input placeholder="Thời gian" style={{ width: '160px' }} />
                  </Item>
                  <Item name="created_at" label="Khởi tạo lúc" {...layout}>
                    <Input placeholder="Thời gian khởi tạo" />
                  </Item>
                  <Item name="status" label="Trạng thái" {...layout}>
                    <BoxColor colorValue={currentStatus?.color}>
                      {currentStatus?.name}
                    </BoxColor>
                  </Item>
                </Col>
              </Row>
            </>
          </Form>
        </CustomSectionWrapper>
      </Spin>
    </PageWrapper>
  );
}

const CustomSectionWrapper = styled(SectionWrapper)`
  .display-none {
    display: none;
  }
  .ant-form-item-label {
    margin-right: 40px;
  }
  .radio-group {
    margin-top: 6px;
  }
  .ant-input[disabled] {
    color: #333333;
  }
  .ant-radio-inner::after {
    background-color: #727374;
  }
`;
const CustomAvatar = styled(Avatar)`
  width: 24px;
  height: 24px;
  margin-left: 8px;
  margin-top: -6px;
  &:hover {
    cursor: pointer;
  }
`;

const CustomDivInfoUser = styled.div`
  display: flex;
  .left {
    .ant-avatar.ant-avatar-icon {
      width: 45px;
      height: 45px;
      margin-left: -8px;
      margin-top: 4px;
    }
  }
  .ant-divider {
    height: auto;
  }
  .right {
    .user {
      &-name {
        font-weight: 500;
        font-size: 16px;
        line-height: 21px;
      }
      &-source {
        font-weight: 500;
        font-size: 16px;
        line-height: 21px;
      }
      &-phone {
        margin-top: 4px;
        font-size: 12px;
        color: rgb(130, 130, 130);
        line-height: 16px;
      }
      &-email {
        font-size: 12px;
        color: rgb(130, 130, 130);
        line-height: 16px;
      }
    }
  }
`;
