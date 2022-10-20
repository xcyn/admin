import request from '@/utils/request'
import { EXTEND_URL } from '@/api/baseUrl'

/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(data) {
  return request({
    url: EXTEND_URL() + '/authDataRoleGlobal/query',
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
    url: EXTEND_URL() + '/authDataRoleGlobal/remove',
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
    url: EXTEND_URL() + '/authDataRoleGlobal/save',
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
    url: EXTEND_URL() + '/authDataRoleGlobal/get',
    method: 'get',
    params: params
  })
}

/**
 * 根据角色id获取数据
 * @param {*} params
 */
export function getByRoleId(roleId) {
  return request({
    url: EXTEND_URL() + '/authDataRoleGlobal/getByRoleId',
    method: 'get',
    params: {
      'roleId': roleId
    }
  })
}
