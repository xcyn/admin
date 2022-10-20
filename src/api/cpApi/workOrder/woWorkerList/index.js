/* ************************************************工种模块API*********************************************************** */
import { businessRequest } from '@/plugins/axios/index'
import { WORKORDER_URL } from '@/api/baseUrl'
const REST_URL_PREFIX = WORKORDER_URL() + '/api/woWorkerList'

/**
 * 保存
 */
export function save (params) {
  return businessRequest({
    url: REST_URL_PREFIX + '/save',
    method: 'post',
    data: params
  })
}

/**
 * 删除
 */
export function remove (params) {
  return businessRequest({
    url: REST_URL_PREFIX + '/remove',
    method: 'get',
    params: params
  })
}

/**
 * 修改
 */
export function update (params) {
  return businessRequest({
    url: REST_URL_PREFIX + '/update',
    method: 'post',
    data: params
  })
}

/**
 * 查询单个
 */
export function findOne (params) {
  return businessRequest({
    url: REST_URL_PREFIX + '/find',
    method: 'get',
    params: params
  })
}

/**
 * 查询工序
 */
export function findList (params) {
  return businessRequest({
    url: REST_URL_PREFIX + '/find/list',
    method: 'get',
    params: params
  })
}
