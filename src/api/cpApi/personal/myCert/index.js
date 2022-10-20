import { businessRequest } from '@/plugin/axios';


// 获取表格信息
export function getTable(param) {
  return businessRequest({
    method: 'get',
    url: `/api/certificateIsn/queryMyCertPageList`,
    params: param
  });
}
