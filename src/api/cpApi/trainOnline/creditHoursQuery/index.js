import { businessRequest } from '@/plugin/axios';

// 获取表格信息
export function getTable(param) {
  return businessRequest({
    method: 'get',
    url: `/api/trainHourManage/list`,
    params: param
  });
}

// 通过ID 查询
export function getTrainHourManage(param) {
  return businessRequest({
    method: 'get',
    url: `/api/trainHourManage/queryById?id=${param}`
  });
}

// 导出
export function exportData(param) {
  return businessRequest({
    method: 'get',
    url: `/api/trainHourManage/exportXls`,
    responseType: 'arraybuffer',
    params: param
  });
}
