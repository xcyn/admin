/* *************************************************外包服务公共模块API*********************************************************** */
import { businessRequest } from '@/plugins/axios/index'
import { WORKORDER_URL } from '@/api/baseUrl'

const RATE_URL_PREFIX = WORKORDER_URL() + '/api/woServiceList' // 外包服务费率

/**
 * 单个保存
 */
export function save (params) {
  return businessRequest({
    url: RATE_URL_PREFIX + '/save',
    method: 'post',
    data: params
  })
}


/**
 * 单体删除
 */
export function remove (params) {
  return businessRequest({
    url: RATE_URL_PREFIX + '/remove',
    method: 'get',
    params: params
  })
}


/**
 * 单体修改
 */
export function update (params) {
  return businessRequest({
    url: RATE_URL_PREFIX + '/update',
    method: 'post',
    data: params
  })
}


/**
 * 查询单个
 */
export function findOne (params) {
  return businessRequest({
    url: RATE_URL_PREFIX + '/find',
    method: 'get',
    params: params
  })
}

/**
 * 查询列表
 */
export function findList (params) {
  return businessRequest({
    url: RATE_URL_PREFIX + '/find/list',
    method: 'get',
    params: params
  })
}

/**
 * 查询分页
 */
export function findPage (params) {
  return businessRequest({
    url: RATE_URL_PREFIX + '/find/page',
    method: 'get',
    params: params
  })
}