/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */

// const url = 'http://10.168.3.203:8081';
const url = 'http://11.168.3.160:8081';
// const url = 'http://172.16.3.17:8081';
// const url = 'http://11.168.3.225:8081';

export default {
  dev: {
    '/blank/': {
      target: url,
      changeOrigin: true,
      pathRewrite: { '^/blank': '' },
    },
  },
  pre: {
    '/blank/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
