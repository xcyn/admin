import { businessRequest } from '@/plugins/axios/index';
import { SAFEPRO_URL } from '@/api/baseUrl';

export function hazardCategory (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/hiddenTrouble/add',
    method: 'post',
    data: query
  });
}

export function list (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/hiddenTrouble/list',
    method: 'post',
    data: query
  });
}

export function getDangerDetail (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/hiddenTrouble/' + query,
    method: 'get'
  });
}

export function getDangerByWorkflow (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/hiddenTrouble/workflow/' + query,
    method: 'get',
  });
}

export function deleteHazardCategory (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/hiddenTrouble/' + query,
    method: 'post',
  });
}

export function editHazardCategory (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/hiddenTrouble/update',
    method: 'post',
    data: query
  });
}
