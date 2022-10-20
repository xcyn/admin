import { businessRequest } from '@/plugin/axios/index'
import {EQUIPMENT_URL} from "@/api/baseUrl"

/**
 * 分页查询访客信息列表
 */
export function getTable(param) {
    return businessRequest({
      url: EQUIPMENT_URL() + '/iotVisitorAppointment/page',
      method: 'post',
      data: param
    })
}

/**
 * 同步访客信息
 */
export function synchrVisitorData(systemConfigId) {
return businessRequest({
    method: 'get',
    url: EQUIPMENT_URL() + `/iotVisitorAppointment/synchrVisitorData?systemConfigId=${systemConfigId}`
})
}

/**
 * 通过id查询访客信息
 * @param {*} param
 */
export function queryById(id) {
    return businessRequest({
        method: 'get',
        url: EQUIPMENT_URL() + `/iotVisitorAppointment/queryById?id=${id}`
    });
}

/**
 * 访客信息审批
 * @param {*} param
 */
 export function visitorApprove(id,vStatus,approvePerson,vVisitorType,areaId,areaName) {
    return businessRequest({
        method: 'get',
        url: EQUIPMENT_URL() + `/iotVisitorAppointment/visitorApprove?id=${id}&vStatus=${vStatus}&approvePerson=${approvePerson}&vVisitorType=${vVisitorType}&areaId=${areaId}&areaName=${areaName}`
    });
}

/**
 * 统计访客进出动态
 * @param {*} param
 */
export function visitorInOrOutCount() {
  return businessRequest({
    method: 'get',
    url: EQUIPMENT_URL() + `/iotDoorInOut/visitorInOrOutCount`
  });
}

/**
 * 获得访客预约信息详细，包含随行人员
 */
 export function getReviewInfoByVisitorId(systemConfigId,vId) {
  return businessRequest({
      method: 'get',
      url: EQUIPMENT_URL() + `/iotVisitorAppointment/getReviewInfoByVisitorId?systemConfigId=${systemConfigId}&vId=${vId}`
  })
}

/**
 * 查询访客区域
 */
export function queryVisitorArea(systemConfigId) {
    return businessRequest({
        method: 'get',
        url: EQUIPMENT_URL() + `/iotVisitorAppointment/queryVisitorArea?systemConfigId=${systemConfigId}`
    })
}  