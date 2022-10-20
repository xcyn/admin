import { businessRequest } from "@/plugins/axios/index"
import { EQUIPMENT_URL } from "@/api/baseUrl"

/**
 * 分页查询管理对象类型列表
 * 
 * @param {*} param 
 * @returns 
 */
export function getTable(param) {
    return businessRequest({
        url: EQUIPMENT_URL() + `/eqMobjectType/page`,
        method: 'post',
        data: param
    })
}

/**
 * 查询管理对象类型列表
 * 
 * @param {*} param 
 * @returns 
 */
 export function getList(param) {
  return businessRequest({
      url: EQUIPMENT_URL() + `/eqMobjectType/list`,
      method: 'post',
      data: param
  })
}

/**
  * 通过id查询管理对象类型
  * @param {*} id
  */
 export function queryById(id) {
    return businessRequest({
        method: 'get',
        url: EQUIPMENT_URL() + `/eqMobjectType/queryById?id=${id}`
    })
}

/**
  * 保存管理对象类型
  * @param {*} id
  */
export function saveOrUpdate(formData) {
    return businessRequest({
      url: EQUIPMENT_URL() + '/eqMobjectType/saveOrUpdate',
      method: 'post',
      data: formData
    })
  }

/**
 * 通过id批量删除管理对象类型
 * @param {*} ids 
 */
export function deleteByIds(ids) {
    return businessRequest({
        url: EQUIPMENT_URL() + '/eqMobjectType/deleteByIds',
        method: 'post',
        data: ids
    });
}

/**
* 通过管理对象类型编码查询管理对象类型记录是否已存在
* @param {*} param 
*/
export function isExistsByMobjectTypeNo(mobjectTypeNo,oldMobjectTypeNo,companyId,oldCompanyId) {
    return businessRequest({
      method: 'get',
      url: EQUIPMENT_URL() + `/eqMobjectType/isExistsByMobjectTypeNo`,
      params:{
        mobjectTypeNo:mobjectTypeNo,
        oldMobjectTypeNo:oldMobjectTypeNo,
        companyId:companyId,
        oldCompanyId:oldCompanyId
      }
    });
  }