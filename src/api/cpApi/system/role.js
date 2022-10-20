import { systemRequest } from '../../plugin/axios/index';

/**
 * 获取角色数据列表
 *
 * @author 管超
 */
export function get() {
  return systemRequest({
    method: 'get',
    url: `/roles`
  });
}

/**
 * 新增角色
 *
 * @param {Object} role 角色
 * @author 管超
 */
export function add(role) {
  return systemRequest({
    method: 'post',
    url: `/roles`,
    data: role
  });
}

/**
 * 更新角色
 *
 * @param {Object} role 角色
 * @author 管超
 */
export function update(role) {
  return systemRequest({
    method: 'put',
    url: `/roles/${role.id}`,
    data: role
  });
}

/**
 * 删除角色
 *
 * @param {string} id 角色 id
 * @author 管超
 */
export function remove(id) {
  return systemRequest({
    method: 'delete',
    url: `/roles/${id}`
  });
}

/**
 * 获取与角色相关联的权限数据列表
 *
 * @param {string} id 角色 id
 * @author 管超
 */
export function getPermissions(id) {
  return systemRequest({
    method: 'get',
    url: `/roles/${id}/resources`
  });
}

/**
 * 更新角色关联的权限
 *
 * @param {string} id 角色 id
 * @param {Array<string>} permissionIds 权限 id 列表
 * @author 管超
 */
export function updatePermissions(id, permissionIds) {
  return systemRequest({
    method: 'put',
    url: `/roles/${id}/resources`,
    data: { ids: permissionIds }
  });
}

/**
 * 获取与角色相关联的菜单数据列表
 *
 * @param {string} id 角色 id
 * @author 管超
 */
export function getMenus(id) {
  return systemRequest({
    method: 'get',
    url: `/roles/${id}/menus`
  });
}

/**
 * 更新角色关联的菜单
 *
 * @param {string} id 角色 id
 * @param {Array<string>} permissionIds 权限 id 列表
 * @author 管超
 */
export function updateMenus(id, menuIds) {
  return systemRequest({
    method: 'put',
    url: `/roles/${id}/menus`,
    data: { ids: menuIds }
  });
}
