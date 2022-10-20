/**
 *********************************************************************************************************
 *  @author           马冰冰
 *  @description      任务类型
 *  @how2use:         import * as woTypeTaskAPI from '@/api/cpApi/workOrder/woTypeTask/woTypeTask.js';
 *********************************************************************************************************
 */
import { businessRequest } from '@/plugins/axios/index'
import { WORKORDER_URL } from '@/api/baseUrl'
const REST_URL_PREFIX = WORKORDER_URL() + '/api/woTypeTask'

/**
 * 查询所有
 */
export function getList (params) {
  return businessRequest({
    url: REST_URL_PREFIX + '/find/list',
    method: 'get',
    params: params
  })
}
