import { businessRequest } from '@/plugin/axios/index';
import { CALCULATION_URL } from '@/api/baseUrl';

/**
 * 获取指标标杆信息列表
 * @param {*} param 
 */
export function getList(param) {
    return businessRequest({
      url: CALCULATION_URL() + '/api/imBenchmark/getList',
      method: 'post',
      data: param
    });
}

/**
* 保存指标标杆信息
* @param {*} formData 
*/
export function saveBenchmark(formData) {
    return businessRequest({
      method: 'post',
      url: CALCULATION_URL() + '/api/imBenchmark/saveBenchmark',
      data: formData
    });
}

/**
 * 分页获得指标标杆修订历史列表
 * @param {*} param 
 */
export function getBenchmarkHisTable(param) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/imBenchmark/selectBenchmarkHisPage',
    method: 'post',
    data: param
  });
}


/**
 * 保存指标标杆和计划值信息
 * @param {*} param 
 * @returns 
 */
export function saveBenchmarkAndPlan(param) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/imBenchmark/saveBenchmarkAndPlan',
    method: 'post',
    data: param
  });
}