const { defineConfig } = require('@vue/cli-service');
const path = require('path');

console.log('VUE_APP_TARGET_URL:', process.env.VUE_APP_TARGET_URL);
module.exports = defineConfig({
  transpileDependencies: true,

  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  },
  devServer: {
    proxy: {
      '/api': {
        target: process.env.VUE_APP_TARGET_URL,
        changeOrigin: true,
        cookieDomainRewrite: {
          '.weareshadowpins.com': 'localhost',
        },

        logLevel: 'debug',
        onProxyRes(proxyRes, req, res) {
          // Node.js http-proxy에서는 헤더 키가 소문자로 들어옴
          if (proxyRes.headers['strict-transport-security']) {
            delete proxyRes.headers['strict-transport-security'];
            // 필요하면 로그도
            console.log('🧹 removed HSTS header from response:', req.url);
            console.log(res, proxyRes.headers, 'res');
          }
        },
      },
    },
  },
});
