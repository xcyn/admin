import { businessRequest, systemRequest }               from "@/plugins/axios"
import { SHIFTDUTY_URL, WORKORDER_URL, TWOTICKETS_URL } from "@/api/baseUrl"

// 获取表格信息
export function getTable(param){
	return businessRequest({
		method: "post",
		url   : SHIFTDUTY_URL() + `/api/log/getList`,
		data  : param,
	})
}

// 查询日志类型
export function gettype(param){
	return businessRequest({
		method: "get",
		url   : SHIFTDUTY_URL() + `/api/log/gettype`,
		params: param,
	})
}

// 查询当前日志的班前会内容
export function getMeet(param){
	return businessRequest({
		method: "get",
		url   : SHIFTDUTY_URL() + `/api/log/getMeet`,
		params: param,
	})
}

// 补录
export function additionalRecording(param){
	return businessRequest({
		method: "post",
		url   : SHIFTDUTY_URL() + `/api/log/additionalRecording`,
		data  : param,
	})
}

// 预录
export function prerecord(param){
	return businessRequest({
		method: "post",
		url   : SHIFTDUTY_URL() + `/api/log/prerecord`,
		data  : param,
	})
}

//日志 提交
export function getsubmit(param){
	return businessRequest({
		method: "get",
		url   : SHIFTDUTY_URL() + `/api/log/getsubmit`,
		params: param,
	})
}

//当前值班日志（台账类型） 通过ID查询
export function getBylogId(param){
	return businessRequest({
		method: "get",
		url   : SHIFTDUTY_URL() + `/api/log/getLogRegister`,
		params: param,
	})
}

//修改接班人
export function updateuser(param){
	return businessRequest({
		method: "post",
		url   : SHIFTDUTY_URL() + `/api/log/updateuser`,
		data  : param,
	})
}

//当前值班日志（台账类型） 通过ID查询  调用其他接口信息
export function getBylogIdPort(param){
	return businessRequest({
		method: "get",
		url   : SHIFTDUTY_URL() + `/api/log/getLogRegisterId`,
		params: param,
	})
}

//上一班 值班信息
export function getUp(param){
	return businessRequest({
		method: "get",
		url   : SHIFTDUTY_URL() + `/api/log/getUp`,
		params: param,
	})
}

//上一班 值班信息
export function getNext(param){
	return businessRequest({
		method: "get",
		url   : SHIFTDUTY_URL() + `/api/log/getNext`,
		params: param,
	})
}

// 台账类型 通过ID查询
export function getTypeInfo(param){
	return businessRequest({
		method: "get",
		url   : SHIFTDUTY_URL() + `/api/log/getLedger`,
		params: param,
	})
}

// 值班记事tab页 通过ID查询
export function getadversaria(param){
	return businessRequest({
		method: "get",
		url   : SHIFTDUTY_URL() + `/api/dutyMake/getadversaria`,
		params: param,
	})
}

// 值班记事 通过ID查询
export function getmackduty(param){
	return businessRequest({
		method: "get",
		url   : SHIFTDUTY_URL() + `/api/dutyMake/getList`,
		params: param,
	})
}

// 值班记事内容  时间查询
export function getMakeTable(param){
	return businessRequest({
		method: "get",
		url   : SHIFTDUTY_URL() + `/api/dutyMake/list`,
		params: param,
	})
}

// 值班记事模板内容查询
export function getTemplate(param){
	return businessRequest({
		method: "post",
		url   : SHIFTDUTY_URL() + `/api/dutyMake/getTemplate`,
		data  : param,
	})
}

// 值班记事 添加
export function savemackduty(param){
	return businessRequest({
		method: "post",
		url   : SHIFTDUTY_URL() + `/api/dutyMake/edit`,
		data  : param,
	})
}

// 获取记事主题信息
export function getNotetopic(param){
	return businessRequest({
		method: "get",
		url   : SHIFTDUTY_URL() + `/api/dutyMake/getnotetopic`,
		params: param,
	})
}

// 调度命令 通过ID查询
export function getdispatch(param){
	return businessRequest({
		method: "get",
		url   : SHIFTDUTY_URL() + `/api/logCommand/getList`,
		params: param,
	})
}

// 调度命令 添加
export function savedispatch(param){
	return businessRequest({
		method: "post",
		url   : SHIFTDUTY_URL() + `/api/logCommand/add`,
		data  : param,
	})
}

//调度命令任务 通过ID查询
export function getById(param){
	return businessRequest({
		method: "get",
		url   : SHIFTDUTY_URL() + `/api/logCommand/queryById`,
		params: param,
	})
}

//调度命令任务 编辑
export function editdisoath(param){
	return businessRequest({
		method: "post",
		url   : SHIFTDUTY_URL() + `/api/logCommand/edit`,
		data  : param,
	})
}

//确认下发
export function issue(param){
	return businessRequest({
		method: "get",
		url   : SHIFTDUTY_URL() + `/api/logCommand/issue`,
		params: param,
	})
}

