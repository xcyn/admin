import { businessRequest } from '@/plugins/axios/index'
import { WORKORDER_URL } from '@/api/baseUrl'

/**
 * 查询检修报告列表分页
 * @param {Object} data
 */
export function findPage (data) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/woMtnReport/list',
    method: 'get',
    params: data
  })
}

/**
 * 查询检修报告详情
 * @param {Object} data
 */
export function get (data) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/woMtnReport/get',
    method: 'get',
    params: data
  })
}
/**
 * 检修报告新增
 * @param {Object} data
 */
export function add (data) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/woMtnReport/add',
    method: 'post',
    data: data
  })
}
/**
 * 检修报告修改
 * @param {Object} data
 */
export function update (data) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/woMtnReport/update',
    method: 'post',
    data: data
  })
}
/**
 * 检修报告删除
 * @param {Object} data
 */
export function del (data) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/woMtnReport/delete',
    method: 'post',
    params: data
  })
}