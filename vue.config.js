const { defineConfig } = require('@vue/cli-service');
const path = require('path');

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
    port: 3000,
    proxy: {
      '/articles': {
        target: 'https://api.kdark.weareshadowpins.com',
        changeOrigin: true,
      },
      '/api': {
        //target: 'https://api.kdark.weareshadowpins.com',
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
