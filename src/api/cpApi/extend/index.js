import request from '@/utils/request'
import { EXTEND_URL, ORG_URL } from '@/api/baseUrl.js'

/**
 *  获取用户信息
 * @param {*} token
 */
export function getUserInfo(userId) {
  return request({
    url: EXTEND_URL() + '/user/userInfo',
    method: 'post',
    params: {
      userId
    }
  })
}

/**
 * 根据组织ID查询负责人
 * @param {*} params
 */
export function queryOrgManagerByOrgId(params) {
  return request({
    url: EXTEND_URL() + '/employee/queryOrgManagerByOrgId',
    method: 'get',
    params
  })
}
/**
 *根据条件所有组织
 * @param {*} token
 */
export function findAllByCondition(data) {
  return request({
    url: EXTEND_URL() + '/entity/findAllByCondition',
    method: 'post',
    data
  })
}
/**
 *根据条件所有组织
 * @param {*} token
 */
export function loginLog(data) {
  return request({
    url: EXTEND_URL() + '/loginLog/page',
    method: 'get',
    params: data
  })
}

export function importFile(data) {
  return request({
    url: EXTEND_URL() + '/cpisDiTask/import',
    method: 'post',
    data
  })
}
export function check(data) {
  return request({
    url: EXTEND_URL() + '/cpisDiTask/check',
    method: 'get',
    params: data
  })
}
export function cpisDiTaskPage(data) {
  return request({
    url: EXTEND_URL() + '/cpisDiTask/page',
    method: 'get',
    params: data
  })
}
export function cpisDeTaskPage(data) {
  return request({
    url: EXTEND_URL() + '/cpisDeTask/page',
    method: 'get',
    params: data
  })
}

export function saveCpisBusinessOpLog(data) {
  return request({
    url: EXTEND_URL() + '/CpisBusinessOpLog/save',
    method: 'post',
    data
  })
}
export function pageCpisBusinessOpLog(data) {
  return request({
    url: EXTEND_URL() + '/CpisBusinessOpLog/page',
    method: 'get',
    params: data
  })
}
export function exportFile(data) {
  return request({
    url: EXTEND_URL() + '/cpisDeTask/export',
    method: 'post',
    data
  })
}
