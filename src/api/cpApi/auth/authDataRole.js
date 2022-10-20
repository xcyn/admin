import request from '@/utils/request'
import { EXTEND_URL } from '@/api/baseUrl'

/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(data) {
  return request({
    url: EXTEND_URL() + '/authDataRole/query',
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
    url: EXTEND_URL() + '/authDataRole/remove',
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
    url: EXTEND_URL() + '/authDataRole/save',
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
    url: EXTEND_URL() + '/authDataRole/get',
    method: 'get',
    params: params
  })
}

/**
 * 根据角色id获取数据
 * @param {*} roleId
 * @param {*} bizId
 */
export function getByRoleIdAndBizId(roleId, bizId) {
  return request({
    url: EXTEND_URL() + '/authDataRole/getByRoleIdAndBizId',
    method: 'get',
    params: {
      'roleId': roleId,
      'bizId': bizId
    }
  })
}
