import * as React from 'react';
import Logo from 'assets/images/logoAdmin.svg';
import LogoWhite from 'assets/images/logo-white.svg';
import AuthIMG from 'assets/images/auth/auth-1.svg';
// import { Link } from 'react-router-dom';

const AuthLayout = ({ children }) => {
  return (
    <div className="auth">
      <div className="auth__main">
        <div className="auth__main-logo">
          <img src={Logo} alt="" />
          {/* <span>
            Kênh <br /> Quản Lý
          </span> */}
        </div>

        <div className="auth__main-body">
          <div className="auth__main-body-title">Odii Dropshipping</div>

          {children}
        </div>

        <div className="auth__main-footer">
          <div className="auth__main-copyright">
            © 2020, Odii - Dropshipping
          </div>
        </div>
      </div>

      <div className="auth__intro">
        <div className="auth__intro-image">
          <img src={AuthIMG} alt="" />
        </div>

        <div className="auth__intro-logo">
          <img src={LogoWhite} alt="" />
        </div>

        <div className="auth__intro-title">
          <span>Admin</span>
        </div>

        <div className="auth__intro-desc">
          Xây dựng doanh nghiệp Dropshipping trên nền tảng Shopee, Lazada
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
