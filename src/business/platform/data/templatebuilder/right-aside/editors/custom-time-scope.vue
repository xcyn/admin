<template>
  <el-dialog
    title="时间范围设置"
    append-to-body
    top="6vh"
    width="50%"
    :visible.sync="dialogTableVisible"
    @open="getFormData"
  >
    <el-form ref="form" :label-position="labelPosition" label-width="80px" :rules="rules" :model="formLabelAlign" @submit.native.prevent>
      <el-form-item label="范围名称" prop="text">
        <el-input v-model="formLabelAlign.text" />
      </el-form-item>
      <el-form-item v-if="!hasInclude(formLabelAlign.value)" label="范围属性" prop="value">
        <el-input v-model="formLabelAlign.value" />
      </el-form-item>
      <el-form-item v-if="!hasInclude(formLabelAlign.value)" label="日期脚本" prop="script">
        <el-button type="text" @click="handleDefaultScript">插入默认脚本</el-button>
        <codemirror ref="timeScopeScript" v-model="formLabelAlign.script" :options="cmOption" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>
<script>
import ActionUtils from '@/utils/action'
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/eclipse.css'
import 'codemirror/mode/javascript/javascript.js'

export default {
  components: {
    codemirror
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    jobDataMap: Object,
    buttonKey: String,
    data: Array
  },
  data() {
    const _this = this
    return {
      defaultForm: {},
      dialogTableVisible: false,
      labelPosition: 'right',
      formLabelAlign: {
        text: '',
        value: '',
        script: ''
      },
      cmOption: {
        tabSize: 4,
        lineNumbers: true,
        line: true,
        autoCloseTags: true,
        mode: 'text/javascript',
        theme: 'eclipse',
        extraKeys: {
          'Ctrl-S': function(e) {
            _this.handleConfirm(false)
          }
        }
      },
      toolbars: [
        { key: 'confirm' },
        { key: 'cancel' }
      ],
      rules: {
        text: [{ required: true, message: this.$t('validate.required') }],
        value: [{ required: true, message: this.$t('validate.required') }],
        script: [{ required: true, message: this.$t('validate.required') }]
      }
    }
  },
  watch: {
    visible() {
      this.dialogTableVisible = this.visible
    },
    dialogTableVisible: {
      handler: function(val, oldVal) {
        this.$emit('update:visible', val)
      },
      immediate: true
    }
  },
  created() {
    this.defaultForm = JSON.parse(JSON.stringify(this.formLabelAlign))
  },
  methods: {
    handleDefaultScript() {
      const val =
`const end = new Date();
  const start = new Date();
  // 此处填写范围：示例 start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
  start.setTime();
  //[] 需要返回日期范围数据
  return []
`
      this.formLabelAlign.script = val
      this.getEditor().focus()
    },
    getEditor() {
      return this.$refs.timeScopeScript.cminstance
    },
    handleActionEvent({ key }) {
      switch (key) {
        case 'confirm':
          this.handleSave()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    handleSave() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.saveData()
        } else {
          ActionUtils.saveErrorMessage()
        }
      })
    },
    saveData() {
      if (this.buttonKey === 'add') {
        const index = this.data.findIndex(f => f.value === this.formLabelAlign.value)
        if (index > -1) {
          this.$message({
            message: '范围属性已存在！',
            type: 'warning'
          })
          return
        }
        this.$emit('callback', this.formLabelAlign)
        this.dialogTableVisible = false
      } else {
        this.$emit('callback', this.formLabelAlign)
        this.dialogTableVisible = false
      }
    },
    closeDialog() {
      this.dialogTableVisible = false
      this.$refs['form'].resetFields()
    },

    hasInclude(value) {
      const arr = ['recentlyOnceWeek', 'recentlyOnceMonth', 'recentlyThirdMonth']
      const boolean = arr.includes(value)
      return boolean
    },
    /**
     * 表单验证
     */
    formValidate() {
      if (this.readonly) return
      this.$nextTick(() => {
        this.$refs['form'].validate(() => {})
      })
    },
    /**
     * 获取表单数据
     */
    getFormData() {
      if (this.$utils.isEmpty(this.jobDataMap)) {
        // 重置表单
        this.formLabelAlign = JSON.parse(JSON.stringify(this.defaultForm))
        this.formValidate()
        return
      }
      this.formLabelAlign = JSON.parse(JSON.stringify(this.jobDataMap))
    }
  }
}
</script>
