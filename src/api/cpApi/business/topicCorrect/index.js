import { businessRequest } from '@/plugin/axios';

/**
 * 列表
 *
 * @author
 */
export function getTable(param) {
  return businessRequest({
    url: '/api/topicCorrect/list',
    method: 'get',
    params: param
  });
}

// 添加
export function addTopicCorrect(param) {
  return businessRequest({
    method: 'post',
    url: `/api/topicCorrect/add`,
    data: param
  });
}
