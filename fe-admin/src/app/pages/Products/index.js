/**
 *
 * Products
 *
 */
import * as React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Spin, List } from 'antd';
import { Table, PageWrapper, Image, Link, BoxColor } from 'app/components';
// import constants from 'assets/constants';
import { CustomH3, SectionWrapper } from 'styles/commons';
import { formatVND } from 'utils/helpers';
// import { EditOutlined } from '@ant-design/icons';
import { useProductsSlice } from './slice';
import { COMBINE_STATUS } from './constants';
import { FilterBar } from './Features';
import { CustomStyle } from 'styles/commons';
import { selectLoading, selectData, selectPagination } from './slice/selectors';
import { messages } from './messages';
import Confirm from 'app/components/Modal/Confirm';

export function Products({ history }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { actions } = useProductsSlice();
  const isLoading = useSelector(selectLoading);
  const data = useSelector(selectData);
  const pagination = useSelector(selectPagination);

  const [isShowConfirmStatus, setIsShowConfirmStatus] = React.useState(false);
  const [detail, setDetail] = React.useState({});
  const [newStatus, setNewStatus] = React.useState({});

  // React.useEffect(() => {
  //   gotoPage();
  // }, []);

  // const gotoPage = ({ p = pagination.page, keyword = '' } = {}) => {
  //   dispatch(actions.getData({ page: p, keyword }));
  // };

  const gotoPage = (data = '') => {
    dispatch(actions.getData(data));
  };

  // const handleShowConfirm = data => status => {
  //   setDetail(data);
  //   setNewStatus(constants.PRODUCT_STATUS.find(item => item.id === status));
  //   toggleConfirmModal();
  // };

  const handleStatus = () => {
    dispatch(
      actions.update({
        id: detail.id,
        data: {
          ...detail,
          status: newStatus.id,
        },
      }),
    );
    setNewStatus('');
    toggleConfirmModal(true);
  };

  const toggleConfirmModal = needRefresh => {
    if (needRefresh === true) gotoPage();
    if (isShowConfirmStatus) setDetail({});
    setIsShowConfirmStatus(!isShowConfirmStatus);
  };

  const columns = React.useMemo(
    () => [
      {
        title: (
          <div className="custome-header">
            <div className="title-box">ID</div>
            {/* <div className="addition"></div> */}
          </div>
        ),
        width: 60,
        dataIndex: 'id',
        key: 'id',
        render: text => <CustomStyle fontWeight="bold">{text}</CustomStyle>,
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Sản phẩm</div>
            {/* <div className="addition"></div> */}
          </div>
        ),
        dataIndex: 'name',
        key: 'name',
        width: 170,
        render: (text, record) => (
          <WrapperOption>
            <List.Item>
              <List.Item.Meta
                avatar={<Image size="45x45" src={record?.thumb?.location} />}
                title={<Link to={`/products/uc/${record.id}`}>{text}</Link>}
                // description={`${record.option_1}${
                //   record.option_2 ? `/${record.option_2}` : ''
                // }${record.option_3 ? `/${record.option_3}` : ''}`}
              />
            </List.Item>
          </WrapperOption>
        ),
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">SKU</div>
            {/* <div className="addition"></div> */}
          </div>
        ),
        dataIndex: 'sku',
        key: 'sku',
        width: 170,
      },
      // {
      //   title: (
      //     <div className="custome-header">
      //       <div className="title-box">Barcode</div>
      //       {/* <div className="addition"></div> */}
      //     </div>
      //   ),
      //   dataIndex: 'barcode',
      //   key: 'barcode',
      //   width: 170,
      // },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Giá NCC</div>
            {/* <div className="addition"></div> */}
          </div>
        ),
        dataIndex: 'origin_supplier_price',
        key: 'origin_supplier_price',
        width: 120,
        render: text => formatVND(text),
      },
      // {
      //   title: (
      //     <div className="custome-header">
      //       <div className="title-box">Giá km</div>
      //       {/* <div className="addition"></div> */}
      //     </div>
      //   ),
      //   dataIndex: 'odii_compare_price',
      //   key: 'odii_compare_price',
      //   width: 120,
      //   render: text => formatVND(text),
      // },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Giá Odil</div>
            {/* <div className="addition"></div> */}
          </div>
        ),
        dataIndex: 'odii_price',
        key: 'odii_price',
        width: 120,
        render: text => formatVND(text),
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Kho</div>
            {/* <div className="addition"></div> */}
          </div>
        ),
        dataIndex: 'from_location',
        key: 'from_location',
        width: 120,
        render: text => `${text?.city || ''}, ${text?.country || ''}`,
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Trạng thái</div>
            {/* <div className="addition"></div> */}
          </div>
        ),
        dataIndex: 'status',
        key: 'status',
        width: 130,
        render: (text, record) => {
          const currentStatus =
            COMBINE_STATUS[`${text}/${record.publish_status}`];
          return (
            currentStatus && (
              <BoxColor fontWeight="medium" colorValue={currentStatus?.color}>
                {currentStatus?.label || ''}
              </BoxColor>
            )
          );
        },
      },
    ],
    [],
  );
  return (
    <PageWrapper>
      <SectionWrapper className="">
        <div className="header">
          <CustomH3 className="title text-left" mb={{ xs: 's6' }}>
            {t(messages.title())}
          </CustomH3>
        </div>
        <CustomH3 className="title text-left" mb={{ xs: 's5' }}>
          <FilterBar isLoading={isLoading} gotoPage={gotoPage} />
        </CustomH3>
        <Spin tip="Đang tải..." spinning={isLoading}>
          <Row gutter={24}>
            <Col span={24}>
              <div>
                <Table
                  className="custom"
                  columns={columns}
                  searchSchema={{
                    keyword: {
                      required: false,
                    },
                    status: {
                      required: false,
                    },
                    publish_status: {
                      required: false,
                    },
                    from_province_id: {
                      required: false,
                    },
                    from_district_id: {
                      required: false,
                    },
                    supplier_id: {
                      required: false,
                    },
                    supplier_warehousing_id: {
                      required: false,
                    },
                  }}
                  data={{ data, pagination }}
                  scroll={{ x: 1100 }}
                  // rowClassName="pointer"
                  actions={gotoPage}
                  // onRow={record => ({
                  //   onClick: goDetail(record),
                  // })}
                />
              </div>
            </Col>
          </Row>
        </Spin>
      </SectionWrapper>
      {isShowConfirmStatus && (
        <Confirm
          data={detail}
          title={`Xác nhận '${newStatus.name}'`}
          isModalVisible={isShowConfirmStatus}
          handleCancel={toggleConfirmModal}
          handleConfirm={handleStatus}
        />
      )}
    </PageWrapper>
  );
}

const WrapperOption = styled.div`
  .ant-image {
    width: 45px;
    border-radius: 4px;
    &-img {
      border-radius: 4px;
    }
  }
  .ant-list-item-meta {
    align-items: center;
  }
  .ant-list-item-meta-title {
    overflow: hidden;
    /* text-align: justify; */
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2; /* number of lines to show */
    -webkit-box-orient: vertical;
  }
  .ant-list-item-meta-description {
    font-weight: 400;
    font-size: 12;
    color: rgba(0, 0, 0, 0.4);
  }
`;
