import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PageWrapper, Link } from 'app/components';
import { Row, Col, Spin } from 'antd';
import { CustomH2, SectionWrapper } from 'styles/commons';
// import { useDispatch, useSelector } from 'react-redux';
// import { useLocation, useHistory } from 'react-router-dom';
import { messages } from './messages';
import styled from 'styled-components';
import { home, setting, employee, category, bell } from 'assets/images/icons';

const LIST_URL = [
  {
    id: 1,
    icon: home,
    url: '/setting/banks',
    title: 'Ngân hàng',
    desc: 'Xem và quản lý danh sách ngân hàng của bạn',
  },
  {
    id: 2,
    icon: category,
    url: '/categories',
    title: 'Danh mục Odii',
    desc: 'Quản lý các danh mục ngành hàng Odii cung cấp',
  },
  {
    id: 3,
    icon: employee,
    url: '/admins',
    title: 'Danh sách quản trị viên ',
    desc: 'Quản lý danh sách quản trị viên trong hệ thống',
  },
  {
    id: 4,
    icon: setting,
    url: '/artwork-templates',
    title: 'Design template',
    desc: 'Quản lý các mẫu thiết kế',
  },
  {
    id: 5,
    title: 'Thông báo',
    icon: bell,
    url: '/notification-system',
    desc: 'Quản lý thông báo trên hệ thống Odii',
  },
];

export function Setting() {
  const { t } = useTranslation();
  // const location = useLocation();
  // const history = useHistory();
  // const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <CustomPageWrapper>
      <CustomH2 className="title " mb={{ xs: 's6' }}>
        {t(messages.titlepage())}
      </CustomH2>
      <CustomSectionWrapper>
        <Spin tip="Đang tải..." spinning={isLoading}>
          <Row gutter={8}>
            {LIST_URL.map(item => (
              <CustomCol sm={12} md={12} lg={12} xl={8}>
                <div className="d-flex">
                  <div className="img-icon">
                    <img src={item.icon} alt="" />
                  </div>
                  <div className="content">
                    <CustomLink className="title" to={item.url}>
                      {item.title}
                    </CustomLink>
                    <div className="desc">{item.desc}</div>
                  </div>
                </div>
              </CustomCol>
            ))}
          </Row>
        </Spin>
      </CustomSectionWrapper>
    </CustomPageWrapper>
  );
}

const CustomPageWrapper = styled(PageWrapper)`
  max-width: 1200px;
  margin: 60px auto;
`;
const CustomSectionWrapper = styled(SectionWrapper)`
  border-radius: 6px;
  box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.05);
`;

const CustomCol = styled(Col)`
  padding: 12px;
  .img-icon {
    width: 45px;
    height: 45px;
    border-radius: 4px;
    background-color: #f5f5f5;
    margin-right: 12px;
    img {
      width: 30px;
      display: flex;
      margin: auto;
      margin-top: 6px;
    }
  }
  .content {
    .title {
      font-weight: bold;
      font-size: 16px;
      line-height: 19px;
      color: #4a67d2;
    }
    .desc {
      font-size: 14px;
      line-height: 14px;
      letter-spacing: 0.05em;
      color: #828282;
    }
  }
`;

const CustomLink = styled(Link)`
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #333333;
`;
