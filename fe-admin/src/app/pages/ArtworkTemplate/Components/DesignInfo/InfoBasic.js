import React, { useState, useEffect, memo } from 'react';

import { Input, Form, Select } from 'app/components';

const typeOptions = [{ label: 'Artwork template', value: 'artwork_template' }];

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 6,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
    md: {
      span: 14,
    },
  },
};

export default memo(function TemplateInfo({
  template,
  design,
  setActionRefs,
  setValid,
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    setDefaultData();
  }, [design]);

  useEffect(() => {
    initActionsRefs();
  }, []);

  const initActionsRefs = () => {
    setActionRefs({
      getData: form.getFieldsValue,
    });
  };

  const handleChangeGlobal = () => {
    form
      .validateFields()
      .then(() => {
        setValid(true);
      })
      .catch(() => {
        setValid(false);
      });
  };

  const setDefaultData = () => {
    form.setFieldsValue({
      name: design?.name || '',
      type: template?.type,
      template_name: template?.name,
    });
  };

  return (
    <div>
      <Form
        initialValues={{ type: typeOptions[0].value }}
        {...formItemLayout}
        form={form}
        name="template-info"
        scrollToFirstError
      >
        <Form.Item name="template_name" label="Artwork template">
          <Input disabled></Input>
        </Form.Item>
        <Form.Item name="type" label="Loại template">
          {/* <Select options={typeOptions} onChange={handleChangeGlobal} /> */}
          <Input onChange={handleChangeGlobal} disabled />
        </Form.Item>
        <Form.Item
          name="name"
          label="Tên design"
          rules={[
            {
              required: true,
              message: 'Tên không được để trống!',
            },
          ]}
        >
          <Input onChange={handleChangeGlobal} />
        </Form.Item>
      </Form>
    </div>
  );
});
