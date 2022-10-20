// 外委项目人员
import { businessRequest } from '@/plugin/axios/index'
import {SAFEPRO_URL} from "@/api/baseUrl";
// 外委项目人员新增批量
export function addBatch(query) {
  return businessRequest({
    url: SAFEPRO_URL() +'/swProjectPerson/' + query.formId + '/addBatch',
    method: 'post',
    data: query.swPersonIds
  })
}
export function detail(query) {
  return businessRequest({
    url: SAFEPRO_URL() +'/swProjectPerson/' + query,
    method: 'get'
  })
}
export function deleteData(query) {
  return businessRequest({
    url: SAFEPRO_URL() +'/swProjectPerson/' + query,
    method: 'post'
  })
}

export function save(query) {
  return businessRequest({
    url: SAFEPRO_URL() +'/swProjectPerson/add',
    method: 'post',
    data: query
  })
}
export function list(query) {
  return businessRequest({
    url:SAFEPRO_URL() + '/swProjectPerson/list',
    method: 'get',
    params: query
  })
}

export function edit(query) {
  return businessRequest({
    url: SAFEPRO_URL() +'/swProjectPerson/update',
    method: 'post',
    data: query
  })
}
