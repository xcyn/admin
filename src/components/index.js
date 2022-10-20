import Vue from 'vue'
import ibpsContainer from './ibps-container'
import ibpsContainerFrame from './ibps-container-frame'
import ibpsLinkBtn from './ibps-link-btn'
import ibpsCheckbox from './ibps-checkbox'
// 注意 有些组件使用异步加载会有影响
Vue.component('IbpsContainer', ibpsContainer)
Vue.component('IbpsContainerFrame', ibpsContainerFrame)
Vue.component('IbpsCheckbox', ibpsCheckbox)
Vue.component('IbpsLinkBtn', ibpsLinkBtn)
Vue.component('IbpsHighlight', () => import('./ibps-highlight'))
Vue.component('IbpsIcon', () => import('./ibps-icon'))
Vue.component('IbpsIconSvg', () => import('./ibps-icon-svg/index.vue'))
Vue.component('IbpsIconSelect', () => import('./ibps-icon-select/index.vue'))
Vue.component('IbpsIconSvgSelect', () => import('./ibps-icon-svg-select/index.vue'))
Vue.component('IbpsEmpty', () => import('./ibps-empty/index.vue'))
Vue.component('IbpsScrollbar', () => import('./ibps-scrollbar/index.vue'))
Vue.component('IbpsToolbar', () => import('./ibps-toolbar/index.vue'))
Vue.component('IbpsCrud', () => import('./ibps-crud/index.vue'))
Vue.component('IbpsLayout', () => import('./ibps-layout/index.vue'))
Vue.component('IbpsTree', () => import('./ibps-tree/index.vue'))
Vue.component('IbpsList', () => import('./ibps-list/list.vue'))
Vue.component('IbpsListItem', () => import('./ibps-list/list-item.vue'))
Vue.component('IbpsListItemMeta', () => import('./ibps-list/list-item-meta.vue'))
Vue.component('IbpsHyperlink', () => import('./ibps-link'))
Vue.component('IbpsHelp', () => import('./ibps-help/index.vue'))
Vue.component('IbpsTextEllipsis', () => import('./ibps-text-ellipsis/index.vue'))
Vue.component('IbpsEllipsis', () => import('./ibps-ellipsis/index.vue'))
Vue.component('IbpsSteps', () => import('./ibps-steps/steps'))
Vue.component('IbpsStepPane', () => import('./ibps-steps/step-pane'))
// 二维码
Vue.component('IbpsQrCode', () => import('./ibps-qr-code/index.vue'))
