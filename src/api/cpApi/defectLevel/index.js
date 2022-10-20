import { businessRequest } from '@/plugins/axios/index'
import { WORKORDER_URL } from '@/api/baseUrl'
/**
 * @param {Object} query
 */
export function GetList(query) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/defectLevel/list',
    method: 'get',
    params: query
  })
}

/**
 * @param {Object} query
 */
export function add(query) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/defectLevel/add',
    method: 'post',
    data: query
  })
}

/**
 * @param {Object} query
 */
export function getNotifierByLevel(query) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/defectLevel/getNotifierByLevel',
    method: 'get',
    params: query
  })
}

/**
 * @param {Object} query
 */
export function deleteLevelByNo(query) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/defectLevel/deleteLevelByNo',
    method: 'post',
    data: query
  })
}

/**
 * @param {Object} query
 */
export function getLevelData(query) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/defectLevel/getLevelData',
    method: 'get',
    params: query
  })
}

/**
 * @param {Object} query
 */
export function getMaxLevelNo(query) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/defectLevel/getMaxLevelNo',
    method: 'get',
    params: query
  })
}
