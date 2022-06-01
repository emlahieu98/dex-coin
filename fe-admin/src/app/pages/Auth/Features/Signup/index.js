/**
 *
 * Signup
 *
 */
import React, { useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { useTranslation } from 'react-i18next';
// import { messages } from './messages';
// import { useAuthSlice } from '../../slice';
import { Form, Input, Alert, message } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import GoogleIMG from 'assets/images/icon/google.svg';
import FacebookIMG from 'assets/images/icon/facebook.svg';
import request from 'utils/request';
// import Modal from 'antd/lib/modal/Modal';
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  // LoadingOutlined,
  LockOutlined,
  MailOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';

export function Signup(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [signupData, setSignupData] = useState({});
  const [alert, setAlert] = useState(null);
  // const [modal, contextHolder] = Modal.useModal();

  const history = useHistory();

  // const { t } = useTranslation();
  // const dispatch = useDispatch();
  // const { actions } = useAuthSlice();

  const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const FACEBOOK_APP_ID = process.env.REACT_APP_FACEBOOK_APP_ID;

  const handleSignup = async () => {
    setIsLoading(true);

    const response = await request('user-service/signup', {
      method: 'post',
      data: signupData,
      requireAuth: false,
    })
      .then(response => response)
      .catch(err => err);

    if (response.is_success) {
      window.location.href = '/auth/registered';
    } else {
      history.push({
        pathname: '/auth/supplier-setting',
        search: `?error_code=${response.data.error_code}`,
      });

      switch (response.data.error_code) {
        case 'user_already_seller_but_not_supplier':
          setAlert(
            <Alert
              message={`Bạn đã là seller trong hệ thống. Vui lòng ${(
                <Link to="/auth/signin">đăng nhập</Link>
              )} và hoàn tất thông tin nhà cung cấp`}
              type="error"
            />,
          );
          break;
        case 'user_already_supplier':
          setAlert(
            <Alert
              message={`Bạn đã là supplier. Vui lòng ${(
                <Link to="/auth/signin">đăng nhập</Link>
              )}`}
              type="error"
            />,
          );
          break;
        case 'USER_INACTIVE':
          setAlert(
            <Alert
              message={`Tài khoản đã được đăng ký. Vui lòng xác nhận tài khoản qua đường dẫn được gửi trong email`}
              type="error"
            />,
          );
          break;
        default:
          setAlert(
            <Alert
              message={response.data.error_code || response.data.error}
              type="error"
            />,
          );
          break;
      }
    }

    setIsLoading(true);
  };

  const responseGoogle = response => {
    console.log(response);
  };

  const responseFacebook = response => {
    console.log(response);
  };

  const handleChangeEmail = e => {
    setSignupData({
      ...signupData,
      email: e.target.value.trim(),
    });
  };

  const handleChangePassword = e => {
    setSignupData({
      ...signupData,
      password: e.target.value.trim(),
    });
  };

  return (
    <>
      <div className="auth__main-body-page">Tạo mới tài khoản</div>

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
            placeholder="Nhập mật khẩu"
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
            placeholder="Nhập lại mật khẩu"
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
          />
        </Form.Item>
      </Form>

      <button className="auth__form-button" onClick={handleSignup}>
        Đăng ký
      </button>

      <div className="auth__form-divider">
        <span>Hoặc đăng ký bằng</span>
      </div>

      <div className="auth__form-social">
        <GoogleLogin
          clientId={GOOGLE_CLIENT_ID}
          buttonText="Google Account"
          render={renderProps => (
            <button
              className="auth__form-social-btn"
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
            >
              <img src={GoogleIMG} alt="" />
              Google Account
            </button>
          )}
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy={'single_host_origin'}
        />

        <FacebookLogin
          appId={FACEBOOK_APP_ID}
          autoLoad={false}
          fields="name,email,picture"
          callback={responseFacebook}
          render={renderProps => (
            <button
              className="auth__form-social-btn"
              onClick={renderProps.onClick}
            >
              <img src={FacebookIMG} alt="" />
              Facebook Account
            </button>
          )}
        />
      </div>

      <div className="auth__form-action">
        <span>Bạn đã có tài khoản?</span>

        <Link to={'/auth/signin'}>Đăng nhập ngay</Link>
      </div>
    </>
  );
}

const Icon = styled.span`
  .anticon {
    vertical-align: 0;
  }
`;
