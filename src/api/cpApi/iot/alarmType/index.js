import { businessRequest } from '@/plugin/axios/index'
import {EQUIPMENT_URL} from "@/api/baseUrl"

/**
 * 分页查询报警类型列表
 */
export function getTable(param) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/iotAlarmType/page',
    method: 'post',
    data: param
  })
}

/**
 * 获得报警大类型列表
 */
 export function getAlarmCategoryList(param) {
    return businessRequest({
      url: EQUIPMENT_URL() + '/iotAlarmType/getAlarmCategoryList',
      method: 'post',
      data: param
    })
  }
  
/**
 * 获得报警类型列表
 */
 export function getAlarmTypeList(param) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/iotAlarmType/getAlarmTypeList',
    method: 'post',
    data: param
  })
}

/**
  * 通过id查询报警类型
  * @param {*} param
  */
export function queryById(param) {
  return businessRequest({
    method: 'get',
    url: EQUIPMENT_URL() + `/iotAlarmType/queryById?id=${param}`
  })
}

/**
* 保存报警类型
* @param {*} formData 
*/
export function saveAlarmType(formData) {
  return businessRequest({
    method: 'post',
    url: EQUIPMENT_URL() + '/iotAlarmType/saveAlarmType',
    data: formData
  })
}

  /**
  * 通过id批量删除报警类型
  * @param {*} ids 
  */
   export function deleteByIds(ids) {
    return businessRequest({
      url: EQUIPMENT_URL() + '/iotAlarmType/deleteByIds',
      method: 'post',
      data: ids
    });
}

/**
* 通过编码查询告警类型是否已存在
* @param {*} param 
*/
export function isExistsByAlarmTypeCode(alarmTypeCode,oldAlarmTypeCode,factoryType,oldFactoryType) {
    return businessRequest({
      method: 'get',
      url: EQUIPMENT_URL() + `/iotAlarmType/isExistsByAlarmTypeCode?alarmTypeCode=${alarmTypeCode}&oldAlarmTypeCode=${oldAlarmTypeCode}&factoryType=${factoryType}&oldFactoryType=${oldFactoryType}`
    });
  }
 
/**
* 批量更新iot告警分类
* @param {*} formData 
*/
export function updateAlarmTypeClassify(param) {
  return businessRequest({
    method: 'post',
    url: EQUIPMENT_URL() + '/iotAlarmType/updateAlarmTypeClassify',
    data: param
  })
}

/**
* 批量更新iot告警类型状态
* @param {*} formData 
*/
export function updateAlarmTypeStatus(param) {
  return businessRequest({
    method: 'post',
    url: EQUIPMENT_URL() + '/iotAlarmType/updateAlarmTypeStatus',
    data: param
  })
}
 
/**
 * 同步iot告警类型
 */
export function synchrAlarmType(systemConfigId) {
    return businessRequest({
      method: 'get',
      url: EQUIPMENT_URL() + `/iotAlarmType/synchrAlarmType?systemConfigId=${systemConfigId}`
    })
  }