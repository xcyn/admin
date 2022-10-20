import { businessRequest } from '@/plugins/axios/index';
import { SAFEPRO_URL } from '@/api/baseUrl';

export function hazardCategory (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/problem/add',
    method: 'post',
    data: query
  });
}

export function list (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/problem/list',
    method: 'post',
    data: query
  });
}

export function getProblemDetail (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/problem/' + query,
    method: 'get'
  });
}

export function getProblemByWorkflow (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/problem/workflow/' + query,
    method: 'get'
  });
}

export function deleteHazardCategory (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/problem/' + query,
    method: 'post',
  });
}

export function editHazardCategory (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/problem/update',
    method: 'post',
    data: query
  });
}
