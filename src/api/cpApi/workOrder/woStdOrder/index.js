/**
 *********************************************************************************************************
 *  @author           毛金炼
 *  @description      标准工单API
 *  @how2use:         import * as woStdOrderAPI from '@/api/cpApi/workOrder/woStdOrder/index.js';
 *********************************************************************************************************
 */
import { businessRequest } from '@/plugins/axios/index'
import { WORKORDER_URL } from '@/api/baseUrl'
/**
 * 获取全部列表
 * @param {Object} query
 */
export function listAll () {
  return businessRequest({
    url: WORKORDER_URL() + '/api/WoStdOrderInfo/list/all',
    method: 'get'
  })
}
/**
 * 分页列表
 * @param {Object} query
 */
export function findPage (query) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/WoStdOrderInfo/list',
    method: 'post',
    data: query
  })
}
/**
 * 新增
 * @param {Object} params
 */
export function add (params) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/WoStdOrderInfo/add',
    method: 'post',
    data: params
  })
}
/**
 * 更新
 * @param {Object} params
 */
export function update (params) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/WoStdOrderInfo/update',
    method: 'post',
    data: params
  })
}
/**
 * 查询单条数据
 * @param {Object} params
 */
export function get (params) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/WoStdOrderInfo/getOne',
    method: 'get',
    params: params
  })
}
/**
 * 复制数据
 * @param {Object} params
 */
export function copy (params) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/WoStdOrderInfo/copy',
    method: 'post',
    params: params
  })
}
