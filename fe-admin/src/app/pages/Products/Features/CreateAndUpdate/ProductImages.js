import React, { memo } from 'react';
import { Row, Col, Form as F } from 'antd';
import { PicturesWall } from 'app/components/Uploads';
import { CustomSectionWrapper } from './styled';
const Item = F.Item;

export default memo(function ProductImages({ layout }) {
  const normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e;
  };

  return (
    <CustomSectionWrapper mt={{ xs: 's4' }}>
      <div className="title">Thư viện ảnh</div>
      <Row gutter={24}>
        <Col span={24}>
          <Item
            name="product_images"
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
            <PicturesWall
              maxImages={8}
              disabled
              url="product-service/product/upload-product-image"
            />
          </Item>
        </Col>
      </Row>
    </CustomSectionWrapper>
  );
});
