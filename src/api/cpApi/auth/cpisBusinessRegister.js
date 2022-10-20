import request from '@/utils/request'
import { EXTEND_URL } from '@/api/baseUrl'
import ActionUtils from '@/utils/action'

/**
 * 查询树信息
 * @param {*} params
 */
export function getTreeData(params) {
  return request({
    url: EXTEND_URL() + '/cpisBusinessRegister/findTreeData',
    params: params
  })
}
/**
 * 删除数据
 * @param {*} params
 */
export function remove(params) {
  return request({
    url: EXTEND_URL() + '/cpisBusinessRegister/remove',
    method: 'post',
    params: params
  })
}
/**
 * 保存数据
 * @param {*} params
 */
export function save(params) {
  return request({
    url: EXTEND_URL() + '/cpisBusinessRegister/save',
    method: 'post',
    data: params
  })
}

/**
 * 获取数据
 * @param {*} params
 */
export function get(params) {
  return request({
    url: EXTEND_URL() + '/cpisBusinessRegister/get',
    method: 'get',
    params: params
  })
}

// 业务树信息
export function findTreeData(params) {
  return request({
    url: EXTEND_URL() + '/cpisBusinessRegister/findTreeData',
    method: 'post',
    data: ActionUtils.formatParams(params)
  })
}
