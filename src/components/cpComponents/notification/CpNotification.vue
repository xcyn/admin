<template>
  <transition name="fade" mode="out-in" appear>
      <div role="alert" class="el-notification right" style="bottom: 16px; z-index: 2004;" v-if="isShow">
        <i class="el-notification__icon el-icon-warning"></i>
        <div class="el-notification__group is-with-icon">
          <h2 class="el-notification__title">告警通知</h2>
          <div class="el-notification__content">
            <div style="padding-top: 10px; height: 90px;">
              <div class="msg" style="height: 55px;" >
                <el-link type="primary" @click="gogogo"> {{current.alarmEvent}}</el-link>
              </div>
              <el-button size="small" type="primary"  @click="prev" :disabled="prevFlg">上一条</el-button>
              <el-button size="small" type="primary"  @click="next" :disabled="nextFlg">下一条</el-button>
            </div>
          </div>
        </div>
        <div class="el-notification__closeBtn el-icon-close" @click="close"></div>
      </div>
  </transition>
</template>
<script>

import * as iotHttp from "@/api/cpApi/equipment/eqIotDevice/index";
import * as utils from "@/utils/cpUtils";


export default {
  props: {
  },

  data() {
    return {
      isShow: false,
      data:[],
      current:{},
      index:0,
      prevFlg:true,
      nextFlg:true
    }
  },
  created() {
    let time  = process.env.VUE_APP_IOT_ALARM_NOTIFICATION_TIME ? Number(process.env.VUE_APP_IOT_ALARM_NOTIFICATION_TIME) : 10000
    console.log("time",time,process.env.VUE_APP_IOT_ALARM_NOTIFICATION)
    if (process.env.VUE_APP_IOT_ALARM_NOTIFICATION === 'true'){
      let timer = setInterval(() => {
        //需要定时执行的代码
        this.open();
      },time)
    }
  },
  methods: {
    gogogo(){
      this.$router.push({ path: "/iot/myAlarmlist" })
    },
    close(){
      this.isShow =false
    },
    open(){
      if (!this.isShow){
        const curUserObj = utils.getLoginInfo(this)
        let userId = curUserObj['user'].id // 当前用户id
        iotHttp.getcurrentUserBizNewAlarms({userId:userId}).then(res =>{
          if (res.data && res.data.length>0){
            this.data =res.data
            this.current = res.data[0]
            this.index = 0
            this.isShow = true
            if (res.data.length > 1){
              this.nextFlg = false;
            }
            this.upDateBizAlarmsPushState()
          }
        })
      }
    },
    upDateBizAlarmsPushState(){
      let  msgIds =[]
      this.data.forEach(d =>{
        msgIds.push(d.workMsgId)
      })
      iotHttp.upDateBizAlarmsPushState(msgIds).then(res=>{
        this.upDateBizAlarmsReadState(this.current)
      })
    },
    upDateBizAlarmsReadState(){
        iotHttp.upDateBizAlarmsReadState([this.current.workMsgId])
    },
    prev(){
      this.index  = this.index  - 1
      this.nextFlg = false;
      this.current = this.data[this.index]
      this.prevFlg = false;
      if (this.index === 0){
        this.prevFlg = true;
      }
      this.upDateBizAlarmsReadState(this.current)


    },
    next(){
      this.prevFlg = false;
      this.index  = this.index  + 1
      this.current = this.data[this.index]
      this.nextFlg = false;
      if (this.index === this.data.length -1){
        this.nextFlg =true
      }
      this.upDateBizAlarmsReadState(this.current)


    }
  }
}
</script>
