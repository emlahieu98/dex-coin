import React from 'react';
import { Row, Col, Form as F } from 'antd';
import { Input, InputNumber } from 'app/components';
import { CustomSectionWrapper } from './styled';

const Item = F.Item;

function Counting({ layout }) {
  return (
    <div>
      <CustomSectionWrapper mt={{ xs: 's4' }}>
        <div className="title">Thông tin bổ xung</div>
        <div className="">
          <Row gutter={24}>
            <Col span={12}>
              <Item
                name="number_of_visits"
                label="Người xem"
                {...layout}
                // rules={[
                //   {
                //     required: true,
                //     message: 'Please input your sku!',
                //   },
                // ]}
              >
                <InputNumber placeholder="Người xem" />
              </Item>
            </Col>
            <Col span={12}>
              <Item name="number_of_booking" label="Số lượng order" {...layout}>
                <InputNumber placeholder="Số lượng order" />
              </Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Item name="number_of_vote" label="Số lượng đánh giá" {...layout}>
                <InputNumber placeholder="Số lượng đánh giá" />
              </Item>
            </Col>
            <Col span={12}>
              <Item name="rating" label="Rating" {...layout}>
                <InputNumber
                  placeholder="Rating"
                  min={1}
                  max={5}
                  precision={1}
                  stringMode
                  step={0.1}
                  formatter={value => {
                    return +value;
                  }}
                />
              </Item>
            </Col>
          </Row>
        </div>
      </CustomSectionWrapper>
    </div>
  );
}

export default Counting;
