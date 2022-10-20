<template>
  <div>
    <ibps-crud
      v-if="$utils.isNotEmpty(listConfig)"
      ref="crud"
      :data="listData"
      :pk-key="pkKey"
      :unique="dataTemplate.unique"
      :has-toolbar="listConfig.hasToolbar"
      :selection-row="selectionRow"
      :toolbars="listConfig.toolbars"
      :search-toolbars="listConfig.searchToolbars"
      :search-form="listConfig.searchForm"
      :columns="listConfig.columns"
      :row-handle="listConfig.rowHandle"
      :pagination="pagination"
      :show-pagination="showPagination"
      :height="tableHeight"
      :self-adaption="selfAdaption"
      :index-row="indexRow"
      :loading="loading"
      :selection-type="selectionType"
      :display-field="displayField"
      :display-field-data="displayFieldData"
      :access-control="accessControl"
      :identity="listIdentity"
      :options="crudOption"
      default-sort-type="prop"

      :stripe="listRowBackground.userStripe==='Y'"
      :table-row-function="tableRowFunction"

      class="hidden-print template-list"
      :class="{
        'ibps-data-template-list__preview': preview,
        'ibps-row-handle':(template && template.attrs?template.attrs.manage_effect === 'Y':false) && $utils.isNotEmpty(listConfig.rowHandle)
      }"
      @display-field-change="handleDisplayField"
      @header-dragend="handleHeaderDragend"
      @selection-change="handleSelectionChange"
      @action-event="handleAction"
      @sort-change="handleSortChange"
      @pagination-change="handlePaginationChange"
    >
      <template #empty>
        <template v-if="loading">
          {{ emptyText }}
        </template>
        <ibps-empty v-else />
      </template>
      <!--自定义查询条件-->
      <template #searchForm>
        <search-form
          v-if="listConfig.searchForm&&hasInitParameter"
          ref="searchForm"
          :forms="listConfig.searchForm.forms||[]"
          :size="listConfig.searchForm.size"
          :fuzzy="listConfig.searchForm.fuzzy"
          :inline="listConfig.searchForm.inline"
          :label-width="listConfig.searchForm.labelWidth"
          :item-width="listConfig.searchForm.itemWidth"
        />
      </template>
      <!--数字-->
      <template #number="scope">
        {{ scope.value |filterNumber(scope.column.field_options) }}
      </template>
      <!--多行-->
      <template #textarea="scope">
        <div class="ibps-field-text">{{ scope.value }}</div>
      </template>
      <!--富文本框-->
      <template #editor="scope">
        <span v-html="$utils.formatText(scope.value)" />
      </template>
      <!--数据字典-->
      <template #dictionary="scope">
        <dictionary-format
          :value="scope.value"
          :multiple="$utils.toBoolean(scope.column.field_options.multiple,true)"
          :dict="{
            typeKey:scope.column.field_options.dictionary,
            displayMode:scope.column.field_options.display_mode,
            displayEffect:scope.column.field_options.display_effect
          }"
        />
      </template>
      <!--附件-->
      <template #attachment="scope">
        <ibps-attachment
          v-if="$utils.isNotEmpty(scope.column)"
          v-model="scope.value"
          :multiple="$utils.toBoolean( scope.column.field_options.multiple,true)"
          :download="false"
          :store="scope.column.field_options.store"
          :readonly="true"
        />
      </template>
      <!--选择器-->
      <template #selector="scope">
        <template v-if="$utils.isNotEmpty(scope.column)">
          <span v-if="scope.column.field_options.store==='bind'">
            {{ scope.value }}
          </span>
          <ibps-user-selector
            v-else
            v-model="scope.value"
            :type="scope.column.field_options.selector_type||'user'"
            :multiple="$utils.toBoolean( scope.column.field_options.multiple,true)"
            :store="scope.column.field_options.store||'id'"
            readonly
            readonly-text="text"
          />
        </template>
      </template>
      <!--自定义对话框-->
      <template #customDialog="scope">
        <ibps-custom-dialog
          v-if="$utils.isNotEmpty(scope.column)"
          v-model="scope.value"
          :template-key="scope.column.field_options.dialog"
          :multiple="$utils.toBoolean( scope.column.field_options.multiple,true)"
          :store="scope.column.field_options.store"
          :icon="scope.column.field_options.icon?'ibps-icon-'+scope.column.field_options.icon:''"
          :type="scope.column.field_options.dialog_type"
          :dynamic-params="getLinkDynamicParams(scope.column.field_options,scope.row)"
          readonly
          disabled
          readonly-text="text"
        />
      </template>
      <!--关联数据-->
      <template #linkdata="scope">
        <!-- <data-template-format
          :value="scope.value"
          :template-key="scope.column.field_options.linkdata"
          :multiple="$utils.toBoolean( scope.column.field_options.multiple,true)"
          :dynamic-params="getLinkDynamicParams(scope.column.field_options,scope.row)"
          :value-key="getLinkValueKey(scope.column.field_options)"
          :label-type="getLinkLabelType(scope.column.field_options)"
          :label-key="getLinkLabelKey(scope.column.field_options)"
        > -->
        <ibps-link-data
          v-if="$utils.isNotEmpty(scope.column)"
          v-model="scope.value"
          :template-key="scope.column.field_options.linkdata"
          :multiple="$utils.toBoolean( scope.column.field_options.multiple,true)"
          :dynamic-params="getLinkDynamicParams(scope.column.field_options,scope.row)"
          :has-dynamic-params="hasDynamicParams(scope.column.field_options)"
          :value-key="getLinkValueKey(scope.column.field_options)"
          :label-type="getLinkLabelType(scope.column.field_options)"
          :label-key="getLinkLabelKey(scope.column.field_options)"
          :structure="getLinkStructure(scope.column.field_options)"
          :config="getLinkConfig(scope.column.field_options)"
          readonly
          readonly-text="text"
          allow-empty-dynamic-params
        />
      </template>
      <!--地址-->
      <template #address="scope">
        <template v-if="$utils.isNotEmpty(scope.column)">
          <ibps-address
            :value="getAddressValue(scope.value,scope.column.field_options)"
            :size="scope.column.field_options.size"
            :top="scope.column.field_options.top || 'country'"
            :top-val="getAddressTopVal(scope.column.field_options)"
            :level="scope.column.field_options.level||'district'"
            data-type="code"
            :disabled="true"
            readonly-text="text"
          />
          <span v-if="scope.column.field_options.is_street">{{ getStreet(scope.value) }}</span>
        </template>
      </template>
      <!--图片-->
      <template #image="scope">
        <ibps-image
          v-if="$utils.isNotEmpty(scope.column)"
          v-model="scope.value"
          :multiple="$utils.toBoolean( scope.column.field_options.multiple,true)"
          :download="scope.column.field_options.download"
          :store="scope.column.field_options.store"
          :disabled="true"
        />
      </template>
      <template #combinationFields="scope">
        <combination-fields :config="scope.column" :data="scope.row" />
      </template>
      <template #customFormatter="scope">
        <div v-html="customFormatter(scope.column.prop,scope.value,scope.row,scope.column)" />
      </template>
    </ibps-crud>

    <data-template-formrender-dialog
      ref="formrender"
      :visible="dialogFormVisible"
      :form-key="formKey"
      :template-form-data="templateFormData"
      :print-template-id="printTemplateId"
      :default-data="defaultFormData"
      :pk-value="pkValue"
      :toolbars="editToolbars"
      :button-priority="buttonPriority"
      :readonly="readonly"
      :template-key="dataTemplate.key"
      :buttons-position="buttonsPosition"
      @callback="search"
      @close="visible => dialogFormVisible = visible"
    />
    <!-- 流程定义选择器 -->
    <bpm-def-dialog
      v-model="dialogValue"
      :visible="dialogVisible"
      :form-key="formKey"
      :multiple="false"
      :is-data-template-use="true"
      @close="visible => dialogVisible = visible"
      @action-event="handleDialogActionEvent"
    />
    <!-- 字段导出  -->
    <ibps-export-columns-dialog
      :visible="exportColumnsVisible"
      :data="template"
      :action="action"
      :pagination="pagination"
      @callback="callbackExtFields"
      @close="visible => exportColumnsVisible = visible"
    />
    <!-- 字段导入  -->
    <ibps-import-columns-dialog
      :visible="importColumnsVisible"
      :data="template"
      :fields="fields"
      :data-template="dataTemplate"
      @save-upload="initData"
      @close="visible => importColumnsVisible = visible"
    />
    <!-- ______________-->
    <ibps-data-template-render-dialog
      :visible="templateDialogVisible"
      :template-key="templateDialogKey"
      :template-form-data="templateFormData"
      :dynamic-params="templateDialogDynamicParams"
      @close="visible => templateDialogVisible = visible"
      @action-event="handleTemplateDialogActionEvent"
    />
    <!-- 表单打印-->
    <form-print-template
      :id="printTemplateId"
      :pk="pkValue"
      :visible="formPrintTemplateDialogVisible"
      @close="visible => formPrintTemplateDialogVisible = visible"
    />
    <component
      :is="dialogTemplate"
      v-if="dialogTemplate"
      ref="dialogTemplate"
      v-bind="dialogTemplateAtts"
    />
  </div>
</template>
<script>
import { queryDataTable, removeFormData, logicRemove, exportData, checkExportData } from '@/api/platform/data/dataTemplate'
import { startFlowFromList } from '@/api/platform/bpmn/bpmInst'
import { getDatabaseType } from '@/api/platform/form/formDef'
import fecha from '@/utils/fecha'
import { debounce, toUpper, toLower } from 'lodash'
import ActionUtils from '@/utils/action'
import Identity from '@/constants/identity'
import FormOptions from '@/business/platform/form/constants/formOptions'
import FormUtils from '@/business/platform/form/utils/formUtil'
import DateFormatUtil from '@/business/platform/form/utils/dateFormatUtil'
import ButtonsConstants, { hasButton, hasSearchPermission } from '@/business/platform/data/constants/buttons'

