/**
 * Menu sidebar tối giản theo design
 * Tối da 2 cấp.
 * Nếu có 2 cấp thì cấp 1 hay parent sẽ chỉ là title not link.
 */
import React, { useMemo } from 'react';
import { Divider, Menu } from 'antd';
import { Link } from 'app/components';
import { menus } from './constants';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { selectRoles } from '../slice/selectors';

export function SidebarMenu({ sidebarIsCollapsed }) {
  const userRoles = useSelector(selectRoles);

  function getMathMenuItem(pathname, menuItems) {
    let mathMenuItem;
    for (let menuItem of menuItems) {
      const subMenus = menuItem.subMenus;
      if (subMenus) {
        mathMenuItem = getMathMenuItem(pathname, subMenus);
      }
      if (mathMenuItem) {
        return mathMenuItem;
      }
      // not have subMenu
      const menuItemPath = menuItem.link || menuItem.name;
      if (pathname.startsWith(menuItemPath)) {
        return menuItemPath;
      }
    }
    return '';
  }

  const hasAuthor = menu => {
    const requiredRoles = menu.requiredRoles;
    return (
      !requiredRoles ||
      userRoles.some(userRole => requiredRoles.includes(userRole))
    );
  };

  const matchKey = useMemo(
    () => getMathMenuItem(window.location.pathname, menus),
    [window.location.pathname],
  );

  const authMenu = useMemo(() => {
    const result = [];
    for (let menuItem of menus) {
      const subMenus = menuItem.subMenus;
      if (!hasAuthor(menuItem) || menuItem.ignore) {
        continue;
      }
      if (subMenus) {
        const subAuthMenu = subMenus.filter(subMenu => hasAuthor(subMenu));
        if (subAuthMenu.length) {
          const parentMenu = { name: menuItem.name, subMenus: subAuthMenu };
          result.push(parentMenu);
        }
      } else {
        const menu = {
          name: menuItem.name,
          icon: menuItem.icon,
          link: menuItem.link,
        };
        result.push(menu);
      }
    }
    return result;
  }, [userRoles]);

  return (
    <>
      <CustomerMenu
        mode="inline"
        style={{ height: '100%' }}
        selectedKeys={[matchKey]}
      >
        {authMenu.map(item => {
          const subMenus = item.subMenus;
          const menuItems = subMenus || [item];
          return (
            <>
              {subMenus && (
                <li className="menu-parent">
                  {sidebarIsCollapsed ? <CustomDivider /> : item.name}
                </li>
              )}
              {menuItems.map(menuItem => {
                return (
                  <Menu.Item
                    key={menuItem.link}
                    icon={menuItem.icon && <img src={menuItem.icon} alt="" />}
                  >
                    <Link to={menuItem.link}>{menuItem.name}</Link>
                  </Menu.Item>
                );
              })}
            </>
          );
        })}
      </CustomerMenu>
    </>
  );
}

const CustomerMenu = styled(Menu)`
  height: 100%;
  overflow: auto;
  overflow-x: hidden;
  a,
  .ant-menu-item,
  .ant-menu-submenu-title {
    color: ${({ theme }) => theme.grayBlue};
    :hover {
      color: ${({ theme }) => theme.primary};
    }
  }
  :not(.ant-menu-horizontal) .ant-menu-item-selected {
    background-color: ${({ theme }) => theme.backgroundBlue};
    color: ${({ theme }) => theme.primary};
    font-weight: 500;
    a {
      color: ${({ theme }) => theme.primary};
    }
  }
  .ant-menu-item::after {
    display: none;
  }
  .ant-menu-item {
    height: 45px;
    text-decoration: none;
    &-icon {
      width: 22px;
    }
    a {
      text-decoration: none;
    }
  }
  .ant-menu-item-selected {
    font-weight: 500;
    font-size: 14px;
    line-height: 22px;
    color: #3d56a6;
    &::before {
      content: '';
      width: 4px;
      height: 45px;
      position: absolute;
      left: 0px;
      background: #3d56a6;
      border-radius: 0px 6px 6px 0px;
    }
  }
  .menu-parent {
    color: #bdbdbd;
    text-transform: uppercase;
    font-weight: 500;
    font-size: 13px;
    letter-spacing: 0.02rem;
    padding-top: 2px;
    padding-left: 24px;
    height: 45px;
    display: flex;
    align-items: center;
  }
`;

const CustomDivider = styled(Divider)`
  margin: 15px -9px;
  border-top: 3px solid rgba(0, 0, 0, 0.3);
`;
