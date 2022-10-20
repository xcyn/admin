import { businessRequest } from '@/plugins/axios/index';
import { SAFEPRO_URL } from '@/api/baseUrl';

export function save (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/institute/add',
    method: 'post',
    data: query
  });
}

export function list (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/institute/list',
    method: 'post',
    data: query
  });
}

export function detail (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/institute/' + query,
    method: 'get'
  });
}

export function del (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/institute/' + query,
    method: 'post',
  });
}

export function edit (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/institute/update',
    method: 'post',
    data: query
  });
}

export function listAll (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/institute/listAll',
    method: 'post',
    data: query
  });
}
