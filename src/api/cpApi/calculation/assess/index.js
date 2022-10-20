import { businessRequest } from '@/plugins/axios/index'
import { CALCULATION_URL } from '@/api/baseUrl'
import { ASSESS_URL } from '@/api/baseUrl'

/**
 * 分页列表查询小指标考核对象列表
 * @param {*} param
 */
export function getAsObjectTable(param) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/assess/pageList',
    method: 'post',
    data: param
  })
}

/**
 * 分页列表查询越限考核计算明细
 * @param {*} param
 */
export function getLimitTable(param) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/assess/pageLimitList',
    method: 'post',
    data: param
  })
}

/**
 * 分页列表查询排序考核计算明细
 * @param {*} param
 */
export function getSortTable(param) {
  return businessRequest({
    url: CALCULATION_URL() + '/api/assess/pageSortList',
    method: 'post',
    data: param
  })
}

/**
 * 分页列表查询交接班排版规则列表
 * @param {*} param
 */
export function getShiftRuleList(param) {
  return businessRequest({
    url: CALCULATION_URL() + `/api/assess/getShiftDutyRuleList?companyId=${param.companyId}&isOn=${param.isOn}&pageNo=${param.pageNo}&pageSize=${param.pageSize}`,
    method: 'get'
  })
}

/**
 * 保存小指标对象及策略信息
 * @param {*} formData
 */
export function saveAssessObjectAndStrategyInfo(formData) {
  return businessRequest({
    method: 'post',
    url: CALCULATION_URL() + '/api/assess/saveAssessObjectAndStrategyInfo',
    data: formData
  })
}

/**
 * 根据考核对象id获取对象及策略信息
 * @param param
 * @returns {*}
 */
export function getAsObjectAndStrategyInfo(param) {
  return businessRequest({
    method: 'get',
    url: CALCULATION_URL() + `/api/assess/getAsObjectAndStrategyInfo?asObjectId=${param}`
  })
}

/**
 * 根据考核策略id获取对应的策略信息
 * @param {*} param
 */
export function getStrategyAndRuleInfo(param) {
  return businessRequest({
    method: 'get',
    url: CALCULATION_URL() + `/api/assess/getStrategyAndRuleInfo?asStrategyId=${param}`
  })
}

/**
 * 根据策略类型查询策略数据
 * @param {*} param
 */
export function getStrategyDataInfo(param) {
  return businessRequest({
    method: 'post',
    url: CALCULATION_URL() + `/api/assess/getStrategyDataInfo`,
    data: param
  })
}

/**
 * 删除策略信息根据策略id
 * @param {*} param
 */
export function delStrategyInfoById(param) {
  return businessRequest({
    method: 'get',
    url: CALCULATION_URL() + `/api/assess/delStrategyInfoById?asStrategyId=${param}`
  })
}

/**
 * 删除对象及相关信息根据对象id
 * @param {*} param
 */
export function deleteAsObjectInfoById(param) {
  return businessRequest({
    method: 'post',
    url: CALCULATION_URL() + `/api/assess/deleteAsObjectInfoById`,
    data: param
  })
}

/**
 * 保存考核对象信息
 * @param {*} formData
 */
export function saveAsObjectInfo(formData) {
  return businessRequest({
    method: 'post',
    url: CALCULATION_URL() + '/api/assess/saveAsObjectInfo',
    data: formData
  })
}

/**
 * 修正排序考核明细
 * @param {*} formData
 */
export function changeSortDetail(formData) {
  return businessRequest({
    method: 'post',
    url: CALCULATION_URL() + '/api/assess/changeSortDetail',
    data: formData
  })
}

/**
 * 修正越限考核明细
 * @param {*} formData
 */
export function changeLimitDetail(formData) {
  return businessRequest({
    method: 'post',
    url: CALCULATION_URL() + '/api/assess/changeLimitDetail',
    data: formData
  })
}

/**
 * 排序月度考核报表查询
 * @param {*} formData
 */
export function ydpxkhbb(formData) {
  return businessRequest({
    method: 'post',
    url: CALCULATION_URL() + `/api/assess/ydpxkhbb`,
    data: formData
  })
}

/**
 * 越限月度考核报表查询
 * @param {*} formData
 */
export function ydyxkhbb(formData) {
  return businessRequest({
    method: 'post',
    url: CALCULATION_URL() + `/api/assess/ydyxkhbb`,
    data: formData
  })
}

/**
 * 查询设备对象信息
 * @param formData
 * @returns {*}
 */
export function getAsObjectListInfo(formData) {
  return businessRequest({
    method: 'post',
    url: CALCULATION_URL() + `/api/assess/getAsObjectListInfo`,
    data: formData
  })
}

/**
 * 更新配置及关闭服务
 * @param formData
 * @returns {*}
 */
export function updateConfigAndstopApp(param) {
  return businessRequest({
    method: 'get',
    url: ASSESS_URL() + `/api/assess/stop/updateConfig?startTimeStr=${param.startTimeStr}`
  })
}

/**
 * 根据考核类型获取考核数据
 * @param param
 * @returns {*}
 */
export function getStrategyDataByType(param) {
  return businessRequest({
    method: 'post',
    url: CALCULATION_URL() + `/api/assess/getStrategyDataByType`,
    data: param
  })
}
/**
 * 日度重算统计
 * @param formData
 * @returns {*}
 */
export function reDayCalculate(param) {
  return businessRequest({
    method: 'post',
    url: ASSESS_URL() + `/api/assess/moDayCalculate/reDayCalculate`,
    data: param
  })
}

/**
 *  月度重算统计
 * @param formData
 * @returns {*}
 */
export function reMonCalculate(param) {
  return businessRequest({
    method: 'post',
    url: ASSESS_URL() + `/api/assess/moDayCalculate/reMonCalculate`,
    data: param
  })
}

/**
 * 启动服务
 * @param formData
 * @returns {*}
 */
export function startApp(formData) {
  return businessRequest({
    method: 'post',
    url: CALCULATION_URL() + `/api/start/restartApp`,
    data: formData
  })
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
  })
}

/**
 * 月度报表统计
 * @param {*} paramData
 */
export function monthStatistics(param) {
  return businessRequest({
    method: 'post',
    url: CALCULATION_URL() + `/api/assess/monthStatistics`,
    data: param
  })
}

/**
 * 月度报表统计（new）
 * @param {*} paramData
 */
export function monthStatisticsNew(param) {
  return businessRequest({
    method: 'post',
    url: CALCULATION_URL() + `/api/assess/monthStatisticsNew`,
    data: param
  })
}
