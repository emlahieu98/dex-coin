import React, { memo, useRef } from 'react';
import { Row, Col, Space } from 'antd';
import { Input, Select, DatePicker } from 'app/components';
import { SearchOutlined } from '@ant-design/icons';
import Filter from 'app/hooks/Filter';
import constants from 'assets/constants';
import moment from 'moment';
import { CustomStyle } from 'styles/commons';
import styled from 'styled-components';
const { Option } = Select;
const { RangePicker } = DatePicker;

const initState = {
  keyword: '',
  status: '',
  fulfillment_status: '',
  store_id: '',
  from_time: '',
  to_time: '',
};

const FilterBar = memo(function FilterBar({
  isLoading,
  history,
  showAction,
  listStores,
}) {
  const [filter, setFilter] = React.useState(initState);
  // const [hackValue, setHackValue] = React.useState();

  const ref = useRef(null);
  const handleFilter = (type, needRefresh) => e => {
    const value = (e?.target?.value ?? e) || '';
    const values = { ...filter, [type]: value };
    if (e.type === 'click' || needRefresh) {
      if (ref.current) {
        ref.current.callBack(values);
      }
    }
    setFilter(values);
  };

  const setTimeRanger = value => {
    const values = {
      ...filter,
      from_time: value?.[0].toISOString(true),
      to_time: value?.[1].toISOString(true),
    };
    ref.current.callBack(values);
  };

  const handleAction = e => {
    switch (e) {
      case 1:
        history.push('/selected-products/update');
        break;

      default:
        break;
    }
  };

  // const disabledDate = current => {
  //   // const dates = [filter.from_time, filter.to_time];
  //   if (!dates || dates.length === 0) {
  //     return false;
  //   }
  //   // const tooLate = dates[0] && current.diff(dates[0], 'days') > 7;
  //   // const tooEarly = dates[1] && dates[1].diff(c, 'days') > 7;
  //   const tooLate = dates[0] && dates[0] > dates[1];
  //   // if(dates[0]) return
  //   const tooEarly = dates[1] && (dates[1] >= moment() || dates[1] < dates[0]);
  //   return tooEarly || tooLate;
  // };

  // const onOpenChange = open => {
  //   if (!open && filter.from_time && filter.to_time) {
  //     // setHackValue([]);
  //     ref?.current?.callBack(filter);
  //     // setDates([]);
  //   } else {
  //     // setHackValue(undefined);
  //   }
  // };

  return (
    <Filter
      initState={initState}
      filter={filter}
      setFilter={setFilter}
      ref={ref}
    >
      <CustomRow gutter={[8, 8]}>
        <Col xs={24} lg={6}>
          <Row gutter={8}>
            <Col xs={24} lg={20}>
              <Input
                placeholder="Nhập từ khoá"
                allowClear
                size="medium"
                // color="#7C8DB5"
                color="primary"
                disabled={isLoading}
                prefix={<SearchOutlined />}
                value={filter.keyword}
                onChange={handleFilter('keyword')}
              />
            </Col>
            <Col xs={24} lg={4}>
              {showAction && (
                <Select
                  color="primary"
                  // size="medium"
                  // value={0}
                  onSelect={handleAction}
                  placeholder="Tuỳ chỉnh"
                  // filterOption={(input, option) =>
                  //   option.props.children
                  //     .toLowerCase()
                  //     .indexOf(input.toLowerCase()) >= 0
                  // }
                >
                  <Option value={1}>Sửa sản phẩm</Option>
                </Select>
              )}
            </Col>
          </Row>
        </Col>
        <Col xs={24} flex="auto">
          <div className="d-flex justify-content-end">
            <Space>
              <CustomStyle w="130px">
                <RangePicker
                  color="primary"
                  className="range-picker"
                  format="DD/MM/YYYY"
                  // size="large"
                  // onOpenChange={onOpenChange}
                  value={[
                    filter.from_time && moment(filter.from_time),
                    filter.to_time && moment(filter.to_time),
                  ]}
                  onChange={setTimeRanger}
                />
              </CustomStyle>
              <CustomStyle w="130px">
                <Select
                  // color="primary"
                  style={{
                    fontWeight: 'bold',
                  }}
                  size="medium"
                  value={filter?.store_id || 0}
                  onSelect={handleFilter('store_id', true)}
                  // filterOption={(input, option) =>
                  //   option.props.children
                  //     .toLowerCase()
                  //     .indexOf(input.toLowerCase()) >= 0
                  // }
                >
                  <Option value={0}>Cửa hàng</Option>
                  {listStores?.map(v => (
                    <Option value={v.id}>{v.name}</Option>
                  ))}
                </Select>
              </CustomStyle>
              {/* <CustomStyle w="130px">
                <Select
                  color="primary"
                  size="medium"
                  value={filter?.fulfillment_status || 0}
                  onSelect={handleFilter('fulfillment_status', true)}
                  // filterOption={(input, option) =>
                  //   option.props.children
                  //     .toLowerCase()
                  //     .indexOf(input.toLowerCase()) >= 0
                  // }
                >
                  <Option value={0}>Thanh toán</Option>
                  {constants?.ORDER_FULFILLMENT_STATUS?.map(v => (
                    <Option value={v.id.toLowerCase()}>{v.name}</Option>
                  ))}
                </Select>
              </CustomStyle> */}
              <CustomStyle w="110px">
                <Select
                  style={{
                    fontWeight: 'bold',
                  }}
                  // color="primary"
                  size="medium"
                  value={filter?.status || 0}
                  onSelect={handleFilter('fulfillment_status', true)}
                  // filterOption={(input, option) =>
                  //   option.props.children
                  //     .toLowerCase()
                  //     .indexOf(input.toLowerCase()) >= 0
                  // }
                >
                  <Option value={0}>Trạng thái</Option>
                  {constants?.ORDER_FULFILLMENT_STATUS.slice(1)?.map(v => (
                    <Option value={v.id}>{v.name}</Option>
                  ))}
                </Select>
              </CustomStyle>
            </Space>
          </div>
        </Col>
      </CustomRow>
    </Filter>
  );
});

export default FilterBar;

const CustomRow = styled(Row)`
  .ant-picker-input > input {
    &::placeholder {
      color: #616161;
      font-weight: 500;
      opacity: 1;
    }
  }
`;
