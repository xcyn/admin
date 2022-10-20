import request from '@/utils/request'
import * as timeAPI from '@/api/cpApi/twoTickets/time'
import moment from 'moment'
const CPISBPMBIZ_URL = '/extend/v3'

/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(data) {
  return request({
    url: CPISBPMBIZ_URL + '/cpisBpmBiz/query',
    method: 'post',
    data: data
  })
}
export function getList(data) {
  return request({
    url: CPISBPMBIZ_URL + '/cpisBpmBiz/getList',
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
    url: CPISBPMBIZ_URL + '/cpisBpmBiz/remove',
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
    url: CPISBPMBIZ_URL + '/cpisBpmBiz/save',
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
    url: CPISBPMBIZ_URL + '/cpisBpmBiz/get',
    method: 'get',
    params: params
  })
}


/**
 * 获取数据
 * @param {*} params
 */
export function getByDefKey(params) {
  return request({
    url: CPISBPMBIZ_URL + '/cpisBpmBiz/getByDefKey',
    method: 'get',
    params: params
  })
}

export async function isConfigBpmBizState(defKey){
  let result = await getByDefKey({
    defKey: defKey
  })
  return result?.data
}
