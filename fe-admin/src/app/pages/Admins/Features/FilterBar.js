import React, { useState, useEffect, memo, useRef } from 'react';
import { Space, Row, Col, Modal, Divider, Checkbox } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { Input, Select, Button, Form, LoadingIndicator } from 'app/components';
import { SearchOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import Filter from 'app/hooks/Filter';
import constants from 'assets/constants';
import { CustomStyle } from 'styles/commons';
import { isEmpty } from 'lodash';
import { useAdminsSlice } from '../slice';
import { selectDataRoles } from '../slice/selectors';

const { Option } = Select;
const Item = Form.Item;
// const layout = {
//   labelCol: { xs: 24, sm: 24 },
//   wrapperCol: { xs: 24, sm: 24, md: 24 },
//   labelAlign: 'left',
// };

const TypeAccountOptions = [
  { value: 'is_admin', label: 'Admin' },
  { value: 'is_supplier', label: 'Supplier' },
  { value: 'is_seller', label: 'Seller' },
];
const initState = {
  keyword: '',
  typeaccount: '',
  status: '',
  // dateString: '',
};

const FilterBar = memo(function FilterBar({ isLoading, showAction }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { actions } = useAdminsSlice();
  const ref = useRef(null);
  const dataRoles = useSelector(selectDataRoles);

  const [filter, setFilter] = useState(initState);
  const [isMissRole, setIsMissRole] = useState('');
  const [visibleModal, setVisibleModal] = useState(false);
  const [dataRolesFormat, setDataRolesFormat] = useState([]);
  const [role_ids, setRole_Ids] = useState([]);

  const { resetFields } = form;

  useEffect(() => {
    dispatch(actions.getDataRoles({}));
    // return () => {};
  }, []);

  useEffect(() => {
    const formatDataRoles = () => {
      if (!isEmpty(dataRoles)) {
        const temp = dataRoles
          .filter(item => item?.title?.includes('admin'))
          .map(item1 => {
            return {
              ...item1,
              titleFormat: item1?.title?.includes('partner_')
                ? item1?.title?.replace('partner_', 'Partner ')
                : item1?.title?.includes('admin_')
                ? item1?.title?.replace('admin_', 'Admin ')
                : item1?.title?.includes('super_a')
                ? item1?.title?.replace('super_a', 'Super A')
                : item1?.title,
            };
          })
          .map(item2 => {
            return {
              ...item2,
              titleFormat:
                item2?.titleFormat?.charAt(0).toUpperCase() +
                item2?.titleFormat?.substr(1),
            };
          });
        setDataRolesFormat(temp);
      }
    };
    formatDataRoles();
  }, [dataRoles]);

  const handleFilter = (type, needRefresh) => e => {
    const value = (e?.target?.value ?? e) || '';
    const values = { ...filter, [type]: value };
    if (e.type === 'click' || needRefresh) {
      if (ref.current) {
        ref.current.callBack(values);
      }
    }
    setFilter(values);
  };

  const onChangeRole = values => {
    setRole_Ids(values);
    // if (values.includes('1')) {
    //   setIsDisabled(true);
    //   setRole_Ids(['1']);
    // }
  };

  const onFinish = values => {
    if (isEmpty(role_ids)) {
      setIsMissRole(true);
    } else {
      setIsMissRole(false);
      dispatch(
        actions.createAdmin({
          data: {
            full_name: values.full_name.trim(),
            email: values.email.trim(),
            role_ids: role_ids,
          },
        }),
      );
      onClose();
    }
  };

  const onClose = () => {
    setVisibleModal(false);
    onClear();
  };

  const onClear = () => {
    setRole_Ids([]);
    resetFields();
  };

  return (
    <>
      <CustomModal
        form={form}
        name="modal_add-admin"
        visible={visibleModal}
        footer={null}
        onCancel={onClose}
        style={{ height: 'calc(100vh - 200px)' }}
        bodyStyle={{ overflowY: 'scroll' }}
      >
        {isLoading && <LoadingIndicator />}
        <Form form={form} name="form_add-admin" onFinish={onFinish}>
          <Item>
            <div className="title">Thêm tài khoản quản trị viên</div>
            <div className="content">
              Thêm tài khoản quản trị viên tham gia quản trị hệ thống cùng với
              bạn.
            </div>
          </Item>
          <CustomItem
            name="full_name"
            label="Họ và tên"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập đầy đủ Họ và tên ',
              },
            ]}
          >
            <Input placeholder="Họ tên quản trị viên" />
          </CustomItem>
          <CustomItem
            name="email"
            label="Email quản trị viên"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập email',
              },
              {
                type: 'email',
                message: 'Email chưa đúng định dạng',
              },
            ]}
          >
            <Input placeholder="Email quản trị viên" />
          </CustomItem>
          <CustomItem name="role_ids" label="Vai trò" className="required">
            <div className="label-desc">Phân quyền quản lý </div>
            <Checkbox.Group style={{ width: '100%' }} onChange={onChangeRole}>
              {dataRolesFormat
                ? dataRolesFormat?.map((role, index) => (
                    <Checkbox
                      value={role?.id}
                      key={index}
                      // disabled={role?.id === '1' ? false : isDisabled}
                      // onClick={
                      //   role?.id === '1'
                      //     ? () => setIsDisabled(!isDisabled)
                      //     : // setIsChecked(!isChecked)
                      //       ''
                      // }
                    >
                      <div
                        className={
                          role?.titleFormat === 'Super Admin'
                            ? 'role-title red'
                            : 'role-title'
                        }
                      >
                        {role?.titleFormat}
                      </div>
                      <div className="role-desc">{role?.description}</div>
                    </Checkbox>
                  ))
                : ''}
            </Checkbox.Group>
          </CustomItem>
          <Divider />
          <div className="d-flex justify-content-between">
            {isMissRole ? (
              <TxtRequired>Hãy phân quyền quản trị cho tài khoản</TxtRequired>
            ) : (
              <div></div>
            )}
            <Space align="end">
              <Button
                context="secondary"
                className="btn-sm"
                color="default"
                style={{
                  color: 'white',
                  background: '#6C798F',
                }}
                onClick={onClose}
              >
                Hủy
              </Button>
              <Button
                type="primary"
                className="btn-sm"
                color="blue"
                htmlType="submit"
              >
                Hoàn tất
              </Button>
            </Space>
          </div>
        </Form>
      </CustomModal>
      <Filter
        initState={initState}
        filter={filter}
        setFilter={setFilter}
        ref={ref}
      >
        <CusRow gutter={[8, 8]}>
          <Col xs={24} lg={8}>
            <Input
              allowClear
              style={{ width: '100%' }}
              placeholder="Bạn đang tìm kiếm gì ?"
              disabled={isLoading}
              prefix={<SearchOutlined />}
              value={filter.keyword}
              onChange={handleFilter('keyword')}
            />
          </Col>
          <Col xs={24} flex="auto">
            <div className="d-flex justify-content-end">
              <Space>
                <CustomStyle w="140px">
                  <Select
                    value={filter?.typeaccount || 0}
                    onSelect={handleFilter('type', true)}
                    style={{ width: 150 }}
                  >
                    <Option value={0}>Tất cả tài khoản</Option>
                    {TypeAccountOptions?.map(v => (
                      <Option value={v.id}>{v.label}</Option>
                    ))}
                  </Select>
                </CustomStyle>
                <CustomStyle w="140px">
                  <Select
                    value={filter?.status || 0}
                    onSelect={handleFilter('status', true)}
                    style={{ width: 150 }}
                  >
                    <Option value={0}>Tất cả trạng thái</Option>
                    {constants?.USER_STATUS?.map(v => (
                      <Option value={v.id}>{v.name}</Option>
                    ))}
                  </Select>
                </CustomStyle>
                <CustomStyle>
                  {showAction && (
                    <Button
                      className="btn-sm"
                      onClick={() => setVisibleModal(true)}
                      width="68"
                      disabled={isLoading}
                    >
                      + &nbsp;<span>Thêm quản trị viên</span>
                    </Button>
                  )}
                </CustomStyle>
              </Space>
            </div>
          </Col>
        </CusRow>
      </Filter>
    </>
  );
});

