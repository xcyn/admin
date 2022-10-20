import { businessRequest } from '@/plugin/axios/index'
import {EQUIPMENT_URL} from "@/api/baseUrl"

/**
 * 分页查询报警类型列表
 */
export function getTable(param) {
  return businessRequest({
    url: EQUIPMENT_URL() + '/IotAlarmWorkUser/page',
    method: 'post',
    data: param
  })
}
 