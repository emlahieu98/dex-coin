import React, { memo } from 'react';
import { Row, Col, Form as F } from 'antd';
import { Tags } from 'app/components';
import { CustomSectionWrapper } from './styled';
const Item = F.Item;

export default memo(function TagList({ layout }) {
  const normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e;
  };

  return (
    <CustomSectionWrapper mt={{ xs: 's4' }}>
      <div className="title">Thẻ Tag</div>
      <Row gutter={24}>
        <Col span={24}>
          <Item
            name="tags"
            label=""
            valuePropName="data"
            getValueFromEvent={normFile}
            {...layout}
            // rules={[
            //   {
            //     required: true,
            //     message: 'Please input your status!',
            //   },
            // ]}
          >
            <Tags disabled />
          </Item>
        </Col>
      </Row>
    </CustomSectionWrapper>
  );
});
