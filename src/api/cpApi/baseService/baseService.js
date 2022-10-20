/**
 *********************************************************************************************************
 *  @author           马冰冰
 *  @description      所有基础服务的调用接口
 *  @how2use:         import * as baseServiceAPI from '@/api/cpApi/baseService/baseService.js';
 *********************************************************************************************************
 */
import { systemRequest } from '@/plugins/axios/index'
import { getLoginInfo, getDepName } from '@/utils/cpUtils/index.js'

/**
 * 获取本地的用户信息
 * 不一定及时:需要拿到用户id再去查询
 */
export function getLocalUserInfo () {
  return getLoginInfo()
}

export function getLocalDepName () {
  return getDepName()
}

/**
 * 获取用户信息
 * long类型的长整型
 * 最少三张表:
 * 参与者表:ibps_party_entity
 * 用户账号表:ibps_party_user
 * 员工表:  ibps_party_employee 可能有
 */
export function getUserInfo (userId) {
  return systemRequest({
    url: `/platform/v3/user/get?userId=${userId}`,
    method: 'get'
  })
}

/**
* 根据字典key,查询数据字典
*/
export function getDictByKey (key) {
  return systemRequest({
    url: `/platform/v3/cat/dictionary/findByTypeKey?typeKey=${key}`,
    method: 'get'
  })
}

/**
 * 查询数据
 * 根据数据模板key查询数据
 */

export function getDataByKey (key) {
  return systemRequest({
    url: `/business/v3/data/template/queryDataByKey`,
    method: 'post',
    data: {
      parameters: [
        {
          key: 'key',
          value: `${key}`
        }
      ]
    }
  })
}

/**
 * 同上
 * PS:可附加数据
 */

export function getDataByParam (param) {
  return systemRequest({
    url: `/business/v3/data/template/queryDataByKey`,
    method: 'post',
    data: param
  })
}

/**
 * 获取公司下面的部门
 */
export function getDepartments (companyId) {
  companyId = companyId ? companyId : getLocalDepName().id
  return systemRequest({
    url: `/business/v3/data/template/queryDataByKey`,
    method: 'post',
    data: {
      parameters: [
        {
          key: 'key',
          value: 'cyzbms'
        },
        {
          key: 'Q^PARENT_ID_^SL',
          value: companyId
        }
      ]
    }
  })
}