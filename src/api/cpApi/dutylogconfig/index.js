import { businessRequest } from '@/plugins/axios';
import { SHIFTDUTY_URL } from '@/api/baseUrl'

// 获取表格信息
export function getTable (param) {
  return businessRequest({
    method: 'get',
    url: SHIFTDUTY_URL() + `/api/logConfigure/getList`,
    params: param
  });
}

// 获取排班表信息
export function getById (param) {
  return businessRequest({
    method: 'get',
    url: SHIFTDUTY_URL() + `/api/logConfigure/getschedule`,
    params: param
  });
}

// 获取记事类型信息
export function getNotetype (param) {
  return businessRequest({
    method: 'get',
    url: SHIFTDUTY_URL() + `/api/logConfigure/getNotetype`,
    params: param
  });
}

// 获取记事主题信息
export function getNotetopic (param) {
  return businessRequest({
    method: 'get',
    url: SHIFTDUTY_URL() + `/api/logConfigure/getNotetopic`,
    params: param
  });
}

// 获取台账类型信息
export function getLedger (param) {
  return businessRequest({
    method: 'get',
    url: SHIFTDUTY_URL() + `/api/logConfigure/getLedger`,
    params: param
  });
}

// 获取时间
export function getdate (param) {
  return businessRequest({
    method: 'get',
    url: SHIFTDUTY_URL() + `/api/logConfigure/getdate`,
    params: param
  });
}

// 获取班次
export function getshift (param) {
  return businessRequest({
    method: 'get',
    url: SHIFTDUTY_URL() + `/api/logConfigure/getshift`,
    params: param
  });
}

// 获取班次
export function getshiftList (param) {
  return businessRequest({
    method: 'get',
    url: SHIFTDUTY_URL() + `/api/logConfigure/getshiftList`,
    params: param
  });
}
// 获取值别
export function getteamList (param) {
  return businessRequest({
    method: 'get',
    url: SHIFTDUTY_URL() + `/api/logConfigure/getteamList`,
    params: param
  });
}

// 根据班次获取值别
export function getteam (param) {
  return businessRequest({
    method: 'get',
    url: SHIFTDUTY_URL() + `/api/logConfigure/getteam`,
    params: param
  });
}

//添加
export function addlogconfig (param) {
  return businessRequest({
    method: 'post',
    url: SHIFTDUTY_URL() + `/api/logConfigure/add`,
    data: param
  });
}

//通过id查询
export function getByconfigId (param) {
  return businessRequest({
    method: 'get',
    url: SHIFTDUTY_URL() + `/api/logConfigure/queryById`,
    params: param
  });
}
//编辑
export function editlogconfig (param) {
  return businessRequest({
    method: 'post',
    url: SHIFTDUTY_URL() + `/api/logConfigure/edit`,
    data: param
  });
}
//删除
export function deletelogconfig (param) {
  return businessRequest({
    method: 'get',
    url: SHIFTDUTY_URL() + `/api/logConfigure/delete`,
    params: param
  });
}
//生成日志
export function createLog (param) {
  return businessRequest({
    method: 'post',
    url: SHIFTDUTY_URL() + `/api/logConfigure/createLog`,
    data: param
  });
}
//通过公司和部门查询日志
export function getLogList (param) {
  return businessRequest({
    method: 'get',
    url: SHIFTDUTY_URL() + `/api/logConfigure/getLogList`,
    params: param
  });
}
//查询日志配置是否生成日志
export function getCreateLog (param) {
  return businessRequest({
    method: 'get',
    url: SHIFTDUTY_URL() + `/api/logConfigure/getCreateLog`,
    params: param
  });
}