<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    class="dialog"
    top="6vh"
    @open="getFormData"
    @close="closeDialog"
  >
    <el-form
      ref="form"
      v-loading="dialogLoading"
      :element-loading-text="$t('common.loading')"
      :model="form"
      :label-width="formLabelWidth"
      @submit.native.prevent
    >
      <el-form-item label="流程定义:">
        <span>{{ form.procDefName }}</span>
      </el-form-item>
      <el-form-item label="节点:">
        <span>{{ form.nodeName }}</span>
      </el-form-item>
      <el-form-item label="通知标题:">
        <span>{{ form.notifyTitle }}</span>
      </el-form-item>
      <el-form-item label="通知类型:">
        <el-tag :type="form.notifyType|optionsFilter(notifyOptions,'type')">{{ form.notifyType|optionsFilter(notifyOptions,'label') }}</el-tag>
      </el-form-item>
      <el-form-item label="通知人:">
        <span>{{ form.notifierName }}</span>
      </el-form-item>
      <el-form-item label="通知时间:">
        <span>{{ form.createTime }}</span>
      </el-form-item>
      <el-form-item label="通知内容:">
        <span>{{ form.notifyContent }}</span>
      </el-form-item>
    </el-form>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :identity="identity"
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>

<script>
import { get } from '@/api/platform/bpmn/bpmOperNotify'
const notifyOptions = [
  {
    value: 'cc',
    label: '抄送'
  }
]
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    identity: String,
    id: String,
    title: {
      type: String,
      default: '抄送通知'
    }
  },
  data() {
    return {
      notifyOptions: notifyOptions,
      formLabelWidth: '120px',
      dialogVisible: this.visible,
      dialogLoading: false,
      form: {},
      toolbars: [
        { key: 'cancel' }
      ]
    }
  },
  computed: {
    formId() {
      return this.id
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
  methods: {
    handleActionEvent({ key }) {
      switch (key) {
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    /**
     * 获取表单数据
     */
    getFormData() {
      this.dialogLoading = true
      get({
        id: this.formId,
        show: true
      }).then(response => {
        this.form = response.data
        this.dialogLoading = false
      }).catch(() => {
        this.dialogLoading = false
      })
    }
  }

}
</script>
