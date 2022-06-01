import React from 'react';
import { Row, Col, Form as F } from 'antd';
import { Input } from 'app/components';
import { CustomSectionWrapper } from './styled';

const Item = F.Item;

function Info({ layout }) {
  return (
    <div>
      <CustomSectionWrapper mt={{ xs: 's4' }}>
        <div className="title">Thông tin chung</div>
        <div className="">
          <Row gutter={24}>
            <Col span={12}>
              <Item
                name="sku"
                label="SKU"
                disabled
                {...layout}
                // rules={[
                //   {
                //     required: true,
                //     message: 'Please input your sku!',
                //   },
                // ]}
              >
                <Input disabled placeholder="SKU" />
              </Item>
            </Col>
            <Col span={12}>
              <Item disabled name="barcode" label="Barcode" {...layout}>
                <Input disabled placeholder="Barcode" />
              </Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Item
                name="total_quantity"
                label="Kho"
                disabled
                {...layout}
                // rules={[
                //   {
                //     required: true,
                //     message: 'Please input your total_quantity!',
                //   },
                // ]}
              >
                <Input disabled placeholder="Số lượng" />
              </Item>
            </Col>
          </Row>
        </div>
      </CustomSectionWrapper>
    </div>
  );
}

export default Info;
