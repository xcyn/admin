import {businessRequest} from '@/plugins/axios/index'
import {EQUIPMENT_URL} from '@/api/baseUrl'

export function page(query) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/eqLocation/page',
    method: 'get',
    params: query
  });
}

export function save(data) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/eqLocation/save',
    method: 'post',
    data: data
  });
}

export function updateById(data) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/eqLocation/updateById',
    method: 'post',
    data: data
  });
}

export function removeById(id) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/eqLocation/removeById/' + id,
    method: 'post'
  });
}

export function getById(id) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/eqLocation/getById/' + id,
    method: 'get'
  });
}

export function getEqLocationTree(nodeId) {
  return businessRequest({
    url: EQUIPMENT_URL() + "/eqLocation/getEqLocationTree",
    method: "get",
    params: {nodeId: nodeId},
  });
}

export function getQrCode(id) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/eqLocation/getQrCode/' + id,
    method: 'get'
  });
}

export function initIdValue() {
  return businessRequest({
    url: EQUIPMENT_URL() + "/eqAssetType/initIdValue",
    method: "get",
  });
}
