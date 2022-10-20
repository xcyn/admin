import { businessRequest } from '@/plugin/axios/index'
import {EQUIPMENT_URL} from "@/api/baseUrl"

/**
 * 分页查询告警信息
 */
export function getTable(param) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/iotAlarm/page',
    method: 'post',
    data: param
  })
}

/**
 * 忽略告警
 * @param {*} data
 * @returns
 */
export function ignoreAlarm(data) {
  return businessRequest({
    method: 'post',
    url: EQUIPMENT_URL() + '/iotAlarm/ignoreAlarm',
    data: data
  })
}

/**
 * 保存处理告警
 * @param {*} data
 * @returns
 */
 export function saveHandleAlarm(data) {
  return businessRequest({
    method: 'post',
    url: EQUIPMENT_URL() + '/iotAlarm/saveHandleAlarm',
    data: data
  })
}

/**
  * 更新告警等级
  * @param {*} param
  */
 export function updateAlarmLevel(id,alarmLevel) {
  return businessRequest({
    method: 'get',
    url: EQUIPMENT_URL() + `/iotAlarm/updateAlarmLevel?id=${id}&alarmLevel=${alarmLevel}`
  })
}

/**
  * 更新告警状态为忽略
  * @param {*} param
  */
 export function updateAlarmIgnore(id) {
  return businessRequest({
    method: 'get',
    url: EQUIPMENT_URL() + `/iotAlarm/updateAlarmIgnore?id=${id}`
  })
}

/**
 * 更新告警状态为忽略
 * @param {*} param
 */
export function alarmStaticIndex(id) {
  return businessRequest({
    method: 'get',
    url: EQUIPMENT_URL() + `/iotAlarm/alarmStaticIndex`
  })
}


/**
 * 根据告警编码获得告警图片集合
 * @param {*} param
 */
export function getAlarmPicture(alarmId) {
  return businessRequest({
    method: 'get',
    url: EQUIPMENT_URL() + `/iotAlarm/getAlarmPicture?alarmId=${alarmId}`
  })
}

/**
 * 根据ID获得视频报警事件详情
 * @param {*} param
 */
 export function getLinkageEventDataInfo(alarmId) {
  return businessRequest({
    method: 'get',
    url: EQUIPMENT_URL() + `/iotAlarm/getLinkageEventDataInfo?id=${alarmId}`
  })
}

/**
 * 保存第三方平台推送过来的告警信息
 * @param {*} param
 */
 export function receiveWarn() {
  return businessRequest({
    method: 'post',
    url: EQUIPMENT_URL() + `/iotAlarm/receiveWarn`,
    data: {
        "id":"111111111",
        "alarmTime":"2022-07-06 15:19:30",
        "alarmTypeCode": "RecognitionHelmet",
        "alarmTypeName": "未戴安全帽",
        "allImagesUrl": "https://img1.baidu.com/it/u=1016138010,1907110459&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500",
        "blackMemberName": "张三",
        "faceFeatureImgUrl": "https://img1.baidu.com/it/u=1016138010,1907110459&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500",
        "imageUrl": "https://img1.baidu.com/it/u=1016138010,1907110459&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500",
        "level": "important",
        "licensePlate": "苏A00255",
        "licensePlateColor": "白色",
        "licensePlateUrl": "https://img1.baidu.com/it/u=1016138010,1907110459&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500",
        "source": "1111111111111",
      "sourceName":"摄像头01",
        "vehicleSpeed": "60/ms"
    },
  })
}

/**
  * 获得通道编号今日告警记录
  * @param {*} param
  */
 export function getTodayAlarmListByChannelNo(systemConfigId,channelNo) {
  return businessRequest({
    method: 'get',
    url: EQUIPMENT_URL() + `/iotAlarm/getTodayAlarmListByChannelNo?systemConfigId=${systemConfigId}&channelNo=${channelNo}`
  })
}