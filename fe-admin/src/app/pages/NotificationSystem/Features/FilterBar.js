import React, { memo, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Space } from 'antd';
import { Input, Select, DatePicker, Tabs, Button } from 'app/components';
import { SearchOutlined } from '@ant-design/icons';
import { selectListSelected } from '../slice/selectors';
import { useNotificationSlice } from '../slice';
import Filter from 'app/hooks/Filter';
import constants from 'assets/constants';
import moment from 'moment';
import { CustomStyle } from 'styles/commons';
import { TABPANES_TYPE } from '../constants';
import styled from 'styled-components/macro';
// import { DeleteOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

const initState = {
  keyword: '',
  status: '',
  source: '',
  from_time: '',
  to_time: '',
};

const listSelect = [];
for (const property in TABPANES_TYPE) {
  const current = TABPANES_TYPE[property];
  if (current.label && !listSelect.some(item => item.name === current.label)) {
    listSelect.push({
      id: property,
      name: current.label,
      // color: current.colorLabel,
    });
  }
}

const FilterBar = memo(function FilterBar({ isLoading, history, showAction }) {
  const [filter, setFilter] = useState(initState);
  const listSelected = useSelector(selectListSelected);
  const dispatch = useDispatch();
  const { actions } = useNotificationSlice();

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

  const handleChangType = value => {
    const values = { ...filter, source: value != 0 ? value : '' };
    setFilter(values);
    ref.current.callBack(values);
  };

  const handleDeleteNotify = () => {
    dispatch(
      actions.deleteEmployee({
        data: {
          user_ids: listSelected,
        },
      }),
    );
  };

  return (
    <Filter
      initState={initState}
      filter={filter}
      setFilter={setFilter}
      ref={ref}
    >
      <Tabs
        defaultActiveKey={0}
        onChange={handleChangType}
        activeKey={filter?.source ? `${filter?.source}` : '0'}
      >
        <TabPane tab="Tất cả" key="0"></TabPane>
        {listSelect?.map(v => (
          <TabPane tab={v.name} key={v.id}></TabPane>
        ))}
      </Tabs>
      <Row gutter={[8, 8]}>
        <Col xs={24} lg={10}>
          <Row gutter={8}>
            <Col xs={24} lg={18}>
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
            <Col xs={24} lg={6}>
              {showAction && (
                <Button
                  context="secondary"
                  className="btn-sm"
                  color="red"
                  onClick={handleDeleteNotify}
                  disabled={isLoading}
                >
                  Xóa
                </Button>
              )}
            </Col>
          </Row>
        </Col>
        <Col xs={24} flex="auto">
          <div className="d-flex justify-content-end">
            <Space>
              <CustomStyle w="140px">
                <CustomRangePicker
                  color="primary"
                  className="range-picker"
                  format="DD/MM/YYYY"
                  // size="large"
                  // onOpenChange={onOpenChange}
                  placeholder={['Bắt đầu ngày', 'Kết thúc ngày']}
                  value={[
                    filter.from_time && moment(filter.from_time),
                    filter.to_time && moment(filter.to_time),
                  ]}
                  onChange={setTimeRanger}
                />
              </CustomStyle>
              <CustomStyle w="110px">
                <Select
                  style={{
                    fontWeight: 'bold',
                  }}
                  size="medium"
                  value={filter?.status || 0}
                  onSelect={handleFilter('status', true)}
                  // filterOption={(input, option) =>
                  //   option.props.children
                  //     .toLowerCase()
                  //     .indexOf(input.toLowerCase()) >= 0
                  // }
                >
                  <Option value={0}>Trạng thái</Option>
                  {constants?.NOTIFICATION_STATUS_FILTER.slice(1)?.map(v => (
                    <Option value={v.id}>{v.name}</Option>
                  ))}
                </Select>
              </CustomStyle>
            </Space>
          </div>
        </Col>
      </Row>
    </Filter>
  );
});

export default FilterBar;

const CustomRangePicker = styled(RangePicker)`
  .ant-picker-input > input {
    &::placeholder {
      /* color: rgb(61, 86, 166); */
      color: #616161;
      font-weight: 500;
      opacity: 1;
    }
  }
`;
