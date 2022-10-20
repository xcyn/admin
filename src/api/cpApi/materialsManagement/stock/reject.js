// 退货申请
import * as REQUEST from '../index'
const key = 'reject'

export function save(query) {
  return REQUEST.postRequest(`/api/${key}`, query)
}

export function list(query) {
  return REQUEST.postRequest(`/api/${key}/listData`, query)
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

export function exportExcel(query) {
  return REQUEST.postRequest(`/api/${key}/exportExcel`, query)
}
