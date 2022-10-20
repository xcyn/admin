import { businessRequest } from '@/plugin/axios/index';
import { CALCULATION_URL } from '@/api/baseUrl';

/**
 * 获取指标计划值列表
 * @param {*} param 
 */
export function getList(param) {
    return businessRequest({
      url: CALCULATION_URL() + '/api/imExpressPlan/getList',
      method: 'post',
      data: param
    });
}

/**
* 保存指标计划值
* @param {*} formData 
*/
export function saveExpressPlan(formData) {
    return businessRequest({
      method: 'post',
      url: CALCULATION_URL() + '/api/imExpressPlan/saveExpressPlan',
      data: formData
    });
}
    