/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 *
 * Forgot Password
 *
 */
import React, { useState } from 'react';
// import { useTranslation } from 'react-i18next';
import { Form, Input, Alert } from 'antd';
import { Link } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { messages } from './messages';
// import { useAuthSlice } from '../../slice';
import request from 'utils/request';
import { LoadingOutlined, MailOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const LIST_ERROR = {
  EMAIL_NOT_FOUND: 'Tài khoản email không tồn tại!',
  email_not_found: 'Tài khoản email không tồn tại!',
};

export function ForgotPass(props) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  // const { t } = useTranslation();
  // const dispatch = useDispatch();
  // const { actions } = useAuthSlice();
  // const isLoading = useSelector(selectLoading);

  const handleChangeEmail = e => {
    setEmail(e.target.value.trim());
  };

  const handleResetPassword = async () => {
    setIsLoading(true);

    const response = await request('user-service/forgot', {
      method: 'post',
      data: { email: email },
      requireAuth: false,
    })
      .then(response => response)
      .catch(error => error);

    if (response.is_success) {
      setAlert(
        <Alert
          message="Đặt lại mật khẩu thành công. Vui lòng kiểm tra hộp thư email của bạn"
          type="success"
        />,
      );
    } else {
      const code = response?.data?.error_code || response?.data?.error;
      const messageError = LIST_ERROR[code] || code;
      setAlert(<Alert message={messageError} type="error" />);
    }

    setIsLoading(false);
  };

  return (
    <>
      <div className="auth__main-body-page">Quên mật khẩu</div>

      {alert && <div className="auth__form-alert">{alert}</div>}

      <Form name="signin" initialValues={{ remember: true }}>
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập email',
            },
            {
              type: 'email',
              message: 'Email chưa đúng định dạng',
            },
          ]}
        >
          <Input
            className="odii-input"
            placeholder="Nhập email"
            prefix={<MailOutlined />}
            onChange={handleChangeEmail}
          />
        </Form.Item>
      </Form>
      <CustomDiv>
        <button className="auth__form-button" onClick={handleResetPassword}>
          {isLoading && <LoadingOutlined />} &ensp; Lấy lại mật khẩu
        </button>
      </CustomDiv>

      <div className="auth__form-action">
        <span></span>

        <Link to={'/auth/signin'}>Quay lại</Link>
      </div>
    </>
  );
}

const CustomDiv = styled.div`
  margin-left: auto;
  margin-right: auto;
  .anticon {
    vertical-align: 2px;
  }
`;
