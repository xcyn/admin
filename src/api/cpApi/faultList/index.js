import { businessRequest } from '@/plugins/axios/index'
import { WORKORDER_URL } from '@/api/baseUrl'

export function detail(query) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/faultKnowledge/' + query,
    method: 'get'
  })
}
export function add(query) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/faultKnowledge/add',
    method: 'post',
    data: query
  })
}

export function deleteInfo(query) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/faultKnowledge/delete/' + query,
    method: 'post'
  })
}
export function list(query) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/faultKnowledge/list',
    method: 'get',
    params: query
  })
}

export function edit(query) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/faultKnowledge/update',
    method: 'post',
    data: query
  })
}

