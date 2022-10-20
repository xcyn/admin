import { businessRequest } from '../../../../plugin/axios/index'
import { EXAMINATION_URL } from '@/api/baseUrl'

// 获取表格信息
export function getTable(param) {
  return businessRequest({
    method: 'get',
    url: EXAMINATION_URL() + `/api/trainTask/list`,
    params: param
  })
}

export function getTrainTaskList(param) {
  return businessRequest({
    method: 'get',
    url: EXAMINATION_URL() + `/api/trainTask/getTrainTask`,
    params: param
  })
}

export function getTrainMater(param) {
  return businessRequest({
    method: 'get',
    url: EXAMINATION_URL() + `/api/trainMate/getTrainMater`,
    params: param
  })
}

// 添加
export function addTrainTask(param) {
  return businessRequest({
    method: 'post',
    url: EXAMINATION_URL() + `/api/trainTask/add`,
    data: param
  })
}

// 编辑
export function editTrainTask(param) {
  return businessRequest({
    method: 'post',
    url: EXAMINATION_URL() + `/api/trainTask/edit`,
    data: param
  })
}

// 删除
export function deleteTrainTask(param) {
  return businessRequest({
    method: 'get',
    url: EXAMINATION_URL() + `/api/trainTask/delete?id=${param}`
  })
}

// 通过ID 查询
export function getTrainTask(param) {
  return businessRequest({
    method: 'get',
    url: EXAMINATION_URL() + `/api/trainTask/queryById?id=${param}`
  })
}
