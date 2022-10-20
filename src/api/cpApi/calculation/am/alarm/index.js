import { businessRequest,systemRequest } from '@/plugin/axios/index';
import { CALCULATION_URL,EXTEND_URL } from '@/api/baseUrl';

/**
 * 分页列表查告警信息
 * @param {*} param
 */
export function getTable(param) {
    return businessRequest({
      url: CALCULATION_URL() + '/api/amAlarm/pageList',
      method: 'post',
      data: param
    });
}

/**
 * 保存告警信息
 * @param {*} formData
 */
export function saveAmAlarm(formData) {
  return businessRequest({
    method: 'post',
    url: CALCULATION_URL() + '/api/amAlarm/saveAmAlarm',
    data: formData
  });
}

/**
 * 通过id查告警信息
 * @param {*} param
 */
export function queryById(param) {
  return businessRequest({
    method: 'get',
    url: CALCULATION_URL() + `/api/amAlarm/queryById?id=${param}`
  });
}

/**
 * 通过ID批量删除告警信息
 * @param {*} ids
 */
export function deleteByIds (ids) {
    return businessRequest({
      url: CALCULATION_URL() + '/api/amAlarm/deleteByIds',
      method: 'post',
      data: ids
    });
}

/**
 * 告警信息-获得历史测点数据
 */
export function queryHistoryMpValue(param) {
  return businessRequest({
    method: 'post',
    url: CALCULATION_URL() + '/api/amAlarm/queryHistoryMpValue',
    data: param
  });
}

/**
 * 告警信息-分页查询历史测点数据
 */
export function getHistoryMpValueTable(param) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/amAlarm/listHistoryMpValue',
    method: 'post',
    data: param
  });
}

/**
 * 根据条件查询所有组织
 * @param {Object} param
 */
export function findAllByCondition (param) {
  return systemRequest({
    url: EXTEND_URL() + '/entity/findAllByCondition',
    method: 'post',
    data: param
  });
}

/**
 * 超限幅值散点图
 * @param {} param 
 * @returns 
 */
export function getScatterRate(param) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/amAlarm/getScatterRate',
    method: 'post',
    data: param
  }); 
}

/**
 * 超限时长散点图 
 * @param {} param 
 * @returns 
 */
export function getScatterLong(param) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/amAlarm/getScatterLong',
    method: 'post',
    data: param
  });
}

/**
 * 清空所有已结束的告警
 */
export function deleteAllAlarm () {
    return businessRequest({
      url: CALCULATION_URL() + '/api/amAlarm/deleteAllAlarm',
      method: 'post' 
    });
}
