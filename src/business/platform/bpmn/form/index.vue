<template>
  <div v-loading.fullscreen.lock="loading" :element-loading-text="$t('common.loading')">
    <template v-if="formModelType === 'INNER'">
      <!---在线表单--->
      <formrender v-if="formDef" ref="formrender" :form-def="formDef" :buttons="buttons" :data="formData" :params="formParams" :readonly="readonly" @action-event="(actionKey,args)=>emitEventHandler(actionKey,args)" @callback="callbackPage" @close="closeDialog" />
    </template>
    <!---内嵌url表单,外部url表单---->
    <template v-else-if="formModelType === 'URL_LOAD'|| formModelType === 'FRAME'">
       <!--url表单 iframe方式-->
      <iframe v-if="formUrlType === 'iframe'" ref="formrender" :class="formModelType === 'URL_LOAD'?'ibps-container-url-frame':'ibps-container-frame'" frameborder="0" />
      <!--url表单 vue组件方式-->
      <component :is="formUrlName" v-else ref="formrender" :params="formParams" :readonly="readonly" @action-event="(actionKey,args)=>emitButtonEventHandler(actionKey,args)" @callback="callbackPage" @close="closeDialog" />
      <form-toolbar v-if="autoFlow =='true' && formModelType === 'URL_LOAD'" :actions="buttons" @validate="validateForm" @action-event="(actionKey,args)=>emitButtonEventHandler(actionKey,args)" @callback="callbackPage" @close="closeDialog" />
      <!--华能-->
      <form-toolbar v-if="(autoFlow == 'false') &&formModelType === 'URL_LOAD'&&(bizKey=='Process_mat_waste_V1'||bizKey=='Process_mat_arr_chact_V1'||bizKey=='Process_mat_transfer_V1'||bizKey=='Process_mat_check_V1'||bizKey=='Process_mat_borrow_V1'||bizKey=='Process_mat_revert_V1'||bizKey=='Process_mat_reject_V1'||bizKey=='Process_mat_back_V1'||bizKey=='Process_mat_collar_V1'||bizKey=='Process_tickets_operateticket_V1'|| bizKey=='Process_defect_eqpDefect_V1' || bizKey=='Process_shift_stopsend_V1' || bizKey=='Process_shift_rucd_V1' || bizKey=='Process_shift_lock_V1' ||title=='隐患管理流程'|| title=='问题管理流程'|| title=='任务管理流程')" :actions="buttons" @validate="validateForm" @action-event="(actionKey,args)=>emitButtonEventHandler(actionKey,args)" @callback="callbackPage" @close="closeDialog" />

      <!--      <form-toolbar  v-if="formModelType === 'URL_LOAD'" :actions="buttons" @validate="validateForm" @action-event="(actionKey,args)=>emitButtonEventHandler(actionKey,args)" @callback="callbackPage" @close="closeDialog" />-->
    </template>
    <!--其他-->
    <template v-else>
      <form-toolbar :actions="buttons" @validate="validateForm" @action-event="(actionKey,args)=>emitButtonEventHandler(actionKey,args)" @callback="callbackPage" @close="closeDialog" />
      <ibps-empty v-if="formModelType === 'NONE'" class="ibps-p-20" desc="流程未绑定表单" />
    </template>

    <!--流程图-->
    <flow-diagram-dialog :visible="flowDiagramVisible" :def-id="defId" :task-id="taskId" :inst-id="bpmnProInstId" @close="visible => flowDiagramVisible= visible" />
    <!--流程历史-->
    <approval-history-dialog :visible="approvalHistoryVisible" :task-id="taskId" :inst-id="bpmnProInstId" @close="visible => approvalHistoryVisible= visible" />
    <!--流程实例-->
    <instance-detail :visible="instanceDetailVisible" :bpmn-inst-id="bpmnProInstId" @close="visible => instanceDetailVisible= visible" />

    <!--启动流程-->
    <start-flow-dialog :visible="startFlowDialogVisible" :def-id="defId" :data="submitFormData" :title="actionTitle" @close="visible => startFlowDialogVisible= visible" @action-event="saveStartFlow" />

    <!--同意-->
    <agree-dialog :visible="agreeDialogVisible" :action="actionName" :title="actionTitle" :task-id="taskId" :version="version" :is-common="attributes.isCommonJumpType" :hide-opinion="isBpmOpinionHide" :hide-path="attributes.isHidePath" :form-opinion="submitFormOpinion" @close="visible => agreeDialogVisible= visible" @action-event="handleActionEvent" />

    <!--驳回-->
    <reject-dialog :visible="rejectDialogVisible" :action="actionName" :title="actionTitle" :task-id="taskId" :hide-opinion="isBpmOpinionHide" :form-opinion="submitFormOpinion" @close="visible => rejectDialogVisible= visible" @action-event="handleActionEvent" />
    <!--终止流程-->
    <approve-dialog :visible="approveDialogVisible" :action="actionName" :title="actionTitle" :task-id="taskId" :hide-opinion="isBpmOpinionHide" :form-opinion="submitFormOpinion" callback-event @close="visible => approveDialogVisible= visible" @action-event="handleActionEvent" />
    <!--转办-->
    <delegate-dialog :id="taskChangeId" :visible="delegateDialogVisible" :action="actionName" :title="actionTitle" :task-id="taskId" :readonly="delegateReadonly" @close="visible => delegateDialogVisible= visible" @callback="callbackPage" />
    <!--任务补签-->
    <add-sign-task-dialog :visible="addSignTaskDialogVisible" :action="actionName" :title="actionTitle" :task-id="taskId" :hide-opinion="false" :form-opinion="submitFormOpinion" @close="visible => addSignTaskDialogVisible= visible" @action-event="handleActionEvent" @callback="callbackPage" />
    <!--表单打印-->
    <form-print-template v-if="$utils.isNotEmpty(printTemplateId)" :id="printTemplateId" :visible="formPrintTemplateDialogVisible" :data="submitFormData" :pk="pkValue" @close="visible => formPrintTemplateDialogVisible = visible" />
  </div>
