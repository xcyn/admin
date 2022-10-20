import { systemRequest } from '../../plugin/axios/index';

// 获取表格数据
export function getTable() {
  return systemRequest({
    method: 'get',
    url: `/resources`
  });
}

// 增加权限菜单
export function addPermission(param) {
  return systemRequest({
    method: 'post',
    url: `/resources`,
    data: param
  });
}

// 编辑权限菜单
export function editPermission(param) {
  return systemRequest({
    method: 'put',
    url: `/resources/${param.id}`,
    data: param
  });
}

// 删除菜单
export function deletePermission(param) {
  return systemRequest({
    method: 'delete',
    url: `/resources/${param}`
  });
}