import { filterNumber } from '../utils'
import { dateScopeOptions, queryConditionOptions } from '@/business/platform/form/constants/fieldOptions'

import BpmDefDialog from '@/business/platform/bpmn/definition/dialog'

import SearchForm from '../../components/search-form'

import DataTemplateFormrenderDialog from '../form/dialog'
import IbpsAttachment from '@/business/platform/file/attachment/selector'
import IbpsUserSelector from '@/business/platform/org/selector'
import IbpsCustomDialog from '@/business/platform/data/templaterender/custom-dialog'
import IbpsLinkData from '@/business/platform/data/templaterender/link-data'
import IbpsAddress from '@/components/ibps-address/cascader'
import IbpsImage from '@/business/platform/file/image'

import DictionaryFormat from '../components/format/dictionary-format'
// import DataTemplateFormat from '../components/format/data-template-format'

import CombinationFields from '../components/combination-fields'

import IbpsExportColumnsDialog from '../components/export-columns-dialog'
import IbpsImportColumnsDialog from '../components/import-columns-dialog'
import CustomDataDisplayMixin from '@/business/platform/system/mixins/customDataDisplay'
import FormPrintTemplate from '@/business/platform/form/form-print/template'

// import JTemplate from '../utils/JTemplate'// 自定义脚本
import eventsUtil from '@/utils/eventsUtil'// 自定义脚本

import Vue from 'vue'
import { isEqual } from 'element-ui/lib/utils/util'
Vue.component('IbpsDataTemplateRenderDialog', () => import('@/business/platform/data/templaterender/preview/dialog.vue'))

