import { businessRequest } from '@/plugins/axios/index';
import { SAFEPRO_URL } from '@/api/baseUrl';

export function save (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/securityDocument/add',
    method: 'post',
    data: query
  });
}

export function list (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/securityDocument/list',
    method: 'post',
    data: query
  });
}

export function detail (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/securityDocument/' + query,
    method: 'get'
  });
}

export function deleteFile (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/securityDocument/' + query,
    method: 'post',
  });
}

export function edit (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/securityDocument/update',
    method: 'post',
    data: query
  });
}

export function tree (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/securityDocument/tree',
    method: 'get',
    param: query
  });
}
