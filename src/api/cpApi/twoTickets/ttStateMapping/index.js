/**
 *********************************************************************************************************
 *  @author           马冰冰
 *  @description
 *  @how2use:         import * as wtTypeAPI from '@/api/cpApi/twoTickets/wtType/index.js';
 *********************************************************************************************************
 */
import { businessRequest } from "@/plugins/axios/index.js"
import { TWOTICKETS_URL }  from "@/api/baseUrl"



/**
 * 注释
 * @author mbb
 */
export function listByStateType(params){
	return businessRequest({
		method: "get",
		url   : TWOTICKETS_URL() + `/api/tt-state-mapping/listByStateType`,
		params,
	})
}

/**
 * 注释
 * @author mbb
 */
export function list(data){
  return businessRequest({
    method: "post",
    url   : TWOTICKETS_URL() + `/api/tt-state-mapping/list`,
    data,
  })
}
