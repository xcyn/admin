import { businessRequest } from '@/plugins/axios';
import { SHIFTDUTY_URL } from '@/api/baseUrl'

// 获取表格信息
export function getTable (param) {
  return businessRequest({
    method: 'post',
    url: SHIFTDUTY_URL() + `/api/locking/getList`,
    data: param
  });
}

//添加
export function addLocking (param) {
  return businessRequest({
    method: 'post',
    url: SHIFTDUTY_URL() + `/api/locking/add`,
    data: param
  });
}

//通过id查询
export function getByOpLockingId (param) {
  return businessRequest({
    method: 'get',
    url: SHIFTDUTY_URL() + `/api/locking/queryById`,
    params: param
  });
}

//编辑
export function editLocking (param) {
  return businessRequest({
    method: 'post',
    url: SHIFTDUTY_URL() + `/api/locking/edit`,
    data: param
  });
}

//删除
export function deleteLocking (param) {
  return businessRequest({
    method: 'get',
    url: SHIFTDUTY_URL() + `/api/locking/delete`,
    params: param
  });
}

//修改状态
export function updateStatus (param) {
  return businessRequest({
    method: 'get',
    url: SHIFTDUTY_URL() + `/api/locking/updateStatus`,
    params: param
  });
}