/* *************************************************雪花模块API*********************************************************** */
import { businessRequest } from '@/plugins/axios/index'

const REST_URL_PREFIX = '/api/snowFlake'

/**
 * 获取一个雪花算法生成的Id
 * long类型的长整型
 */
export function getOne(params) {
  return businessRequest({
    url: REST_URL_PREFIX + '/get',
    method: 'get',
    params: params
  })
}
