import { businessRequest } from '@/plugins/axios'
import { EXTEND_URL } from '@/api/baseUrl'

// 获取表格信息
export function queryMessageList (param) {
  return businessRequest({
    method: 'post',
    url: EXTEND_URL() + `/message/queryMessageList`,
    data: param
  })
}

// 获取未读消息数量
export function queryUnreadMessageCount (param) {
  return businessRequest({
    method: 'get',
    url: EXTEND_URL() + `/message/queryUnreadMessageCount`,
    params: param
  })
}

// 更新消息已读状态
export function updateMessageReadStatus (param) {
  return businessRequest({
    method: 'post',
    url: EXTEND_URL() + `/message/updateMessageReadStatus`,
    params: param
  })
}
