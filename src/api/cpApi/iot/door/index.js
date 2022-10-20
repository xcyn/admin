import { businessRequest } from '@/plugin/axios/index'
import {EQUIPMENT_URL,SAFEPRO_URL } from "@/api/baseUrl"

/**
 * 分页查询门禁
 */
export function getDoorTable(param) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/iotDoor/doorPage',
    method: 'post',
    data: param
  })
}

/**
 * 获得三外项目树
 */
 export function getSwTopTreeList() {
  return businessRequest({
    url: SAFEPRO_URL() + '/swProject/list',
    method: 'get'
  })
}

/**
 * 根据三外项目id查询人员列表
 */
 export function getSwPersonByProjectId(proId,current,size) {
  return businessRequest({
    url: SAFEPRO_URL() + `/swProjectPerson/list`,
    method: 'get',
    params: {
        proId: proId,
        current: current,
        size: size
      }    
  })
}

/**
 * 根据区域id查询门禁列表
 */
 export function getDeviceListByAreaId(systemConfigId,areaId) {
  return businessRequest({
    url: EQUIPMENT_URL() + `/iotDoor/getDeviceListByAreaId?systemConfigId=${systemConfigId}&areaId=${areaId}`,
    method: 'get'
  })
}

/*
根据门禁通道编码获得门禁基本信息和今日门禁出入记录
*/
export function getTodayDoorAndInOutList(indexCode){
  return businessRequest({
    url: EQUIPMENT_URL() + '/iotDoor/getTodayDoorAndInOutList?indexCode='+indexCode,
    method: 'get'
  })
}
