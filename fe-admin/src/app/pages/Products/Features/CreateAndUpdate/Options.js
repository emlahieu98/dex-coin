import React, { memo, useMemo } from 'react';
import { Row, Col, Form as F } from 'antd';
import { Tags } from 'app/components';
import styled from 'styled-components';
import { Input } from 'app/components';
const Item = F.Item;

export default memo(function Options({
  layout,
  variations = [],
  // setVariations,
}) {
  const { options1, options2, options3 } = useMemo(() => {
    return variations.reduce(
      (final, item) => {
        if (item.option_1 && !final.options1.includes(item.option_1)) {
          final.options1.push(item.option_1);
        }
        if (item.option_2 && !final.options1.includes(item.option_2)) {
          final.options2.push(item.option_2);
        }
        if (item.option_3 && !final.options1.includes(item.option_3)) {
          final.options3.push(item.option_3);
        }
        return final;
      },
      {
        options1: [],
        options2: [],
        options3: [],
      },
    );
  }, [variations]);

  const handleChangeVariations = _type => _value => {
    // setVariations();
  };

  return (
    <div>
      <>
        <div className="title">Option</div>
        <div className="">
          <Row gutter={24}>
            <Col span={4}>
              <Item
                name="option_1"
                label="Option 1"
                {...layout}
                // rules={[
                //   {
                //     required: true,
                //     message: 'Please input your Option 1!',
                //   },
                // ]}
              >
                <Input placeholder="" disabled />
              </Item>
            </Col>
            <Col span={18}>
              <WrapperItem>
                <Item name="" defaultValue={options1} label="1" {...layout}>
                  <Tags
                    defaultShowInput
                    data={options1}
                    disabled
                    onChange={handleChangeVariations('option_1')}
                  />
                </Item>
              </WrapperItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={4}>
              <Item
                name="option_2"
                label="Option 2"
                {...layout}
                // rules={[
                //   {
                //     required: true,
                //     message: 'Please input your Option 2!',
                //   },
                // ]}
              >
                <Input disabled placeholder="" />
              </Item>
            </Col>
            <Col span={18}>
              <WrapperItem>
                <Item name="" defaultValue={options2} label="2" {...layout}>
                  <Tags defaultShowInput data={options2} disabled />
                </Item>
              </WrapperItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={4}>
              <Item
                name="option_3"
                label="Option 3"
                {...layout}
                // rules={[
                //   {
                //     required: true,
                //     message: 'Please input your Option 3!',
                //   },
                // ]}
              >
                <Input placeholder="" disabled />
              </Item>
            </Col>
            <Col span={18}>
              <WrapperItem>
                <Item name="" defaultValue={options3} label="3" {...layout}>
                  <Tags defaultShowInput disabled data={options3} />
                </Item>
              </WrapperItem>
            </Col>
          </Row>
        </div>
      </>
    </div>
  );
});

const WrapperItem = styled.div`
  label {
    visibility: hidden;
  }
  .ant-form-item-control {
    border: 1px solid #d9d9d9;
  }
  .ant-form-item-control-input-content {
    padding: 4px;
  }
`;
