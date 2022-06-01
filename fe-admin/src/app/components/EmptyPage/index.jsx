import * as React from 'react';
import { useLocation } from 'react-router';
import { CustomStyle } from 'styles/commons';
import styled from 'styled-components/macro';
import {
  orders,
  productsSelected,
  warehouses,
  transaction,
} from 'assets/images/empty';

export default function NotFoundPage({ children }) {
  const { pathname } = useLocation();

  const { src, title, description, type, width } = React.useMemo(() => {
    let data = {};
    switch (true) {
      case pathname.includes('orders/update'):
        data = {
          type: 'style-1',
          src: orders,
          width: 350,
          title: 'Không tìm thấy đơn hàng',
          description: 'Rất tiếc, đơn hàng không tồn tại trong hệ thống.',
        };
        break;
      case pathname.includes('orders'):
        data = {
          type: 'style-1',
          src: orders,
          width: 350,
          title: 'Chưa có đơn hàng',
          description:
            'Rất tiếc, bạn chưa có đơn hàng nào được tạo. Hãy bắt đầu bằng việc chọn sản phẩm để đăng bán trên cửa hàng của bạn.',
        };
        break;
      case pathname.includes('suppliers'):
        data = {
          type: 'style-1',
          src: warehouses,
          width: 350,
          title: 'Chưa có kho hàng',
          description: 'Nhà cung cấp này chưa có kho hàng nào !',
        };
        break;
      case pathname.includes('accountant/partnership'):
        data = {
          type: 'style-1',
          src: transaction,
          width: 350,
          title: '',
          description: 'Chưa có đơn hàng phát sinh từ đối tác hoa hồng!',
        };
        break;

      default:
        break;
    }
    return data;
  }, [pathname]);

  return (
    <Wrapper className={type || ''}>
      {/* <Row justify="center" align="middle">
        <Col xs={24} lg={col || 12}> */}
      <CustomStyle width="100%" maxWidth={width || 550} px={{ xs: 's4' }}>
        <img src={src} alt="emptyBg" className="img" />
        <div className="title">{title}</div>
        <div
          className="description"
          dangerouslySetInnerHTML={{ __html: description }}
        ></div>
        {children}
      </CustomStyle>
      {/* </Col>
      </Row> */}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  text-align: center;
  flex: 1;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: calc(100vh - 120px);
  .img {
    max-width: 100%;
    margin-bottom: ${({ theme }) => theme.space.s8}px;
  }
  .title {
    font-size: 28px;
    margin-bottom: ${({ theme }) => theme.space.s4}px;
    font-weight: 700;
  }
  .description {
    font-size: ${({ theme }) => theme.fontSizes.f3}px;
    margin-bottom: ${({ theme }) => theme.space.s5}px;
    color: ${({ theme }) => theme.gray3};
  }
  &.style-1 {
    height: auto;
    background: #fff;
    .img {
      margin-bottom: ${({ theme }) => theme.space.s3}px;
    }
    .title {
      color: ${({ theme }) => theme.primary};
      font-size: 22px;
      margin-bottom: ${({ theme }) => theme.space.s3}px;
    }
    .description {
      font-size: ${({ theme }) => theme.fontSizes.f2}px;
      margin-bottom: ${({ theme }) => theme.space.s4}px;
      color: ${({ theme }) => theme.gray2};
    }
  }
`;
