import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';
import { globalActions } from 'app/pages/AppPrivate/slice';
import { Row, Col, Spin, Tabs, Skeleton, Modal } from 'antd';
import {
  selectLoading,
  selectDetail,
  selectDataRoles,
} from '../../slice/selectors';
import { useUsersSlice } from '../../slice';
import { SectionWrapper } from 'styles/commons';
import { PageWrapper, Form, Button } from 'app/components';
import { formatDate } from 'utils/helpers';

import { Info, Role } from '../../Components/ComponentsTabDetail';
import { InfoStatus } from '../../Components';

const { TabPane } = Tabs;

const layout = {
  labelCol: { xs: 24, sm: 24 },
  wrapperCol: { xs: 24, sm: 24, md: 24 },
  labelAlign: 'left',
};

export function Detail({ match }) {
  const { t } = useTranslation();
  const id = match?.params?.id;
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { actions } = useUsersSlice();
  const isLoading = useSelector(selectLoading);
  const data = useSelector(selectDetail);
  const dataRoles = useSelector(selectDataRoles);

  const [dataRolesFormat, setDataRolesFormat] = useState([]);
  const [role_ids, setRole_Ids] = useState('');
  const [visiableModalConfirm, setVisiableModalConfirm] = useState(false);

  useEffect(() => {
    dispatch(actions.getDataRoles({}));
    return () => {
      dispatch(globalActions.setDataBreadcrumb({}));
      dispatch(actions.getDetailDone({}));
    };
  }, []);

  useEffect(() => {
    const setRoleIds = () => {
      if (!isEmpty(data)) {
        const temp = [];
        data.roles.map(item => {
          temp.push(item.id.toString());
        });
        setRole_Ids(temp);
      }
    };
    setRoleIds();
  }, [data]);

  useEffect(() => {
    const formatDataRoles = () => {
      if (!isEmpty(dataRoles)) {
        const temp = dataRoles
          .map(item => {
            return {
              ...item,
              titleFormat: item.title.includes('partner_')
                ? item.title.replace('partner_', 'Partner ')
                : item.title.includes('admin_')
                ? item.title.replace('admin_', 'Admin ')
                : item.title.includes('super_a')
                ? item.title.replace('super_a', 'Super A')
                : item.title,
            };
          })
          .map(item2 => {
            return {
              ...item2,
              titleFormat:
                item2.titleFormat.charAt(0).toUpperCase() +
                item2.titleFormat.substr(1),
            };
          });
        setDataRolesFormat(temp);
      }
    };
    formatDataRoles();
  }, [dataRoles]);

  useEffect(() => {
    const dataBreadcrumb = {
      menus: [
        {
          name: 'Người dùng',
          link: '/users',
        },
        {
          name: 'Thông tin người dùng',
        },
      ],
      title: '',
      fixWidth: true,
      // status: '',
      // actions: (
      //   <Button
      //     className="btn-sm mr-2"
      //     onClick={handleUpdateRoles}
      //     color="blue"
      //   >
      //     <span>Lưu</span>
      //   </Button>
      // ),
    };
    if (!isEmpty(data)) {
      dataBreadcrumb.title = data?.full_name ? data?.full_name : data?.email;
      // dataBreadcrumb.status = data.status;
    } else {
      if (id) {
        dispatch(actions.getDetail(id));
      }
    }
    dispatch(globalActions.setDataBreadcrumb(dataBreadcrumb));
  }, [data]);

  const handleUpdate = async () => {
    await dispatch(
      actions.updateUser({
        id,
        data: {
          status: data?.status === 'active' ? 'inactive' : 'active',
        },
      }),
    );
  };

  const onChangeRole = values => {
    setRole_Ids(values);
  };

  const handleUpdateRoles = async () => {
    setVisiableModalConfirm(false);
    await dispatch(
      actions.updateRolesUser({
        id,
        data: {
          user_id: id,
          role_ids: role_ids,
        },
      }),
    );
  };

  return (
    <PageWrapper fixWidth>
      <Spin tip="Đang tải..." spinning={isLoading}>
        <CustomForm
          {...layout}
          form={form}
          name="profile"
          fields={[
            {
              name: ['id'],
              value: data?.id || '',
            },
            {
              name: ['created_at'],
              value: formatDate(data?.created_at) || '',
            },
            {
              name: ['full_name'],
              value: data?.full_name || '',
            },
            {
              name: ['first_name'],
              value: data?.first_name || '',
            },
            {
              name: ['last_name'],
              value: data?.last_name || '',
            },
            {
              name: ['account_type'],
              // value:
              //   [
              //     data?.is_admin ? 'is_admin' : '',
              //     data?.is_supplier ? 'is_supplier' : '',
              //     data?.is_seller ? 'is_seller' : '',
              //   ] || '',
              value: data?.account_type || '',
            },
            {
              name: ['gender'],
              value: data?.gender || '',
            },
            {
              name: ['email'],
              value: data?.email || '',
            },
            {
              name: ['phone'],
              value: data?.phone || '',
            },
            {
              name: ['country'],
              value: data?.country || '',
            },
            {
              name: ['province'],
              value: data?.province || '',
            },
            {
              name: ['address'],
              value: data?.address || '',
            },
            {
              name: ['role_ids'],
              value: role_ids,
            },
          ]}
        >
          <Row gutter={24}>
            <Col xs={24} sm={24} md={24} lg={7}>
              <CustomSectionWrapper>
                {isLoading ? (
                  <Skeleton active paragraph={{ rows: 9 }} />
                ) : (
                  <InfoStatus
                    data={data}
                    t={t}
                    isLoading={isLoading}
                    handleUpdate={handleUpdate}
                  ></InfoStatus>
                )}
              </CustomSectionWrapper>
            </Col>
            <Col xs={24} sm={24} md={24} lg={17}>
              <CustomSectionWrapper>
                {isLoading ? (
                  <Skeleton active paragraph={{ rows: 16 }} />
                ) : (
                  <Tabs defaultActiveKey="1" type="card">
                    <TabPane tab="Thông tin" key="1">
                      <Info data={data} t={t} isLoading={isLoading}></Info>
                    </TabPane>
                    <TabPane tab="Phân quyền" key="2">
                      <Role
                        data={data}
                        t={t}
                        isLoading={isLoading}
                        // role_ids={role_ids}
                        dataRolesFormat={dataRolesFormat}
                        onChangeRole={onChangeRole}
                        handleUpdateRoles={handleUpdateRoles}
                        setVisiableModalConfirm={setVisiableModalConfirm}
                      ></Role>
                    </TabPane>
                  </Tabs>
                )}
              </CustomSectionWrapper>
            </Col>
          </Row>
        </CustomForm>
        <CustomModal
          name="modal__confirm"
          className="modal__confirm"
          visible={visiableModalConfirm}
          footer={null}
          onCancel={() => setVisiableModalConfirm(!visiableModalConfirm)}
        >
          <div className="modal__title">Xác nhận thay đổi quyền người dùng</div>
          <div className="modal__content">
            Sự thay đổi quyền quản trị của người dùng ảnh hưởng đến tài nguyên
            và công việc trong hệ thống.
            <br />
            Bạn có chắc chắn về sự thay đổi này ?
          </div>
          <div className="modal__btn">
            <Button
              context="secondary"
              className="btn-sm"
              color="default"
              style={{
                color: 'white',
                background: '#6C798F',
              }}
              width="200px"
              onClick={() => setVisiableModalConfirm(!visiableModalConfirm)}
            >
              Hủy
            </Button>
            <Button
              className="btn-sm"
              color="blue"
              width="200px"
              onClick={handleUpdateRoles}
            >
              Xác nhận
            </Button>
          </div>
        </CustomModal>
      </Spin>
    </PageWrapper>
  );
}
const CustomSectionWrapper = styled(SectionWrapper)`
  padding-bottom: 0;
  border-radius: 4px;
  border: 1px solid #ebebf0;
  box-shadow: 0px 4px 10px rgba(30, 70, 117, 0.05);
  .ant-radio-inner::after {
    background-color: #727374;
  }
  .ant-checkbox-disabled.ant-checkbox-checked .ant-checkbox-inner::after {
    border-color: rgb(40 9 9 / 63%);
  }
  .title-info {
    color: #828282;
  }
  .txt-name {
    margin-top: 14px;
    font-weight: bold;
    font-size: 16px;
    line-height: 19px;
  }
  .txt-phone {
    color: #2f80ed;
  }
  .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
    color: #3d56a6;
  }
  .status {
    padding: 12px;
    border: 1px solid #ebebf0;
    border-radius: 4px;
  }
`;

