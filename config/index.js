'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      // '/api': {
      //   target: 'http://120.78.91.203:12689/api/', //对应自己的接口
      //   changeOrigin: true,//是否跨域
      //   ws: true,
      //   pathRewrite: {
      //     '^/api': '' //这里理解成/api 代替 target 里面的地址，后面组件中我们调用接口时，直接使用 api 代替
      //   }
      // }
      '/api': {
        target: 'http://pmc.szclsoft.com/api/', //对应自己的接口
        changeOrigin: true,//是否跨域
        ws: true,
        pathRewrite: {
          '^/api': '' //这里理解成/api 代替 target 里面的地址，后面组件中我们调用接口时，直接使用 api 代替
        }
      },
      '/apk': {
        target: 'http://120.76.102.113:12689/api/', //对应自己的接口 120.76.102.113:12689" http://120.78.91.203:12689/api/
        changeOrigin: true,//是否跨域
        ws: true,
        pathRewrite: {
          //'^/apk': '' //这里理解成/apk 代替 target 里面的地址，后面组件中我们调用接口时，直接使用 api 代替
          // http://120.78.91.203:12689/api/DemoApi/oftenGoods.php，直接写成‘/apk/DemoApi/oftenGoods.php’就可以了
          '^/apk': '/'
        }
      }
    },

    // Various Dev Server settings
    host: '127.0.0.1', // can be overwritten by process.env.HOST
    port: 8083, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: false
  },

  build: { 
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: process.env.NODE_ENV === 'production'?'./static':'static',
    assetsPublicPath: process.env.NODE_ENV === 'production'?'./':'/', //修改为相对路径

    /**
     * Source Maps 
     */

    productionSourceMap: false,// 屏蔽sourceMap // 打包优化1
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    //启用压缩功能前提是需要webpack的支持，安装压缩插件： npm install --save-dev compression-webpack-plugin
    productionGzip: false, // 启用压缩插件  // 打包优化2
    productionGzipExtensions: ['script','js', 'css','svg'], //顶压缩文件的类型 // 打包优化3

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
