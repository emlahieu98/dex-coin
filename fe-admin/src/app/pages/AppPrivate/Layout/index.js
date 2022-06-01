import React, { useState } from 'react';
import { Layout, notification } from 'antd';
import SideBar from './sidebar';
import { Button } from 'app/components';
import HeaderBar from './header';
import styled from 'styled-components';
import { StyleConstants } from 'styles/StyleConstants';
import ProgressBar from './progress';

const { Content, Footer } = Layout;
export function AppLayout(props) {
  const [visibleModalProgress, setVisibleModalProgress] = useState(false);
  const [sidebarIsCollapsed, setSidebarCollapsed] = useState(false);

  // const openProgress = () => {
  //   notification.open({
  //     description: (
  //       <ProgressBar
  //         type="PUSH_PRODUCT"
  //         visibleModalProgress={visibleModalProgress}
  //         setVisibleModalProgress={setVisibleModalProgress}
  //         countTotal={120}
  //       />
  //     ),
  //     duration: 0,
  //     placement: 'bottomRight',
  //     className: 'progress-bar--global',
  //   });
  // };
  return (
    <Layout>
      <SideBar
        setSidebarCollapsed={setSidebarCollapsed}
        sidebarIsCollapsed={sidebarIsCollapsed}
      />
      <InnerLayout sidebarIsCollapsed={sidebarIsCollapsed}>
        <HeaderBar
          setSidebarCollapsed={setSidebarCollapsed}
          sidebarIsCollapsed={sidebarIsCollapsed}
        />

        <CustomerContent>{props.children}</CustomerContent>
        {/* <Button className="btn-sm" onClick={openProgress}>
          show
        </Button> */}
        <Footer className="text-center">©2021 Created by Odii</Footer>
      </InnerLayout>
    </Layout>
  );
}

const InnerLayout = styled(Layout)`
  margin-left: ${props =>
    props.sidebarIsCollapsed ? 65 : StyleConstants.sidebarWidth}px;
  transition: margin-left 0.1s ease-out;
  background-color: ${({ theme }) => theme.backgroundBlue};
`;
const CustomerContent = styled(Content)`
  min-height: 100vh;
  margin-top: 64px;
`;
