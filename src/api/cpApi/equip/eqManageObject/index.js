import { businessRequest } from "@/plugins/axios/index"
import { EQUIPMENT_URL } from "@/api/baseUrl"

/**
 * 分页查询管理对象列表
 * 
 * @param {*} param 
 * @returns 
 */
export function getTable(param) {
    return businessRequest({
        url: EQUIPMENT_URL() + `/eqManageObject/page`,
        method: 'post',
        data: param
    })
}

/**
  * 通过id查询管理对象
  * @param {*} id
  */
 export function queryById(id) {
    return businessRequest({
        method: 'get',
        url: EQUIPMENT_URL() + `/eqManageObject/queryById?id=${id}`
    })
}

/**
  * 保存管理对象
  * @param {*} id
  */
export function saveOrUpdate(formData) {
    return businessRequest({
      url: EQUIPMENT_URL() + '/eqManageObject/saveOrUpdate',
      method: 'post',
      data: formData
    })
  }

/**
 * 通过id批量删除管理对象
 * @param {*} ids 
 */
export function deleteByIds(ids) {
    return businessRequest({
        url: EQUIPMENT_URL() + '/eqManageObject/deleteByIds',
        method: 'post',
        data: ids
    });
}

/**
* 通过管理对象编码查询管理对象记录是否已存在
* @param {*} param 
*/
export function isExistsByManageObjNo(manageObjNo,oldManageObjNo,companyId,oldCompanyId) {
    return businessRequest({
      method: 'get',
      url: EQUIPMENT_URL() + `/eqManageObject/isExistsByManageObjNo`,
      params:{
        manageObjNo:manageObjNo,
        oldManageObjNo:oldManageObjNo,
        companyId:companyId,
        oldCompanyId:oldCompanyId
      }
    });
  }

/**
 * 获得顶级管理对象树
 */
 export function getTopTreeList(param) {
  return businessRequest({
      url: EQUIPMENT_URL() + `/eqManageObject/getTopTreeList?companyId=${param}`,
      method: 'get'
  })
}

/**
 * 根据管理对象ID查询下级管理对象
 */
export function getSubTreeList(id) {
  return businessRequest({
      method: 'get',
      url: EQUIPMENT_URL() + '/eqManageObject/getSubTreeList',
      params: {
      id: id
      }
  })
}  

/**
  * 是否存在可用的下级区域
  * @param {*} id
  */
 export function isExistsEnableSub(id) {
  return businessRequest({
      method: 'get',
      url: EQUIPMENT_URL() + `/eqManageObject/isExistsEnableSub?id=${id}`
  })
}