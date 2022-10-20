import { businessRequest } from '@/plugin/axios/index'
import {EQUIPMENT_URL} from "@/api/baseUrl"

/**
 * 分页列表数据
 */
export function getTable(param) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/iotEventSub/page',
    method: 'post',
    data: param
  })
}

/**
* 通过id查询事件订阅信息
* @param {*} param 
*/
  export function queryById(param) {
  return businessRequest({
    method: 'get',
    url: EQUIPMENT_URL() + `/iotEventSub/queryById?id=${param}`
  });
} 

/**
* 保存海康订阅事件
* @param {*} formData 
*/
export function eventSubByTypes(formData) {
  return businessRequest({
    method: 'post',
    url: EQUIPMENT_URL() + '/iotEventSub/eventSubByTypes',
    data: formData
  })
}
  
  /**
  * 取消海康订阅事件
  * @param {*} param 
  */
  export function cancelEventSubByType(param) {
  return businessRequest({
    method: 'get',
    url: EQUIPMENT_URL() + `/iotEventSub/cancelEventSubByType?id=${param}`
  });
}