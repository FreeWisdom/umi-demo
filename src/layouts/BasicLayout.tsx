import { Layout } from 'antd';
import { useState } from 'react';
import styles from './BasicLayout.less';
import LayoutSider from '../components/LayoutSider';
import LayoutHeader from '../components/LayoutHeader';
import { IRouteComponentProps } from 'umi';
const { Content } = Layout;

const BasicLayout = ({ children, location, route: { routes }, history, match }: IRouteComponentProps) => {
  const [collapsed, setCollapsed] = useState<boolean>(true);
  let hiddenMenu = routes?.filter((m) => m.path === location.pathname)[0]?.hiddenMenu;
  let hiddenHeader = routes?.filter((m) => m.path === location.pathname)[0]?.hiddenHeader;
  return (
    <Layout className={styles.page}>
      {
        hiddenMenu ? ('') : (
          <LayoutSider
            collapsible={true}
            collapsed={collapsed}
            routes={routes}
            setCollapsed={() => setCollapsed(!collapsed)}
          />
        )
      }
      <Layout>
        {/* {
          hiddenHeader ? ('') : (
            <LayoutHeader
              collapsed={collapsed}
              routes={routes}
              location={location}
            // user={'currentUser'}
            />
          )
        } */}
        <Content>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default BasicLayout;
