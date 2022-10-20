// 外委项目工机具
import { businessRequest } from '@/plugin/axios/index'
import {SAFEPRO_URL} from "@/api/baseUrl";
export function detail(query) {
  return businessRequest({
    url:SAFEPRO_URL() + '/swProjectTool/' + query,
    method: 'get'
  })
}
export function deleteData(query) {
  return businessRequest({
    url:SAFEPRO_URL() + '/swProjectTool/' + query,
    method: 'post'
  })
}

export function save(query) {
  return businessRequest({
    url: SAFEPRO_URL() +'/swProjectTool/add',
    method: 'post',
    data: query
  })
}
export function list(query) {
  return businessRequest({
    url:SAFEPRO_URL() + '/swProjectTool/list',
    method: 'get',
    params: query
  })
}
export function saveOrUpdate(query) {
  return businessRequest({
    url: SAFEPRO_URL() +'/swProjectTool/saveOrUpdate',
    method: 'post',
    data: query
  })
}

export function edit(query) {
  return businessRequest({
    url: SAFEPRO_URL() +'/swProjectTool/update',
    method: 'post',
    data: query
  })
}
