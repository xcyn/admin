// 移库申请
import * as REQUEST from '../index';
const key = 'move';

export function queryItems(query) {
  return REQUEST.getRequest(`/api/${key}/queryItems?slId=`, query)
}

export function listData(query) {
  return REQUEST.postRequest(`/api/${key}/listData`, query)
}

export function del(query) {
  return REQUEST.getRequest(`/api/${key}/del?moveId=`, query)
}

export function save(query) {
  return REQUEST.postRequest(`/api/${key}/save`, query)
}

export function update(query) {
  return REQUEST.postRequest(`/api/${key}/update`, query)
}

export function updateStockInfo(query) {
  return REQUEST.postRequest(`/api/${key}/updateStockInfo`, query)
}

export function saveItemList(query) {
  return REQUEST.postRequest(`/api/${key}/saveItemList`, query)
}

export function updateItemList(query) {
  return REQUEST.postRequest(`/api/${key}/updateItemList`, query)
}

export function getNo() {
  return REQUEST.getRequest(`/api/${key}/no`)
}

export function queryByMoveId(query) {
  return REQUEST.getRequest(`/api/${key}/queryByMoveId?moveId=`, query)
}

export function queryByMoveIdEdit(query) {
  return REQUEST.getRequest(`/api/${key}/queryByMoveIdEdit?moveId=`, query)
}
