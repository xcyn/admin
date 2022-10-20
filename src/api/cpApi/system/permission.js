import { systemRequest } from '../../plugin/axios/index';

export function get() {
  return systemRequest({
    method: 'get',
    url: `/resources`
  });
}
