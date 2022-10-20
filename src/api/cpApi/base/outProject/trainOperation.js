// 外委项目培训操作
import { businessRequest } from '@/plugin/axios/index'
import {SAFEPRO_URL} from "@/api/baseUrl";
export function deleteData(query) {
  return businessRequest({
    url: SAFEPRO_URL() +'/swProjectTrain/' + query,
    method: 'post'
  })
}

export function addOrUpdate(query) {
  return businessRequest({
    url:SAFEPRO_URL() +'/swProjectTrain/addOrUpdate',
    method: 'post',
    data: query
  })
}

export function list(query) {
  return businessRequest({
    url: SAFEPRO_URL() +'/swProjectTrain/list',
    method: 'get',
    params: query
  })
}

export function syncTrain(query) {
  return businessRequest({
    url: SAFEPRO_URL() +'/swProjectTrain/sync/train',
    method: 'get',
    params: query
  })
}

