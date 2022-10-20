import { businessRequest } from '@/plugins/axios';
import { SHIFTDUTY_URL } from '@/api/baseUrl'

// 获取表格信息
export function getTable (param) {
  return businessRequest({
    method: 'post',
    url: SHIFTDUTY_URL() + `/api/stopsend/getList`,
    data: param
  });
}

//添加
export function addstopsend (param) {
  return businessRequest({
    method: 'post',
    url: SHIFTDUTY_URL() + `/api/stopsend/add`,
    data: param
  });
}

//通过id查询
export function getByooId (param) {
  return businessRequest({
    method: 'get',
    url: SHIFTDUTY_URL() + `/api/stopsend/queryById`,
    params: param
  });
}
//编辑
export function editstopsend (param) {
  return businessRequest({
    method: 'post',
    url: SHIFTDUTY_URL() + `/api/stopsend/edit`,
    data: param
  });
}

//删除
export function deletestopsend (param) {
  return businessRequest({
    method: 'get',
    url: SHIFTDUTY_URL() + `/api/stopsend/delete`,
    params: param
  });
}

//修改状态
export function updateStatus (param) {
  return businessRequest({
    method: 'get',
    url: SHIFTDUTY_URL() + `/api/stopsend/updateStatus`,
    params: param
  });
}