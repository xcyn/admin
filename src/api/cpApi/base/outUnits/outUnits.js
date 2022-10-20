import { businessRequest } from '@/plugins/axios/index';
import { SAFEPRO_URL } from '@/api/baseUrl';

export function save (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/externalEnterprise/add',
    method: 'post',
    data: query
  });
}

export function toBlacklist (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/externalEnterprise/toBlacklist',
    method: 'post',
    data: query
  });
}

export function list (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/externalEnterprise/list',
    method: 'post',
    data: query
  });
}

export function detail (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/externalEnterprise/' + query,
    method: 'get'
  });
}

export function deleteData (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/externalEnterprise/' + query,
    method: 'post',
  });
}

export function edit (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/externalEnterprise/update',
    method: 'post',
    data: query
  });
}
