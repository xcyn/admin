import request from '@/utils/request'
import { EXTEND_URL } from '@/api/baseUrl'

/**
 * 查询列表
 */
export function getPageList(query) {
  return request({
    url: EXTEND_URL() + '/cpisAppVersion/getPageList',
    method: 'post',
    data: query
  })
}

/**
 * 新增
 */
export function add(query) {
  return request({
    url: EXTEND_URL() + '/cpisAppVersion/save',
    method: 'post',
    data: query
  })
}

/**
 * 删除
 */
export function remove(id) {
  return request({
    url: EXTEND_URL() + '/cpisAppVersion/remove',
    method: 'get',
    params: { id }
  })
}
