import { businessRequest,systemRequest } from '@/plugins/axios/index';
import { CALCULATION_URL } from '@/api/baseUrl';


/**
 * 分页列表耗差分析配置记录
 * @param {*} param
 */
export function getTable(param) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/pcConsumdiffAnalysis/pageList',
    method: 'post',
    data: param
  });
}

/**
 * 通过ID批量删除耗差分析配置信息
 * @param {Object} ids
 */
export function deleteByConsumdiffAnalysisIds(ids) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/pcConsumdiffAnalysis/deleteByConsumdiffAnalysisIds',
    method: 'post',
    data: ids
  });
}

/**
 * 保存耗差分析配置信息
 * @param {*} formData
 */
export function saveConsumdiffAnalysisInfo(formData) {
  return businessRequest({
    method: 'post',
    url: CALCULATION_URL() + '/api/pcConsumdiffAnalysis/saveConsumdiffAnalysisInfo',
    data: formData
  });
}

/**
 * 通过id查询耗差分析配置信息
 * @param {*} param
 */
export function queryById(param) {
  return businessRequest({
    method: 'get',
    url: CALCULATION_URL() + `/api/pcConsumdiffAnalysis/queryById?id=${param}`
  });
}


/**
 * 查询耗差分析信息
 * @param {*} param
 */
export function selectConsumdiffAnlysisInfo(param) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/pcConsumdiffAnalysis/selectConsumdiffAnlysisInfo',
    method: 'post',
    data: param
  });
}
