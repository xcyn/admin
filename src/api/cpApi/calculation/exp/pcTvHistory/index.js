import { businessRequest,systemRequest } from '@/plugins/axios/index';
import { CALCULATION_URL } from '@/api/baseUrl';


/**
 * 分页列表查询性能参数目标值记录
 * @param {*} param
 */
export function getTable(param) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/pcTvHistory/pageList',
    method: 'post',
    data: param
  });
}


/**
 * 保存性能参数目标值修订历史
 * @param {*} param
 */
export function savePcTvHistory(param) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/pcTvHistory/savePcTvHistory',
    method: 'post',
    data: param
  });
}
