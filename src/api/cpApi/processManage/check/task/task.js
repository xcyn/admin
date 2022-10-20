/*********************************************************************************************************
 *  @author 		mbb
 *  @description	安全检查计划
 *  @how2use:		import * as taskApi from '@/api/cpApi/processManage/check/task/task.js';
 *********************************************************************************************************/

import { businessRequest } from "@/plugins/axios/index.js"
import { SAFEPRO_URL }     from "@/api/baseUrl"

const REST_URL_PREFIX = SAFEPRO_URL() + "/check/task"

/**
 * 新增_实体
 * @author mbb
 */
export function insert(params){
	return businessRequest({
		url   : REST_URL_PREFIX + "/insert",
		method: "post",
		data  : params,
	})
}

/**
 * 生成_实体
 * @author mbb
 */
export function generateByPlanId(params){
	return businessRequest({
		url   : REST_URL_PREFIX + "/generateByPlanId?planId=" + `${ params }`,
		method: "get",
	})
}

/**
 * 保存_对象
 * @author mbb
 */
export function saveIo(params){
	return businessRequest({
		url   : REST_URL_PREFIX + "/saveIo",
		method: "post",
		data  : params,
	})
}

/**
 * 删除_主键
 * @author mbb
 */
export function deleteById(params){
	return businessRequest({
		url   : REST_URL_PREFIX + "/deleteById?id=" + `${ params }`,
		method: "get",
	})
}

/**
 * 删除_多个
 * @author mbb
 */
export function deleteList(params){
	return businessRequest({
		url   : REST_URL_PREFIX + "/deleteList",
		method: "post",
		data  : params,
	})
}

/**
 * 修改_主键
 * @author mbb
 */
export function updateById(params){
	return businessRequest({
		url   : REST_URL_PREFIX + "/updateById",
		method: "post",
		data  : params,
	})
}

/**
 * 查询_主键
 * @author mbb
 */
export function getById(params){
	return businessRequest({
		url   : REST_URL_PREFIX + "/getById?id=" + `${ params }`,
		method: "get",
	})
}

/**
 * 查询_无条件全查
 * @author mbb
 */
export function getList(){
	return businessRequest({
		url   : REST_URL_PREFIX + "/get/list",
		method: "get",
	})
}

/**
 * 查询_对象列表
 * @author mbb
 */
export function getListByIo(prams){
	return businessRequest({
		url   : REST_URL_PREFIX + "/getByIo/list",
		method: "post",
		data  : prams,
	})
}

/**
 * 查询_无条件全查
 * @author mbb
 */
export function listByPlanId(param){
	return businessRequest({
		url   : REST_URL_PREFIX + "/listByPlanId",
		method: "post",
		data  : param,
	})
}

/**
 * 查询_对象
 * @author mbb
 */
export function getVoById(prams){
	return businessRequest({
		url   : REST_URL_PREFIX + "/getVoById?id=" + `${ prams }`,
		method: "get",
	})
}
