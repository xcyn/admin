import { businessRequest } from '@/plugins/axios';
import { SHIFTDUTY_URL } from '@/api/baseUrl'

// 任务转办人员添加
export function addTaskTransfer (param) {
  return businessRequest({
    method: 'post',
    url: SHIFTDUTY_URL() + `/api/transfer/addTaskTransfer`,
    data: param
  });
}

// 任务转办人员查询
export function getTaskTransfer (param) {
  return businessRequest({
    method: 'post',
    url: SHIFTDUTY_URL() + `/api/transfer/getTaskTransfer`,
    data: param
  });
}