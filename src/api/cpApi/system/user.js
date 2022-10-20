import { systemRequest } from '@/plugin/axios';

/**
 * 用户信息
 *
 * @author 管超
 */
export function info() {
  return systemRequest({
    url: '/info',
    method: 'get'
  });
}

/**
 * 用户菜单
 *
 * @author 管超
 */
export function menu() {
  return systemRequest({
    url: '/user/menus',
    method: 'get'
  });
}
