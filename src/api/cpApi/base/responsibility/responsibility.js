import { businessRequest } from '@/plugins/axios/index';
import { SAFEPRO_URL } from '@/api/baseUrl';


export function add (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/liabilityStatement/add',
    method: 'post',
    data: query
  });
}

export function list (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/liabilityStatement/list',
    method: 'post',
    data: query
  });
}

export function listGroup (query) {
  return businessRequest({
    url: SAFEPRO_URL() + `/liabilityStatement/overall`,
    method: 'post',
    data: query
  });
}

export function getDetail (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/liabilityStatement/' + query,
    method: 'get'
  });
}

export function removeInfo (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/liabilityStatement/' + query,
    method: 'post',
  });
}

export function removeInfoBatch (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/liabilityStatement/deleteBatch' ,
    method: 'post',
    data: query
  });
}

export function edit (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/liabilityStatement/update',
    method: 'post',
    data: query
  });
}
