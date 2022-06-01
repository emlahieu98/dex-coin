import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { isEmpty } from 'lodash';
import { globalActions } from 'app/pages/AppPrivate/slice';
import { Row, Col, Spin } from 'antd';
import { useLocation } from 'react-router';
import { PageWrapper, Form } from 'app/components';
import {
  TableListTransaction,
  InfoPartner,
  InfoPeriod,
} from '../../Components';

export function UserDebtDetail({ match }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const uRLSearchParams = new URLSearchParams(location.search);
  const debtPeriodKey = uRLSearchParams.get('debt_period_key');
  const [form] = Form.useForm();

  const { setFieldsValue, getFieldsValue } = form;

  setFieldsValue({
    note: '',
  });

  useEffect(() => {
    const dataBreadcrumb = {
      menus: [
        {
          name: 'Công nợ',
          link: '/accountant/debt-overview',
        },
        {
          name: 'Chi tiết chu kỳ',
          link: `/accountant/detail-period?debt_period_key=${debtPeriodKey}`,
        },
        {
          name: 'Danh sách giao dịch',
        },
      ],
      title: '',
      status: '',
      // fixWidth: true,
    };
    dispatch(globalActions.setDataBreadcrumb(dataBreadcrumb));
    return () => {
      dispatch(globalActions.setDataBreadcrumb({}));
    };
  }, []);

  return (
    <PageWrapper>
      <Spin tip="Đang tải..." spinning={false}>
        <Row gutter="24">
          <Col span={12}>
            <InfoPartner></InfoPartner>
          </Col>
          <Col span={12}>
            <InfoPeriod></InfoPeriod>
          </Col>
        </Row>
        <Row gutter="24">
          <Col span={24}>
            <TableListTransaction></TableListTransaction>
          </Col>
        </Row>
      </Spin>
    </PageWrapper>
  );
}
