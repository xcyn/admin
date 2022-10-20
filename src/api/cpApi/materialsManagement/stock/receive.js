// 到货入库管理
import * as REQUEST from '../index'

const key = 'receive'

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

export function refresh(query) {
  return REQUEST.postRequest(`/api/${key}/refresh/${query}`)
}

export function exportExcel(query) {
  return REQUEST.postRequest(`/api/${key}/exportExcel`, query)
}
