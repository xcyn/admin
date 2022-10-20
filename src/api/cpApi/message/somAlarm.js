import {
  EXTEND_URL
} from '@/api/baseUrl'
import request from '@/utils/request'

export function querySomAlarmPage(param) {
      return request({
        method: 'post',
        url: EXTEND_URL() + `/cpisSomAlarm/page`,
        data: param
      })
}

