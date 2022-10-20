<template>
  <ibps-container>
    <div style="height:calc(100% - 8px);margin-top:8px;">
      <iframe id="frameForm" ref="frameForm" :src="iframeSrc" class="ibps-container-frame" frameborder="0" style="width:100%; height:calc(100% - 10px); border: 1px solid #e6e6e6; border-top: none; box-sizing: border-box;" />
    </div>
  </ibps-container>
</template>
<script>

  export default {
    name: 'LocationDialog1',
    data () {
      return {
        ttIotInfoData:{
          videoPositions:'',
          videoNames:'',
          videoIds:'',
          videoCoordinateSystem:'',
          doorPositions:'',
          doorNames:'',
          doorIds:'',
          doorCoordinateSystem:'',
          electronicFencePositions:'',
          electronicFenceNames:'',
          electronicFenceIds:'',
          eFenceCoordinateSystem:'',
          workPosition:'',
          coordinateSystem:''
        },
        iframeSrc:process.env.VUE_APP_SANWEI_URL
      }
    },
    mounted() {
      this.$nextTick(() => {
        const that = this
        window.addEventListener('message', function(event) {
          that.handleData(event.data)
        })
      })
    },
    methods: {
      handleData(data){
        data = JSON.parse(data)
        if(data.data == null){
          return
        }
        if(data.data.length > 0){
          let iotData = data.data[0]
          if(iotData.cameraList.length > 0){
            iotData.cameraList.forEach(item =>{
              //摄像头位置
              let cameraLocation = (item.cameraLocation != '' && item.cameraLocation != null) ? item.cameraLocation : '无'
              if(this.ttIotInfoData.videoPositions != ''){
                this.ttIotInfoData.videoPositions = this.ttIotInfoData.videoPositions + ';' + cameraLocation
              }else{
                this.ttIotInfoData.videoPositions = cameraLocation
              }
              //摄像头名称
              let cameraName = (item.cameraName != '' && item.cameraName != null) ? item.cameraName : '无'
              if(this.ttIotInfoData.videoNames != ''){
                this.ttIotInfoData.videoNames = this.ttIotInfoData.videoNames + ',' + cameraName
              }else{
                this.ttIotInfoData.videoNames = cameraName
              }
              //摄像头编号
              let cameraNo = (item.cameraNo != '' && item.cameraNo != null) ? item.cameraNo : '无'
              if(this.ttIotInfoData.videoIds != ''){
                this.ttIotInfoData.videoIds = this.ttIotInfoData.videoIds + ',' + cameraNo
              }else{
                this.ttIotInfoData.videoIds = cameraNo
              }
              //摄像头坐标系
              let cameraCoordinateSystem = (item.cameraeCoordinateSystem != '' && item.cameraeCoordinateSystem != null) ? item.cameraeCoordinateSystem : '无'
              if(this.ttIotInfoData.videoCoordinateSystem != ''){
                this.ttIotInfoData.videoCoordinateSystem = this.ttIotInfoData.videoCoordinateSystem + ',' + cameraCoordinateSystem
              }else{
                this.ttIotInfoData.videoCoordinateSystem = cameraCoordinateSystem
              }
            })
          }
          if(iotData.doorList.length > 0){
            iotData.doorList.forEach(item =>{
              //门禁位置
              let doorLocation = (item.doorLocation != '' && item.doorLocation != null) ? item.doorLocation : '无'
              if(this.ttIotInfoData.doorPositions != ''){
                this.ttIotInfoData.doorPositions = this.ttIotInfoData.doorPositions + ';' + doorLocation
              }else{
                this.ttIotInfoData.doorPositions = doorLocation
              }
              //门禁名称
              let doorName = (item.doorName != '' && item.doorName != null) ? item.doorName : '无'
              if(this.ttIotInfoData.doorNames != ''){
                this.ttIotInfoData.doorNames = this.ttIotInfoData.doorNames + ',' + doorName
              }else{
                this.ttIotInfoData.doorNames = doorName
              }
              //门禁编号
              let doorNo = (item.doorNo != '' && item.doorNo != null) ? item.doorNo : '无'
              if(this.ttIotInfoData.doorIds != ''){
                this.ttIotInfoData.doorIds = this.ttIotInfoData.doorIds + ',' + doorNo
              }else{
                this.ttIotInfoData.doorIds = doorNo
              }
              //门禁坐标系
              let doorCoordinateSystem = (item.dooreCoordinateSystem != '' && item.dooreCoordinateSystem != null) ? item.dooreCoordinateSystem : '无'
              if(this.ttIotInfoData.doorCoordinateSystem != ''){
                this.ttIotInfoData.doorCoordinateSystem = this.ttIotInfoData.doorCoordinateSystem + ',' + doorCoordinateSystem
              }else{
                this.ttIotInfoData.doorCoordinateSystem = doorCoordinateSystem
              }
            })
          }
          if(iotData.eFenceList.length > 0){
            iotData.eFenceList.forEach(item =>{
              //电子围栏位置
              let eFenceLocation = (item.eFenceLocation != '' && item.eFenceLocation != null) ? item.eFenceLocation : '无'
              if(this.ttIotInfoData.electronicFencePositions != ''){
                this.ttIotInfoData.electronicFencePositions = this.ttIotInfoData.electronicFencePositions + ';' + eFenceLocation
              }else{
                this.ttIotInfoData.electronicFencePositions = eFenceLocation
              }
              //电子围栏名称
              let eFenceName = (item.eFenceName != '' && item.eFenceName != null) ? item.eFenceName : '无'
              if(this.ttIotInfoData.electronicFenceNames != ''){
                this.ttIotInfoData.electronicFenceNames = this.ttIotInfoData.electronicFenceNames + ',' + eFenceName
              }else{
                this.ttIotInfoData.electronicFenceNames = eFenceName
              }
              //电子围栏编号
              let eFenceNo = (item.eFenceNo != '' && item.eFenceNo != null) ? item.eFenceNo : '无'
              if(this.ttIotInfoData.electronicFenceIds != ''){
                this.ttIotInfoData.electronicFenceIds = this.ttIotInfoData.electronicFenceIds + ',' + eFenceNo
              }else{
                this.ttIotInfoData.electronicFenceIds = eFenceNo
              }
              //电子围栏坐标系
              let eFenceCoordinateSystem = (item.eFenceCoordinateSystem != '' && item.eFenceCoordinateSystem != null) ? item.eFenceCoordinateSystem : '无'
              if(this.ttIotInfoData.eFenceCoordinateSystem != ''){
                this.ttIotInfoData.eFenceCoordinateSystem = this.ttIotInfoData.eFenceCoordinateSystem + ',' + eFenceCoordinateSystem
              }else{
                this.ttIotInfoData.eFenceCoordinateSystem = eFenceCoordinateSystem
              }
            })
          }
          if(iotData.ttlocation != '' && iotData.ttlocation != null){
            this.ttIotInfoData.workPosition = iotData.ttlocation.x + ',' + iotData.ttlocation.y + ',' + iotData.ttlocation.z
          }

          this.ttIotInfoData.coordinateSystem = iotData.coordinateSystem
          this.$emit("onSanWeiOk", this.ttIotInfoData)
        }
      }
    }
  }
</script>

