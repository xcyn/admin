import { businessRequest } from '@/plugins/axios/index';
import { SAFEPRO_URL } from '@/api/baseUrl';

export function list (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/safetyProductionCostCheckin/overall',
    method: 'post',
    data: query
  });
}