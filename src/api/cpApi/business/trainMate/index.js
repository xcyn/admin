import { businessRequest } from '../../../../plugin/axios/index'
import { EXAMINATION_URL } from '@/api/baseUrl'

// 获取表格信息
export function getTable(param) {
  return businessRequest({
    method: 'get',
    url: EXAMINATION_URL() + '/api/trainMate/list',
    params: param
  })
}

// 获取表格信息
export function getTrainMaterList(param) {
  return businessRequest({
    method: 'get',
    url: EXAMINATION_URL() + '/api/trainMate/getTrainMater',
    params: param
  })
}

// 添加
export function addTrainMate(param) {
  return businessRequest({
    method: 'post',
    url: EXAMINATION_URL() + '/api/trainMate/add',
    data: param
  })
}

// 编辑
export function editTrainMate(param) {
  return businessRequest({
    method: 'post',
    url: EXAMINATION_URL() + '/api/trainMate/edit',
    data: param
  })
}

// 删除
export function deleteTrainMate(param) {
  return businessRequest({
    method: 'get',
    url: EXAMINATION_URL() + '/api/trainMate/delete?id=' + param
  })
}

// 通过ID 查询
export function getTrainMate(param) {
  return businessRequest({
    method: 'get',
    url: EXAMINATION_URL() + '/api/trainMate/queryById?id=' + param
  })
}
