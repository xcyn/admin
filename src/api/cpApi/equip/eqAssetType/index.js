import { businessRequest } from "@/plugins/axios/index"
import { EQUIPMENT_URL } from "@/api/baseUrl"

/**
 * 分页查询资产型号列表
 * 
 * @param {*} param 
 * @returns 
 */
export function getTable(param) {
    return businessRequest({
        url: EQUIPMENT_URL() + `/eqAssetType/page`,
        method: 'post',
        data: param
    })
}

/**
  * 通过id查询资产型号
  * @param {*} id
  */
 export function queryById(id) {
    return businessRequest({
        method: 'get',
        url: EQUIPMENT_URL() + `/eqAssetType/queryById?id=${id}`
    })
}
// 添加
export function add(param) {
  return businessRequest({
    method: 'post',
    url: EQUIPMENT_URL() + '/eqAssetType/add',
    data: param
  });
}

// 修改
export function edit(param) {
  return businessRequest({
    method: 'post',
    url: EQUIPMENT_URL() + '/eqAssetType/edit',
    data: param
  });
}


/**
* 通过id批量删除设备类型
* @param {*} ids 
*/
export function deleteByIds(ids) {
  return businessRequest({
      url: EQUIPMENT_URL() + '/eqAssetType/deleteByIds',
      method: 'post',
      data: ids
  });
}

/**
* 通过资产型号查询资产型号记录是否已存在
* @param {*} param 
*/
export function isExistsByAssetTypeNo(assetTypeNo,oldAssetTypeNo,companyId,oldCompanyId) {
    return businessRequest({
      method: 'get',
      url: EQUIPMENT_URL() + `/eqAssetType/isExistsByAssetTypeNo`,
      params:{
        assetTypeNo:assetTypeNo,
        oldAssetTypeNo:oldAssetTypeNo,
        companyId:companyId,
        oldCompanyId:oldCompanyId
      }
    });
  }
  
/**
  * 根据设备类型id获得设备类型扩展属性列表
  * @param {*} eqAssetTypeId
  */
 export function findEqAssetTypeExtendByEqAssetTypeId(eqAssetTypeId) {
  return businessRequest({
      method: 'get',
      url: EQUIPMENT_URL() + `/eqAssetType/findEqAssetTypeExtendByEqAssetTypeId?eqAssetTypeId=${eqAssetTypeId}`
  })
}

/**
  * 根据设备资产型号id获得设备资产型号技术参数列表
  * @param {*} eqAssetTypeId
  */
 export function findEqAssetTypeParmByEqAssetTypeId(eqAssetTypeId) {
  return businessRequest({
      method: 'get',
      url: EQUIPMENT_URL() + `/eqAssetType/findEqAssetTypeParmByEqAssetTypeId?eqAssetTypeId=${eqAssetTypeId}`
  })
}

/**
  * 根据设备资产型号id获得设备资产型号备品备件列表
  * @param {*} eqAssetTypeId
  */
 export function findEqAssetTypeSparepartByEqAssetTypeId(eqAssetTypeId) {
  return businessRequest({
      method: 'get',
      url: EQUIPMENT_URL() + `/eqAssetType/findEqAssetTypeSparepartByEqAssetTypeId?eqAssetTypeId=${eqAssetTypeId}`
  })
}