import { businessRequest } from '@/plugins/axios';
import { SHIFTDUTY_URL } from '@/api/baseUrl'

// 获取表格信息
export function getTable (param) {
  return businessRequest({
    method: 'post',
    url: SHIFTDUTY_URL() + `/api/log/getLogNotes`,
    data: param
  });
}