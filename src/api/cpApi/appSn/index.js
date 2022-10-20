import request from '@/utils/request'
import { EXTEND_URL } from '@/api/baseUrl'

/**
 * app授权查询
 * @param {*} params
 */
export function query(params) {
  return request({
    url: EXTEND_URL() + '/CpisAppSn/query',
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
    url: EXTEND_URL() + '/CpisAppSn/queryById',
    method: 'get',
    params: params
  })
}

/**
 * app授权添加
 * @param {*} params
 */
export function save(params) {
  return request({
    url: EXTEND_URL() + '/CpisAppSn/save',
    method: 'post',
    data: params
  })
}

/**
 * app授权修改
 * @param {*} params
 */
export function update(params) {
  return request({
    url: EXTEND_URL() + '/CpisAppSn/update',
    method: 'post',
    data: params
  })
}

/**
 * 根据id删除
 * @param {*} params
 */
export function deleteById(params) {
  return request({
    url: EXTEND_URL() + '/CpisAppSn/deleteById',
    method: 'get',
    params: params
  })
}