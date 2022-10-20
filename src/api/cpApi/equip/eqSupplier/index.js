import { businessRequest } from "@/plugins/axios/index"
import { EQUIPMENT_URL } from "@/api/baseUrl"

/**
 * 分页查询设备供应商列表
 * 
 * @param {*} param 
 * @returns 
 */
export function getTable(param) {
    return businessRequest({
        url: EQUIPMENT_URL() + `/eqSupplier/page`,
        method: 'post',
        data: param
    })
}

/**
  * 通过id查询设备供应商
  * @param {*} id
  */
 export function queryById(id) {
    return businessRequest({
        method: 'get',
        url: EQUIPMENT_URL() + `/eqSupplier/queryById?id=${id}`
    })
}

/**
  * 保存设备供应商
  * @param {*} id
  */
export function saveOrUpdate(formData) {
    return businessRequest({
      url: EQUIPMENT_URL() + '/eqSupplier/saveOrUpdate',
      method: 'post',
      data: formData
    })
  }

/**
 * 通过id批量删除设备供应商
 * @param {*} ids 
 */
export function deleteByIds(ids) {
    return businessRequest({
        url: EQUIPMENT_URL() + '/eqSupplier/deleteByIds',
        method: 'post',
        data: ids
    });
}

/**
* 通过设备供应商编码查询设备供应商记录是否已存在
* @param {*} param 
*/
export function isExistsBySupplierNo(supplierNo,oldSupplierNo,companyId,oldCompanyId) {
    return businessRequest({
      method: 'get',
      url: EQUIPMENT_URL() + `/eqSupplier/isExistsBySupplierNo`,
      params:{
        supplierNo:supplierNo,
        oldSupplierNo:oldSupplierNo,
        companyId:companyId,
        oldCompanyId:oldCompanyId
      }
    });
  }