<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="actionTitle"
    :class="className"
    class="bpmn-agree-dialog"
    append-to-body
    top="5vh"
    width="60%"
    @close="closeDialog"
    @open="openDialog"
  >
    <el-form
      ref="form"
      v-loading.fullscreen.lock="dialogLoading"
      :element-loading-text="$t('common.loading')"
      :model="form"
      :rules="rules"
      label-width="120px"
      @submit.native.prevent
    >
      <!--不隐藏路径，审批意见-->
      <template v-if="noCommonJumpType">
        <el-form-item v-if="jumpTypeLength >1" label="跳转方式:">
          <el-radio-group v-model="form.jumpType">
            <el-radio v-if="variables.jumpType.includes('common')" label="common">正常跳转</el-radio>
            <el-radio v-if="variables.jumpType.includes('select')" label="select">选择路径跳转</el-radio>
            <el-radio v-if="variables.jumpType.includes('free')" label="free">自由跳转</el-radio>
          </el-radio-group>
        </el-form-item>
        <!--正常跳转-->
        <template v-if="form.jumpType ==='common'">
          <jump-type-common
            v-if="variables.pathOutgoingNodes && variables.pathOutgoingNodes.length > 0"
            ref="jumpTypeNode"
            :jump-type="form.jumpType"
            :outgoing-nodes="variables.pathOutgoingNodes "
            :outgoing-nodes-users-map.sync="variables.pathOutgoingNodesUsersMap"
          />
        </template>
        <!--选择路径跳转-->
        <template v-else-if="form.jumpType ==='select'">
          <jump-type-select
            ref="jumpTypeNode"
            :jump-type="form.jumpType"
            :outgoing-nodes="variables.outgoingNodes"
            :outgoing-nodes-users-map.sync="variables.outgoingNodesUsersMap"
          />
        </template>
        <!--自由跳转-->
        <template v-else-if="form.jumpType ==='free'">
          <jump-type-select
            ref="jumpTypeNode"
            :jump-type="form.jumpType"
            :outgoing-nodes="variables.allNodeDef "
            :outgoing-nodes-users-map.sync="variables.allNodeDefUsersMap"
          />
        </template>
      </template>
      <el-form-item v-if="!hideOpinion" label="审批意见:" prop="opinion">
        <approval-opinion
          v-model="form.opinion"
          :action="action"
        />
      </el-form-item>

    </el-form>
    <template slot="footer">
      <el-row type="flex">
        <el-col :span="10" class="ibps-tl">
          <el-checkbox v-if="hasDirectHandlerSign" v-model="directHandlerSign">
            <el-tooltip content="您拥有会签特权，可以对会签任务进行直接处理" placement="bottom">
              <div> 特权：直接处理</div>
            </el-tooltip>
          </el-checkbox>
        </el-col>
        <el-col :span="12" class="ibps-tl">
          <el-button type="primary" icon="ibps-icon-save" @click="handleSave()">{{ actionTitle }}</el-button>
          <el-button icon="el-icon-circle-close" @click="closeDialog()">取 消</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>
<script>
import ApprovalOpinion from '@/business/platform/bpmn/components/approval-opinion'

import { agreeData } from '@/api/platform/bpmn/bpmTask'
import { queryIncludeNull } from '@/api/platform/bpmn/bpmCommonStatment'
import ActionUtils from '@/utils/action'

import JumpTypeCommon from './jump-type/common'
import JumpTypeSelect from './jump-type/select'
export default {
  components: {
    ApprovalOpinion,
    JumpTypeCommon,
    JumpTypeSelect
  },
  props: {
    className: String,
    visible: Boolean,
    action: String,
    title: String,
    taskId: String,
    data: [String, Object],
    isCommon: {
      type: Boolean,
      default: true
    },
    hideOpinion: { // 隐藏意见
      type: Boolean,
      default: false
    },
    hidePath: { // 隐藏路径
      type: Boolean,
      default: true
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
      form: {
        jumpType: 'common',
        opinion: ''
      },
      rules: {},
      variables: {},
      directHandlerSign: false
    }
  },
  computed: {
    actionTitle() {
      if (this.title) {
        return this.title
      }
      if (this.action === 'agree') {
        return '同意'
      } else if (this.action === 'oppose') {
        return '反对'
      } else if (this.action === 'abandon') {
        return '弃权'
      } else {
        return '审批'
      }
    },
    jumpTypeLength() {
      if (this.$utils.isEmpty(this.variables) || this.$utils.isEmpty(this.variables.jumpType)) {
        return 0
      }
      const jumpTypeAry = this.variables.jumpType.split(',')
      return jumpTypeAry.length
    },
    noCommonJumpType() {
      return (!this.isCommon || (this.isCommon && !this.hidePath)) && (this.action === 'agree' || this.action === 'abandon' || this.action === 'oppose')
    },
    hasDirectHandlerSign() {
      if (this.$utils.isEmpty(this.variables) || this.$utils.isEmpty(this.variables.directHandlerSign)) return false
      return this.variables.directHandlerSign
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
      },
      immediate: true
    }
  },
  beforeDestroy() {
    this.form = null
    this.rules = null
    this.variables = null
  },
  methods: {
    closeDialog() {
      this.form.opinion = ''
      this.$emit('close', false)
    },
    openDialog() {
      // if (this.noCommonJumpType) {
      this.dialogLoading = true
      agreeData({
        taskId: this.taskId,
        busData: JSON.stringify(this.data),
        actionName: this.action
      }).then(response => {
        this.dialogLoading = false
        this.variables = response.variables || {}
        // 您拥有会签特权，可以对会签任务进行直接处理
        this.directHandlerSign = false
        if (this.noCommonJumpType) {
          const a = Object.prototype.toString
          if (this.$utils.isNotEmpty(this.variables.outgoingNodesUsersMap) && a.call(this.variables.outgoingNodesUsersMap) === '[object String]') {
            this.variables.outgoingNodesUsersMap = JSON.parse(this.variables.outgoingNodesUsersMap)
          }
          if (this.$utils.isNotEmpty(this.variables.allNodeDefUsersMap) && a.call(this.variables.allNodeDefUsersMap) === '[object String]') {
            this.variables.allNodeDefUsersMap = JSON.parse(this.variables.allNodeDefUsersMap)
          }
          if (this.$utils.isNotEmpty(this.variables.pathOutgoingNodesUsersMap) && a.call(this.variables.pathOutgoingNodesUsersMap) === '[object String]') {
            this.variables.pathOutgoingNodesUsersMap = JSON.parse(this.variables.pathOutgoingNodesUsersMap)
          }
          const jumpTypeAry = this.variables.jumpType.split(',')
          if (jumpTypeAry && jumpTypeAry.length > 0) {
            this.form.jumpType = jumpTypeAry[0]
          }
        }
      }).catch(() => {
        this.dialogLoading = false
      })
      // }
      if (this.$utils.isNotEmpty(this.formOpinion)) {
        this.form.opinion = this.formOpinion
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

    handleSave() {
      const params = {}
      if (this.noCommonJumpType) {
        const jumpTypeNode = this.$refs.jumpTypeNode
        if (this.$utils.isNotEmpty(jumpTypeNode)) {
          const data = jumpTypeNode.getData()
          params.jumpType = this.form.jumpType
          params.destination = data.destination
          params.nodeUsers = data.nodeUsers
        }
      }
      if (!this.hideOpinion) {
        params.opinion = this.form.opinion
      }
      if (this.hasDirectHandlerSign) {
        params.directHandlerSign = this.directHandlerSign
      }

      this.$emit('action-event', this.action, params)
    }
  }
}
</script>
