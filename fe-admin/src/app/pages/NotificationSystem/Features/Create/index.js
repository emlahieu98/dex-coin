import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { isEmpty } from 'lodash';
import {
  Row,
  Col,
  Spin,
  Form as F,
  // message,
  Space,
  Select,
  Radio,
  DatePicker,
  Modal,
} from 'antd';
import { selectLoading } from '../../slice/selectors';
import { useNotificationSlice } from '../../slice';
import { Button, PageWrapper, Form, Input } from 'app/components';
import { Avatar as AvatarUpload } from 'app/components/Uploads';
import { globalActions } from 'app/pages/AppPrivate/slice';
import request from 'utils/request';
import notification from 'utils/notification';
import {
  UnorderedListOutlined,
  UserOutlined,
  // SearchOutlined,
  // SaveOutlined,
  // SendOutlined,
} from '@ant-design/icons';
import { bellNotification } from 'assets/images';
import {
  CustomSectionWrapper,
  CustomColLeft,
  CustomColRight,
  Action,
  HeaderModal,
  ContentModal,
  CustomDivUser,
  CustomAvatar,
} from '../../styles/CreateNotification';
import {
  PROPOSAL_FORM,
  OPTION_TYPE_NOTIFY,
  OPTION_REPEAT,
} from '../../constants';
// import Content from './Content';

const Item = F.Item;
const { Option } = Select;
const { TextArea } = Input;

const layout = {
  labelCol: { xs: 24, sm: 7 },
  wrapperCol: { xs: 24, sm: 12, md: 10 },
};
const layoutThumb = {
  labelCol: { xs: 24, sm: 7 },
  wrapperCol: { xs: 12, sm: 6, md: 2 },
};
// const tailLayout = {
//   wrapperCol: { offset: 7, span: 16 },
// };

