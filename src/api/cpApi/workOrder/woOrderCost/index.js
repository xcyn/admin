/* *************************************************运行记录模块API*********************************************************** */
import { businessRequest } from '@/plugins/axios'
import { WORKORDER_URL } from '@/api/baseUrl'

const REST_URL_PREFIX = WORKORDER_URL() + '/api/woOrderCost'

/**
 * 单个保存
 */
export function save(params) {
  return businessRequest({
    url: REST_URL_PREFIX + '/save',
    method: 'post',
    data: params
  })
}

/**
 * 查询
 */
export function findList(params) {
  return businessRequest({
    url: REST_URL_PREFIX + '/find/list',
    method: 'get',
    params: params
  })
}

/**
 * 保存获取汇总统计数据
 */
export function saveStatisData(params) {
  return businessRequest({
    url: REST_URL_PREFIX + '/saveStatisData',
    method: 'get',
    params: params
  })
}
