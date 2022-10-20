import {businessRequest} from '@/plugins/axios/index';
import {SAFEPRO_URL} from '@/api/baseUrl';



export function save (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/raRiskControl/add',
    method: 'post',
    data: query
  });
}

export function update (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/raRiskControl/update',
    method: 'post',
    data: query
  });
}

export function page (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/raRiskControl/list',
    method: 'get',
    params: query
  });
}
export function getById (riskControlId) {
  return businessRequest({
    url: SAFEPRO_URL() + `/raRiskControl/${riskControlId}`,
    method: 'get'
  });
}
export function deleteById (riskControlId) {
  return businessRequest({
    url: SAFEPRO_URL() + `/raRiskControl/${riskControlId}`,
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
