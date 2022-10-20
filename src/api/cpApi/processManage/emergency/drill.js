import { businessRequest } from '@/plugins/axios/index';
import { getNodeApproval } from '@/api/platform/bpmn/bpmTask';
import { SAFEPRO_URL } from '@/api/baseUrl';

export function save (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/emergencyDrill/add',
    method: 'post',
    data: query
  });
}

export function list (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/emergencyDrill/list',
    method: 'post',
    data: query
  });
}
export function getNo () {
  return businessRequest({
    url: SAFEPRO_URL() + '/emergencyDrill',
    method: 'get'
  });
}

export function detail (id) {
  return businessRequest({
    url: SAFEPRO_URL() +`/emergencyDrill/${id}`,
    method: 'get',
  });
}

export function deleteData (id) {
  return businessRequest({
    url: SAFEPRO_URL() + `/emergencyDrill/${id}`,
    method: 'post',
  });
}

export function edit (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/emergencyDrill/update',
    method: 'post',
    data: query
  });
}
