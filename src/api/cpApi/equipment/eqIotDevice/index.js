import {businessRequest} from '@/plugins/axios/index'
import {EQUIPMENT_URL} from '@/api/baseUrl'

export function page(query) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/eqIotDevice/page',
    method: 'get',
    params: query
  });
}

export function save(data) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/eqIotDevice/save',
    method: 'post',
    data: data
  });
}

export function updateById(data) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/eqIotDevice/updateById',
    method: 'post',
    data: data
  });
}

export function removeById(id) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/eqIotDevice/removeById/' + id,
    method: 'post'
  });
}

export function getById(id) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/eqIotDevice/getById/' + id,
    method: 'get'
  });
}

export function getcurrentUserBizNewAlarms(params) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/IotAlarmWorkUser/getcurrentUserBizNewAlarms',
    method: 'get',
    params
  });
}
export function upDateBizAlarmsPushState(data) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/IotAlarmWorkUser/upDateBizAlarmsPushState',
    method: 'POST',
    data
  });
}
export function upDateBizAlarmsReadState(data) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/IotAlarmWorkUser/upDateBizAlarmsReadState',
    method: 'POST',
    data
  });
}
export function getcurrentUserBizAlarms(params) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/IotAlarmWorkUser/getcurrentUserBizAlarms',
    method: 'get',
    params
  });
}
