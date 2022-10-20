// Vue
import Vue from 'vue'
import i18n from './i18n'
import App from './App'
import http from '@/api/cpApi/http/http'
import dateUtils from '@/utils/cpUtils/dateUtils'
import numUtils from '@/utils/cpUtils/numUtils'
import Model from '@/components/cpComponents/model/Model.vue'
// 核心插件
import ibps from './plugins/ibps'
// store
import store from './store/index'
// 菜单和路由设置
import router from './router'
// UI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import D2CrudX from 'd2-crud-x'
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
// 通用组件
import framework from '@/framework'
// 标尺
import VueRulerTool from 'vue-ruler-tool'
// 百度地图
import BaiduMap from 'vue-baidu-map'
import messager from '@/utils/cpUtils/message'
// 引入echarts
import echarts from 'echarts'
// js转换器
import 'babel-polyfill'
import cpisQueryPersons from '@/utils/cpUtils/cpisQueryPersons'
import cpisFlowUtils from '@/utils/cpUtils/cpisFlowUtils'
import { registerMicroApps, start } from 'qiankun'
registerMicroApps([
  {
    name: 'cycd',
    entry: '//localhost:70',
    container: '#child',
    activeRule: '/cycd',
  },
])
start()
Vue.component('vue-ruler-tool', VueRulerTool)
Vue.use(BaiduMap, {
  ak: 'RjA7rCVGGsLkzbqs2x7DBjE1Bx3U9WEC'
})
Vue.config.debug = true
Vue.use(ibps)
Vue.use(framework)
Vue.use(ElementUI)
Vue.use(D2CrudX, {name: 'd2-crud-x'})
Vue.use(VXETable)
Vue.component('el-model', Model)
Vue.prototype.$request = http
Vue.prototype.$tools = dateUtils
Vue.prototype.$numTools = numUtils
Vue.prototype.$CpisQueryPersons = cpisQueryPersons
Vue.prototype.$CpisFlowTools = cpisFlowUtils
Vue.prototype.SYSTEMURL = 'platform'
Vue.prototype.BUSNIESS = 'business'
Vue.prototype.SHIFTDUTY = 'shiftduty'
Vue.prototype.$message = messager // 重写message提示框  一定要放在Vue.use(ElementUI)之后
Vue.prototype.$echarts = echarts // 引入echarts
// 对message功能的补充
Vue.prototype.$message.close = function (id, userOnClose) {
  return ElementUI.Message.close(id, userOnClose)
}
Vue.prototype.$message.closeAll = function () {
  return ElementUI.Message.closeAll()
}
new Vue({
  router,
  store,
  i18n,
  async created() {
    // 加载接口配置
    await this.$store.dispatch('ibps/api/load')
  },
  async mounted() {
    // 展示系统信息
    await this.$store.commit('ibps/releases/versionShow')
    // 用户登录后从数据库加载一系列的设置
    await this.$store.dispatch('ibps/account/load')
    // 获取并记录用户 UA
    await this.$store.commit('ibps/ua/get')
    // 初始化全屏监听
    await this.$store.dispatch('ibps/fullscreen/listen')
    // 初始化加载是否修改用户信息
    await this.$store.dispatch('ibps/user/listen')
  },
  render: h => h(App)
}).$mount('#app')
