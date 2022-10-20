import { businessRequest } from '@/plugins/axios/index';
import { SAFEPRO_URL } from '@/api/baseUrl';

export function hazardCategory (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/hazardCategory/add',
    method: 'post',
    data: query
  });
}

export function list (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/hazardCategory/list',
    method: 'post',
    data: query
  });
}

export function deleteHazardCategory (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/hazardCategory/' + query,
    method: 'post',
  });
}

export function editHazardCategory (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/hazardCategory/update',
    method: 'post',
    data: query
  });
}

export function getHazardCategoryDetail (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/hazardCategory/' + query,
    method: 'get'
  });
}

export function tree (query) {
  let status = ''
  if(query != undefined && query.status != undefined){
    status = query.status
  }
  return businessRequest({
    url: SAFEPRO_URL() + '/hazardCategory/tree?status='+status,
    method: 'get'
  });
}
