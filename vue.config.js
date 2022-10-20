const CompressionWebpackPlugin = require("compression-webpack-plugin")
const UglifyPlugin = require("uglifyjs-webpack-plugin")
const ThemeColorReplacer = require("webpack-theme-color-replacer")
const forElementUI = require("webpack-theme-color-replacer/forElementUI")
const cdnDependencies = require("./dependencies-cdn")
const HtmlInjectConfigPlugin = require("./plugins/html-inject-config-plugin")
const GenerateAssetPlugin = require('generate-asset-webpack-plugin')
let createConfig = function (compilation) {
  let cfgJson = {
    VUE_APP_BASE_API: 'http://112.4.136.182:8086/ibps',
    ENV: {
      // 页面 title 前缀
      VUE_APP_TITLE: '南京促普软件技术有限公司1231231',
      VUE_APP_COMPANY: 'common.companyP',
      // # 是否启用CDN
      VUE_APP_CDN: true,
      // # 是否启用gz压缩
      VUE_APP_GZ: true,
      // # element 颜色
      VUE_APP_ELEMENT_COLOR: '#409EFF',
      // # ---语言配置
      VUE_APP_LOCALE: 'zh-CN',
      // # ---促普
      VUE_APP_IMG: '@/assets/images/login/logoP.jpg',
      VUE_APP_LOGIN_IMG: '@/assets/images/login/logoP.jpg',
      VUE_APP_ICON: 'faviconP.ico',
      VUE_APP_LOGIN_BACKGROUND_IMG: '@/assets/images/login/login.png',
      VUE_APP_SUBSCRIPT: '2016-2022©南京促普软件技术有限公司',
      // # ---是否开启国际化语言切换
      VUE_APP_IS_LOCALE: true,
      // # ---两票是否开启安全交底功能
      VUE_APP_IS_TICKETS_SAFTY: false,
      // # ---巡检任务执行开具工作票
      VUE_APP_IS_INSP_WT: true,
      // # ---巡检任务PC端是否可执行
      VUE_APP_IS_PC_INSP: true,
      // # ---巡检任务巡检方式   true-现场   false-远程
      VUE_APP_IS_SCENE_LONGRANGE: true,
      // # ---管控模式 0-扫码 1-手动选择 2-物联设备
      VUE_APP_IS_SCANHAND: '2',
      // # ---跳转设备台账  是华能还是黄陵
      VUE_APP_EQUIPMENT_ACCOUNT: true,
      // # SSO单点登录配置(黄陵单点登录)
      // # on 开启单点登录  off 关闭单点登录
      VUE_APP_CAS_OPEN: 'off',
      // # ---当前服务器的地址(客户端)
      VUE_APP_CAS_CLIENT_HOST_URL: 'oauth2/v3/user/openSSO',
      // # --- 当前cas 登录
      VUE_APP_CAS_SERVER_LOGIN_ON: 'http://192.168.66.247:17020/frontend/login',
      VUE_APP_CAS_SERVER_LOGIN_OUT: 'http://192.168.66.247:17020/frontend/login',
      // # 单点跳转默认选中处理
      // #头部点击切换开关默认选中开关 open 启动  close 关闭
      VUE_APP_MODULE_HEADER_ENABLED: 'close',
      // # 两票管理
      VUE_APP_MODULE_LPGL_HEADER: '902593377957052416',
      // # ---两票附票是否开启关联IOT
      VUE_APP_AT_TICKETS_IS_HAS_IOT: false,
      // # 默认打开的菜单目录
      VUE_APP_MODULE_LPGL_PATH: '/lpgl/gzp',
      // # 默认打开的列表页面(路由)
      VUE_APP_MODULE_LPGL_OPEN: '/lpgl/gzp/wtWorkTktInv2',
      // # 设备管理
      VUE_APP_MODULE_SBGL_HEADER: '788445928913633280',
      VUE_APP_MODULE_SBGL_PATH: '/sbgl/sbtzglll',
      // # 巡点检系统
      VUE_APP_MODULE_SBGL_OPEN: '/sbgl/sbtzglll/eqAccountList',
      VUE_APP_MODULE_XDJGL_HEADER: '781957002686365696',
      VUE_APP_MODULE_XDJGL_PATH: '/xhjc/xjqygl',
      VUE_APP_MODULE_XDJGL_OPEN: '/xhjc/inspTourCheckPlanMgt',
      // # 缺陷管理
      VUE_APP_MODULE_QXGL_HEADER: '778286022499762176',
      VUE_APP_MODULE_QXGL_PATH: '/sbqxlcgl/defectFireMgtList',
      VUE_APP_MODULE_QXGL_OPEN: '/sbqxlcgl/defectFireMgtList',
      // # 用户管理
      VUE_APP_MODULE_YHGL_HEADER: '847474415145844736',
      VUE_APP_MODULE_YHGL_PATH: '/xhjc/inspTourCheckPlanMgt',
      VUE_APP_MODULE_YHGL_OPEN: '/xtgl/yggl',
      // # 告警信息跳转配置
      VUE_APP_MODULE_GJXX_HEADER: '',
      VUE_APP_MODULE_GJXX_PATH: '',
      VUE_APP_MODULE_GJXX_OPEN: '/platform/pendingExtend',

      // 业务单独配置 (业务层)
      VUE_APP_PUBLIC_PATH: '/',
      port: '',
      npm_config_port: '',
      NODE_ENV: 'development'
    }
  }
  return JSON.stringify(cfgJson)
}
const ENV = JSON.parse(createConfig()).ENV
console.log('ENV111', ENV)
const { set, each, compact, map, keys } = require("lodash")
const path = require("path")
const resolve = dir => path.join(__dirname, dir)
// 增加环境变量
process.env.VUE_APP_VERSION = require("./package.json").version
process.env.VUE_APP_BUILD_TIME = require("dayjs")().format("YYYY-M-D HH:mm:ss")
const elementColor = ENV.VUE_APP_ELEMENT_COLOR // element-ui的基础色系
const publicPath = ENV.VUE_APP_PUBLIC_PATH || "/" // 基础路径 注意发布之前要先修改这里
const port = ENV.port || ENV.npm_config_port || 9528 // 端口
const enableGzip = ENV.VUE_APP_GZ === true // 是否启动Gzip
const enableCDN = ENV.VUE_APP_CDN === true // 是否启动CDN
const TimeStamp = new Date().getTime() // 时间戳
// 为多个页面构建配置
const pages = {
  index: { entry: "src/main.js", template: "public/index.html", filename: "index.html", chunks: ["manifest", "index", "chunk-index", "chunk-vendor", "chunk-common", "chunk-vue", "chunk-element"] },
  subpage: { entry: "src/subpage/main.js", template: "public/subpage.html", filename: "subpage.html", chunks: ["manifest", "subpage", "chunk-subpage", "chunk-vendor", "chunk-common", "chunk-vue"] }
}
// 建立使用CDN方法引入的外部依赖包
// 例如
// 如果您在这里设置与Axios相关的链接配置
// Axios在构建期间将不再参与打包。最后您配置的外部链接将用于在构建结果中导入Axios
let cdn = {}
if (enableCDN) {
  cdn = {
    // 以CDN链接的形式引入与index相关的外部依赖
    index: cdnDependencies,
    // 以CDN链接的形式引入与移动页面相关的外部依赖
    subpage: []
  }
}
// 设置不参与构建的外部依赖包
const externals = {}
keys(pages).forEach(name => {
  if (cdn[name]) {
    cdn[name].forEach(p => {
      if (p.library !== "") {
        externals[p.name] = p.library
      }
    })
  }
})
module.exports = {
  publicPath,
  lintOnSave: true,
  devServer: {
    publicPath, // 和 publicPath 保持一致
    port, // 端口
    disableHostCheck: true // 关闭 host check，方便使用 ngrok 之类的内网转发工具
  },
  css: {
    loaderOptions: {
      // 设置 scss 公用变量文件
      sass: {
        /* sass-loader 9.0+写法*/
        additionalData(content, loaderContext) {
          const { resourcePath, rootContext } = loaderContext
          const relativePath = path.relative(rootContext, resourcePath)
          if (relativePath.replace(/\\/g, "/") !== "src/assets/styles/public.scss") {
            return '@import "~@/assets/styles/public.scss";' + content
          }
          return content
        }
      }
    },
    extract: {
      // 修改打包后css文件名   // css打包文件，添加时间戳
      filename: `css/[name].${TimeStamp}.css`,
      chunkFilename: `css/[name].${TimeStamp}.css`
    }
  },
  pages,
  configureWebpack: config => {
    const configNew = {
      plugins: [
        new GenerateAssetPlugin({
          filename: 'serverConfig.json',
          fn: (compilation, cb) => {
            cb(null, createConfig(compilation))
          },
        }),
      ],
    }
    if (ENV.NODE_ENV === "production" || ENV.NODE_ENV === "development") {
      externals["./cptable"] = "var cptable"
      configNew.externals = externals
      configNew.output = {
        // 输出重构  打包编译后的 文件名称  【模块名称.版本号.js】
        filename: `js/[name].${TimeStamp}.js`,
        chunkFilename: `js/[name].${TimeStamp}.js`
      }
      configNew.module = { rules: [{ test: /\.tsx?$/, loader: "ts-loader", exclude: /node_modules/, options: { appendTsSuffixTo: [/\.vue$/] } }] }
      // 是否开启Gzip
      if (enableGzip) {
        const productionGzipExtensions = ["js", "css"]
        configNew.plugins = [
          new CompressionWebpackPlugin({
            filename: "[path][base].gz[query]",
            test: new RegExp("\\.(" + productionGzipExtensions.join("|") + ")$"),
            threshold: 10240,
            minRatio: 0.8,
            deleteOriginalAssets: false
          })
        ]
      }
    }
    return configNew
  },
  // 默认情况下 babel-loader 会忽略所有 node_modules 中的文件。如果你想要通过 Babel 显式转译一个依赖，可以在这个选项中列出来。
  transpileDependencies: ["signature_pad", "resize-detector", "vue-grid-layout", "fuse.js"],
  //  默认设置: https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-service/lib/config/base.js
  chainWebpack: config => {
    config.optimization.runtimeChunk({
      name: "manifest"
    })
    config.optimization.splitChunks({
      cacheGroups: {
        // 所有页面共有的外部依赖关系
        libs: {
          name: "chunk-vendor",
          chunks: "initial",
          minChunks: 1,
          test: /[\\/]node_modules[\\/]/,
          priority: 1,
          reuseExistingChunk: true,
          enforce: true
        },
        // 对所有页面通用的代码
        common: {
          name: "chunk-common",
          chunks: "initial",
          minChunks: 2,
          maxInitialRequests: 5,
          minSize: 0,
          priority: 2,
          reuseExistingChunk: true,
          enforce: true
        },
        // 仅供首页使用的外部依赖项
        index: {
          name: "chunk-index",
          chunks: "all",
          minChunks: 1,
          test: /[\\/]node_modules[\\/](sortablejs|screenfull|nprogress|hotkeys-js|fuse\.js|better-scroll|lowdb)[\\/]/,
          priority: 3,
          reuseExistingChunk: true,
          enforce: true
        },
        // Vue 全家桶
        vue: {
          name: "chunk-vue",
          test: /[\\/]node_modules[\\/](vue|vue-router|vuex)[\\/]/,
          chunks: "all",
          priority: 3,
          reuseExistingChunk: true,
          enforce: true
        },
        // element-ui
        element: {
          name: "chunk-element",
          test: /[\\/]node_modules[\\/]element-ui[\\/]/,
          chunks: "all",
          priority: 3,
          reuseExistingChunk: true,
          enforce: true
        }
      }
    })
    config.optimization.minimizer = [new UglifyPlugin({ uglifyOptions: { warnings: false, compress: { drop_console: true, drop_debugger: false, pure_funcs: ["console.log"] } } })]
    // Add the CDN settings to the settings of the htmlwebpackplugin plug-in
    keys(pages).forEach(name => {
      const packages = cdn[name]
      config.plugin(`html-${name}`).tap(options => {
        const setting = {
          css: compact(map(packages, "css")),
          js: compact(map(packages, "js"))
        }
        set(options, "[0].cdn", ENV.NODE_ENV === "production" ? setting : [])
        return options
      })
    })
    // 删除延迟加载模块的预取预加载设置
    each(keys(pages), name => {
      config.plugins["delete"](`prefetch-${name}`)
      config.plugins["delete"](`preload-${name}`)
    })
    // 在html文件注入配置文件
    config.plugin("HtmlInjectConfigPlugin").use(HtmlInjectConfigPlugin, [publicPath])
    // webpack-theme-color-replacer
    config.plugin("theme-color-replacer").use(ThemeColorReplacer, [
      {
        fileName: "css/theme-colors.[contenthash:8].css",
        matchColors: [
          ...forElementUI.getElementUISeries(elementColor) // Element-ui主色系列
        ],
        externalCssFiles: ["./node_modules/element-ui/lib/theme-chalk/index.css"], // optional, String or string array. Set external css files (such as cdn css) to extract colors.
        changeSelector: forElementUI.changeSelector
      }
    ])
    config.when(ENV.NODE_ENV === "development", son => son.devtool("cheap-source-map")) // 开发环境 sourcemap 不包含列信息
    // markdown
    config.module.rule("md").test(/\.md$/).use("text-loader").loader("text-loader").end()
    // svg
    const svgRule = config.module.rule("svg")
    svgRule.uses.clear()
    svgRule.include
      .add(resolve("src/assets/svg-icons/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "ibps-[name]"
      })
      .end()
    // image exclude
    const imagesRule = config.module.rule("images")
    imagesRule
      .test(/\.(png|jpe?g|gif|webp|svg)(\?.*)?$/)
      .exclude.add(resolve("src/assets/svg-icons/icons"))
      .end()
    // 重新设置 alias
    config.resolve.alias.set("@api", resolve("src/api")).set("vue$", "vue/dist/vue.esm.js")
    // 分析工具
    if (process.env.npm_config_report) {
      config.plugin("webpack-bundle-analyzer").use(require("webpack-bundle-analyzer").BundleAnalyzerPlugin)
    }
    config.plugin('define').tap(args => {
      console.log('eeeeee',ENV)
      Object.keys(ENV).map(key => {
        let val = ENV[key];
        args[0]['process.env'][key] = JSON.stringify(val)
      })
      return args
    })
  },
  productionSourceMap: false, // 不输出 map 文件
  pluginOptions: {
    i18n: {
      locale: "zh-CN",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: true
    }
  }
}
