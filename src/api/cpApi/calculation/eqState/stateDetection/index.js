import { businessRequest,systemRequest } from '@/plugin/axios/index';
import { CALCULATION_URL,EXTEND_URL } from '@/api/baseUrl';

/**
 * 分页查询设备状态明细
 * @param {*} param
 */
export function getTable(param) {
    return businessRequest({
      url: CALCULATION_URL() + '/api/eqStateInfo/pageList',
      method: 'post',
      data: param
    });
}

/**
 * 查询设备运行统计
 * @param {*} param
 */
export function getEqStatInfo(param) {
    return businessRequest({
      url: CALCULATION_URL() + '/api/eqStateInfo/getEqStatInfo',
      method: 'post',
      data: param
    });
}

/**
 * 设备启停重算
 * @param {*} param
 */
export function eqStateRecal(startTime) {
  return businessRequest({
    method: 'get',
    url: CALCULATION_URL() + `/api/eqStateInfo/eqStateRecal?startTime=${startTime}`
  });
}
