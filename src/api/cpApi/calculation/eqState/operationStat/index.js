import { businessRequest,systemRequest } from '@/plugin/axios/index';
import { CALCULATION_URL,EXTEND_URL } from '@/api/baseUrl';

/**
 * 分页列表查询设备运行统计详情
 * @param {*} param
 */
export function getTable(param) {
    return businessRequest({
      url: CALCULATION_URL() + '/api/eqOperationInfo/pageList',
      method: 'post',
      data: param
    });
}

/**
 * 查询设备运行统计信息
 * @param {*} param
 */
export function getEqStatInfo(param) {
    return businessRequest({
      url: CALCULATION_URL() + '/api/eqOperationInfo/getEqStatInfo',
      method: 'post',
      data: param
    });
}


/**
 * 查询状态实时监测信息
 * @param {*} param
 */
export function getRealTimeMonitorInfo(param) {
    return businessRequest({
      url: CALCULATION_URL() + '/api/eqOperationInfo/getRealTimeMonitorInfo',
      method: 'post',
      data: param
    });
}


/**
 * 查询状态实时监测信息
 * @param {*} param
 */
export function updateEqState(param) {
    return businessRequest({
      url: CALCULATION_URL() + '/api/eqOperationInfo/updateEqState',
      method: 'post',
      data: param
    });
}

/**
 * 更新设备状态明细启停状态
 * @param {*} param
 */
export function updateEqDetailState(param) {
    return businessRequest({
      url: CALCULATION_URL() + '/api/eqOperationInfo/updateEqDetailState',
      method: 'post',
      data: param
    });
}
