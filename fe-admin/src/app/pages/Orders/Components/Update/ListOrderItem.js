import React, { useState, useEffect } from 'react';
import { ListOrderItemWrapper } from '../../styles/OrderDetail';
import { isEmpty } from 'lodash';
import { BoxColor, Image } from 'app/components';
import constants from 'assets/constants';
import { formatVND } from 'utils/helpers';
import { formatDate } from 'utils/helpers';
import { Skeleton } from 'antd';

export default function ListOrderItem({ order }) {
  const isLoading = isEmpty(order);

  function getStatus() {
    const statusId = order.fulfillment_status;
    const currentStatus = constants.ORDER_FULFILLMENT_STATUS.find(
      v => v.id === statusId,
    );
    return (
      isEmpty(currentStatus) || (
        <BoxColor
          className="status-fulfill font-df"
          notBackground
          colorValue={currentStatus?.color}
        >
          {currentStatus?.name || ''}
        </BoxColor>
      )
    );
  }

  if (isLoading) {
    return (
      <ListOrderItemWrapper loading className="box-df">
        <Skeleton active paragraph={{ rows: 12 }} />
      </ListOrderItemWrapper>
    );
  }

  return (
    <ListOrderItemWrapper className="box-df">
      <div className="top-title px-default">
        <div className="top-title__left">{getStatus()}</div>
        <div className="top-title__right">
          <span>Ngày tạo đơn: </span>
          <span>{formatDate(order.created_at)}</span>
        </div>
      </div>
      <div className="content-items border-df">
        <table className="order-item-tbl">
          <thead>
            <tr>
              <td>Sản phẩm</td>
              <td>Giá</td>
              <td>Số lượng</td>
              <td>Thành tiền</td>
            </tr>
          </thead>
          <tbody>
            {order.order_items.map(item => {
              return (
                <tr>
                  <td>
                    <div>
                      <Image className="order-thumbnail" src={item.thumb} />
                      <div className="order-info-text">
                        <span>
                          <a
                            href={item.metadata?.product_detail_url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {item.metadata?.shop_product_name ||
                              item.product_name}
                          </a>
                        </span>
                        <span>SKU: {item.shop_product_variation_id}</span>
                        <span>
                          {item.metadata?.shop_variation_name ||
                            item.product_variation_name}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>{formatVND(item.retail_price)} đ</td>
                  <td>{item.quantity}</td>
                  <td>{formatVND(item.retail_price * item.quantity)} đ</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </ListOrderItemWrapper>
  );
}
