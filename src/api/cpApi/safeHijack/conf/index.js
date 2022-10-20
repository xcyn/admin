import request from '@/utils/request'
import { EXTEND_URL } from '@/api/baseUrl'

/**
 * 防劫持配置页面查询
 * @param {*} params
 */
export function query(params) {
  return request({
    url: EXTEND_URL() + '/CpisSafeHijackConf/query',
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
    url: EXTEND_URL() + '/CpisSafeHijackConf/queryById',
    method: 'get',
    params: params
  })
}

/**
 * 防劫持配置添加
 * @param {*} params
 */
export function save(params) {
  return request({
    url: EXTEND_URL() + '/CpisSafeHijackConf/save',
    method: 'post',
    data: params
  })
}

/**
 * 防劫持配置修改
 * @param {*} params
 */
export function update(params) {
  return request({
    url: EXTEND_URL() + '/CpisSafeHijackConf/update',
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
    url: EXTEND_URL() + '/CpisSafeHijackConf/deleteById',
    method: 'get',
    params: params
  })
}