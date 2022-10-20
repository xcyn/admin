import { businessRequest } from '@/plugin/axios/index'
import {EQUIPMENT_URL } from "@/api/baseUrl"

/**
 * 分页查询用户，包括平台和三个人员列表
 */
 export function getTable(param) {
    return businessRequest({
      url: EQUIPMENT_URL() +'/cpisPartyPerson/page',
      method: 'post',
      data: param
    })
  }

/**
 * 批量下发人员信息
 */
 export function batchIssuePerson(param) {
  return businessRequest({
    url: EQUIPMENT_URL() + `/cpisPartyPerson/batchIssuePerson`,
    method: 'post',
    data: param
  })
}  