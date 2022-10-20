import {businessRequest} from '@/plugins/axios/index'
import {EQUIPMENT_URL} from '@/api/baseUrl'

export function page(query) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/eqManufacturer/page',
    method: 'get',
    params: query
  });
}

export function save(data) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/eqManufacturer/save',
    method: 'post',
    data: data
  });
}

export function updateById(data) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/eqManufacturer/updateById',
    method: 'post',
    data: data
  });
}

export function removeById(id) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/eqManufacturer/removeById/' + id,
    method: 'post'
  });
}

export function getById(id) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/eqManufacturer/getById/' + id,
    method: 'get'
  });
}
