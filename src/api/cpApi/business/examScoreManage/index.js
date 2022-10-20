import { businessRequest } from '@/plugin/axios'
import { EXAMINATION_URL } from '@/api/baseUrl'

/**
 * 主观题列表
 *
 * @author
 */
export function getSubjectTable(param) {
  return businessRequest({
    url: EXAMINATION_URL() + '/api/examScoreManage/subjectList',
    method: 'get',
    params: param
  })
}

/**
 * 分数管理列表
 *
 * @author
 */
export function getScoreTable(param) {
  return businessRequest({
    url: EXAMINATION_URL() + '/api/examScoreManage/scoreList',
    method: 'get',
    params: param
  })
}

export function getExam(param) {
  return businessRequest({
    url: EXAMINATION_URL() + '/api/exam/getExam',
    method: 'get',
    params: param
  })
}

// 查询主观题 -简单题
export function queryExamSubjectTopic(param) {
  return businessRequest({
    url: EXAMINATION_URL() + '/api/examScoreManage/queryExamSubjectTopic',
    method: 'get',
    params: param
  })
}

// 评分保存
export function examSubjectScore(param) {
  return businessRequest({
    method: 'post',
    url: EXAMINATION_URL() + `/api/examScoreManage/examSubjectScore`,
    data: param
  })
}

// 根据考试，试题查询试卷策略中试题的分值
export function getTopicScore(param, param1) {
  return businessRequest({
    method: 'get',
    url: EXAMINATION_URL() + `/api/examScoreManage/getTopicScore?topicId=${param}&examId=${param1}`
  })
}
