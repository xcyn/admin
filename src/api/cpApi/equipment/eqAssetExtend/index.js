import {businessRequest} from '@/plugins/axios/index'
import {EQUIPMENT_URL} from '@/api/baseUrl'

export function page(query) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/eqAssetExtend/page',
    method: 'get',
    params: query
  });
}

export function save(data) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/eqAssetExtend/save',
    method: 'post',
    data: data
  });
}

export function updateById(data) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/eqAssetExtend/updateById',
    method: 'post',
    data: data
  });
}

export function removeById(ids) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/eqAssetExtend/removeById',
    method: 'post',
    data: ids
  });
}

export function getById(id) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/eqAssetExtend/getById/' + id,
    method: 'get'
  });
}
