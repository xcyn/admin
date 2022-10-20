import { businessRequest } from '@/plugin/axios/index'
import {EQUIPMENT_URL} from "@/api/baseUrl"

/**
 * 分页查询车辆列表
 */
export function getTable(param) {
  return businessRequest({
    url: EQUIPMENT_URL() +'/iotCar/page',
    method: 'post',
    data: param
  })
}

/**
 * 同步车辆信息
 */
 export function synchrIotCar(systemConfigId) {
  return businessRequest({
    method: 'get',
    url: EQUIPMENT_URL() +`/iotCar/synchrIotCar?systemConfigId=${systemConfigId}`
  })
}

/**
* 保存车辆
* @param {*} formData
*/
export function saveCar(formData) {
  return businessRequest({
    method: 'post',
    url: EQUIPMENT_URL() + '/iotCar/saveCar',
    data: formData
  })
}
 
/**
 * 批量删除车辆
 */
 export function batchDeleteIotCar(ids) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/iotCar/batchDeleteIotCar',
    method: 'post',
    data: ids
  });
}

/**
* 删除车辆
* @param {*} param 
*/
export function deleteIotCar(id) {
    return businessRequest({
      method: 'get',
      url: EQUIPMENT_URL() + `/iotCar/deleteIotCar?id=${id}`
    });
}

/**
* 更新车辆为黑名单或普通车辆
* @param {*} param 
*/
export function updateCarListType(para) {
    return businessRequest({
      method: 'post',
      url: EQUIPMENT_URL() + `/iotCar/updateCarListType`,
      data: para
    });
}

/**
 * 部门树查询
 * @param {*} param 
 */
 export function treeDepartment(systemConfigId,parentId) {
     return businessRequest({
       method: 'get',
       url: EQUIPMENT_URL() + `/iotCar/treeDepartment?systemConfigId=${systemConfigId}&parentId=${parentId}`
     });
 }

/**
* 通过id查询车辆
* @param {*} param 
*/
export function queryById(id) {
  return businessRequest({
    method: 'get',
    url: EQUIPMENT_URL() + `/iotCar/queryById?id=${id}`
  });
  } 

/**
 * 查询场区
 * @param {*} param 
 */
 export function queryParkinglot(systemConfigId) {
  return businessRequest({
    method: 'get',
    url: EQUIPMENT_URL() + `/iotCar/queryParkinglot?systemConfigId=${systemConfigId}`
  });
}

/**
 * 分页查询交通卡口的违章信息记录
 */
 export function getPeccancys(param) {
    return businessRequest({
      url: EQUIPMENT_URL() +'/iotCar/getPeccancys',
      method: 'post',
      data: param
    })
  }