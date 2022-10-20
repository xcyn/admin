// 外委项目培训考试
import { businessRequest } from '@/plugin/axios/index'
import {SAFEPRO_URL} from "@/api/baseUrl";

export function addOrUpdate(query) {
  return businessRequest({
    url: SAFEPRO_URL() +'/swProjectTrainExam/addOrUpdate',
    method: 'post',
    data: query
  })
}
export function list(query) {
  return businessRequest({
    url: SAFEPRO_URL() +'/swProjectTrainExam/list',
    method: 'get',
    params: query
  })
}

export function syncExamination(query) {
  return businessRequest({
    url: SAFEPRO_URL() +'/swProjectTrainExam/sync/examination',
    method: 'get',
    params: query
  })
}
