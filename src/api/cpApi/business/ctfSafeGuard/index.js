import { businessRequest } from '../../../../plugin/axios/index'
import { EXAMINATION_URL } from '@/api/baseUrl'

// 获取表格信息
export function getTable(param) {
  return businessRequest({
    method: 'post',
    url: EXAMINATION_URL() + `/api/certificateGuard/selectCertsafeGuardList`,
    data: param
  })
}

export function disable(param) {
  return businessRequest({
    method: 'post',
    url: EXAMINATION_URL() + `/api/certificateGuard/disable`,
    data: param
  })
}

// 获取表格信息
export function undefStateOf(param) {
  return businessRequest({
    method: 'get',
    url: EXAMINATION_URL() + `/api/certificateGuard/undefStateOf`,
    params: param
  })
}
