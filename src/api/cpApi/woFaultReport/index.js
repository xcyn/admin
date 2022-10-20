import { businessRequest } from '@/plugins/axios/index'
import { WORKORDER_URL } from '@/api/baseUrl'

export function get(params) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/woFaultReport/get',
    method: 'get',
    params: params
  })
}

export function add(params) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/woFaultReport/add',
    method: 'post',
    data: params
  })
}

export function update(params) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/woFaultReport/update',
    method: 'post',
    data: params
  })
}

export function deleteByWoId(woId) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/woFaultReport/deleteByWoId',
    method: 'post',
    params: { woId: woId }
  })
}
