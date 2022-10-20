import { businessRequest,systemRequest } from '@/plugins/axios/index';
import { CALCULATION_URL } from '@/api/baseUrl';


/**
 * 分页列表查询性能参数目标值记录
 * @param {*} param
 */
export function getTable(param) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/pcTargetValue/pageList',
    method: 'post',
    data: param
  });
}

/**
 * 生成全工况指标
 * @param {*} param
 */
export function generateTargetValueInfo(param) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/pcTargetValue/generateTargetValueInfo',
    method: 'post',
    data: param
  });
}


/**
 * 通过id批量删除性能参数目标值记录
 * @param {Object} ids
 */
export function deleteTargetValueByIds(ids) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/pcTargetValue/deleteTargetValueByIds',
    method: 'post',
    data: ids
  });
}
