import React, { memo } from 'react';
import { Row, Col, Form as F } from 'antd';
import { Input } from 'app/components';
import { CustomSectionWrapper } from './styled';

const Item = F.Item;

export default memo(function Vendor({ layout }) {
  return (
    <CustomSectionWrapper mt={{ xs: 's4' }}>
      <div className="title">Nhãn hiệu</div>
      <Row gutter={24}>
        <Col span={24}>
          <Item
            name="vendor"
            label=""
            disabled
            {...layout}
            // rules={[
            //   {
            //     required: true,
            //     message: 'Please input your vendor!',
            //   },
            // ]}
          >
            <Input disabled placeholder="name" />
          </Item>
        </Col>
      </Row>
    </CustomSectionWrapper>
  );
});
