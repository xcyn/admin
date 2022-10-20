import { AMAP_KEY } from '@/constant'
import VueAMap from 'vue-amap'

export default {
  install(Vue, options) {
    VueAMap.initAMapApiLoader({
      // 高德key
      key: AMAP_KEY, // 自己到官网申请
      // 插件集合 （插件按需引入）
      plugin: ['AMap.Geolocation', 'AMap.Geocoder', 'AMap.CitySearch', 'AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor', 'AMap.MarkerClusterer'],
      v: '1.4.15', // 高德 sdk 版本，默认为 1.4.4
      uiVersion: '1.0.11' //
    })
    Vue.use(VueAMap)
  }
}
