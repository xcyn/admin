import request from '@/utils/request'
import { EXTEND_URL } from '@/api/baseUrl'

/**
 * 查询列表数据
 * @param {*} params
 */
export function query(data) {
  return request({
    url: EXTEND_URL() + '/authDataItems/query',
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
    url: EXTEND_URL() + '/authDataItems/remove',
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
    url: EXTEND_URL() + '/authDataItems/save',
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
    url: EXTEND_URL() + '/authDataItems/get',
    method: 'get',
    params: params
  })
}

/**
 * 获取数据权限字段数据
 * @param {*} bizId
 * @param {*} type
 */
export function getDataColKey(bizId, type) {
  return request({
    url: EXTEND_URL() + '/authDataItems/getDataColKey',
    method: 'get',
    params: {
      'bizId': bizId,
      'type': type
    }
  })
}
