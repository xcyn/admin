import { businessRequest } from '@/plugin/axios/index'
import {SAFEPRO_URL} from "@/api/baseUrl";

export function detail(query) {
  return businessRequest({
    url: SAFEPRO_URL() +'/swPerson/' + query,
    method: 'get'
  })
}
export function deleteData(query) {
  return businessRequest({
    url: SAFEPRO_URL() +'/swPerson/' + query,
    method: 'post'
  })
}

// 外委人员资质列表
export function qualificationList(query) {
  return businessRequest({
    url: SAFEPRO_URL() +'/swPerson/' + query.formId + '/qualification',
    method: 'get',
    params: query
  })
}
export function save(query) {
  return businessRequest({
    url: SAFEPRO_URL() +'/swPerson/add',
    method: 'post',
    data: query
  })
}
export function addBlacklist(query) {
  return businessRequest({
    url: SAFEPRO_URL() +'/swPerson/blacklist',
    method: 'post',
    data: query
  })
}
export function list(query) {
  return businessRequest({
    url: SAFEPRO_URL() +'/swPerson/list',
    method: 'get',
    params: query
  })
}

export function edit(query) {
  return businessRequest({
    url: SAFEPRO_URL() +'/swPerson/update',
    method: 'post',
    data: query
  })
}

/**
 * 安全模块导入
 */
export function importSync(data) {
    return businessRequest({
      url: SAFEPRO_URL() + `/safetyImport/importSync`,
      method: 'post',
      data: data
    })
  }
 