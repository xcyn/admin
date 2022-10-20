/**
 *********************************************************************************************************
 *  @author           马冰冰
 *  @description
 *  @how2use:         import * as wtStdAttachedAPI from '@/api/cpApi/twoTickets/wtStdAttached/index.js';
 *********************************************************************************************************
 */
import { businessRequest } from "@/plugins/axios/index.js"
import { TWOTICKETS_URL }  from "@/api/baseUrl"

/**
 * 注释
 * @author mbb
 */
export function deleteByStdAtId(params){
	return businessRequest({
		method: "get",
		url   : TWOTICKETS_URL() + `/api/wt-std-attached/deleteByStdAtId`,
		params,
	})
}

/**
 * 注释
 * @author mbb
 */
export function getById(params){
	return businessRequest({
		method: "get",
		url   : TWOTICKETS_URL() + `/api/wt-std-attached/getById`,
		params,
	})
}

/**
 * 注释
 * @author mbb
 */
export function list(){
	return businessRequest({
		method: "get",
		url   : TWOTICKETS_URL() + `/api/wt-std-attached/list`,
	})
}

/**
 * 注释
 * @author mbb
 */
export function pageByDo(data){
	return businessRequest({
		method: "post",
		url   : TWOTICKETS_URL() + `/api/wt-std-attached/pageByDo`,
		data,
	})
}

/**
 * 注释
 * @author mbb
 */
export function save(data){
	return businessRequest({
		method: "post",
		url   : TWOTICKETS_URL() + `/api/wt-std-attached/save`,
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
		url   : TWOTICKETS_URL() + `/api/wt-std-attached/saveOrUpdate`,
		data,
	})
}
