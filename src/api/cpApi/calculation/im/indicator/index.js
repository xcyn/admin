import { businessRequest } from '@/plugins/axios/index';
import { CALCULATION_URL } from '@/api/baseUrl';

/**
 * 分页列表查询指标
 * @param {*} param
 */
export function getTable(param) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/indicator/pageList',
    method: 'post',
    data: param
  });
}

/**
* 保存指标
* @param {*} formData
*/
export function saveImIndicator(formData) {
return businessRequest({
  method: 'post',
  url: CALCULATION_URL() + '/api/indicator/saveImIndicator',
  data: formData
});
}

/**
* 通过id查询指标
* @param {*} param
*/
export function queryById(param) {
return businessRequest({
  method: 'get',
  url: CALCULATION_URL() + `/api/indicator/queryById?id=${param}`
});
}

/**
* 通过id批量删除指标
* @param {*} catNos
*/
export function deleteByIds(catNos) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/indicator/deleteByIds',
    method: 'post',
    data: catNos
  });
}

/**
* 通过编码查询指标是否已存在
* @param {*} param
*/
export function isExistsByIndicatorNo(imIndicatorNo,oldImIndicatorNo) {
  return businessRequest({
    method: 'get',
    url: CALCULATION_URL() + `/api/indicator/isExistsByIndicatorNo?imIndicatorNo=${imIndicatorNo}&oldImIndicatorNo=${oldImIndicatorNo}`
  });
  }


/**
* 通过指标编码生成指标计算公式
* @param {*} paramData
*/
export function generateExpressByImIndicators(paramData) {
  return businessRequest({
    method: 'post',
    url: CALCULATION_URL() + '/api/indicator/generateExpressByImIndicators',
    data: paramData
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
    data: param
  });
}

