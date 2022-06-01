import React from 'react';
import { Modal } from 'antd';
import Styled from 'styled-components';
import Button from 'app/components/Button';

function Confirm({
  data,
  isModalVisible,
  handleCancel,
  handleConfirm,
  title,
  title1,
}) {
  return (
    <Modal
      title=""
      visible={isModalVisible}
      onCancel={handleCancel}
      footer={null}
    >
      <Wrapper>
        {title && <div className="title">{title}</div>}
        <div className="mb-5 title">{data.name}</div>
        {title1 && <div className="text-danger font-weight-bold">{title1}</div>}
        <div className="font-weight-bold mb-4">Tiếp tục?</div>
        <div className="row justify-content-center">
          <div className="d-flex justify-content-between col-12 col-xl-6">
            <Button
              // onClick={onMenuClick(null, 2)}
              className="btn-md mr-2"
              context="secondary"
              onClick={handleCancel}
              color="blue"
            >
              <span>Hủy</span>
            </Button>
            <Button
              color="green"
              // type="primary"
              onClick={handleConfirm}
              className="btn-md"
            >
              <span>Đồng ý</span>
            </Button>
          </div>
        </div>
      </Wrapper>
    </Modal>
  );
}

const Wrapper = Styled.div`
text-align: center;
.title {
  color: #172B4D;
  font-weight: 700;
  font-size: 24px;
}
`;

export default Confirm;
