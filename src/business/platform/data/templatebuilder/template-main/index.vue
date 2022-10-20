<template>
  <div class="template-main">
    <el-header :height="'40px'" class="layout-header">
      <div class="layout-header-title">
        模版设计
      </div>
      <div class="layout-tools">
        <el-button type="info" size="mini" icon="el-icon-view" @click="handlePreview()">预览</el-button>
        <el-button type="primary" size="mini" icon="ibps-icon-save" @click="saveTemplate()">保存</el-button>
        <el-button v-if="$utils.isNotEmpty(dataTemplate.id)&&(dataTemplate.type!=='dialog'&&dataTemplate.type!=='valueSource')" type="primary" size="mini" icon="ibps-icon-telegram" @click="addMenu()">添加为菜单</el-button>
        <!-- <el-button type="primary" size="mini" icon="ibps-icon-question-circle-o" @click.prevent.stop="guide()">介绍</el-button> -->
        <el-button size="mini" icon="ibps-icon-file-text-o" @click="handleGenerateCode()">生成代码</el-button>
        <el-button size="mini" icon="ibps-icon-close" @click="closeDialog()">关闭</el-button>
      </div>
    </el-header>
    <div class="template-main-container">
      <!--标题-->
      <div :class="{selected:selected}" class="template-header">
        <div class="title">{{ dataTemplate.name||'未设置模版标题' }}</div>
      </div>
      <component
        :is="templateType"
        v-if="template"
        :template="template"
        :data-template="dataTemplate"
        @cloum-click="handleCloumClick"
      />
    </div>
    <!--数据模版预览-动态参数-->
    <dynamic-params-preview
      :visible="dynamicParamsDialogVisible"
      :conditions="conditions"
      @close="visible => dynamicParamsDialogVisible = visible"
      @callback="handleDynamicParams"
    />
    <!--数据模版预览-->
    <data-template-render-preview
      :visible="templateRendererDialogVisible"
      :data="dataTemplate"
      :value="selectedValue"
      :multiple="multiple"
      :label-key="labelKey"
      :dynamic-params="dynamicParams"
      :preview="preview"
      apply-modle="dataTemplate"
      @close="closeTemplateRenderPreviewEven"
      @action-event="handleTemplaterenderActionEvent"
    />
    <!--数据模版预览数据-->
    <data-template-render-preview-data
      :visible="previewDialogVisible"
      :data="previewFormData"
      @close="visible => previewDialogVisible = visible"
    />
    <!-- 添加菜单 -->
    <add-menu
      :visible="addMenuDialogVisible"
      :edit-id="dataTemplate.id"
      @close="visible => addMenuDialogVisible = visible"
    />
    <code-dialog
      :visible="codeDialogVisible"
      :file-key="data.key"
      :data="vueTemplate"
      @close="visible => codeDialogVisible = visible"
    />
  </div>
</template>
<script>
import CodeDialog from '@/business/platform/data/components/code-dialog'
import DataTemplate from './templates'
import PreviewMixin from '@/business/platform/data/templaterender/preview/mixins/preview'

import DynamicParamsPreview from '@/business/platform/data/templaterender/preview/dynamic-params'
import DataTemplateRenderPreview from '@/business/platform/data/templaterender/preview'
import DataTemplateRenderPreviewData from '@/business/platform/data/templaterender/preview/preview-data'

import { getFormData } from '@/api/platform/form/formDef'
import { buildFelds, getDynamicParamsConditions, buildLabelTitle } from '@/business/platform/data/templaterender/utils'
import AddMenu from '@/business/platform/auth/resources/add-menu'
import { getByKey } from '@/api/platform/data/dataTemplate'

