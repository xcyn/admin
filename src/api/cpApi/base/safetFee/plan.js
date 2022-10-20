import { businessRequest } from '@/plugins/axios/index';
import { SAFEPRO_URL } from '@/api/baseUrl';

export function save (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/safetyProductionCostPlan/add',
    method: 'post',
    data: query
  });
}

export function list (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/safetyProductionCostPlan/list',
    method: 'post',
    data: query
  });
}

export function deleteData (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/safetyProductionCostPlan/' + query,
    method: 'post',
  });
}

export function edit (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/safetyProductionCostPlan/update',
    method: 'post',
    data: query
  });
}

export function detail (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/safetyProductionCostPlan/' + query,
    method: 'get'
  });
}

export function importData (data) {
  return businessRequest({
    url: SAFEPRO_URL() + '/safetyProductionCostPlan/import',
    method: 'post',
    data: data
  });
}
