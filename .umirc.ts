import { defineConfig } from 'umi';
import router from './config/router'; // 引入路由配置文件

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: router,
  fastRefresh: {},
  locale: {
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dva: {
    hmr: true,
    lazyLoad: true,
    skipModelValidate: true,
  },
  mfsu: {},
  // publicPath: '/h5/subSystemA/',
	// outputPath: '../dist/subSystemA',
  qiankun: {
    master: {
      // 注册子应用信息
      apps: [
        {
          name: 'app1', // 唯一 id
          entry: '//localhost:8003/planShow/dayList', // html entry
        },
        // {
        //   name: 'app2', // 唯一 id
        //   entry: '//localhost:7002', // html entry
        // },
      ],
    },
  },
});
