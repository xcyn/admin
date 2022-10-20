import { businessRequest } from '@/plugin/axios/index';
import { CALCULATION_URL } from '@/api/baseUrl';

/**
 * 分页列表查询性能计算表达式
 * @param {*} param
 */
export function getTable(param) {
    return businessRequest({
      url: CALCULATION_URL() + '/api/pcExpress/pageList',
      method: 'post',
      data: param
    });
}

/**
 * 保存性能计算表达式
 * @param {*} formData
 */
export function savePcExpress(formData) {
  return businessRequest({
    method: 'post',
    url: CALCULATION_URL() + '/api/pcExpress/savePcExpress',
    data: formData
  });
}

/**
 * 通过id查询性能计算表达式
 * @param {*} param
 */
export function queryById(param) {
  return businessRequest({
    method: 'get',
    url: CALCULATION_URL() + `/api/pcExpress/queryById?id=${param}`
  });
}

/**
 * 通过ID批量删除性能计算表达式
 * @param {*} ids
 */
export function deleteByIds (ids) {
    return businessRequest({
      url: CALCULATION_URL() + '/api/pcExpress/deleteByIds',
      method: 'post',
      data: ids
    });
}

/**
 * 初始化性能计算公式树
 * @param {*} param
 */
export function drawGraphSvgView(param) {
  return businessRequest({
    method: 'get',
    url: CALCULATION_URL() + `/api/pcExpress/drawGraphSvgView?id=${param}`
  });
}

/**
* 重启计算程序
* @param {*} paramData
*/
export function syncCalSocket(param) {
  return businessRequest({
    method: 'post',
    url: CALCULATION_URL() + '/api/imReCal/syncCalSocket',
    data: {type:'performanceCal'}
  });
}

/**
 * 性能计算过程图解重算
 * @param {*} param
 */
export function svgRecalculate(param) {
  return businessRequest({
    method: 'post',
    url: CALCULATION_URL() + `/api/xnExpressControl/calData`,
    data: param
  });
}
