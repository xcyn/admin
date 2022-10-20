import request from '@/utils/request'
const CPISBPMBIZSTATE_URL = '/extend/v3'

/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(data) {
  return request({
    url: CPISBPMBIZSTATE_URL + '/cpisBpmBizState/query',
    method: 'post',
    data: data
  })
}
/**
 * 删除数据
 * @param {*} params
 */
export function remove(params) {
  return request({
    url: CPISBPMBIZSTATE_URL + '/cpisBpmBizState/remove',
    method: 'post',
    params: params
  })
}
/**
 * 保存数据
 * @param {*} params
 */
export function save(params) {
  return request({
    url: CPISBPMBIZSTATE_URL + '/cpisBpmBizState/save',
    method: 'post',
    data: params
  })
}

/**
 * 获取数据
 * @param {*} params
 */
export function get(params) {
  return request({
    url: CPISBPMBIZSTATE_URL + '/cpisBpmBizState/get',
    method: 'get',
    params: params
  })
}
