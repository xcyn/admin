// 领用申请管理
import * as REQUEST from '../index'

const key = 'collar'

export function save(query) {
  return REQUEST.postRequest(`/api/${key}`, query)
}

export function list(query) {
  return REQUEST.postRequest(`/api/${key}/listData`, query)
}

export function exportList(query) {
  return REQUEST.postRequest(`/api/${key}/exportList`, query)
}

export function del(query) {
  return REQUEST.postRequest(`/api/${key}/delete/${query}`)
}

export function edit(query) {
  return REQUEST.postRequest(`/api/${key}/edit`, query)
}

export function detail(query) {
  return REQUEST.getRequest(`/api/${key}/`, query)
}

export function importData(query) {
  return REQUEST.postRequest(`/api/${key}/import`, query)
}

export function getNo() {
  return REQUEST.getRequest(`/api/${key}/no`)
}

export function batchQuery(query) {
  return REQUEST.postRequest(`/api/${key}/batchQuery`, query)
}

export function collarDetailByWoId(query) {
  return REQUEST.getRequest(`/api/${key}/collarDetail?woId=`, query)
}

export function collarDetailByTicketNo(query) {
  return REQUEST.getRequest(`/api/${key}/collarDetail?ticketNo=`, query)
}

export function checkNumber(query) {
  return REQUEST.postRequest(`/api/${key}/checkNumber`, query)
}

export function exportExcel(query) {
  return REQUEST.postRequest(`/api/${key}/exportExcel`, query)
}
