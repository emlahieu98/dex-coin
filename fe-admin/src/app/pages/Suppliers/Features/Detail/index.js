import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components/macro';
import { isEmpty } from 'lodash';
import { globalActions } from 'app/pages/AppPrivate/slice';
import { Spin, Tabs } from 'antd';
import { selectLoading, selectDetail } from '../../slice/selectors';
import { useSuppliersSlice } from '../../slice';
import { PageWrapper } from 'app/components';
import { Info, Warehouse } from './Component';

const { TabPane } = Tabs;

// const layout = {
//   labelCol: { xs: 24, sm: 24 },
//   wrapperCol: { xs: 24, sm: 24, md: 24 },
//   labelAlign: 'left',
// };

export function Detail({ match }) {
  const id = match?.params?.id;
  const dispatch = useDispatch();

  const { actions } = useSuppliersSlice();
  const isLoading = useSelector(selectLoading);
  const data = useSelector(selectDetail);
  console.log('render???');

  useEffect(() => {
    return () => {
      dispatch(globalActions.setDataBreadcrumb({}));
      dispatch(actions.getDetailDone({}));
    };
  }, []);

  useEffect(() => {
    const dataBreadcrumb = {
      menus: [
        {
          name: 'Nhà cung cấp',
          link: '/suppliers',
        },
        {
          name: 'Thông tin',
        },
      ],
      fixWidth: true,
      title: '',
      status: '',
      // actions:
      //   data?.publish_status === 'pending_for_review' ? (
      //     <div className="d-flex justify-content-between">
      //       <Space>
      //         <Button
      //           context="secondary"
      //           color="orange"
      //           onClick={handleRejectSupplier}
      //           className="btn-sm btn-cancel"
      //         >
      //           <span>Từ chối</span>
      //         </Button>
      //         <Button
      //           type="primary"
      //           className="btn-sm mr-2"
      //           onClick={handleApproveSupplier}
      //           color="blue"
      //         >
      //           <span>Xác nhận</span>
      //         </Button>
      //       </Space>
      //     </div>
      //   ) : (
      //     ''
      //   ),
    };
    if (!isEmpty(data)) {
      dataBreadcrumb.title = data?.name;
      dataBreadcrumb.status =
        data?.register_status === 'pending_for_review'
          ? data.register_status
          : data.register_status === 'pending_for_review_after_update'
          ? data.register_status
          : data.register_status === 'reject'
          ? data.register_status
          : data.status;
    } else {
      if (id) {
        dispatch(actions.getDetail(id));
      }
    }
    dispatch(globalActions.setDataBreadcrumb(dataBreadcrumb));
  }, [data]);

  // const handleApproveSupplier = async () => {
  //   dispatch(
  //     actions.TransferStatusSupplierDetail({
  //       id,
  //       data: {
  //         ...data,
  //         status: 'active',
  //         publish_status: 'active',
  //       },
  //     }),
  //   );
  //   await dispatch(actions.getDetail(id));
  // };

  // const handleRejectSupplier = async () => {
  //   await dispatch(
  //     actions.TransferStatusSupplierDetail({
  //       id,
  //       data: {
  //         ...data,
  //         status: 'inactive',
  //         publish_status: 'inactive',
  //       },
  //     }),
  //   );
  //   await dispatch(actions.getDetail(id));
  // };

  return (
    <PageWrapper fixWidth>
      {/* <PageWrapper style={{ width: '1200px' }}> */}
      <Spin tip="Đang tải..." spinning={isLoading}>
        <CustomTabs defaultActiveKey="1">
          <TabPane tab="Thông tin" key="1">
            <Info id={id} isLoading={isLoading} />
          </TabPane>
          <TabPane tab="Kho hàng" key="2">
            <Warehouse id={id} isLoading={isLoading} />
          </TabPane>
        </CustomTabs>
      </Spin>
    </PageWrapper>
  );
}

const CustomTabs = styled(Tabs)`
  .ant-tabs-nav {
    margin: 0 auto 24px;
  }
  /* .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    font-weight: bold;
    font-size: 20px;
    line-height: 18px;
    color: #3d56a6;
  } */
  .ant-input[disabled] {
    color: #333333;
  }
`;
