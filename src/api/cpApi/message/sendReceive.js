import { businessRequest } from '@/plugins/axios'
import {
  EQUIPMENT_URL,
  EXTEND_URL,
  INSPECTION_URL,
  METERIAL_URL,
  PLATFORM_BASE_URL,
  SAFEPRO_URL,
  SHIFTDUTY_URL,
  TWOTICKETS_URL,
  WORKORDER_URL
} from '@/api/baseUrl'
import request from '@/utils/request'

export function queryMessageSendPage(param) {
  switch (param.businessCode) {
    case 'platform':
      return request({
        method: 'post',
        url: PLATFORM_BASE_URL() + `/cpisTranMessage/page`,
        data: param
      })
    case 'flow':
      return request({
        method: 'post',
        url: EXTEND_URL() + `/cpisTranMessage/page`,
        data: param
      })
    case 'tickets':
      return businessRequest({
        method: 'post',
        url: TWOTICKETS_URL() + `/cpisTranMessage/page`,
        data: param
      })
    case 'material':
      return businessRequest({
        method: 'post',
        url: METERIAL_URL() + `/cpisTranMessage/page`,
        data: param
      })
    case 'inspection':
      return businessRequest({
        method: 'post',
        url: INSPECTION_URL() + `/cpisTranMessage/page`,
        data: param
      })
    case 'shiftduty':
      return businessRequest({
        method: 'post',
        url: SHIFTDUTY_URL() + `/cpisTranMessage/page`,
        data: param
      })
    case 'workorder':
      return businessRequest({
        method: 'post',
        url: WORKORDER_URL() + `/cpisTranMessage/page`,
        data: param
      })
    case 'equipment':
      return businessRequest({
        method: 'post',
        url: EQUIPMENT_URL() + `/cpisTranMessage/page`,
        data: param
      })
    case 'iot':
      return businessRequest({
        method: 'post',
        url: SAFEPRO_URL() + `/cpisTranMessage/page`,
        data: param
      })
    default:
      return '参数错误'
  }
}

export function queryMessageRecPage(param) {
  switch (param.businessCode) {
    case 'platform':
      return businessRequest({
        method: 'post',
        url: PLATFORM_BASE_URL() + `/cpisTranMessageRec/page`,
        data: param
      })
    case 'flow':
      return businessRequest({
        method: 'post',
        url: EXTEND_URL() + `/cpisTranMessageRec/page`,
        data: param
      })
    case 'tickets':
      return businessRequest({
        method: 'post',
        url: TWOTICKETS_URL() + `/cpisTranMessageRec/page`,
        data: param
      })
    case 'material':
      return businessRequest({
        method: 'post',
        url: METERIAL_URL() + `/cpisTranMessageRec/page`,
        data: param
      })
    case 'inspection':
      return businessRequest({
        method: 'post',
        url: INSPECTION_URL() + `/cpisTranMessageRec/page`,
        data: param
      })
    case 'shiftduty':
      return businessRequest({
        method: 'post',
        url: SHIFTDUTY_URL() + `/cpisTranMessageRec/page`,
        data: param
      })
    case 'workorder':
      return businessRequest({
        method: 'post',
        url: WORKORDER_URL() + `/cpisTranMessageRec/page`,
        data: param
      })
    case 'equipment':
      return businessRequest({
        method: 'post',
        url: EQUIPMENT_URL() + `/cpisTranMessageRec/page`,
        data: param
      })
    case 'iot':
      return businessRequest({
        method: 'post',
        url: SAFEPRO_URL() + `/cpisTranMessageRec/page`,
        data: param
      })
    default:
      return '参数错误'
  }
}
