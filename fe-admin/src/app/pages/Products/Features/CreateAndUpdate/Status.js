import React, { memo } from 'react';
import { Row, Col, Form as F, Select } from 'antd';
import constants from 'assets/constants';
import { CustomSectionWrapper } from './styled';
const Item = F.Item;

export default memo(function Status({ layout }) {
  return (
    <CustomSectionWrapper mt={{ xs: 's4' }}>
      <div className="title">Trạng thái</div>
      <Row gutter={24}>
        <Col span={24}>
          <Item
            name="status"
            label=""
            {...layout}
            rules={[
              {
                required: true,
                message: 'Please input your status!',
              },
            ]}
          >
            <Select
            // defaultValue={text}
            // value={newStatus?.id === detail?.id ? newStatus?.name : text}
            // style={{ width: 120 }}
            // onSelect={handleShowConfirm(record)}
            // filterOption={(input, option) =>
            //   option.props.children
            //     .toLowerCase()
            //     .indexOf(input.toLowerCase()) >= 0
            // }
            >
              {constants?.PRODUCT_STATUS?.map(v => (
                <Select.Option key={v.id} value={v.id}>
                  {v.name}
                </Select.Option>
              ))}
            </Select>
          </Item>
        </Col>
      </Row>
    </CustomSectionWrapper>
  );
});
