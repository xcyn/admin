import Vue from 'vue'
import { findHashRightsColumn } from '@/api/platform/desktop/column'

import '@/assets/styles/pages/dashboard.scss'
// 引入 ECharts 主模块
import 'echarts'
import VueCompositionAPI from '@vue/composition-api'
Vue.use(VueCompositionAPI)

import { buildComponent } from './util'
// CountTo 组件 === dashboard需要的
Vue.component('CountTo', () => import('vue-count-to'))
// echarts 组件
Vue.component('VChart', () => import('vue-echarts'))
// 日历组件
Vue.component('VFullCalendar', () => import('@/components/ibps-fullcalendar'))
// 工具栏
Vue.component('IbpsDesktopToolbar', () => import('./toolbar'))
// 走马灯
Vue.component('IbpsMarquee', () => import('@/components/ibps-marquee'))
Vue.component('IbpsTrottingHorseLamp', () => import('./trottingHorseLamp'))

let init = false
const components = []

export function initColumn(systemAlias) {
  findHashRightsColumn({
    systemAlias: systemAlias
  }).then(response => {
    const dataResult = response.data
    // 构建组件
    dataResult.forEach(column => {
      const name = `ibps-desktop-${column.alias}`
      Vue.component(name, (resolve, reject) => {
        resolve(buildComponent(name, column))
      })
      components.push(name)
    })
    init = true
  }).catch((err) => {
    init = true
    console.error(err)
  })
}

/**
 * 是否初始化
 */
export function isInit() {
  return init
}

export function getComponents() {
  return components
}
