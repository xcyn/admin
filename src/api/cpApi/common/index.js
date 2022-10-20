import { systemRequest } from '@/plugins/axios/index'
import request from "@/utils/request";
import {BPMN_URL} from "@/api/baseUrl";
const uuid = require('uuid')
/**
 * 根据数据模板key值，获取对应数据
 * @param {Object} query
 */
export function findDataByKey(param) {
  return systemRequest({
    url: '/business/v3/data/template/queryDataByKey',
    method: 'post',
    data: param
  })
}

/**
 * @param {Object} query
 * 启动流程
 */
export function StartFlow(query) {
  return systemRequest({
    url: '/business/v3/bpm/instance/startFlowFromList',
    method: 'post',
    params: query
  })
}

/**
 * @param {Object} query
 * 启动流程
 */
export function start(query) {
  return systemRequest({
    url: '/business/v3/bpm/instance/start',
    method: 'post',
    data: query
  })
}

/**
 * @param {Object} query
 * ids:是业务主键
 * 启动流程
 */
export function StartFlowNew(query) {
  return systemRequest({
    url: `/business/v3/bpm/instance/startFlowFromList?defKey=${query.defKey}&formKey=${query.formKey}&ids=${query.ids}`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: query.nodeUsers
  })
}

export function StartFlowWithTitle(query) {
  return systemRequest({
    url: `/business/v3/bpm/instance/startFlowFromListExpand?defKey=${query.defKey}&formKey=${query.formKey}&ids=${query.ids}&flowParam=${query.flowParam}`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: query.nodeUsers
  })
}

export function StartFlowByVariable(query) {
  return systemRequest({
    url: `/business/v3/bpm/instance/startFlowFromListExpand?defKey=${query.defKey}&formKey=${query.formKey}&ids=${query.ids}&destination=${query.destination}&flowParam=${query.flowParam}`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: query.nodeUsers
  })
}

export function StartFlowExpand(query) {
  return systemRequest({
    url: `/business/v3/bpm/instance/startFlowFromListExpand?defKey=${query.defKey}&formKey=${query.formKey}&ids=${query.ids}&flowParam=${query.flowParam}`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: query.nodeUsers
  })
}

export function StartFlowExpandTest(query) {
  return systemRequest({
    url: `/business/v3/bpm/instance/startFlowFromListExpand?defKey=${query.defKey}&formKey=${query.formKey}&ids=${query.ids}&flowParam=${query.flowParam}&destination=${query.destination}`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: query.nodeUsers
  })
}

export function startFlowFromListExpandAsync(query) {
  return systemRequest({
    url: `/business/v3/bpm/instance/startFlowFromListExpandAsync?defKey=${query.defKey}&formKey=${query.formKey}&ids=${query.ids}&flowParam=${query.flowParam}`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: query.nodeUsers
  })
}

/**
 * @param {Object} query
 * 获取当前节点待处理信息
 */
export function InitGetFlowData(query) {
  return systemRequest({
    url: '/business/v3/data/template/queryDataByKey',
    method: 'post',
    data: query
  })
}

/**
 * 根据业务主键获取实例信息
 * (如果是运行的实例,则包含当前的任务id和节点id)
 * @author mbb
 */
export function getByDefKeyBizKey(bizKey) {
  return systemRequest({
    url: '/business/v3/bpm/instance/getByDefKeyBizKey',
    method: 'get',
    params: { bizKey }
  })
}

/**
 * 根据实例ids,删除实例
 * @author mbb
 */
export function removeByIds(ids) {
  return systemRequest({
    url: '/business/v3/bpm/instance/remove',
    method: 'post',
    params: { ids }
  })
}

/**
 * @param {Object} query
 * 审核通过
 * {
    "data": "表单提交的JSON格式数据，可以在表单预览界面找到对应格式。非必填",
    "opinion": "审核意见，非必填",
    "taskId": "流程任务ID，必填，通过InitGetFlowData接口获取",
    "variableMap": {    // 流程变量MAP，非必填
      "变量Key": "变量值Value",
      "additionalProp2": "string",
      "additionalProp3": "string"
    },
    "jumpType": "common" 路径跳转类型，非必填,
    "nodeUsers": [ 指定节点执行人信息，非必填,优先级比变量高  "[{\"nodeId\":\"userTask1\", \"executors\":[{\"id\":\"1\", \"name\":\"管理员\", \"type\":\"employee/party\", \"groupType\":\"org/role/position/group(当type值=party时必填)\"}]}]"
      {
        "nodeId": "userTask1", 流程节点编码
        "executors":[ 执行人信息
          { "id": "1",
            "name": "管理员",
            "type": "employee/party",
            "groupType": "org/role/position/group(当type值=party时必填)"
          }
        ]
    ]
  }
 *
 */