</template>
<script>
import { getFormData, getInstFormData } from '@/api/platform/bpmn/bpmInst'
import { getTaskFormData } from '@/api/platform/bpmn/bpmTask'

import FormUtil from '@/business/platform/form/utils/formUtil'
import FormFieldUtil from '@/business/platform/form/utils/formFieldUtil'
import ActionMixin from './action'
import BpmnButton from './button'

import Formrender from '@/business/platform/form/formrender/index.vue'
import FormToolbar from '@/business/platform/form/formrender/toolbar.vue'

import FlowDiagramDialog from '@/business/platform/bpmn/components/flow-diagram/dialog'
import ApprovalHistoryDialog from '@/business/platform/bpmn/components/approval-history/dialog'
import InstanceDetail from '@/views/platform/bpmn/bpmInst/detail'

import StartFlowDialog from '@/business/platform/bpmn/form-ext/start-flow'
import AgreeDialog from '@/business/platform/bpmn/form-ext/agree'
import RejectDialog from '@/business/platform/bpmn/form-ext/reject'
import ApproveDialog from '@/business/platform/bpmn/form-ext/approve'
import DelegateDialog from '@/business/platform/bpmn/task-change/edit'
import AddSignTaskDialog from '@/business/platform/bpmn/form-ext/add-sign-task'

import FormPrintTemplate from '@/business/platform/form/form-print/template'
import * as utils from '@/utils/cpUtils/index'
import * as commonHttp from "@/api/cpApi/common";
import { validateInteger } from '@/utils/validate'
const _import = require('@/utils/util.import.' + process.env.NODE_ENV)

