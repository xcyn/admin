// 外委项目基础信息
import { businessRequest } from '@/plugin/axios/index'
import {SAFEPRO_URL} from "@/api/baseUrl";
export function detail(query) {
  return businessRequest({
    url: SAFEPRO_URL() +'/swProject/' + query,
    method: 'get'
  })
}
export function deleteData(query) {
  return businessRequest({
    url: SAFEPRO_URL() +'/swProject/' + query,
    method: 'post'
  })
}

export function save(query) {
  return businessRequest({
    url: SAFEPRO_URL() +'/swProject/add',
    method: 'post',
    data: query
  })
}
export function list(query) {
  return businessRequest({
    url: SAFEPRO_URL() +'/swProject/list',
    method: 'get',
    params: query
  })
}

export function edit(query) {
  return businessRequest({
    url: SAFEPRO_URL() +'/swProject/update',
    method: 'post',
    data: query
  })
}
export function statistics() {
  return businessRequest({
    url: SAFEPRO_URL() +'/swProject/index/statistics',
    method: 'get',
  })
}
