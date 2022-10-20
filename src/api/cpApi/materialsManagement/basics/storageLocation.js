// 仓库管理/库存地点
import * as REQUEST from '../index'

const key = 'storageLocation'

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

export function exportExcel(query) {
  return REQUEST.postRequest(`/api/${key}/exportExcel`, query)
}
