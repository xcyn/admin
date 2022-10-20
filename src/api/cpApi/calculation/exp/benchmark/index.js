import { businessRequest } from '@/plugin/axios/index';
import { CALCULATION_URL } from '@/api/baseUrl';

/**
 * 获取性能指标标杆信息列表
 * @param {*} param 
 */
export function getList(param) {
    return businessRequest({
      url: CALCULATION_URL() + '/api/pcBenchmark/getList',
      method: 'post',
      data: param
    });
}

/**
* 保存性能指标标杆信息
* @param {*} formData 
*/
export function savePcBenchmark(formData) {
    return businessRequest({
      method: 'post',
      url: CALCULATION_URL() + '/api/pcBenchmark/savePcBenchmark',
      data: formData
    });
}

/**
 * 分页获得指标标杆修订历史列表
 * @param {*} param 
 */
export function getPcBenchmarkHisTable(param) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/pcBenchmark/selectPcBenchmarkHisPage',
    method: 'post',
    data: param
  });
}


/**
 * 保存性能指标标杆信息以及工况目标值
 * @param {*} param 
 * @returns 
 */
export function savePcBenchmarkWorkTarget(param) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/pcBenchmark/savePcBenchmarkWorkTarget',
    method: 'post',
    data: param
  });
}