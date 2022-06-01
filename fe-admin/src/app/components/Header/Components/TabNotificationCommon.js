import React, { useState, useEffect } from 'react';
import { bell } from 'assets/images/icons';
// import { Link } from 'react-router-dom';
import { formatDate } from 'utils/helpers';

import { Spin, Modal } from 'antd';
import { isEmpty } from 'lodash';
import request from 'utils/request';
import styled from 'styled-components/macro';
import { bellNotification } from 'assets/images';

export default function TabNotificationCommon({
  SectionEmptyNotify,
  updateStatusReadAll,
  onlyShowUnRead,
  // updateStatusReadAndRedirect,
  SectionEmptyNotifyUnread,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [pageSize, setPageSize] = useState(8);
  const [notifyCommon, setNotifyCommon] = useState(null);
  const [idsNotify, setIdsNotify] = useState([]);
  const [isVisibleDetailNotify, setIsVisibleDetailNotify] = useState(false);
  const [record, setRecord] = useState('');

  const fetchDataNotifyCommon = async () => {
    const url = `common-service/notifications?page=1&page_size=${pageSize}&type=common`;
    const response = await request(url, {
      method: 'get',
    })
      .then(response => {
        if (response?.data) setNotifyCommon(response?.data);
      })
      .catch(error => setIsError(true));
  };

  useEffect(() => {
    fetchDataNotifyCommon();
  }, []);

  const updateStatusReadAndShowDetail = async record => {
    if (record.read_status === 'unread') {
      const url = `common-service/message/${record.id}`;
      const response = await request(url, {
        method: 'put',
      })
        .then(response => {
          if (!isEmpty(response?.data));
        })
        .catch(error => error);
    }
  };

  useEffect(() => {
    const filterIds = () => {
      let temp = [];
      if (!isEmpty(notifyCommon)) {
        notifyCommon.map((item, index) => {
          if (item.read_status === 'unread') temp.push(item.id);
        });
      }
      setIdsNotify(temp);
    };
    filterIds();
  }, [notifyCommon]);

  useEffect(() => {
    fetchDataNotifyCommon();
  }, [pageSize]);

  const handleUpdateStatus = async () => {
    await updateStatusReadAll(idsNotify);
    await fetchDataNotifyCommon();
  };

  const handleUpdateStatusAndShowDetail = record => {
    if (record.read_status === 'unread') {
      updateStatusReadAndShowDetail(record);
      fetchDataNotifyCommon();
    }
    setRecord(record);
    setIsVisibleDetailNotify(true);
  };

  const handleShowMore = () => {
    setIsLoading(true);
    const delaySecond = 1000;
    let loadingTimeout;
    loadingTimeout = setTimeout(() => {
      setPageSize(pageSize + 8);
      setIsLoading(false);
    }, delaySecond);
    return () => {
      clearTimeout(loadingTimeout);
    };
  };

  const pageContent = !isEmpty(notifyCommon) ? (
    <>
      <div className="action">
        <div className="notify-new">Mới nhất</div>
        <div className="mark-as-read" onClick={handleUpdateStatus}>
          Đánh dấu đã đọc
        </div>
      </div>
      <div className="list-notification">
        {onlyShowUnRead
          ? notifyCommon.filter(temp => temp.read_status === 'unread').length >=
            1
            ? notifyCommon
                .filter(temp => temp.read_status === 'unread')
                .map((item, index) => (
                  <div
                    key={index}
                    className="item-notification unread"
                    onClick={() => handleUpdateStatusAndShowDetail(item)}
                  >
                    <div className="notify-img">
                      <img src={item.img ? item.img : bell} alt="" />
                    </div>
                    <div className="notify-content">
                      <div className="title">{item?.name}</div>
                      <div className="content">
                        {item?.content.slice(0, 1).toUpperCase() +
                          item?.content.slice(1, 40) +
                          (item?.content.length > 40 ? '...' : '')}
                      </div>
                      <div className="notify-time">
                        {formatDate(item?.created_at)}
                      </div>
                    </div>
                    <div
                      className={
                        item?.read_status === 'unread'
                          ? 'dot-unread'
                          : 'dot-unread hide'
                      }
                    ></div>
                  </div>
                ))
            : SectionEmptyNotifyUnread()
          : notifyCommon.map((item, index) => (
              <div
                key={index}
                className={
                  item?.read_status === 'unread'
                    ? 'item-notification unread'
                    : 'item-notification'
                }
                onClick={() => handleUpdateStatusAndShowDetail(item)}
              >
                <div className="notify-img">
                  <img src={item.img ? item.img : bell} alt="" />
                </div>
                <div className="notify-content">
                  <div className="title">{item?.name}</div>
                  <div className="content">
                    {item?.content.slice(0, 1).toUpperCase() +
                      item?.content.slice(1, 40) +
                      (item?.content.length > 40 ? '...' : '')}
                  </div>
                  <div className="notify-time">
                    {formatDate(item?.created_at)}
                  </div>
                </div>
                <div
                  className={
                    item?.read_status === 'unread' ? 'dot-unread' : 'hide'
                  }
                ></div>
              </div>
            ))}
      </div>
      {notifyCommon.length < 8 || (
        <div className="show-more" onClick={handleShowMore}>
          Xem thêm
        </div>
      )}
      {isLoading && (
        <div className="loading-show-more">
          <Spin />
        </div>
      )}
      <Modal
        name="modal-set-time-auto-send"
        visible={isVisibleDetailNotify}
        footer={null}
        // width={450}
        onCancel={() => setIsVisibleDetailNotify(false)}
      >
        <Content>
          <img className="modal-img" src={bellNotification} alt="" />
          <div className="notify-title">{record.name}</div>

          <div className="notify-content">{record.content}</div>
          <div className="notify-date">{formatDate(record.created_at)}</div>
        </Content>
      </Modal>
    </>
  ) : (
    SectionEmptyNotify()
  );

  return (
    <>
      {notifyCommon ? (
        pageContent
      ) : (
        <div className="loading">
          {!isError ? (
            <Spin tip="Đang tải..." />
          ) : (
            <>
              Lỗi không xác định !
              <br /> Mong khách hàng thông cảm{' '}
            </>
          )}
        </div>
        //   <div className="loading">
        //     <Spin tip="Đang tải..." />
        // </div>
      )}
    </>
  );
}

const Content = styled.div`
  text-align: center;
  margin-top: 20px;
  .modal-img {
    width: 80px;
    display: flex;
    margin: auto;
  }
  .notify-title {
    font-weight: bold;
    font-size: 18px;
    line-height: 21px;
    margin-bottom: 6px;
  }
  .notify-content {
    font-size: 14px;
    line-height: 21px;
    margin: 24px 0 12px;
    text-align: start;
  }
  .notify-date {
    font-size: 12px;
    color: #828282;
    line-height: 21px;
    text-align: start;
  }
`;
