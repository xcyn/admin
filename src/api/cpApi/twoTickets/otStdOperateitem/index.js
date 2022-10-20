/**
 *********************************************************************************************************
 *  @author           马冰冰
 *  @description
 *  @how2use:         import * as otStdOperateitemApi from '@/api/cpApi/twoTickets/otStdOperateitem/index.js';
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
		url   : TWOTICKETS_URL() + `/api/ot-std-operateitem/add`,
		data,
	})
}

/**
 * 注释
 * @author mbb
 */
export function del(params){
	return businessRequest({
		method: "get",
		url   : TWOTICKETS_URL() + `/api/ot-std-operateitem/delete`,
		params,
	})
}

/**
 * 注释
 * @author mbb
 */
export function down(params){
	return businessRequest({
		method: "get",
		url   : TWOTICKETS_URL() + `/api/ot-std-operateitem/down`,
		params,
	})
}

/**
 * 注释
 * @author mbb
 */
export function edit(data){
	return businessRequest({
		method: "post",
		url   : TWOTICKETS_URL() + `/api/ot-std-operateitem/edit`,
		data,
	})
}

/**
 * 注释
 * @author mbb
 */
export function listByDo(data){
	return businessRequest({
		method: "post",
		url   : TWOTICKETS_URL() + `/api/ot-std-operateitem/listByDo`,
		data,
	})
}

/**
 * 注释
 * @author mbb
 */
export function page(params){
	return businessRequest({
		method: "get",
		url   : TWOTICKETS_URL() + `/api/ot-std-operateitem/page`,
		params,
	})
}

/**
 * 注释
 * @author mbb
 */
export function up(params){
	return businessRequest({
		method: "get",
		url   : TWOTICKETS_URL() + `/api/ot-std-operateitem/up`,
		params,
	})
}
