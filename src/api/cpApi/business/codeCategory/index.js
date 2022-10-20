import { businessRequest } from '../../../../plugin/axios/index';

// 获取表格信息
export function getTable(param) {
  return businessRequest({
    method: 'get',
    url: `/api/codeCategory/list`,
    params: param
  });
}

// 添加
export function addCodeCategory(param) {
  return businessRequest({
    method: 'post',
    url: `/api/codeCategory/add`,
    data: param
  });
}

// 编辑
export function editCodeCategory(param) {
  return businessRequest({
    method: 'post',
    url: `/api/codeCategory/edit`,
    data: param
  });
}

// 删除
export function deleteCodeCategory(param) {
  return businessRequest({
    method: 'get',
    url: `/api/codeCategory/delete?id=${param}`
  });
}
