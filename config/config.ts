import routes from './routes';
import { defineConfig } from 'umi';

//const path = require("path");

export default defineConfig({
   base:'/h5/',
  publicPath: '/h5/', //打包项目名
  dynamicImport: {},
  chainWebpack(config) {
    // 压缩代码
    config.optimization.minimize(true);
    // 分割代码
    //  config.optimization.splitChunks({
    //    chunks: 'all',
    //  })
    // 移除 prefetch 插件
    // config.plugins.delete('prefetch')
    // 移除 preload 插件
    config.plugins.delete('preload');
    config.optimization.splitChunks({
      chunks: 'async', //async异步代码分割 initial同步代码分割 all同步异步分割都开启
      minSize: 30000, //字节 引入的文件大于30kb才进行分割
      // maxSize: 30000,         //50kb，尝试将大于50kb的文件拆分成n个50kb的文件
      minChunks: 1, //模块至少使用次数
      maxAsyncRequests: 5, //同时加载的模块数量最多是5个，只分割出同时引入的前5个文件
      maxInitialRequests: 3, //首页加载的时候引入的文件最多3个
      automaticNameDelimiter: '~', //缓存组和生成文件名称之间的连接符
      name: true, //缓存组里面的filename生效，覆盖默认命名
      cacheGroups: {
        //缓存组，将所有加载模块放在缓存里面一起分割打包
        // vendors: {  //自定义打包模块
        //   test: /[\\/]node_modules[\\/]/,
        //   priority: -10, //优先级，先打包到哪个组里面，值越大，优先级越高
        //   filename: 'vendors.js',
        // },
        styles: {
          name: 'styles',
          test: /\.(css|less)$/,
          chunks: 'async',
          minChunks: 3,
          minSize: 100,
        },
        //   js:{
        //     name: 'styles',
        //     test: /\.(js|ts|jsx)$/,
        //     chunks: 'async',
        //     minChunks: 3,
        //     minSize: 100,
        //   }
        // default: { //默认打包模块
        //   priority: -20,
        //   reuseExistingChunk: true, //模块嵌套引入时，判断是否复用已经被打包的模块
        //   filename: 'common.js'
        // }
      },

      // cacheGroups: {
      //   styles: {
      //     name: 'styles',
      //     test: /\.(css|less)$/,
      //     chunks: 'async',
      //     minChunks: 3,
      //     minSize: 100,
      //   },
      //   js:{
      //     name: 'styles',
      //     test: /\.(js|ts|jsx)$/,
      //     chunks: 'async',
      //     minChunks: 3,
      //     minSize: 100,
      //   }
      // },
    });
  },
  favicon: '/favicon.ico',

  routes: routes,
  history: {
    type: 'hash',
  },

  externals: {
    react: 'window.React',
    reactDOM: 'window.ReactDOM',
    axios: 'axios',
  },
  scripts: [
    'https://cdn.bootcss.com/axios/0.18.0/axios.min.js',
    'https://cdn.staticfile.org/react/16.12.0/umd/react.development.js',
    'https://cdn.staticfile.org/react-dom/16.4.0/umd/react-dom.development.js',
  ],

  proxy: {
    '/api': {
      target: 'https://guigudev.motionpaydev.com/',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
    '/onlinePayment': {
      target: 'https://guigudev.motionpaydev.com/',
      changeOrigin: true,
    },
  },
});
