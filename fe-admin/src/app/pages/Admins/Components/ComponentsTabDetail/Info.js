import React from 'react';
import { Row, Col } from 'antd';
// import { useDispatch } from 'react-redux';
import { Input, Form, Checkbox, Radio } from 'app/components';
import styled from 'styled-components/macro';

const Item = Form.Item;

const genders = ['male', 'female', 'other'];

export default function Info({ data, t, isLoading }) {
  const pageContent = (
    <>
      <Item name="account_type" label={t('user.account_type')}>
        <Checkbox.Group disabled>
          <Row gutter={8}>
            <Col>
              <Checkbox value="admin">{t('user.adminitrator')}</Checkbox>
            </Col>
            <Col>
              <Checkbox value="supplier">{t('user.supplier')}</Checkbox>
            </Col>
            <Col>
              <Checkbox value="seller">{t('user.seller')}</Checkbox>
            </Col>
          </Row>
        </Checkbox.Group>
      </Item>
      <Item name="id" label={t('user.id')}>
        <Input disabled />
      </Item>
      <Item name="created_at" label={t('user.created_at')}>
        <Input disabled />
      </Item>
      <Row gutter={8}>
        <Col lg={12}>
          <Item name="first_name" label={t('user.firstName')}>
            <CustomInput disabled />
          </Item>
        </Col>

        <Col lg={12}>
          <Item name="last_name" label={t('user.lastName')}>
            <CustomInput disabled />
          </Item>
        </Col>
      </Row>

      <Item name="gender" label={t('user.gender')}>
        <Radio.Group disabled>
          <Row gutter={10}>
            {genders.map(gender => (
              <Col key={gender}>
                <Radio value={gender}>{t(`user.${gender}`)}</Radio>
              </Col>
            ))}
          </Row>
        </Radio.Group>
      </Item>
      <Item name="email" label="E-mail">
        <Input disabled />
      </Item>
      {data?.location ? (
        <>
          <Item name="country" label={t('user.country')}>
            <Input disabled />
          </Item>
          <Item name="province" label={t('user.province')}>
            <Input disabled />
          </Item>
          <Item name="address" label={t('user.address')}>
            <Input disabled />
          </Item>
        </>
      ) : (
        ''
      )}
    </>
  );

  return <>{pageContent}</>;
}

const CustomInput = styled(Input)`
  max-width: 600px;
`;
