import request from '@/utils/request'
const CPISROLEORG_URL = '/extend/v3'

/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(data) {
  return request({
    url: CPISROLEORG_URL + '/cpisRoleOrg/query',
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
    url: CPISROLEORG_URL + '/cpisRoleOrg/remove',
    method: 'post',
    params: params
  })
}
/**
 * 保存数据
 * @param {*} params
 */
export function saveRoleOrg(params) {
  return request({
    url: CPISROLEORG_URL + '/cpisRoleOrg/save',
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
    url: CPISROLEORG_URL + '/cpisRoleOrg/get',
    method: 'get',
    params: params
  })
}

export function getByRoleId(params) {
  return request({
    url: CPISROLEORG_URL + '/cpisRoleOrg/getByRoleId',
    method: 'get',
    params: params
  })
}


