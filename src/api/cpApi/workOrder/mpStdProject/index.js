import { businessRequest } from '@/plugins/axios/index'
import { WORKORDER_URL } from '@/api/baseUrl'
/**
 * 查询项目计划列表分页
 * @param {Object} data
 */
export function findPage(data) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/mpPlan/findPage',
    method: 'post',
    data: data
  })
}

