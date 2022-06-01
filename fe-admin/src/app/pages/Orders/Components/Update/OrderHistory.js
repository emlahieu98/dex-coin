import React, { useState, useEffect } from 'react';
import { Timeline, Skeleton } from 'antd';
import { OrderHistoryWrapper } from '../../styles/OrderDetail';
import { isEmpty } from 'lodash';
import request from 'utils/request';
import { formatDate } from 'utils/helpers';

export default function OrderHistory({ orderData, orderId }) {
  const [isLoadingInternal, setLoadingInternal] = useState(false);
  const [orderTimeline, setOrderTimeline] = useState([]);

  const isLoadingPage = isLoadingInternal || isEmpty(orderData);
  useEffect(() => {
    fetchOrderTimeLine();
  }, []);

  const getFirstOrderTime = () => {
    if (isEmpty(orderData)) {
      return [];
    }
    return {
      short_description: 'Tiếp nhận đơn hàng',
      created_at: orderData.created_at,
    };
  };

  const fetchOrderTimeLine = async () => {
    setLoadingInternal(true);
    const response = await request(`oms/seller/order/${orderId}/timeline`, {
      method: 'get',
    });
    if (response.is_success) {
      setOrderTimeline(response.data);
    }
    setLoadingInternal(false);
  };

  const getAllOrderTimeLine = () => {
    return [...(orderTimeline || []), getFirstOrderTime()];
  };

  const getTimelineTitle = timeline => {
    return timeline.action === 'comment'
      ? 'Ghi chú: ' + timeline.note
      : timeline.short_description;
  };

  const pageContent = isLoadingPage ? (
    <Skeleton active paragraph={{ rows: 4 }} />
  ) : (
    <>
      <div className="order-history__top">
        <div>
          <span className="section-title">Lịch sử đơn hàng</span>
        </div>
      </div>
      <div className="store-info_content">
        <div className="order-timeline">
          <Timeline>
            {getAllOrderTimeLine().map((item, index) => (
              <Timeline.Item key={index} color="green">
                <p className="timeline__title">{getTimelineTitle(item)}</p>
                <p className="timeline__desc">{formatDate(item.created_at)}</p>
              </Timeline.Item>
            ))}
          </Timeline>
        </div>
      </div>
    </>
  );

  return (
    <OrderHistoryWrapper className="box-df">{pageContent}</OrderHistoryWrapper>
  );
}