export default {
  name: 'List',
  components: {
    CombinationFields,
    BpmDefDialog,
    DataTemplateFormrenderDialog,
    FormPrintTemplate,
    SearchForm,
    IbpsAttachment,
    IbpsUserSelector,
    IbpsCustomDialog,
    IbpsLinkData,
    IbpsExportColumnsDialog,
    IbpsImportColumnsDialog,
    IbpsAddress,
    IbpsImage,
    DictionaryFormat
    // DataTemplateFormat
  },
  filters: {
    filterNumber(data, fieldOptions = {}) {
      return filterNumber(data, fieldOptions)
    }
  },
  mixins: [CustomDataDisplayMixin],
  props: {
    templateFormData: { // 代码生成后，保存的表单定义数据
      type: Object
    },
    dataTemplate: Object,
    functions: Function,
    template: Object,
    params: Object,
    dynamicParams: Object,
    composeParams: Object,
    value: [String, Number, Array, Object],
    multiple: Boolean,
    height: [String, Number],
    fields: Object,
    relatedTreeFields: String,
    relatedListFields: String,
    defaultData: [Array, Object],
    preview: {
      type: Boolean,
      default: false
    },
    /**
     * 是否受权限控制
     */
    accessControl: {
      type: Boolean,
      default: true
    },
    // 高度自适应
    selfAdaption: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dateScopeOptions,
      queryConditionOptions,
      dialogValue: {},
      dialogVisible: false,
      sefStartFlowId: '',
      crudOption: {
        stripe: false,
        border: true
      },
      defaultFormData: {},

      initialization: false,
      tableHeight: document.body.clientHeight,
      listIdentity: '',
      listData: [],
      listConfig: {
        // 工具栏
        toolbars: [],
        columns: [],
        searchForm: null,
        rowHandle: null
      },
      pagination: {
        page: 1,
        limit: 20
      },
      selectionRow: true,
      indexRow: false,
      displayField: false,
      displayFieldData: [],
      showPagination: false,
      sorts: {},
      loading: false,
      key: '',
      pkValue: '',
      formKey: '',
      readonly: false,
      dialogFormVisible: false,
      editButtons: [], // 表单按钮
      buttonPriority: 'outside',
      editToolbars: [],
      filterConditionKey: '',

      templateDialogVisible: false,
      templateDialogKey: '',
      templateDialogDynamicParams: {},

      exportColumnsVisible: false,
      action: '',
      selecteds: '',

      databaseType: 'lower',

      importColumnsVisible: false,

      columClassName: '',

      selectionAll: this.multiple ? [] : {}, // 所有选中的数据包含跨页数据
      selection: this.multiple ? [] : {}, // 当前页选中的数据
      dialogTemplate: null,
      dialogTemplateAtts: {},
      formPrintTemplateDialogVisible: false,
      printTemplateId: '',
      outerKey: '',
      isInitTempalte: false,
      defaultQueryParams: {},
      eventsUtil: {},
      emptyText: '数据加载中',

      combinationQueryFileds: {},
      conditionTypeOptions: {
        include: {
          fieldSuffix: '^SL',
          conditionType: 'OR'
        },
        unInclude: {
          fieldSuffix: '^SNL',
          conditionType: 'AND'
        }
        // equality:'SNL',
        // unEquality:'SNL',
      },
      dataTypes: {
        date: {
          start: '^DL',
          end: '^DG'
        },
        varchar: {
          include: '^SL',
          unInclude: '^SLN'
        },
        number: {
          include: '^SIN',
          unInclude: '^SNIN'
        }
      },
      origDisplayColumns: []
    }
  },
  computed: {
    buttonsPosition() {
      if (this.$utils.isNotEmpty(this.template) &&
        this.$utils.isNotEmpty(this.template.attrs)) {
        return this.template.attrs.buttons_position || ''
      } else {
        return ''
      }
    },
    selectionType() {
      return this.multiple ? 'checkbox' : 'radio'
    },
    pkKey() {
      return this.key || 'id_'
    },
    formFieldMap() {
      if (this.$utils.isEmpty(this.fields)) {
        return {}
      }
      const map = {}
      for (const key in this.fields) {
        const field = this.fields[key]
        if (this.$utils.isNotEmpty(field.field_name)) {
          map[field.field_name.toLowerCase()] = key
        }
      }
      return map
    },
    composeParam() {
      return this.composeParams
    },
    listRowBackground() {
      return this.template && this.template.attrs ? this.template.attrs.default_list_row_background || {} : {}
    },
    displayMap() {
      const map = new Map()
      if (this.template && this.template.display_columns) {
        this.template.display_columns.forEach(item => {
          if (item.label) map.set(item.name, item.label)
        })
      }
      return map
    }
  },
  watch: {
    value: {
      handler(val, oldVal) {
        this.selectionAll = val
      },
      immediate: true,
      deep: true
    },
    selectionAll: {
      handler(val, oldVal) {
        this.$emit('selected', val)
      },
      deep: true
    },
    template: {
      handler(val, oldVal) {
        if (!this.template) {
          return
        }
        this.combinationQueryFileds = {}
        this.getDatabaseType()
        this.initUI()
        this.initDefaultQuertCondition()
        this.listConfig = null
        this.displayFieldData = []
        this.initParameter()
        // this.initData()
      },
      immediate: true
    },
    height: {
      handler(val, oldVal) {
        this.loadHeight()
      },
      immediate: true
    },
    dynamicParams: {
      handler(val, oldVal) {
        if (!isEqual(val, oldVal)) {
          this.initData()
        }
      },
      deep: true
    }
  },
  beforeDestroy() {
    // const script = document.getElementById('JTemplate')
    // if (script) {
    //   script.parentNode.removeChild(script)
    // }
    eventsUtil.cleanEventsByName(this.eventsUtil._eventsUtilsID)
    this.eventsUtil = null
    this.dialogValue = null
    this.defaultFormData = null
    this.listData = null
    this.listConfig = null
    this.pagination = null
    this.displayFieldData = null
    this.sorts = null
    this.editButtons = null
    this.editToolbars = null
    this.templateDialogDynamicParams = null
    this.selectionAll = null
    this.selection = null
    this.dialogTemplate = null
    this.dialogTemplateAtts = null
    this.combinationQueryFileds = null
  },
  methods: {
    getDatabaseType() {
      getDatabaseType().then(response => {
        this.databaseType = response.data
        this.checkPk(this.dataTemplate.unique)
        this.initData()
      }).catch(() => {
        this.loading = false
      })
    },
    checkPk(pk) {
      let pkKey = pk || 'id_'
      if (this.databaseType === 'upper') {
        pkKey = toUpper(pkKey)
      } else if (this.databaseType === 'lower') {
        pkKey = toLower(pkKey)
      }
      this.key = pkKey
    },
    initUI() {
      this.initialization = false
      if (!this.initialization) {
        // this.initJTemplate()
        this.initOrigDisplayColumns()
        this.initialization = true
        if (this.dataTemplate.attrs && this.dataTemplate.attrs.script) {
          this.eventsUtil = eventsUtil._initEvents(this.dataTemplate.attrs.script, 'list_' + this.dataTemplate.key, true)
        }
        setTimeout(() => {
          this.loadScript()
        }, 10)
      }
    },
    createElementStyle(css) {
      this.$utils.createStyles(css)
    },
    tableRowFunction({ row, rowIndex }) {
      const { template } = this
      if (!template.attrs.default_list_row_background) return ''
      const default_list_row_background = template.attrs.default_list_row_background
      let className = ''
      // 全局设置
      const allBackgroundColor = default_list_row_background.allBackgroundColor || '#FFF'
      this.createElementStyle(`.all-custom-color{background: ${allBackgroundColor} !important}`)
      className = 'all-custom-color'
      // 条件设置
      const conditionData = default_list_row_background.fliter_conditon_config
      if (this.$utils.isNotEmpty(conditionData)) {
        const conditionGroup = [] // 背景颜色的组合条件结果组合
        conditionData.forEach((c, l) => {
          const num = Math.ceil(Math.random() * 100000)
          // 定义颜色变量，后续条件判断符合即给予对应颜色，如果符合多个则为顺承关系，后面的为准。
          const conditionResult = [] // 条件匹配结果-汇总
          const obj = {
            className: 'condition-' + num,
            rowBackground: c.conditionColor || allBackgroundColor,
            logicResult: true // 整合【且-或】流转的最终结果。
          }
          for (var i = 0; i < c.conditionData.length; i++) {
            const condition = c.conditionData[i]
            conditionResult.push(this.logicOperation(row[condition.selectField], condition.conditionPrice, condition.selectCondition, condition.dataType))
            if (condition.logic !== '' && c.conditionData.length > 1 && i + 1 <= c.conditionData.length) {
              const symbol = condition.logic === 'and' ? '&' : '||'
              conditionResult.push(symbol)
            }
          }
          obj.logicResult = conditionResult.join('')
          conditionGroup.push(obj)
        })
        conditionGroup.forEach(group => {
          const logicResult = new Function(`return ${group.logicResult}`)()
          if (logicResult || logicResult === 1) {
            this.createElementStyle(`.${group.className}{background: ${group.rowBackground} !important}`)
            className = group.className
          } else {
            className = 'all-custom-color'
          }
        })
      }
      return className
    },
    // 条件运算
    logicOperation(data1, data2, logicType, dataType) {
      let logicResult = true
      if (dataType === 'varchar') {
        switch (logicType) {
          case 'contains':
            logicResult = data1 === data2
            break
          case 'not_contains':
            logicResult = data1 !== data2
            break
          case 'include':
            logicResult = data1.indexOf(data2) === 1
            break
          case 'unInclude':
            logicResult = data1.indexOf(data2) === -1
            break
        }
      } else if (dataType === 'date') {
        var json_date1 = parseInt(new Date(data1).getTime() / 1000)
        var json_date2 = parseInt(new Date(data2).getTime() / 1000)
        switch (logicType) {
          case 'contains':
            logicResult = json_date1 === json_date2
            break
          case 'not_contains':
            logicResult = json_date1 !== json_date2
            break
          case 'greater':
            logicResult = json_date1 > json_date2
            break
          case 'greater_contains':
            logicResult = json_date1 >= json_date2
            break
          case 'unGreater':
            logicResult = json_date1 < json_date2
            break
          case 'unGreater_contains':
            logicResult = json_date1 <= json_date2
            break
        }
      } else {
        switch (logicType) {
          case 'contains':
            logicResult = data1 === parseInt(data2)
            break
          case 'not_contains':
            logicResult = data1 !== parseInt(data2)
            break
          case 'greater':
            logicResult = data1 > parseInt(data2)
            break
          case 'greater_contains':
            logicResult = data1 >= parseInt(data2)
            break
          case 'unGreater':
            logicResult = data1 < parseInt(data2)
            break
          case 'unGreater_contains':
            logicResult = data1 <= parseInt(data2)
            break
        }
      }
      return logicResult
    },
    initDefaultQuertCondition() {
      const condition = this.template.attrs.default_query_condition
      if (this.template.attrs.init_query === 'N' || this.$utils.isEmpty(condition)) return
      const queryConditionObj = {}
      const _self = this
      let params = ''
      condition.forEach(c => {
        if (c.filed_type === 'date') {
          const prop1 = 'Q^' + c.paramsField + '^DL'
          const prop2 = 'Q^' + c.paramsField + '^DG'
          switch (c.constraint) {
            case 'equalTo':
            case 'middle':
              params = []
              params.push(prop1, prop2)
              break
            case 'greater':// 小于
              params = prop2
              break
            case 'less'://  大于
              params = prop1
              break
          }
          let propsParams
          if (c.givePriceWay === 'fixed') {
            propsParams = c.paramsFiledValue
          } else if (c.givePriceWay === 'javaScript') {
            const scriptResult = new Function('_self', c.paramsFiledValue)(_self)
            propsParams = scriptResult
          }
          switch (c.constraint) {
            case 'equalTo':
              params.forEach((p, i) => {
                queryConditionObj[p] = propsParams
              })
              break
            case 'middle':
              params.forEach((p, i) => {
                queryConditionObj[p] = propsParams[i]
              })
              break
            case 'greater':
            case 'less':
              queryConditionObj[params] = propsParams
              break
          }
        } else {
          if (c.constraint === 'equalTo') {
            params = 'Q^' + c.paramsField + '^S'
          } else {
            params = 'Q^' + c.paramsField + '^SL'
          }
          let paramsData
          if (c.givePriceWay === 'fixed') {
            paramsData = c.paramsFiledValue
          } else if (c.givePriceWay === 'javaScript') {
            const scriptResult = new Function('_self', c.paramsFiledValue)(_self)
            paramsData = scriptResult
          }
          queryConditionObj[params] = paramsData
        }
      })
      this.defaultQueryParams = queryConditionObj
    },
    loadHeight() {
      if (this.$utils.isNotEmpty(this.height)) {
        this.tableHeight = this.height
      } else {
        if (this.preview) {
          this.tableHeight = document.body.clientHeight - 30
        } else {
          this.tableHeight = this.fixHeight()
        }
      }
    },
    getParentEl(parentEl) {
      if (parentEl.$el && parentEl.$el.nodeName !== '#comment') {
        return parentEl.$el
      } else {
        return this.getParentEl(parentEl.$parent)
      }
    },
    fixHeight() {
      const parentEl = this.getParentEl(this.$parent)
      const parentHeight = parentEl.offsetHeight
      // header 高度
      const header = parentEl.getElementsByClassName('ibps-theme-header')
      let headerHeight = 0
      if (header && header[0]) {
        headerHeight = header[0].offsetHeight || 60
      }
      // tab 高度
      const tabs = parentEl.getElementsByClassName('ibps-multiple-page-control-group')
      let tabHeight = 0
      if (tabs && tabs[0]) {
        tabHeight = 40
      }
      return parentHeight - headerHeight - tabHeight
    },
    initData() {
      this.listIdentity = Identity.IBPS.DATA.TEMPLATE_TEL + '_' + this.dataTemplate.key
      if (this.displayField) {
        this.loadDisplayField()
      }
      // 是否初始化查询数据
      if (this.template && this.template.attrs && this.template.attrs.init_query === 'N') {
        this.listData = []
        return
      }
      this.loadData(this.outerKey, 'init')
    },
    clearSelection() {
      this.$refs['crud'].clearSelection()
      this.$emit('selected', this.multiple ? [] : '')
    },
    handleSelectionChange(selection) {
      this.selection = selection
      setTimeout(() => {
        this.changePageCoreRecordData()
      }, 10)
    },
    /**
     * 记忆选择核心方法
     */
    changePageCoreRecordData() {
      // 如果总记忆中还没有选择的数据，那么就直接取当前页选中的数据，不需要后面一系列计算
      if (this.$utils.isEmpty(this.selectionAll)) {
        this.selectionAll = JSON.parse(JSON.stringify(this.selection))
        return
      }

      // 标识当前行的唯一键的名称
      const { listData } = this
      // 总选择里面的key集合
      const selectAllIds = this.getSelectAllIds()
      let selectionAll = []
      if (this.multiple) {
        selectionAll = [].concat(this.selectionAll)
      } else {
        selectionAll.push(this.selectionAll)
      }

      // 获取当前页选中的id
      const selectIds = []
      if (this.multiple) {
        this.selection.forEach(row => {
          const pkValue = this.getPkValue(row)
          selectIds.push(pkValue)
          // 如果总选择里面不包含当前页选中的数据，那么就加入到总选择集合里
          if (selectAllIds.indexOf(pkValue) < 0) {
            selectionAll.push(row)
          }
        })
      } else {
        if (this.$utils.isNotEmpty(this.selection)) {
          const pkValue = this.getPkValue(this.selection)
          selectIds.push(pkValue)
          if (selectAllIds.indexOf(pkValue) < 0) {
            selectionAll = []
            selectionAll.push(this.selection)
          }
        } else {
          if (this.$utils.isNotEmpty(this.selectionAll)) {
            const pkValue = this.getPkValue(this.selectionAll)
            selectIds.push(pkValue)
          }
        }
      }

      const noSelectIds = []
      // 得到当前页没有选中的id
      listData.forEach(row => {
        const pkValue = this.getPkValue(row)
        if (selectIds.indexOf(pkValue) < 0) {
          noSelectIds.push(pkValue)
        }
      })
      noSelectIds.forEach(id => {
        if (selectAllIds.indexOf(id) >= 0) {
          for (let i = 0; i < selectionAll.length; i++) {
            const pkValue = this.getPkValue(selectionAll[i])
            if (pkValue === id) {
              // 如果总选择中有未被选中的，那么就删除这条
              selectionAll.splice(i, 1)
              break
            }
          }
        }
      })
      if (this.multiple) {
        this.selectionAll = selectionAll
      } else {
        this.selectionAll = selectionAll[0]
      }
    },
    setSelectRow() {
      setTimeout(() => {
        this.setRowSelect()
      }, 10)
    },
    /**
     *  设置选中的方法
     */
    setRowSelect() {
      const tableEl = this.$refs['crud']
      if (!tableEl) {
        return
      }
      // 先清空
      tableEl.clearSelection()
      if (this.$utils.isEmpty(this.selectionAll)) {
        if (!this.multiple) {
          this.selection = {}
        }
        return
      }
      const { listData } = this
      const selectAllIds = this.getSelectAllIds()
      for (let i = 0; i < listData.length; i++) {
        const row = listData[i]
        if (selectAllIds.indexOf(this.getPkValue(row)) >= 0) {
          if (this.multiple) {
            tableEl.toggleSelectionRow(row, true)
          } else {
            tableEl.setSelectionRadio(row)
          }
        }
      }
    },
    /**
     * 获取选择的ID
     */
    getSelectAllIds() {
      const selectAllIds = []
      if (this.multiple) {
        this.selectionAll.forEach(row => {
          selectAllIds.push(this.getPkValue(row))
        })
      } else {
        selectAllIds.push(this.getPkValue(this.selectionAll))
      }
      return selectAllIds
    },
    /**
     * 根据key获取对象的值
     * 用于解决key值大小写不同的问题
     * @param {Object} data 需要从中获取值的对象
     * @param {Object} defaultValue 默认值
     */
    getPkValue(data, defaultValue = '') {
      const pkKey = this.pkKey || 'id'
      // 创建一个忽略大小写的正则对象
      const regx = new RegExp(`^${pkKey}$`, 'gi')
      // 循环正则匹配
      for (const key in data) {
        // 匹配成功返回值
        if (regx.test(key)) {
          return data[key]
        }
      }
      return defaultValue
    },
    /**
     * 加载数据
     */
    loadData(outerKey = '', operation) {
      if (this.$utils.isEmpty(this.template)) return
      this.outerKey = outerKey
      this.loading = true
      this.emptyText = '数据加载中'
      queryDataTable(this.getFormatParams()).then(response => {
        this.loading = false
        ActionUtils.handleListData(this, response.data)
        this.setSelectRow()
        if (this.$refs.crud) {
          this.$refs.crud.handleTableHeight()
          debounce(() => {
            if (this.$refs.crud) {
              this.$refs.crud.handleTableHeight()
            }
          }, 100)
        }
        if (this.$utils.isEmpty(this.listData)) {
          this.emptyText = '暂无数据'
        }
      }).catch(() => {
        this.emptyText = '暂无数据'
        this.loading = false
      })
    },
    /**
     * 获取格式化参数
     */

    getFormatParams() {
      const formParams = this.buildFormParams() || {}
      const responseData = JSON.parse(JSON.stringify(this.template))
      responseData.datasetKey = this.dataTemplate.datasetKey
      responseData.unique = this.pkKey
      responseData['dynamic_params'] = this.dynamicParams
      formParams['response_data'] = JSON.stringify(responseData)
      formParams['filter_condition_key'] = this.filterConditionKey
      return ActionUtils.formatParams(formParams, this.pagination, this.sorts)
    },
    buildFormParams() {
      let formParams = {}
      if (this.$refs['searchForm']) {
        formParams = this.$refs['searchForm'].getSearcFormData() || {}
      }
      if (this.$utils.isNotEmpty(formParams)) {
        for (var key in formParams) {
          const value = formParams[key]
          if (this.$utils.isEmpty(value)) {
            delete formParams[key]
            continue
          }
          // 多选的处理
          if (Array.isArray(value)) {
            formParams[key] = this.getMultiSelectParams(key, value)
          }
          // 组合字段处理
          if (this.combinationQueryFileds[key]) {
            formParams[key] = this.getCombinationQueryParams(this.combinationQueryFileds[key], value)
          }
        }
      }
      // 外部传入参数处理
      if (this.$utils.isNotEmpty(this.composeParam) && this.$utils.isNotEmpty(this.outerKey)) {
        for (var i in this.composeParam) {
          formParams[i] = this.composeParam[i]
        }
      }
      // 初始化查询-默认条件
      if (this.$utils.isNotEmpty(this.defaultQueryParams)) {
        for (const i in this.defaultQueryParams) {
          formParams[i] = this.defaultQueryParams[i]
        }
        setTimeout(() => {
          this.defaultQueryParams = {}
        }, 50)
      }
      return formParams
    },
    getMultiSelectParams(key, value) {
      const queryColumns = {
        relation: 'AND', // 组合条件类型
        parameters: [] // 拼接的字段集合
      }
      const parameters = []
      for (let i = 0; i < value.length; i++) {
        const val = value[i]
        parameters.push({
          key: key,
          value: val,
          param: this.$utils.guid()
        })
      }
      queryColumns.parameters.push({
        relation: 'OR',
        parameters: parameters
      })
      return queryColumns
    },
    getCombinationQueryParams(combination, value) {
      const queryFileds = combination.queryFileds
      const conditionType = combination.conditionType

      const queryColumns = {
        relation: 'AND', // 组合条件类型
        parameters: [] // 拼接的字段集合
      }

      const parameters = []
      queryFileds.forEach(q => {
        parameters.push({
          key: q.queryfields,
          value: value,
          param: this.$utils.guid()
        })
      })
      queryColumns.parameters.push({
        relation: conditionType,
        parameters: parameters
      })
      return queryColumns
    },
    /**
     * 处理分页事件
     */
    handlePaginationChange(page) {
      this.changePageCoreRecordData()
      ActionUtils.setPagination(this.pagination, page)
      this.loadData(this.outerKey, 'pagination')
    },
    /**
     * 处理排序
     */
    handleSortChange(sort) {
      ActionUtils.setSorts(this.sorts, sort)
      this.loadData(this.outerKey, 'sort')
    },
    // 查询数据
    search() {
      this.loadData(this.outerKey, 'search')
    },
    resetSearchForm() {
      if (this.$refs['searchForm']) {
        this.$refs['searchForm'].resetSearchForm()
      }
    },
    /**
     * 获取显示字段
     */
    loadDisplayField() {
      if (!this.preview) {
        this.getCustomDataDisplay(this.listIdentity).then((data) => {
          this.displayFieldData = data
        })
      } else {
        this.displayFieldData = []
      }
    },
    // 默认显示字段
    getDefaultDisplayFieldData() {
      const displayFields = []
      this.listConfig.columns.forEach((column) => {
        if (!column.hidden) {
          displayFields.push(column)
        }
      })
      return JSON.parse(JSON.stringify(displayFields))
    },

    handleHeaderDragend(newWidth, oldWidth, column, event) {
      if (this.preview || !this.displayField) {
        return
      }

      let displayFieldData = []
      if (this.$utils.isEmpty(this.displayFieldData)) {
        displayFieldData = this.getDefaultDisplayFieldData()
      } else {
        displayFieldData = JSON.parse(JSON.stringify(this.displayFieldData))
      }

      for (let i = 0; i < displayFieldData.length; i++) {
        const displayField = displayFieldData[i]
        if (displayField.prop === column.property) {
          displayField.width = parseInt(newWidth)
        }
      }

      this.handleDisplayField(displayFieldData, () => { }, false)
    },
    /**
     * 保存显示字段
     */
    handleDisplayField(data, callback, hasMessage = true) {
      if (!this.preview) {
        this.saveCustomDataDisplay(data, this.listIdentity).then((response) => {
          this.displayFieldData = data
          if (hasMessage) ActionUtils.success(response.message)
          callback(true)
          this.search()
        }).catch(() => {
          callback(false)
        })
      } else {
        ActionUtils.success('保存成功,该为演示,不保存数据库！')
        callback(true)
      }
    },

    handleAction(command, position, selection, data, index, button) {
      const beforeScript = this.$utils.isEmpty(this.functions) ? this.beforeScript : this.functions
      this.$emit('action-even', this.dataTemplate.showType, command, position, selection, data, index, button)
      const buttonType = button.button_type || button.key
      this.action = buttonType
      // 前置事件
      beforeScript(command, position, selection, data, () => {
        this.readonly = false
        switch (buttonType) {
          case 'search':// 查询
            ActionUtils.setFirstPagination(this.pagination)
            this.search()
            break
          case 'resetSearch': // 重置
            this.resetSearchForm()
            ActionUtils.setFirstPagination(this.pagination)
            this.search()
            break
          case 'add':// 添加
            this.handleEdit(null, command, position, selection, data, button)
            break
          case 'edit':// 编辑
          case 'detail':// 明细
          case 'customDetail': // 自定义明细
            ActionUtils.selectedRecord(selection).then((id) => {
              this.handleEdit(id, command, position, selection, data, button)
            }).catch(() => { })
            break
          case 'logicDeleted':// 逻辑删除
            ActionUtils.removeRecord(selection, '此操作将逻辑删除该数据, 是否确定?').then((ids) => {
              this.handleLogicDeleted(ids, command, position, selection, data)
            }).catch(() => { })
            break
          case 'remove':// 删除
            ActionUtils.removeRecord(selection).then((ids) => {
              this.handleRemove(ids, command, position, selection, data)
            }).catch(() => { })
            break
          case 'sefStartFlow':// 启动自定义流程
            ActionUtils.selectedMultiRecord(selection).then((ids) => {
              if (button.deflow) {
                this.$confirm('确定启动流程吗？', '消息', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.handleStartFlowFromList(ids, button.deflow, this.getFormKey())
                }).catch(() => {})
              } else {
                this.dialogVisible = true
                this.dialogValue = {}
                this.sefStartFlowId = ids
              }
            }).catch(() => { })
            break
          case 'custom':// 自定义按钮
            if (this.$utils.isNotEmpty(button['formKey'])) {
              ActionUtils.selectedRecord(selection, false).then((id) => {
                this.handleEdit(id, command, position, selection, data, button)
              }).catch(() => { })
            }
            break
          case 'print':// 打印
            ActionUtils.selectedRecord(selection).then((id) => {
              this.handlePrint(id)
            }).catch(() => { })
            break
          case 'import':// 导入
            this.importColumnsVisible = true
            break
          case 'exportSelected':// 导出选中
            ActionUtils.selectedMultiRecord(selection).then((ids) => {
              this.selecteds = ids
              this.exportActions(buttonType, ids)
            }).catch(() => { })
            break
          case 'exportAll':// 导出所有
          case 'exportCurPage':// 导出当前页
          case 'exportQuery':// 根据查询结果导出
            this.exportActions(buttonType)
            break
          default:
            break
        }
      })
    },
    exportActions(buttonType, ids, exportColumns) {
      const { template } = this
      if (this.$utils.isNotEmpty(template.export_columns)) {
        if (template.export_columns.select_field === 'Y') {
          this.exportColumnsVisible = true
          // todo
        } else {
          this.getResponseData(buttonType, ids)
        }
      } else {
        this.getResponseData(buttonType, ids)
      }
    },
    getResponseData(buttonType, ids, exportColumns) {
      const { template, dataTemplate, fields, pagination, sorts } = this
      const params = {}
      let response_data = JSON.parse(JSON.stringify(dataTemplate))
      if (this.$utils.isEmpty(template.export_columns)) {
        const arr = dataTemplate.datasets.filter(d => d.parentId !== '0')
        const select_field = 'N'
        const export_type = 'db'
        const defaultfields = arr.map(a => {
          return {
            'name': a.name,
            'label': this.displayMap.get(a.name) || a.label,
            'fieldType': 'text',
            'rights': [
              {
                'type': 'all',
                'rightsId': '',
                'rightsName': ''
              }
            ]
          }
        })
        template.export_columns = {
          select_field: select_field,
          fields: defaultfields,
          export_type: export_type
        }
      } else {
        const indexs = []
        let pass = false
        template.export_columns.fields.forEach(f => {
          const index = f.rights.findIndex(e => e.type === 'none')
          indexs.push(index)
        })
        indexs.forEach(i => {
          if (i !== 0) {
            pass = true
            return false
          }
        })
        if (!pass) {
          this.$message({
            message: '没有字段可导出！',
            type: 'warning'
          })
          return
        }
      }
      if (this.$utils.isEmpty(this.listData)) {
        this.$message({
          message: '没有列表数据可导出！',
          type: 'warning'
        })
        return
      }
      response_data = Object.assign(response_data, template)
      const fieldsArr = []
      for (var f in fields) {
        fieldsArr.push(fields[f])
      }

      response_data.fields = fieldsArr

      params.action = buttonType

      params['response_data'] = JSON.stringify(response_data)

      /*
      if (this.$utils.isNotEmpty(exportColumns)) {
        const export_columns = {
          export_type: template.export_columns.export_type,
          fields: exportColumns,
          select_field: template.export_columns.select_field
        }
        params.export_columns = JSON.stringify(export_columns)
      }*/
      let tmpExportColumns = []
      if (this.$utils.isNotEmpty(exportColumns)) {
        tmpExportColumns = exportColumns
      } else {
        tmpExportColumns = template.export_columns.fields
      }
      const tmpExpColumns = tmpExportColumns.map(a => {
        return {
          'name': a.name,
          'label': this.displayMap.get(a.name) || a.label,
          'fieldType': 'text',
          'rights': a.rights
        }
      })
      const export_columns = {
        export_type: template.export_columns.export_type || 'db',
        fields: tmpExpColumns,
        select_field: template.export_columns.select_field || 'N'
      }
      params.export_columns = JSON.stringify(export_columns)

      let saveData

      if (buttonType === 'exportAll') {
        saveData = ActionUtils.formatParams(params, pagination, sorts)
      } else if (buttonType === 'exportSelected') {
        params.ids = ids
        saveData = ActionUtils.formatParams(params, {}, sorts)
      } else if (buttonType === 'exportCurPage') {
        saveData = ActionUtils.formatParams(params, pagination, sorts)
      } else if (buttonType === 'exportQuery') {
        saveData = ActionUtils.formatParams(
          Object.assign(this.buildFormParams() || {}, params),
          pagination,
          sorts)
      }

      checkExportData(saveData).then(res => {
        this.handleExportData(saveData)
      }).catch(err => (
        console.error(err)
      ))
    },
    handleExportData(saveData) {
      exportData(saveData).then(response => {
        if (!response) {
          return
        }
        ActionUtils.exportFile(
          response.data,
          this.dataTemplate.name + '_' + fecha.formatDate('yyyyMMddHHmmss') + '.xls'
        )
      })
    },

    callbackExtFields(data) {
      const { action, selecteds } = this
      this.getResponseData(action, selecteds, data)
    },
    handleStartFlowFromList(id, defKey, formKey) {
      this.dialogVisible = false // 后端未作校验，前端做提前关闭处理 BUG-4900,后端完善后在还原原先代码。
      startFlowFromList({
        ids: id,
        defKey: defKey,
        formKey: formKey
      }).then(response => {
        this.$message({
          message: '流程启动成功！',
          type: 'success'
        })
        // this.dialogVisible = false
        this.search()
      }).catch(() => {
        // this.dialogVisible = false
      })
    },
    handleDialogActionEvent(key, data) {
      if (key === 'clean') {
        this.dialogValue = {}
      }
      if (key === 'confirm') {
        this.handleStartFlowFromList(this.sefStartFlowId, data ? data.defKey : '', this.getFormKey())
      }
    },
    getFormKey() {
      return this.dataTemplate.attrs ? this.dataTemplate.attrs.form_key || '' : ''
    },
    getDetailFormKey() {
      return this.dataTemplate.attrs ? this.dataTemplate.attrs.detail_form_key || '' : ''
    },
    getPrintTemplateId() {
      return this.dataTemplate.attrs ? this.dataTemplate.attrs.print_id || '' : ''
    },
    initParameter() {
      this.hasInitParameter = false
      this.formKey = this.getFormKey()
      this.detailFormKey = this.getDetailFormKey()
      // 打印模版
      this.printTemplateId = this.getPrintTemplateId()
      // 管理主题
      this.manageEffect = this.template.attrs ? this.$utils.toBoolean(this.template.attrs.manage_effect) : false

      this.selectionRow = this.template.attrs ? this.$utils.toBoolean(this.template.attrs.selectionRow, true) : true

      const functionButtons = this.template.buttons ? this.template.buttons.function_buttons || [] : []
      // 工具栏
      const toolbarButtons = []
      // 管理列
      const manageButtons = []
      // 管理列按钮数量
      const buttonNumber = this.template.attrs ? parseInt(this.template.attrs.button_number) : 'all'
      // 管理列宽度
      const rowHandleWidth = this.template.attrs ? this.template.attrs.row_handle_width : null

      // 管理列按钮图标
      const rowHandleIcon = this.template.attrs ? this.$utils.toBoolean(this.template.attrs.row_handle_show_icon, true) : true

      // 查询按钮
      const searchButtons = []

      // 功能按钮
      functionButtons.forEach((rf, i) => {
        const btn = this.buildButton(rf, i)

        // 查询列默认是顶部
        if (hasSearchPermission(rf.button_type) && !rf.position) {
          rf.position = 'toolbar'
        }
        // if (rf.button_type === 'search') { isHasSearch = true }
        // 顶部按钮
        if (hasButton(rf.button_type, 'toolbar', rf.position)) {
          btn.position = 'toolbar'
          if (this.preview || this.dataTemplate.type === 'dialog') {
            btn.accessControl = false
          }
          toolbarButtons.push(btn)
        }
        // // 查询按钮
        // if (hasButton(rf.button_type, 'search', rf.position)) {
        //   this.response_search_buttons.add(this.getButtonModel(rf))
        // }
        // 查询按钮
        if (hasButton(rf.button_type, 'search', rf.position)) {
          btn.position = 'search'
          if (this.preview || this.dataTemplate.type === 'dialog') {
            btn.accessControl = false
          }
          searchButtons.push(btn)
        }

        // 管理列按钮
        if (hasButton(rf.button_type, 'manage', rf.position)) {
          btn.position = 'manage'
          if (this.preview || this.dataTemplate.type === 'dialog') {
            btn.accessControl = false
          }
          manageButtons.push(btn)
        }
      })

      let rowHandle = null

      if (this.$utils.isNotEmpty(manageButtons)) {
        rowHandle = {
          effect: this.manageEffect ? 'display' : 'default',
          actions: manageButtons
        }
        if (typeof buttonNumber === 'number') {
          rowHandle.buttonNumber = buttonNumber
        }
        if (rowHandleWidth) {
          rowHandle.width = rowHandleWidth
        }
        if (!rowHandleIcon) {
          rowHandle.showIcon = rowHandleIcon
        }
      }

      // 查询字段
      const searchForms = []

      // TODO:查询字段组合字段整理
      this.setQueryColumns(this.template.query_columns || [], searchForms)

      // 显示字段
      const columns = []
      this.setDisplayColumns(this.template.display_columns || [], columns)
      // 类型全为隐藏域时屏蔽查询表单条件得插槽按钮
      const hasSearchToolbars = searchForms.findIndex(s => s.fieldType !== 'hidden' || !s.fieldType) !== -1

      this.listConfig = {
        hasToolbar: toolbarButtons && toolbarButtons.length > 0,
        toolbars: toolbarButtons,
        searchToolbars: hasSearchToolbars ? searchButtons : [],
        columns: columns,
        rowHandle: rowHandle,
        searchForm: searchForms.length > 0 ? {
          forms: searchForms
        } : null
      }

      // 分页
      this.showPagination = this.template.attrs ? this.template.attrs.need_page === 'Y' : true
      this.pagination.limit = this.template.attrs ? parseInt(this.template.attrs.page_size, 10) || 20 : 20

      // 是否显示字段
      this.displayField = this.template.attrs ? this.$utils.toBoolean(this.template.attrs.display_field) : false

      this.indexRow = this.template.attrs ? this.template.attrs.indexRow || false : false
      this.editButtons = this.template.buttons ? this.template.buttons.edit_buttons || [] : []
      setTimeout(() => {
        this.hasInitParameter = true
      }, 5)
    },
    setQueryColumns(queryColumns, columns) {
      queryColumns.forEach(column => {
        const field = this.convertField(column)
        if (field.common === 'N') return
        columns.push(this.buildSearchForm(field))
      })
      return columns
    },
    /**
     * 显示字段
     */
    setDisplayColumns(displayColumns, columns) {
      displayColumns.forEach(col => {
        const field = this.convertField(col)
        const column = this.buildDisplayColumn(field)
        column.sortBy = col.prop
        columns.push(column)
      })

      if (this.$utils.isEmpty(this.origDisplayColumns)) return
      var displayColumnMap = {}
      const { origDisplayColumns } = this
      if (this.$utils.isNotEmpty(displayColumns)) {
        displayColumns.forEach(column => {
          displayColumnMap[column.name] = true
        })
      }
      origDisplayColumns.forEach(column => {
        var name = column.name
        var model = {
          name: name,
          label: column.label,
          sortable: column.sortable ? 'custom' : false,
          align: column.align ? column.align : 'left',
          showOverflowTooltip: column.showOverflowTooltip ? column.showOverflowTooltip : false
        }
        var noRightStyle = column['noRightStyle']
        if (!displayColumnMap[name] && this.$utils.isNotEmpty(noRightStyle)) {
          model.formatter = function(val, opts, rowData) {
            return noRightStyle === 'asterisk' ? '***' : ''
          }
          columns.push(model)
          return true
        }
        if (!displayColumnMap[name] && this.$utils.isNotEmpty(noRightStyle) && column['rights']) {
          model.formatter = function(val, opts, rowData) {
            return ''
          }
          columns.push(model)
          return true
        }
      })
      return columns
    },

    /**
   * 判断参数是否是其中之一
   */
    oneOf: function(obj, validList, key, key1) {
      for (let i = 0; i < validList.length; i++) {
        if (obj[key] === validList[i][key1]) {
          return true
        }
      }
      return false
    },
    /**
     * 构建按钮
     */
    buildButton(rf, i) {
      const defaultButton = ButtonsConstants[rf.button_type] || {}
      let key = rf.button_type
      let mode
      let rightIcon
      let menus
      if (key === 'custom' || key === 'sefStartFlow' || key === 'customDetail') {
        key = rf.code ? rf.code : key + i
      }
      if (rf.button_type === 'export') {
        if (this.preview) {
          ButtonsConstants[rf.button_type].menus.forEach(m => {
            m.accessControl = false
          })
        }
        mode = 'dropdown'
        rightIcon = true
        menus = ButtonsConstants[rf.button_type].menus
      }
      let disabled = false
      let hidden = false
      if (this.hasButtonAction(key, rf)) {
        hidden = (row, data) => {
          // return JTemplate._onLoadActions(this, key, rf, 'hidden', row, data)
          return eventsUtil._eventCall(this.eventsUtil, 'onLoadActions', this, key, rf, 'hidden', row, data)
        }
        disabled = (row, data) => {
          // return JTemplate._onLoadActions(this, key, rf, 'disabled', row, data)
          return eventsUtil._eventCall(this.eventsUtil, 'onLoadActions', this, key, rf, 'disabled', row, data)
        }
      }
      return {
        '$index': i,
        key: key,
        button_type: rf.button_type,
        code: rf.code,
        label: rf.label || defaultButton.label,
        icon: 'ibps-icon-' + (rf.icon ? rf.icon : defaultButton.icon),
        type: rf.style || defaultButton.type,
        deflow: rf.deflow || null,
        formKey: rf.formKey || null,
        detailFormKey: rf.detailFormKey || null,
        mode: mode,
        rightIcon: rightIcon,
        menus: menus,
        disabled: disabled,
        hidden: hidden
      }
    },
    // 自定义格式数据事件
    hasButtonAction: function(key, button) {
    // const buttonActionResult = JTemplate._onLoadActions(this, key, button)
      const buttonActionResult = eventsUtil._eventCall(this.eventsUtil, 'onLoadActions', this, key, button)
      if (typeof (buttonActionResult) !== 'undefined' && buttonActionResult) {
        return true
      }
      return false
    },
    /**
     * 转换字段
     */
    convertField: function(column) {
      if (!column.name) return column
      const field = this.fields[column.name.toLowerCase()] || null
      const same = !((column['same'] && column['same'] === 'N'))
      let fieldType = same ? (field ? (field['field_type'] || 'text') : 'text') : column['field_type'] || 'text'
      const fieldOptions = same ? (field ? (field['field_options'] || {}) : {}) : (column['field_options'] || {})
      const dataType = field ? field['type'] || 'varchar' : 'varchar'
      // 字段是日期类型
      if ((dataType === 'date' || dataType === 'timestamp' || dataType === 'datetime' || dataType === 'currentTime' || dataType === 'currentDate') &&
       (fieldType !== 'datePicker' && fieldType !== 'dateRange')) {
        fieldType = !same ? fieldType : 'datePicker'
      }
      if (fieldType === 'datePicker' || fieldType === 'dateRange') {
        const datefmtType = fieldOptions['datefmt_type']
        if (datefmtType !== 'custom') {
          fieldOptions['datefmt'] = this.getDatefmt(fieldOptions)
        }
      }

      // 处理当前用户，当前组织控件
      if (fieldType === 'currentUser' || fieldType === 'currentOrg') {
        fieldType = 'selector'
      }

      column['field_type'] = fieldType
      column['field_options'] = fieldOptions
      column['dataType'] = dataType
      return column
    },
    getDatefmt(fieldOptions) {
      if (fieldOptions['datefmt_type'] && fieldOptions['datefmt_type'] !== 'custom') {
        return FormOptions.t.DATE_FORMATS[fieldOptions['datefmt_type']] || FormOptions.t.DATE_FORMATS['date']
      }
      return fieldOptions['datefmt'] || FormOptions.t.DATE_FORMATS['date']
    },
    buildOptions(options = []) {
      const rtn = []
      options.forEach(option => {
        rtn.push({
          value: option.val,
          label: option.label
        })
      })
      return rtn
    },
    buildSwitchOptions(fieldOptions) {
      return FormUtils.getSwitchOptions(fieldOptions, 'value')
    },
    buildJointFileds(dataTitle) {
      const d = dataTitle.split(/(\$[0-9a-zA-Z._|]+#[0-9A-Fa-f]*)/g)
      const rtn = []
      d.forEach((n) => {
        let a = n
        if (/^\$(_widget_)/.test(n)) {
          // 对字段进行处理
          const f = n.replace('$_widget_', '').split('#')
          a = f[0]
        }
        rtn.push(a)
      })
      return rtn
    },
    /**
     * 构建查询条件
     * 数据集为第三方服务时,根据field.fieldsTypes获取查询条件
     */
    buildSearchForm(field) {
      let querySuffix
      const datasetType = this.dataTemplate.datasetType
      const dataTypes = ['date', 'varchar', 'number']
      if (dataTypes.includes(field.dataType) && field.queryCondition && this.$utils.isNotEmpty(field.queryCondition)) {
        const dataTypesSuffixs = datasetType === 'thirdparty' ? this.queryConditionOptions[field.fieldsTypes || 'varchar'] : this.queryConditionOptions[field.dataType]
        const suffixData = dataTypesSuffixs.filter(d => d.value === field.queryCondition)
        querySuffix = this.$utils.isNotEmpty(suffixData) ? suffixData[0].suffix : 's'
      }
      // 1日期/数字 条件为范围时得特殊处理。
      // 2控件类型不一致时选的控件类型传递后缀是否以数据格式类型得对应条件后缀为准，还是单独保持原样。
      // 3直接添加查询字段时得默认拼接后缀,保留目前写死得后缀将其转化在内部作为直接添加而不进入查询字段时得默认条件后缀。

      let searchColumn = {
        label: field.label,
        placeholder: field.placeholder
      }
      // 控件类型
      const fieldType = field['field_type']

      if (field.addType === 'combination') {
        const queryFileds = this.buildJointFileds(field.combinationKeyField).filter(f => f !== '')

        const combinationQueryFileds = []
        const queryCondition = field.queryCondition || 'include'
        queryFileds.forEach(name => {
          const column = this.fields[name.toLowerCase()] || { }
          const type = column.type || 'varchar'
          const dataType = this.dataTypes[type] || {}
          if (type === 'date') {
            combinationQueryFileds.push({
              queryfields: 'Q^' + name + dataType.start
            }, {
              queryfields: 'Q^' + name + dataType.end
            })
          } else {
            const fieldSuffix = dataType[queryCondition] ? dataType[queryCondition] : 'SL'
            combinationQueryFileds.push({ queryfields: 'Q^' + name + fieldSuffix })
          }
        })
        const prop = field.combinationName
        this.combinationQueryFileds[prop] = {
          prop: prop,
          conditionType: this.conditionTypeOptions[queryCondition].conditionType,
          queryFileds: combinationQueryFileds
        }
        // ---------------------------------------------------------
        searchColumn = Object.assign(searchColumn, {
          prop: prop,
          modelValue: prop,
          fieldType: fieldType
        })
      } else {
        const fieldOptions = field['field_options']
        if (fieldType === 'hidden') {
          if (this.$utils.isEmpty(querySuffix)) {
            querySuffix = 'SL'
          }
          searchColumn = Object.assign(searchColumn, {
            prop: `Q^${field.name}^${querySuffix}`,
            modelValue: `Q^${field.name}^${querySuffix}`,
            fieldType: fieldType
          })
        } else if (fieldType === 'numberRange') { // 数字范围
          if (this.$utils.isEmpty(querySuffix)) {
            if (field.dataType === 'number') {
              querySuffix = ['DBL', 'DBG']
            } else {
              const dataTypesSuffixs = this.queryConditionOptions[field.dataType]
              querySuffix = [dataTypesSuffixs[0]['suffix'], dataTypesSuffixs[0]['suffix']]
            }
          }
          searchColumn = Object.assign(searchColumn, {
            prop: [`Q^${field.name}^${querySuffix[0]}`, `Q^${field.name}^${querySuffix[1]}`],
            modelValue: `Q^${field.name}^${querySuffix[0]}`,
            fieldType: 'numberRange'
          })
        } else if (fieldType === 'radio' || fieldType === 'checkbox' || fieldType === 'select') {
          if (this.$utils.isEmpty(querySuffix)) {
            querySuffix = fieldType !== 'checkbox' && !fieldOptions.multiple ? 'S' : 'SL'
          }
          const prop = fieldOptions.multiple ? [`Q^${field.name}^${querySuffix}`, `Q^${field.name}^${querySuffix}`] : `Q^${field.name}^${querySuffix}`
          searchColumn = Object.assign(searchColumn, {
            prop: prop,
            modelValue: `Q^${field.name}^${querySuffix}`,
            fieldType: 'select',
            multiple: fieldOptions.multiple || fieldType === 'checkbox' || false,
            options: this.buildOptions(fieldOptions && fieldOptions.options ? fieldOptions.options : [])
          })
        } else if (fieldType === 'switch') {
          if (this.$utils.isEmpty(querySuffix)) {
            querySuffix = 'S'
          }
          const prop = `Q^${field.name}^${querySuffix}`
          searchColumn = Object.assign(searchColumn, {
            prop: prop,
            modelValue: prop,
            fieldType: 'select',
            options: this.buildSwitchOptions(fieldOptions)
          })
        } else if (fieldType === 'date') {
          if (this.$utils.isEmpty(querySuffix)) {
            querySuffix = 'D'
          }
          const datefmt = fieldOptions.datefmt || ''
          const prop = `Q^${field.name}^${querySuffix}^${datefmt}`
          searchColumn = Object.assign(searchColumn, {
            prop: prop,
            modelValue: prop,
            fieldType: 'date',
            dateType: fieldOptions.datefmt_type ? fieldOptions.datefmt_type : 'date'
          })
        } else if (fieldType === 'datePicker' || fieldType.toLowerCase() === 'daterange') {
          const suffix = typeof querySuffix === 'object' && this.$utils.isNotEmpty(querySuffix) ? querySuffix : ['DL', 'DG']
          const options = this.filterPickerOptions(field)
          const pickerOptions = options.scopeData
          const value = options.operationScriptDate
          const datefmt = fieldOptions.datefmt || ''
          const dateDealFmt = DateFormatUtil.dealFmt(fieldOptions.datefmt)
          const prop = [`Q^${field.name}^${suffix[0]}^${datefmt}`, `Q^${field.name}^${suffix[1]}^${datefmt}`]
          searchColumn = Object.assign(searchColumn, {
            prop: prop,
            modelValue: `Q^${field.name}^${querySuffix}`,
            fieldType: fieldType === 'datePicker' ? dateDealFmt.dateType : dateDealFmt.dateType + 'range',
            field_options: fieldOptions,
            pickerOptions: pickerOptions || {},
            value: value || []
          })
        } else if (fieldType === 'dictionary') {
          if (this.$utils.isEmpty(querySuffix)) {
            querySuffix = fieldOptions.multiple ? 'SL' : 'S'
          }
          const prop = `Q^${field.name}^${querySuffix}`
          searchColumn = Object.assign(searchColumn, {
            prop: prop,
            fieldType: fieldType,
            modelValue: prop,
            placeholder: fieldOptions.placeholder || '请选择',
            multiple: fieldOptions.multiple || false,
            field_options: fieldOptions
          })
        } else if (fieldType === 'selector') {
          if (this.$utils.isEmpty(querySuffix)) {
            querySuffix = 'SL'
          }
          const prop = `Q^${field.name}^${querySuffix}`
          searchColumn = Object.assign(searchColumn, {
            prop: prop,
            fieldType: fieldType,
            modelValue: prop,
            placeholder: fieldOptions.placeholder || '请选择',
            selectorType: fieldOptions.selector_type || 'user',
            field_options: fieldOptions
          })
        } else if (fieldType === 'customDialog') {
          if (this.$utils.isEmpty(querySuffix)) {
            querySuffix = 'S'
          }
          const prop = `Q^${field.name}^${querySuffix}`
          searchColumn = Object.assign(searchColumn, {
            prop: prop,
            modelValue: prop,
            fieldType: fieldType,
            field_options: fieldOptions
          })
        } else if (fieldType === 'linkdata') {
          if (this.$utils.isEmpty(querySuffix)) {
            querySuffix = 'S'
          }
          const prop = `Q^${field.name}^${querySuffix}`
          searchColumn = Object.assign(searchColumn, {
            prop: prop,
            modelValue: prop,
            fieldType: fieldType,
            field_options: fieldOptions
          })
        } else if (fieldType === 'address') {
          if (this.$utils.isEmpty(querySuffix)) {
            querySuffix = 'SL'
          }
          const prop = `Q^${field.name}^${querySuffix}`
          searchColumn = Object.assign(searchColumn, {
            prop: prop,
            modelValue: prop,
            fieldType: fieldType,
            field_options: fieldOptions
          })
        } else {
          if (this.$utils.isEmpty(querySuffix)) {
            querySuffix = 'SL'
          }
          searchColumn = Object.assign(searchColumn, {
            prop: `Q^${field.name}^${querySuffix}`,
            modelValue: `Q^${field.name}^${querySuffix}`
          })
        }
      }
      return searchColumn
    },
    buildJoinFileds(text) {
      if (this.$utils.isEmpty(text)) return []
      const d = text.split(new RegExp(FormOptions.t.COMMON_REG.VALIDATOR, 'g'))
      const rtn = []
      d.forEach(n => {
        let a = n
        if (/^\$(_widget_)/.test(n)) { // 对字段进行处理
          const f = n.replace('$_widget_', '').split('#')
          a = f[0]
        }
        rtn.push(a)
      })
      return rtn
    },

    buildDisplayColumn(field) {
      let displayColumn
      let columClassName = ''
      const currentOptions = {}
      let columnsFieldColor = ''
      if (field.fieldColor) {
        if (field.fieldColor !== 'custom') {
          columnsFieldColor = field.fieldColor
        } else {
          columnsFieldColor = field.customfieldColor
        }
      }
      if (field.columnsBackGround) {
        const num = Math.ceil(Math.random() * 100000)
        if (field.columnsBackGround !== 'custom') {
          columClassName = field.columnsBackGround + '-row' + ` ${field.columnsBackGround + num}`
          this.createElementStyle(`.${field.columnsBackGround + num}{color:${columnsFieldColor}}`)
        } else {
          const columnsCustomBackGround = field.columnsCustomBackGround
          columClassName = 'columns-' + num + '-row'
          this.createElementStyle(`.${columClassName}{background: ${columnsCustomBackGround};color:${columnsFieldColor}}`)
        }
      }
      // 条件配置
      if (!field.addType) {
        displayColumn = {
          prop: field.name,
          label: field.label,
          align: field.align,
          width: field.width,
          hidden: field['field_type'] === 'hidden',
          showOverflowTooltip: field.showOverflowTooltip ? field.showOverflowTooltip : false
        }
      } else {
        // 分解出拼接几个字段
        const jointFileds = this.buildJoinFileds(field.combinationKeyField).filter(f => f !== '')
        displayColumn = {
          label: field.label,
          slotName: 'combinationFields',
          field: field,
          props: field.combinationName,
          fileds: jointFileds,
          showOverflowTooltip: field.showOverflowTooltip ? field.showOverflowTooltip : false
        }
      }
      // 当前列得过滤条件
      if (field.startCellBackGround === 'Y') {
        currentOptions.satisfyConditionBackGround = field.satisfyConditionBackGround
        currentOptions.satisfyCondition = field.satisfyCondition
        currentOptions.satisfyConditionValue = field.satisfyConditionValue
        displayColumn.currentOptions = currentOptions
      }

      // 当前列得颜色设置
      if (columClassName !== '') {
        displayColumn.columClassName = columClassName
      }

      if (field.type !== 'clob') {
        displayColumn.sortable = this.$utils.toBoolean(field.sortable, true) ? 'custom' : false
      }
      // TODO:没有权限处理**
      // noRightStyle =  field["noRightStyle"];

      const customFormatterResult = this.hasCustomFormatter(field.name)
      if (customFormatterResult) {
        displayColumn.slotName = 'customFormatter'
        displayColumn.field = field
        return displayColumn
      }
      // 控件类型
      const fieldType = field['field_type']
      const fieldOptions = field['field_options']
      if (fieldType === 'radio' || fieldType === 'checkbox' || fieldType === 'select') {
        displayColumn.options = this.buildOptions(fieldOptions && fieldOptions.options ? fieldOptions.options : [])
        displayColumn.dataType = fieldType === 'checkbox' || (fieldType === 'select' && fieldOptions.multiple) ? 'stringArray' : null
      } else if (fieldType === 'switch') {
        displayColumn.options = this.buildSwitchOptions(fieldOptions)
      } else if (fieldType === 'datePicker' || fieldType === 'daterange' || fieldType === 'dateRange') {
        const datefmt = fieldOptions['datefmt'] ? fieldOptions['datefmt'] : 'yyyy-MM-dd HH:mm:ss'
        displayColumn.dateFormat = datefmt
        displayColumn.origDateFormat = fieldOptions['datefmt_type'] !== 'custom' ? datefmt : 'yyyy-MM-dd HH:mm:ss'
      } else if (fieldType === 'number' ||
          fieldType === 'editor' ||
          fieldType === 'textarea' ||
          fieldType === 'attachment' ||
          fieldType === 'dictionary' ||
          fieldType === 'selector' ||
          fieldType === 'customDialog' ||
          fieldType === 'linkdata' ||
          fieldType === 'address' ||
          fieldType === 'image') {
        displayColumn.slotName = fieldType
        displayColumn.field_options = fieldOptions
      }
      return displayColumn
    },

    initOrigDisplayColumns: function() {
      const origDisplayColumns = this.template['orig_display_columns']
      if (this.$utils.isEmpty(origDisplayColumns)) {
        this.origDisplayColumns = this.template['display_columns']
        return
      }
      origDisplayColumns.forEach(column => {
        this.origDisplayColumns.push(this.convertDisplayColumnData(column))
      })
    },
    convertDisplayColumnData: function(column) {
      column = this.convertField(column)
      column['sortable'] = column['data_type'] === 'clob' ? false : (this.$utils.toBoolean(column.sortable, true) ? 'custom' : false)

      return column
    },

    // 日期格式处理
    filterPickerOptions(item, params) {
      const data = {}
      const timePickerOptions = {}
      const picker = this
      let operationScriptDate = []
      timePickerOptions.shortcuts = undefined
      const hasScope = item.field_options.hasScope === 'Y'
      if (!hasScope) {
        return data
      }
      const pickerOptions = JSON.parse(JSON.stringify(item.field_options.pickerOptions))
      timePickerOptions.shortcuts = []
      for (var p = 0; p < pickerOptions.length; p++) {
        const option = pickerOptions[p]
        let script = option.script
        if (!option.script) {
          const data = this.dateScopeOptions.find(d => d.value === pickerOptions[p].value)
          if (data) script = data.script
        }
        if (item.field_options.defaultValue === option.value) {
          operationScriptDate = new Function('picker', script)(picker)
        }
        timePickerOptions.shortcuts.push({
          text: option.text,
          value: option.value,
          onClick(picker) {
            picker.$emit('pick', new Function('picker', script)(picker))
          }
        })
      }
      data.scopeData = timePickerOptions
      const arr = []
      if (this.$utils.isNotEmpty(operationScriptDate)) {
        operationScriptDate.forEach(i => {
          var resDate = i.getFullYear() + '-' + (i.getMonth() + 1) + '-' + i.getDate()
          arr.push(resDate)
        })
      }
      data.operationScriptDate = arr
      return data
    },
    // ******************************************************************************

    // 自定义格式数据事件
    hasCustomFormatter: function(name) {
      // const customFormatterResult = JTemplate._customFormatter(this, name)
      const customFormatterResult = eventsUtil._eventCall(this.eventsUtil, 'customFormatter', this, name)
      if (typeof (customFormatterResult) !== 'undefined' && customFormatterResult) {
        return true
      }
      return false
    },
    customFormatter(name, value, rowData, column) {
      // return JTemplate._customFormatter(this, name, value, rowData, column)
      return eventsUtil._eventCall(this.eventsUtil, 'customFormatter', this, name, value, rowData, column)
    },
    hasDynamicParams(fieldOptions) {
      return FormUtils.hasLinkDynamicParams(fieldOptions)
    },
    getLinkDynamicParams(fieldOptions, data) {
      return FormUtils.getListLinkDynamicParams(fieldOptions, data, this.formFieldMap)
    },
    getLinkValueKey(fieldOptions, data) {
      return FormUtils.getLinkValueKey(fieldOptions, data)
    },
    getLinkLabelType(fieldOptions, data) {
      return FormUtils.getLinkLabelType(fieldOptions, data)
    },
    getLinkLabelKey(fieldOptions, data) {
      return FormUtils.getLinkLabelKey(fieldOptions, data)
    },
    getLinkStructure(fieldOptions, data) {
      return FormUtils.getLinkStructure(fieldOptions)
    },
    getLinkConfig(fieldOptions, data) {
      return FormUtils.getLinkConfig(fieldOptions)
    },
    getStreet(value) {
      if (this.$utils.isNotEmpty(value)) {
        const data = this.$utils.parseJSON(value)
        return data['street'] || ''
      }
      return ''
    },
    getAddressValue(value, fieldOptions) {
      return FormUtils.getAddressControlValue(value, fieldOptions)
    },
    getAddressTopVal(fieldOptions) {
      return FormUtils.getAddressTopVal(fieldOptions)
    },
    /**
     * 添加、编辑表单
     */
    handleEdit(pkValue, code = 'edit', position, selection, data, button) {
      this.formKey = this.getFormKey()
      const action = this.action
      this.readonly = action === 'detail'

      if (action === 'detail' || action === 'customDetail') {
        this.readonly = true
        this.formKey = action === 'customDetail' ? this.getCustomDetailFormKey(button) : this.getDetailFormKey()
        if (this.$utils.isEmpty(this.formKey)) {
          this.formKey = this.getFormKey()
          if (this.$utils.isEmpty(this.formKey)) {
            ActionUtils.warning('请绑定表单或详情表单')
            return
          }
        }
        this.buttonPriority = 'button'
      } else if (action === 'custom') {
        this.formKey = button['formKey']
        this.buttonPriority = 'button'
      } else {
        if (this.$utils.isEmpty(this.formKey)) {
          ActionUtils.warning('请绑定表单')
          return
        }
        this.buttonPriority = 'outside'
      }

      if (this.relatedTreeFields && this.$utils.isNotEmpty(this.defaultData)) {
        const selection = this.defaultData[this.relatedTreeFields]
        this.defaultFormData = action === 'add' ? this.getDefaultFormData(selection) : null
      } else {
        this.defaultFormData = {}
      }

      const editToolbars = []
      this.editButtons.forEach((rf, i) => {
        const btn = this.buildButton(rf, i)
        const buttonType = action === 'add' ? 'edit' : action
        // 编辑页顶部按钮
        if (hasButton(rf.button_type, buttonType, rf.position)) {
          if ((!this.readonly) || (this.readonly && (rf.enabledDetail === 'Y' || (!rf.enabledDetail && rf.button_type === 'close')))) {
            editToolbars.push(btn)
          }
        }
      })
      this.editToolbars = editToolbars
      this.pkValue = pkValue || ''

      this.afterScript(code, position, pkValue, data, () => {
        this.dialogFormVisible = true
      })
    },
    getCustomDetailFormKey(button, key = 'detailFormKey') {
      if (this.$utils.isNotEmpty(button[key])) {
        return button[key]
      } else {
        return this.getDetailFormKey()
      }
    },
    /**
     * 删除表单
     */
    handleRemove(ids, action, position, selection, data) {
      if (this.$utils.isEmpty(this.formKey)) {
        ActionUtils.warning('请绑定表单')
        return
      }
      removeFormData({
        formKey: this.formKey,
        ids: ids
      }).then(response => {
        this.afterScript(action, position, selection, data, () => {
          ActionUtils.removeSuccessMessage()
          this.search()
        })
      }).catch(() => {
      })
    },
    // 逻辑删除
    handleLogicDeleted(ids, action, position, selection, data) {
      const idArr = ids.split(',')
      logicRemove({
        formKey: this.formKey,
        ids: idArr
      }).then(response => {
        this.afterScript(action, position, selection, data, () => {
          ActionUtils.removeSuccessMessage()
          this.search()
        })
      }).catch(() => {})
    },
    handlePrint(ids) {
      if (this.$utils.isNotEmpty(this.printTemplateId)) {
        this.pkValue = ids
        // 打开打印模版页面
        this.formPrintTemplateDialogVisible = true
      }
    },
    handleTemplateDialogActionEvent() {
      // TODO:
    },
    getDefaultFormData(selection) {
      const parentIdField = this.fields[this.relatedListFields] || {}
      const pidKey = parentIdField ? parentIdField.field_name || this.relatedListFields : this.relatedListFields // 如果不是就按命名规律
      return {
        [pidKey]: selection
      }
    },
    // =================================处理脚本================================
    /**
     * 初始化脚本
     */
    initJTemplate() {
      const id = 'JTemplate'
      let script = document.getElementById(id)
      if (script) {
        script.parentNode.removeChild(script)
      }
      if (this.dataTemplate.attrs && this.dataTemplate.attrs.script) {
        const codeScript = this.dataTemplate.attrs.script
        script = document.createElement('script')
        script.type = 'text/javascript'
        script.id = id
        document.body.appendChild(script)
        try {
          script.appendChild(document.createTextNode(codeScript))
        } catch (ex) {
          console.error(ex)
          script.text = codeScript
        }
        document.body.appendChild(script)
      }
    },
    // 处理脚本
    hasScript() {
      return true
    },
    // 加载脚本
    loadScript() {
      if (!this.hasScript()) {
        return
      }
      // JTemplate._onLoad(this)
      eventsUtil._eventCall(this.eventsUtil, 'onLoad', this)
    },
    // 前置脚本
    beforeScript(action, position, selection, data, callback) {
      if (!this.hasScript()) {
        const flag = true
        callback(flag)
        return
      }
      eventsUtil._eventCall(this.eventsUtil, 'beforeSubmit', this, action, position, selection, data, callback)
    },
    // 后置脚本
    afterScript(action, position, selection, data, callback) {
      if (!this.hasScript()) {
        const flag = true
        callback(flag)
        return
      }
      // JTemplate._afterSubmit(this, action, position, selection, data, callback)
      eventsUtil._eventCall(this.eventsUtil, 'afterSubmit', this, action, position, selection, data, callback)
    }
  }
}
</script>
<style lang="scss">
 .ibps-data-template-list__preview{
    .ibps-toolbar .tools{
      padding-right: 40px !important;
    }
 }
 .template-list {
   .success-row{
     background:#67C23A;
   }
   .primary-row{
     background:#409EFF;
   }
   .info-row{
     background:#909399;
   }
   .warning-row{
     background:#E6A23C;
   }
   .danger-row{
     background:#F56C6C;
   }
   .default-row{
     background:transparent;
   }
 }
 .ibps-row-handle{
   .el-table__body{
     .el-table__row{
       td:last-child{
         padding: 0;
        .cell{
          display: flex;
          overflow-y: hidden;
          overflow-x: auto;
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE 10+ */
          width: 100%;
          padding: 0 10px;
          .ibps-actions{
            display: flex;
            justify-content: flex-end;
            a{
              span{
                display: block;
                min-width: 30px;
                margin-left: 2px;
                white-space: nowrap;
              }
            }
            .el-divider{
              margin-top: 7%;
            }
          }
        }
        .cell::-webkit-scrollbar{
          width: 1px;
          height: 3px;
        }
       }
     }
   }
 }
</style>
