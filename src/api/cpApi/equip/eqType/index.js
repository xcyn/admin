import { businessRequest } from "@/plugins/axios/index"
import { EQUIPMENT_URL } from "@/api/baseUrl"

/**
 * 分页查询设备类型列表
 * 
 * @param {*} param 
 * @returns 
 */
export function getTable(param) {
    return businessRequest({
        url: EQUIPMENT_URL() + `/eqType/page`,
        method: 'post',
        data: param
    })
}

/**
  * 通过id查询设备类型
  * @param {*} id
  */
 export function queryById(id) {
    return businessRequest({
        method: 'get',
        url: EQUIPMENT_URL() + `/eqType/queryById?id=${id}`
    })
}

// 添加
export function add(param) {
    return businessRequest({
      method: 'post',
      url: EQUIPMENT_URL() + '/eqType/add',
      data: param
    });
  }
  
  // 修改
  export function edit(param) {
    return businessRequest({
      method: 'post',
      url: EQUIPMENT_URL() + '/eqType/edit',
      data: param
    });
  }
  

/**
 * 通过id批量删除设备类型
 * @param {*} ids 
 */
export function deleteByIds(ids) {
    return businessRequest({
        url: EQUIPMENT_URL() + '/eqType/deleteByIds',
        method: 'post',
        data: ids
    });
}

/**
 * 获得顶级设备类型树
 */
export function getTopTreeList(param) {
    return businessRequest({
        url: EQUIPMENT_URL() + `/eqType/getTopTreeList?companyId=${param}`,
        method: 'get'
    })
}
  
  /**
   * 根据区域ID查询下级设备类型
   */
export function getSubTreeList(id) {
    return businessRequest({
        method: 'get',
        url: EQUIPMENT_URL() + '/eqType/getSubTreeList',
        params: {
        id: id
        }
    })
}

/**
* 通过设备类型查询设备类型记录是否已存在
* @param {*} param 
*/
export function isExistsByEqTypeNo(eqTypeNo,oldEqTypeNo,companyId,oldCompanyId) {
  return businessRequest({
    method: 'get',
    url: EQUIPMENT_URL() + `/eqType/isExistsByEqTypeNo`,
    params:{
      eqTypeNo:eqTypeNo,
      oldEqTypeNo:oldEqTypeNo,
      companyId:companyId,
      oldCompanyId:oldCompanyId
    }
  });
}

/**
  * 根据设备类型id获得设备类型扩展属性列表
  * @param {*} eqTypeId
  */
 export function findEqTypeExtendById(eqTypeId) {
  return businessRequest({
      method: 'get',
      url: EQUIPMENT_URL() + `/eqType/findEqTypeExtendById?eqTypeId=${eqTypeId}`
  })
}

/**
  * 根据设备类型id获得设备类型技术参数列表
  * @param {*} eqTypeId
  */
 export function findEqTypeParmById(eqTypeId) {
  return businessRequest({
      method: 'get',
      url: EQUIPMENT_URL() + `/eqType/findEqTypeParmById?eqTypeId=${eqTypeId}`
  })
}

/**
  * 是否存在可用的下级设备类型
  * @param {*} id
  */
 export function isExistsEnableSub(id) {
  return businessRequest({
      method: 'get',
      url: EQUIPMENT_URL() + `/eqType/isExistsEnableSub?id=${id}`
  })
}