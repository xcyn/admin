import request from '@/utils/request'
import { EXTEND_URL } from '@/api/baseUrl'

/**
 * 动态URL页面查询
 * @param {*} params
 */
export function getPagePathList(params) {
  return request({
    url: EXTEND_URL() + '/cpisPagePath/query',
    method: 'post',
    data: params
  })
}

/**
 * 根据id查询
 * @param {*} params
 */
export function queryById(params) {
  return request({
    url: EXTEND_URL() + '/cpisPagePath/queryById',
    method: 'get',
    params: params
  })
}

/**
 * 动态URL添加
 * @param {*} params
 */
export function save(params) {
  return request({
    url: EXTEND_URL() + '/cpisPagePath/save',
    method: 'post',
    data: params
  })
}

/**
 * 动态URL修改
 * @param {*} params
 */
export function update(params) {
  return request({
    url: EXTEND_URL() + '/cpisPagePath/update',
    method: 'post',
    data: params
  })
}