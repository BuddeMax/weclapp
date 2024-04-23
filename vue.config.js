// vue.config.js
const { defineConfig } = require('@vue/cli-service');


module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/webapp/api/v1': {
        target: 'https://bbmjboksjsbyiqe.weclapp.com',
        changeOrigin: true,
        secure: false,
      },
    }
  }
});

