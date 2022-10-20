import { businessRequest } from "@/plugins/axios/index.js"
import { TWOTICKETS_URL } from '@/api/baseUrl'

/**
 * 注释
 * @author mbb
 */
export function add(data){
	return businessRequest({
		method: "post",
		url   : TWOTICKETS_URL() + `/api/tt-iot-info/add`,
		data,
	})
}

/**
 * 注释
 * @author mbb
 */
export function getByTtId(params){
	return businessRequest({
		method: "get",
		url   : TWOTICKETS_URL() + `/api/tt-iot-info/getByTtId`,
		params,
	})
}
/**
 * 注释
 * @author mbb
 */
export function saveOrUpdate(data){
	return businessRequest({
		method: "post",
		url   : TWOTICKETS_URL() + `/api/tt-iot-info/saveOrUpdate`,
		data,
	})
}
