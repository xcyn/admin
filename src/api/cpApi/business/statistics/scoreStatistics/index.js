import { businessRequest } from '@/plugin/axios/index'
import { EXAMINATION_URL } from '@/api/baseUrl'

// 查询分数统计的图表数据
export function getEchart(param) {
  return businessRequest({
    method: 'get',
    url: EXAMINATION_URL() + '/api/statistics/scoreChart',
    params: param
  })
}

// 查询分数统计的列表数据
export function getTable(param) {
  return businessRequest({
    method: 'get',
    url: EXAMINATION_URL() + '/api/statistics/examList',
    params: param
  })
}

// 查询分数统计的列表数据总数
export function getTotal(param) {
  return businessRequest({
    method: 'get',
    url: EXAMINATION_URL() + '/api/statistics/getExamTotal',
    params: param
  })
}

// 查询首页考试培训统计
export function examTrainCount() {
  return businessRequest({
    method: 'get',
    url: EXAMINATION_URL() + '/api/statistics/examTrainCount',
  })
}
