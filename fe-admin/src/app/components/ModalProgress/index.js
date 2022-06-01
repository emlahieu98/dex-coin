import React, { memo } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { Modal, Progress } from 'antd';
import { Button } from 'app/components';
import { box } from 'assets/images/icons';
import { isEmpty } from 'lodash';
import { selectProgress } from 'app/pages/AppPrivate/slice/selectors';

const ModalProgress = ({ visibleModalProgress, setVisibleModalProgress }) => {
  const currentAllProgress = useSelector(selectProgress);

  const onCloseModal = () => {
    setVisibleModalProgress(false);
  };

  return (
    <>
      <CustomModal
        name="modal-progress"
        visible={visibleModalProgress}
        // visible={visibleModalProgress && !isEmpty(currentAllProgress)}
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
          {!isEmpty(currentAllProgress) &&
            currentAllProgress.map(item => {
              <div className="item-progress">
                <div className="left">
                  <img src={box} alt="" />
                </div>
                <div className="right">
                  <div className="name">
                    <div className="desc-progress">{item.desc}</div>
                    <div className="percent">
                      {item.tempCount}/{item.countTotal}
                    </div>
                  </div>
                  <Progress
                    strokeColor={{
                      from: '#3D56A6',
                      to: '#3D56A6',
                    }}
                    percent={(item.tempCount * 100) / item.countTotal}
                    status="active"
                  />
                </div>
              </div>;
            })}
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

export default memo(ModalProgress);
