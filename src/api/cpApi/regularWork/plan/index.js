/**
 *********************************************************************************************************
 *  @author           马冰冰
 *  @description      定期任务API
 *  @how2use:         import * as planApi from '@/api/cpApi/regularWork/plan/index.js';
 *********************************************************************************************************
 */
import { businessRequest } from "@/plugins/axios/index.js"
import { WORKORDER_URL }   from "@/api/baseUrl"

/**
 * 复制计划
 */
export function copyOne(params){
	return businessRequest({
		url   : WORKORDER_URL() + "/api/pwPlan/copy",
		method: "post",
		data  : params,
	})
}

/**
 * 生成计划
 */
export function generateWorkOrder(params){
	return businessRequest({
		url   : WORKORDER_URL() + "/api/pwPlan/generate/workorder",
		method: "get",
		params: params,
	})
}

/**
 * 增加定期工作(附带时间规则)
 */
export function saveOrUpdateWithTimeRuleList(params){
	return businessRequest({
		url   : WORKORDER_URL() + "/api/pwPlan/saveOrUpdate/withTimeRuleList",
		method: "post",
		data  : params,
	})
}

/**
 * 单个保存
 */
export function save(params){
	return businessRequest({
		url   : WORKORDER_URL() + "/api/pwPlan/save",
		method: "post",
		data  : params,
	})
}

/**
 *  批量保存
 */
export function saveList(params){
	return businessRequest({
		url   : WORKORDER_URL() + "/api/pwPlan/save/list",
		method: "post",
		data  : params,
	})
}

/**
 * 单体删除
 */
export function remove(params){
	return businessRequest({
		url   : WORKORDER_URL() + "/api/pwPlan/remove",
		method: "get",
		params: params,
	})
}

/**
 * 单体删除
 */
export function removeList(params){
	return businessRequest({
		url   : WORKORDER_URL() + "/api/pwPlan/remove/list",
		method: "post",
		data  : params,
	})
}

/**
 * 单体修改
 */
export function update(params){
	return businessRequest({
		url   : WORKORDER_URL() + "/api/pwPlan/update",
		method: "post",
		data  : params,
	})
}

/**
 * 批量修改
 */
export function updateList(params){
	return businessRequest({
		url   : WORKORDER_URL() + "/api/pwPlan/update/list",
		method: "post",
		data  : params,
	})
}

/**
 * 查询单个
 */
export function findOne(params){
	return businessRequest({
		url   : WORKORDER_URL() + "/api/pwPlan/find",
		method: "get",
		params: params,
	})
}

/**
 * 查询单个
 */
export function findOneWithTimeRules(params){
	return businessRequest({
		url   : WORKORDER_URL() + "/api/pwPlan/find/with/timerules",
		method: "get",
		params: params,
	})
}

/**
 * 查询所有
 */
export function findAll(params){
	return businessRequest({
		url   : WORKORDER_URL() + "/api/pwPlan/find/list",
		method: "get",
		params: params,
	})
}

/**
 * 查询所有 带分页
 */
export function findListPage(params){
	return businessRequest({
		url   : WORKORDER_URL() + "/api/pwPlan/find/list/page",
		method: "post",
		data  : params,
	})
}

