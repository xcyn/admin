//仓位管理
import * as REQUEST from '../index';
const key = 'storehouse';

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
  return REQUEST.getRequest(`/api/${key}/`, query);
}

export function exportData(query) {
  return REQUEST.getRequest(`/api/${key}/exportData`, `?slName=${query.slName}&status=${query.status}`);
}

export function importData(query) {
  return REQUEST.postRequest(`/api/${key}/import`, query);
}
