import React, { useState, memo } from 'react';
import { Upload, message } from 'antd';

import { uploadImage } from 'utils/request';

import styled from 'styled-components/macro';

export default memo(function AddLayer({ emitAction, setLoading, ...props }) {
  const dummyRequest = ({ file, onSuccess }) => {
    setLoading(true);
    uploadImage(file)
      .then(result => {
        onSuccess(result?.data);
      })
      .catch(err => {
        setLoading(false);
      });
  };

  function beforeUpload(file) {
    const fileExtValids = ['image/jpeg', 'image/png'];
    const maxSizeInMb = 5;

    // const isJpgOrPng = file.type ===  || file.type === ;
    if (!fileExtValids.includes(file.type)) {
      message.error(
        `You can only upload [ ${fileExtValids.join(', ')} ] file!`,
      );
      return false;
    }
    if (file.size / 1024 / 1024 > maxSizeInMb) {
      message.error(`Image must smaller than ${maxSizeInMb}MB!`);
      return false;
    }
    return true;
  }

  const handleChangeFile = (info, type) => {
    if (info.file.status === 'uploading') {
      //   isLoading = true;
      return;
    }
    if (info.file.status === 'error') {
    }
    if (info.file.status === 'done') {
      emitAction({ type, data: info.file.response });
    }
  };

  return (
    <AddLayerWrapper {...props}>
      <div className="layer-add__title">Add layer</div>
      <div className="layer-add__content">
        <Upload
          customRequest={dummyRequest}
          beforeUpload={beforeUpload}
          showUploadList={false}
          onChange={file => handleChangeFile(file, 'ADD_BG')}
          className="item-wrapper"
        >
          <div className="layer-add__item">
            <div className="layer-item__icon">
              <i className="fas fa-arrow-from-top fa-rotate-180"></i>
            </div>
            <div className="layer-item__title">Upload BG</div>
          </div>
        </Upload>
        <Upload
          customRequest={dummyRequest}
          beforeUpload={beforeUpload}
          showUploadList={false}
          onChange={file => handleChangeFile(file, 'ADD_IMAGE')}
          className="item-wrapper"
        >
          <div className="layer-add__item">
            <div className="layer-item__icon">
              <i className="fas fa-arrow-from-top fa-rotate-180"></i>
            </div>
            <div className="layer-item__title">Upload layer</div>
          </div>
        </Upload>
        <div
          className="layer-add__item item-wrapper"
          onClick={() => emitAction({ type: 'ADD_TEXT' })}
        >
          <div className="layer-item__icon">
            <i className="far fa-text"></i>
          </div>
          <div className="layer-item__title">Add text</div>
        </div>
      </div>
    </AddLayerWrapper>
  );
});

export const AddLayerWrapper = styled.div`
  .layer-add__title {
    font-size: 14px;
    font-weight: bold;
  }
  .layer-add__content {
    display: flex;
    margin-top: 10px;
  }
  .item-wrapper:not(:first-child) {
    margin-left: 15px;
  }
  .layer-add__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px 8px;
    width: 110px;
    height: 70px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    transition: all ease-out 0.2s;
    cursor: pointer;
  }
  .layer-add__item:hover {
    border-color: #1890ff;
    .layer-item__icon,
    .layer-item__title {
      transition: all ease-out 0.2s;
      color: #1890ff;
    }
  }
  .layer-item__icon {
    font-size: 20px;
    color: #aeaeae;
  }
  .layer-item__title {
    font-size: 14px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.65);
  }
`;