export function CreateNotification({ match, history }) {
  const dispatch = useDispatch();
  const { actions } = useNotificationSlice();
  const [form] = Form.useForm();
  const isLoading = useSelector(selectLoading);

  const {
    // setFieldsValue,
    // getFieldsValue,
    // resetFields,
    // isFieldsTouched,
    submit,
  } = form;
  const [isDisableChoseUsers, setIsDisableChoseUsers] = useState(true);

  const [dataAllUser, setDataAllUser] = useState([]);
  // const [dataAllUserAdmin, setDataAllUserAdmin] = useState([]);
  const [dataAllUserSupplier, setDataAllUserSupplier] = useState([]);
  const [dataAllUserSeller, setDataAllUserSeller] = useState([]);

  const [userIds, setUserIds] = useState([]);
  const [dataIdSupplier, setDataIdSupplier] = useState([]);
  const [dataIdSeller, setDataIdSeller] = useState([]);

  const [userDatas, setUserDatas] = useState([]);
  const [dataTimeAutoSend, setDataTimeAutoSend] = useState('');
  const [propose, setPropose] = useState('FORM_BASIC');
  const [isVisibleModalSetTime, setIsVisibleModalSetTime] = useState(false);

  useEffect(() => {
    return () => {
      dispatch(globalActions.setDataBreadcrumb({}));
    };
  }, []);

  useEffect(() => {
    const dataBreadcrumb = {
      menus: [
        {
          name: 'Thông báo',
          link: '/notification-system',
        },
        {
          name: 'Tạo thông báo mới',
        },
      ],
      title: 'Tạo thông báo mới',
      status: '',
      fixWidth: true,
    };
    dispatch(globalActions.setDataBreadcrumb(dataBreadcrumb));
  }, []);

  const getAllUser = async () => {
    const url = `user-service/admin/users?page=1&page_size=10000`;
    const response = await request(url, {
      method: 'get',
    })
      .then(response => {
        if (response?.data) setDataAllUser(response?.data);
      })
      .catch(error => error);
  };

  // const getAllUserAdmin = async () => {
  //   const url = `user-service/admin/users?page=1&page_size=10000&is_admin=true`;
  //   const response = await request(url, {
  //     method: 'get',
  //   })
  //     .then(response => {
  //       if (response?.data) setDataAllUserAdmin(response?.data);
  //     })
  //     .catch(error => error);
  // };

  const getAllUserSupplier = async () => {
    const url = `user-service/admin/users?page=1&page_size=10000&account_type=supplier`;
    const response = await request(url, {
      method: 'get',
    })
      .then(response => {
        if (response?.data) setDataAllUserSupplier(response?.data);
      })
      .catch(error => error);
  };

  const getAllUserSeller = async () => {
    const url = `user-service/admin/users?page=1&page_size=10000&account_type=seller`;
    const response = await request(url, {
      method: 'get',
    })
      .then(response => {
        if (response?.data) setDataAllUserSeller(response?.data);
      })
      .catch(error => error);
  };

  useEffect(() => {
    getAllUser();
    // getAllUserAdmin();
    getAllUserSupplier();
    getAllUserSeller();
  }, []);

  //Get IDs Supplier
  useEffect(() => {
    let temp = [];
    if (!isEmpty(dataAllUserSupplier)) {
      dataAllUserSupplier.map(supplier => {
        temp.push(supplier.id);
      });
    }
    setDataIdSupplier(temp);
  }, [dataAllUserSupplier]);

  //Get IDs Seller
  useEffect(() => {
    let temp = [];
    if (!isEmpty(dataAllUserSeller)) {
      dataAllUserSeller.map(seller => {
        temp.push(seller.id);
      });
    }
    setDataIdSeller(temp);
  }, [dataAllUserSeller]);

  const onChangeSetTimeSend = (date, dateString) => {
    setDataTimeAutoSend(date);
  };

  const handleSaveAndSchedule = () => {
    setIsVisibleModalSetTime(true);
  };

  const handleShowNoSupport = () => {
    notification(
      'error',
      'Chức năng đang được phát triển',
      'Chức năng chưa hỗ trợ',
      10,
    );
  };

  const handleStatusInputChoseUser = type => {
    if (type === 'user') setIsDisableChoseUsers(false);
    else if (type === 'supplier') {
      setUserIds(dataIdSupplier);
      setIsDisableChoseUsers(true);
    } else if (type === 'seller') {
      setUserIds(dataIdSeller);
      setIsDisableChoseUsers(true);
    } else if (type === 'all') {
      setIsDisableChoseUsers(true);
    }
  };

  const handleChoseUsers = values => {
    setUserIds(values);
  };

  useEffect(() => {
    if (!isEmpty(userIds)) {
      let temp = [];
      userIds.map(id => {
        temp = temp.concat(dataAllUser.filter(user => user.id === id));
      });
      setUserDatas(temp);
    }
  }, [userIds]);

  const onFinish = async values => {
    // if (
    //   !form.isFieldsTouched([
    //     'bank_info_id',
    //     'account_number',
    //     'account_name',
    //     'sub_title',
    //     'status',
    //   ])
    // ) {
    //   return message.error('Vui lòng thêm thông tin!');
    // }

    const dataFormat = {
      name: values.name.trim(),
      content: values.content.trim(),
      source: values.source.trim(),
      user_ids: userIds || [],
      metadata: {
        important: values.important,
        url: values.url || '',
        auto_send: values.auto_send || '',
        // time_auto_send: values.auto_send,
        repeat: values.repeat || '',
        thumb: values.thumb || '',
        user_datas: userDatas || [],
      },
    };
    await dispatch(
      actions.createNotify({
        data: dataFormat,
      }),
    );
    await onClear();
  };

  const onCloseModal = () => {
    setIsVisibleModalSetTime(false);
  };

  const onClear = () => {
    form.resetFields();
    setIsDisableChoseUsers(true);
    setUserIds([]);
    setUserDatas([]);
    setDataTimeAutoSend('');
  };

  return (
    <PageWrapper fixWidth>
      <Spin tip="Đang tải..." spinning={isLoading}>
        <CustomSectionWrapper>
          <Row gutter={24}>
            <CustomColLeft xs={10} sm={6}>
              <div className="title-propose">
                <UnorderedListOutlined />
                &ensp;Mẫu đề xuất
              </div>
              <div className="list-propose">
                {PROPOSAL_FORM.map((item, index) => (
                  <div
                    className={
                      propose === item.key
                        ? 'item-propose selected'
                        : 'item-propose'
                    }
                    onClick={() => setPropose(item.key)}
                  >
                    <div className="icon">{item.icon}</div>
                    <div className="name">{item.name}</div>
                  </div>
                ))}
              </div>
              {/* <div className="btn-action">
                <Button className="btn-sm " onClick={handleShowNoSupport}>
                  + Tạo mẫu đề xuất
                </Button>
              </div> */}
            </CustomColLeft>
            <CustomColRight xs={14} sm={18}>
              <div className="title">Nội dung thông báo</div>
              <div className="form">
                <Form
                  form={form}
                  name="form-content-notify"
                  onFinish={onFinish}
                >
                  <>
                    <Row gutter={24}>
                      <Col span={24}>
                        <Item name="thumb" label="Ảnh" {...layoutThumb}>
                          <AvatarUpload
                          //  onChange={onChangeImgNotify}
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
                          <Input placeholder="Nhập tiêu đề thông báo" />
                        </Item>
                        <Item
                          name="source"
                          label="Loại thông báo:"
                          {...layout}
                          rules={[
                            {
                              required: true,
                              message: 'Vui lòng chọn Loại thông báo ',
                            },
                          ]}
                        >
                          <Select
                            options={OPTION_TYPE_NOTIFY}
                            placeholder="Loại thông báo"
                            onSelect={handleStatusInputChoseUser}
                          >
                            {OPTION_TYPE_NOTIFY.map(item => (
                              <Option value={item.value} key={item.id}>
                                {item.label}
                              </Option>
                            ))}
                          </Select>
                        </Item>
                        <Item
                          name="user_ids"
                          label="Đối tượng nhận cụ thể"
                          {...layout}
                        >
                          <Select
                            mode="multiple"
                            allowClear
                            optionLabelProp="label"
                            optionFilterProp="label"
                            onChange={handleChoseUsers}
                            maxTagCount="responsive"
                            placeholder="Chọn đối tượng"
                            disabled={isDisableChoseUsers}
                          >
                            {dataAllUser?.map((item, index) => {
                              return (
                                <Option
                                  value={item.id}
                                  key={index}
                                  label={item.full_name}
                                >
                                  {/* {item.full_name} */}
                                  <CustomDivUser>
                                    <CustomAvatar
                                      src={item?.avatar?.origin}
                                      icon={<UserOutlined />}
                                    />
                                    <div className="user-info">
                                      <div className="user-name">
                                        {item?.full_name
                                          ? item?.full_name
                                          : item?.email}
                                      </div>
                                      <div className="user-type">
                                        {item?.account_type}
                                      </div>
                                    </div>
                                  </CustomDivUser>
                                </Option>
                              );
                            })}
                          </Select>
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
                            // defaultValue={false}
                            style={{ color: 'blue' }}
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
                            placeholder="Nhập nội dung thông báo"
                          />
                        </Item>
                        <Item name="url" label="Đường dẫn url" {...layout}>
                          <Input placeholder="Nhập đường dẫn url" />
                        </Item>

                        <Item name="repeat" label="Lặp lại" {...layout}>
                          <Select
                            placeholder="Thời gian"
                            style={{ width: '160px' }}
                            // onSelect={handleSelectCountry}
                          >
                            {OPTION_REPEAT.map(item => (
                              <Option value={item.value} key={item.id}>
                                {item.label}
                              </Option>
                            ))}
                          </Select>
                        </Item>
                      </Col>
                    </Row>
                  </>
                </Form>
              </div>
              {/* <div className="bottom-action"></div> */}
            </CustomColRight>
          </Row>
        </CustomSectionWrapper>
        <Action>
          <Space>
            <Button
              context="secondary"
              color="orange"
              onClick={onClear}
              className="btn-sm"
            >
              Hủy
            </Button>
            <Button onClick={() => handleSaveAndSchedule()} className="btn-sm">
              Lên lịch gửi
            </Button>
            <Button className="btn-sm" onClick={submit}>
              Gửi ngay
            </Button>
          </Space>
        </Action>
        <Modal
          name="modal-set-time-auto-send"
          visible={isVisibleModalSetTime}
          footer={null}
          // width={450}
          onCancel={onCloseModal}
        >
          <HeaderModal>
            <img className="modal-img" src={bellNotification} alt="" />

            <div className="modal-title">Lên lịch gửi thông báo tự động</div>
            <div className="modal-desc">
              Vui lòng chọn mốc thời gian, hệ thống sẽ tự động gửi thông báo nay
              !
            </div>
          </HeaderModal>
          <ContentModal>
            <div className="item">
              <div className="label">Hình thức</div>
              <Radio.Group
                defaultValue="auto_send"
                style={{ color: 'blue' }}
                disabled={true}
              >
                <Radio value="auto_send">Tự động gửi</Radio>
              </Radio.Group>
            </div>
            <div className="item chose-time">
              <div className="label">Mốc thời gian gửi</div>
              {isVisibleModalSetTime && (
                <>
                  <DatePicker
                    // renderExtraFooter={() => ''}
                    showTime
                    showNow={false}
                    onChange={onChangeSetTimeSend}
                    format="DD/MM/YYYY HH:mm"
                    placeholder="Thời điểm thông báo được gửi"
                    style={{ width: '300px' }}
                  />
                </>
              )}
            </div>
          </ContentModal>
          <Action>
            <Space>
              <Button
                context="secondary"
                color="orange"
                onClick={onCloseModal}
                className="btn-sm"
              >
                Hủy
              </Button>
              <Button
                onClick={handleShowNoSupport}
                // onClick={submit}
                className="btn-sm"
              >
                Lưu
              </Button>
            </Space>
          </Action>
        </Modal>
      </Spin>
    </PageWrapper>
  );
}
