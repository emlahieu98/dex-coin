import * as React from 'react';
import RegisteredIMG from 'assets/images/registered.svg';

export default function Registered() {
  return (
    <>
      <div className="registered__img">
        <img src={RegisteredIMG} alt="" />
      </div>

      <div className="registered__title">Đăng ký tài khoản thành công</div>

      <div className="registered__desc">
        Chúc mừng bạn đã tạo thành công tài khoản Odii - Nhà bán lẻ. <br />{' '}
        Chúng tôi đã gửi đường dẫn xác thực tài khoản tới email của bạn. <br />{' '}
        Vui lòng xác thực tài khoản để có thể sử dụng
      </div>
    </>
  );
}
