/**
 *
 * Table
 *
 */
import React, { useEffect, useRef, memo } from 'react';
import styled from 'styled-components/macro';
import { Table as T } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  useValidateQuerySearch,
  useShouldRedirectToLastPage,
  useHandleChangePage,
} from 'app/hooks/useValidateQuerySearch';
import { isEmpty } from 'lodash';
import usePrevious from 'app/hooks/UsePrevious';
import { Redirect } from 'react-router-dom';

const defaultSchema = {
  page: {
    required: true,
    default: 1,
    test: value => {
      return /^\d+$/.test(value);
    },
  },
  page_size: {
    required: true,
    default: 10,
    test: value => Number(value) <= 100,
  },
};

const Table = ({
  data = {},
  searchSchema = {},
  notNeedRedirect = false,
  actions = () => null,
  ...rest
}) => {
  const { t } = useTranslation();
  const firstUpdate = useRef(true);
  const location = useShouldRedirectToLastPage(data);
  // const preData = usePrevious(data);
  const preLocationSearch = usePrevious(location.search);
  useEffect(() => {
    if (
      // (firstUpdate.current && !isEmpty(data?.data)) ||
      !isEmpty(data?.data) &&
      !preLocationSearch
    ) {
      firstUpdate.current = false;
      return;
    }
    actions(location.search);
  }, [location.search]);

  const handleChangePage = useHandleChangePage(notNeedRedirect);

  // const { isValid, to, queryData } = useMemo(() => {
  //   return useValidateQuerySearch({
  //     ...defaultSchema,
  //     ...searchSchema,
  //   });
  // }, []);

  if (firstUpdate.current && !isEmpty(data.pagination)) {
    for (const item in data.pagination) {
      if (defaultSchema[item]) {
        defaultSchema[item].default = data.pagination[item];
      }
    }
  }

  const { isValid, to, queryData } = useValidateQuerySearch({
    ...defaultSchema,
    ...searchSchema,
  });

  if (!isValid && !notNeedRedirect) {
    return <Redirect to={to} />;
  }
  const pagination = {
    showSizeChanger: true,
    hideOnSinglePage: true,
    // pageSize: repositories?.pagination?.page_size ?? 10,
    current: +queryData.page || 1,
    total: data?.pagination?.total ?? 0,
    // size: 'small',
    defaultPageSize: +queryData.page_size || 10,
    defaultCurrent: 1,
    showTotal: (total, range) =>
      `${range[0]}-${range[1]} ${t('user.of')} ${total} ${t('user.items')}`,
  };
  return (
    <CustomTable
      rowKey="id"
      dataSource={data?.data || []}
      pagination={pagination}
      onChange={handleChangePage}
      scroll={{ x: 1200, y: 900 }}
      {...rest}
    />
  );
};

const CustomTable = styled(T)`
  .ant-table {
    font-size: 14px;
  }
  .ant-table-thead > tr > th {
    color: ${({ theme }) => theme.grayBlue};
    padding: 22px 5px;
    font-size: 14px;
    background: transparent;
    border-bottom-color: ${({ theme }) => theme.stroke};

    :before {
      background-color: transparent !important;
    }
  }
  .ant-table-tbody > tr > td {
    padding: 16px 5px;
    border-bottom-color: ${({ theme }) => theme.stroke};
  }

  .ant-table-tbody > tr.ant-table-row:hover > td {
    background: ${({ theme }) => theme.backgroundVariant};
  }

  .ant-image {
    width: 45px;
    border-radius: 4px;
  }
  .ant-list-item {
    padding: 0;
    .ant-list-item-meta-title {
      font-size: 14px;
      font-weight: normal;
      overflow: hidden;
      text-overflow: ellipsis;
      /* white-space: nowrap; */
      a {
        color: ${({ theme }) => theme.text};
      }
    }
    .ant-list-item-meta-description {
      font-weight: normal;
      font-size: 12;
      color: rgba(0, 0, 0, 0.4);
    }
  }
  .ant-select-multiple .ant-select-selection-item {
    display: none;
  }
  thead tr {
    /* background: #e0e0e0; */
  }
  th.ant-table-cell {
    /* display: flex; */
    /* background: #e0e0e0; */
  }
  .ant-pagination-item {
    border-radius: 4px;
    &-link {
      border-radius: 4px;
      & .anticon {
        vertical-align: 1px;
      }
    }
    &-active {
      background: #3d56a6;
      border: 1px solid #435ebe;
      a {
        color: white;
      }
    }
  }
`;

export default memo(Table);
