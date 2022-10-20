import { businessRequest } from '../../plugin/axios/index';

export function getTable(param) {
  return businessRequest({
    method: 'get',
    url: `/api/notice/list`,
    params: param
  });
}
