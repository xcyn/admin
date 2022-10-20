import { businessRequest } from '@/plugins/axios/index';
import { SAFEPRO_URL } from '@/api/baseUrl';

export function save (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/schedulerPlan/add',
    method: 'post',
    data: query
  });
}

export function list (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/schedulerPlan/list',
    method: 'post',
    data: query
  });
}

export function detail (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/schedulerPlan/' + query,
    method: 'get'
  });
}

export function deleteData (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/schedulerPlan/' + query,
    method: 'post',
  });
}

export function deleteDataBatch (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/schedulerPlan/deleteBatch',
    method: 'post',
    data: query
  });
}

export function edit (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/schedulerPlan/update',
    method: 'post',
    data: query
  });
}

export function setStatus (query, type) {
  return businessRequest({
    url: SAFEPRO_URL() + `/schedulerPlan/${type == 0 ? 'enable' : 'disable'}/${query}`,
    method: 'post'
  });
}
export function generateTask (id,query) {
  return businessRequest({
    url: SAFEPRO_URL() + `/schedulerPlan/triggerTask/${id}`,
    method: 'post',
    data:query
  });
}
