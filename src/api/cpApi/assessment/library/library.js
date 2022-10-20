import { businessRequest } from '@/plugins/axios/index';
import { SAFEPRO_URL } from '@/api/baseUrl';

export function hazardCategory (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/assessmentItem/add',
    method: 'post',
    data: query
  });
}

export function list (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/assessmentItem/list',
    method: 'post',
    data: query
  });
}

export function getDetial (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/assessmentItem/' + query,
    method: 'get'
  });
}

export function deleteHazardCategory (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/assessmentItem/' + query,
    method: 'post',
  });
}

export function editHazardCategory (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/assessmentItem/update',
    method: 'post',
    data: query
  });
}
