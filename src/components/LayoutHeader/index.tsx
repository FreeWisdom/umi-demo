import { Result, Button, Layout, Menu, Breadcrumb, Dropdown } from 'antd';
import React, { useEffect, useState, ReactElement } from 'react';
import { useIntl, history, Dispatch, useDispatch, connect } from 'umi';
import { LogoutOutlined, EnvironmentFilled } from '@ant-design/icons';
import { transformRoute, MenuDataItem } from '@umijs/route-utils';
import styles from './index.less';
// import breadcrumbSeparator from '@/assets/breadcrumbSeparator.png';
// import { UserModelState } from '@/models/userInfo';
const { Header } = Layout;
export type LayoutHeaderProps = {
  collapsed: boolean;
  location?: any;
  routes: any;
  // user: UserModelState | undefined;
};
const LayoutHeader: React.FC<LayoutHeaderProps> = (props) => {
  const {
    collapsed,
    // settings,
    routes,
    // user,
  } = props;
  const dispatch: Dispatch = useDispatch();

  const getBreadcrumbPath: any = (
    breadcrumb: any,
    breadcrumbPath: string,
    pathname: string,
  ) => {
    let path = pathname.substring(0, pathname.lastIndexOf('/'));
    if (pathname.lastIndexOf('/') != -1) {
      let currentBreadcrumb = breadcrumb.get(path);
      let currentBreadcrumb2 = breadcrumb.get(breadcrumbPath);
      if (
        currentBreadcrumb &&
        currentBreadcrumb2 &&
        currentBreadcrumb.key == currentBreadcrumb2.key
      ) {
        return path;
      } else {
        return getBreadcrumbPath(breadcrumb, breadcrumbPath, path);
      }
    } else return null;
  };

  const RouteBreadcrumb = (props: any) => {
    const { formatMessage } = useIntl();
    const { breadcrumb, pathname, ...restProps } = props;
    const elements: ReactElement[] = [];
    let currentBreadcrumb = breadcrumb.get(pathname);
    let breadcrumbArr: Array<any> = [];
    while (currentBreadcrumb) {
      currentBreadcrumb.pathUrl = getBreadcrumbPath(
        breadcrumb,
        currentBreadcrumb.path,
        pathname,
      );
      breadcrumbArr.push(currentBreadcrumb);
      currentBreadcrumb = breadcrumb.get(
        currentBreadcrumb.pro_layout_parentKeys[
          currentBreadcrumb.pro_layout_parentKeys.length - 1
        ],
      );
    }
    breadcrumbArr.reverse();
    breadcrumbArr.map((v, i) => {
      elements.push(
        <Breadcrumb.Item key={v.locale}>
          {i != breadcrumbArr.length - 1 &&
          !v.noPage &&
          (v.pro_layout_parentKeys != undefined ||
            v.pro_layout_parentKeys.length != 0) ? (
            <a href={v.pathUrl}>
              {' '}
              {i == 0 ? <EnvironmentFilled /> : null}{' '}
              {formatMessage({ id: v.locale })}
            </a>
          ) : (
            <span>
              {' '}
              {i == 0 ? <EnvironmentFilled /> : null}{' '}
              {formatMessage({ id: v.locale })}
            </span>
          )}
        </Breadcrumb.Item>,
      );
      // if (i < breadcrumbArr.length - 1) {
      //   elements.push(
      //     <Breadcrumb.Separator key={i}>
      //       <img style={{ marginTop: '-4px' }} src={breadcrumbSeparator} />
      //     </Breadcrumb.Separator>,
      //   );
      // }
    });
    return (
      <Breadcrumb separator="" {...restProps}>
        {elements}
      </Breadcrumb>
    );
  };
  const onMenuClick = (event: { key: React.Key }) => {
    const { key } = event;
    if (key === 'logout') {
      dispatch({
        type: 'login/logout',
      });
      history.replace('/login');
    }
  };
  const menu = (
    <Menu className={styles.basicMenu} selectedKeys={[]} onClick={onMenuClick}>
      <Menu.Item key="logout">
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  );

  const { breadcrumb } = transformRoute(routes);
  const pathname = location.pathname;
  const currentBreadcrumb = breadcrumb.get(pathname);
  return (
    <Header className={styles.pageHeader}>
      <div className={styles.headerContent}>
        <RouteBreadcrumb
          className={styles.breadcrumb}
          breadcrumb={breadcrumb}
          pathname={location.pathname}
        />
        <Dropdown overlay={menu}>
          <div className={styles.menuText}>
            {/* {user?.currentUser?.name || 'admin'} */}
          </div>
        </Dropdown>
      </div>
    </Header>
  );
};

export default LayoutHeader;
