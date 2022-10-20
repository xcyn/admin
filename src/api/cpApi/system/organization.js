import { systemRequest } from '../../plugin/axios/index';

/**
 * 获取机构数据列表
 *
 * @author 管超
 */
export function get() {
  return systemRequest({
    method: 'get',
    url: `/organizations`
  });
}

/**
 * 根据机构 id 获取详情
 *
 * @param {string} id 机构 id
 * @author 管超
 */
export function getById(id) {
  return systemRequest({
    method: 'get',
    url: `/organizations/${id}`
  });
}

/**
 * 添加机构
 *
 * @param {Object} organization 机构
 * @author 管超
 */
export function add(organization) {
  return systemRequest({
    method: 'post',
    url: `/organizations`,
    data: organization
  });
}

/**
 * 更新机构
 *
 * @param {Object} organization 机构
 * @author 管超
 */
export function update(organization) {
  return systemRequest({
    method: 'put',
    url: `/organizations`,
    data: organization
  });
}

/**
 * 根据机构编码删除机构
 *
 * @param {string} code 机构编码
 * @author 管超
 */
export function removeByCode(code) {
  return systemRequest({
    method: 'delete',
    url: `/organizations/children/${code}`
  });
}

/**
 * 根据机构编码获取下属子节点
 *
 * @param {string} code 机构编码
 * @param {number} level 层级
 * @author 管超
 */
export function getChildrenByCode(code, level = 0) {
  return systemRequest({
    method: 'get',
    url: `/organizations/${code}/children/${level}`
  });
}

/**
 * 获取机构数据（树形结构）
 *
 * @author 管超
 */
export function getOrganizationTree() {
  return systemRequest({
    method: 'get',
    url: `/organizations/tree`
  });
}

/**
 * 从文件导入机构数据
 *
 * @param {FormData} data 表单文件数据
 */
export function importData(data) {
  return systemRequest({
    method: 'post',
    url: `/organizations/import`,
    data
  });
}

/**
 * 获取导入撤销状态
 *
 * @author 管超
 */
export function getImportRevocationStatus() {
  return systemRequest({
    method: 'get',
    url: `/organizations/revocation`
  });
}

/**
 * 撤销导入
 *
 * @author 管超
 */
export function revokeImport() {
  return systemRequest({
    method: 'post',
    url: `/organizations/revocation`
  });
}
