/*********************************************************************************************************
 *  @author           马冰冰
 *  @description      安全检查计划
 *  @how2use:         import * as planApi from '@/api/cpApi/processManage/check/plan/plan.js';
 *********************************************************************************************************/
import { businessRequest } from "@/plugins/axios/index.js"
import { SAFEPRO_URL }     from "@/api/baseUrl"

const REST_URL_PREFIX = SAFEPRO_URL() + "/check/plan"

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
export function deleteById(stdItemId){
	return businessRequest({
		url   : REST_URL_PREFIX + "/deleteById?stdItemId=" + `${ stdItemId }`,
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
export function getById(id){
	return businessRequest({
		url   : REST_URL_PREFIX + "/getById?id=" + `${ id }`,
		method: "get",
	})
}

/**
 * 查询_对象
 * @author mbb
 */
export function getVoById(id){
	return businessRequest({
		url   : REST_URL_PREFIX + "/getVoById?id=" + `${ id }`,
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
 * 查询_检查项目类别
 * @author mbb
 */
export function getByPlanTypeNo(params){
	return businessRequest({
		url   : REST_URL_PREFIX + "/getByPlanTypeNo/list/page",
		method: "post",
		data  : params,
	})
}
