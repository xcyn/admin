import request from '@/utils/request'
import { EXTEND_URL } from '@/api/baseUrl'
import ActionUtils from "@/utils/action";

/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(data) {
  return request({
    url: EXTEND_URL() + '/cpisAdminOrg/query',
    method: 'post',
    data: data
  })
}
/**
 * 删除数据
 * @param {*} params
 */
export function remove(params) {
  return request({
    url: EXTEND_URL() + '/cpisAdminOrg/remove',
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
    url: EXTEND_URL() + '/cpisAdminOrg/save',
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
    url: EXTEND_URL() + '/cpisAdminOrg/get',
    method: 'get',
    params: params
  })
}

// 组织树信息
export function findTreeData(params) {
  return request({
    url: EXTEND_URL() + '/org/getCompanyOrgByCurrentUser',
    method: 'post',
    data: ActionUtils.formatParams(params)
  })
}

// 组织树信息
export function findSubCompanyTreeData(params) {
  return request({
    url: EXTEND_URL() + '/org/findSubCompanyExtend',
    method: 'post',
    data: ActionUtils.formatParams(params)
  })
}
