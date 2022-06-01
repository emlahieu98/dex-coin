/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 *
 * Change Pass
 *
 */
import React, { useState } from 'react';
// import { useTranslation } from 'react-i18next';
import { Form, Input, Alert } from 'antd';
import { Link } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { messages } from './messages';
import url from 'url';
import request from 'utils/request';
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  LoadingOutlined,
  LockOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';

const LIST_ERROR = {
  'new password must be different from last 4 passwords':
    'Mật khẩu mới không trùng với 4 mật khẩu cũ gần nhất!',
};

export function ResetPassword(props) {
  // const { t } = useTranslation();
  // const dispatch = useDispatch();
  // const isLoading = useSelector(selectLoading);

  const [password, setPassword] = useState('');
  const [canSubmit, setCanSubmit] = useState(false);
  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const URL = url.parse(window.location.href);
  const params = new URLSearchParams(URL.query);
  const token = params.get('token');

  const handleChangePasswordSubmit = async () => {
    setIsLoading(true);

    const data = { active_token: token, password: password };

    const response = await request('user-service/reset-password', {
      method: 'post',
      data: data,
      requireAuth: false,
    })
      .then(response => response)
      .catch(error => error);

    if (response.is_success) {
      setAlert(
        <Alert
          message={'Đổi mật khẩu thành công. Hãy quay lại trang đăng nhập.'}
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

  const handleChangePassword = e => {
    setPassword(e.target.value.trim());
  };

  const handleChangeRePassword = e => {
    if (e.target.value === password) {
      setCanSubmit(true);
    } else {
      setCanSubmit(false);
    }
  };

  return (
    <>
      <div className="auth__main-body-page">Đổi mật khẩu</div>

      {alert && <div className="auth__form-alert">{alert}</div>}

      <Form name="signin" initialValues={{ remember: true }}>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập mật khẩu',
            },
          ]}
        >
          <Input.Password
            className="odii-input"
            placeholder="Nhập mật khẩu mới"
            prefix={<LockOutlined />}
            iconRender={visible =>
              visible ? (
                <Icon>
                  <EyeOutlined />
                </Icon>
              ) : (
                <Icon>
                  <EyeInvisibleOutlined />
                </Icon>
              )
            }
            onChange={handleChangePassword}
          />
        </Form.Item>

        <Form.Item
          name="repassword"
          dependencies={['password']}
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập lại mật khẩu',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Mật khẩu không trùng khớp'));
              },
            }),
          ]}
        >
          <Input.Password
            className="odii-input"
            placeholder="Nhập lại mật khẩu mới"
            prefix={<LockOutlined />}
            iconRender={visible =>
              visible ? (
                <Icon>
                  <EyeOutlined />
                </Icon>
              ) : (
                <Icon>
                  <EyeInvisibleOutlined />
                </Icon>
              )
            }
            onChange={handleChangeRePassword}
          />
        </Form.Item>
      </Form>

      <CustomDiv>
        <button
          className="auth__form-button"
          onClick={handleChangePasswordSubmit}
          disabled={!canSubmit}
        >
          {isLoading && (
            <>
              <LoadingOutlined />
              &ensp;
            </>
          )}
          Đổi mật khẩu
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
    vertical-align: 0;
  }
`;

const Icon = styled.span`
  .anticon {
    vertical-align: 0;
  }
`;
