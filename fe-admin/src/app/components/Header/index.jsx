/**
 *
 * Header
 *
 */
import * as React from 'react';
import { useState, useEffect } from 'react';
// import { useTranslation } from 'react-i18next';
import {
  useSelector,
  //  useDispatch
} from 'react-redux';
// import { useHistory } from 'react-router-dom';
import { Button, Image } from 'app/components';
import { Popover, Badge, Tabs, Switch, Divider } from 'antd';
import { BellOutlined, MenuOutlined } from '@ant-design/icons';
import { isEmpty } from 'lodash';
import request from 'utils/request';
import { selectCurrentUser } from 'app/pages/AppPrivate/slice/selectors';
import { CustomStyle } from 'styles/commons';
import { user } from 'assets/images/icons';
import { bellNotification } from 'assets/images';
import { IconUser, IconSignOut } from 'assets/images/header';
import {
  TabNotificationOrder,
  TabNotificationTransaction,
  TabNotificationProduct,
  TabNotificationCommon,
} from './Components';
import {
  CustomHeader,
  DivNotify,
  WrapperBadge,
  WrapperUserInfo,
  CustomDiv,
} from './styles';

// const Item = Form.Item;
const { TabPane } = Tabs;

export default function HeaderDefault(props) {
  // const { t } = useTranslation();
  // const dispatch = useDispatch();
  // const isLoading = useSelector(selectLoading);
  const currentUser = useSelector(selectCurrentUser);

  const [dataCountNotify, setDataCountNotify] = useState([]);
  const [onlyShowUnRead, setOnlyShowUnRead] = useState(false);

  const fetchDataCountNotify = async () => {
    const url = 'common-service/count-notifications';
    const response = await request(url, {
      method: 'get',
    })
      .then(response => {
        if (!isEmpty(response?.data)) setDataCountNotify(response?.data);
      })
      .catch(error => error);
  };

  useEffect(() => {
    fetchDataCountNotify();
  }, []);

  useEffect(() => {
    const delaySecond = 60000;
    let reloadPageInterval;
    let reloadPageTimeout;
    reloadPageTimeout = setTimeout(() => {
      reloadPageInterval = setInterval(() => {
        fetchDataCountNotify();
      }, delaySecond);
    }, delaySecond);
    return () => {
      clearInterval(reloadPageInterval);
      clearTimeout(reloadPageTimeout);
    };
  }, []);

  const updateStatusReadAll = async values => {
    const url = 'common-service/notifications';
    const response = await request(url, {
      method: 'put',
      data: {
        message_ids: values,
      },
    })
      .then(response => {
        if (!isEmpty(response?.data));
      })
      .catch(error => error);

    await fetchDataCountNotify();
  };

  const updateStatusReadAndRedirect = async record => {
    if (record.read_status === 'unread') {
      const url = `common-service/message/${record.id}`;
      const response = await request(url, {
        method: 'put',
      })
        .then(response => {
          if (!isEmpty(response?.data));
        })
        .catch(error => error);
    }

    if (record.type === 'transaction') {
      window.location.href = '/mywallet';
    } else if (record.type === 'order') {
      window.location.href = '/orders';
    } else if (record.type === 'product') {
      window.location.href = '/products';
    }
  };

  const goLogin = () => {
    localStorage.clear();
    window.location.href = '/auth/signin';
  };

  const goMyProfile = () => {
    window.location.href = '/myprofile';
  };

  const handleOnlyShowUnRead = () => {
    setOnlyShowUnRead(!onlyShowUnRead);
  };

  const SectionEmptyNotify = () => {
    return (
      <div className="notify-empty">
        <div className="empty-img">
          <img src={bellNotification} alt="" />
        </div>
        <div className="empty-title">Ch??a c?? th??ng b??o</div>
        <div className="empty-desc">
          B???n ch??a c?? th??ng b??o n??o trong v??ng 30 ng??y g???n ????y
        </div>
      </div>
    );
  };

  const SectionEmptyNotifyUnread = () => {
    return (
      <div className="notify-empty">
        <div className="empty-img">
          <img src={bellNotification} alt="" />
        </div>
        <div className="empty-title">Kh??ng c?? th??ng b??o n??o ch??a ?????c</div>
        <div className="empty-desc">
          B???n ???? ?????c t???t c??? th??ng b??o trong v??ng 30 ng??y g???n nh???t.
        </div>
      </div>
    );
  };

  const action = (
    <CustomDiv>
      <div className="item">
        <Button context="secondary" color="transparent" onClick={goMyProfile}>
          <div className="item-icon">
            <img src={IconUser} alt="" />
          </div>
          <span>&nbsp;T??i kho???n&ensp;</span>
        </Button>
      </div>
      <Divider />
      <div className="item logout">
        <Button
          context="secondary"
          color="transparent"
          onClick={goLogin}
          // className="logout"
        >
          <div className="item-icon">
            <img src={IconSignOut} alt="" />
          </div>
          <span>&nbsp;????ng xu???t</span>
        </Button>
      </div>
    </CustomDiv>
  );

  const notify = (
    <DivNotify>
      <div className="top">
        <div className="title">Th??ng b??o</div>
        <div className="d-flex">
          <div className="title-switch">Hi???n th??? th??ng b??o ch??a ?????c</div>
          <Switch onChange={handleOnlyShowUnRead} />
        </div>
      </div>
      <Tabs defaultActiveKey="1">
        <TabPane
          tab={
            <Badge
              count={
                !isEmpty(dataCountNotify)
                  ? dataCountNotify?.total_noti_orders
                  : 0
              }
            >
              ????n h??ng
            </Badge>
          }
          key="1"
        >
          <TabNotificationOrder
            SectionEmptyNotify={SectionEmptyNotify}
            updateStatusReadAll={updateStatusReadAll}
            onlyShowUnRead={onlyShowUnRead}
            updateStatusReadAndRedirect={updateStatusReadAndRedirect}
            SectionEmptyNotifyUnread={SectionEmptyNotifyUnread}
          />
        </TabPane>
        <TabPane
          tab={
            <Badge
              count={
                !isEmpty(dataCountNotify)
                  ? dataCountNotify?.total_noti_products
                  : 0
              }
            >
              S???n ph???m
            </Badge>
          }
          key="2"
        >
          <TabNotificationProduct
            SectionEmptyNotify={SectionEmptyNotify}
            updateStatusReadAll={updateStatusReadAll}
            onlyShowUnRead={onlyShowUnRead}
            updateStatusReadAndRedirect={updateStatusReadAndRedirect}
            SectionEmptyNotifyUnread={SectionEmptyNotifyUnread}
          />
        </TabPane>
        <TabPane
          tab={
            <Badge
              count={
                !isEmpty(dataCountNotify)
                  ? dataCountNotify?.total_noti_transactions
                  : 0
              }
            >
              Giao d???ch
            </Badge>
          }
          key="3"
        >
          <TabNotificationTransaction
            SectionEmptyNotify={SectionEmptyNotify}
            updateStatusReadAll={updateStatusReadAll}
            onlyShowUnRead={onlyShowUnRead}
            updateStatusReadAndRedirect={updateStatusReadAndRedirect}
            SectionEmptyNotifyUnread={SectionEmptyNotifyUnread}
          />
        </TabPane>
        <TabPane
          tab={
            <Badge
              count={
                !isEmpty(dataCountNotify)
                  ? dataCountNotify?.total_noti_common
                  : 0
              }
            >
              H??? th???ng
            </Badge>
          }
          key="4"
        >
          <TabNotificationCommon
            SectionEmptyNotify={SectionEmptyNotify}
            updateStatusReadAll={updateStatusReadAll}
            onlyShowUnRead={onlyShowUnRead}
            updateStatusReadAndRedirect={updateStatusReadAndRedirect}
            SectionEmptyNotifyUnread={SectionEmptyNotifyUnread}
          />
        </TabPane>
      </Tabs>
    </DivNotify>
  );

  return (
    <>
      <CustomHeader className="d-inline-flex justify-content-end align-items-center">
        <Popover
          // placement="bottom"
          content={notify}
          trigger="click"
          overlayClassName="popover-notify--global"
        >
          <WrapperBadge>
            <Badge count={dataCountNotify?.total_notifications}>
              <BellOutlined />
            </Badge>
          </WrapperBadge>
        </Popover>

        <Popover
          placement="bottomRight"
          content={action}
          trigger="click"
          overlayClassName="popover-action--global"
        >
          <WrapperUserInfo>
            <CustomStyle fontSize={{ xs: 'f2' }} color="grayBlue">
              <MenuOutlined />
            </CustomStyle>
            {currentUser?.avatar ? (
              <Image
                size="200x200"
                src={
                  currentUser?.avatar?.location
                    ? currentUser?.avatar?.location
                    : currentUser?.avatar?.origin
                }
              />
            ) : (
              <div className="default-image">
                <img src={user} alt="" />
              </div>
            )}
          </WrapperUserInfo>
        </Popover>
      </CustomHeader>
    </>
  );
}
