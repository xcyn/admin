import { businessRequest } from '@/plugin/axios'
import { EXAMINATION_URL } from '@/api/baseUrl'

/**
 * 列表
 *
 * @author
 */
export function getTable(param) {
  return businessRequest({
    url: EXAMINATION_URL() + '/api/exam/list',
    method: 'get',
    params: param
  })
}

// 添加
export function addExam(param) {
  return businessRequest({
    method: 'post',
    url: EXAMINATION_URL() + `/api/exam/add`,
    data: param
  })
}

// 修改
export function editExam(param) {
  return businessRequest({
    method: 'post',
    url: EXAMINATION_URL() + `/api/exam/edit`,
    data: param
  })
}

// 通过ID 查询
export function getExam(param) {
  return businessRequest({
    method: 'get',
    url: EXAMINATION_URL() + `/api/exam/queryById?id=${param}`
  })
}

// 查询试卷
export function getPaperList() {
  return businessRequest({
    url: EXAMINATION_URL() + '/api/paperDefine/getList',
    method: 'get'
  })
}

// 作废
export function examCancellation(param) {
  return businessRequest({
    method: 'get',
    url: EXAMINATION_URL() + `/api/exam/examCancellation?id=${param}`
  })
}

// 通过ID 查询考试人员
export function getExamUser(param) {
  return businessRequest({
    method: 'get',
    url: EXAMINATION_URL() + `/api/exam/queryUserById?id=${param}`
  })
}

// 通过ID 查询试卷  预览试卷
export function getExamTopicPreview(param) {
  return businessRequest({
    method: 'get',
    url: EXAMINATION_URL() + `/api/exam/examTopicPreview?id=${param}`
  })
}
