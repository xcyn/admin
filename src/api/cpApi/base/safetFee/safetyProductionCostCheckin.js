import { businessRequest } from '@/plugins/axios/index';
import { SAFEPRO_URL } from '@/api/baseUrl';

export function save (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/safetyProductionCostCheckin/add',
    method: 'post',
    data: query
  });
}

export function list (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/safetyProductionCostCheckin/list',
    method: 'post',
    data: query
  });
}

export function deleteData (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/safetyProductionCostCheckin/' + query,
    method: 'post',
  });
}

export function edit (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/safetyProductionCostCheckin/update',
    method: 'post',
    data: query
  });
}

export function detail (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/safetyProductionCostCheckin/' + query,
    method: 'get'
  });
}
export function detailByWorkflow (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/safetyProductionCostCheckin/workflow/' + query,
    method: 'get'
  });
}
