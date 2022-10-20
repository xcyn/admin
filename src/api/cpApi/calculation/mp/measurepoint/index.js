import { businessRequest, systemRequest } from '@/plugins/axios/index';
import { CALCULATION_URL, EQUIPMENT_URL } from '@/api/baseUrl';


/**
 * 分页列表查询测点列表
 * @param {*} param
 */
export function getTable(param) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/meaPoint/pageList',
    method: 'post',
    data: param
  });
}

export function getList(param) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/meaPoint/selectList',
    method: 'post',
    data: param
  });
}

export function getPointByMpNo(mpNo) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/meaPoint/pageList',
    method: 'post',
    data: {
      mpNo: mpNo,
      requestPage: { pageNo: 1, limit: 20 }
    }
  });
}

/**
* 通过id查询测点信息
* @param {*} param
*/
export function queryMeaPointById(param) {
  return businessRequest({
    method: 'get',
    url: CALCULATION_URL() + `/api/meaPoint/queryMeaPointById?measurepointId=${param}`
  });
}

/**
* 通过编码查询测点编码是否已存在
* @param {*} param
*/
export function isExistsByMeaPointNo(mpNo, oldMpNo, companyId) {
  return businessRequest({
    method: 'post',
    url: CALCULATION_URL() + '/api/meaPoint/isExistsByMeaPointNo',
    data: { mpNo: mpNo, oldMpNo: oldMpNo, companyId: companyId }
  });
}

/**
* 保存测点信息
* @param {*} formData
*/
export function saveMesPoint(formData) {
  return businessRequest({
    method: 'post',
    url: CALCULATION_URL() + '/api/meaPoint/saveMesPoint',
    data: formData
  });
}

/**
* 通过id批量删除测点信息
* @param {*} measurepointIds
*/
export function deleteByMesPointIds(measurepointIds) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/meaPoint/deleteByMesPointIds',
    method: 'post',
    data: measurepointIds
  });
}

/**
 *根据设备位置id获取设备位置技术参数，设备类型技术参数
 * @param {Object} param
 */
export function getAllTechParmByLocaId(param) {
  return systemRequest({
    url: EQUIPMENT_URL() + '/eqTechnicalParameter/getAllTechParmByLocaId',
    method: 'post',
    data: param
  });
}

/**
 * 查询所有技术参数编码列表，分页
 */
export function getAllTechParm(param) {
  return systemRequest({
    url: EQUIPMENT_URL() + '/eqTechnicalParameter/page',
    method: 'post',
    data: param
  });
}


export function getEqLocationByLocaNo(locaNo) {
  return systemRequest({
    url: EQUIPMENT_URL() + '/eqLocation/getEqLocationByLocaNo?locaNo=' + locaNo,
    method: 'get'
  });

}

export function getByEqTypeId(eqTypeId) {
  return systemRequest({
    url: EQUIPMENT_URL() + '/eqLocationExtend/getByEqTypeId?eqTypeId=' + eqTypeId,
    method: 'get'
  });
}


export function getTpPoints(locaNo, tpNo) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/diagram/getTpPoint',
    method: 'post',
    data: { 'tpNo': tpNo, 'locaNo': locaNo }
  })
}

export function showProcessChart(param) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/diagram/showProcessChart',
    method: 'post',
    data: param
  })
}

export function getLastImData(param) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/imData/getLastImData',
    method: 'post',
    data: param
  })
}

export function showCondProcessChart(param) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/diagram/showCondProcessChart',
    method: 'post',
    data: param
  })
}