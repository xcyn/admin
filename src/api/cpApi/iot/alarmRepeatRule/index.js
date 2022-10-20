import { businessRequest } from '@/plugin/axios/index'
import {EQUIPMENT_URL} from "@/api/baseUrl"

/**
 * 分页查询重复告警规则列表
 */
export function getTable(param) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/iotAlarmRepeatRule/page',
    method: 'post',
    data: param
  })
}

/**
 * 获得重复告警规则列表
 */
 export function getList(param) {
    return businessRequest({
      url: EQUIPMENT_URL() + '/iotAlarmRepeatRule/getList',
      method: 'post',
      data: param
    })
  }
  
/**
  * 通过id查询重复告警规则
  * @param {*} param
  */
export function queryById(param) {
  return businessRequest({
    method: 'get',
    url: EQUIPMENT_URL() + `/iotAlarmRepeatRule/queryById?id=${param}`
  })
}

/**
* 保存重复告警规则
* @param {*} formData 
*/
export function saveAlarmRepeatRule(formData) {
  return businessRequest({
    method: 'post',
    url: EQUIPMENT_URL() + '/iotAlarmRepeatRule/saveAlarmRepeatRule',
    data: formData
  })
}

  /**
  * 通过id批量重复告警规则
  * @param {*} ids 
  */
   export function deleteByIds(ids) {
    return businessRequest({
      url: EQUIPMENT_URL() + '/iotAlarmRepeatRule/deleteByIds',
      method: 'post',
      data: ids
    });
}