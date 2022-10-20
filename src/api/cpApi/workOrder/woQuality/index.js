/* *************************************************签证单模块API*********************************************************** */
import { businessRequest } from '@/plugins/axios/index'
import { WORKORDER_URL } from '@/api/baseUrl'

const REST_URL_PREFIX = WORKORDER_URL() + '/api/woQualityPoint'

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



/**
 * 查询角色
 */
export function checkerList (params) {
  return businessRequest({
    url: REST_URL_PREFIX + '/find/checkerList',
    method: 'get',
    params: params
  })
}

/**
 * 查询工单质量签证单
 */
export function pointList (params) {
  return businessRequest({
    url: REST_URL_PREFIX + '/find/pointList',
    method: 'get',
    params: params
  })
}



