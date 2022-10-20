import { businessRequest,systemRequest } from '@/plugins/axios/index';
import { CALCULATION_URL } from '@/api/baseUrl';


/**
 * 分页列表查询工况信息列表
 * @param {*} param
 */
export function getTable(param) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/workCondition/pageList',
    method: 'post',
    data: param
  });
}

/**
 * 根据机组和状态查询工况列表
 * @param {*} param
 */
export function getWorkingConditionList(param) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/workCondition/getWorkingConditionList',
    method: 'post',
    data: param
  });
}

/**
 * 保存工况信息
 * @param {*} formData
 */
export function saveWorkContion(formData) {
  return businessRequest({
    method: 'post',
    url: CALCULATION_URL() + '/api/workCondition/saveWorkContion',
    data: formData
  });
}


/**
 * 通过id查工况信息
 * @param {*} param
 */
export function queryById(param) {
  return businessRequest({
    method: 'get',
    url: CALCULATION_URL() + `/api/workCondition/queryById?wcId=${param}`
  });
}

/**
 * 通过id批量删除工况信息
 * @param {Object} ids
 */
export function deleteByWorkContionIds(ids) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/workCondition/deleteByWorkContionIds',
    method: 'post',
    data: ids
  });
}


/**
* 更新其他机组工况为非缺省
* @param {*} formData
*/
export function updatePcWorkConditionDefault(formData) {
return businessRequest({
  method: 'post',
  url: CALCULATION_URL() + '/api/workCondition/updatePcWorkConditionDefault',
  data: formData
});
}

/**
 * 根据寻优方案ID获取工况参数列表
 * @param {*} param
 */
export function getPcWCParamListByOptId(param) {
  return businessRequest({
    method: 'get',
    url: CALCULATION_URL() + `/api/pcWCParam/getPcWCParamListByOptId?optimizeId=${param}`
  });
}
