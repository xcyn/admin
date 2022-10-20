import { businessRequest } from '@/plugin/axios/index'
import {EQUIPMENT_URL} from "@/api/baseUrl"


/**
 * 分页查询告警通知配置信息
 */
export function getTable(param) {
    return businessRequest({
      url: EQUIPMENT_URL() + '/iotAlarmPushConfig/page',
      method: 'post',
      data: param
    })
  }

/**
* 保存告警通知配置信息
* @param {*} formData 
*/
export function saveImAlarmPushConfig(formData) {
  return businessRequest({
    method: 'post',
    url: EQUIPMENT_URL() + '/iotAlarmPushConfig/saveImAlarmPushConfig',
    data: formData
  })
}
  
  /**
  * 通过id查询告警通知配置信息
  * @param {*} param 
  */
  export function queryById(param) {
  return businessRequest({
    method: 'get',
    url: EQUIPMENT_URL() + `/iotAlarmPushConfig/queryById?id=${param}`
  });
  }
  
  /**
  * 通过id批量删除告警通知配置信息
  * @param {*} ids 
  */
  export function deleteByIds(ids) {
    return businessRequest({
      url: EQUIPMENT_URL() + '/iotAlarmPushConfig/deleteByIds',
      method: 'post',
      data: ids
    });
}

/**
* 通过编码查询lot系统是否已存在
* @param {*} param 
*/
export function isExistsByLotSystem(iotSystemNo,oldIotSystemNo) {
  return businessRequest({
    method: 'get',
    url: EQUIPMENT_URL() + `/iotAlarmPushConfig/isExistsByLotSystem?iotSystemNo=${iotSystemNo}&oldIotSystemNo=${oldIotSystemNo}`
  })
}