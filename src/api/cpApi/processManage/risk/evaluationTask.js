import {businessRequest} from '@/plugins/axios/index';
import {SAFEPRO_URL} from '@/api/baseUrl';



export function save (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/raEvaluationTask/add',
    method: 'post',
    data: query
  });
}

export function update (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/raEvaluationTask/update',
    method: 'post',
    data: query
  });
}

export function page (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/raEvaluationTask/page',
    method: 'get',
    params: query
  });
}
export function getById (tasKId) {
  return businessRequest({
    url: SAFEPRO_URL() + `/raEvaluationTask/${tasKId}`,
    method: 'get'
  });
}
export function deleteById (tasKId) {
  return businessRequest({
    url: SAFEPRO_URL() + `/raEvaluationTask/${tasKId}`,
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
export function submit (tasKId) {
  return businessRequest({
    url: SAFEPRO_URL() + `/raEvaluationTask/submit/${tasKId}`,
    method: 'POST'
  });
}


export function addHazards (tasKId,hazards) {
  return businessRequest({
    url: SAFEPRO_URL() + `/raEvaluationTask/addHazards/${tasKId}`,
    method: 'POST',
    data:hazards
  });
}

export function delHazards (tasKId,hazardId) {
  return businessRequest({
    url: SAFEPRO_URL() + `/raEvaluationTask/delHazards/${tasKId}/${hazardId}`,
    method: 'POST'
  });
}
export function copyTask (tasKId) {
  return businessRequest({
    url: SAFEPRO_URL() + `/raEvaluationTask/copy/${tasKId}`,
    method: 'POST'
  });
}
