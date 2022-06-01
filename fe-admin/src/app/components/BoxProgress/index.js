import React, { useState, useEffect, memo } from 'react';
import styled from 'styled-components';
import { LoadingOutlined, CheckCircleTwoTone } from '@ant-design/icons';
import { Modal, Progress } from 'antd';
import { Button } from 'app/components';
import { box } from 'assets/images/icons';
import { isEmpty } from 'lodash';
const typeProgress = [
  {
    type: 'PUSH_PRODUCT',
    title: 'Đang đẩy sản phẩm',
    desc: 'Sản phẩm đã đẩy',
    typePercent: 'number',
  },
  {
    type: 'PUSH_ORDER',
    title: 'Đang đẩy đơn hàng',
    desc: 'Tiến trình',
    typePercent: 'percent',
  },
  {
    type: 'GET_IMAGE',
    title: 'Đang tải xuống hình ảnh',
    desc: 'Số lượng ảnh đã tải',
    typePercent: 'number',
  },
];

const OpenProgress = ({ type, countTotal }) => {
  const [isDone, setIsDone] = useState(false);
  const [isDoneTimeout, setIsDoneTimeout] = useState(false);
  const [visibleProgress, setVisibleProgress] = useState(true);
  const [visibleModalProgress, setVisibleModalProgress] = useState(false);
  const [contentProgress, setContentProgress] = useState({});
  const [tempCount, setTempCount] = useState(10);

  const onCloseModal = () => {
    setVisibleModalProgress(false);
  };

  useEffect(() => {
    if (!isEmpty(type)) {
      typeProgress.map(item => {
        if (item.type === type) {
          setContentProgress(item);
        }
      });
    }
  }, [type]);

  useEffect(() => {
    let upCount;
    let temp = tempCount;
    upCount = setInterval(() => {
      if (temp === countTotal - 10) {
      } else temp = temp + 10;
      setTempCount(temp);
    }, 1000);
    return () => {
      clearInterval(upCount);
    };
  }, []);

  useEffect(() => {
    let timeoutDone;
    if (isDone) {
      setVisibleProgress(true);
      setIsDoneTimeout(true);
      timeoutDone = setTimeout(() => {
        setVisibleProgress(false);
        setIsDoneTimeout(false);
      }, 50000);
      return () => {
        clearTimeout(timeoutDone);
      };
    }
  }, [isDone]);

  return (
    <>
      {(visibleProgress || isDoneTimeout) && (
        <CustomProgress>
          <div className="item" onClick={() => setVisibleModalProgress(true)}>
            <div className="title">{contentProgress.title}</div>
            <div className="content">
              <div>
                {isDone ? (
                  <CheckCircleTwoTone
                    className="icon-done"
                    twoToneColor="#52c41a"
                  />
                ) : (
                  <LoadingOutlined className="icon-loading" />
                )}
              </div>
              <div>
                <div className="desc">{contentProgress.desc}</div>
                <div className="percent">
                  {isDone ? '100%' : tempCount + '/' + countTotal}
                </div>
              </div>
            </div>
          </div>
          <Button className="btn-sm" onClick={() => setIsDone(true)}>
            done
          </Button>
        </CustomProgress>
      )}
      <CustomModal
        name="modal-progress"
        visible={visibleModalProgress}
        footer={null}
        width={540}
        onCancel={onCloseModal}
      >
        <div className="modal__header">
          <div className="modal__title">Các tiến trình đang chạy</div>
          <div className="modal__desc">
            Các thay đổi đang được thêm vào hệ thống. Quá trình có thể sẽ mất
            một vài phút, bạn có thể ẩn popup này và quay lại sau
          </div>
        </div>
        <div className="modal__list-progress">
          <div className="item-progress">
            <div className="left">
              <img src={box} alt="" />
            </div>
            <div className="right">
              <div className="name">
                <div className="desc-progress">{contentProgress.desc}</div>
                <div className="percent">
                  {tempCount}/{countTotal}
                </div>
              </div>
              <Progress
                strokeColor={{
                  from: '#3D56A6',
                  to: '#3D56A6',
                }}
                percent={tempCount}
                status="active"
              />
            </div>
          </div>
        </div>

        <div className="btn-action">
          <Button className="btn-sm" onClick={onCloseModal}>
            Ẩn
          </Button>
        </div>
      </CustomModal>
    </>
  );
};

const CustomProgress = styled.div`
  position: fixed;
  bottom: 16px;
  right: 18px;
  z-index: 120;
  max-height: 500px;
  .item {
    width: 222px;
    height: 100px;
    background: #f4f6fd;
    padding: 10px 15px 0;
    border: 1px solid #ebebf0;
    box-sizing: border-box;
    box-shadow: 0px 3px 15px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    .title {
      font-weight: bold;
      font-size: 16px;
      line-height: 19px;
      color: #6c798f;
    }
    .content {
      display: flex;
      background: #ffffff;
      border-radius: 4px;
      width: 100%;
      height: 50px;
      padding: 8px 16px;
      margin-top: 12px;
      .icon-loading {
        margin-right: 10px;
      }
      .anticon.anticon-loading.anticon-spin {
        margin-top: 8px;
        width: 20px;
        height: 20px;
        svg {
          width: 20px;
          height: 20px;
        }
      }
      .icon-done {
        margin-right: 10px;
      }
      .anticon.anticon-check-circle {
        margin-top: 8px;
        width: 20px;
        height: 20px;
        svg {
          width: 20px;
          height: 20px;
        }
      }

      .percent {
        margin-top: 2px;
        font-size: 12px;
        line-height: 14px;
        color: #2f80ed;
      }
    }
    &:hover {
      cursor: pointer;
    }
    &:not(:first-child) {
      margin-top: 16px;
    }
    &:nth-child(n + 5) {
      display: none;
    }
  }
`;

const CustomModal = styled(Modal)`
  .ant-modal-content {
    background: #f4f6fd;
    border-radius: 6px;
  }
  .modal__header {
    text-align: center;
    .modal__title {
      font-weight: bold;
      font-size: 30px;
      line-height: 35px;
      color: #3d56a6;
    }
    .modal__desc {
      font-size: 14px;
      line-height: 22px;
      letter-spacing: 0.03em;
      margin-top: 4px;
    }
  }
  .modal__list-progress {
    margin-top: 21px;
    height: 500px;
    max-height: 500px;
    overflow-y: scroll;

    .item-progress {
      display: flex;
      width: 100%;
      height: 95px;
      background: #ffffff;
      border: 1px solid #ebebf0;
      box-sizing: border-box;
      box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.05);
      border-radius: 4px;
      padding: 20px;
      &:not(:first-child) {
        margin-top: 12px;
      }
      .left {
        width: 20%;
      }
      .right {
        width: 80%;
        .name {
          display: flex;
          justify-content: space-between;
          font-weight: bold;
        }
      }
      .ant-progress-outer {
        padding-right: 0;
      }
      .ant-progress-text {
        display: none;
      }
    }
  }
  .btn-action {
    display: flex;
    justify-content: end;
    margin-top: 24px;
  }
`;

export default memo(OpenProgress);
