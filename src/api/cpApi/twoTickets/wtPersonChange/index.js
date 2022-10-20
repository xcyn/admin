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
export function add(data){
	return businessRequest({
		method: "post",
		url   : TWOTICKETS_URL() + `/api/wt-person-change/add`,
		data,
	})
}

/**
 * 注释
 * @author mbb
 */
export function saveOrUpdate(data){
	return businessRequest({
		method: "post",
		url   : TWOTICKETS_URL() + `/api/wt-person-change/saveOrUpdate`,
		data,
	})
}

/**
 * 注释
 * @author mbb
 */
export function getByWtId(params){
  return businessRequest({
    method: "get",
    url   : TWOTICKETS_URL() + `/api/wt-person-change/getByWtId`,
    params,
  })
}
