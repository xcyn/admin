import {
  EXTEND_URL
} from '@/api/baseUrl'
import request from '@/utils/request'

export function querySomLogPage(param) {
      return request({
        method: 'post',
        url: EXTEND_URL() + `/cpisSomLog/page`,
        data: param
      })
}

