import request from '@/utils/request'
import { EXTEND_URL } from '@/api/baseUrl'

/**
 * 防劫持异常日志页面查询
 * @param {*} params
 */
export function query(params) {
  return request({
    url: EXTEND_URL() + '/CpisSafeHijackLog/query',
    method: 'post',
    data: params
  })
}
