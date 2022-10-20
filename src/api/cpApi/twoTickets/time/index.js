/**
 *********************************************************************************************************
 *  @author           马冰冰
 *  @description      时间API
 *  @how2use:         import * as timeAPI from '@/api/cpApi/twoTickets/time/index.js';
 *********************************************************************************************************
 */
import { businessRequest } from "@/plugins/axios/index.js"
import { TWOTICKETS_URL }  from "@/api/baseUrl"

/**
 * 注释
 * @author mbb
 */
export function get(params){
	return businessRequest({
		method: "get",
		url   : TWOTICKETS_URL() + `/api/time/get`,
		params,
	})
}
