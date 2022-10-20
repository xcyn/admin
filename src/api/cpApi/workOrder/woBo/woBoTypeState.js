/**
 *********************************************************************************************************
 *  @author           马冰冰
 *  @description      工单业务对象类型状态
 *  @how2use:         import * as woBoTypeStateAPI from '@/api/cpApi/workOrder/woBo/woBoTypeState.js';
 *********************************************************************************************************
 */
import { businessRequest } from '@/plugins/axios/index'
import { WORKORDER_URL } from '@/api/baseUrl'

const REST_URL_PREFIX = WORKORDER_URL() + '/api/woBoTypeState'

/**
 * 列表查询
 */
export function getList (params) {
  return businessRequest({
    url: REST_URL_PREFIX + '/list',
    method: 'get',
    params: params
  })
}
