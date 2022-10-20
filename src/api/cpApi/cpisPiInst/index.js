import request from '@/utils/request'
import { EXTEND_URL } from '@/api/baseUrl'
import { businessRequest } from '@/plugins/axios'

/**
 * 人员接口实例页面查询
 * @param {*} params
 */
export function getPiInstList(params) {
  return request({
    url: EXTEND_URL() + '/cpisPiInst/query',
    method: 'post',
    data: params
  })
}

/**
 * 根据id查询
 * @param {*} params
 */
export function queryById(params) {
  return request({
    url: EXTEND_URL() + '/cpisPiInst/queryById',
    method: 'get',
    params: params
  })
}

/**
 * 根据instKey查询
 * @param {*} params
 */
export function getInterfaceInst(params) {
  return request({
    url: EXTEND_URL() + '/cpisPiInst/getInterfaceInst',
    method: 'get',
    params: params
  })
}

/**
 * 根据instKeys查询
 * @param {*} params
 */
export function getInterfaceInstList(params) {
  return request({
    url: EXTEND_URL() + '/cpisPiInst/getInterfaceInstList',
    method: 'get',
    params: params
  })
}

/**
 * 人员接口实例添加
 * @param {*} params
 */
export function save(params) {
  return request({
    url: EXTEND_URL() + '/cpisPiInst/save',
    method: 'post',
    data: params
  })
}

/**
 * 人员接口实例修改
 * @param {*} params
 */
export function update(params) {
  return request({
    url: EXTEND_URL() + '/cpisPiInst/update',
    method: 'post',
    data: params
  })
}
