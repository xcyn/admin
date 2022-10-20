import { businessRequest } from '@/plugin/axios/index'
import { EQUIPMENT_URL } from '@/api/baseUrl'

/**
 * 分页列表数据
 */
export function getTable(param) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/iotAlarm/page',
    method: 'post',
    data: param
  })
}

/**
 * 查询门禁点上的人员出入事件
 */
export function synchrIscCarInOut(systemConfigId) {
  return businessRequest({
    method: 'get',
    url: EQUIPMENT_URL() + `/iotAlarm/synchrOverspeed?systemConfigId=${systemConfigId}`
  })
}

/**
 * 通过id批量删除人员出入记录
 * @param {*} ids
 */
export function deleteByIds(ids) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/iotAlarm/deleteByIds',
    method: 'post',
    data: ids
  })
}