export default {
  components: {
    Formrender,
    FormToolbar,
    FlowDiagramDialog,
    ApprovalHistoryDialog,
    InstanceDetail,
    StartFlowDialog,
    AgreeDialog,
    RejectDialog,
    ApproveDialog,
    DelegateDialog,
    AddSignTaskDialog,
    FormPrintTemplate
  },
  mixins: [
    ActionMixin
  ],
  props: {
    defId: { // 流程定义ID
      type: String
    },
    proInstId: { // 草稿流程实例ID
      type: String
    },
    instanceId: { // 流程实例ID
      type: String
    },
    taskId: { // 流程任务ID
      type: String
    },
    taskChangeId: { // 转办代理任务ID
      type: String
    },
    copyFlow: { // 是否复制流程
      type: Boolean,
      default: false
    },
    closeable: {
      type: Boolean,
      default: true
    },
  },
  data() {
    return {
      title: '', // 因为表中数据都是可能会变的,暂时使用标题作为判断条件
      bizKey: '', //
      nodeKey: '',
      autoFlow:true,
      myScript:'', // 暂存前置脚本数据
      flowDiagramVisible: false,
      approvalHistoryVisible: false,
      instanceDetailVisible: false,
      startFlowDialogVisible: false,
      agreeDialogVisible: false, // 同意
      rejectDialogVisible: false,
      delegateDialogVisible: false,
      addSignTaskDialogVisible: false,
      approveDialogVisible: false,
      delegateReadonly: false,
      endProcessTaskId: '',
      actionName: '',
      actionTitle: '',
      version: '',
      // ========表单的数据=======
      loading: false,
      formUrlName: '',
      formUrlType: 'inner', // 内嵌url方式：inner： vue组件方式，iframe：iframe方式

      formModelType: 'none',

      formModel: {
        type: 'INNER'
      },
      formDef: null,
      buttons: [],
      formData: {},
      attributes: {}, // 添加扩展属性
      formParams: {}, // 表单流程扩展参数
      isBpmOpinionHide: false,
      readonly: false,
      bpmnProInstId: '', // 流程实例ID

      submitFormData: {},
      submitFormOpinion: '',
      printTemplateId: '',
      formPrintTemplateDialogVisible: false,
      pkValue: '',
      scripts: {
        initForm: '',
        beforeScript: '',
        afterScript: '',
        buttons: []
      },
      transFlag: false,
      buttonKey: 'agree',
      buttonName: '同意',
      flowScriptsFlag: false
    }
  },
  watch: {
    visible: {
      handler: function (val, oldVal) {
        this.dialogVisible = this.visible
      },
      immediate: true
    }
  },
  beforeDestroy() {
    this.formModel = null
    this.formDef = null
    this.buttons = null
    this.formData = null
    this.attributes = null
    this.formParams = null
    this.submitFormData = null
  },
  methods: {
    // 获取数据
    loadFormData() {
      this.loading = true
      this.formDef = null
      this.buttons = null
      this.formData = null
      this.$nextTick(() => {
        this.readonly = false
        if (this.$utils.isNotEmpty(this.taskId)) { // 处理流程任务
          this.getTaskFormData()
        } else if (this.$utils.isNotEmpty(this.defId)) { // 启动 或者草稿流程启动
          this.getDefinitionFormData()
        } else if (this.$utils.isNotEmpty(this.instanceId)) { // 流程实例
          this.getInstanceFormData()
        } else {
          this.$alert('未获取正确的参数，请检查传入参数').then(() => {
            this.closeDialog()
          })
          this.loading = false
        }
      })
    },

    /**
     * 启动 或者草稿流程。
     */
    getDefinitionFormData() {
      const proInstId = this.proInstId || null
      const copyFlow = this.copyFlow || null
      this.formParams.defId = this.defId
      this.formParams.proInstId = this.bpmnProInstId = proInstId
      this.formParams.copyFlow = copyFlow

      // 标志是否编辑
      this.formParams.isEdit = this.$utils.isNotEmpty(this.bpmnProInstId) ? true : (!!this.$utils.isNotEmpty(copyFlow))
      getFormData({
        defId: this.defId,
        proInstId: proInstId,
        copy: copyFlow
      }).then(response => {
        this.loading = false
        this.buildFormData(response.data)
      }).catch(() => {
        this.loading = false
      })
    },
    /**
     * 获取流程任务表单
     */
    getTaskFormData() {
      this.loading = true
      this.formParams.taskId = this.taskId || null
      // 标志是否编辑
      this.formParams.isEdit = true
      getTaskFormData({
        taskId: this.taskId
      }).then(response => {
        this.loading = false
        this.autoFlow = process.env.VUE_APP_FLOW_IS_AUTO
        this.buildFormData(response.data)
        if (response.data && response.data.variables && response.data.variables.flowKey_) {
          this.bizKey = response.data.variables.flowKey_
        }
        // 获取名称
        if (response.data && response.data.attributes && response.data.attributes.proInstId) {
          getInstFormData({ instId: response.data.attributes.proInstId }).then((res) => {
            this.title = res.data && res.data.title ? res.data.title : ''
          })
        }
      }).catch(() => {
        this.loading = false
      })
    },
    /**
     * 流程实例 的表单数据
     */
    getInstanceFormData() {
      this.readonly = true
      this.formParams.instanceId = this.bpmnProInstId = this.instanceId || null

      // 标志是否编辑
      this.formParams.isEdit = true
      getInstFormData({
        instId: this.instanceId
      }).then(response => {
        this.loading = false
        this.buildFormData(response.data)
      }).catch(() => {
        this.loading = false
      })
    },
    /**
     * 构建表单相关数据
     */
    buildFormData(data) {
      if (this.$utils.isEmpty(data)) {
        this.$alert(`未获取到数据`).then(() => {
          this.closeDialog()
        })
        return
      }

      this.formModelType = data.formModelType

      // ==== 无表单的流程
      if (this.formModelType === 'none') {
        // 通过启动页面打开需要额外提示
        if (this.$utils.isNotEmpty(this.defId)) {
          this.$alert(`该流程不支持页面启动流程，请通过接口操作`).then(() => {
            this.closeDialog()
          })
          return
        }
        // 一些参数
        this.attributes = this.initAttributes(data)
        // 操作按钮
        this.buttons = this.buildButtons(data.buttons, this.attributes) || []
        this.formParams.nodeId = this.attributes.nodeId
        this.bpmnProInstId = this.attributes.proInstId
        return
      }

      const formModel = data.formModel
      // 判断是否设置表单
      if (this.$utils.isEmpty(formModel)) {
        this.$alert(`未设置表单,请流程定义中设置表单`).then(() => {
          this.closeDialog()
        })
        return
      }

      this.formModel = formModel

      this.formModelType = formModel.type

      this.formUrlType = 'inner'
      // ============在线表单 ================
      if (this.formModelType === 'INNER') {
        if (this.$utils.isEmpty(formModel.formData)) {
          this.$alert(`未设置在线表单`).then(() => {
            this.closeDialog()
          })
        }

        // 表单定义
        this.formDef = this.$utils.parseData(formModel.formData) || {}

        this.formData = {
          // 表单数据
          responses: this.$utils.parseData(data.boData) || {},
          // 表单权限
          permissions: this.$utils.parseData(data.permissions) || {}
        }

        // 一些参数
        this.attributes = this.initAttributes(data)
        this.formParams.nodeId = this.attributes.nodeId
        // 操作按钮
        this.buttons = this.buildButtons(data.buttons, this.attributes) || []
        // 表单意见
        this.formParams.formOpinionData = FormUtil.initFormOpinionData(data.attributes || {})

        // 表单意见是否隐藏意见
        setTimeout(() => {
          this.isBpmOpinionHide = this.handleBpmOpinionHide(data.attributes || {}, this.formDef)
        }, 100)
        // 流程关联信息
        this.formParams.bpmLinkData = FormUtil.getBpmLinkData(data.attributes || {})
        // 打印模版ID
        this.printTemplateId = this.attributes.printTemplateId

        // 版本号
        this.version = data.version
        // 流程实例当前审批节点
        this.endProcessTaskId = data.endProcessTaskId

        //  ============内嵌表单[按钮这边提供] ================
      } else if (this.formModelType === 'URL_LOAD') {
        const urlForm = formModel.formValue
        if (this.$utils.isEmpty(urlForm)) {
          this.$alert(`未设置内嵌表单`).then(() => {
            this.closeDialog()
          })
        }
        // 一些参数
        this.attributes = this.initAttributes(data)
        this.formParams.nodeId = this.attributes.nodeId

        // 操作按钮
        this.buttons = this.buildButtons(data.buttons, this.attributes) || []
        // 初始化url表单
        this.initUrlForm(urlForm)
        this.$nextTick(() => {
          setTimeout(() => {
            this.initScriptData()
          },500)
        });
        //  ============外部表单【iframe】 ================
      } else if (this.formModelType === 'FRAME') {
        const urlForm = formModel.formValue
        if (this.$utils.isEmpty(urlForm)) {
          this.$alert(`未设置外部表单`).then(() => {
            this.closeDialog()
          })
        }
        // 初始化url表单
        this.initUrlForm(urlForm)
      }
    },
    // 初始化url表单
    initUrlForm(url) {
      if (url.startsWith('http')) {
        this.formUrlType = 'iframe'
        this.$nextTick(() => {
          this.$refs.formrender.src = url
          // 传递消息
          this.$refs.formrender.contentWindow.postMessage({ data: this.attributes }, '*')
        })
      } else {
        const component = url.split('?')[0]
        this.formParams.attrs = this.urlParse(url)
        this.formUrlType = 'inner'
        const formUrlName = 'IbpsBpmnFormUrl'
        this.$options.components[formUrlName] = _import(component)
        this.formUrlName = formUrlName
      }
    },
    urlParse(str) {
      const obj = {}
      if (str.indexOf('?') !== -1) {
        const str1 = str.split('?')[1].split('&')
        for (let i = 0; i < str1.length; i++) {
          const params = str1[i].split('=')
          obj[params[0]] = params[1]
        }
      }
      return obj
    },
    initAttributes(data) {
      const attributes = data.attributes || {}
      return {
        title: this.title,
        defId: this.defId,
        proInstId: this.$utils.isNotEmpty(this.bpmnProInstId) ? this.bpmnProInstId : attributes.proInstId,
        taskId: this.taskId,
        // 流程节点
        nodeId: attributes.nodeId,
        // 锁定用户
        lockUser: attributes.lockUser,
        // 当前用户
        curUserId: attributes.curUserId,
        // 挂起状态
        suspendState: attributes.suspendState,
        // 是否转办
        isHiddenDelegate: this.$utils.toBoolean(attributes.isHiddenDelegate),
        // 是否正常跳转
        isCommonJumpType: this.$utils.toBoolean(attributes.isCommonJumpType),
        // 是否隐藏意见
        isHideOpinion: this.$utils.toBoolean(attributes.isHideOpinion),
        // 是否隐藏路径
        isHidePath: this.$utils.toBoolean(attributes.isHidePath),
        // 是否结束
        isEnd: this.$utils.toBoolean(attributes.isEnd),
        // 第一个节点是否选择
        firstNodeUserAssign: attributes.firstNodeUserAssign,
        // 打印模版
        printTemplateId: data.formModel ? data.formModel.templateId : '',
        // BO版本号
        version: data.version,
        isDisabled: this.buttonsIsDisable(attributes)
      }
    },
    handleBpmOpinionHide(attributes = {}, formDef) {
      const formOpinionSetting = attributes.formOpinionSetting
      const formOpinion = attributes.formOpinion
      const curNodeId = attributes.nodeId
      const hasFormOpinion = this.hasFormOpinion()
      // 处理删除审批意见的bug
      if (this.$utils.isNotEmpty(formOpinionSetting) && this.$utils.isNotEmpty(formOpinion)) {
        const formOpinionField = FormFieldUtil.getFormOpinionField(formDef.fields)
        for (const key in formOpinion) {
          const nodeList = formOpinion[key]
          if (!formOpinionField[key]) {
            const nodeKey = JSON.stringify(nodeList)
            delete formOpinionSetting[nodeKey]
          }
        }
      }

      if (this.$utils.isNotEmpty(formOpinionSetting)) {
        let flag = false
        for (const o in formOpinionSetting) {
          const formOpinionHidden = formOpinionSetting[o]
          try {
            const nodeIds = this.$utils.parseJSON(o)
            if (nodeIds.includes(curNodeId)) {
              flag = this.$utils.toBoolean(formOpinionHidden)
              break
            }
          } catch (err) {
            console.error(err)
          }
        }
        return hasFormOpinion && !flag ? flag : true
      }
      // 是否有表单意见
      return hasFormOpinion ? true : (this.attributes.isHideOpinion || false)
    },
    /**
     * 构建操作按钮
     */
    buildButtons(toolbars, params) {
      if (this.$utils.isEmpty(toolbars)) {
        toolbars = []
      }
      // 如果转办，代理不为空
      if (this.$utils.isNotEmpty(this.taskChangeId)) {
        toolbars.unshift({
          alias: 'delegateDetail',
          name: '转办/代理明细'
        })
      }
      if (this.closeable) {
          toolbars.unshift({
            alias: 'close'
          })
      }
      const buttons = []
      for (let i = 0; i < toolbars.length; i++) {
        const button = toolbars[i]
        const alias = button.alias
        const code = button.code
        button.key = alias === 'custom' ? (code || (alias + i)) : alias
        buttons.push(button)
      }
      const bpmnButton = new BpmnButton({
        buttons: buttons,
        params: params
      })
      return bpmnButton.response_buttons
    },
    buttonsIsDisable(params) {
      let buttonFlag = true
      const curUserObj = utils.getLoginInfo()
      if (curUserObj != null) {
        var userObj = curUserObj['user']
        if (userObj != null) {
          if (curUserObj['user'].id === '1') {
            buttonFlag = false
            return false
          }
          params.opinionList.forEach(item => {
            if (item.taskKey === params.nodeId) {
              if (item.qualifiedExecutor) {
                item.qualifiedExecutor.forEach(users => {
                  if (curUserObj['user'].id === users.executId) {
                    buttonFlag = false
                  }
                })
              }
            }
          })
        }
      }
      return buttonFlag
    },
    getFormEL() {
      if (this.formUrlType === 'inner') {
        return this.$refs.formrender
      } else {
        try {
          // 跨域获取表单数据
          return this.$refs.formrender.contentWindow.ibpsFormUrl
        } catch (err) {
          console.error(err)
        }
      }
    },
    // 获取表单数据
    getFormData() {
      if (!(this.getFormEL() && this.getFormEL().getFormData)) {
        this.$message({
          message: 'URL表单必须包含获取表单数据的方法【getFormData】',
          type: 'warning'
        })
        return
      }
      return this.getFormEL().getFormData()
    },
    // 是否有审批意见字段
    hasFormOpinion() {
      if (!(this.getFormEL() && this.getFormEL().hasFormOpinion)) {
        return false
      }
      return this.getFormEL().hasFormOpinion() || false
    },
    // 获取表单意见数据
    getFormOpinionData() {
      if (!(this.getFormEL() && this.getFormEL().getFormOpinionData)) {
        return ''
      }
      const formOpinionData = this.getFormEL().getFormOpinionData()
      let data = ''
      if (this.$utils.isEmpty(formOpinionData)) {
        return data
      }
      // 如果只有一个，多个，取最后一个
      for (const key in formOpinionData) {
        data = formOpinionData[key]
      }
      return data
    },
    /**
     * 获取审批意见验证
     */
    formOpinionValidate(calback, flag) {
      if (!(this.getFormEL() && this.getFormEL().formOpinionValidate)) {
        calback(false)
        return false
      }
      this.getFormEL().formOpinionValidate(calback, flag)
    },
    // 前置事件
    beforeScript(key, callback) {
      if (!(this.getFormEL() && this.getFormEL().beforeScript)) {
        const flag = true
        callback(flag)
        return
      }
      return this.getFormEL().beforeScript(key, callback)
    },
    // 后置事件
    afterScript(key, params, callback) {
      if (!(this.getFormEL() && this.getFormEL().afterScript)) {
        const flag = true
        callback(flag)
        return
      }
      return this.getFormEL().afterScript(key, params, callback)
    },
    // 回调上一个页面
    callbackPage() {
      this.closeDialog()
      this.$emit('callback', this)
    },
    // 关闭当前窗口
    closeDialog() {
      if (this.closeable) {
        this.$emit('close', false)
      }
    },
    // 验证表单
    validateForm(callback) {
      if (!(this.getFormEL() && this.getFormEL().validate)) {
        const flag = true
        callback(flag)
        return
      }
      this.getFormEL().validate((valid, invalidFields) => {
        callback(valid, invalidFields)
      })
    },
    /**
     * ----------------------------------------流程控制区-------------------------------------------------------
     * 执行初始化脚本
     *
     */
    initScriptData() {
      if(this.taskId){
        commonHttp.getSettingScript({
          taskId: this.taskId
        }).then(response => {
          try {
            const responseData = response.data
            if (responseData.script !== null) {
              if (responseData.script.INITFORMSCRIPT) {
                let initFormScript = eval('(' + responseData.script.INITFORMSCRIPT + ')')
                this.doInitFormScript(initFormScript)
              }
              if (responseData.buttons !== null) {
                this.scripts.buttons = responseData.buttons
              }
            }
          } catch (err) {
            console.error(err)
            this.dialogLoading = false
          }
        }).catch(() => {
          this.dialogLoading = false
        })
      }
    },
    /**
     * 执行初始化脚本
     *
     */
    doInitFormScript(params) {
      if (params.disable_data) {
        params.disable_data.forEach((item, index) => {
          this.getFormEL().getThisData().initForm.disableData.push(item)
        })
      }
      if(params.show_data){
        params.show_data.forEach((item, index) => {
          this.getFormEL().getThisData().initForm.disableData = this.getFormEL().getThisData().initForm.disableData.filter(t => t != item)
        })
      }
      if(params.edit_data){
        params.edit_data.forEach((item, index) => {
          this.getFormEL().getThisData().initForm.readOnlyData = this.getFormEL().getThisData().initForm.readOnlyData.filter(t => t != item)
        })
      }
      if(params.readOnly_data){
        params.readOnly_data.forEach((item, index) => {
          this.getFormEL().getThisData().initForm.readOnlyData.push(item)
        })
      }
      if(params.init_data) {
        params.init_data.forEach((item, index) => {
          let that = this.getFormEL().getThisData()
          if(typeof item.value === 'boolean'){
            let fieldStr = 'that.' + item.field + "= " + item.value
            eval('(' + fieldStr + ')')
          }else{
            if(item.value.indexOf('defaultData') != -1 || item.value.indexOf('formData') != -1){
              let fieldStr = 'that.' + item.field + '= that.' + item.value
              eval('(' + fieldStr + ')')
            } else {
              let fieldStr = 'that.' + item.field + "= '" + item.value + "'"
              eval('(' + fieldStr + ')')
            }
          }
        })
      }
      if (params.require_data) {
        let s = params.require_data
        let formRules = this.getFormEL().getThisData().initForm.requireData
        let requireData = {}

        for (let [key, value] of Object.entries(s)) {
          if (value.required) {
            let requiredMessage = ''
            let requiredName = ''
            let keyData = []
            for (let [key1, value1] of Object.entries(value)) {
              if (key1 === 'message') {
                requiredMessage = value1
              }
              if (key1 === 'name') {
                requiredName = value1
              }
              if (key1 === 'maxLen') {
                let message = '长度不能超过' + value1 + '个字符'
                keyData.push({ min: 1, max: value1, message: value.name ? value.name + message : message, trigger: 'blur' })
              }
              if (key1 === 'len') {
                let message = '长度必须' + value1 + '个字符'
                keyData.push({ min: value1, max: value1, message: value.name ? value.name + message : message, trigger: 'blur' })
              }
              if (key1 === 'type') {
                if (value1 === 'int') {
                  keyData.push({ validator: validateInteger, trigger: 'blur' })
                }
                if (value1 === 'float') {
                  keyData.push({ validator: validateFloat, trigger: 'blur' })
                }
              }
            }
            if (requiredMessage != '') {
              keyData.push({ required: true, message: requiredMessage, trigger: 'blur' })
            } else {
              keyData.push({ required: true, message: requiredName + '不能为空', trigger: 'blur' })
            }
            requireData = Object.assign(requireData, { [key]: keyData })
          } else {
            requireData = Object.assign(requireData, { [key]: [] })
          }
        }
        this.getFormEL().getThisData().initForm.requireData = Object.assign(formRules, requireData)
      }
    },

    // 执行前置脚本
    doBeforeScript(params, callback) {
      this.getFormEL().validateForm((result) => {
        if (result) {
          this.buttonKey = params.key
          this.buttonName = params.attributes.name
          let beforeScriptStr = params.attributes.beforeScript
          this.myScript = params.attributes.beforeScript
          if (!beforeScriptStr) {
            const flag = true
            callback(flag)
            return
          }
          let that = this.getFormEL().getThisData()
          let this_ = this
          let scriptStr = beforeScriptStr
          let doFunction = eval('(' + scriptStr + ')')
          try {
            doFunction()
            const flag = true
            callback(flag)
            return
          } catch (e) {
            console.log('e',	e)
            if (!e.message || e.message !== 'isShow') {
              this.$message.error('脚本执行错误,请检查流程脚本配置')
            }
            callback(false)
          }
        }
      })
    },
    doMyScript(callback){
      this.getFormEL().validateForm((result) => {
        if (result) {
          let beforeScriptStr = this.myScript
          if (!beforeScriptStr) {
            const flag = true
            callback(flag)
            return
          }
          let that = this.getFormEL().getThisData()
          let this_ = this
          let scriptStr = beforeScriptStr
          let doFunction = eval('(' + scriptStr + ')')
          try {
            doFunction()
            const flag = true
            callback(flag)
            return
          } catch (e) {
            console.log('e',	e)
            if (!e.message || e.message !== 'isShow') {
              this.$message.error('脚本执行错误,请检查流程脚本配置')
            }
            callback(false)
          }
        }
      })
    },
    // 执行前置脚本
    doAfterScript() {
      for (let i = 0; i < this.scripts.buttons.length; i++) {
        let key = this.scripts.buttons[i].alias === 'custom' ? this.scripts.buttons[i].code : this.scripts.buttons[i].alias
        let name = this.scripts.buttons[i].name
        if (key === this.buttonKey && name === this.buttonName) {
          let scriptStr = this.scripts.buttons[i].afterScript
          if (scriptStr === '' || scriptStr === null) {
            return ''
          }
          let that = this.getFormEL().getThisData()
          let this_ = this
          let doFunction = eval('(' + scriptStr + ')')
          doFunction()
          return 'success'
        }
      }
    },

    /**
     * 获取流程变量
     *
     */
    getFlowVarData() {
      if (this.taskId === null || this.taskId === '') {
        this.$message({
          message: '流程任务节点缺失！',
          type: 'error'
        })
        this.loading = false
        return
      }
      this.getFormEL().getThisData().flowRequestParams.taskId = this.taskId
      return this.getFormEL().getThisData().flowRequestParams
    },

    /**
     * 更新流程变量--通过表单
     * @param flowVariable  流程变量
     * @param formField 	表单字段
     * @param expression 	表达式
     */
    updateFlowVariable(flowVariable, formField, expression) {
      let variableMap = ''
      if(typeof expression === 'undefined'){
        if(formField.indexOf('defaultData') != -1 || formField.indexOf('formData') != -1){
          if(formField.indexOf('formData') != -1){
            formField = formField.replace(/formData./g, '')
            variableMap = this.getFormEL().getThisData().formData[formField]
          }
          if(formField.indexOf('defaultData') != -1){
            formField = formField.replace(/defaultData./g, '')
            variableMap = this.getFormEL().getThisData().defaultData[formField]
          }
        }else{
          variableMap = formField
        }
      }else{
        if (expression.indexOf('formData') != -1 && expression.indexOf('defaultData') != -1) {
          expression = expression.replace(/formData/g, 'that.formData')
          expression = expression.replace(/defaultData/g, 'that.defaultData')
        } else if (expression.indexOf('defaultData') != -1) {
          expression = expression.replace(/defaultData/g, 'that.defaultData')
        } else if (expression.indexOf('formData') != -1) {
          expression = expression.replace(/formData/g, 'that.formData')
        }
          let that = this.getFormEL().getThisData()
          let this_ = this
          let conditional = eval(expression)
          if (conditional) {
            if(formField.indexOf('defaultData') != -1 || formField.indexOf('formData') != -1){
              if(formField.indexOf('formData') != -1){
                formField = formField.replace(/formData./g, '')
                variableMap = this.getFormEL().getThisData().formData[formField]
              }
              if(formField.indexOf('defaultData') != -1){
                formField = formField.replace(/defaultData./g, '')
                variableMap = this.getFormEL().getThisData().defaultData[formField]
              }
            }else{
              variableMap = formField
            }
          }
      }
      this.getFormEL().getThisData().flowRequestParams.variableMap = Object.assign({}, this.getFormEL().getThisData().flowRequestParams.variableMap, { [flowVariable]: variableMap })
    },

    /**
     * 更新流程变量--通过表单
     * @param flowVariable  流程变量
     * @param formField 	表单字段
     * @param expression 	表达式
     */
    updateFlowVariableByCond(flowVariable, formField,formFieldN, expression) {
      let variableMap = ''
      if(typeof expression === 'undefined'){
        if(formField.indexOf('defaultData') != -1 || formField.indexOf('formData') != -1){
          if(formField.indexOf('formData') != -1){
            formField = formField.replace(/formData./g, '')
            variableMap = this.getFormEL().getThisData().formData[formField]
          }
          if(formField.indexOf('defaultData') != -1){
            formField = formField.replace(/defaultData./g, '')
            variableMap = this.getFormEL().getThisData().defaultData[formField]
          }
        }else{
          variableMap = formField
        }
      }else{
        if (expression.indexOf('formData') != -1 && expression.indexOf('defaultData') != -1) {
          expression = expression.replace(/formData/g, 'that.formData')
          expression = expression.replace(/defaultData/g, 'that.defaultData')
        } else if (expression.indexOf('defaultData') != -1) {
          expression = expression.replace(/defaultData/g, 'that.defaultData')
        } else if (expression.indexOf('formData') != -1) {
          expression = expression.replace(/formData/g, 'that.formData')
        }
        let that = this.getFormEL().getThisData()
        let this_ = this
        let conditional = eval(expression)
        if (conditional) {
          if(formField.indexOf('defaultData') != -1 || formField.indexOf('formData') != -1){
            if(formField.indexOf('formData') != -1){
              formField = formField.replace(/formData./g, '')
              variableMap = this.getFormEL().getThisData().formData[formField]
            }
            if(formField.indexOf('defaultData') != -1){
              formField = formField.replace(/defaultData./g, '')
              variableMap = this.getFormEL().getThisData().defaultData[formField]
            }
          }else{
            variableMap = formField
          }
        }else{
          if(formFieldN.indexOf('defaultData') != -1 || formFieldN.indexOf('formData') != -1){
            if(formFieldN.indexOf('formData') != -1){
              formFieldN = formFieldN.replace(/formData./g, '')
              variableMap = this.getFormEL().getThisData().formData[formFieldN]
            }
            if(formFieldN.indexOf('defaultData') != -1){
              formFieldN = formFieldN.replace(/defaultData./g, '')
              variableMap = this.getFormEL().getThisData().defaultData[formFieldN]
            }
          }else{
            variableMap = formFieldN
          }
        }
      }
      this.getFormEL().getThisData().flowRequestParams.variableMap = Object.assign({}, this.getFormEL().getThisData().flowRequestParams.variableMap, { [flowVariable]: variableMap })
    },
    /**
     * 更新业务状态
     * @param type 			更新类型
     * @param flowVariable  流程变量
     * @param formField 	表单字段
     * @param expression 	表达式
     */
    updateBusinessState(stateField, stateY, stateN, expression){
      if(typeof expression === 'undefined'){
        if(stateField.indexOf('formData') != -1) {
          stateField = stateField.replace(/formData./g, '')
          this.getFormEL().getThisData().formData[stateField] = stateY
          this.getFormEL().getThisData().saveFormData('')
        }
      }else{
        let that = this.getFormEL().getThisData()
        let this_ = this
        if (expression.indexOf('formData') != -1 && expression.indexOf('defaultData') != -1) {
          expression = expression.replace(/formData/g, 'that.formData')
          expression = expression.replace(/defaultData/g, 'that.defaultData')
        } else if (expression.indexOf('defaultData') != -1) {
          expression = expression.replace(/defaultData/g, 'that.defaultData')
        } else if (expression.indexOf('formData') != -1) {
          expression = expression.replace(/formData/g, 'that.formData')
        }
        let conditional = eval(expression)
        if (conditional) {
          if(stateField.indexOf('formData') != -1) {
            stateField = stateField.replace(/formData./g, '')
            this.getFormEL().getThisData().formData[stateField] = stateY
            this.getFormEL().getThisData().saveFormData('')
          }
        } else {
          if(stateField.indexOf('formData') != -1) {
            stateField = stateField.replace(/formData./g, '')
            this.getFormEL().getThisData().formData[stateField] = stateN
            this.getFormEL().getThisData().saveFormData('')
          }
        }
      }
    },
    /**
     * 更新流程参数
     * @param paramName   流程参数
     * @param paramValue   参数值
     */
    updateFlowParam(paramName, paramValue) {
      if (paramValue.indexOf('formData') != -1) {
        paramValue = paramValue.replace(/formData./g, '')
        this.getFormEL().getThisData().flowRequestParams[paramName] = this.getFormEL().getThisData().formData[paramValue]
      } else if(paramValue.indexOf('defaultData') != -1){
        paramValue = paramValue.replace(/defaultData./g, '')
        this.getFormEL().getThisData().flowRequestParams[paramName] = this.getFormEL().getThisData().defaultData[paramValue]
      } else {
        this.getFormEL().getThisData().flowRequestParams[paramName] = paramValue
      }
    },
    /**
     * 更新表单（支持多个字段）
     * @param {Object} params
     */
    updateFormFields(params) {
      let that = this.getFormEL().getThisData()
      let this_ = this
      for (const [key, value] of Object.entries(params)) {
        if (key in that.formData) {
          that.formData[key] = value
        }
      }
      this.getFormEL().getThisData().saveFormData('')
    },
    /**
     * 更新表单（单个字段）--直接传值
     * @param type 			更新类型
     * @param targetField  目标表单字段
     * @param value 	值
     * @param expression 	表达式f
     */
    updateFormElement(targetField, value, expression) {
      if(typeof expression === 'undefined'){ // 直接赋值
        if(targetField.indexOf('formData') != -1){
          targetField = targetField.replace(/formData./g, '')
          if(value.indexOf('formData') != -1){
            value = value.replace(/formData./g, '')
            this.getFormEL().getThisData().formData[targetField] = this.getFormEL().getThisData().formData[value]
          }else if(value.indexOf('defaultData') != -1){
            value = value.replace(/defaultData./g, '')
            this.getFormEL().getThisData().formData[targetField] = this.getFormEL().getThisData().defaultData[value]
          }else{
            this.getFormEL().getThisData().formData[targetField] = value
          }
        }
      }else{
        // 表达式赋值
        if (expression.indexOf('formData') != -1) {
          expression = expression.replace(/formData/g, 'that.formData')
        }
        let that = this.getFormEL().getThisData()
        let this_ = this
        let conditional = eval(expression)
        if (conditional) {
          if(targetField.indexOf('formData') != -1){
            targetField = targetField.replace(/formData./g, '')
            if(value.indexOf('formData') != -1){
              value = value.replace(/formData./g, '')
              this.getFormEL().getThisData().formData[targetField] = this.getFormEL().getThisData().formData[value]
            }else if(value.indexOf('defaultData') != -1){
              value = value.replace(/defaultData./g, '')
              this.getFormEL().getThisData().formData[targetField] = this.getFormEL().getThisData().defaultData[value]
            }else{
              this.getFormEL().getThisData().formData[targetField] = value
            }
          }
        }
      }
      this.getFormEL().getThisData().saveFormData('')
    },

    /**
     * 保存表单
     * @param typeY      expression为true时的保存类型
     * @param typeN      expression为false时的保存类型
     * @param expression  表达式
     * 说明
     * 1、如果表达式为空，则按照第一个参数进行保存
     */
    saveFormData(typeY, typeN, expression) {

      let type
      let that = this.getFormEL().getThisData()
      if (expression) {
        if (expression.indexOf('formData') != -1) {
          expression = expression.replace(/formData/g, 'that.formData')
        }
        let conditional = eval(expression)
        if (conditional) {
          type = typeY
        } else {
          type = typeN
        }
      } else {
        type = typeY
      }
      this.getFormEL().getThisData().saveFormData(type)
    },
    setFlowByTrans() {
      this.transFlag = true
    }
  }
}
</script>
<style lang="scss" scoped>
.ibps-container-frame {
  position: absolute;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
}
.ibps-container-url-frame {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: calc(100vh - 50px) !important;
  margin-top: 50px;
}
</style>