export default FilterBar;

const TxtRequired = styled.div`
  color: #ff4d4f;
`;

const CusRow = styled(Row)`
  .anticon-search {
    vertical-align: 0;
  }
`;

const CustomModal = styled(Modal)`
  .ant-modal-content {
    min-width: 600px;
    background: #f4f6fd;
    border-radius: 6px;
  }
  .title {
    font-weight: bold;
    font-size: 18px;
    line-height: 21px;
    color: #3d56a6;
  }
  .content {
    font-weight: normal;
    font-size: 14px;
    line-height: 20px;
  }
  .ant-divider-horizontal {
    min-width: 600px;
    margin: 24px -24px;
  }
  .ant-checkbox-group {
    display: grid;
    max-height: 270px;
    padding-top: 12px;
    overflow: auto;
    /* background-color: white; */
    .ant-checkbox-wrapper {
      margin-left: 0;
      &:not(:last-child) {
        margin-bottom: 16px;
      }
      .ant-checkbox {
        top: 12px;
        position: relative;
      }
      .ant-checkbox-inner {
        border-radius: 50%;
      }
    }
    .ant-checkbox-checked::after {
      border: none;
    }
  }
  .required {
    .ant-form-item-label {
      &::after {
        display: inline-block;
        color: #ff4d4f;
        font-size: 18px;
        font-family: SimSun, sans-serif;
        line-height: 1;
        content: '*';
      }
    }
  }
`;
const CustomItem = styled(Item)`
  display: block;
  .ant-form-item-label {
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
    color: #333333;
  }
  label.ant-form-item-required {
    height: unset;
    &::before {
      content: '' !important;
    }
    &::after {
      display: inline-block;
      margin-left: 4px;
      color: #ff4d4f;
      font-size: 18px;
      font-family: SimSun, sans-serif;
      line-height: 1;
      content: '*';
    }
  }
  .label-desc {
    margin-bottom: 16px;
  }

  .role-title {
    font-weight: 600;
    font-size: 14px;
    line-height: 19px;
    color: #333333;
  }
  .red {
    color: red;
  }
  .role-desc {
    font-size: 14px;
    line-height: 19px;
    color: #333333;
  }
`;
