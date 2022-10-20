import { businessRequest } from '@/plugin/axios/index'
import { SAFEPRO_URL }     from "@/api/baseUrl"


export function list(query) {
  return businessRequest({
    url:SAFEPRO_URL() + '/swReminder/list',
    method: 'get',
    params: query
  })
}

export function index() {
  return businessRequest({
    url:SAFEPRO_URL() + '/swReminder/index',
    method: 'get',
  })
}
