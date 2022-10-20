import { businessRequest } from '@/plugin/axios/index';
import { CALCULATION_URL } from '@/api/baseUrl';

/**
 * 获取工况目标值列表
 * @param {*} param 
 */
export function getList(param) {
    return businessRequest({
      url: CALCULATION_URL() + '/api/pcWorkTargetValue/getList',
      method: 'post',
      data: param
    });
}

/**
* 保存工况目标值
* @param {*} formData 
*/
export function savePcWorkingTargetValue(formData) {
    return businessRequest({
      method: 'post',
      url: CALCULATION_URL() + '/api/pcWorkTargetValue/savePcWorkingTargetValue',
      data: formData
    });
}
    