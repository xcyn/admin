import {businessRequest} from '@/plugins/axios/index'
import {EQUIPMENT_URL} from '@/api/baseUrl'

export function page(query) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/eqLocationExtend/page',
    method: 'get',
    params: query
  });
}

export function save(data) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/eqLocationExtend/save',
    method: 'post',
    data: data
  });
}

export function updateById(data) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/eqLocationExtend/updateById',
    method: 'post',
    data: data
  });
}

export function removeById(ids) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/eqLocationExtend/removeById',
    method: 'post',
    data: ids
  });
}

export function getById(id) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/eqLocationExtend/getById/' + id,
    method: 'get'
  });
}
