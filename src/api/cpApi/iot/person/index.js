import { businessRequest } from '@/plugin/axios/index'
import {EQUIPMENT_URL} from "@/api/baseUrl"

/**
 * 分页列表数据
 */
export function getTable(param) {
  return businessRequest({
    url: EQUIPMENT_URL() +'/iotPerson/page',
    method: 'post',
    data: param
  })
}

/**
 * 同步人员
 */
 export function synchrPerson(systemConfigId) {
  return businessRequest({
    method: 'get',
    url: EQUIPMENT_URL() +`/iotPerson/synchrPerson?systemConfigId=${systemConfigId}`
  })
}
/**
 * 更新绑定的人员信息
 */
 export function updateBindUser(personId,bindUserId,bindUserName,userType) {
  return businessRequest({
    method: 'get',
    url: EQUIPMENT_URL() + `/iotPerson/updateBindUser?personId=${personId}&bindUserId=${bindUserId}&bindUserName=${bindUserName}&userType=${userType}`
  })
}

/**
 * 查询人员信息
 */
export function getOne(personId) {
  return businessRequest({
    method: 'get',
    url: EQUIPMENT_URL() + `/iotPerson/detail/${personId}`
  })
}

/**
 * 根据人员id和绑定的人员id查询人员记录是否存在
 */
 export function isExistsByUserId(personId,bindUserId) {
  return businessRequest({
    method: 'get',
    url: EQUIPMENT_URL() + `/iotPerson/isExistsByUserId?personId=${personId}&bindUserId=${bindUserId}`
  })
}

/**
 * 自动绑定用户
 */
 export function autoBindUser() {
  return businessRequest({
    method: 'get',
    url: EQUIPMENT_URL() + `/iotPerson/autoBindUser`
  })
}

/**
 * 上传人员图片
 */
 export function uploadPersonPicture(param) {
  return businessRequest({
    url: EQUIPMENT_URL() + `/iotPerson/uploadPersonPicture`,
    method: 'post',
    data: param
  })
}
