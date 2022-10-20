import { businessRequest } from '@/plugin/axios';

// 查询题型错误率统计的图表数据
export function getEchart(param) {
  return businessRequest({
    method: 'get',
    url: `/api/statistics/topicChart`,
    params: param
  });
}
// 查询题型统计的列表数据
export function getTable(param) {
  return businessRequest({
    method: 'get',
    url: `/api/statistics/topicList`,
    params: param
  });
}
