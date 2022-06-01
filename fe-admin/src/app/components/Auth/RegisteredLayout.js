import * as React from 'react';
import Logo from 'assets/images/logoAdmin.svg';
import { Steps } from 'antd';
import url from 'url';

const { Step } = Steps;

const steps = [
  { order: 0, key: 'registered', title: 'Đăng ký tài khoản' },
  { order: 1, key: 'active-user', title: 'Xác thực tài khoản' },
  { order: 2, key: 'supplier-setting', title: 'Cài đặt nhà cung cấp' },
  { order: 3, key: 'completed', title: 'Hoàn tất' },
];

const RegisteredLayout = ({ children }) => {
  const URL = url.parse(window.location.href);
  const paths = URL.pathname?.split('/');
  const currentPath = paths[paths.length - 1];

  const currentOrder = steps.find(step => step.key === currentPath);

  return (
    <div className="registered">
      <div className="registered__header">
        <div className="auth__main-logo">
          <img src={Logo} alt="" />
          <span>
            Kênh <br /> Nhà Bán Lẻ
          </span>
        </div>

        <div className="registered__step">
          <Steps current={currentOrder.order}>
            {steps.map(step => (
              <Step title={step.title} key={step.key} />
            ))}
          </Steps>
        </div>
      </div>

      <div className="registered__main">{children}</div>
    </div>
  );
};

export default RegisteredLayout;
