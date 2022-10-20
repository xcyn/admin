/* *************************************************运行记录模块API*********************************************************** */
import { businessRequest } from '@/plugins/axios'
import { WORKORDER_URL } from '@/api/baseUrl'

const REST_URL_PREFIX = WORKORDER_URL() + '/api/woSprotectType'

/**
 * 查询单个
 */
export function findOne(params) {
  return businessRequest({
    url: REST_URL_PREFIX + '/find',
    method: 'get',
    params: params
  })
}

/**
 * 查询工序
 */
export function findList() {
  return businessRequest({
    url: REST_URL_PREFIX + '/list',
    method: 'get'
  })
}

/**
 * 单个保存
 */
export function save(params) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/woSpChecklist/save',
    method: 'post',
    data: params
  })
}

/**
 * 查询单个
 */
export function finPone(params) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/woSpChecklist/find',
    method: 'get',
    params: params
  })
}
