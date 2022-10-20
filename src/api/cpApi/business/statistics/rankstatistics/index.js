import { businessRequest } from '@/plugin/axios/index'
import { EXAMINATION_URL } from '@/api/baseUrl'

// 获取考试排名统计数据
export function getRankStatisticsData(param) {
  return businessRequest({
    method: 'get',
    url: EXAMINATION_URL() + '/api/rankstatistics/queryRankStatisticsData',
    params: param
  })
}

// 获取考试排名统计列表数据
export function getRankStatisticsList(param) {
  return businessRequest({
    method: 'get',
    url: EXAMINATION_URL() + '/api/rankstatistics/queryRankStatisticsList',
    params: param
  })
}

// 获取考试排名统计列表总数
export function getTotal(param) {
  return businessRequest({
    method: 'get',
    url: EXAMINATION_URL() + '/api/rankstatistics/getRankTotal',
    params: param
  })
}
