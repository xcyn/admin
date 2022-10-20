import { businessRequest } from '@/plugin/axios/index';
import { CALCULATION_URL } from '@/api/baseUrl';

/**
 * 分页列表查告警规则
 * @param {*} param 
 */
export function getTable(param) {
    return businessRequest({
      url: CALCULATION_URL() + '/api/amRule/pageList',
      method: 'post',
      data: param
    });
}

/**
 * 保存告警规则
 * @param {*} formData 
 */
export function saveAmRule(formData) {
  return businessRequest({
    method: 'post',
    url: CALCULATION_URL() + '/api/amRule/saveAmRule',
    data: formData
  });
}

/**
 * 通过id查告警规则
 * @param {*} param 
 */
export function queryById(param) {
  return businessRequest({
    method: 'get',
    url: CALCULATION_URL() + `/api/amRule/queryById?id=${param}`
  });
}

/**
 * 通过ID批量删除告警规则
 * @param {*} ids 
 */
export function deleteByIds (ids) {
    return businessRequest({
      url: CALCULATION_URL() + '/api/amRule/deleteByIds',
      method: 'post',
      data: ids
    });
}
 
/**
 * 查询明细告警规则
 * @param {} id 
 * @returns 
 */
export function getRuleDetailById(id) {
  return businessRequest({
    url: CALCULATION_URL() + `/api/amRule/getRuleDetailById?id=${id}`,
    method: 'get',
  });
}