/* ************************************************工器具模块API*********************************************************** */
import { businessRequest } from '@/plugins/axios/index'
import { WORKORDER_URL } from '@/api/baseUrl'
const REST_URL_PREFIX = WORKORDER_URL() + '/api/woToolList'

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
 * 查询
 */
export function findOne (params) {
  return businessRequest({
    url: REST_URL_PREFIX + '/find',
    method: 'get',
    params: params
  })
}

/**
 * 查询
 */
export function findPage (params) {
  return businessRequest({
    url: REST_URL_PREFIX + '/find/page',
    method: 'get',
    params: params
  })
}

/**
 * 查询
 */
export function findToolList (params) {
  return businessRequest({
    url: REST_URL_PREFIX + '/find/list',
    method: 'get',
    params: params
  })
}
