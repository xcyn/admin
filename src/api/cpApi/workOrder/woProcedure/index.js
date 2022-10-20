/* *************************************************工序模块API*********************************************************** */
import { businessRequest } from '@/plugins/axios/index'
import { WORKORDER_URL } from '@/api/baseUrl'

const REST_URL_PREFIX = WORKORDER_URL() + '/api/woProcedure'

/**
 * 单个保存
 */
export function save (params) {
  return businessRequest({
    url: REST_URL_PREFIX + '/save',
    method: 'post',
    data: params
  })
}

/**
 *  批量保存
 */
export function saveList (params) {
  return businessRequest({
    url: REST_URL_PREFIX + '/save/list',
    method: 'post',
    data: params
  })
}

export function saveListHasChildren (params) {
  return businessRequest({
    url: REST_URL_PREFIX + '/save/listHasChild',
    method: 'post',
    data: params
  })
}


/**
 * 单体删除
 */
export function remove (params) {
  return businessRequest({
    url: REST_URL_PREFIX + '/remove',
    method: 'get',
    params: params
  })
}

/**
 * 批量删除
 */
export function removeList (params) {
  return businessRequest({
    url: REST_URL_PREFIX + '/remove/list',
    method: 'get',
    params: params
  })
}

/**
 * 单体修改
 */
export function update (params) {
  return businessRequest({
    url: REST_URL_PREFIX + '/update',
    method: 'post',
    data: params
  })
}

/**
 * 批量修改
 */
export function updateList (params) {
  return businessRequest({
    url: REST_URL_PREFIX + '/update/list',
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

/**
 * 查询工序
 */
export function listHasChild (params) {
  return businessRequest({
    url: REST_URL_PREFIX + '/find/listHasChild',
    method: 'get',
    params: params
  })
}

/**
 * 查询工序
 */
export function findListQuery (params) {
  return businessRequest({
    url: REST_URL_PREFIX + '/find/query',
    method: 'get',
    params: params
  })
}

/**
 * 查询工序
 */
export function findListQueryByWoId (params) {
  return businessRequest({
    url: REST_URL_PREFIX + '/find/queryByWoId',
    method: 'get',
    params: params
  })
}



