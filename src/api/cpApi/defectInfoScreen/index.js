import { businessRequest } from '@/plugins/axios/index'
import { WORKORDER_URL } from '@/api/baseUrl'

/**
 * @param {Object} query
 */
export function getByLevel(params) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/defectInfoScreen/getByLevel',
    method: 'get',
    params
  })
}
export function getBySkill(params) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/defectInfoScreen/getBySkill',
    method: 'get',
    params
  })
}

export function getByTrend() {
  return businessRequest({
    url: WORKORDER_URL() + '/api/defectInfoScreen/getByTrend',
    method: 'get'
  })
}

export function getByWorkPicket(data) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/defectInfoScreen/getByWorkPicket',
    method: 'POST',
    data:data
  })
}
export function getDfCount() {
  return businessRequest({
    url: WORKORDER_URL() + '/api/defectInfoScreen/getDfCount',
    method: 'get'
  })
}
