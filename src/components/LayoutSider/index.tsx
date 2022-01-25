import { Layout, Menu } from 'antd';
import { useIntl, history } from 'umi';
import React, { useEffect, useState } from 'react';
import { transformRoute, MenuDataItem } from '@umijs/route-utils';
import styles from './index.less';
import menuIcons from '@/assets/menuIcons/index';
import { MenuFoldOutlined, MenuUnfoldOutlined, PoweroffOutlined } from '@ant-design/icons';
const { Sider } = Layout;
const { SubMenu } = Menu;

export type LayoutSiderProps = {
  collapsible?: boolean;
  routes?: any;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
};
const LayoutSider: React.FC<LayoutSiderProps> = (props) => {
  const { collapsible = false, collapsed, setCollapsed, routes } = props;

  const [selectedKeys, setSelectedKeys] = useState<string []>([location.pathname]);
  useEffect(() => {
    setSelectedKeys([location.pathname]);
  }, [location.pathname]);

  const handleMenuItemClick = (menuItem: { path: string; }) => {
    history.push(menuItem.path);
  }

  const getIcon = (menuItem: any, menuSelected: boolean) => {
    return (
      <img
        className={styles.menuIcon}
        src={menuSelected ? menuIcons[`${menuItem.name}_s`] : menuIcons[`${menuItem.name}`]}
      />
    )
  }

  const createMenu = (menuData: MenuDataItem[]) => {
    const { formatMessage } = useIntl();
    let selectedSubMenuKey = location.pathname.split('/')[1];
    return menuData.map((menuItem: any) => {
      let menuSelected = selectedSubMenuKey === menuItem.name;
      if (menuItem.routes) {
        return (
          <SubMenu
            key={menuItem.key}
            icon={!!menuItem.pro_layout_parentKeys.length ? '' : getIcon(menuItem, menuSelected)}
            title={formatMessage({ id: menuItem.locale })}
            className={menuSelected ? styles.menuSelected : ''}
          >
            {createMenu(menuItem.routes)}
          </SubMenu>
        )
      } else {
        return (
          <Menu.Item
            key={menuItem.key}
            icon={!!menuItem.pro_layout_parentKeys.length ? '' : getIcon(menuItem, menuSelected)}
            onClick={() => handleMenuItemClick(menuItem)}
            className={menuSelected ? styles.menuSelected : ''}
          >
            {formatMessage({ id: menuItem.locale })}
          </Menu.Item>
        )
      }
    })
  }

  const SiderMenu = () => {
    const { menuData } = transformRoute(routes);
    return (
      <Menu className={styles.menu} mode="vertical" selectedKeys={selectedKeys}>
        {createMenu(menuData)}
      </Menu>
    )
  };

  const handleLogout = () => {
    window.localStorage.clear();
    history.replace('/login');
  }

  const triggerNode = () => {
    return collapsible && (
      <div className={styles.siderBottom} style={{ width: collapsed ? 60 : 200 }}>
        <div key='logout' className={styles.siderLogout}>
          <PoweroffOutlined onClick={() => handleLogout()} />
        </div>
        <div key='triggerNode' className={styles.siderTrigger} onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
        </div>
      </div>
    )
  }

  return (
    <Sider className={styles.layoutSider} collapsedWidth={collapsed ? 60 : 200} trigger={null} collapsible collapsed={collapsed}>
      <div className={`${collapsed ? styles.logoCollapse : styles.logoSpread} ${styles.logo}`}></div>
      {SiderMenu()}
      {triggerNode()}
    </Sider>
  );
};

export default LayoutSider;
