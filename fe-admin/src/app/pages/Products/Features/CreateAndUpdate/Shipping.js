import React from 'react';
import { Row, Col, Form as F } from 'antd';
import { Input } from 'app/components';
import { CustomStyle } from 'styles/commons';
import { CustomSectionWrapper } from './styled';

const Item = F.Item;

function Shipping({ layout, defaultVariation, form }) {
  const { setFieldsValue } = form;

  React.useEffect(() => {
    setFieldsValue({
      defaultVariation: {
        weight_grams: defaultVariation?.weight_grams,
        box_height_cm: defaultVariation?.box_height_cm,
        box_length_cm: defaultVariation?.box_length_cm,
        box_width_cm: defaultVariation?.box_width_cm,
      },
    });
  }, [defaultVariation]);

  return (
    <div>
      <CustomSectionWrapper mt={{ xs: 's4' }}>
        <div className="title">Vận chuyển</div>
        <div className="">
          <Row gutter={24}>
            <Col xs={24} lg={12}>
              <Item
                name={['defaultVariation', 'weight_grams']}
                label="Cân nặng (sau khi đóng gói)"
                {...layout}
                // rules={[
                //   {
                //     required: true,
                //     message: 'Please input your sku!',
                //   },
                // ]}
              >
                <Input placeholder="Cân nặng" suffix="gr" disabled />
              </Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col xs={24}>
              <CustomStyle mb={{ xs: 's2' }}>Kích thước đóng gói</CustomStyle>
            </Col>
            <Col xs={24} lg={4}>
              <Item
                name={['defaultVariation', 'box_length_cm']}
                label=""
                {...layout}
                // rules={[
                //   {
                //     required: true,
                //     message: 'Please input your sku!',
                //   },
                // ]}
              >
                <Input placeholder="Chiều dài" suffix="cm" disabled />
              </Item>
            </Col>
            <Col xs={24} lg={4}>
              <Item
                name={['defaultVariation', 'box_height_cm']}
                label=""
                {...layout}
                // rules={[
                //   {
                //     required: true,
                //     message: 'Please input your sku!',
                //   },
                // ]}
              >
                <Input placeholder="Chiều cao" suffix="cm" disabled />
              </Item>
            </Col>
            <Col xs={24} lg={4}>
              <Item
                name={['defaultVariation', 'box_width_cm']}
                label=""
                {...layout}
                // rules={[
                //   {
                //     required: true,
                //     message: 'Please input your sku!',
                //   },
                // ]}
              >
                <Input placeholder="Chiều rộng" suffix="cm" disabled />
              </Item>
            </Col>
          </Row>
        </div>
      </CustomSectionWrapper>
    </div>
  );
}

export default Shipping;
