import { businessRequest } from "@/plugins/axios/index"
import { EQUIPMENT_URL,ORG_URL } from "@/api/baseUrl"
import request from '@/utils/request'
/**
 * 分页查询设备异动列表
 * 
 * @param {*} param 
 * @returns 
 */
export function getTable(param) {
    return businessRequest({
        url: EQUIPMENT_URL() + `/eqTransaction/page`,
        method: 'post',
        data: param
    })
}

/**
  * 通过id查询设备异动
  * @param {*} id
  */
 export function queryById(id) {
    return businessRequest({
        method: 'get',
        url: EQUIPMENT_URL() + `/eqTransaction/queryById?id=${id}`
    })
}
// 保存设备异动
export function saveOrUpdate(param) {
  return businessRequest({
    method: 'post',
    url: EQUIPMENT_URL() + '/eqTransaction/saveOrUpdate',
    data: param
  });
}

/**
* 通过id批量删除设备类型
* @param {*} ids 
*/
export function deleteByIds(ids) {
  return businessRequest({
      url: EQUIPMENT_URL() + '/eqTransaction/deleteByIds',
      method: 'post',
      data: ids
  });
}

/**
* 通过设备异动编码查询设备异动记录是否已存在
* @param {*} param 
*/
export function isExistsByTransactionNo(transactionNo,oldTransactionNo,companyId,oldCompanyId) {
    return businessRequest({
      method: 'get',
      url: EQUIPMENT_URL() + `/eqTransaction/isExistsByTransactionNo`,
      params:{
        transactionNo:transactionNo,
        oldTransactionNo:oldTransactionNo,
        companyId:companyId,
        oldCompanyId:oldCompanyId
      }
    });
  }

  /**
 * 根据用户Id和类型查询数据
 * @param {*} params
 */
export function findByUserIdPartyType(userId,partyType) {
  return request({
    method: 'get',
    url: ORG_URL() + `/entity/findByUserIdPartyType?userId=${userId}&partyType=${partyType}`
})
}