<template>
  <el-amap
    ref="map"
    :vid="'amapDemo'"
    :center="center"
    :zoom="zoom"
    :plugin="plugin"
    class="amap-demo"
    style="height: 675px "
  >
    <el-amap-marker v-for="u in markers" :key="u.key" :position="u.position" />
    <el-amap-circle
      v-for="(c,i) in circles"
      :key="i"
      :center="c.center"
      :radius="c.radius"
      :fill-color="c.fillColor"
      :fill-opacity="0.3"
      bubble
      :stroke-color="c.strokeColor"
      :stroke-weight="c.strokeWeight"
      :events="events"
    />
  </el-amap>
</template>
<script>
export default {
  data() {
    return {
      center: [23.162473, 113.435961],
      zoom: 12,
      position: [23.162473, 113.435961],
      events: {
        click: e => {
          const lnglat = e.lnglat
          if (lnglat) {
            // const distance = window.AMap.GeometryUtil.distance(e.lnglat, this.position)
            // console.error(distance)
            // console.error(lnglat)
            const marker = {
              key: lnglat.lng + lnglat.lat,
              position: [lnglat.lng, lnglat.lat]
            }
            if (this.markers.length > 0) {
              this.markers.splice(0, 1, marker)
            } else {
              this.markers.push(marker)
            }
            const geocoder = new window.AMap.Geocoder({
              city: '全国' // 默认：“全国”
            })
            geocoder.getAddress(lnglat, (status, result) => {
              this.$emit('click', status, result)
              this.$emit('cascade-data', {
                name: result.regeocode.formattedAddress
              })
            })
          }
        }
      },
      markers: [],
      circles: [],
      // 使用其他组件
      plugin: [
        {
          enableHighAccuracy: true, // 是否使用高精度定位，默认:true
          timeout: 100, // 超过10秒后停止定位，默认：无穷大
          maximumAge: 0, // 定位结果缓存0毫秒，默认：0
          convert: true, // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
          showButton: true, // 显示定位按钮，默认：true
          buttonPosition: 'RB', // 定位按钮停靠位置，默认：'LB'，左下角
          showMarker: true, // 定位成功后在定位到的位置显示点标记，默认：true
          showCircle: true, // 定位成功后用圆圈表示定位精度范围，默认：true
          panToLocation: true, // 定位成功后将定位到的位置作为地图中心点，默认：true
          zoomToAccuracy: true, // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：f
          extensions: 'all',
          pName: 'Geolocation',
          events: {
            init: o => {
              // o 是高德地图定位插件实例
              o.getCurrentPosition((status, result) => {
                console.error(result)
                if (result && result.position) {
                  const position = [result.position.lng, result.position.lat]
                  this.center = position
                  this.position = position
                  //   this.loaded = true
                  //   this.$nextTick()

                  this.circles.push({
                    center: position, // 圆心位置
                    radius: 500, // 圆半径
                    fillColor: 'rgba(255, 255,255, 0.5)', // 圆形填充颜色
                    strokeColor: '#409eff', // 描边颜色
                    strokeWeight: 2 // 描边宽度
                  })
                }
              })
            }
          }
        }

      ]
    }
  }
}
</script>
