import request from '@/utils/request'
import { EXTEND_URL } from '@/api/baseUrl'

/**
 * 流水配置表页面查询
 * @param {*} params
 */
export function query(params) {
  return request({
    url: EXTEND_URL() + '/CpisSerial/query',
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
    url: EXTEND_URL() + '/CpisSerial/queryById',
    method: 'get',
    params: params
  })
}

/**
 * 流水配置表添加
 * @param {*} params
 */
export function save(params) {
  return request({
    url: EXTEND_URL() + '/CpisSerial/save',
    method: 'post',
    data: params
  })
}

/**
 * 流水配置表修改
 * @param {*} params
 */
export function update(params) {
  return request({
    url: EXTEND_URL() + '/CpisSerial/update',
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
    url: EXTEND_URL() + '/CpisSerial/deleteById',
    method: 'get',
    params: params
  })
}