//完成
export function accomplish(param){
	return businessRequest({
		method: "get",
		url   : SHIFTDUTY_URL() + `/api/logCommand/accomplish`,
		params: param,
	})
}

// 设备状态 通过ID查询
export function getdevices(param){
	return businessRequest({
		method: "get",
		url   : SHIFTDUTY_URL() + `/api/lgLogEquipment/list`,
		params: param,
	})
}

// 设备状态 运行状态选择框
export function getstart(param){
	return businessRequest({
		method: "get",
		url   : SHIFTDUTY_URL() + `/api/lgLogEquipment/getstart`,
		params: param,
	})
}

// 设备状态 编辑
export function editdevices(param){
	return businessRequest({
		method: "post",
		url   : SHIFTDUTY_URL() + `/api/lgLogEquipment/edit`,
		data  : param,
	})
}

//设备状态变更历史
export function geteqhistory(param){
	return businessRequest({
		method: "get",
		url   : SHIFTDUTY_URL() + `/api/lgLogEqhistory/getHistory`,
		params: param,
	})
}

//设备状态变更历史  上一班
export function getUpLog(param){
	return businessRequest({
		method: "get",
		url   : SHIFTDUTY_URL() + `/api/lgLogEqhistory/getUpLog`,
		params: param,
	})
}

//设备状态变更历史  下一班
export function getNextLog(param){
	return businessRequest({
		method: "get",
		url   : SHIFTDUTY_URL() + `/api/lgLogEqhistory/getNextLog`,
		params: param,
	})
}

// 运行参数 通过ID查询
export function getparameter(param){
	return businessRequest({
		method: "get",
		url   : SHIFTDUTY_URL() + `/api/lgLogParm/list`,
		params: param,
	})
}

// 运行参数  编辑
export function editparameter(param){
	return businessRequest({
		method: "post",
		url   : SHIFTDUTY_URL() + `/api/lgLogParm/save`,
		data  : param,
	})
}

//交接物 查询
export function getgood(param){
	return businessRequest({
		method: "get",
		url   : SHIFTDUTY_URL() + `/api/lglogArticle/list`,
		params: param,
	})
}

// 交接物  编辑
export function savegood(param){
	return businessRequest({
		method: "post",
		url   : SHIFTDUTY_URL() + `/api/lglogArticle/save`,
		data  : param,
	})
}

//班会 查询
export function getclassmeet(param){
	return businessRequest({
		method: "get",
		url   : SHIFTDUTY_URL() + `/api/logMeeting/getList`,
		params: param,
	})
}

// 班会  编辑
export function editclassmeet(param){
	return businessRequest({
		method: "post",
		url   : SHIFTDUTY_URL() + `/api/logMeeting/add`,
		data  : param,
	})
}

//班会 交班
export function gethand(param){
	return businessRequest({
		method: "get",
		url   : SHIFTDUTY_URL() + `/api/logMeeting/handShift`,
		params: param,
	})
}

//班会 接班
export function getjoin(param){
	return businessRequest({
		method: "get",
		url   : SHIFTDUTY_URL() + `/api/logMeeting/joinShift`,
		params: param,
	})
}

//一键交接班
export function gethandorjoin(param){
	return businessRequest({
		method: "get",
		url   : SHIFTDUTY_URL() + `/api/logMeeting/gethandorjoin`,
		params: param,
	})
}

//通知交代 查询
export function getshort(param){
	return businessRequest({
		method: "get",
		url   : SHIFTDUTY_URL() + `/api/logNotification/list`,
		params: param,
	})
}

//通知交代 编辑
export function saveshort(param){
	return businessRequest({
		method: "post",
		url   : SHIFTDUTY_URL() + `/api/logNotification/save`,
		data  : param,
	})
}

//定期工作 查询
export function getperiod(param){
	return systemRequest({
		method: "post",
		url   : WORKORDER_URL() + `/api/pwPlan/find/list/page`,
		data  : param,
	})
}

//工作类型 查询
export function getWoType(param){
	return systemRequest({
		method: "get",
		url   : WORKORDER_URL() + `/api/woTypeTask/find/list`,
		params: param,
	})
}

//缺陷记录 查询
export function getdefectInfo(param){
	return systemRequest({
		method: "get",
		url   : WORKORDER_URL() + `/api/defectInfo/list`,
		params: param,
	})
}

//值班记事查询
export function getLogNoteAll(param){
	return businessRequest({
		method: "post",
		url   : SHIFTDUTY_URL() + `/api/dutyMake/getLogNoteAll`,
		data  : param,
	})
}

//值班记事ID查询
export function getlNoteId(param){
	return businessRequest({
		method: "get",
		url   : SHIFTDUTY_URL() + `/api/dutyMake/getlNoteId`,
		params: param,
	})
}

//查询当前时间及明天的排班表数据
export function getSchule(param){
	return businessRequest({
		method: "get",
		url   : SHIFTDUTY_URL() + `/api/log/isRefresh`,
		params: param,
	})
}
