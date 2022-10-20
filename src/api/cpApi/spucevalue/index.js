import { businessRequest } from '@/plugins/axios';
import { SHIFTDUTY_URL } from '@/api/baseUrl'

// 班次 获取表格信息
export function getshift(param) {
  return businessRequest({
    method: 'get',
    url: SHIFTDUTY_URL()+`/api/shift/getList`,
    params: param
  });
}

//保存
export function saveshift(param) {
  return businessRequest({
    method: 'post',
    url: SHIFTDUTY_URL()+'/api/shift/save',
    data: param
  });
}

// 值别 获取表格信息
export function getteam(param) {
  return businessRequest({
    method: 'get',
    url: SHIFTDUTY_URL()+`/api/team/getList`,
    params: param
  });
}

//保存
export function saveteam(param) {
  return businessRequest({
    method: 'post',
    url: SHIFTDUTY_URL()+'/api/team/save',
    data: param
  });
}