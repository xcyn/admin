<template>
  <el-dialog
    title="Pure关联数据"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="ibps-generate-form"
    fullscreen
    destroy-on-close
    @open="getFormData"
    @close="closeDialog"
  >
    <ibps-container type="full" class="generate-form page">
      <div class="dynamic-form-container" style="padding:0;">
        <div class="dynamic-form" style="">
          <!--顶部按钮 请根据实际添加-->

          <!--表头-->
          <div class="form-header">
            <div
              class="title"
              style="font-family: inherit;font-weight: bold;text-align: left;"
            >Pure关联数据</div>
            <el-form
              ref="form"
              :model="models"

              :inline="inline"
              :label-suffix="labelSuffix"
              :label-width="labelWidth"
              :label-position="labelPosition"
              :status-icon="statusIcon"
              :size="size"
              :hide-required-asterisk="hideRequiredAsterisk"
              style="padding: 20px;"
              @submit.native.prevent
            >

              <el-form-item
                label="参数一"

                prop="shuJuYi"
              >

                <template slot="label">
                  <span style="font-family: inherit;font-weight: normal;">参数一</span>

                </template><el-input
                  v-model="models.shuJuYi"
                  placeholder="请输入"
                  type="text"
                  name="shuJuYi"
                  :autosize="autosize"
                  :rows="3"
                  :readonly="readonly"
                  clearable
                  :style="{width:width}"
                />
              </el-form-item>

              <el-form-item
                label="关联数据"

                prop="guanLianShuJu"
              >

                <template slot="label">
                  <span style="font-family: inherit;font-weight: normal;">关联数据</span>

                </template>
                <ibps-link-data
                  v-model="models.guanLianShuJu"
                  template-key="Puregl"
                  placeholder="请选择"
                  :multiple="false"
                  structure="list"
                  value-key="id_"
                  label-type="first"
                  label-key="dan_xing_wen_ben_"
                  :disabled="readonly"
                  :readonly="readonly"
                  :readonly-text="readonlyText?'text':'original'"
                  :style="{width:width}"
                />

              </el-form-item>

              <el-form-item
                label="接收数据"

                prop="jieShuShuJu"
              >

                <template slot="label">
                  <span style="font-family: inherit;font-weight: normal;">接收数据</span>

                </template><el-input
                  v-model="models.jieShuShuJu"
                  placeholder="请输入"
                  type="text"
                  name="jieShuShuJu"
                  :autosize="autosize"
                  :rows="3"
                  :readonly="readonly"
                  clearable
                  :style="{width:width}"
                />
              </el-form-item>

              <el-form-item
                label="数据二"

                prop="shuJuEr"
              >

                <template slot="label">
                  <span style="font-family: inherit;font-weight: normal;">数据二</span>

                </template><el-input
                  v-model="models.shuJuEr"
                  placeholder="请输入"
                  type="text"
                  name="shuJuEr"
                  :autosize="autosize"
                  :rows="3"
                  :readonly="readonly"
                  clearable
                  :style="{width:width}"
                />
              </el-form-item>

              <el-form-item class="ibps-tc">
                <ibps-toolbar
                  ref="toolbar"
                  :actions="actions"
                  @action-event="handleButtonEvent"
                />
              </el-form-item>

            </el-form>
          </div>
        </div>
      </div>
    </ibps-container>

  </el-dialog>
</template>
<script>

import IbpsLinkData from '@/business/platform/data/templaterender/link-data'
export default {

  components: {
    'ibps-link-data': IbpsLinkData
  },

  props: {
    visible: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {

      dialogVisible: false,
      dynamicForm: this,
      models: { 'id': '', 'shuJuYi': '', 'guanLianShuJu': '', 'jieShuShuJu': '', 'shuJuEr': '' },
      inline: false,
      labelSuffix: '',
      labelWidth: '100px',
      labelPosition: 'right',
      statusIcon: false,
      size: '',
      hideRequiredAsterisk: false,

      readonly: false,
      readonlyText: true,
      multiple: false,
      autosize: '',
      width: '',
      actions: [
        {
          key: 'submit',
          label: '提交',
          type: 'primary'
        },
        {
          key: 'reset',
          label: '重置'
        }
      ],

      rules: {}

    }
  },

  watch: {

    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
      },
      immediate: true
    },
    models: {
      handler(val) {
        // 延迟验证
        this.$nextTick(() => {
          setTimeout(() => {
            this.$refs.form.validate(() => {})
          }, 10)
        })
      },
      deep: true
    }
  },

  methods: {

    // 关闭当前窗口
    closeDialog() {
      this.dialogVisible = false
      this.$emit('close', false)
    },
    getFormData() {
      console.info('弹窗打开触发的事件')
    },
    handleSave() {
      console.info(this.models)
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    handleButtonEvent(button, data) {
      console.info(button, data)
      switch (button.key) {
        case 'submit':
          this.submitForm('form')
          break
        case 'reset':
          this.resetForm('form')
          break
        default:
          break
      }
    }

  }
}
</script>
<style lang="scss">
@import "@/assets/styles/components/form-generation";

.ibps-generate-form{
  .el-dialog__body{
    height:  100%;
    position: relative;
  }
}
.generate-form{
  .ibps-container-full__body{
    padding: 0!important;
  }
  .dynamic-form {
    .el-input{
      width: 100%;
    }
    .el-select{
      width: 100%;
    }

    .el-collapse-item__header.is-active{
      border-bottom: 1px solid #EBEEF5;
      margin-bottom: 5px;
    }
    .form-header {
      border-bottom: 1px solid #2b34410d;
      margin-bottom: 5px;
      .title {
        font-size: 16px;
        font-weight: bold;
        color: #222;
        text-align: left;
        padding: 8px 10px 10px;
        margin: 0;
      }
      .desc {
        word-wrap: break-word;
        word-break: normal;
        text-indent: 0;
        line-height: 1.6;
        margin: 0 0 11px;
        padding: 3px 30px 8px;
      }
    }
    .dynamic-form-table-item__readonly{
      margin-bottom: 0;
    }

  //===================border-form====================
    .ibps-border-form {
      border: 1px solid #cfd7e5;

      .el-form-item{
        border-top: 1px solid #cfd7e5;
      }

      .el-form-item__content:before {
        width: 1px;
        background: #cfd7e5;
        display: block;
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        bottom:-20px;
      }

      .el-form-item__content .el-form-item__error {
        left: 5px
      }

      .el-form--label-top .el-form-item__content:before,
      .no-label-form-item .el-form-item__content:before {
        background: transparent
      }

      .el-row+.el-row {
        border-top: 1px solid #cfd7e5
      }

      .el-col+.el-col {
        border-left: 1px solid #cfd7e5
      }

      .el-col {
        overflow: hidden
      }

      .el-form-item__content {
        padding: 5px;
        padding-bottom: 0
      }

      .el-form-item__label {
        padding: 5px
      }

      .el-table{
        .el-form-item{
            border-top: 0;
        }
        .el-form-item__content:before {
          width: 0;
        }
        .el-form-item__content {
          padding: 0;
        }

      }

    }
    .machine_direction{
      display: flex;
      flex-direction: column;
    }
    .edui-editor{
      z-index: 1000!important;
    }

  }

}
</style>
