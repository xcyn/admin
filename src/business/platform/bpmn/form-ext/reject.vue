<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="actionTitle"
    :class="className"
    class="bpmn-reject-dialog"
    append-to-body
    top="5vh"
    width="60%"
    @open="getFormData"
    @close="closeDialog"
  >
    <el-form
      ref="form"
      v-loading="dialogLoading"
      :element-loading-text="$t('common.loading')"
      :model="form"
      :rules="rules"
      label-width="120px"
      @submit.native.prevent
    >
<!--      <el-form-item v-if="actionName === 'reject' " label="驳回方式:" prop="rejectMode">-->
<!--        <el-radio-group v-model="form.rejectMode" @change="changeBackHandMode">-->
<!--          <el-radio label="reject">返回上一步</el-radio>-->
<!--          <el-radio label="rejectDest">驳回指定节点</el-radio>-->
<!--        </el-radio-group>-->
<!--      </el-form-item>-->
<!--      <el-form-item-->
<!--        v-if="actionName === 'reject' || actionName === 'rejectToStart' "-->
<!--        label="返回方式:"-->
<!--        prop="backHandMode"-->
<!--      >-->
<!--        <el-radio-group v-model="form.backHandMode" @change="changeBackHandMode">-->
<!--          <el-radio label="direct">回到本节点</el-radio>-->
<!--          <el-radio label="normal">按流程图执行</el-radio>-->
<!--        </el-radio-group>-->

<!--      </el-form-item>-->
<!--      <el-form-item-->
<!--        v-if="actionName === 'reject' && form.rejectMode==='rejectDest'"-->
<!--        prop="destination"-->
<!--      >-->
<!--        <span slot="label" v-html="'驳回到节点<br>('+(form.backHandMode==='direct'?'直来直往':'按流程图')+'):'" />-->
<!--        <el-select v-model="form.destination" placeholder="请选择" style="margin-top: 20px;">-->
<!--          <el-option v-for="item in userNodeList " :key="item.nodeId" :value="item.nodeId" :label="item.name" />-->
<!--        </el-select>-->
<!--      </el-form-item>-->
      <el-form-item v-if="!hideOpinion" label="审批意见:" prop="opinion">
        <approval-opinion
          v-model="form.opinion"
          :action="action"
        />
      </el-form-item>

    </el-form>
    <div slot="footer" class="el-dialog--center">
      <el-button type="primary" icon="ibps-icon-save" @click="handleSave()">{{ actionTitle }}</el-button>
      <el-button icon="el-icon-circle-close" @click="closeDialog()">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { toReject, toRejectToPrevious, toRejectToStart } from '@/api/platform/bpmn/bpmTask'
import ApprovalOpinion from '@/business/platform/bpmn/components/approval-opinion'
import { queryIncludeNull } from '@/api/platform/bpmn/bpmCommonStatment'
import ActionUtils from '@/utils/action'

export default {
  components: {
    ApprovalOpinion
  },
  props: {
    className: String,
    visible: Boolean,
    action: String,
    title: String,
    taskId: String,
    data: [String, Object],
    hideOpinion: { // 隐藏意见
      type: Boolean,
      default: false
    },
    formOpinion: { // 表单意见
      type: String
    }
  },
  data() {
    return {
      dialogVisible: this.visible,
      dialogLoading: false,
      formName: 'form',
      formLabelWidth: '130px',
      actionName: '',
      userNodeList: [],
      bpmExecUserNode: [],
      bpmExecGoMapUserNode: [],
      form: {
        rejectMode: 'reject',
        backHandMode: 'normal',
        destination: '',
        opinion: '不同意'
      },
      rules: {
        destination: [{ required: true, message: 'destination为空' }],
        opinion: [{ required: true, message: 'opinion为空' }]
      }
    }
  },
  computed: {
    actionTitle() {
      if (this.title) {
        return this.title
      }
      if (this.actionName === 'rejectToPrevious') {
        return '驳回上一步'
      } else if (this.actionName === 'rejectToStart') {
        return '驳回发起人'
      } else if (this.actionName === 'reject') {
        return '驳回审批'
      } else {
        return '驳回'
      }
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
        this.actionName = this.action
      },
      immediate: true
    }
  },
  beforeDestroy() {
    this.userNodeList = null
    this.bpmExecUserNode = null
    this.bpmExecGoMapUserNode = null
    this.form = null
    this.rules = null
  },
  methods: {
    openedDialog() {
      if (this.$utils.isNotEmpty(this.formOpinion)) {
        if (this.formOpinion == '同意') {
          this.form.opinion = '不同意'
        } else {
          this.form.opinion = this.formOpinion
        }
      } else {
        queryIncludeNull(ActionUtils.formatParams(
          {
            'Q^ACTION_^S': this.action,
            'Q^CREATE_BY_^S': this.$store.getters.userId
          })).then(response => {
          const data = response.variables && response.variables.def ? response.variables.def.value || '' : ''
          if (this.$utils.isNotEmpty(data)) {
            this.form.opinion = data
          }
        })
      }
    },
    changeBackHandMode() {
      if (this.actionName === 'reject' && this.form.rejectMode === 'rejectDest') {
        this.formValidate()
        this.userNodeList = this.form.backHandMode === 'normal' ? this.bpmExecGoMapUserNode : this.bpmExecUserNode
      }
    },
    closeDialog() {
      // this.form.opinion = ''
      this.$emit('close', false)
    },
    handleSave() {
      this.$refs[this.formName].validate(valid => {
        if (valid) {
          console.log(this.form)
          this.$emit('action-event', this.action, this.form)
        } else {
          ActionUtils.saveErrorMessage()
        }
      })
    },
    /**
     * 表单验证
     */
    formValidate() {
      this.$nextTick(() => {
        this.$refs[this.formName].validate(() => {})
      })
    },
    getFormData() {
      this.openedDialog()
      this.$nextTick(() => {
        this.$refs[this.formName].resetFields()
      })
      this.dialogLoading = false
      // switch (this.actionName) {
      //   case 'reject': // 驳回
      //     toReject({
      //       taskId: this.taskId
      //     }).then(response => {
      //       this.formValidate()
      //       this.dialogLoading = false
      //       const data = response.data
      //       this.userNodeList = this.bpmExecUserNode = data.bpmExecUserNode
      //       this.bpmExecGoMapUserNode = data.bpmExecGoMapUserNode
      //     }).catch(() => {
      //       this.dialogLoading = false
      //     })
      //     break
      //   case 'rejectToPrevious': // 驳回上一步
      //     toRejectToPrevious({
      //       taskId: this.taskId
      //     }).then(response => {
      //       this.formValidate()
      //       this.dialogLoading = false
      //       // TODO:默认意见
      //     }).catch(() => {
      //       this.dialogLoading = false
      //     })
      //     break
      //   case 'rejectToStart':
      //     toRejectToStart({
      //       taskId: this.taskId
      //     }).then(response => {
      //       this.formValidate()
      //       this.dialogLoading = false
      //       // TODO:默认意见
      //     }).catch(() => {
      //       this.dialogLoading = false
      //     })
      //     break
      //   default:
      //     break
      // }
    }
  }
}
</script>
