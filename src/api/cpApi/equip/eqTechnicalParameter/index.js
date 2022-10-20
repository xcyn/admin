import { businessRequest } from "@/plugins/axios/index"
import { EQUIPMENT_URL } from "@/api/baseUrl"

/**
 * 分页查询技术参数列表
 * 
 * @param {*} param 
 * @returns 
 */
export function getTable(param) {
    return businessRequest({
        url: EQUIPMENT_URL() + `/eqTechnicalParameter/page`,
        method: 'post',
        data: param
    })
}

/**
  * 通过id查询技术参数
  * @param {*} id
  */
 export function queryById(id) {
    return businessRequest({
        method: 'get',
        url: EQUIPMENT_URL() + `/eqTechnicalParameter/queryById?id=${id}`
    })
}

/**
  * 保存技术参数
  * @param {*} id
  */
export function saveOrUpdate(formData) {
    return businessRequest({
      url: EQUIPMENT_URL() + '/eqTechnicalParameter/saveOrUpdate',
      method: 'post',
      data: formData
    })
  }

/**
 * 通过id批量删除技术参数
 * @param {*} ids 
 */
export function deleteByIds(ids) {
    return businessRequest({
        url: EQUIPMENT_URL() + '/eqTechnicalParameter/deleteByIds',
        method: 'post',
        data: ids
    });
}

/**
* 通过技术参数编码查询技术参数记录是否已存在
* @param {*} param 
*/
export function isExistsByParmNo(parmNo,oldParmNo,companyId,oldCompanyId) {
    return businessRequest({
      method: 'get',
      url: EQUIPMENT_URL() + `/eqTechnicalParameter/isExistsByParmNo`,
      params:{
        parmNo:parmNo,
        oldParmNo:oldParmNo,
        companyId:companyId,
        oldCompanyId:oldCompanyId
      }
    });
  }

/**
 * 技术参数导入
 */
 export function importSync(param) {
    return businessRequest({
      url: EQUIPMENT_URL() + `/eqImport/importSync`,
      method: 'post',
      data: param
    })
  }

  /**
 * 技术参数导出
 */
export function exportExcel(param) {
    return businessRequest({
      url: EQUIPMENT_URL() + `/eqTechnicalParameter/exportExcel`,
      method: 'post',
      data: param
    })
  }