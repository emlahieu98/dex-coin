import React, { useState, useEffect, memo } from 'react';
import styled from 'styled-components';
import { isEmpty } from 'lodash';
import { LoadingOutlined, CheckCircleTwoTone } from '@ant-design/icons';
// import { ModalProgress } from 'app/components';

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

const ProgressBar = ({
  type,
  //  setVisibleModalProgress,
  countTotal,
}) => {
  const [isDone, setIsDone] = useState(false);
  const [isDoneTimeout, setIsDoneTimeout] = useState(false);
  const [visibleProgress, setVisibleProgress] = useState(true);
  const [contentProgress, setContentProgress] = useState({});
  const [tempCount, setTempCount] = useState(10);

  const [visibleModalProgress, setVisibleModalProgress] = useState(false);

  useEffect(() => {
    if (!isEmpty(type)) {
      typeProgress.map(item => {
        if (item.type === type) {
          setContentProgress(item);
        }
      });
    }
  }, [type]);

  // useEffect(() => {
  //   if (isDoneBtn === true) {
  //     setIsDone(true);
  //   }
  // }, [isDoneBtn]);

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
      }, 5000);
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
        </CustomProgress>
      )}
    </>
  );
};

const CustomProgress = styled.div`
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

export default memo(ProgressBar);
