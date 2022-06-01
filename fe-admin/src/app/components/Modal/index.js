/* eslint-disable no-unused-expressions */

import React, { useState } from 'react';
import { Modal, Space } from 'antd';
import { Button } from 'app/components';
import { CustomStyle } from 'styles/commons';

const CustomModal = ({
  children,
  title = '',
  callBackOk = () => null,
  callBackCancel = () => null,
  isOpen,
  needWait = false,
  disableOk,
  ...res
}) => {
  const [isModalVisible, setIsModalVisible] = useState(isOpen ?? true);
  const [loading, setLoading] = useState(false);

  const handleOk = e => {
    if (needWait) {
      setLoading(true);
      async () => {
        try {
          callBackOk(e);
          setLoading(true);
          setTimeout(() => {
            setIsModalVisible(false);
          }, 500);
        } catch (err) {
          setLoading(false);
        }
      };
    } else {
      callBackOk(e);
      setIsModalVisible(false);
    }
  };

  const handleCancel = () => {
    callBackCancel();
    setIsModalVisible(false);
  };

  return (
    <>
      <Modal
        title={title || '22'}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <CustomStyle my={{ xs: 's4' }}>
            <Space>
              <Button
                key="back"
                className="btn-sm"
                onClick={handleCancel}
                color="default"
                context="secondary"
              >
                Hủy bỏ
              </Button>
              <Button
                loading={loading}
                disabled={disableOk}
                className="btn-sm"
                onClick={handleOk}
              >
                Xác nhận
              </Button>
            </Space>
          </CustomStyle>,
        ]}
        {...res}
      >
        {children}
      </Modal>
    </>
  );
};

export default CustomModal;
