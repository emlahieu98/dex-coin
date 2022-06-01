import React, { memo, useRef } from 'react';
import { Space, Row, Col, Select, Input } from 'antd';
import { PlusCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Button } from 'app/components';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import Filter from 'app/hooks/Filter';
import constants from 'assets/constants';

// const { Search } = Input;
const initState = {
  keyword: '',
  status: '',
};

const FilterBar = memo(function FilterBar({ gotoPage, isLoading }) {
  const [filter, setFilter] = React.useState(initState);
  const history = useHistory();
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

  const goCreate = () => {
    history.push(`/setting/banks/uc`);
  };

  const { Option } = Select;

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
              <Select
                value={filter?.status || 0}
                onSelect={handleFilter('status', true)}
                style={{ width: 150 }}
              >
                <Option value={0}>Tất cả</Option>
                {constants?.BANK_STATUS?.map(v => (
                  <Option value={v.id}>{v.name}</Option>
                ))}
              </Select>
              <Button
                className="btn-sm"
                onClick={goCreate}
                color="blue"
                disabled={isLoading}
              >
                <PlusCircleOutlined /> &ensp; Thêm ngân hàng
              </Button>
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
