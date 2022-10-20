import { businessRequest } from '@/plugins/axios/index'
import { WORKORDER_URL } from '@/api/baseUrl'

export function findMainInfoList(data) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/woMainInfo/list',
    method: 'post',
    data: data
  })
}


/**
 * 工单类型
 * @param {Object} query
 */
export function getTypeList(data) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/woType/list',
    method: 'post',
    data: data
  })
}
/**
 * 工单类型详细
 * @param {Object} param
 */
export function getTypeInfo(param) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/woType/get',
    method: 'get',
    params: param
  })
}

/**
 * 根据工单ID查询工单类型详细
 * @param {Object} param
 */
export function getTypeInfoByWoId(param) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/woType/getByWoId',
    method: 'get',
    params: param
  })
}

/**
 * 工单类型保存
 * @param {Object} data
 */
export function saveInfo(data) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/woType/save',
    method: 'post',
    data: data
  })
}
/**
 * 工单任务类型
 * @param {Object} data
 */
export function getTypeTaskList(data) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/woTypeTask/find/list',
    method: 'get',
    params: data
  })
}
