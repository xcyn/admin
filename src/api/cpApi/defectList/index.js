import { businessRequest } from '@/plugins/axios/index'
import { WORKORDER_URL } from '@/api/baseUrl'

/**
 * @param {Object} query
 */
export function GetList(query) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/defectInfo/list',
    method: 'get',
    params: query
  })
}

/**
 * @param {Object} query
 */
export function add(query) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/defectInfo/add',
    method: 'post',
    data: query
  })
}

/**
 * 添加(包含工单)
 * @param {Object} query
 */
export function addAndOrder(query) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/defectInfo/addAndOrder',
    method: 'post',
    data: query
  })
}

/**
 * @param {Object} query
 */
export function initData(query) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/defectInfo/init',
    method: 'get',
    params: query
  })
}

/**
 * @param {Object} query
 */
export function updateStatus(query) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/defectInfo/updateDefectStatus',
    method: 'get',
    params: query
  })
}

/**
 * 缺陷综合查询
 * @param {Object} query
 */
export function commonList(query) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/defectInfo/commonList',
    method: 'post',
    data: query
  })
}

/**
 * 缺陷统计分析
 * @param {Object} query
 */
export function statisticList(query) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/defectInfo/statisticList',
    method: 'get',
    params: query
  })
}

/**
 * @param {Object} query
 */
export function deleteInfo(query) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/defectInfo/deleteInfo',
    method: 'post',
    data: query
  })
}

/**
 * @param {Object} query
 * 添加子流程变更信息
 */
export function addChangeRecord(query) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/defectInfo/addChangeRecord',
    method: 'post',
    data: query
  })
}

/**
 * @param {Object} query
 * 添加子流程审批记录
 */
export function addChangeApproveRecord(query) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/defectInfo/addChangeApproveRecord',
    method: 'post',
    data: query
  })
}

/**
 * @param {Object} query
 */
export function getApproveOperateInfo(query) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/defectInfo/getApproveOperateInfo',
    method: 'get',
    params: query
  })
}

export function addWorkpicket(query) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/dfWorkpicket/add',
    method: 'post',
    data: query
  })
}

/**
 * @param {Object} query
 */
export function update(query) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/defectInfo/update',
    method: 'POST',
    data: query
  })
}

/**
 * 添加工单
 * @param {Object} query
 */
export function addOrder(query) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/defectInfo/addOrder',
    method: 'post',
    data: query
  })
}

/**
 * 工作票终结,缺陷自动终结
 * @param {Object} query
 */
export function workTicketHasFinished(wtId) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/defectInfo/end/' + `${wtId}`,
    method: 'post'
  })
}

export function saveWoId(data) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/defectInfo/saveWoId',
    method: 'post',
    data: data
  })
}
export function changeMajor(dfId,type) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/defectInfo/changeMajor/' + dfId +'/'+type,
    method: 'post'
  })
}

