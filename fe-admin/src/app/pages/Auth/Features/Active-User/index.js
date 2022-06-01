import * as React from 'react';
// import { useSelector } from 'react-redux';
import url from 'url';
import { Form, Input, Alert } from 'antd';
import { MailOutlined } from '@ant-design/icons';

import request from 'utils/request';

function ActiveUser() {
  const [email, setEmail] = React.useState('');
  const [isUserActived, setIsUserActived] = React.useState(false);
  const [alert, setAlert] = React.useState(null);

  const URL = url.parse(window.location.href);
  const params = new URLSearchParams(URL.query);
  const token = params.get('token');
  // const isLoading = useSelector(selectLoading);

  React.useEffect(() => {
    if (!token) {
      window.location.href = '/auth/signin';
    } else {
      activeUser();
    }
  }, []);

  React.useEffect(() => {
    const userEmail = params.get('email');
    setEmail(userEmail);
  }, []);

  const activeUser = async () => {
    const url = 'user-service/active-user';
    const response = await request(url, {
      method: 'post',
      data: { active_token: token },
      requireAuth: false,
    })
      .then(response => response)
      .catch(err => err);

    console.log(response);

    if (response.is_success) {
      setIsUserActived(true);
    }
  };

  const handleChangeEmail = e => {
    setEmail(e.target.value);
  };

  const resendEmail = async () => {
    const response = await request('user-service/resend-email-active-user', {
      method: 'post',
      data: { email: email },
      requireAuth: false,
    })
      .then(response => response)
      .catch(error => error);

    if (response.is_success) {
      setAlert(<Alert message="Gửi mã xác thực thành công" type="success" />);
    } else {
      setAlert(
        <Alert
          message={response.data.error_code || response.data.error}
          type="error"
        />,
      );
    }
  };

  return (
    <>
      <div className="registered__title">
        {isUserActived
          ? 'Xác thực tài khoản thành công'
          : 'Mã xác thực không chính xác hoặc đã hết hạn'}
      </div>

      <div className="registered__desc">
        {isUserActived
          ? null
          : 'Xác thực tài khoản không thành công, nhập email để lấy mã xác thực khác'}
      </div>

      <div className="registered__form">
        {isUserActived ? (
          <button className="auth__form-button" onClick={resendEmail}>
            Cài đặt Nhà cung cấp
          </button>
        ) : (
          <>
            {alert && <div className="auth__form-alert">{alert}</div>}

            <Form name="resend" initialValues={{ remember: true }}>
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
                  defaultValue={email}
                  onChange={handleChangeEmail}
                />
              </Form.Item>
            </Form>

            <button className="auth__form-button" onClick={resendEmail}>
              Gửi mã xác thực
            </button>
          </>
        )}
      </div>
    </>
  );
}

export default ActiveUser;
