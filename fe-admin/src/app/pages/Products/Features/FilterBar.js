import React, { memo, useEffect, useRef } from 'react';
import { Row, Col } from 'antd';
import { Input, Select } from 'app/components';
import { SearchOutlined } from '@ant-design/icons';
import Filter from 'app/hooks/Filter';
import { COMBINE_STATUS } from '../constants';
import FilterModal from './FilterModal';
const { Option } = Select;

const initState = {
  keyword: '',
  status: '',
  publish_status: '',
  from_province_id: '',
  from_district_id: '',
  supplier_id: '',
  supplier_warehousing_id: '',
};

const listSelect = [];
for (const property in COMBINE_STATUS) {
  const current = COMBINE_STATUS[property];
  if (current.label) {
    listSelect.push({
      id: property,
      name: current.label,
      color: current.colorLabel,
    });
  }
}

const FilterBar = memo(function FilterBar({ isLoading }) {
  const [filter, setFilter] = React.useState(initState);
  const ref = useRef(null);
  console.log('filter', filter);
  const handleFilter = (type, needRefresh) => e => {
    const value = (e?.target?.value ?? e) || '';
    const values = { ...filter, [type]: value };
    if (e.type === 'click' || needRefresh) {
      if (ref.current) {
        ref.current.callBack(values);
      }
    }
    // setFilter(values);
  };

  // useEffect(() => {
  //   console.log('object :>> ');
  // }, []);
  const handleFilters = data => {
    console.log('data', data);
    const values = { ...filter, ...data };
    setFilter(values);
    ref.current.callBack(values);
  };

  const handleChangStatus = value => {
    let v = ['', ''];
    // eslint-disable-next-line eqeqeq
    if (value != 0) {
      v = value.split('/');
    } else {
    }

    const values = { ...filter, status: v[0], publish_status: v[1] };
    // setFilter(values);
    ref.current.callBack(values);
  };

  return (
    <Filter
      initState={initState}
      filter={filter}
      setFilter={() => null}
      ref={ref}
      // component={
      //   <Row>
      //     <Col xs={24} lg={20}>
      //       <Input
      //         placeholder="Nhập từ khoá"
      //         allowClear
      //         disabled={isLoading}
      //         prefix={<SearchOutlined />}
      //         // onPressEnter={onSearch}
      //         value={filter.keyword}
      //         onChange={handleFilter('keyword')}
      //       />
      //     </Col>
      //     <Col xs={24} lg={8}></Col>
      //   </Row>
      // }
    >
      <Row gutter={[8, 8]}>
        <Col xs={24} lg={17}>
          <Input
            placeholder="Nhập từ khoá"
            allowClear
            disabled={isLoading}
            prefix={<SearchOutlined />}
            // onPressEnter={onSearch}
            value={filter.keyword}
            onChange={handleFilter('keyword')}
          />
        </Col>
        <Col xs={6} lg={4}>
          <Select
            value={
              filter?.status ? `${filter?.status}/${filter?.publish_status}` : 0
            }
            onSelect={handleChangStatus}
            // filterOption={(input, option) =>
            //   option.props.children
            //     .toLowerCase()
            //     .indexOf(input.toLowerCase()) >= 0
            // }
          >
            <Option value={0}>Tất cả</Option>
            {listSelect.map(v => (
              <Option value={v.id} key={v.id}>
                {v.name}
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={6} lg={3}>
          <FilterModal searchParams={filter} handleFilters={handleFilters} />
        </Col>
      </Row>
    </Filter>
  );
});

export default FilterBar;
