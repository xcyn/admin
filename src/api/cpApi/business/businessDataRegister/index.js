import request from '@/utils/request'
import { EXTEND_URL } from '@/api/baseUrl'
import ActionUtils from '@/utils/action'

/**
 * 查询列表数据
 * @param {*} params
 */
export function queryList(data) {
  return request({
    url: EXTEND_URL() + '/cpisBusinessDataRegister/queryList',
    method: 'get',
    data: data
  })
}
/**
 * 删除数据
 * @param {*} params
 */
export function delById(params) {
  return request({
    url: EXTEND_URL() + '/cpisBusinessDataRegister/delById',
    method: 'post',
    params: params
  })
}
/**
 * 保存数据
 * @param {*} params
 */
export function saveMapping(params) {
  return request({
    url: EXTEND_URL() + '/cpisBusinessStateMapping/saveMapping',
    method: 'post',
    params: params
  })
}

/**
 * 保存数据
 * @param {*} params
 */
export function saveRegsiter(params) {
  return request({
    url: EXTEND_URL() + '/cpisBusinessDataRegister/saveRegsiter',
    method: 'post',
    data: params
  })
}

/**
 * 获取数据
 * @param {*} params
 */
export function getByBusinessDataCode(params) {
  return request({
    url: EXTEND_URL() + '/cpisBusinessStateMapping/getByBusinessDataCode',
    method: 'get',
    params: params
  })
}

// 树信息
export function findTreeData(params) {
  return request({
    url: EXTEND_URL() + '/cpisBusinessDataRegister/findTreeData',
    method: 'get',
    data: ActionUtils.formatParams(params)
  })
}
