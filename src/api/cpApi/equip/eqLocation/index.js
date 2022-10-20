import { businessRequest } from "@/plugins/axios/index"
import { EQUIPMENT_URL } from "@/api/baseUrl"

/**
 * 分页查询设备位置列表
 * 
 * @param {*} param 
 * @returns 
 */
export function getTable(param) {
    return businessRequest({
        url: EQUIPMENT_URL() + `/eqLocation/page`,
        method: 'post',
        data: param
    })
}

/**
  * 通过id查询设备位置
  * @param {*} id
  */
 export function queryById(id) {
    return businessRequest({
        method: 'get',
        url: EQUIPMENT_URL() + `/eqLocation/queryById?id=${id}`
    })
}
// 添加
export function add(param) {
  return businessRequest({
    method: 'post',
    url: EQUIPMENT_URL() + '/eqLocation/add',
    data: param
  });
}

// 修改
export function edit(param) {
  return businessRequest({
    method: 'post',
    url: EQUIPMENT_URL() + '/eqLocation/edit',
    data: param
  });
}


/**
* 通过id批量删除设备类型
* @param {*} ids 
*/
export function deleteByIds(ids) {
  return businessRequest({
      url: EQUIPMENT_URL() + '/eqLocation/deleteByIds',
      method: 'post',
      data: ids
  });
}

/**
* 通过设备位置编码查询设备位置记录是否已存在
* @param {*} param 
*/
export function isExistsByLocaNo(locaNo,oldLocaNo,companyId,oldCompanyId) {
    return businessRequest({
      method: 'get',
      url: EQUIPMENT_URL() + `/eqLocation/isExistsByLocaNo`,
      params:{
        locaNo:locaNo,
        oldLocaNo:oldLocaNo,
        companyId:companyId,
        oldCompanyId:oldCompanyId
      }
    });
  }

/**
 * 获得顶级设备位置树
 */
 export function getTopTreeList(param) {
  return businessRequest({
      url: EQUIPMENT_URL() + `/eqLocation/getTopTreeList?companyId=${param}`,
      method: 'get'
  })
}

/**
 * 根据设备位置编码查询下级设备位置
 */
export function getSubTreeList(locaId) {
  return businessRequest({
      method: 'get',
      url: EQUIPMENT_URL() + '/eqLocation/getSubTreeList',
      params: {
        locaId: locaId
      }
  })
}  

/**
 * 批量生成设备位置二维码图片
 */
export function getEqLocationQRCodes (param) {
  return businessRequest({
    url: EQUIPMENT_URL() + `/zxingCode/getEqLocationQRCodes`,
    method: 'post',
    data: param
  })
}

/**
  * 查询下级位置id，不包含自己
  * @param {*} id
  */
 export function getAllSubLocaIds(id) {
  return businessRequest({
      method: 'get',
      url: EQUIPMENT_URL() + `/eqLocation/getAllSubLocaIds?id=${id}`
  })
}

/**
* 获得设备资产型号和设备类型的建议配置测点的技术参数列表
* @param {*} param 
*/
export function getAssetTypeAndLocationTypeParmList(assetId,locaId) {
  return businessRequest({
    method: 'get',
    url: EQUIPMENT_URL() + `/eqLocation/getAssetTypeAndLocationTypeParmList`,
    params:{
      assetId:assetId,
      locaId:locaId
    }
  });
}

/**
  * 是否存在可用的下级设备位置
  * @param {*} id
  */
 export function isExistsEnableSub(id) {
  return businessRequest({
      method: 'get',
      url: EQUIPMENT_URL() + `/eqLocation/isExistsEnableSub?id=${id}`
  })
}
 
/**
 * 设备导入
 */
export function importSync(param) {
    return businessRequest({
      url: EQUIPMENT_URL() + `/eqImport/importSync`,
      method: 'post',
      data: param
    })
  }

  /**
 * 设备导出
 */
export function exportExcel(param) {
    return businessRequest({
      url: EQUIPMENT_URL() + `/eqLocation/exportExcel`,
      method: 'post',
      data: param
    })
  }