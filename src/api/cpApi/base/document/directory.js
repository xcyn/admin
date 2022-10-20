import { businessRequest } from '@/plugins/axios/index';
import { SAFEPRO_URL } from '@/api/baseUrl';

export function save (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/securityDocumentDirectory/add',
    method: 'post',
    data: query
  });
}

export function list (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/securityDocumentDirectory/list',
    method: 'post',
    data: query
  });
}

export function detail (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/securityDocumentDirectory/' + query,
    method: 'get'
  });
}

export function enable (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/securityDocumentDirectory/enable/' + query,
    method: 'post'
  });
}

//转移目录下的文件
export function transfer (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/securityDocumentDirectory/transfer',
    method: 'post',
    data: query
  });
}

export function disable (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/securityDocumentDirectory/disable/' + query,
    method: 'post'
  });
}

export function del (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/securityDocumentDirectory/' + query,
    method: 'post',
  });
}

export function edit (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/securityDocumentDirectory/update',
    method: 'post',
    data: query
  });
}

export function tree (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/securityDocumentDirectory/tree',
    method: 'get',
    param: query
  });
}
