import { businessRequest } from "@/plugins/axios/index"
import { EQUIPMENT_URL } from "@/api/baseUrl"

/**
 * 分页查询设备位置属性列表
 * 
 * @param {*} param 
 * @returns 
 */
export function getTable(param) {
    return businessRequest({
        url: EQUIPMENT_URL() + `/eqLocationAttr/page`,
        method: 'post',
        data: param
    })
}

/**
 * 查询设备位置属性列表
 * 
 * @param {*} param 
 * @returns 
 */
 export function getList(param) {
  return businessRequest({
      url: EQUIPMENT_URL() + `/eqLocationAttr/list`,
      method: 'post',
      data: param
  })
}

/**
  * 通过id查询设备位置属性
  * @param {*} id
  */
 export function queryById(id) {
    return businessRequest({
        method: 'get',
        url: EQUIPMENT_URL() + `/eqLocationAttr/queryById?id=${id}`
    })
}

/**
  * 保存设备位置属性
  * @param {*} id
  */
export function saveOrUpdate(formData) {
    return businessRequest({
      url: EQUIPMENT_URL() + '/eqLocationAttr/saveOrUpdate',
      method: 'post',
      data: formData
    })
  }

/**
 * 通过id批量删除设备位置属性
 * @param {*} ids 
 */
export function deleteByIds(ids) {
    return businessRequest({
        url: EQUIPMENT_URL() + '/eqLocationAttr/deleteByIds',
        method: 'post',
        data: ids
    });
}

/**
* 通过设备位置属性编码查询设备位置属性记录是否已存在
* @param {*} param 
*/
export function isExistsByLocationAttrNo(locationAttrNo,oldLocationAttrNo,companyId,oldCompanyId) {
    return businessRequest({
      method: 'get',
      url: EQUIPMENT_URL() + `/eqLocationAttr/isExistsByLocationAttrNo`,
      params:{
        locationAttrNo:locationAttrNo,
        oldLocationAttrNo:oldLocationAttrNo,
        companyId:companyId,
        oldCompanyId:oldCompanyId
      }
    });
  }