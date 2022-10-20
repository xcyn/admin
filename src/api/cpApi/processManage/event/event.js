import { businessRequest } from '@/plugins/axios/index';
import { SAFEPRO_URL } from '@/api/baseUrl';

export function save (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/accidentEvent/add',
    method: 'post',
    data: query
  });
}

export function list (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/accidentEvent/list',
    method: 'post',
    data: query
  });
}

export function detail (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/accidentEvent/' + query,
    method: 'get'
  });
}

export function deleteData (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/accidentEvent/' + query,
    method: 'post',
  });
}

export function edit (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/accidentEvent/update',
    method: 'post',
    data: query
  });
}
