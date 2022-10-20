import { businessRequest } from '@/plugin/axios';

/**
 * 主观题列表
 *
 * @author
 */
export function getMyExamTable(param) {
  return businessRequest({
    url: '/api/examScoreManage/queryMyExamList',
    method: 'get',
    params: param
  });
}
