import { businessRequest } from '@/plugins/axios/index';
import { SAFEPRO_URL } from '@/api/baseUrl';

export function save (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/emergencyPlan/add',
    method: 'post',
    data: query
  });
}

export function list (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/emergencyPlan/list',
    method: 'post',
    data: query
  });
}

export function detail (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/emergencyPlan/' + query,
    method: 'get'
  });
}

export function deleteData (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/emergencyPlan/' + query,
    method: 'post',
  });
}

export function edit (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/emergencyPlan/update',
    method: 'post',
    data: query
  });
}
