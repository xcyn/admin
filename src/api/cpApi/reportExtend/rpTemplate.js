import request from '@/utils/request'
const TEMPLATE_URL = '/extend/v3'

/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(data) {
  return request({
    url: TEMPLATE_URL + '/rpTemplate/query',
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
    url: TEMPLATE_URL + '/rpTemplate/remove',
    method: 'get',
    params
  })
}
/**
 * 保存数据
 * @param {*} params
 */
export function saveRpTemplate(params) {
  return request({
    url: TEMPLATE_URL + '/rpTemplate/save',
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
    url: TEMPLATE_URL + '/rpTemplate/get',
    method: 'get',
    params: params
  })
}

/**
   * 获取最大序号
   * @param {*} params
   */
export function getMaxNo(params) {
  return request({
    url: TEMPLATE_URL + '/rpTemplate/getMaxNo',
    method: 'get',
    params: params
  })
}
