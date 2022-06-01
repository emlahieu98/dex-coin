import React, { memo, useRef } from 'react';
import { Space, Row, Col } from 'antd';
import { Input, Select } from 'app/components';
import { SearchOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import Filter from 'app/hooks/Filter';
import constants from 'assets/constants';
import { CustomStyle } from 'styles/commons';

const { Option } = Select;
const AccountTypeOptions = [
  { value: 'admin', label: 'Admin' },
  { value: 'supplier', label: 'Supplier' },
  { value: 'seller', label: 'Seller' },
];
const initState = {
  keyword: '',
  account_type: '',
  status: '',
  // dateString: '',
};

const FilterBar = memo(function FilterBar({ isLoading }) {
  const [filter, setFilter] = React.useState(initState);
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

  return (
    <Filter
      initState={initState}
      filter={filter}
      setFilter={setFilter}
      ref={ref}
    >
      <CusRow gutter={[8, 8]}>
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
              <CustomStyle w="140px">
                <Select
                  value={filter?.account_type || 0}
                  onSelect={handleFilter('account_type', true)}
                  style={{ width: 150 }}
                >
                  <Option value={0}>Tất cả tài khoản</Option>
                  {AccountTypeOptions?.map(v => (
                    <Option value={v.value}>{v.label}</Option>
                  ))}
                </Select>
              </CustomStyle>
              <CustomStyle w="140px">
                <Select
                  value={filter?.status || 0}
                  onSelect={handleFilter('status', true)}
                  style={{ width: 150 }}
                >
                  <Option value={0}>Tất cả trạng thái</Option>
                  {constants?.USER_STATUS_SEARCH?.map(v => (
                    <Option value={v.id}>{v.name}</Option>
                  ))}
                </Select>
              </CustomStyle>
            </Space>
          </div>
        </Col>
      </CusRow>
    </Filter>
  );
});
const CusRow = styled(Row)`
  .anticon-search {
    vertical-align: 0;
  }
`;
export default FilterBar;
