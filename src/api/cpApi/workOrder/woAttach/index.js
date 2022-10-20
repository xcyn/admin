/* ************************************************工器具模块API*********************************************************** */
import { businessRequest } from '@/plugins/axios/index'
import { WORKORDER_URL } from '@/api/baseUrl'
const REST_URL_PREFIX = WORKORDER_URL() + '/api/woAttach'

/**
 * 保存或新增
 */
export function saveOrUpdate (params) {
  return businessRequest({
    url: REST_URL_PREFIX + '/saveOrUpdate',
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
 * 查询单个
 */
export function getById (params) {
  return businessRequest({
    url: REST_URL_PREFIX + '/getById',
    method: 'get',
    params: params
  })
}

/**
 * 查询
 */
export function findList (params) {
  return businessRequest({
    url: REST_URL_PREFIX + '/findList',
    method: 'get',
    params: params
  })
}
