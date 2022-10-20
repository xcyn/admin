import { businessRequest,systemRequest } from '@/plugins/axios/index'
import { WORKORDER_URL } from '@/api/baseUrl'

/**
 * 获取风机故障单个信息列表
 * @param {*} param
 */
 export function getList(param) {
    return businessRequest({
      url: WORKORDER_URL() + '/api/woFault/getList',
      method: 'post',
      data: param
    });
}

/**
 * 获取风机故障单个信息列表的第一条数据
 * @param {*} param
 */
 export function getFirstOne(key) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/woFault/getFirstOne',
    method: 'get',
    params: {faultId:key}
  });
}

/**
 * 分页列表查询风机故障
 * @param {*} param
 */
export function getTable(param) {
  return businessRequest({
    url: WORKORDER_URL() + '/api/woFault/pageList',
    method: 'post',
    data: param
  });
}

/**
 * 根据条件查询所有组织
 * @param {Object} param
 */
 export function findAllByCondition (param) {
    return systemRequest({
      url: '/extend/v3/entity/findAllByCondition',
      method: 'post',
      data: param
    });
  }

  /**
   * 保存风机故障的缺陷编号
   */
  export function saveWoFaultDfNo(faultId,dfNo) {
    return businessRequest({
      url: WORKORDER_URL() + '/api/woFault/saveWoFaultDfNo',
      method: 'get',
      params: {faultId:faultId,dfNo:dfNo}
    });
  }

export function update(param) {
  return systemRequest({
    url: WORKORDER_URL() + '/api/woFault/update',
    method: 'post',
    data: param
  });
}
