import * as commonHttp from '@/api/cpApi/common'
import { validateInteger } from '@/utils/validate'
import * as comnHttp from '@/api/cpApi/common'
import * as utils from '@/utils/cpUtils/index'

export default {
  data(){
    return {
      startButtons: [],
      startRequest: {}, // 流程请求对象
      defaultStartData:{
        useStartFlowParams: 'variable',
        exeId: '',
        exename: '',
        exetype: "employee",
        groupType: "",
        formKey: '',
        executors: [],
        destination: '',
        flowParam: {}
      },
      initForm: {
        disableData: [],
        readOnlyData: [],
        requireData: {}
      },
    }
  },
  methods: {
    getStartScript(flowKey) {
      return new Promise(async resolve =>{
        commonHttp.getStartScript({
          defKey: flowKey
        }).then(response => {
          if (response.data != null) {
            if(response.data.script !== null) {
              if (response.data.script.INITFORMSCRIPT) {
                let scriptData = eval('(' + response.data.script.INITFORMSCRIPT + ')')
                if (scriptData.disable_data) {
                  scriptData.disable_data.forEach((item, index) => {
                    this.initForm.disableData.push(item)
                  })
                }
                if(scriptData.show_data){
                  scriptData.show_data.forEach((item, index) => {
                    this.initForm.disableData = this.initForm.disableData.filter(t => t != item)
                  })
                }
                if(scriptData.edit_data){
                  scriptData.edit_data.forEach((item, index) => {
                    this.initForm.readOnlyData = this.initForm.readOnlyData.filter(t => t != item)
                  })
                }
                if(scriptData.readOnly_data){
                  scriptData.readOnly_data.forEach((item, index) => {
                    this.initForm.readOnlyData.push(item)
                  })
                }

                if (scriptData.require_data) {
                  let s = scriptData.require_data
                  let formRules = this.initForm.requireData
                  let requireData = {}
                  for (let [key, value] of Object.entries(s)) {
                    if (value.required) {
                      let keyData = []
                      for (let [key1, value1] of Object.entries(value)) {
                        if(key1 === 'required'){
                          keyData.push({ required: true, message: value.name ? value.name + '不能为空' : key1 + '不能为空', trigger: 'blur' })
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
                      requireData = Object.assign(requireData, { [key]: keyData })
                    } else {
                      requireData = Object.assign(requireData, { [key]: [] })
                    }
                  }
                  this.initForm.requireData = Object.assign(formRules, requireData)
                }
                if(scriptData.init_data) {
                  scriptData.init_data.forEach((item, index) => {
                    let that = this
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
              }
            }
            if(response.data.buttons !== null) {
              this.startButtons = response.data.buttons
            }
            resolve()
          }
        })
      })
    },
    // 流程总体链路
    startFlow(bizId, formKey, defKey) { // 启动
      return new Promise((resolve, reject) => {
        if (bizId == ''){
          this.$XModal.message({
            message: '无业务id',
            status: 'error'
          })
        }
        this.startRequest.defKey = defKey
        this.startRequest.formKey = formKey
        this.doStartFlowBeforeScript()
          .then(this.flowStart(bizId))
          .catch(reject)
      })
    },
    // 流程前置脚本
    doStartFlowBeforeScript(){
      return new Promise((resolve, reject) => {
        let that = this
        for (let i = 0; i < that.startButtons.length; i++) {
          let key = 'startFlow'
          if (that.startButtons[i].alias === key) {
            let scriptStr = that.startButtons[i].beforeScript
            if (scriptStr === '' || scriptStr === null) {
              resolve()
            }
            try {
              let doFunction = eval('(' + scriptStr + ')')
              doFunction()
              resolve()
            } catch (e) {
              reject(this.$t('ticket.message.flowBeforeScriptError') + e.cause)
            }
          }
        }
      })
    },
    // 启动流程
    flowStart(id) { // 流程开启
      return new Promise((resolve, reject) => {
        this.startRequest.ids = id
        if(this.defaultStartData.flowParam != null && this.defaultStartData.flowParam != ''){
          this.startRequest.flowParam = encodeURI(encodeURI(JSON.stringify(this.defaultStartData.flowParam)).replace(/&/g,'%26').replace(/\+/g,'%2B').replace(/\s/g,'%20').replace(/#/g,'%23'))
        }
        if(this.startRequest.destination != '' && this.defaultStartData.executors != null){
          var nodeObj = [{
            'nodeId': this.startRequest.destination,
            'executors': [] // 执行人信息
          }]
          nodeObj[0].executors = this.defaultStartData.executors
          this.startRequest.nodeUsers = JSON.stringify(nodeObj)
        }
        comnHttp.StartFlowExpand(this.startRequest).then((ret) => { // 启动流程
          if (ret.state === 200){
            this.$XModal.message({ message: ret.message, status: 'success' })
            this.doStartFlowAfterScript()
            this.closeEventByRouteName()
            resolve()
          }else {
            this.$XModal.message({message:  ret.message + ' - ' + ret.cause, status: 'error'})
          }
        }).catch(e => {
          this.$XModal.message({
            message: this.$t('defect.message.processStartedFailed'),
            status: 'error'
          })
          reject(this.$t('ticket.message.processStartupException') + "->" + e.cause)
        }).finally(() => {
          this.closeEventByRouteName
          this.loading = false
        })
      })
    },
    // 启动后置方法
    doStartFlowAfterScript(){
      return new Promise((resolve, reject) => {
        for (let i = 0; i < this.startButtons.length; i++) {
          let key = 'startFlow'
          if (this.startButtons[i].alias === key) {
            let scriptStr = this.startButtons[i].afterScript
            if (scriptStr === '' || scriptStr === null) {
              resolve()
            }
            let that = this
            try {
              let doFunction = eval('(' + scriptStr + ')')
              doFunction()
              resolve()
            } catch (e) {
              reject(this.$t('ticket.message.flowBeforeScriptError') + e.cause)
            }
          }
        }
      })
    },
    // 更新流程变量
    updateStartFlowByVariable(flowVariableY, formFieldY, flowVariableN, formFieldN, expression){
      let variableMap = ''
      let flowVariableParam = null
      if (typeof expression === 'undefined') {
        if (formFieldY.indexOf('defaultData') != -1 || formFieldY.indexOf('formData') != -1) {
          if (formFieldY.indexOf('formData') != -1) {
            formFieldY = formFieldY.replace(/formData./g, '')
            variableMap = this.formData[formFieldY]
          }
          if (formFieldY.indexOf('defaultData') != -1) {
            formFieldY = formFieldY.replace(/defaultData./g, '')
            variableMap = this.defaultData[formFieldY]
          }
        } else {
          variableMap = formFieldY
        }
        flowVariableParam = { [flowVariableY]: variableMap }
      } else {
        if (expression.indexOf('formData') != -1 && expression.indexOf('defaultData') != -1) {
          expression = expression.replace(/formData/g, 'that.formData')
          expression = expression.replace(/defaultData/g, 'that.defaultData')
        } else if (expression.indexOf('defaultData') != -1) {
          expression = expression.replace(/defaultData/g, 'that.defaultData')
        } else if (expression.indexOf('formData') != -1) {
          expression = expression.replace(/formData/g, 'that.formData')
        }
        let that = this
        let conditional = eval(expression)
        if (conditional) {
          if (formFieldY.indexOf('defaultData') != -1 || formFieldY.indexOf('formData') != -1) {
            if (formFieldY.indexOf('formData') != -1) {
              formFieldY = formFieldY.replace(/formData./g, '')
              variableMap = this.formData[formFieldY]
            }
            if (formFieldY.indexOf('defaultData') != -1) {
              formFieldY = formFieldY.replace(/defaultData./g, '')
              variableMap = this.defaultData[formFieldY]
            }
          } else {
            variableMap = formFieldY
          }
          flowVariableParam = { [flowVariableY]: variableMap }
        } else {
          if (formFieldN.indexOf('defaultData') != -1 || formFieldN.indexOf('formData') != -1) {
            if (formFieldN.indexOf('formData') != -1) {
              formFieldN = formFieldN.replace(/formData./g, '')
              variableMap = this.formData[formFieldN]
            }
            if (formFieldN.indexOf('defaultData') != -1) {
              formFieldN = formFieldN.replace(/defaultData./g, '')
              variableMap = this.defaultData[formFieldN]
            }
          } else {
            if(flowVariableN != "" && flowVariableN != null){
              variableMap = formFieldN
            }
          }
          if(flowVariableN != "" && flowVariableN != null){
            flowVariableParam = { [flowVariableN]: variableMap }
          }
        }
      }
      if(flowVariableParam != null){
        this.defaultStartData.flowParam = Object.assign(this.defaultStartData.flowParam, flowVariableParam)
        this.defaultStartData.useStartFlowParams = 'variable'
      }
    },
    // 更新流程变量
    updateStartFlowByVariableSubStr(flowVariableY, formFieldY,subRuleY, flowVariableN, formFieldN,subRuleN, expression){
      let variableMap = ''
      let flowVariableParam = null
      if (typeof expression === 'undefined') {
        if (formFieldY.indexOf('defaultData') != -1 || formFieldY.indexOf('formData') != -1) {
          if (formFieldY.indexOf('formData') != -1) {
            formFieldY = formFieldY.replace(/formData./g, '')
            variableMap = this.formData[formFieldY]
          }
          if (formFieldY.indexOf('defaultData') != -1) {
            formFieldY = formFieldY.replace(/defaultData./g, '')
            variableMap = this.defaultData[formFieldY]
          }
        } else {
          variableMap = formFieldY
        }
        if(subRuleY.indexOf('left') != -1){
          let N = subRuleY.split(":")[1]
          variableMap = variableMap.substr(0,N)
        }
        if(subRuleY.indexOf('right') != -1){
          let N = subRuleY.split(":")[1]
          variableMap = variableMap.substr(N,variableMap.length)
        }
        if(subRuleY.indexOf('index') != -1){
          let N = subRuleY.split(":")[1]
          let varArr = variableMap.split(",")
          if (varArr.length > N) {
            variableMap = variableMap.split(",")[N]
          } else {
            variableMap = variableMap.split(",")[varArr.length - 1]
          }
        }
        flowVariableParam = { [flowVariableY]: variableMap }
      } else {
        if (expression.indexOf('formData') != -1 && expression.indexOf('defaultData') != -1) {
          expression = expression.replace(/formData/g, 'that.formData')
          expression = expression.replace(/defaultData/g, 'that.defaultData')
        } else if (expression.indexOf('defaultData') != -1) {
          expression = expression.replace(/defaultData/g, 'that.defaultData')
        } else if (expression.indexOf('formData') != -1) {
          expression = expression.replace(/formData/g, 'that.formData')
        }
        let that = this
        let conditional = eval(expression)
        if (conditional) {
          if (formFieldY.indexOf('defaultData') != -1 || formFieldY.indexOf('formData') != -1) {
            if (formFieldY.indexOf('formData') != -1) {
              formFieldY = formFieldY.replace(/formData./g, '')
              variableMap = this.formData[formFieldY]
            }
            if (formFieldY.indexOf('defaultData') != -1) {
              formFieldY = formFieldY.replace(/defaultData./g, '')
              variableMap = this.defaultData[formFieldY]
            }
          } else {
            variableMap = formFieldY
          }
          if(subRuleY.indexOf('left') != -1){
            let N = subRuleY.split(":")[1]
            variableMap = variableMap.substr(0,N)
          }
          if(subRuleY.indexOf('right') != -1){
            let N = subRuleY.split(":")[1]
            variableMap = variableMap.substr(N,variableMap.length)
          }
          if(subRuleY.indexOf('index') != -1){
            let N = subRuleY.split(":")[1]
            variableMap = variableMap.split(",")[N]
          }
          flowVariableParam = { [flowVariableY]: variableMap }
        } else {
          if (formFieldN.indexOf('defaultData') != -1 || formFieldN.indexOf('formData') != -1) {
            if (formFieldN.indexOf('formData') != -1) {
              formFieldN = formFieldN.replace(/formData./g, '')
              variableMap = this.formData[formFieldN]
            }
            if (formFieldN.indexOf('defaultData') != -1) {
              formFieldN = formFieldN.replace(/defaultData./g, '')
              variableMap = this.defaultData[formFieldN]
            }
          } else {
            if(flowVariableN != "" && flowVariableN != null){
              variableMap = formFieldN
            }
          }
          if(flowVariableN != "" && flowVariableN != null){
            if(subRuleN.indexOf('left') != -1){
              let N = subRuleN.split(":")[1]
              variableMap = variableMap.substr(0,N)
            }
            if(subRuleN.indexOf('right') != -1){
              let N = subRuleN.split(":")[1]
              variableMap = variableMap.substr(N,variableMap.length)
            }
            if(subRuleN.indexOf('index') != -1){
              let N = subRuleN.split(":")[1]
              variableMap = variableMap.split(",")[N]
            }
            flowVariableParam = { [flowVariableN]: variableMap }
          }
        }
      }
      if(flowVariableParam != null){
        this.defaultStartData.flowParam = Object.assign(this.defaultStartData.flowParam, flowVariableParam)
        this.defaultStartData.useStartFlowParams = 'variable'
      }
    },

    // 更新流程变量
    updateStartFlowByNodeUsers(nodeId, formField,formFieldName, expression) {
      let variableMap = ''
      let variableName = ''
      if(typeof expression === 'undefined'){
        if(formField.indexOf('defaultData') != -1 || formField.indexOf('formData') != -1){
          if(formField.indexOf('formData') != -1){
            formField = formField.replace(/formData./g, '')
            variableMap = this.formData[formField]
          }
          if(formField.indexOf('defaultData') != -1){
            formField = formField.replace(/defaultData./g, '')
            variableMap = this.defaultData[formField]
          }
        }else{
          variableMap = formField
        }
        if(formFieldName.indexOf('defaultData') != -1 || formFieldName.indexOf('formData') != -1){
          if(formFieldName.indexOf('formData') != -1){
            formFieldName = formFieldName.replace(/formData./g, '')
            variableName = this.formData[formFieldName]
          }
          if(formFieldName.indexOf('defaultData') != -1){
            formFieldName = formFieldName.replace(/defaultData./g, '')
            variableName = this.defaultData[formFieldName]
          }
        }else{
          variableName = formFieldName
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
        let that = this
        let conditional = eval(expression)
        if (conditional) {
          if(formField.indexOf('defaultData') != -1 || formField.indexOf('formData') != -1){
            if(formField.indexOf('formData') != -1){
              formField = formField.replace(/formData./g, '')
              variableMap = this.formData[formField]
            }
            if(formField.indexOf('defaultData') != -1){
              formField = formField.replace(/defaultData./g, '')
              variableMap = this.defaultData[formField]
            }
          }else{
            variableMap = formField
          }

          if(formFieldName.indexOf('defaultData') != -1 || formFieldName.indexOf('formData') != -1){
            if(formFieldName.indexOf('formData') != -1){
              formFieldName = formFieldName.replace(/formData./g, '')
              variableName = this.formData[formFieldName]
            }
            if(formFieldName.indexOf('defaultData') != -1){
              formFieldName = formFieldName.replace(/defaultData./g, '')
              variableName = this.defaultData[formFieldName]
            }
          }else{
            variableName = formFieldName
          }
        }
      }
      this.defaultStartData.exeId = variableMap
      this.defaultStartData.exeName = variableName
      this.startRequest.destination = nodeId
      let executor = {
        id       : this.defaultStartData.exeId,
        type     : this.defaultStartData.exetype,
        name     : this.defaultStartData.exeName,
        groupType: this.defaultStartData.groupType
      }
      this.defaultStartData.executors.push(executor)
      this.defaultStartData.useStartFlowParams = 'nodeUsers'
    },

    /**
     * 更新流程参数
     * @param paramName   流程参数
     * @param paramValue   参数值
     */
    updateFlowParam(paramName, paramValue) {
      if (paramValue.indexOf('formData') != -1) {
        paramValue = paramValue.replace(/formData./g, '')
        this.startRequest[paramName] = this.formData[paramValue]
      } else if(paramValue.indexOf('defaultData') != -1){
        paramValue = paramValue.replace(/defaultData./g, '')
        this.startRequest[paramName] = this.defaultData[paramValue]
      } else {
        this.startRequest[paramName] = paramValue
      }
    },

    closeEventByRouteName() {
      utils.closeTab(this.$route.name)
    }
  }

}
