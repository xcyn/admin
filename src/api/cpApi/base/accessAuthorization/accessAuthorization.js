import { businessRequest } from '@/plugin/axios/index'
import {SAFEPRO_URL} from "@/api/baseUrl";

export function detail(query) {
  return businessRequest({
    url: SAFEPRO_URL() +'/SwProjectDoor/' + query,
    method: 'get'
  })
}
export function deleteData(query) {
  return businessRequest({
    url: SAFEPRO_URL() +'/SwProjectDoor/' + query,
    method: 'post'
  })
}

export function save(query) {
  return businessRequest({
    url: SAFEPRO_URL() +'/SwProjectDoor/add',
    method: 'post',
    data: query
  })
}

export function list(query) {
  return businessRequest({
    url:SAFEPRO_URL() + '/SwProjectDoor/list',
    method: 'get',
    params: query
  })
}

export function edit(query) {
  return businessRequest({
    url: SAFEPRO_URL() +'/SwProjectDoor/update',
    method: 'post',
    data: query
  })
}
// 门禁授权历史查询
export function historyList(query) {
  return businessRequest({
    url:SAFEPRO_URL() + '/SwProjectDoortPerson/list',
    method: 'get',
    params: query
  })
}
export function updateDown(query) {
  return businessRequest({
    url: SAFEPRO_URL() +'/SwProjectDoor/updateDown',
    method: 'post',
    data: query
  })
}
