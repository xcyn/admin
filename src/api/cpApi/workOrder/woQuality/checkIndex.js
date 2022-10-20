/* *************************************************工序模块API*********************************************************** */
import { businessRequest } from '@/plugins/axios/index'
import { WORKORDER_URL } from '@/api/baseUrl'

const REST_URL_PREFIX = WORKORDER_URL() + '/api/woQualityCheck'

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
 * 查询单个
 */
export function findOne (params) {
  return businessRequest({
    url: REST_URL_PREFIX + '/find',
    method: 'get',
    params: params
  })
}

export function findCheckList (params) {
  return businessRequest({
    url: REST_URL_PREFIX + '/find/checkList',
    method: 'get',
    params: params
  })
}

export function checkListByIds (params) {
  return businessRequest({
    url: REST_URL_PREFIX + '/find/checkListByIds',
    method: 'post',
    data: params
  })
}

