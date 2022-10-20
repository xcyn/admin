import { businessRequest } from '@/plugin/axios';

// 查询分数统计的图表数据
export function getEchart(param) {
  return businessRequest({
    method: 'get',
    url: `/api/statistics/scoreChart`,
    params: param
  });
}

// 查询分数统计的列表数据
export function getTable(param) {
  return businessRequest({
    method: 'get',
    url: `/api/statistics/examList`,
    params: param
  });
}
