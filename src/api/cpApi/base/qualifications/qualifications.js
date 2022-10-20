import { businessRequest } from '@/plugin/axios/index';
import { SAFEPRO_URL } from '@/api/baseUrl';

export function save (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/personnelQualification/add',
    method: 'post',
    data: query
  });
}

export function list (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/personnelQualification/list',
    method: 'post',
    data: query
  });
}

export function deleteData (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/personnelQualification/' + query,
    method: 'post',
  });
}

export function edit (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/personnelQualification/update',
    method: 'post',
    data: query
  });
}

export function detail (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/personnelQualification/' + query,
    method: 'get'
  });
}



//预警天数字典
// export const warningDaysDic = [
//     { key: 'ryzz1', value: 30 },
//     { key: 'ryzz2', value: 30 }
// ];

export function warningDaysDic () {
  return businessRequest({
    url: SAFEPRO_URL() + '/dataDict/list',
    method: 'post',
    data: { type: 'warningDaysDic' }
  });
}
