import { businessRequest } from '@/plugins/axios/index';
import { SAFEPRO_URL } from '@/api/baseUrl';


export function getRaRiskLevel () {
  return businessRequest({
    url: SAFEPRO_URL() + '/raRiskLevel/list',
    method: 'get'
  });
}


export function getRaEvaluationMethod () {
  return businessRequest({
    url: SAFEPRO_URL() + '/raEvaluationMethod/list',
    method: 'get'
  });
}

export function getRaEvaluationRule (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/raEvaluationRule/list',
    method: 'get',
    params:query
  });
}
export function getRaRiskValue (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/raRiskValue/list',
    method: 'get',
    params:query
  });
}
export function getLevelNo (query) {
  return businessRequest({
    url: SAFEPRO_URL() + '/raRiskValue/getLevelNo',
    method: 'get',
    params:query
  });
}

export function getRaAreaOrisk () {
  return businessRequest({
    url: SAFEPRO_URL() + '/raAreaOrisk/list',
    method: 'get',
  });
}

export function getRaAreaRiskValue () {
  return businessRequest({
    url: SAFEPRO_URL() + '/raAreaRiskValue/list',
    method: 'get',
  });
}

export function getRaAreaRiskValueMap () {
  return businessRequest({
    url: SAFEPRO_URL() + '/raAreaRiskValue/map',
    method: 'get',
  });
}
