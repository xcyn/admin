// 库存表
import * as REQUEST from '../index'

const key = 'stock'

export function save(query) {
  return REQUEST.postRequest(`/api/${key}`, query)
}

export function list(query) {
  return REQUEST.postRequest(`/api/${key}/listData`, query)
}

export function MovelistData(query) {
  return REQUEST.postRequest(`/api/${key}/MovelistData`, query)
}

export function listAll(query) {
  return REQUEST.postRequest(`/api/${key}/listAll`, query)
}

export function listAllNew(query) {
  return REQUEST.postRequest(`/api/${key}/listAllNew`, query)
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

export function overall(query) {
  return REQUEST.postRequest(`/api/${key}/overall`, query)
}

export function overallTwo(query) {
  return REQUEST.postRequest(`/api/${key}/overallTwo`, query)
}

export function alarm(query) {
  return REQUEST.postRequest(`/api/${key}/alarm`, query)
}

export function batchQuery(query) {
  return REQUEST.postRequest(`/api/${key}/batchQuery`, query)
}

export function checkItem(query) {
  return REQUEST.postRequest(`/api/${key}/checkItem`, query)
}

export function fixBusinessStatus(query) {
  return REQUEST.postRequest(`/api/${key}/fixBusinessStatus`, query)
}

export function exportExcel(query) {
  return REQUEST.postRequest(`/api/${key}/exportExcel`, query)
}
