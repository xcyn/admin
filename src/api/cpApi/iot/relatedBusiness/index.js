import { businessRequest } from '@/plugin/axios/index'
import {EQUIPMENT_URL} from "@/api/baseUrl"

/**
 * 分页查询iot系统与业务关联配置信息
 */
export function getTable(param) {
    return businessRequest({
      url: EQUIPMENT_URL() + '/iotRelatedBusiness/page',
      method: 'post',
      data: param
    })
  }

/**
* 保存iot系统与业务关联配置信息
* @param {*} formData 
*/
export function saveRelatedBusiness(formData) {
  return businessRequest({
    method: 'post',
    url: EQUIPMENT_URL() + '/iotRelatedBusiness/saveRelatedBusiness',
    data: formData
  })
}
  
  /**
  * 通过id查询iot系统与业务关联配置信息
  * @param {*} param 
  */
  export function queryById(param) {
  return businessRequest({
    method: 'get',
    url: EQUIPMENT_URL() + `/iotRelatedBusiness/queryById?id=${param}`
  });
  }
  
  /**
  * 通过id批量删除iot系统与业务关联配置信息
  * @param {*} ids 
  */
  export function deleteByIds(ids) {
    return businessRequest({
      url: EQUIPMENT_URL() + '/iotRelatedBusiness/deleteByIds',
      method: 'post',
      data: ids
    });
}
 