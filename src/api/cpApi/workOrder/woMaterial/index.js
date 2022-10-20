/* *************************************************物资模块API*********************************************************** */
import { businessRequest } from '@/plugins/axios/index'
import { WORKORDER_URL } from '@/api/baseUrl'

const REST_URL_PREFIX = WORKORDER_URL() + '/api/woMaterial'

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
 * 单体删除
 */
export function remove (params) {
  return businessRequest({
    url: REST_URL_PREFIX + '/remove',
    method: 'POST',
    data: params
  })
}

/**
 * 批量删除
 */
export function removeList (params) {
  return businessRequest({
    url: REST_URL_PREFIX + '/remove/list',
    method: 'POST',
    data: params
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
 * 物料-查询汇总列表
 */
export function findTotalList (params) {
  return businessRequest({
    url: REST_URL_PREFIX + '/findTotalList',
    method: 'post',
    data: params
  })
}

/**
 * 物料-查询详细明细列表
 */
export function findInfoList (params) {
  return businessRequest({
    url: REST_URL_PREFIX + '/findInfoList',
    method: 'post',
    data: params
  })
}

/**
 * 物料-修改数量
 */
export function updateByMaterial (params) {
  return businessRequest({
    url: REST_URL_PREFIX + '/updateByMaterial',
    method: 'post',
    data: params
  })
}
