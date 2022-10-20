import { businessRequest } from '@/plugin/axios';

// 获取考试排名统计图数据
export function getRankStatisticsData(param) {
  return businessRequest({
    method: 'get',
    url: `/api/rankstatistics/queryRankStatisticsData`,
    params: param
  });
}

// 获取考试排名统计列表数据
export function getRankStatisticsList(param) {
  return businessRequest({
    method: 'get',
    url: `/api/rankstatistics/queryRankStatisticsList`,
    params: param
  });
}
