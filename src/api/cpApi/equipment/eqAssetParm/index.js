import {businessRequest} from '@/plugins/axios/index'
import {EQUIPMENT_URL} from '@/api/baseUrl'

export function page(query) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/eqAssetParm/page',
    method: 'get',
    params: query
  });
}

export function save(data) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/eqAssetParm/save',
    method: 'post',
    data: data
  });
}

export function updateById(data) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/eqAssetParm/updateById',
    method: 'post',
    data: data
  });
}

export function removeById(id) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/eqAssetParm/removeById/' + id,
    method: 'post'
  });
}

export function getById(id) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/eqAssetParm/getById/' + id,
    method: 'get'
  });
}
