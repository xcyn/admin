/**
 *********************************************************************************************************
 *  @author           马冰冰
 *  @description      定期任务分类API
 *  @how2use:         import * as pwCategoryApi from '@/api/cpApi/regularWork/category/index.js';
 *********************************************************************************************************
 */
import { businessRequest } from '@/plugins/axios/index'
import { WORKORDER_URL } from '@/api/baseUrl'
const REST_URL_PREFIX = WORKORDER_URL() + '/api/pwCategory'

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
 *  批量增更
 */
export function addOrUpdateList (params) {
  return businessRequest({
    url: REST_URL_PREFIX + '/addOrUpdate/list',
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
    method: 'post',
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
 * 查询所有
 */
export function findAll (params) {
  return businessRequest({
    url: REST_URL_PREFIX + '/find/all',
    method: 'get',
    params: params
  })
}

/**
 * 查询子类
 */
export function findSub (id) {
  return businessRequest({
    url: REST_URL_PREFIX + '/find/sub?cgyId=' + id,
    method: 'get'
  })
}

/**
 * 查询子类数量
 */
export function findSubCount (id) {
  return businessRequest({
    url: REST_URL_PREFIX + '/find/sub/count?cgyId=' + id,
    method: 'get'
  })
}

/**
 * 查询子类数量
 */
export function findPlanCount (id) {
  return businessRequest({
    url: REST_URL_PREFIX + '/find/plan/count?cgyId=' + id,
    method: 'get'
  })
}
