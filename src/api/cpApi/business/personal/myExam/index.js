import { businessRequest } from '@/plugin/axios/index'
import { EXAMINATION_URL } from '@/api/baseUrl'

/**
 * 主观题列表
 *
 * @author
 */
export function getMyExamTable(param) {
  return businessRequest({
    url: EXAMINATION_URL() + '/api/examScoreManage/queryMyExamList',
    method: 'get',
    params: param
  })
}
