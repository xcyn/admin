import { businessRequest } from '@/plugins/axios/index';
import { SAFEPRO_URL } from '@/api/baseUrl';

export function hazardCategory (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/assessmentTemplate/add',
    method: 'post',
    data: query
  });
}

export function list (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/assessmentTemplate/list',
    method: 'post',
    data: query
  });
}

export function deleteHazardCategory (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/assessmentTemplate/' + query,
    method: 'post',
  });
}

export function editHazardCategory (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/assessmentTemplate/update',
    method: 'post',
    data: query
  });
}

export function detailHazardCategory (query) {
  return businessRequest({
    url: SAFEPRO_URL() + `/assessmentTemplate/${query}`,
    method: 'get',
  });
}

export function tree (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/assessmentTemplate/tree',
    method: 'get',
    param: query
  });
}

export function copy(templateId) {
  return businessRequest({
    url: SAFEPRO_URL() + `/assessmentTemplate/copy/${templateId}`,
    method: 'post',
  });
}
