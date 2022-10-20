import {businessRequest} from '@/plugins/axios/index'
import {EQUIPMENT_URL} from '@/api/baseUrl'

export function page(query) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/eqAssetTypeParm/page',
    method: 'get',
    params: query
  });
}

export function save(data) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/eqAssetTypeParm/save',
    method: 'post',
    data: data
  });
}

export function updateById(data) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/eqAssetTypeParm/updateById',
    method: 'post',
    data: data
  });
}

export function removeById(id) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/eqAssetTypeParm/removeById/' + id,
    method: 'post'
  });
}

export function getById(id) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/eqAssetTypeParm/getById/' + id,
    method: 'get'
  });
}

export function getByAssetTypeId(assetTypeId) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/eqAssetTypeParm/getByAssetTypeId/' + assetTypeId,
    method: 'get'
  });
}
