import { businessRequest } from "@/plugins/axios/index"
import { EQUIPMENT_URL } from "@/api/baseUrl"

/**
 * 分页查询设备资产列表
 * 
 * @param {*} param 
 * @returns 
 */
export function getTable(param) {
    return businessRequest({
        url: EQUIPMENT_URL() + `/eqAsset/page`,
        method: 'post',
        data: param
    })
}

/**
  * 通过id查询设备资产
  * @param {*} id
  */
 export function queryById(id) {
    return businessRequest({
        method: 'get',
        url: EQUIPMENT_URL() + `/eqAsset/queryById?id=${id}`
    })
}
// 添加
export function add(param) {
  return businessRequest({
    method: 'post',
    url: EQUIPMENT_URL() + '/eqAsset/add',
    data: param
  });
}

// 修改
export function edit(param) {
  return businessRequest({
    method: 'post',
    url: EQUIPMENT_URL() + '/eqAsset/edit',
    data: param
  });
}


/**
* 通过id批量删除设备类型
* @param {*} ids 
*/
export function deleteByIds(ids) {
  return businessRequest({
      url: EQUIPMENT_URL() + '/eqAsset/deleteByIds',
      method: 'post',
      data: ids
  });
}

/**
* 通过设备资产编码查询设备资产记录是否已存在
* @param {*} param 
*/
export function isExistsByAssetNo(assetNo,oldAssetNo,companyId,oldCompanyId) {
    return businessRequest({
      method: 'get',
      url: EQUIPMENT_URL() + `/eqAsset/isExistsByAssetNo`,
      params:{
        assetNo:assetNo,
        oldAssetNo:oldAssetNo,
        companyId:companyId,
        oldCompanyId:oldCompanyId
      }
    });
  }
