import { businessRequest } from "@/plugins/axios/index"
import { EQUIPMENT_URL } from "@/api/baseUrl"

/**
 * 分页查询设备生产商列表
 * 
 * @param {*} param 
 * @returns 
 */
export function getTable(param) {
    return businessRequest({
        url: EQUIPMENT_URL() + `/eqManufacturer/page`,
        method: 'post',
        data: param
    })
}

/**
  * 通过id查询设备生产商
  * @param {*} id
  */
 export function queryById(id) {
    return businessRequest({
        method: 'get',
        url: EQUIPMENT_URL() + `/eqManufacturer/queryById?id=${id}`
    })
}

/**
  * 保存设备生产商
  * @param {*} id
  */
export function saveOrUpdate(formData) {
    return businessRequest({
      url: EQUIPMENT_URL() + '/eqManufacturer/saveOrUpdate',
      method: 'post',
      data: formData
    })
  }

/**
 * 通过id批量删除设备生产商
 * @param {*} ids 
 */
export function deleteByIds(ids) {
    return businessRequest({
        url: EQUIPMENT_URL() + '/eqManufacturer/deleteByIds',
        method: 'post',
        data: ids
    });
}

/**
* 通过设备生产商编码查询设备生产商记录是否已存在
* @param {*} param 
*/
export function isExistsByEqManufacturerNo(eqManufacturerNo,oldEqManufacturerNo,companyId,oldCompanyId) {
    return businessRequest({
      method: 'get',
      url: EQUIPMENT_URL() + `/eqManufacturer/isExistsByEqManufacturerNo`,
      params:{
        eqManufacturerNo:eqManufacturerNo,
        oldEqManufacturerNo:oldEqManufacturerNo,
        companyId:companyId,
        oldCompanyId:oldCompanyId
      }
    });
  }