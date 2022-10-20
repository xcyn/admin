import { businessRequest } from '@/plugins/axios/index';
import { SAFEPRO_URL } from '@/api/baseUrl';

export function hazardCategory (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/hazardEvaluation/add',
    method: 'post',
    data: query
  });
}

export function importCategory (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/hazardEvaluation/import',
    method: 'post',
    data: query
  });
}

export function list (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/hazardEvaluation/list',
    method: 'post',
    data: query
  });
}

export function getHazardEvaluationDetail (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/hazardEvaluation/' + query,
    method: 'get'
  });
}

export function deleteMajorHazard (hazardId) {
  return businessRequest({
    url: SAFEPRO_URL() + `/hazardEvaluation/${hazardId}`,
    method: 'post',
  });
}

export function editHazardCategory (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/hazardEvaluation/update',
    method: 'post',
    data: query
  });
}

export function save (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/raHazards/save',
    method: 'post',
    data: query
  });
}

export function update (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/raHazards/updateById',
    method: 'post',
    data: query
  });
}

export function page (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/raHazards/page',
    method: 'get',
    params: query
  });
}
export function getById (hazardId) {
  return businessRequest({
    url: SAFEPRO_URL() + `/raHazards/getById/${hazardId}`,
    method: 'get'
  });
}
export function deleteById (hazardId) {
  return businessRequest({
    url: SAFEPRO_URL() + `/raHazards/removeById/${hazardId}`,
    method: 'post',
  });
}
export function raHazardsTree (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/raHazards/tree',
    method: 'get',
    params: query
  });
}

export function getCategoryById (hazardId) {
  return businessRequest({
    url: SAFEPRO_URL() + `/raHazards/getCategoryById/${hazardId}`,
    method: 'get',
  });
}
