import { businessRequest } from '@/plugins/axios/index'
import { OVERHAUL_URL } from '@/api/baseUrl'

export function save (query) {
  return businessRequest({
    url: OVERHAUL_URL() + '/standardItems/add',
    method: 'post',
    data: query
  });
}

export function list (query) {
  return businessRequest({
    url: OVERHAUL_URL() + '/standardItems/list',
    method: 'post',
    data: query
  });
}

export function del (query) {
  return businessRequest({
    url: OVERHAUL_URL() + '/standardItems/delete/' + query,
    method: 'post',
  });
}

export function edit (query) {
  return businessRequest({
    url: OVERHAUL_URL() + '/standardItems/update',
    method: 'post',
    data: query
  });
}

export function detail (query) {
  return businessRequest({
    url: OVERHAUL_URL() + '/standardItems/' + query,
    method: 'get'
  });
}
