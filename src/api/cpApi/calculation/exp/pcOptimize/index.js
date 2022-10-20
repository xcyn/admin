import { businessRequest,systemRequest } from '@/plugins/axios/index';
import { CALCULATION_URL } from '@/api/baseUrl';


/**
 * 分页列表查询寻优方案信息列表
 * @param {*} param
 */
export function getTable(param) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/pcOptimize/pageList',
    method: 'post',
    data: param
  });
}

/**
 * 保存寻优方案信息
 * @param {*} formData
 */
export function savePcOptimize(formData) {
  return businessRequest({
    method: 'post',
    url: CALCULATION_URL() + '/api/pcOptimize/savePcOptimize',
    data: formData
  });
}


/**
 * 通过id查寻优方案信息
 * @param {*} param
 */
export function queryById(param) {
  return businessRequest({
    method: 'get',
    url: CALCULATION_URL() + `/api/pcOptimize/queryById?optimizeId=${param}`
  });
}

/**
 * 查询寻优方案及实时信息
 * @param {*} param
 */
export function queryRealInfo(optimizeId,oeId) {
  return businessRequest({
    method: 'get',
    url: CALCULATION_URL() + `/api/pcOptimize/queryRealInfo?optimizeId=${optimizeId}&oeId=${oeId}`
  });
}


/**
 * 通过id批量删除工况
 * @param {Object} ids
 */
export function deleteByOptimizeIds(ids) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/pcOptimize/deleteByOptimizeIds',
    method: 'post',
    data: ids
  });
}

/**
* 更新其他机组寻优方案信息为非缺省
* @param {*} formData
*/
export function updateOptimizeDefault(formData) {
return businessRequest({
  method: 'post',
  url: CALCULATION_URL() + '/api/pcOptimize/updateOptimizeDefault',
  data: formData
});
}


/**
 * 分页列表查询寻优执行记录
 * @param {*} param
 */
export function getOptimizeExecuteTable(param) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/pcOptimizeExecute/pageList',
    method: 'post',
    data: param
  });
}

/**
 * 批量删除寻优执行记录
 * @param {*} param
 */
export function deleteByOptimizeExecuteIds(param) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/pcOptimizeExecute/deleteByOptimizeExecuteIds',
    method: 'post',
    data: param
  });
}

/**
 * 分页列表查询寻优结果
 * @param {*} param
 */
export function getOeResultTable(param) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/pcOeResult/pageList',
    method: 'post',
    data: param
  });
}

/**
 * 通过ID查询寻优执行记录信息
 * @param {*} param
 */
export function selectOptimizeExecuteInfoById(param) {
  return businessRequest({
    method: 'get',
    url: CALCULATION_URL() + `/api/pcOptimizeExecute/selectOptimizeExecuteInfoById?id=${param}`
  });
}

/**
 * 通过寻优方案ID和寻优结果ID查询寻优性能参数信息
 * @param {*} param
 */
export function queryWcParamInfoById(optimizeId,resultId) {
  return businessRequest({
    method: 'get',
    url: CALCULATION_URL() + `/api/pcOptimize/queryWcParamInfoById?optimizeId=${optimizeId}&resultId=${resultId}`
  });
}

/**
* 更新其他机组寻优方案信息为非缺省
* @param {*} formData
*/
export function upadteResultParam(formData) {
return businessRequest({
  method: 'post',
  url: CALCULATION_URL() + '/api/pcOeResult/upadteResultParam',
  data: formData
});
}


/**
* 执行寻优执行操作
* @param {*} formData
*/
export function exeOptimize(formData) {
return businessRequest({
  method: 'post',
  url: CALCULATION_URL() + '/api/pcOptimizeExecute/exeOptimize',
  data: formData
});
}

/**
* 执行实时寻优执行操作
* @param {*} formData
*/
export function exeRealOptimize(formData) {
return businessRequest({
  method: 'post',
  url: CALCULATION_URL() + '/api/pcOptimizeExecute/exeRealOptimize',
  data: formData
});
}

/**
* 停止实时寻优操作
* @param {*} formData
*/
export function stopRealOptimize(formData) {
return businessRequest({
  method: 'post',
  url: CALCULATION_URL() + '/api/pcOptimizeExecute/stopRealOptimize',
  data: formData
});
}

/**
* 保存寻优方案执行信息
* @param {*} formData
*/
export function savePcOptimizeExecuteInfo(formData) {
return businessRequest({
  method: 'post',
  url: CALCULATION_URL() + '/api/pcOptimizeExecute/savePcOptimizeExecuteInfo',
  data: formData
});
}
