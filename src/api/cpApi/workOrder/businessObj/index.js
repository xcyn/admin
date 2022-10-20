import { businessRequest } from '@/plugins/axios/index'
import { WORKORDER_URL } from '@/api/baseUrl'
/**
 * 业务对象保存
 * @param {Object} data
 */
export function saveInfo (data) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/woBoType/save',
    method: 'post',
    data: data
  })
}

/**
 * 业务对象查询
 * @param {Object} data
 */
export function getTypeList (data) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/woBoType/list',
    method: 'get',
    params: data
  })
}
/**
 * 业务对象查询(单个)
 * @param {Object} data
 */
export function getBoType (data) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/woBoType/get',
    method: 'get',
    params: data
  })
}

/**
 * 业务对象状态查询
 * @param {Object} data
 */
export function findBoTypeState (data) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/woBoTypeState/list',
    method: 'get',
    params: data
  })
}

/**
 * 业务对象状态保存
 * @param {Object} data
 */
export function saveBoTypeState (data) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/woBoTypeState/save',
    method: 'post',
    data: data
  })
}
/**
 * 业务对象关联信息查询
 * @param {Object} data
 */
export function findBoRelations (data) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/woBoRelation/list',
    method: 'post',
    data: data
  })
}