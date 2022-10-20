import { businessRequest } from '../../../../plugin/axios/index'
import { EXAMINATION_URL } from '@/api/baseUrl'

// 获取表格信息
export function getTable(code) {
  return businessRequest({
    method: 'get',
    url: EXAMINATION_URL() + `/api/certificateIsn/list?certName=${code}`
  })
}

// 获取列表分页
export function getList(param) {
  return businessRequest({
    method: 'get',
    url: EXAMINATION_URL() + `/api/certificateIsn/getList`,
    params: param
  })
}

// 证书发放审核
export function certAudit(param) {
  return businessRequest({
    method: 'get',
    url: EXAMINATION_URL() + `/api/certificateIsn/certAudit?id=${param}`
  })
}

export function getCertificate() {
  return businessRequest({
    url: EXAMINATION_URL() + '/api/certificate/getList',
    method: 'get'
  })
}

export function getExam() {
  return businessRequest({
    url: EXAMINATION_URL() + '/api/exam/list',
    method: 'get'
  })
}

export function getExams() {
  return businessRequest({
    url: EXAMINATION_URL() + '/api/exam/getLists',
    method: 'get'
  })
}

// 添加
export function addCertificateIsn(param) {
  return businessRequest({
    method: 'post',
    url: EXAMINATION_URL() + `/api/certificateIsn/add`,
    data: param
  })
}

// 通过ID 查询
export function getCertificateIsn(param) {
  return businessRequest({
    method: 'get',
    url: EXAMINATION_URL() + `/api/certificateIsn/queryById?id=${param}`
  })
}

// 获取学时达标的人员
export function getTrainUser() {
  return businessRequest({
    method: 'get',
    url: EXAMINATION_URL() + `/api/certificateIsn/getTrainUser`
  })
}

// 添加学时达标的人
export function addUserObtCert(param) {
  return businessRequest({
    method: 'post',
    url: EXAMINATION_URL() + `/api/certificateIsn/addUserObtCert`,
    data: param
  })
}
