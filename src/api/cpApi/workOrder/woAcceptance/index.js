/* ************************************************工器具模块API*********************************************************** */
import { businessRequest } from '@/plugins/axios/index'
import { WORKORDER_URL } from '@/api/baseUrl'
const REST_URL_PREFIX = WORKORDER_URL() + '/api/woAcceptance'

/**
 * 验收卡保存
 */
export function saveAcceptance (params) {
  return businessRequest({
    url: REST_URL_PREFIX + '/saveAcceptance',
    method: 'POST',
    data: params
  })
}

/**
 * 验收卡模板查询
 */
export function findAccTemplate () {
  return businessRequest({
    url: REST_URL_PREFIX + `/findAccTemplate`,
    method: 'get'
  })
}

/**
 * 完工验收卡信息查询
 */
export function findAcceptance (params) {
  return businessRequest({
    url: REST_URL_PREFIX + `/findAcceptance`,
    method: 'get',
    params: params
  })
}

/**
 * 验收信息查询
 */
export function getAcc (params) {
  return businessRequest({
    url: REST_URL_PREFIX + `/getAcc`,
    method: 'get',
    params: params
  })
}
