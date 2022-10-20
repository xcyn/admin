import { doEndProcess, doAddSignTask, lock, unlock, suspendProcess, recoverProcess } from '@/api/platform/bpmn/bpmTask'
import { agree, agreeWithTrans, oppose, opposeWithTrans, abandon,abandonWithTrans, reject, rejectWithTrans, rejectToStarter, rejectToStarterWithTrans, rejectToPrevious, rejectToPreviousWithTrans, bpmTaskSave } from '@/api/platform/bpmn/bpmTask'
import { startFlow, saveDraft } from '@/api/platform/bpmn/bpmInst'
import Print from '@/utils/print'

export default {
  methods: {
    // 内嵌url表单,外部url表单 【自定义】
    emitButtonEventHandler(params, args) {
      let key = params.key
      if (key !== 'close') {
        this.buttonKey = key
        this.buttonName = params.attributes.name
      }
      if (params.attributes.beforeScript != null) {
        this.flowScriptsFlag = true
        this.doBeforeScript(params, (result) => {
          if (result) {
            return this.doMybeforeScript(key, args)
          }
        })
      } else {
        this.doMybeforeScript(key, args)
      }
    },
    doMybeforeScript(key, args) {
        // 前置事件
        this.beforeScript(key, (result) => {
          if (result) {
            return this.emitEventHandler(key, args)
          }
        })
    },
    emitEventHandler(actionName, args) {
      this.actionName = actionName
      const buttonType = args && args.attributes ? args.attributes.button_type || actionName : actionName
      this.actionTitle = args && args.attributes ? args.attributes.label : null
      this.submitFormOpinion = this.getFormOpinionData()
      switch (buttonType) {
        case 'close': // 关闭窗口
          this.closeDialog()
          break
        case 'flowImage':// 流程图
          this.flowDiagramVisible = true
          break
        case 'approvalHistory': // 审批历史
          this.approvalHistoryVisible = true
          break
        case 'instanceDetail': // 流程实例明细
          this.instanceDetailVisible = true
          break
        case 'startFlow': // 启动流程
          this.handleStartFlow()
          break
        case 'saveDraft': // 保存草稿
          this.handleSaveDraft()
          break
        case 'agree': // 同意
          // if (this.isHide()) {
          this.handleDirectActionEvent(actionName)
          // } else {
          //   this.agreeDialogVisible = true
          // }
          break
        case 'oppose':// 反对
        case 'abandon':// 弃权
          if (this.isHide()) {
            this.handleDirectActionEvent(actionName)
          } else {
            this.agreeDialogVisible = true
          }
          break
        case 'rejectToPrevious':// 驳回上一步
        case 'rejectToStart':// 驳回发起人
        case 'reject':// 驳回
          if (this.isBpmOpinionHide && actionName === 'rejectToPrevious') {
            this.handleDirectActionEvent(actionName)
          } else {
            this.rejectDialogVisible = true
          }
          break
        case 'delegate':// 转办
          this.delegateReadonly = false
          this.delegateDialogVisible = true
          break
        case 'delegateDetail':// 转办/代理明细
          this.delegateReadonly = true
          this.delegateDialogVisible = true
          break
        case 'addSign':// 补签
          this.addSignTaskDialogVisible = true
          break
        case 'endProcess':// 终止流程
          this.handleEndProcess()
          break
        case 'print':// 打印
          this.handlePrint()
          break
        case 'lock':// 锁定
          this.handleLock()
          break
        case 'unlock':// 解锁
          this.handleUnlock()
          break
        case 'forceUnlock':// 强制解锁
          this.handleForceUnlock()
          break
        case 'suspendProcess':// 挂起流程
          this.handleSuspendProcess()
          break
        case 'recoverProcess':// 撤回流程
          this.handleRecoverProcess()
          break
        case 'save':// 节点按钮设置-保存
          this.handleSave()
          break
        default:
          break
      }
    },
    /**
     * 是否隐藏
     */
    isHide() {
      return (this.isBpmOpinionHide && this.attributes.isHidePath) ||
      (this.attributes.isCommonJumpType && this.attributes.isHideOpinion && this.attributes.isHidePath) ||
      (this.attributes.isEnd && this.attributes.isHideOpinion)
    },
    /**
     * 是否保存[节点-按钮设置-保存]
     */
    handleSave() {
      const formData = this.getFormData()
      const loading = this.$loading({
        lock: true,
        text: this.$t('common.saving')
      })
      if (!formData) return
      bpmTaskSave({
        taskId: this.taskId,
        data: JSON.stringify(formData)
      }).then(response => {
        loading.close()
        this.$alert(`保存成功！`, {
          showClose: false
        }).then(() => {
        // 后置事件
          this.afterScript(this.actionName, {
            data: response.data,
            variables: response.variables
          }, () => {
            // 回调上个页面
            this.callbackPage()
          })
        }).catch(() => {
        })
      })
    },
    /**
     * 处理启动流程
     */
    handleStartFlow() {
      const firstNodeUserAssign = this.attributes.firstNodeUserAssign || false
      if (firstNodeUserAssign) {
        const formData = this.getFormData()
        if (!formData) return
        this.submitFormData = formData
        this.startFlowDialogVisible = true
      } else {
        this.saveStartFlow()
      }
    },
    /**
     * 保存启动流程
     * @param {*}
     */
    saveStartFlow(params = {}) {
      const formData = this.getFormData()
      if (!formData) return
      const jsonData = {
        defId: this.defId,
        version: this.version || '0',
        data: JSON.stringify(formData)
      }
      if (this.$utils.isNotEmpty(params.nodeUsers)) {
        jsonData.nodeUsers = JSON.stringify(params.nodeUsers) || ''
      }
      if (this.$utils.isNotEmpty(params.destination)) {
        jsonData.destination = params.destination || ''
      }

      if (this.$utils.isNotEmpty(this.proInstId) && !this.copyFlow) {
        jsonData.proInstId = this.proInstId || ''
      }

      const loading = this.$loading({
        lock: true,
        text: this.$t('common.saving')
      })
      // 1、直接启动
      startFlow(jsonData).then(response => {
        loading.close()
        this.$alert(`启动成功！`, {
          showClose: false
        }).then(() => {
          this.startFlowDialogVisible = false
          // 后置事件
          this.afterScript(this.actionName, {
            data: response.data,
            variables: response.variables
          }, () => {
            // 回调上个页面
            this.callbackPage()
          })
        }).catch(() => {})
      }).catch(() => {
        setTimeout(() => {
          loading.close()
        }, 100)
      })
    },
    /**
     * 保存草稿
     */
    handleSaveDraft() {
      // 表单数据
      const formData = this.getFormData()
      if (!formData) return

      const jsonData = {
        defId: this.defId,
        version: this.version || '',
        data: JSON.stringify(formData)
      }
      if (this.$utils.isNotEmpty(this.proInstId) && !this.copyFlow) {
        jsonData.proInstId = this.proInstId || ''
      }

      const loading = this.$loading({
        lock: true,
        text: this.$t('common.saving')
      })
      saveDraft(jsonData).then(response => {
        loading.close()
        this.$alert(`保存成功！`, {
          showClose: false
        }).then(() => {
        // 后置事件
          this.afterScript(this.actionName, {
            data: response.data,
            variables: response.variables
          }, () => {
            // 回调上个页面
            this.callbackPage()
          })
        }).catch(() => {
        })
      }).catch(() => {
        setTimeout(() => {
          loading.close()
        }, 100)
      })
    },
    /**
     * 直接同意流程
     * @param {*} actionName
     */
    handleDirectActionEvent(actionName) {
      const opinion = this.hasFormOpinion() ? this.getFormOpinionData() : ''
      const params = {
        opinion: opinion
      }

      if (this.formParams.directHandlerSign) {
        params.directHandlerSign = this.getDirectHandlerSign()
      }
      this.handleActionEvent(actionName, params)
    },
    /**
     * 处理按钮事件
     * @param {*} actionName
     * @param {*} params
     */
    handleActionEvent(actionName, params) {
      if (actionName === 'agree' ||
       actionName === 'oppose' ||
       actionName === 'abandon' ||
       actionName === 'rejectToPrevious' ||
       actionName === 'rejectToStart' ||
       actionName === 'reject'
      ) {
        this.handleComplete(actionName, params)
      } else if (actionName === 'endProcess') {
        this.handleDoEndProcess(params)
      } else if (actionName === 'addSign') {
        this.handleAddSignTask(params)
      }
    },
    handleComplete(actionName, params) {
      if (this.flowScriptsFlag) {
        let variableMap = this.getFlowVarData()
        if (variableMap !== '') {
          if (params != null) {
            params = Object.assign(params, variableMap)
          } else {
            params = variableMap
          }
        }
      }
      const formData = this.getFormData()
      if (!formData) return
      const loading = this.$loading({
        lock: true,
        text: this.$t('common.saving')
      })
      params.taskId = this.taskId
      params.data = JSON.stringify(formData)
      if(this.actionName === 'reject'){
        if(params.opinion != null && params.opinion != ''){

        }
      }else{
        let options = this.getFormOpinionData()
        if(options != null && options != ''){
          params.opinion = options
        }
      }
      let requestMethod = null
      // 如果transFlag为true，则请求头传入事务id，进行事务控制
      if (this.transFlag) {
        switch (actionName) {
          case 'agree':
            requestMethod = agreeWithTrans
            break
          case 'oppose':
            requestMethod = opposeWithTrans
            break
          case 'abandon':
            requestMethod = abandonWithTrans
            break
          case 'rejectToPrevious':
            requestMethod = rejectToPreviousWithTrans
            break
          case 'rejectToStart':
            requestMethod = rejectToStarterWithTrans
            break
          case 'reject':
            requestMethod = rejectWithTrans
            break
          default:
            break
        }
      } else {
        switch (actionName) {
          case 'agree':
            requestMethod = agree
            break
          case 'oppose':
            requestMethod = oppose
            break
          case 'abandon':
            requestMethod = abandon
            break
          case 'rejectToPrevious':
            requestMethod = rejectToPrevious
            break
          case 'rejectToStart':
            requestMethod = rejectToStarter
            break
          case 'reject':
            requestMethod = reject
            break
          default:
            break
        }
      }
      if (!requestMethod) {
        loading.close()
        return
      }
      // loading.close()
      requestMethod(params).then(response => {
        this.handleResponse(actionName, loading, response)
      }).catch(() => {
        setTimeout(() => {
          loading.close()
        }, 100)
      })
    },
    handleResponse(actionName, loading, response) {

      this.$alert(response.message, {
        showClose: false
      }).then(() => {
        // 后置事件
        this.doAfterScript()
        // 关闭窗口
        if (actionName === 'agree' || actionName === 'oppose' || actionName === 'abandon') {
          this.agreeDialogVisible = false
        } else if (actionName === 'rejectToPrevious' || actionName === 'rejectToStart' || actionName === 'reject') {
          this.rejectDialogVisible = false
        }

        this.afterScript(this.actionName, {
          data: response.data,
          variables: response.variables
        }, () => {
          // 回调上个页面
          loading.close()
          this.callbackPage()
        })
      }).catch(() => {
        // 回调上个页面
        loading.close()
        this.callbackPage()
      })
    },
    handleEndProcess() {
      if (this.isBpmOpinionHide) {
        this.$confirm('确定终止流程!', '提示', {
          type: 'warning'
        }).then(() => {
          const opinion = this.hasFormOpinion() ? this.getFormOpinionData() : ''
          this.handleDoEndProcess({
            opinion: opinion
          })
        }).catch(() => {})
      } else {
        this.approveDialogVisible = true
      }
    },
    /**
     * 处理终止任务
     * @param {*} params
     */
    handleDoEndProcess(params) {
      const loading = this.$loading({
        lock: true,
        text: this.$t('common.saving')
      })
      doEndProcess({
        taskId: this.taskId ? this.taskId : this.endProcessTaskId,
        endReason: params.opinion
      }).then(response => {
        loading.close()
        this.$alert(response.message, {
          showClose: false
        }).then(() => {
          this.approveDialogVisible = false
          this.doAfterScript()
          // 后置事件
          this.afterScript(this.actionName, {
            data: response.data,
            variables: response.variables
          }, () => {
            // 回调上个页面
            this.callbackPage()
          })
        })
      }).catch((err) => {
        setTimeout(() => {
          loading.close()
        }, 100)
        console.error(err)
      })
    },
    /**
     * 补签
     * @param {*} params
     */
    handleAddSignTask(params) {
      const loading = this.$loading({
        lock: true,
        text: this.$t('common.saving')
      })
      doAddSignTask({
        taskId: this.taskId,
        addSignTaskUserId: params.addSignTaskUserId,
        messageType: params.messageType,
        addReason: params.opinion
      }).then(response => {
        loading.close()
        this.$alert(response.message, {
          showClose: false
        }).then(() => {
          this.addSignTaskDialogVisible = false
          // 后置事件
          this.afterScript(this.actionName, {
            data: response.data,
            variables: response.variables
          }, () => {
            // 回调上个页面
            this.callbackPage()
          })
        })
      }).catch((err) => {
        console.error(err)
        setTimeout(() => {
          loading.close()
        }, 100)
      })
    },
    /**
     * 打印
     */
    handlePrint() {
      if (this.$utils.isNotEmpty(this.printTemplateId)) {
        this.submitFormData = this.getFormData()
        // 打开打印模版页面
        this.formPrintTemplateDialogVisible = true
      } else {
        const loading = this.$loading({
          lock: true,
          text: this.$t('common.loading')
        })
        setTimeout(() => {
          Print(this.$refs.formrender.$el, {
            title: '',
            callback: () => {
              loading.close()
            }
          })
        }, 300)
      }
    },
    /**
     * 锁定任务
     */
    handleLock() {
      this.$confirm('确定锁定任务!', '提示', {
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({
          lock: true,
          text: this.$t('common.saving')
        })
        lock({ taskId: this.taskId }).then(response => {
          loading.close()
          this.$alert(`锁定任务成功！`, {
            showClose: false
          }).then(() => {
            // 后置事件
            this.afterScript(this.actionName, {
              data: response.data,
              variables: response.variables
            }, () => {
              // 回调上个页面
              this.callbackPage()
            })
          }).catch(() => {})
        }).catch(() => {
          setTimeout(() => {
            loading.close()
          }, 100)
        })
      }).catch(() => {})
    },
    /**
     * 解锁任务
     */
    handleUnlock() {
      this.$confirm('确定解锁任务!', '提示', {
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({
          lock: true,
          text: this.$t('common.saving')
        })
        unlock({ taskId: this.taskId }).then(response => {
          loading.close()
          this.$alert(`解锁任务成功！`, {
            showClose: false
          }).then(() => {
            // 后置事件
            this.afterScript(this.actionName, {
              data: response.data,
              variables: response.variables
            }, () => {
              // 回调上个页面
              this.callbackPage()
            })
          }).catch(() => {})
        }).catch(() => {
          setTimeout(() => {
            loading.close()
          }, 100)
        })
      }).catch(() => {})
    },

    /**
     * 强制解锁任务
     */
    handleForceUnlock() {
      this.$confirm('确定强制解锁任务!', '提示', {
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({
          lock: true,
          text: this.$t('common.saving')
        })
        unlock({ taskId: this.taskId }).then(response => {
          loading.close()
          this.$alert(`强制解锁任务成功！`, {
            showClose: false
          }).then(() => {
            // 后置事件
            this.afterScript(this.actionName, {
              data: response.data,
              variables: response.variables
            }, () => {
              // 回调上个页面
              this.callbackPage()
            })
          }).catch(() => {})
        }).catch(() => {
          setTimeout(() => {
            loading.close()
          }, 100)
        })
      }).catch(() => {})
    },
    /**
     * 挂起任务
     */
    handleSuspendProcess() {
      this.$confirm('确定挂起任务', '提示', {
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({
          lock: true,
          text: this.$t('common.saving')
        })
        suspendProcess({ taskId: this.taskId }).then(response => {
          loading.close()
          this.$alert(`挂起任务成功！`, {
            showClose: false
          }).then(() => {
            // 后置事件
            this.afterScript(this.actionName, {
              data: response.data,
              variables: response.variables
            }, () => {
              // 回调上个页面
              this.callbackPage()
            })
          }).catch(() => {})
        }).catch(() => {
          setTimeout(() => {
            loading.close()
          }, 100)
        })
      }).catch(() => {})
    },
    /**
     * 恢复任务
     */
    handleRecoverProcess() {
      this.$confirm('确定恢复任务', '提示', {
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({
          lock: true,
          text: this.$t('common.saving')
        })
        recoverProcess({
          taskId: this.taskId
        }).then(response => {
          loading.close()
          this.$alert(`恢复任务成功！`, {
            showClose: false
          }).then(() => {
            // 后置事件
            this.afterScript(this.actionName, {
              data: response.data,
              variables: response.variables
            }, () => {
              // 回调上个页面
              this.callbackPage()
            })
          })
        }).catch(() => {
          setTimeout(() => {
            loading.close()
          }, 100)
        })
      }).catch(() => {

      })
    },
    finishTask(actionName, params, callback) {

    }
  }
}
