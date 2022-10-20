import { businessRequest } from "@/plugins/axios"
import { SHIFTDUTY_URL }   from "@/api/baseUrl"

// 获取表格信息
export function getTable(param){
	return businessRequest({
		method: "post",
		url   : SHIFTDUTY_URL() + "/api/schedule/getList",
		data  : param,
	})
}

// 获取排班表（计划）信息
export function getschedule(param){
	return businessRequest({
		method: "get",
		url   : SHIFTDUTY_URL() + "/api/schedule/getschedule",
		params: param,
	})
}

// 获取排班表（规则）信息
export function getrule(param){
	return businessRequest({
		method: "get",
		url   : SHIFTDUTY_URL() + "/api/schedule/getrule",
		params: param,
	})
}

// 获取班次信息
export function getShift(param){
	return businessRequest({
		method: "get",
		url   : SHIFTDUTY_URL() + "/api/schedule/getShift",
		params: param,
	})
}

// 获取人员信息
export function getStaff(param){
	return businessRequest({
		method: "get",
		url   : SHIFTDUTY_URL() + "/api/schedule/queryById",
		params: param,
	})
}

// 获取表格信息
export function editStaff(param){
	return businessRequest({
		method: "post",
		url   : SHIFTDUTY_URL() + "/api/schedule/edit",
		data  : param,
	})
}

// 调用接口
export function getCall(param){
	return businessRequest({
		method: "get",
		url   : SHIFTDUTY_URL() + "/api/schedule/getScheduleDate",
		params: param,
	})
}

// 获取当前值别
export function getTeamNow(){
	return businessRequest({
		method: "get",
		url   : SHIFTDUTY_URL() + "/api/schedule/getTeam",
	})
}
