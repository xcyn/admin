import request from '@/utils/request'
const REPORT_URL = '/extend/v3'

/**
 * 查询列表数据
 * @param {*} params
 */
/* export function queryPageList(data) {
  return request({
    url: REPORT_URL + '/rpReport/query',
    method: 'post',
    data: data
  })
} */
/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(data) {
  return request({
    url: REPORT_URL + '/rpReport/query',
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
    url: REPORT_URL + '/rpReport/remove',
    method: 'get',
    params
  })
}
/**
 * 保存数据
 * @param {*} params
 */
export function saverpReport(params) {
  return request({
    url: REPORT_URL + '/rpReport/save',
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
    url: REPORT_URL + '/rpReport/get',
    method: 'get',
    params: params
  })
}

/**
 * 判断重复
 * @param params
 * @returns {*}
 */
export function judgeRepeat(params) {
  return request({
    url: REPORT_URL + '/rpReport/judgeRepeat',
    method: 'post',
    data: params
  })
}
