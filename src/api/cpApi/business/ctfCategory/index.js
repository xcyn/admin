import { businessRequest } from '../../../../plugin/axios/index'
import { EXAMINATION_URL } from '@/api/baseUrl'

// 获取证书管理树
export function getTree() {
  return businessRequest({
    method: 'get',
    url: EXAMINATION_URL() + `/api/ctfcateGory/getTree`
  })
}

// 添加证书目录
export function addCatalog(param) {
  return businessRequest({
    method: 'post',
    url: EXAMINATION_URL() + `/api/ctfcateGory/add`,
    data: param
  })
}

// 修改证书管理目录
export function editCatalog(param) {
  return businessRequest({
    method: 'post',
    url: EXAMINATION_URL() + `/api/ctfcateGory/edit`,
    data: param
  })
}

// 获取表格信息
export function getTable(code) {
  return businessRequest({
    method: 'get',
    url: EXAMINATION_URL() + `/api/ctfcateGory/getTree`
  })
}

// 添加
export function addCodeCategory(param) {
  return businessRequest({
    method: 'post',
    url: EXAMINATION_URL() + `/api/ctfcateGory/add`,
    data: param
  })
}

// 编辑
export function editCodeCategory(param) {
  return businessRequest({
    method: 'post',
    url: EXAMINATION_URL() + `/api/ctfcateGory/edit`,
    data: param
  })
}

// 删除
export function deleteCodeCategory(param) {
  return businessRequest({
    method: 'get',
    url: EXAMINATION_URL() + `/api/certificate/delete?id=${param}`
  })
}
