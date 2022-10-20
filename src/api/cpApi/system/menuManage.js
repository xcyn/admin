import { systemRequest } from '../../plugin/axios/index';

// 获取菜单树
export function getTree(param) {
  return systemRequest({
    method: 'get',
    url: `/menus`
  });
}

// 编辑菜单信息
export function editMenuInfo(param) {
  return systemRequest({
    method: 'put',
    url: `/menus/${param.id}`,
    data: param
  });
}

// 新增菜单
export function addMenuInfo(param) {
  return systemRequest({
    method: 'post',
    url: `/menus`,
    data: param
  });
}

// 删除菜单信息
export function deleteMenuInfo(param) {
  return systemRequest({
    method: 'delete',
    url: `/menus/${param}`
  });
}
