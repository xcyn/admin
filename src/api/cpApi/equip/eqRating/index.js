import { businessRequest } from "@/plugins/axios/index"
import { EQUIPMENT_URL } from "@/api/baseUrl"

/**
 * 分页查询设备评级列表
 * 
 * @param {*} param 
 * @returns 
 */
export function getTable(param) {
    return businessRequest({
        url: EQUIPMENT_URL() + `/eqRating/page`,
        method: 'post',
        data: param
    })
}

/**
  * 通过id查询设备评级
  * @param {*} id
  */
 export function queryById(id) {
    return businessRequest({
        method: 'get',
        url: EQUIPMENT_URL() + `/eqRating/queryById?id=${id}`
    })
}

/**
  * 保存设备评级
  * @param {*} id
  */
export function saveOrUpdate(formData) {
    return businessRequest({
      url: EQUIPMENT_URL() + '/eqRating/saveOrUpdate',
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
        url: EQUIPMENT_URL() + '/eqRating/deleteByIds',
        method: 'post',
        data: ids
    });
}
