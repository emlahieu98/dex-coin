/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 *
 * Signin
 *
 */
import * as React from 'react';
// import { useTranslation } from 'react-i18next';
import { Form, Input, Checkbox, Alert } from 'antd';
import { Link } from 'react-router-dom';
// import GoogleLogin from 'react-google-login';
// import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
// import { messages } from './messages';
// import { useAuthSlice } from '../../slice';
// import GoogleIMG from 'assets/images/icon/google.svg';
// import FacebookIMG from 'assets/images/icon/facebook.svg';
import { saveToken } from 'app/pages/AppPrivate/utils';
import request from 'utils/request';
import { Button } from 'app/components';
import { globalActions } from 'app/pages/AppPrivate/slice';
import styled from 'styled-components';
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  LoadingOutlined,
  LockOutlined,
  MailOutlined,
} from '@ant-design/icons';

const LIST_ERROR_LOGIN = {
  get_social_info_error:
    'Không thể lấy thông tin từ tài khoản mạng xã hội của bạn',
  user_does_not_exist: 'Tài khoản không tồn tại',
  user_inactive: 'Tài khoản chưa kích hoạt',
  you_are_not_supplier: 'Tài khoản không phải là Supplier',
  supplier_pending_for_review: 'Tài khoản Supplier đang được review',
  invalid_account_type: 'Tài khoản không hợp lệ',
  password_incorrect: 'Mật khẩu không chính xác',
  invalid_recaptcha_token: 'Có lỗi xảy ra vui lòng thử lại sau!',
  wrong_account_or_password: 'Tài khoản hoặc mật khẩu không chính xác',
};

export function Signin(props) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [alert, setAlert] = React.useState(null);

  // const { t } = useTranslation();

  // const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  // const FACEBOOK_APP_ID = process.env.REACT_APP_FACEBOOK_APP_ID;

  const requestURL = 'user-service/signin';

  const handleLogin = async values => {
    setIsLoading(true);

    await login(values);

    setIsLoading(false);
  };

  const login = async data => {
    const response = await request(requestURL, {
      method: 'post',
      data: data,
      requireAuth: false,
    })
      .then(response => response)
      .catch(error => error);
    if (response.is_success) {
      await saveToken(response?.data);
      await globalActions.changeAccessToken(response?.data?.access_token);
      window.location.href = '/';
    } else {
      const code = response?.data?.error_code || response?.data?.error;
      const messageError = LIST_ERROR_LOGIN[code] || code;
      setAlert(<Alert message={messageError} type="error" />);
    }
  };

  // const responseGoogle = async response => {
  //   if (response.tokenId) {
  //     setIsLoading(true);

  //     await login({
  //       token: response.tokenId,
  //       social_type: 'google',
  //     });

  //     setIsLoading(false);
  //   }
  // };

  // const responseFacebook = async response => {
  //   setIsLoading(true);

  //   await login({
  //     token: response.accessToken,
  //     social_type: 'facebook',
  //   });

  //   setIsLoading(false);
  // };

  const onFinish = values => {
    handleLogin(values);
  };

  return (
    <>
      <div className="auth__main-body-page">Đăng nhập</div>

      {alert && <div className="auth__form-alert">{alert}</div>}

      <Form
        name="signin"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
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
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập mật khẩu',
            },
            { min: 8, message: 'Mật khẩu ít nhất 8 kí tự' },
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
          />
        </Form.Item>

        <div className="auth__form-action justify-content-end">
          {/* <Checkbox defaultChecked={true}>Ghi nhớ đăng nhập</Checkbox> */}

          <Link to={'/auth/forgot-password'}>Quên mật khẩu?</Link>
        </div>

        <Button
          className="btn-md"
          htmlType="submit"
          type="primary"
          width="100%"
          disabled={isLoading}
          fontSize="16px !important"
        >
          {isLoading && (
            <>
              <LoadingOutlined />
              &ensp;
            </>
          )}
          ĐĂNG NHẬP
        </Button>
      </Form>

      {/* <div className="auth__form-divider">
        <span>Hoặc đăng nhập bằng</span>
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
      </div> */}
    </>
  );
}

const Icon = styled.span`
  .anticon {
    vertical-align: 0;
  }
`;
