import { businessRequest } from '@/plugins/axios/index';
import { SAFEPRO_URL } from '@/api/baseUrl';

export function hazardCategory (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/task/add',
    method: 'post',
    data: query
  });
}

export function list (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/task/list',
    method: 'post',
    data: query
  });
}

export function deleteHazardCategory (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/task/' + query,
    method: 'post',
  });
}

export function editHazardCategory (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/task/update',
    method: 'post',
    data: query
  });
}

export function getTaskDetail (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/task/' + query,
    method: 'get',
  });
}

export function tree (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/task/tree',
    method: 'get',
    param: query
  });
}

export function getTaskByWorkflow (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/task/workflow/' + query,
    method: 'get',
  });
}