export default {
  components: Object.assign({
    CodeDialog,
    DynamicParamsPreview,
    DataTemplateRenderPreview,
    DataTemplateRenderPreviewData,
    AddMenu
  }, DataTemplate),
  mixins: [PreviewMixin],
  props: {
    data: {
      type: Object
    }
  },
  data() {
    return {
      vueTemplate: {},
      codeDialogVisible: false,
      selected: false,
      addMenuDialogVisible: false
    }
  },
  computed: {
    dataTemplate() {
      return this.data ? this.data : {}
    },
    templateType() {
      if (!this.dataTemplate) {
        return
      }
      let key = ''
      if (this.dataTemplate.type === 'valueSource') {
        key = 'value-source'
      } else {
        if (this.dataTemplate.showType === 'compose') {
          if (this.dataTemplate.composeType === 'listTree') {
            key = 'treeList'
          } else {
            key = this.dataTemplate.composeType
          }
        } else {
          key = this.dataTemplate.showType
        }
      }
      if (this.$utils.isEmpty(key)) { return }
      return 'ibps-data-template-fake-' + key
    },
    template() {
      if (!this.dataTemplate) {
        return
      }
      const templates = this.dataTemplate.templates || []
      if (this.dataTemplate.showType === 'compose') {
        return templates
      } else {
        return templates.length > 0 ? templates[0] : {}
      }
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = val
      },
      immediate: true
    }
  },
  methods: {
    // 生成代码时，获取表单参数
    async initVueTemplate(data) {
      const _temp = JSON.parse(JSON.stringify(this.vueTemplate))
      if (data.attrs && this.$utils.isNotEmpty(data.attrs.form_key)) {
        await getFormData({
          templateKey: data.key,
          formKey: data.attrs.form_key,
          rightsScope: 'data'
        }).then(response => {
          const _data = response.data
          const formDef = this.$utils.parseData(_data.form)
          const datasets = buildFelds(formDef.fields, data.datasets)
          data.datasets = datasets
          _temp.dataTemplate = data
          _temp.formData = _data
        }).catch(() => {
          _temp.dataTemplate = data
        })
        this.vueTemplate = _temp
        return
      } else if (this.$utils.isNotEmpty(data.templates)) {
        for (let i = 0; i < data.templates.length; i++) {
          if (this.$utils.isEmpty(data.templates[i].attrs)) continue
          const _key = data.templates[i].attrs.bind_template_key
          if (this.$utils.isEmpty(_key)) continue
          await getByKey({
            dataTemplateKey: _key
          }).then(response => {
            const _response = this.$utils.parseJSON(response.data)
            data.templates[i].dataTemplate = _response
          }).catch(() => {})
          if (this.$utils.isNotEmpty(data.templates[i].dataTemplate) &&
          data.templates[i].dataTemplate.attrs &&
          this.$utils.isNotEmpty(data.templates[i].dataTemplate.attrs.form_key)) {
            await getFormData({
              templateKey: data.templates[i].dataTemplate.key,
              formKey: data.templates[i].dataTemplate.attrs.form_key,
              rightsScope: 'data'
            }).then(response => {
              const _data = response.data
              data.templates[i].formData = _data
            }).catch(() => {
            })
          }
        }
      }
      _temp.dataTemplate = data
      this.vueTemplate = _temp
    },
    handleGenerateCode() {
      if (this.$utils.isEmpty(this.dataTemplate)) {
        this.$message({
          showClose: true,
          message: '数据模版为空！',
          type: 'warning'
        })
        return
      }
      let hasBindTempate = true
      if (this.dataTemplate.showType === 'compose' && this.dataTemplate.composeType !== 'treeForm') {
        if (this.$utils.isEmpty(this.dataTemplate.templates)) {
          hasBindTempate = false
        } else {
          this.dataTemplate.templates.forEach(d => {
            if (this.$utils.isEmpty(d.attrs) || this.$utils.isEmpty(d.attrs.bind_template_key)) {
              hasBindTempate = false
            }
          })
        }
      }
      if (!hasBindTempate) {
        this.$message({
          showClose: true,
          message: '请检查数据模板是否绑定！',
          type: 'warning'
        })
        return
      }
      const _temp = {
        dataTemplate: {},
        multiple: true,
        labelKey: '',
        conditions: {}, // 动态条件
        dynamicParams: this.dynamicParams
      }
      // 判断是否有 动态参数
      const conditions = getDynamicParamsConditions(this.dataTemplate, this.getDataByKey)
      if (this.dataTemplate.type === 'dialog') {
        const dialogs = this.dataTemplate.dialogs
        _temp.multiple = dialogs && dialogs.attrs ? dialogs.attrs.multi !== 'N' : true
        _temp.labelKey = buildLabelTitle(this.dataTemplate)
      } else {
        _temp.multiple = true
      }
      if (this.$utils.isNotEmpty(conditions)) {
        _temp.conditions = conditions
      }

      this.vueTemplate = _temp
      const data = JSON.parse(JSON.stringify(this.dataTemplate))
      this.initVueTemplate(data)
      this.codeDialogVisible = true
    },
    closeTemplateRenderPreviewEven(visible) {
      this.templateRendererDialogVisible = visible
      this.preview = false
    },
    handleCloumClick(value) {
      this.$emit('cloum-click', value)
    },
    closeDialog() {
      this.$emit('close')
    },
    saveTemplate() {
      this.$emit('save')
    },
    addMenu() {
      this.addMenuDialogVisible = true
    },
    handlePreview() {
      this.previewTemplate()
    }
  }
}
</script>
