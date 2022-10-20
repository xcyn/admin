import { businessRequest } from '@/plugins/axios'
import { SHIFTDUTY_URL } from '@/api/baseUrl'

// 获取表格信息
export function getTable (param) {
  return businessRequest({
    method: 'post',
    url: SHIFTDUTY_URL() + `/api/rucd/getList`,
    data: param
  })
}

// 添加
export function addrucd (param) {
  return businessRequest({
    method: 'post',
    url: SHIFTDUTY_URL() + `/api/rucd/add`,
    data: param
  })
}

// 通过id查询
export function getByssId (param) {
  return businessRequest({
    method: 'get',
    url: SHIFTDUTY_URL() + `/api/rucd/queryById`,
    params: param
  })
}

// 编辑
export function editrucd (param) {
  return businessRequest({
    method: 'post',
    url: SHIFTDUTY_URL() + `/api/rucd/edit`,
    data: param
  })
}

// 删除
export function deleterucd (param) {
  return businessRequest({
    method: 'get',
    url: SHIFTDUTY_URL() + `/api/rucd/delete`,
    params: param
  })
}

// 修改状态
export function updateStatus (param) {
  return businessRequest({
    method: 'get',
    url: SHIFTDUTY_URL() + `/api/rucd/updateStatus`,
    params: param
  })
}
