import {businessRequest} from '@/plugins/axios/index'
import {EQUIPMENT_URL} from '@/api/baseUrl'

export function page(query) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/eqTechnicalParameter/page',
    method: 'get',
    params: query
  });
}

export function save(data) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/eqTechnicalParameter/save',
    method: 'post',
    data: data
  });
}

export function updateById(data) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/eqTechnicalParameter/updateById',
    method: 'post',
    data: data
  });
}

export function removeById(id) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/eqTechnicalParameter/removeById/' + id,
    method: 'post'
  });
}

export function getById(id) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/eqTechnicalParameter/getById/' + id,
    method: 'get'
  });
}

export function exportExcel(parmTypeId, parmNoAndName) {
  let baseURL = process.env.VUE_APP_SYSTEM_API + process.env.VUE_APP_API_SYSTEM
  window.open(baseURL + '/' + EQUIPMENT_URL() + '/eqTechnicalParameter/export?parmTypeId=' + parmTypeId +
    '&parmNoAndName=' + parmNoAndName)
}

export function downloadTpl() {
  let baseURL = process.env.VUE_APP_SYSTEM_API + process.env.VUE_APP_API_SYSTEM
  window.open(baseURL + '/' + EQUIPMENT_URL() + '/eqTechnicalParameter/downloadTpl')
}
