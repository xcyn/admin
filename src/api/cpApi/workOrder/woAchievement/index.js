/* ************************************************工器具模块API*********************************************************** */
import { businessRequest } from '@/plugins/axios/index'
import { WORKORDER_URL } from '@/api/baseUrl'
const REST_URL_PREFIX = WORKORDER_URL() + '/api/woAchievement'

/**
 * 保存或新增
 */
export function saveOrUpdate (params) {
  return businessRequest({
    url: REST_URL_PREFIX + '/saveAchievement',
    method: 'post',
    data: params
  })
}

/**
 * 删除
 */
export function remove (id) {
  return businessRequest({
    url: REST_URL_PREFIX + `/remove?id=${id}`,
    method: 'get'
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
