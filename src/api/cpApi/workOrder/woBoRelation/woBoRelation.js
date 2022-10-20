/**
 *********************************************************************************************************
 *  @author           马冰冰
 *  @description      工单业务对象关联关系
 *********************************************************************************************************
 */
import { businessRequest } from '@/plugins/axios/index'
import { CALCULATION_URL, WORKORDER_URL } from '@/api/baseUrl'

const REST_URL_PREFIX = WORKORDER_URL() + '/api/woBoRelation'

/**
 * 列表查询
 */
export function getList (params) {
  return businessRequest({
    url: REST_URL_PREFIX + '/list',
    method: 'POST',
    data: params
  })
}


export function add (params) {
  return businessRequest({
    url: REST_URL_PREFIX + '/add',
    method: 'POST',
    data: params
  })
}


export function getWoId (params) {
  return businessRequest({
    url: REST_URL_PREFIX + '/getWoId',
    method: 'POST',
    data: params
  })
}


/**
 * 通过id获取关联关系数据
 * @param {*} ids
 */
export function findListByBoIds(ids) {
  return businessRequest({
    url: REST_URL_PREFIX + '/findListByBoIds',
    method: 'post',
    data: ids
  })
}

