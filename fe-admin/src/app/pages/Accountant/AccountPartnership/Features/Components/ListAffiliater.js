import React, { useMemo, useEffect, useState } from 'react';
import { Row, Col, Spin } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import {
  Button,
  Table,
  BoxColor,
  EmptyPage,
  // Avatar,
} from 'app/components';
import { CustomTitle, CustomStyle } from 'styles/commons';
import { isEmpty } from 'lodash';
// import styled from 'styled-components/macro';
import constants from 'assets/constants';
import {
  // selectLoading,
  // selectData,
  selectDataListAffiliater,
  selectPaginationListAffiliater,
  selectShowEmptyPageListAffiliater,
} from '../../slice/selectors';
import { useAffiliateSlice } from '../../slice';
import { formatDate } from 'utils/helpers';
import { DEFAULT_FILTER } from '../FilterBarListAffiliater';
import { ModalUpdatePercentCommission } from '.';
import { FilterBarListAffiliater } from '..';
// import moment from 'moment';

export default function ListAffiliater({ t, layout, history, isLoading }) {
  const dispatch = useDispatch();
  const { actions } = useAffiliateSlice();
  const pagination = useSelector(selectPaginationListAffiliater);
  const data = useSelector(selectDataListAffiliater);
  // const isLoading = useSelector(selectLoading);
  const showEmptyPage = useSelector(selectShowEmptyPageListAffiliater);
  const [filter, setFilter] = useState(DEFAULT_FILTER);

  const [
    isShowModalUpdatePercentCommision,
    setIsShowModalUpdatePercentCommision,
  ] = useState(false);
  const [record, setRecord] = useState({});

  const updateFilter = data => {
    const values = {
      ...filter,
      ...data,
    };

    setFilter(values);
  };

  const fetchData = () => {
    const queryParams = Object.keys(filter).reduce((values, key) => {
      const value = filter[key];
      if (value !== '') {
        values.push(`${[key]}=${value}`);
      }
      return values;
    }, []);

    let querySearch = queryParams.join('&');
    querySearch = querySearch && `?${querySearch}`;

    dispatch(actions.getDataListAffiliater(querySearch));
  };

  useEffect(() => {
    fetchData();
  }, [filter]);
  // const handleStatus = expiry_at => {
  //   if (moment().isAfter(expiry_at, 'day')) {
  //     return 'expired';
  //   } else return 'active';
  // };

  const handleShowModal = record => {
    setIsShowModalUpdatePercentCommision(true);
    setRecord(record);
  };

  const columns = useMemo(
    () => [
      {
        title: 'STT',
        width: 40,
        render: (_, v, i) => i + 1,
      },
      {
        title: 'ID',
        dataIndex: 'partner_id',
        key: 'partner_id',
        width: 40,
        render: (text, record) => {
          return (
            <div
              style={{
                fontWeight: 'bold',
              }}
            >
              {text}
            </div>
          );
        },
      },
      {
        title: 'T??n ng?????i ????ng k??',
        dataIndex: 'full_name',
        key: 'full_name',
        width: 100,
        render: text => {
          return (
            <div
              style={{
                fontWeight: 'bold',
              }}
            >
              {text}
            </div>
          );
        },
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        width: 160,
      },
      {
        title: 'Ng??y tham gia',
        dataIndex: 'created_at',
        key: 'created_at',
        width: 160,
        render: text => {
          return (
            <div style={{ fontSize: '14px', color: '#828282' }}>
              {formatDate(text)}
            </div>
          );
        },
      },
      {
        title: 'S??? ng?????i gi???i thi???u',
        dataIndex: 'total_partner',
        key: 'total_partner',
        width: 100,
        render: text => {
          return <div>{text}</div>;
        },
      },
      {
        title: 'T???ng s??? ????n h??ng',
        dataIndex: 'total_order',
        key: 'total_order',

        width: 100,
        render: text => {
          return <div>{text}</div>;
        },
      },
      {
        title: 'Chi???t kh???u l???n 1',
        dataIndex: 'first_order_percent',
        key: 'first_order_percent',
        width: 100,
        render: text => {
          return (
            <div style={{ fontSize: '14px', color: 'green' }}>{text}%</div>
          );
        },
      },
      {
        title: 'Chi???t kh???u l???n 2',
        dataIndex: 'second_order_percent',
        key: 'second_order_percent',
        width: 100,
        render: text => {
          return (
            <div style={{ fontSize: '14px', color: '#40a9ff' }}>{text}%</div>
          );
        },
      },
      // {
      //   title: 'Ng??y h???t h???n',
      //   dataIndex: 'partner_affiliate_expiry_date',
      //   key: 'partner_affiliate_expiry_date',
      //   width: 160,
      //   render: text => {
      //     return (
      //       <div style={{ fontSize: '14px', color: '#828282' }}>
      //         {formatDate(text)}
      //       </div>
      //     );
      //   },
      // },
      // {
      //   title: 'Tr???ng th??i ti???p th???',
      //   width: 160,
      //   align: 'center',
      //   render: (_, record) => {
      //     const currentStatus = constants.AFFILIATE_STATUS.find(
      //       v => v.id === handleStatus(record.partner_affiliate_expiry_date),
      //     );
      //     return (
      //       <>
      //         {isEmpty(currentStatus) || (
      //           <BoxColor colorValue={currentStatus?.color} width="120px">
      //             {currentStatus?.name}
      //           </BoxColor>
      //         )}
      //         {/* <div className="action-wrapper">{getRowAction(record)}</div> */}
      //       </>
      //     );
      //   },
      // },
      {
        title: 'Tr???ng th??i t??i kho???n',
        dataIndex: 'status',
        key: 'status',
        width: 120,
        align: 'center',
        render: (text, record) => {
          const currentStatus = constants.USER_STATUS?.find(v => v.id === text);
          return (
            <>
              {isEmpty(currentStatus) || (
                <BoxColor colorValue={currentStatus?.color} width="120px">
                  {currentStatus?.name}
                </BoxColor>
              )}
              <div className="action-wrapper">{getRowActionHandle(record)}</div>
            </>
          );
        },
      },
    ],
    [],
  );

  const getRowActionHandle = record => {
    return (
      <>
        <Button
          className="btn-sm"
          onClick={() => {
            handleShowModal(record);
          }}
        >
          C???p nh???t
        </Button>
      </>
    );
  };

  const onChangeTable = pagination => {
    updateFilter({ page: pagination.current });
  };

  const pageContent = (
    <>
      <CustomStyle mb={{ xs: 's5' }}>
        <FilterBarListAffiliater
          filter={filter}
          updateFilter={updateFilter}
          isLoading={isLoading}
        />
      </CustomStyle>
      <Spin tip="??ang t???i..." spinning={isLoading}>
        <Row gutter={24}>
          <Col span={24}>
            <Table
              className="table-custom"
              columns={columns}
              // searchSchema={{
              //   keyword: {
              //     required: false,
              //   },
              //   status: {
              //     required: false,
              //   },
              // }}
              notNeedRedirect={true}
              data={{ data }}
              onChange={onChangeTable}
              pagination={{
                showSizeChanger: false,
                // defaultCurrent: pagination.page,
                // hideOnSinglePage: true,
                pageSize: pagination?.page_size || 1,
                total: pagination.total ?? 0,
                showTotal: total => <b>Hi???n th??? {total} tr??n t???ng 10</b>,
              }}
              scroll={{ x: 1100, y: 5000 }}
              // actions={gotoPage}
              rowKey={record => record.id}
            />
          </Col>
        </Row>
      </Spin>
      <ModalUpdatePercentCommission
        layout={layout}
        record={record}
        fetchData={fetchData}
        isShowModalUpdatePercentCommision={isShowModalUpdatePercentCommision}
        setIsShowModalUpdatePercentCommision={
          setIsShowModalUpdatePercentCommision
        }
      />
    </>
  );

  if (showEmptyPage) {
    return (
      <>
        <CustomTitle
          height="calc(100vh - 120px)"
          className="d-flex flex-column"
        >
          <EmptyPage />
        </CustomTitle>
      </>
    );
  }
  return <>{pageContent}</>;
}
