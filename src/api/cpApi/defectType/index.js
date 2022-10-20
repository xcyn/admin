import { businessRequest } from '@/plugins/axios/index'
import { WORKORDER_URL } from '@/api/baseUrl'
/**
 * @param {Object} query
 */
export function saveOrUpdate(query) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/dfFlowConfig/saveOrUpdate',
    method: 'post',
    data: query
  })
}

/**
 * 注释
 * @author mbb
 */
export function detail(params){
  return businessRequest({
    method: "get",
    url   : WORKORDER_URL() + `/api/dfFlowConfig/detail`,
    params,
  })
}


export function list(params){
  return businessRequest({
    method: "get",
    url   : WORKORDER_URL() + `/api/dfFlowConfig/list`,
    params,
  })
}

