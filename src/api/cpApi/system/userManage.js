import { systemRequest } from '../../plugin/axios/index';

// 获取当前用户所属组织机构树
export function getTree() {
  return systemRequest({
    method: 'get',
    url: `/organizations/staff`
  });
}

// 获取表格信息
export function getTable(code) {
  return systemRequest({
    method: 'get',
    url: `/users?organizationCode=${code}`
  });
}

// 编辑用户信息
export function editUserInfo(param) {
  return systemRequest({
    method: 'put',
    url: `/users/${param.id}`,
    data: param
  });
}

// 添加用户信息
export function addUserInfo(param) {
  return systemRequest({
    method: 'post',
    url: `/users`,
    data: param
  });
}

// 删除用户
export function deleteUserInfo(param) {
  return systemRequest({
    method: 'delete',
    url: `/users/${param}`
  });
}

// 重置密码
export function resetPassword(userId) {
  const _param = {
    userId: userId
  };
  return systemRequest({
    method: 'put',
    url: `/user/password/restore`,
    data: _param
  });
}

// 获取用户所属的组织结构(包含子节点)
export function getOrganizationByUser(param) {
  return systemRequest({
    method: 'get',
    url: `/organizations/staff/${param}`
  });
}

// 获取用户所属的组织机构(不包含子节点)
export function getCurrentOrganizationByUser(param) {
  return systemRequest({
    method: 'get',
    url: `/organizations/staff/map/${param}`
  });
}

// 用户的组织结构树维护
export function updateOrganizationByUser(param) {
  return systemRequest({
    method: 'put',
    url: `/organizations/map`,
    data: param
  });
}

// 获取所有的角色信息
export function getAllRole() {
  return systemRequest({
    method: 'get',
    url: `/roles`
  });
}

// 获取用户所属的角色
export function getRoleByUser(param) {
  return systemRequest({
    method: 'get',
    url: `/user/${param}/roles`
  });
}

// 用户的角色维护
export function updateRoleByUser(param) {
  return systemRequest({
    method: 'put',
    url: `/user/${param.userId}/roles`,
    data: { 'ids': param.ids }
  });
}
