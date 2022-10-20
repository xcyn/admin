import { businessRequest } from '@/plugin/axios/index'
import { EXAMINATION_URL } from '@/api/baseUrl'

// 获取表格信息
export function getTable(param) {
  return businessRequest({
    method: 'get',
    url: EXAMINATION_URL() + `/api/trainUser/list`,
    params: param
  })
}

// 获取
export function queryById(param) {
  return businessRequest({
    method: 'get',
    url: EXAMINATION_URL() + `/api/trainUser/queryById`,
    params: param
  })
}

// 新增
export function addLearn(param) {
  return businessRequest({
    method: 'post',
    url: EXAMINATION_URL() + `/api/onlineLearning/add`,
    data: param
  })
}

// 更新
export function editLearn(param) {
  return businessRequest({
    method: 'post',
    url: EXAMINATION_URL() + `/api/onlineLearning/edit`,
    data: param
  })
}
