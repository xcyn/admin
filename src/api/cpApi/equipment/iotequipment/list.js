import request from '@/utils/request'

const URL = '/device/v3'
/**
 * 更新iot设备状态
 * @param {*} params
 */

export function updateIotTypeStatus(id, type, params) {
  return request({
    url: URL + '/iotDevice/updateIotTypeStatus?id=' + id + '&type=' + type,
    method: 'post',
    data: params
  })
}
