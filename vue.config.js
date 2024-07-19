const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer:{
    proxy: {
      '/api': {
        target: 'http://localhost:4090', // 目标地址
        // 开启代理，在本地创建一个虚拟服务器，然后发送请求的数据，会同时会收到请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
        // changeOrigin: true, 
        pathRewrite: {
          '^/api': '' // 路径重写，移除路径中的/api
        }
      }
    }
  },
})