const CustomForm = styled(Form)`
  .mb-0 {
    margin: 0;
  }
  .mt-16 {
    margin-top: 16px;
  }
  .mt-24 {
    margin-top: 24px;
  }
  .title-special {
    font-weight: bold;
    &.super-admin {
      color: red;
    }
  }
  img {
    width: 108px;
    height: 108px;
    border-radius: 50%;
  }
  .item-label {
    margin: auto 16px auto 0;
    font-weight: bold;
  }
  label {
    font-weight: bold;
  }
  .ant-input[disabled] {
    color: #333333;
  }
  .ant-checkbox-disabled + span {
    color: #333333;
  }
  .ant-radio-disabled + span {
    color: #333333;
  }
  .CustomCol {
    padding-left: 60px !important;
    &:first-child {
      border-right: 2px solid #b1aeae;
    }
    &:last-child {
      padding-left: 100px !important;
    }
  }
  .title {
    font-weight: 600;
    font-size: 16px;
    color: #3e57a6;
    margin-bottom: 18px;
  }
  .item-role {
    margin-top: 12px;
    .ant-checkbox {
      position: relative;
      top: 12px;
      span {
        position: 12px;
      }
    }
    .title-role {
      font-weight: 600;
      font-size: 14px;
      line-height: 19px;
      color: #333333;
    }
    .content-role {
      font-size: 14px;
      line-height: 19px;
      color: #333333;
      font-weight: normal;
    }
  }
  .ant-checkbox-wrapper {
    margin-left: unset;
  }
`;

const CustomModal = styled(Modal)`
  .ant-modal-content {
    margin-top: 45%;
  }
  .modal {
    &__title {
      font-size: 18px;
      font-weight: 500;
      text-align: center;
    }
    &__content {
      margin-top: 12px;
      color: gray;
      font-size: 14px;
      text-align: center;
    }
    &__btn {
      margin-top: 32px;
      display: flex;
      justify-content: space-between;
    }
  }
`;
