import request from '@/utils/request'
import { EXTEND_URL } from '@/api/baseUrl'

/**
 * 查询列表数据-扩展开发
 * @param {*} params
 */
export function queryList(params) {
  return request({
    url: EXTEND_URL() + '/employeeFile/query',
    method: 'post',
    data: params
  })
}

/**
 * 删除数据
 * @param {*} params
 */
export function remove(params) {
  return request({
    url: EXTEND_URL() + '/employeeFile/remove',
    method: 'post',
    params: params
  })
}

/**
 * 逻辑删除数据
 * @param {*} params
 */
export function removeLogic(params) {
  return request({
    url: EXTEND_URL() + '/employeeFile/removeLogic',
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
    url: EXTEND_URL() + '/employeeFile/save',
    method: 'post',
    data: params
  })
}

export function createExtend(params) {
  return request({
    url: EXTEND_URL() + '/employeeFile/createEmployee',
    method: 'post',
    data: params
  })
}

export function updateExtend(params) {
  return request({
    url: EXTEND_URL() + '/employeeFile/updateEmployee',
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
    url: EXTEND_URL() + '/employeeFile/get',
    method: 'get',
    params: params
  })
}

/**
 * 获取组织人员
 * @param {*} params
 */
export function queryUserByOrg(params) {
  return request({
    url: EXTEND_URL() + '/employeeFile/queryUserByOrg',
    method: 'post',
    data: params
  })
}

/**
 * 激活员工
 * @param {*} params
 */
export function activeUser(params) {
  return request({
    url: EXTEND_URL() + '/employeeFile/activeUser',
    method: 'post',
    params: params
  })
}

/**
 * 扩展模块导入
 */
 export function importSync(data) {
    return request({
      url: EXTEND_URL() + `/extendImport/importSync`,
      method: 'post',
      data: data
    })
}
