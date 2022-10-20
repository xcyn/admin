import { businessRequest } from "@/plugins/axios/index"
import { EQUIPMENT_URL } from "@/api/baseUrl"

/**
 * 分页查询区域编码列表
 * 
 * @param {*} param 
 * @returns 
 */
export function getTable(param) {
    return businessRequest({
        url: EQUIPMENT_URL() + `/eqArea/page`,
        method: 'post',
        data: param
    })
}

/**
  * 通过id查询区域编码
  * @param {*} id
  */
 export function queryById(id) {
    return businessRequest({
        method: 'get',
        url: EQUIPMENT_URL() + `/eqArea/queryById?id=${id}`
    })
}

/**
  * 保存区域编码
  * @param {*} id
  */
export function saveOrUpdate(formData) {
    return businessRequest({
      url: EQUIPMENT_URL() + '/eqArea/saveOrUpdate',
      method: 'post',
      data: formData
    })
  }

/**
 * 通过id批量删除区域编码
 * @param {*} ids 
 */
export function deleteByIds(ids) {
    return businessRequest({
        url: EQUIPMENT_URL() + '/eqArea/deleteByIds',
        method: 'post',
        data: ids
    });
}

/**
 * 获得顶级区域树
 */
export function getTopTreeList(param) {
    return businessRequest({
        url: EQUIPMENT_URL() + `/eqArea/getTopTreeList?companyId=${param}`,
        method: 'get'
    })
}
  
  /**
   * 根据区域ID查询下级区域
   */
export function getSubTreeList(id) {
    return businessRequest({
        method: 'get',
        url: EQUIPMENT_URL() + '/eqArea/getSubTreeList',
        params: {
        id: id
        }
    })
}

/**
* 通过区域编码查询区域编码记录是否已存在
* @param {*} param 
*/
export function isExistsByAreaNo(areaNo,oldAreaNo,companyId,oldCompanyId) {
    return businessRequest({
      method: 'get',
      url: EQUIPMENT_URL() + `/eqArea/isExistsByAreaNo`,
      params:{
        areaNo:areaNo,
        oldAreaNo:oldAreaNo,
        companyId:companyId,
        oldCompanyId:oldCompanyId
      }
    });
  }
  
/**
  * 是否存在可用的下级区域
  * @param {*} id
  */
 export function isExistsEnableSub(id) {
  return businessRequest({
      method: 'get',
      url: EQUIPMENT_URL() + `/eqArea/isExistsEnableSub?id=${id}`
  })
}
