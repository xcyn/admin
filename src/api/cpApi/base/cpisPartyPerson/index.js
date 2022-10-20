import { businessRequest } from '@/plugin/axios/index'
import {SAFEPRO_URL} from "@/api/baseUrl"

/**
 * 分页查询用户，包括平台和三个人员列表
 */
 export function getTable(param) {
    return businessRequest({
      url: SAFEPRO_URL() + '/cpisPartyPerson/page',
      method: 'post',
      data: param
    })
  }
  