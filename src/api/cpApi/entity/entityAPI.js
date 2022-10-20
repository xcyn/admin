/**
 *********************************************************************************************************
 *  @author           马冰冰
 *  @description      所有参与者的调用接口(这是发起请求实时查询.如无必要,请在store中 ibps/user/depList 获取)
 *  @how2use:         import * as entityAPI from '@/api/cpApi/entity/entityAPI.js';
 *********************************************************************************************************
 */
import { systemRequest } from '@/plugins/axios/index'

/**
 * 根据用户ID查询其最近的所属部门
 * @param {用户id} userId
 */
export function getDepartmentByUserId (userId) {
  return systemRequest({
    url: '/extend/v3/entity/getDepartmentByUserId',
    method: 'get',
    params: {
      "userId": userId
    }
  })
}

/**
 * 根据用户ID查询器直接上级组织的信息(附带此组织的顶级公司)
 * @param {用户id} userId
 */
export function getSuperiorImmediateByUserId (userId) {
  return systemRequest({
    url: '/extend/v3/entity/getSuperiorImmediateByUserId',
    method: 'get',
    params: {
      "userId": userId
    }
  })
}

/**
 * 公司
 */
export function getAllCompany () {
  return systemRequest({
    url: '/extend/v3/entity/findAllByCondition',
    method: 'post',
    data: {
      "parameters": [
        { "key": "levelType", "value": "org" },// 类型为组织
        { "key": "levelLevel", "value": "2" }// 等级为2:公司
      ]
    }
  })
}

/**
 * 部门
 * @param {组织id} orgId
 */
export function getAllDepListByOrgId (orgId) {
  return systemRequest({
    url: '/extend/v3/entity/findAllByCondition',
    method: 'post',
    data: {
      "parameters": [
        { "key": !!orgId ? "orgId" : "null", "value": `${orgId}` },// 组织id
        { "key": "levelType", "value": "org" },// 类型为组织
        { "key": "levelLevel", "value": "3" }// 等级为3:部门
      ]
    }
  })
}

/**
 * 班组
 * @param {组织id} orgId
 */
export function getAllTeamListByOrgId (orgId) {
  return systemRequest({
    url: '/extend/v3/entity/findAllByCondition',
    method: 'post',
    data: {
      "parameters": [
        { "key": !!orgId ? "orgId" : "null", "value": `${orgId}` },// 组织id
        { "key": "levelType", "value": "org" },// 类型为组织
        { "key": "levelLevel", "value": "4" }// 等级为3:班组
      ]
    }
  })
}

/**
 * 场站
 * @param {组织id} orgId
 */
export function getAllStationByOrgId (orgId) {
  return systemRequest({
    url: '/extend/v3/entity/findAllByCondition',
    method: 'post',
    data: {
      "parameters": [
        { "key": !!orgId ? "orgId" : "null", "value": `${orgId}` },// 组织id
        { "key": "attrKey", "value": "sfcz" },// 属性:是否为场站
        { "key": "attrValue", "value": "Y" }// 属性值:是
      ]
    }
  })
}
