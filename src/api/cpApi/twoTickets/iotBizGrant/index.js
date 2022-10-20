import { businessRequest } from "@/plugins/axios/index.js"
import { TWOTICKETS_URL }  from "@/api/baseUrl"

/**
 * 注释
 * @author mbb
 */
export function add(data){
	return businessRequest({
		method: "post",
		url   : TWOTICKETS_URL() + `/api/iot-biz-grant/add`,
		data,
	})
}
/**
 * 注释
 * @author mbb
 */
export function subElecFenceAlarm(data){
  return businessRequest({
    method: "post",
    url   : TWOTICKETS_URL() + `/api/iot-biz-grant/subElecFenceAlarm`,
    data,
  })
}
