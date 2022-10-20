import { businessRequest } from '@/plugin/axios/index'
import {EQUIPMENT_URL} from "@/api/baseUrl"


/**
 * 分页列表数据
 */
export function getTable(param) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/iotDoorAuth/page',
    method: 'post',
    data: param
  })
}

/**
* 通过id查询康综合安防管理平台门禁授权记录
* @param {*} param
*/
  export function queryById(param) {
  return businessRequest({
    method: 'get',
    url: EQUIPMENT_URL() + `/iotDoorAuth/queryById?id=${param}`
  });
  }

/**
* 保存康综合安防管理平台门禁授权记录
* @param {*} formData
*/
export function saveDoorAuth(formData) {
    return businessRequest({
      method: 'post',
      url: EQUIPMENT_URL() + '/iotDoorAuth/saveDoorAuth',
      data: formData
    })
  }

/**
* 批量删除门禁授权
* @param {*} ids
*/
export function deleteDoorAuth(ids) {
  return businessRequest({
    url: EQUIPMENT_URL() + `/iotDoorAuth/deleteDoorAuth`,
    method: 'post',
    data: ids
  });
  }

/**
 * 批量保存门禁授权记录
 */
export function saveDoorAuthList(formData) {
  return businessRequest({
    method: 'post',
    url: EQUIPMENT_URL() + '/iotDoorAuth/saveDoorAuthList',
    data: formData
  })
}

/**
* 批量删除门禁人员授权信息
* @param {*} ids 
*/
export function deleteCard(ids) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/iotDoorAuth/deleteCard',
    method: 'post',
    data: ids
  });
}
