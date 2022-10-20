<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    title="复制数据模板"
    class="dialog"
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
      :label-width="formLabelWidth"
      @submit.native.prevent
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="原模板名称：" prop="origname">
            <el-input v-model="form.origname" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="模板名称：" prop="name">
            <el-input v-model="form.name" v-pinyin="{vm:form,key:'key'}" :clearable="true" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="原模板Key：" prop="origKey">
            <el-input v-model="form.origCode" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="模板Key：" prop="key">
            <el-input v-model="form.key" :clearable="true" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="el-dialog--center">
      <el-button type="primary" icon="ibps-icon-save" @click="handleSave()">保存</el-button>
      <el-button type="danger" icon="el-icon-circle-close" @click="closeDialog()">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { saveCopy } from '@/api/platform/data/dataTemplate'
import ActionUtils from '@/utils/action'
import { validateKey } from '@/utils/validate'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: String,
    copyData: Object
  },
  data() {
    return {
      formName: 'form',
      formLabelWidth: '130px',
      dialogVisible: this.visible,
      dialogLoading: false,
      form: {
        origname: '',
        name: '',
        origKey: '',
        key: '',
        boId: '加班申请单:V2'
      },
      rules: {
        name: [{ required: true, message: this.$t('validate.required') }],
        key: [{ required: true, validator: validateKey }]
      }
    }
  },
  computed: {
    formId() {
      return this.id
    }
  },
  watch: {
    visible: {
      handler: function(val) {
        this.dialogVisible = val
      },
      immediate: true
    }
  },
  methods: {
    // 保存数据
    handleSave() {
      this.$refs[this.formName].validate(valid => {
        if (valid) {
          this.saveData()
        } else {
          ActionUtils.saveErrorMessage()
        }
      })
    },
    // 提交保存数据
    saveData() {
      saveCopy({
        key: this.form.key,
        id: this.id,
        name: this.form.name
      }).then(response => {
        this.$emit('callback', this)
        this.closeDialog()
        ActionUtils.success('复制数据模版成功！')
      }).catch((err) => {
        console.error(err)
      })
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
      if (this.$refs[this.formName]) {
        this.$refs[this.formName].resetFields()
      }
    },
    /**
     * 表单验证
     */
    formValidate() {
      this.$nextTick(() => {
        this.$refs[this.formName].validate(() => {})
      })
    },
    /**
     * 获取表单数据
     */
    getFormData() {
      this.dialogLoading = false
      this.formValidate()
      this.form.origname = this.copyData.name || ''
      this.form.origCode = this.copyData.key || ''
    }
  }

}
</script>
