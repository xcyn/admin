import request from '@/utils/request'
const CPISBPMPSBS_URL = '/extend/v3'

/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(data) {
  return request({
    url: CPISBPMPSBS_URL + '/cpisBpmPsBs/query',
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
    url: CPISBPMPSBS_URL + '/cpisBpmPsBs/remove',
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
    url: CPISBPMPSBS_URL + '/cpisBpmPsBs/save',
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
    url: CPISBPMPSBS_URL + '/cpisBpmPsBs/get',
    method: 'get',
    params: params
  })
}


/**
 * 获取数据
 * @param {*} params
 */
export function getFlowStateByBizKey(params) {
  return request({
    url: CPISBPMPSBS_URL + '/cpisBpmPsBs/getFlowStateByBizKey',
    method: 'get',
    params: params
  })
}
