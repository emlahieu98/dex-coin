import React from 'react';
import { Row, Col, Divider } from 'antd';
// import { useDispatch } from 'react-redux';
import { Form, Checkbox, Button } from 'app/components';

const Item = Form.Item;

export default function Role({
  data,
  t,
  isLoading,
  // role_ids,
  dataRolesFormat,
  onChangeRole,
  handleUpdateRoles,
  setVisiableModalConfirm,
}) {
  // Hiện tại cho phép thay đổi quyền Quản trị đặc biệt : Owner, Super Admin.
  //Logic muốn thay đổi: - Phía User: Tài khoản tự đăng ký thì mặc định quyền  Owner không thể thay đổi, còn những tài khoản được mời, phân quyền partner có thể được thay đổi role Owner. - Admin: Tương tự.

  const pageContent = (
    <>
      <Item name="role_ids">
        <Checkbox.Group style={{ width: '100%' }} onChange={onChangeRole}>
          <Row gutter={8} className="mt-24">
            <Col lg={12} className="CustomCol">
              <div className="title">Quyền Quản trị</div>
              {dataRolesFormat
                ? dataRolesFormat?.map(
                    (role, index) =>
                      role.title.includes('admin_') && (
                        <Checkbox
                          value={role?.id}
                          key={index}
                          className="item-role"
                        >
                          <div className="title-role">{role?.titleFormat}</div>
                          <div className="content-role">
                            {role?.description}
                          </div>
                        </Checkbox>
                      ),
                  )
                : ''}
              {dataRolesFormat
                ? dataRolesFormat?.map(
                    (role, index) =>
                      role.title.includes('super_') && (
                        <Checkbox
                          value={role?.id}
                          key={index}
                          className="item-role"
                          // disabled={role_ids.includes('7')}
                        >
                          <div className="title-role">{role?.titleFormat}</div>
                          <div className="content-role">
                            {role?.description}
                          </div>
                        </Checkbox>
                      ),
                  )
                : ''}
            </Col>

            <Col lg={12} className="CustomCol">
              <div className="title">Quyền Nhân viên</div>
              {dataRolesFormat
                ? dataRolesFormat?.map(
                    (role, index) =>
                      role.title.includes('partner_') && (
                        <Checkbox
                          value={role?.id}
                          key={index}
                          className="item-role"
                        >
                          <div className="title-role">{role?.titleFormat}</div>
                          <div className="content-role">
                            {role?.description}
                          </div>
                        </Checkbox>
                      ),
                  )
                : ''}
              {dataRolesFormat
                ? dataRolesFormat?.map(
                    (role, index) =>
                      role.title.includes('owner') && (
                        <Checkbox
                          value={role?.id}
                          key={index}
                          className="item-role"
                          // disabled={role_ids.includes('1')}
                        >
                          <div className="title-role">{role?.titleFormat}</div>
                          <div className="content-role">
                            {role?.description}
                          </div>
                        </Checkbox>
                      ),
                  )
                : ''}
            </Col>
          </Row>
        </Checkbox.Group>
      </Item>
      <Item>
        <div className="d-flex justify-content-end">
          <Button
            className="btn-sm"
            color="blue"
            onClick={() => setVisiableModalConfirm(true)}
          >
            Lưu
          </Button>
        </div>
      </Item>
      <Divider />
      <Item>
        <span className="title-special super-admin">Super Admin: </span>Quyền
        quản trị cao nhất, truy cập, chỉnh sửa được tất cả tính năng và tài
        nguyên hệ thống.
        <br />
        <span className="title-special">Owner: </span>Quyền quản trị tương đương
        chủ tài khoản.
      </Item>
    </>
  );

  return <>{pageContent}</>;
}
