<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="title"
    class="ibps-code-dialog"
    top="5vh"
    width="50%"
    append-to-body
    @close="closeDialog"
    @open="getFormData"
  >
    <el-tabs type="border-card">
      <el-tab-pane label="Vue">
        <codemirror ref="vueScript" v-model="vueScript" :options="cmOption" />
      </el-tab-pane>
    </el-tabs>
    <div class="code-generate-foot">
      <ul>
        <li>实现方式：通过获取配置的模板数据当成参数传入组件内，从而使生成的代码调用组件时，使用传入的模板配置，而不是重新请求获取模板数据。</li>
        <li>代码改动：模板类型为对话框或值来源时，初始为隐藏的弹窗，需要根据业务需求传入visible属性判断弹窗是否显示。</li>
        <li>生成功能：生成的代码包含的功能与[预览]功能的效果基本一致，都包含配置的功能，如：编辑页、明细页、列表、删除等。</li>
        <li style="color: red;">注意：生成代码后，不能删除当前数据模板、相关的表单以及业务对象，否则生成后的代码无法进行数据的请求。</li>
      </ul>
    </div>

    <div slot="footer" class="el-dialog--center cobyOrderSn">
      <el-button class="copyBtn" icon="ibps-icon-copy" type="primary" data-clipboard-action="copy" :data-clipboard-text="getCode" @click="copy">复制代码</el-button>
      <el-button type="primary" icon="ibps-icon-export" @click="exportCode">导出代码</el-button>
      <el-button icon="ibps-icon-close" @click="closeDialog">关闭</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/eclipse.css'
import 'codemirror/mode/javascript/javascript.js'
import ActionUtils from '@/utils/action'
import ClipboardJS from 'clipboard'
import { generateDataModuleCode } from '@/business/platform/form/formbuilder/utils/generateDynamicCode'

export default {
  components: {
    codemirror
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '生成代码'
    },
    data: {
      type: Object
    },
    fileKey: String
  },
  data() {
    const _this = this
    return {
      dialogVisible: false,
      vueScript: '',
      dynamicScript: '',
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
      }
    }
  },
  computed: {
    getCode() {
      return this.vueScript
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
      },
      immediate: true
    },
    data: {
      handler: function(val, oldVal) {
        this.vueScript = generateDataModuleCode(this.data)
      },
      immediate: true
    }
  },
  methods: {
    exportCode() {
      ActionUtils.exportFile(this.vueScript, this.fileKey + '.vue')
    },
    copy() {
      const _this = this
      const clipboard = new ClipboardJS('.copyBtn')
      clipboard.on('success', function() {
        _this.$message({
          message: '复制成功',
          type: 'success'
        })
        clipboard.destroy()
      })
      clipboard.on('error', function() {
        _this.$message({
          message: '复制失败',
          type: 'error'
        })
        clipboard.destroy()
      })
    },
    getFormData() {
      const vueScript = generateDataModuleCode(this.data)
      this.$nextTick(() => {
        this.vueScript = vueScript || ''
      })
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    }
  }
}
</script>
<style lang="scss" >

.ibps-code-dialog{
  .el-dialog__footer{
    border-top: 0;
  }
  .el-dialog__body{
    padding-top:10px ;
  }
  .CodeMirror{
    height: 460px ;
  }

  .form-script-head-title{
    border: 1px solid #e0e0e0;
    .el-form-item__label{
      background: #f3f8fb;
      padding: 0 10px;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      font-size: 14px;
      width: 100%;
    }
  }

  .form-script-info-name {
    font-size: 12px;
    color: #91A1B7;
    line-height: 18px;
    margin-bottom: 5px;
  }
  .form-script-info-main{
    height: 300px;
    border: 1px solid #e0e0e0;
    padding: 0 5px;
  }

  .function-tree-node{
    width: 100%;
  }

  .form-script-intro{
    .form-script-title {
      height: 38px;
      line-height: 38px;
      border-bottom: solid 1px #e0e0e0;
      padding-left: 10px;
    }
    .form-script-name {
      color: #761086;
    }
  }

  ul {
    font-size: 10px;
    padding: 5px 0 5px 15px;
    margin: 0 10px;
  }
  ul li {
      line-height: 20px;
      list-style-type: disc;
  }
  ul span.form-script-key {
      margin: 0 3px;
      color: #708
  }

  ul span.form-script-field {
      padding: 0 5px;
      margin: 0 3px;
      display: inline-block;
      -webkit-border-radius: 2px;
      -moz-border-radius: 2px;
      border-radius: 2px;
      color: #fff;
      background-color: #178cdf
  }
}
</style>
