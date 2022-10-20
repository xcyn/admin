import { businessRequest } from '@/plugin/axios/index'
import { EXAMINATION_URL } from '@/api/baseUrl'

// 查询题型错误率统计的图表数据
export function getEchart(param) {
  return businessRequest({
    method: 'get',
    url: EXAMINATION_URL() + '/api/statistics/topicChart',
    params: param
  })
}

// 查询题型统计的列表数据
export function getTable(param) {
  return businessRequest({
    method: 'get',
    url: EXAMINATION_URL() + '/api/statistics/topicList',
    params: param
  })
}

// 查询题型统计的列表数据总数
export function getCount(param) {
  return businessRequest({
    method: 'get',
    url: EXAMINATION_URL() + '/api/statistics/getCount',
    params: param
  })
}
