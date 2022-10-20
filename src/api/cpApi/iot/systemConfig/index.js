import { businessRequest } from '@/plugin/axios/index'
import {EQUIPMENT_URL} from "@/api/baseUrl"


/**
 * 查询iot系统配置信息列表
 */
 export function getList(param) {
    return businessRequest({
      url: EQUIPMENT_URL() + '/iotSystemConfig/list',
      method: 'post',
      data: param
    })
}

/**
 * 分页查询iot系统配置
 */
export function getTable(param) {
    return businessRequest({
      url: EQUIPMENT_URL() + '/iotSystemConfig/page',
      method: 'post',
      data: param
    })
}

/**
 * 通过id查询iot系统配置信息
 * @param {*} param 
 */
export function queryById(param) {
    return businessRequest({
        method: 'get',
        url: EQUIPMENT_URL() + `/iotSystemConfig/queryById?id=${param}`
    });
}

/**
* 保存iot系统配置信息
* @param {*} formData 
*/
export function saveSystemConfig(formData) {
  return businessRequest({
    method: 'post',
    url: EQUIPMENT_URL() + '/iotSystemConfig/saveSystemConfig',
    data: formData
  })
}
  
/**
 * 通过id批量删除iot系统配置信息
 * @param {*} ids 
 */
export function deleteByIds(ids) {
    return businessRequest({
        url: EQUIPMENT_URL() + '/iotSystemConfig/deleteByIds',
        method: 'post',
        data: ids
    });
}

/**
* 通过编码查询lot系统是否已存在
* @param {*} param 
*/
export function isExistsByLotSystem(systemCode,oldSystemCode,companyId,oldCompanyId) {
  return businessRequest({
    method: 'get',
    url: EQUIPMENT_URL() + `/iotSystemConfig/isExistsByLotSystem?systemCode=${systemCode}&oldSystemCode=${oldSystemCode}&companyId=${companyId}&oldCompanyId=${oldCompanyId}`
  })
}

/**
* 查询iot系统序号是否已存在
* @param {*} param 
*/
export function isExistsBySortNo(sortNo,oldSortNo,companyId,oldCompanyId) {
  return businessRequest({
    method: 'get',
    url: EQUIPMENT_URL() + `/iotSystemConfig/isExistsBySortNo?sortNo=${sortNo}&oldSortNo=${oldSortNo}&companyId=${companyId}&oldCompanyId=${oldCompanyId}`
  })
}

/**
* 获得iot海康视频系统配置记录
* @param {*} param 
*/
export function getIscSystemConfig(companyId) {
  return businessRequest({
    method: 'get',
    url: EQUIPMENT_URL() + `/iotSystemConfig/getIscSystemConfig?companyId=${companyId}`
  })
}
 