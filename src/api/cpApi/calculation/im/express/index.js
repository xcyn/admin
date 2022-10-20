import { businessRequest } from '@/plugin/axios/index';
import { CALCULATION_URL } from '@/api/baseUrl';

/**
 * 根据指标和对象分组获取分页列表数据
 * @param {*} param 
 */
export function getGroupTable(param) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/imExpress/selectGroupPage',
    method: 'post',
    data: param
  });
}

/**
 * 分页列表查指标表达式
 * @param {*} param 
 */
export function getTable(param) {
    return businessRequest({
      url: CALCULATION_URL() + '/api/imExpress/pageList',
      method: 'post',
      data: param
    });
}

/**
 * 保存指标和对象
 * @param {*} formData 
 */
export function saveIndicatorAndObject(formData) {
  return businessRequest({
    method: 'post',
    url: CALCULATION_URL() + '/api/imExpress/saveIndicatorAndObject',
    data: formData
  });
}

/**
 * 保存指标表达式
 * @param {*} formData 
 */
export function saveExpress(formData) {
  return businessRequest({
    method: 'post',
    url: CALCULATION_URL() + '/api/imExpress/saveExpress',
    data: formData
  });
}

/**
 * 通过(指标id + 对象id + 统计周期”)查询指标表达式
 * @param {*} param 
 */
export function getByCon(indicatorId,objectId,timeTypeId) {
  return businessRequest({
    method: 'get',
    url: CALCULATION_URL() + `/api/imExpress/getByCon?indicatorId=${indicatorId}&objectId=${objectId}&timeTypeId=${timeTypeId}`
  });
}

/**
 * 通过(指标id + 对象id + 统计周期”)查询指标表达式
 * @param {*} param 
 */
export function getExpressByCon(indicatorId,objectId,timeTypeId) {
  return businessRequest({
    method: 'get',
    url: CALCULATION_URL() + `/api/imExpress/getExpressByCon?indicatorId=${indicatorId}&objectId=${objectId}&timeTypeId=${timeTypeId}`
  });
}

/**
 * 通过指标id和对象id批量删除指标表达式
 * @param {*} indicatorId 
 * @param {*} objectId 
 */
export function deleteByIndAndObject(indObjIds) {
  return businessRequest({
    method: 'post',
    url: CALCULATION_URL() + `/api/imExpress/deleteByIndAndObject`,
    data: indObjIds 
  });
} 

/**
 * 获得顶级指标类别列表
 */
export function getTopTreeList(param) {
  return businessRequest({
    url: CALCULATION_URL() + `/api/imExpress/getTopTreeList?companyId=${param}`,
    method: 'get'
  });
}

/**
 * 根据指标类别编码查询下级指标类别和指标列表
 */
export function getSubTreeList(id) {
  return businessRequest({
      method: 'get',
      url: CALCULATION_URL() + '/api/imExpress/getSubTreeList',
      params: {
      id : id
      }
  });
}  

/**
 * 根据指标id和对象id查询指标周期列表
 * @param {*} param 
 */
export function getTimeTypeVOListByIndAndObject(indicatorId,objectId) {
  return businessRequest({
    method: 'get',
    url: CALCULATION_URL() + `/api/imExpress/getTimeTypeVOListByIndAndObject?indicatorId=${indicatorId}&objectId=${objectId}`
  });
}

/**
 * 判断该表达式是否被别的表达式关联过
 * @param {*} param 
 */
export function getJudgeRealateFormula(id) {
  return businessRequest({
    method: 'get',
    url: CALCULATION_URL() + `/api/imExpress/getJudgeRealateFormula?id=${id}`
  });
}


export function validExpressValue(param){
  return businessRequest({
    method: 'post',
    url: CALCULATION_URL() + `/api/imExpress/validExpressValue`,
    data: param 
  });
}