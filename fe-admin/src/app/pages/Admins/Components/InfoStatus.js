import React from 'react';
import { Row, Col, Switch } from 'antd';
// import { useDispatch } from 'react-redux';
import { Form } from 'app/components';
import { isEmpty } from 'lodash';
import styled from 'styled-components/macro';

const Item = Form.Item;

const host = 'https://i.odii.xyz/';

export default function InfoStatus({ data, t, isLoading, handleUpdate }) {
  const pageContent = (
    <>
      <Row gutter={8}>
        <CustomColMarginAuto lg={24}>
          <Item name="avatar">
            <div className="text-center">
              <img
                src={
                  data?.avatar?.location
                    ? host + data?.avatar?.location
                    : data?.avatar?.origin
                }
                disabled
                alt=""
              />
              <div className="txt-name">{data?.full_name}</div>
            </div>
          </Item>
        </CustomColMarginAuto>
      </Row>
      <Row gutter={8}>
        <CustomCol lg={24}>
          <div className="d-flex justify-content-between">
            <div className="title-info">Mã nhân viên</div>
            <div>{data?.id}</div>
          </div>
          <div className="d-flex justify-content-between mt-16">
            <div className="title-info">Điện thoại</div>
            <div className="txt-phone">
              {data?.phone ? '+84 ' + data?.phone : 'N/A'}
            </div>
          </div>
          {!isEmpty(data) && (
            <Item name="status" className=" mt-24 mb-0">
              <div className="status d-flex justify-content-between">
                <div className="item-label">{t('user.status')}:</div>
                <CustomSwitch
                  checkedChildren="Hoạt động"
                  unCheckedChildren="Dừng hoạt động"
                  // defaultChecked={data?.status === 'active'}
                  checked={data?.status === 'active'}
                  onChange={handleUpdate}
                />
              </div>
            </Item>
          )}
        </CustomCol>
      </Row>
    </>
  );

  return <>{pageContent}</>;
}

const CustomCol = styled(Col)`
  border-top: 1px solid #ebebf0;
  padding: 20px 20px;
  margin: auto;
`;

const CustomColMarginAuto = styled(Col)`
  margin: auto;
`;

const CustomSwitch = styled(Switch)`
  &.ant-switch-checked {
    background: #4869de;
  }
`;
