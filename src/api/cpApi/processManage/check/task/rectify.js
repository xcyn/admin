/*********************************************************************************************************
 *  @author           马冰冰
 *  @description      安全问题整改通知单
 *  @how2use:         import * as rectifyApi from '@/api/cpApi/processManage/check/task/rectify.js';
 *********************************************************************************************************/
import { businessRequest } from "@/plugins/axios/index.js"
import { SAFEPRO_URL }     from "@/api/baseUrl"

const REST_URL_PREFIX = SAFEPRO_URL() + "/check/task/rectify"

/**
 * 新增_实体
 * @author mbb
 **/
export function insert(params){
	return businessRequest({
		url   : REST_URL_PREFIX + "/insert",
		method: "post",
		data  : params,
	})
}

/**
 * 生成_根据任务主键
 * @author mbb
 **/
export function generateByTaskId(params){
	return businessRequest({
		url   : REST_URL_PREFIX + "/generateByTaskId?taskId=" + `${ params }`,
		method: "get",
	})
}

/**
 * 保存_对象
 * @author mbb
 **/
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
 **/
export function deleteById(id){
	return businessRequest({
		url   : REST_URL_PREFIX + "/deleteById?id=" + `${ id }`,
		method: "get",
	})
}

/**
 * 修改_主键
 * @author mbb
 **/
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
 **/
export function getById(id){
	return businessRequest({
		url   : REST_URL_PREFIX + "/getById?id=" + `${ id }`,
		method: "get",
	})
}

/**
 * 查询_任务主键
 * @author mbb
 **/
export function getByTaskId(taskId){
	return businessRequest({
		url   : REST_URL_PREFIX + "/getByTaskId?taskId=" + `${ taskId }`,
		method: "get",
	})
}

/**
 * 查询_无条件全查
 * @author mbb
 **/
export function getList(){
	return businessRequest({
		url   : REST_URL_PREFIX + "/get/list",
		method: "get",
	})
}