export function ApproveAgree(query) {
  return systemRequest({
    url: '/business/v3/bpm/task/agree',
    method: 'post',
    data: query,
    headers: {
      transFlag: false
    }
  })
}

export function ApproveAgreeWithTrans(query) {
  return systemRequest({
    url: '/business/v3/bpm/task/agree',
    method: 'post',
    data: query,
    headers: {
      transFlag: true,
      'CP-message-id': uuid(),
      'CP-transaction-id': uuid()
    }
  })
}

/**
 * 获得流程审批历史节点
 * @param bizKey 业务主键(两票为例传wtId即可)
 * @author mbb
 */
export function HistoryList(bizKey) {
  return systemRequest({
    url: '/business/v3/bpm/instance/flowHistory',
    method: 'post',
    data: { bizKey: `${bizKey}` }
  })
}

/**
 * @param {Object} query
  {
    "backHandMode": "string",返回方式：direct/normal
    "data": "表单提交的JSON格式数据，可以在表单预览界面找到对应格式。非必填",
    "opinion": "审核意见，非必填",
    "taskId": "流程任务ID，必填，通过InitGetFlowData接口获取",
    "variableMap": {    // 流程变量MAP，非必填
      "变量Key": "变量值Value",
      "additionalProp2": "string",
      "additionalProp3": "string"
    }
  }
 * 驳回上一步
 */
export function previous(query) {
  return systemRequest({
    url: '/business/v3/bpm/task/reject/previous',
    method: 'post',
    data: query
  })
}

/**
 * 驳回
 * @author mbb
 */
export function reject(data) {
  return systemRequest({
    url: '/business/v3/bpm/task/reject',
    method: 'post',
    data: data,
    headers: {
      transFlag: false
    }
  })
}

/**
 * 驳回
 * @author mbb
 */
export function rejectWithTrans(data) {
  return systemRequest({
    url: '/business/v3/bpm/task/reject',
    method: 'post',
    data: data,
    headers: {
      transFlag: true,
      'CP-message-id': uuid(),
      'CP-transaction-id': uuid()
    }
  })
}

/**
 * @param {Object} query 反对
 */
export function oppose(query) {
  return systemRequest({
    url: '/business/v3/bpm/task/oppose',
    method: 'post',
    data: query
  })
}

/**
 * @param {Object} query获取表单数据
 */
export function getFormData(query) {
  return systemRequest({
    url: '/business/v3/bpm/task/getFormData',
    method: 'get',
    params: query
  })
}

/**
 * @param {Object} query
 * endReason
 * messageType
 * taskId
 * 终止流程
 */
export function endProcess(query) {
  return systemRequest({
    url: '/business/v3/bpm/task/doEndProcess',
    method: 'post',
    params: query
  })
}

// 文件上传
export function fileUpload(file) {
  var formData = new FormData()
  formData.append('file', file)
  return systemRequest({
    url: '/platform/v3/file/upload',
    method: 'post',
    data: formData
  })
}

// 文件下载
export function fileDownload(attachmentId) {
  return systemRequest({
    url: '/platform/v3/file/download',
    method: 'GET',
    responseType: 'arraybuffer',
    params: { attachmentId: attachmentId }
  })
}

// 文件预览
export function filePreview(attachmentId) {
  return systemRequest({
    url: '/platform/v3/file/getImage',
    method: 'GET',
    responseType: 'arraybuffer',
    Accept: 'image/avif,image/webp,image/apng,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,image/*,*/*;q=0.8',
    params: { attachmentId: attachmentId }
  })
}

// 根据条件获取组织
export function findAllByCondition(query) {
  return systemRequest({
    url: '/extend/v3/entity/findAllByCondition',
    method: 'post',
    data: query
  })
}


// zhangcongjie 根据taskId获取初始化脚本及按钮脚本
export function getSettingScript(params) {
  return request({
    url: BPMN_URL() + '/bpm/definition/settingByScript',
    method: 'get',
    params: params
  })
}



// zhangcongjie 根据defkey获取初始化脚本及按钮脚本
export function getStartScript(params) {
  return request({
    url: BPMN_URL() + '/bpm/definition/getStartScript',
    method: 'get',
    params: params
  })
}
