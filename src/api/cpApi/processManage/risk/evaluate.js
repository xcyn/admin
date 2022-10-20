import { businessRequest } from '@/plugin/axios/index';
import { SAFEPRO_URL } from '@/api/baseUrl';

export function save (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/raHazardEvaluation/add',
    method: 'post',
    data: query
  });
}

export function list (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/raHazardEvaluation/page',
    method: 'get',
    params: query
  });
}

export function deleteById(evaluationId) {
  return businessRequest({
    url: SAFEPRO_URL() + `/raHazardEvaluation/removeById/${evaluationId}`,
    method: 'post',
  });
}

export function update (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/raHazardEvaluation/update',
    method: 'post',
    data: query
  });
}
export function getById (evaluationId) {
  return businessRequest({
    url: SAFEPRO_URL() + `/raHazardEvaluation/${evaluationId}`,
    method: 'get',
  });
}
