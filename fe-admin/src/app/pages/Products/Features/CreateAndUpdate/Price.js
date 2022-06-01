import React from 'react';
import { formatVND } from 'utils/helpers';
import { Row, Col, Form as F, Space, Radio, Select } from 'antd';
import constants from 'assets/constants';
import { CustomSectionWrapper, CustomInputNumber } from './styled';

const Item = F.Item;

function Price({ layout }) {
  const onChange = params => {};

  return (
    <div>
      <CustomSectionWrapper mt={{ xs: 's4' }}>
        <div className="title">Giá tiền</div>
        <div className="">
          <Row gutter={24}>
            <Col span={12}>
              <Item
                name="origin_supplier_price"
                label="Giá nhà cung cấp"
                disabled
                {...layout}
                rules={[
                  {
                    required: true,
                    message: 'Please input your origin_supplier_price!',
                  },
                ]}
              >
                <CustomInputNumber
                  disabled
                  placeholder="Giá nhà cung cấp"
                  formatter={value => {
                    if (value) {
                      return formatVND(value);
                    }
                    return value;
                  }}
                />
              </Item>
            </Col>
            <Col span={12}>
              <Item
                name="currency_code"
                label="Đơn vị tiền tệ"
                {...layout}
                rules={[
                  {
                    required: true,
                    message: 'Please input your currency_code!',
                  },
                ]}
              >
                <Select
                  // defaultValue={text}
                  // value={newStatus?.id === detail?.id ? newStatus?.name : text}
                  // onSelect={handleShowConfirm(record)}
                  // filterOption={(input, option) =>
                  //   option.props.children
                  //     .toLowerCase()
                  //     .indexOf(input.toLowerCase()) >= 0
                  // }
                  disabled
                >
                  {constants?.CURRENCY_LIST?.map(v => (
                    <Select.Option key={v.id} value={v.id}>
                      {v.name}
                    </Select.Option>
                  ))}
                </Select>
              </Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Item
                name="odii_price"
                label="Giá Odii"
                {...layout}
                rules={[
                  {
                    required: true,
                    message: 'Please input your odii_price!',
                  },
                ]}
              >
                <CustomInputNumber
                  formatter={value => {
                    if (value) {
                      return formatVND(value);
                    }
                    return value;
                  }}
                  placeholder="Giá Odii"
                />
              </Item>
            </Col>
            <Col span={12}>
              <Item
                name="odii_compare_price"
                label="Giá Odii khuyễn mại"
                {...layout}
                rules={[
                  {
                    required: true,
                    message: 'Please input your odii_compare_price!',
                  },
                ]}
              >
                <CustomInputNumber
                  formatter={value => {
                    if (value) {
                      return formatVND(value);
                    }
                    return value;
                  }}
                  placeholder="Giá Odii khuyễn mại"
                />
              </Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Item
                disabled
                name="low_retail_price"
                label="Giá bán tối thiểu"
                {...layout}
                rules={[
                  {
                    required: true,
                    message: 'Please input your low_retail_price!',
                  },
                ]}
              >
                <CustomInputNumber
                  disabled
                  formatter={value => {
                    if (value) {
                      return formatVND(value);
                    }
                    return value;
                  }}
                  placeholder="Giá bán tối thiểu"
                />
              </Item>
            </Col>
            <Col span={12}>
              <Item
                disabled
                name="high_retail_price"
                label="Giá bán tối đa"
                {...layout}
                rules={[
                  {
                    required: true,
                    message: 'Please input your high_retail_price!',
                  },
                ]}
              >
                <CustomInputNumber
                  disabled
                  formatter={value => {
                    if (value) {
                      return formatVND(value);
                    }
                    return value;
                  }}
                  placeholder="Giá bán tối đa"
                />
              </Item>
            </Col>
          </Row>
        </div>
        <div className="title">Hiển thị khuyến mại</div>
        <div className="">
          <Item
            name="showDiscount"
            label=""
            disabled
            {...layout}
            // rules={[
            //   {
            //     required: true,
            //     message: 'Please input your showDiscount!',
            //   },
            // ]}
          >
            <Radio.Group disabled onChange={onChange}>
              <Space direction="vertical">
                <Radio value={1}>Tự động: (14%)</Radio>
                <Radio value={2}>Tự set</Radio>
              </Space>
            </Radio.Group>
          </Item>
        </div>
      </CustomSectionWrapper>
    </div>
  );
}

export default Price;
