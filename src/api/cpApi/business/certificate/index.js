import { businessRequest } from '../../../../plugin/axios/index'
import { EXAMINATION_URL } from '@/api/baseUrl'

// 获取表格信息
export function getTable(param) {
  return businessRequest({
    method: 'get',
    url: EXAMINATION_URL() + `/api/certificate/selectList`,
    params: param
  })
}

// 停用功能
export function disable(param) {
  return businessRequest({
    method: 'post',
    url: EXAMINATION_URL() + `/api/certificate/disable`,
    data: param
  })
}

// 启用功能
export function enable(param) {
  return businessRequest({
    method: 'post',
    url: EXAMINATION_URL() + `/api/certificate/enable`,
    data: param
  })
}

// 添加
export function addCertificate(param) {
  return businessRequest({
    method: 'post',
    url: EXAMINATION_URL() + `/api/certificate/add`,
    data: param
  })
}

// 证书分类的树型结构
export function treeTable(param) {
  return businessRequest({
    method: 'get',
    url: EXAMINATION_URL() + `/api/ctfcateGory/getTree`
  })
}

// 删除
export function deleteCodeCategory(param) {
  return businessRequest({
    method: 'get',
    url: EXAMINATION_URL() + `/api/certificate/delete?id=${param}`
  })
}

// 获取启用证书
export function getList() {
  return businessRequest({
    method: 'get',
    url: EXAMINATION_URL() + `/api/certificate/getList?id=`
  })
}

// 获取启用证书
export function queryList(param) {
  return businessRequest({
    method: 'get',
    url: EXAMINATION_URL() + `/api/certificate/queryList?id=${param}`
  })
}
