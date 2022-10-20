/**
 *********************************************************************************************************
 *  @author           毛金炼
 *  @description      工单API
 *  @how2use:         import * as woOrderAPI from '@/api/cpApi/workOrder/woOrderInfo/index.js';
 *********************************************************************************************************
 */
import { businessRequest } from '@/plugins/axios/index'
import { WORKORDER_URL } from '@/api/baseUrl'

/**
 * 获取全部列表
 * @param {Object} query
 */
export function listAll() {
  return businessRequest({
    url: WORKORDER_URL() + '/api/woOrderInfo/listAll',
    method: 'get'
  })
}
/**
 * 分页列表
 * @param {Object} query
 */
export function findPage(query) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/woOrderInfo/list',
    method: 'post',
    data: query
  })
}
/**
 * 获取合计信息
 * @param {Object} query
 */
export function getTotalInfo(query) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/woOrderInfo/getTotalInfo',
    method: 'post',
    params: query
  })
}
/**
 * 新增
 * @param {Object} params
 */
export function add(params) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/woOrderInfo/add',
    method: 'post',
    data: params
  })
}
/**
 * 更新
 * @param {Object} params
 */
export function update(params) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/woOrderInfo/update',
    method: 'post',
    data: params
  })
}
/**
 * 更新状态
 * @param {Object} params
 */
export function updateState(params) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/woOrderInfo/updateState',
    method: 'post',
    data: params
  })
}
/**
 * 删除(物理)
 * @param {Object} params
 */
export function deleteWoOrder(params) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/woOrderInfo/delete',
    method: 'post',
    params: params
  })
}
/**
 * 删除(逻辑)
 * @param {Object} params
 */
export function deleteWoOrderByLogic(params) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/woOrderInfo/delete',
    method: 'post',
    data: params
  })
}
/**
 * 查询单条数据
 * @param {Object} params
 */
export function get(params) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/woOrderInfo/get',
    method: 'get',
    params: params
  })
}

export function addByStd(params) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/woOrderInfo/addByStd',
    method: 'post',
    data: params
  })
}

/**
 * 查询统计数据
 * @param {Object} params
 */
export function getData(params) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/woOrderInfo/getStatisData',
    method: 'post',
    params: params
  })
}

/**
 * @param {Object} query
 */
export function updateStatus(query) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/woOrderInfo/updateWoOrderStatus',
    method: 'get',
    params: query
  })
}
