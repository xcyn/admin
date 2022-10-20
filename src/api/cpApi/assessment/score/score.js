import { businessRequest } from '@/plugins/axios/index';
import { SAFEPRO_URL } from '@/api/baseUrl';

export function hazardCategory (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/assessTask/add',
    method: 'post',
    data: query
  });
}

export function list (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/assessTask/list',
    method: 'post',
    data: query
  });
}

export function deleteHazardCategory (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/assessTask/' + query,
    method: 'post',
  });
}

export function detailHazardCategory (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/assessTask/' + query,
    method: 'get',
  });
}


export function detailByWorkflow (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/assessTask/workflow/' + query,
    method: 'get',
  });
}

export function editHazardCategory (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/assessTask/update',
    method: 'post',
    data: query
  });
}

export function tree (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/assessTask/tree',
    method: 'get',
    param: query
  });
}
