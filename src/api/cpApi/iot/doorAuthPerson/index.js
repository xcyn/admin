import { businessRequest } from '@/plugin/axios/index'
import {EQUIPMENT_URL} from "@/api/baseUrl"

/**
 * 分页查询门禁授权人员列表
 */
 export function getTable(param) {
    return businessRequest({
      url: EQUIPMENT_URL() + '/iotDoorAuthPerson/page',
      method: 'post',
      data: param
    })
  }

/**
 * 保存门禁授权人员信息
 */
 export function saveDoorPerson(param) {
    return businessRequest({
      url: EQUIPMENT_URL() + '/iotDoorAuthPerson/saveDoorPerson',
      method: 'post',
      data: param
    })
  }

/**
 * 保存人员门禁授权信息
 */
 export function savePersonDoor(param) {
    return businessRequest({
      url: EQUIPMENT_URL() + '/iotDoorAuthPerson/savePersonDoor',
      method: 'post',
      data: param
    })
}  

/**
* 通过id删除门禁授权人员权限
* @param {*} param
*/
export function deleteDoorAuthority(id) {
    return businessRequest({
      method: 'get',
      url: EQUIPMENT_URL() + `/iotDoorAuthPerson/deleteDoorAuthority?id=${id}`
    });
}

/**
* 通过id更新禁授权人员权限
* @param {*} param
*/
export function updateDoorAuthority(id) {
    return businessRequest({
      method: 'get',
      url: EQUIPMENT_URL() + `/iotDoorAuthPerson/updateDoorAuthority?id=${id}`
    });
}    

/**
* 判断门禁权限时间是否与之前的门禁权限时间重复或重叠
* @param {*} ids 
*/
export function isExistsByDoorAuthTime(doorAuthPersonArray) {
    return businessRequest({
      url: EQUIPMENT_URL() + `/iotDoorAuthPerson/isExistsByDoorAuthTime`,
      method: 'post',
      data: doorAuthPersonArray
    });
}

/**
* 通过id删除门禁授权人员记录
* @param {*} param
*/
export function deleteDoorAuthPerson(id) {
  return businessRequest({
    method: 'get',
    url: EQUIPMENT_URL() + `/iotDoorAuthPerson/deleteDoorAuthPerson?id=${id}`
  });
}