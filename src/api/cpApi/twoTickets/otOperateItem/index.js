/**
 *********************************************************************************************************
 *  @author           马冰冰
 *  @description
 *  @how2use:         import * as otOperateItemApi from '@/api/cpApi/twoTickets/otOperateItem/index.js';
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
		url   : TWOTICKETS_URL() + `/api/ot-operate-item/add`,
		data,
	})
}

/**
 * 注释
 * @author mbb
 */
export function addList(data){
	return businessRequest({
		method: "post",
		url   : TWOTICKETS_URL() + `/api/ot-operate-item/addList`,
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
		url   : TWOTICKETS_URL() + `/api/ot-operate-item/delete`,
		params,
	})
}

/**
 * 注释
 * @author mbb
 */
export function deleteByOtId(params){
	return businessRequest({
		method: "get",
		url   : TWOTICKETS_URL() + `/api/ot-operate-item/deleteByOtId`,
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
		url   : TWOTICKETS_URL() + `/api/ot-operate-item/down`,
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
		url   : TWOTICKETS_URL() + `/api/ot-operate-item/edit`,
		data,
	})
}

/**
 * 注释
 * @author mbb
 */
export function finish(data){
	return businessRequest({
		method: "post",
		url   : TWOTICKETS_URL() + `/api/ot-operate-item/finish`,
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
		url   : TWOTICKETS_URL() + `/api/ot-operate-item/listByDo`,
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
		url   : TWOTICKETS_URL() + `/api/ot-operate-item/page`,
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
		url   : TWOTICKETS_URL() + `/api/ot-operate-item/up`,
		params,
	})
}

/**
* 保存操作项目
* 
* @param {*} param 
* @returns 
*/
export function saveOptItem(param) {
	return businessRequest({
		url: TWOTICKETS_URL() + `/api/ot-operate-item/saveOptItem`,
		method: 'post',
		data: param
	})
 }