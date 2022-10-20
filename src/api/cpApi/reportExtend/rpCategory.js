import request from '@/utils/request'
const REPORT_URL = '/extend/v3'

/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(data) {
  return request({
    url: REPORT_URL + '/rpCategory/query',
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
    url: REPORT_URL + '/rpCategory/remove',
    method: 'get',
    params
  })
}

/**
 * 保存数据
 * @param {*} params
 */
export function saveRpCategory(params) {
  return request({
    url: REPORT_URL + '/rpCategory/save',
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
    url: REPORT_URL + '/rpCategory/get',
    method: 'get',
    params: params
  })
}

/**
 * 模板分类-获得顶级模板分类列表
 * @param params
 * @returns {*}
 */
export function getTopTreeList(params) {
  return request({
    url: REPORT_URL + '/rpCategory/getTopTreeList',
    method: 'get',
    params
  })
}

/**
 * 模板分类-根据模板分类id查询下级模板分类列表
 * @param params
 * @returns {*}
 */
export function getSubTreeList(params) {
  return request({
    url: REPORT_URL + '/rpCategory/getSubTreeList',
    method: 'get',
    params
  })
}

/**
   * 通过编码查询模板分类是否已存在
   * @param {*} param
   */
export function isExistsByCatNo(catNo) {
  return request({
    url: REPORT_URL + `/rpCategory/isExistsByCatNo?catNo=${catNo}`,
    method: 'get'
  })
}

/**
 * 通过序号查询模板分类是否已存在
 * @param {*} param
 */
export function isExistsBySortNo(sortNo) {
  return request({
    url: REPORT_URL + `/rpCategory/isExistsBySortNo?sortNo=${sortNo}`,
    method: 'get'
  })
}
