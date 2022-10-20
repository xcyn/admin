import { businessRequest } from '@/plugins/axios/index'
import { EQUIPMENT_URL } from '@/api/baseUrl'

export function save(data) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/eqLocationInstall/save',
    method: 'post',
    data: data
  })
}

export function page(data) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/eqLocationInstall/page',
    method: 'POST',
    data
  })
}
