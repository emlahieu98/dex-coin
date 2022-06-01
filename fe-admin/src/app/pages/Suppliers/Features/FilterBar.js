import React, { memo, useState, useEffect, useRef } from 'react';
import { Space, Row, Col } from 'antd';
import { Input, Select } from 'app/components';
import { SearchOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import Filter from 'app/hooks/Filter';
import constants from 'assets/constants';
import { CustomStyle } from 'styles/commons';
import request from 'utils/request';
import { isEmpty } from 'lodash';

const { Option } = Select;
const initState = {
  keyword: '',
  province_id: '',
  register_status: '',
  category_id: '',
};

const FilterBar = memo(function FilterBar({ isLoading, categories }) {
  const [filter, setFilter] = React.useState(initState);
  const [provinces, setProvinces] = useState([]);
  const ref = useRef(null);

  useEffect(() => {
    fetchDataProvinces();
  }, []);

  const fetchDataProvinces = async () => {
    const url = 'common-service/location-country?type=province';
    const response = await request(url, {
      method: 'get',
      requireAuth: false,
    })
      .then(response => {
        if (!isEmpty(response?.data)) setProvinces(response?.data);
      })
      .catch(error => error);
  };

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

  return (
    <Filter
      initState={initState}
      filter={filter}
      setFilter={setFilter}
      ref={ref}
    >
      <CustomRow gutter={[8, 8]}>
        <Col xs={24} lg={8}>
          <Input
            allowClear
            style={{ width: '100%' }}
            placeholder="Bạn đang tìm kiếm gì ?"
            disabled={isLoading}
            prefix={<SearchOutlined />}
            value={filter.keyword}
            onChange={handleFilter('keyword')}
          />
        </Col>
        <Col xs={24} flex="auto">
          <div className="d-flex justify-content-end">
            <Space>
              <CustomStyle>
                <Select
                  value={filter?.province_id || 0}
                  onSelect={handleFilter('province_id', true)}
                  style={{ width: 170 }}
                >
                  <Option value={0}>Tất cả tỉnh thành</Option>
                  {provinces.map(v => (
                    <Option value={v.id}>{v.name}</Option>
                  ))}
                </Select>
              </CustomStyle>
              <CustomStyle>
                <Select
                  value={filter?.category_id || 0}
                  onSelect={handleFilter('category_id', true)}
                  style={{ width: 220 }}
                >
                  <Option value={0}>Tất cả ngành hàng</Option>
                  {categories.map(v => (
                    <Option value={v.id}>{v.name}</Option>
                  ))}
                </Select>
              </CustomStyle>
              <CustomStyle>
                <Select
                  value={filter?.register_status || 0}
                  onSelect={handleFilter('register_status', true)}
                  style={{ width: 150 }}
                >
                  <Option value={0}>Tất cả trạng thái</Option>
                  {constants?.SUPPLIER_STATUS_FILTER?.map(v => (
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
const CustomRow = styled(Row)`
  .ant-input-prefix {
    color: #6489ff;
  }
  .anticon-search {
    vertical-align: 0;
    color: #7c8db5;
  }
  .ant-input {
    color: #7c8db5;
    &::placeholder {
      color: #7c8db5;
    }
  }
  .ant-select-selection-item {
    font-weight: 500;
  }
`;
export default FilterBar;
