// cdn 仓库
const cdn = `https://cdn.jsdelivr.net/npm/`
const gh = `https://cdn.jsdelivr.net/gh/`

const pg = require('./package.json')
const ds = pg.dependencies
function parse(v) {
  return v.trim().replace(/^[~^]+/, '')
}
function v(name) {
  return parse(ds[name])
}

module.exports = [
  { name: `vue`, library: `Vue`, js: `${cdn}vue@${v('vue')}/dist/vue.min.js`, css: `` },
  { name: `vue-i18n`, library: `VueI18n`, js: `${cdn}vue-i18n@${v('vue-i18n')}/dist/vue-i18n.min.js`, css: `` },
  { name: `vue-router`, library: `VueRouter`, js: `${cdn}vue-router@${v('vue-router')}/dist/vue-router.min.js`, css: `` },
  { name: `vuex`, library: `Vuex`, js: `${cdn}vuex@${v('vuex')}/dist/vuex.min.js`, css: `` },
  { name: `animate.css`, library: ``, js: ``, css: `${cdn}animate.css@${v('animate.css')}/animate.min.css` },
  { name: `axios`, library: `axios`, js: `${cdn}axios@${v('axios')}/dist/axios.min.js`, css: `` },
  { name: `better-scroll`, library: `BetterScroll`, js: `${cdn}better-scroll@${v('better-scroll')}/dist/better-scroll.min.js`, css: `` },
  { name: `big.js`, library: `Big`, js: `${cdn}big.js@${v('big.js')}/big.min.js`, css: `` },
  { name: `clipboard`, library: `ClipboardJS`, js: `${cdn}clipboard@${v('clipboard')}/dist/clipboard.min.js`, css: `` },
  { name: `clipboard-polyfill`, library: `clipboard`, js: `${cdn}clipboard-polyfill@${v('clipboard-polyfill')}/dist/main/clipboard-polyfill.min.js`, css: `` },
  { name: `codemirror`, library: `CodeMirror`, js: `${cdn}codemirror@${v('codemirror')}/lib/codemirror.min.js`, css: `${cdn}codemirror@${v('codemirror')}/lib/codemirror.css` },
  { name: `dayjs`, library: `dayjs`, js: `${cdn}dayjs@${v('dayjs')}/dayjs.min.js`, css: `` },
  { name: `echarts`, library: `echarts`, js: `${cdn}echarts@${v('echarts')}/dist/echarts.min.js` },
  { name: `element-ui`, library: `ELEMENT`, js: `${cdn}element-ui@${v('element-ui')}/lib/index.js`, css: `${cdn}element-ui@${v('element-ui')}/lib/theme-chalk/index.css` },
  { name: `file-saver`, library: `saveAs`, js: `${cdn}file-saver@${v('file-saver')}/dist/FileSaver.min.js`, css: `` },
  { name: `flex.css`, library: ``, js: ``, css: `${cdn}flex.css@${v('flex.css')}/dist/flex.min.css` },
  { name: `focus-visible`, library: `applyFocusVisiblePolyfill`, js: `${cdn}focus-visible@${v('focus-visible')}/dist/focus-visible.min.js`, css: `` },
  { name: `fuse.js`, library: `Fuse`, js: `${cdn}fuse.js@${v('fuse.js')}/dist/fuse.min.js`, css: `` },
  { name: `handsontable`, library: `Handsontable`, js: `${cdn}handsontable@${v('handsontable')}/dist/handsontable.full.min.js`, css: `${cdn}handsontable@${v('handsontable')}/dist/handsontable.full.min.css` },
  { name: `handsontable-vue`, library: `HotTable`, js: `${cdn}@handsontable/vue@${v('@handsontable/vue')}/dist/vue-handsontable.min.js`, css: `` },
  { name: `highlight.js`, library: `hljs`, js: `${gh}highlightjs/cdn-release@${v('highlight.js')}/build/highlight.js`, css: `${gh}highlightjs/cdn-release@${v('highlight.js')}/build/styles/default.min.css` },
  { name: `hls.js`, library: `Hls`, js: `${cdn}hls.js@${v('hls.js')}/dist/hls.min.js`, css: `` },
  { name: `hotkeys-js`, library: `hotkeys`, js: `${cdn}hotkeys-js@${v('hotkeys-js')}/dist/hotkeys.min.js`, css: `` },
  { name: `js-cookie`, library: `Cookies`, js: `${cdn}js-cookie@${v('js-cookie')}/src/js.cookie.min.js`, css: `` },
  { name: `jsbarcode`, library: `JsBarcode`, js: `${cdn}jsbarcode@${v('jsbarcode')}/dist/JsBarcode.all.min.js`, css: `` },
  { name: `lodash`, library: `_`, js: `${cdn}lodash@${v('lodash')}/lodash.min.js`, css: `` },
  { name: `long`, library: `Long`, js: `${cdn}long@${v('long')}/dist/long.js`, css: `` },
  { name: `lowdb`, library: `low`, js: `${cdn}lowdb@${v('lowdb')}/dist/low.min.js`, css: `` },
  { name: `lowdb/adapters/LocalStorage`, library: `LocalStorage`, js: `${cdn}lowdb@${v('lowdb')}/dist/LocalStorage.min.js`, css: `` },
  { name: `mockjs`, library: `Mock`, js: `${cdn}mockjs@${v('mockjs')}/dist/mock.min.js`, css: `` },
  { name: `normalize.css`, library: ``, js: ``, css: `${cdn}normalize.css@${v('normalize.css')}/normalize.min.css` },
  { name: `nprogress`, library: `NProgress`, js: `${cdn}nprogress@${v('nprogress')}/nprogress.min.js`, css: `${cdn}nprogress@${v('nprogress')}/nprogress.css` },
  { name: `papaparse`, library: `Papa`, js: `${cdn}papaparse@${v('papaparse')}/papaparse.min.js`, css: `` },
  { name: `pinyin4js`, library: `PinyinHelper`, js: `${cdn}pinyin4js@${v('pinyin4js')}/dist/pinyin4js.js`, css: `` },
  { name: `qrcode`, library: `QRCode`, js: `${cdn}qrcode@${v('qrcode')}/build/qrcode.min.js`, css: `` },
  { name: `qs`, library: `Qs`, js: `${cdn}qs@${v('qs')}/dist/qs.js`, css: `` },
  { name: `quill`, library: `Quill`, js: `${cdn}quill@${v('quill')}/dist/quill.min.js`, css: `` },

  { name: `screenfull`, library: `screenfull`, js: `${cdn}screenfull@${v('screenfull')}/dist/screenfull.min.js`, css: `` },
  { name: `signature_pad`, library: `SignaturePad`, js: `${cdn}signature_pad@${v('signature_pad')}/dist/signature_pad.umd.min.js`, css: `` },
  { name: `sortablejs`, library: `Sortable`, js: `${cdn}sortablejs@${v('sortablejs')}/Sortable.min.js`, css: `` },
  { name: `ua-parser-js`, library: `UAParser`, js: `${cdn}ua-parser-js@${v('ua-parser-js')}/dist/ua-parser.min.js`, css: `` },
  { name: `video.js`, library: `videojs`, js: `${cdn}video.js@${v('video.js')}/dist/video.min.js`, css: `${cdn}video.js@${v('video.js')}/dist/video-js.min.css` },
  { name: `vue-amap`, library: `VueAMap`, js: `${cdn}vue-amap@${v('vue-amap')}/dist/index.min.js`, css: `` },
  { name: `vue-aplayer`, library: `VueAPlayer`, js: `${cdn}vue-aplayer@${v('vue-aplayer')}/dist/vue-aplayer.min.js`, css: `` },
  { name: `vue-codemirror`, library: `VueCodemirror`, js: `${cdn}vue-codemirror@${v('vue-codemirror')}/dist/vue-codemirror.min.js`, css: `` },
  { name: `vue-count-to`, library: `CountTo`, js: `${cdn}vue-count-to@${v('vue-count-to')}/dist/vue-count-to.min.js`, css: `` },

  { name: `vue-composition-api `, library: `VueCompositionAPI`, js: `${cdn}@vue/composition-api@${v('@vue/composition-api')}/dist/vue-composition-api.prod.min.js`, css: `` },
  { name: `vue-demi`, library: `VueDemi`, js: `${cdn}vue-demi@${v('vue-demi')}/lib/index.iife.min.js`, css: `` },
  { name: `vue-echarts`, library: `VueECharts`, js: `${cdn}vue-echarts@${v('vue-echarts')}/dist/index.umd.min.js`, css: `` },
  { name: `vue-grid-layout`, library: `VueGridLayout`, js: `${cdn}vue-grid-layout@${v('vue-grid-layout')}/dist/vue-grid-layout.umd.min.js`, css: `` },
  { name: `vue-splitpane`, library: `SplitPane`, js: `${cdn}vue-splitpane@${v('vue-splitpane')}/dist/vue-split-pane.min.js`, css: `` },
  { name: `vue-video-player`, library: `VueVideoPlayer`, js: `${cdn}vue-video-player@${v('vue-video-player')}/dist/vue-video-player.min.js`, css: `${cdn}vue-video-player@${v('vue-video-player')}/src/custom-theme.css` },
  { name: `vuedraggable`, library: `vuedraggable`, js: `${cdn}vuedraggable@${v('vuedraggable')}/dist/vuedraggable.umd.min.js`, css: `` },
  { name: `xlsx`, library: `XLSX`, js: `${cdn}xlsx@${v('xlsx')}/dist/xlsx.full.min.js`, css: `` },
  { name: `xss`, library: `filterXSS`, js: `${cdn}xss@${v('xss')}/dist/xss.js`, css: `` },

  { name: `fullcalendar-core`, library: `Fullcalendar`, js: `${cdn}fullcalendar@${v('@fullcalendar/core')}/main.min.js`, css: `${cdn}fullcalendar@${v('@fullcalendar/core')}/main.min.css` },
  { name: `fullcalendar-vue`, library: `FullCalendarVue`, js: `${cdn}@fullcalendar/vue@${v('@fullcalendar/vue')}/dist/main.global.min.js`, css: `` },
  { name: `fullcalendar-day-grid`, library: `FullCalendarDayGrid`, js: `${cdn}@fullcalendar/daygrid@${v('@fullcalendar/daygrid')}/main.global.min.js`, css: `${cdn}@fullcalendar/daygrid@${v('@fullcalendar/daygrid')}/main.min.css` },
  { name: `fullcalendar-time-grid`, library: `FullCalendarTimeGrid`, js: `${cdn}@fullcalendar/timegrid@${v('@fullcalendar/timegrid')}/main.global.min.js`, css: `${cdn}@fullcalendar/timegrid@${v('@fullcalendar/timegrid')}/main.min.css` },
  { name: `fullcalendar-list`, library: `FullCalendarList`, js: `${cdn}@fullcalendar/list@${v('@fullcalendar/list')}/main.global.min.js`, css: `${cdn}@fullcalendar/list@${v('@fullcalendar/list')}/main.min.css` },
  { name: `fullcalendar-bootstrap`, library: `FullCalendarBootstrap`, js: `${cdn}@fullcalendar/bootstrap@${v('@fullcalendar/bootstrap')}/main.global.min.js`, css: `${cdn}@fullcalendar/bootstrap@${v('@fullcalendar/bootstrap')}/main.min.css` },
  { name: `diagram-js-minimap`, library: `DiagramJSMinimap`, js: `${cdn}diagram-js-minimap@${v('diagram-js-minimap')}/dist/diagram-minimap.umd.prod.js`, css: `` }

  // vue-json-viewer
  // 没有 导出包
  // { name: `diagram-js-origin`, library: `DiagramJsOrigin`, js: `${cdn}diagram-js-origin@1.3.1/index.js`, css: `` }, //
  // { name: `bpmn-js`, library: `BpmnViewer`, js: `${cdn}bpmn-js@7.5.0/index.js`, css: `` }, //
  // { name: `bpmn-js-properties-panel`, library: `PropertiesPanelModule`, js: `${cdn}bpmn-js-properties-panel@0.37.0/index.js`, css: `` },//
  // { name: `vue-barcode`, library: `VueBarcode`, js: `${cdn}vue-barcode@1.3.0/index.min.js`, css: `` },
  // 报错 没有 导出包
  // { name: `redent`, library: `redent`, js: `${cdn}redent@3.0.0/index.js`, css: `` }, // require
  // { name: `detect-indent`, library: `detectIndent`, js: `${cdn}detect-indent@6.0.0/index.js`, css: `` }, //module
  // { name: `area-data`, library: `AreaData`, js: `${cdn}area-data@5.0.6/data.min.js`, css: `` }, // module
  // { name: `core-js`, library: `Core-js`, js: `${cdn}core-js@3.8.0/index.min.js`, css: `` }, // module

]
