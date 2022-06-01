/* eslint-disable no-unused-vars */
import React, { memo, useRef } from 'react';
import { Row, Col, Form as F } from 'antd';
import styled from 'styled-components/macro';
import { Input } from 'app/components';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { CustomStyle } from 'styles/commons';
import { CustomSectionWrapper } from './styled';
const Item = F.Item;

function MyEditor({ value, onChange }) {
  const quill = useRef(null);
  const imageHandler = async () => {
    const input = document.createElement('input');

    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const formData = new FormData();

      formData.append('image', file);

      const fileName = file.name;

      // const res = await uploadFiles(file, fileName, quillObj);
    };
  };
  // quill?.current?.enable(false);
  return (
    <CustomEditor>
      <ReactQuill
        ref={quill}
        // enable={false}
        readOnly={true}
        theme="snow"
        // ref={el => {
        //   quillObj = el;
        // }}
        value={value || ''}
        onChange={onChange}
        modules={{
          toolbar: {
            container: [
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              ['bold', 'italic', 'underline'],
              [{ list: 'ordered' }, { list: 'bullet' }],
              [{ align: [] }],
              ['link', 'image'],
              ['clean'],
              [{ color: [] }],
            ],
            handlers: {
              image: imageHandler,
            },
          },
          // table: true,
        }}
      />
    </CustomEditor>
  );
}
export default memo(function Description({ layout, form }) {
  const { setFieldsValue } = form;
  const normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e;
  };

  return (
    <CustomSectionWrapper mt={{ xs: 's4' }}>
      <div className="title">Mô tả</div>
      <div className="">
        <Row gutter={24}>
          <Col xs={24}>
            <Item
              name="description"
              label=""
              getValueFromEvent={normFile}
              valuePropName="value"
              {...layout}
              // rules={[
              //   {
              //     required: true,
              //     message: 'Please input your sku!',
              //   },
              // ]}
            >
              <MyEditor />
            </Item>
          </Col>
        </Row>
      </div>
    </CustomSectionWrapper>
  );
});

const CustomEditor = styled.div`
  .ql-editor {
    min-height: 18em;
  }
`;
