import { businessRequest } from '@/plugin/axios/index';
import { EXAMINATION_URL } from '@/api/baseUrl'

// 获取表格信息
export function getTable(param) {
  return businessRequest({
    method: 'get',
    url: EXAMINATION_URL() + `/api/code/list`,
    params: param
  });
}

// 添加
export function addCode(param) {
  return businessRequest({
    method: 'post',
    url: EXAMINATION_URL() + `/api/code/add`,
    data: param
  });
}

// 编辑
export function editCode(param) {
  return businessRequest({
    method: 'post',
    url: EXAMINATION_URL() + `/api/code/edit`,
    data: param
  });
}

// 删除
export function delCode(param) {
  return businessRequest({
    method: 'get',
    url: EXAMINATION_URL() + `/api/code/delete?id=${param}`
  });
}

// 删除
export function deleteCode(param) {
  return businessRequest({
    method: 'get',
    url: EXAMINATION_URL() + `/api/code/delete?id=${param}`
  });
}

// 启用禁用
export function codeEnable(param) {
  return businessRequest({
    method: 'post',
    url: EXAMINATION_URL() + `/api/code/codeEnable`,
    data: param
  });
}

// 初始化信息
export function initConfigData(param) {
  return businessRequest({
    method: 'get',
    url: EXAMINATION_URL() + `/api/init/data`,
    params: param
  });
}
