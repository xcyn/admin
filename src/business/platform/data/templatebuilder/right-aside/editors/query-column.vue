<template>
  <el-form
    ref="form"
    :model="formData"
    :rules="rules"
    label-width="120px"
    size="mini"
    class="template-query-column"
    @submit.native.prevent
  >

    <el-form-item label="显示名称" prop="label">
      <el-input v-model="formData.label" v-pinyin="{vm:formData,name:'label',key:'combinationName'}" placeholder="显示名称" />
    </el-form-item>

    <el-form-item v-if="formData.addType==='combination'" label="关键字段标识" prop="combinationName">
      <el-input v-model="formData.combinationName" />
    </el-form-item>
    <el-form-item v-if="formData.addType==='combination'" class="combination-field" prop="combinationKeyField">
      <template slot="label" class="el-form-item__label">
        关键字段
        <el-tooltip
          class="item"
          effect="light"
          content="只能设置字符串！下拉数据仅展示支持的数据类型数据。"
          placement="bottom"
        >
          <ibps-icon name="info-circle" style="color:#dd5b44;" />
        </el-tooltip>
      </template>
      <el-select v-model="combinationKeyField" multiple placeholder="请选择" @change="value => conversionData('string',combinationKeyField)">
        <el-option
          v-for="item in columns"
          :key="item.value"
          :label="item.label"
          :value="'$_widget_'+item.name+'#'"
        />
      </el-select>
    </el-form-item>

    <template v-if="datasetType === 'thirdparty'">
      <el-form-item label="标识（name）" prop="name">
        <el-input v-model="formData.name" placeholder="标识（name）" />
      </el-form-item>
    </template>

    <template v-if="datasetType === 'thirdparty'">
      <el-form-item label="字段类型" prop="fieldsTypes">
        <el-select v-model="formData.fieldsTypes" placeholder="请选择" clearable @change="changeFieldsTypes">
          <el-option
            v-for="item in fieldsTypeOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </template>
    <el-form-item v-if="showQueryCondition||datasetType === 'thirdparty'" label="查询条件" :prop="formData.addType==='combination'?'queryCondition':null">
      <el-select v-model="formData.queryCondition" placeholder="请选择" clearable @change="changeQueryCondition">
        <el-option
          v-for="item in queryConditions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-alert
        v-if="!formData.addType"
        type="warning"
        :closable="false"
        style="height:50px;margin-top:5px;"
      >
        <template #default>
          控件类型为数字范围或者日期范围时，条件会固定，如要选其他条件请切换其他控件类型;<br>
          控件类型为多选时，请勿设置条件;
        </template>
      </el-alert>
    </el-form-item>
    <el-form-item label="占位符" prop="placeholder">
      <el-input v-model="formData.placeholder" placeholder="占位符" />
    </el-form-item>
    <el-form-item label="权限">
      <rights-selector v-model="formData.rights" @remove="removeRight" />
    </el-form-item>
    <!-- <el-form-item label="是否常用条件">
      <el-switch v-model="formData.common" active-value="Y" inactive-value="N" />
    </el-form-item> -->
    <el-form-item v-if="formData.addType!=='combination'" label="跟字段控件一致">
      <el-switch v-model="formData.same" active-value="Y" inactive-value="N" @change="changeSame" />
    </el-form-item>
    <!--控件类型-->
    <template v-if="formData.same === 'N'">
      <el-form-item label="控件类型">
        <el-select v-model="formData.field_type" @change="changeFieldType">
          <el-option
            v-for="item in queryFieldTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="formData.field_type === 'select' || formData.field_type === 'dictionary' ">
        <template slot="label">是否多选</template>
        <el-switch
          v-model="formData.field_options.multiple"
        />
      </el-form-item>
      <!-- 枚举值格式 -->
      <el-form-item v-if="formData.field_type === 'radio' ||formData.field_type === 'checkbox' ||formData.field_type === 'select'" label-width="0" prop="options">
        <field-options v-model="formData.field_options.options" />
      </el-form-item>
      <!-- 日期格式 -->
      <template v-else-if="formData.field_type === 'datePicker'||formData.field_type === 'dateRange'||formData.field_type === 'date'">
        <el-form-item label="日期格式" prop="datefmt_type">
          <el-select v-model="formData.field_options.datefmt_type" @change="changeDatefmtType">
            <el-option
              v-for="(item,index) in datefmtTypeOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-input
            v-if="formData.field_options.datefmt_type ==='custom'"
            v-model="formData.field_options.datefmt"
          />
        </el-form-item>
        <el-form-item v-if="formData.field_type === 'dateRange'&&formData.field_options.datefmt_type==='date'" label="启用范围" prop="hasScope">
          <el-switch v-model="formData.field_options.hasScope" active-value="Y" inactive-value="N" @change="changeDateScope" />
        </el-form-item>
        <el-form-item v-if="formData.field_options.hasScope === 'Y'&&formData.field_options.datefmt_type==='date'" label="日期范围" prop="pickerOptions">
          <el-dropdown v-if="init" @command="dropdownSetting">
            <el-button type="primary">
              范围设置<i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="d in dropdownItem" :key="d.value" :command="d.value" :disabled="d.disabled">{{ d.label }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <vuedraggable
            v-if="init"
            v-model="formData.field_options.pickerOptions"
            v-bind="draggableOptions"
            class="list-group"
            @sort="sortData"
            @start="isDragging = true"
            @end="()=>{isDragging= false}"
          >
            <div v-for="(column,i) in formData.field_options.pickerOptions" :key="column.value+''+i" class="list-group-item">
              <div class="actions-left">
                <el-tooltip content="设为默认值">
                  <el-radio ref="radios" v-model="defaultValue" :label="column.value" @click.native.prevent="handleDefaultValue(column.value)"><span>&nbsp;&nbsp;</span></el-radio>
                </el-tooltip>
                {{ column.text }}
              </div>
              <el-button-group class="actions">
                <el-button size="small" type="text" title="设置" icon="ibps-icon-cog" @click="settingColumn(i)" />
                <el-button size="small" type="text" title="删除" icon="el-icon-delete" @click="removeColumn(i)" />
                <el-button size="small" class="draggable" title="拖动排序" data-role="sort_choice" type="text" icon="ibps-icon-arrows" />
              </el-button-group>
            </div>
          </vuedraggable>
          <custom-time-scope :button-key="buttonKey" :data="formData.field_options.pickerOptions" :visible.sync="customTimeScopeVisible" :job-data-map="editData" @callback="getTimeScopeData" />
        </el-form-item>
      </template>

      <!-- 数据字典 -->
      <el-form-item v-else-if="formData.field_type === 'dictionary'" label="数据字典" prop="dictionary">
        <ibps-type-select
          v-model="formData.field_options.dictionary"
          category-key="DIC_TYPE"
          node-key="typeKey"
          clearable
        />
      </el-form-item>
      <!-- 选择器 -->
      <template v-else-if="formData.field_type === 'selector'" prop="selector_type">
        <el-form-item label="选择器类型">
          <el-select v-model="formData.field_options.selector_type">
            <el-option
              v-for="item in selectorTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="存储格式" prop="store">
          <el-select v-model="formData.field_options.store">
            <el-option
              v-for="item in selectorStoreOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </template>

      <!-- 自定义对话框 -->
      <template v-else-if="formData.field_type === 'customDialog'">
        <el-form-item>
          <template slot="label">自定义对话框</template>
          <ibps-data-template-selector2
            v-model="formData.field_options.dialog"
            type="dialog"
            placeholder="请选择自定义对话框"
          />
        </el-form-item>
        <el-form-item>
          <template slot="label">是否多选</template>
          <el-switch
            v-model="formData.field_options.multiple"
            active-value="Y"
            inactive-value="N"
          />
        </el-form-item>
        <el-form-item>
          <template slot="label">存储格式</template>
          <el-select v-model="formData.field_options.store" style="width:100%;">
            <el-option
              v-for="item in dialogStoreOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </template>
      <!-- 关联数据 -->
      <template v-else-if="formData.field_type === 'linkdata'">
        <el-form-item>
          <template slot="label">关联数据</template>
          <ibps-data-template-selector2
            v-model="formData.field_options.linkdata"
            placeholder="请选择关联数据"
            type="valueSource"
            @change="changeDataTemplateSelector"
          />
        </el-form-item>

        <el-form-item>
          <div slot="label">关联配置</div>
          <div class="el-form-item__content">
            <el-button
              :disabled="disabledResultColumns"
              style="width:100%;"
              type="primary"
              size="mini"
              plain
              @click="settingDataTemplateConfig('linkdata')"
            >设置关联配置</el-button>
          </div>
        </el-form-item>
        <!--数据模版-参数配置-->
        <data-template-config
          :visible="dataTemplateConfigVisible"
          :columns="resultColumns"
          :data="formData.field_options.link_config"
          show-structure
          @callback="setDataTemplateConfig"
          @close="visible => dataTemplateConfigVisible = visible"
        />
      </template>

      <!-- 地址 -->
      <template v-else-if="formData.field_type === 'address'">
        <el-form-item>
          <template slot="label">最大区域</template>
          <el-select v-model="formData.field_options.top" style="width:100%;" @change="changeTop">
            <el-option
              v-for="item in areaOptions"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="formData.field_options.top !== 'country'">
          <template slot="label">最大区域值</template>
          <ibps-address
            v-model="topval"
            :level="topvalLevel"
            data-type="code"
            @change="changeTopval"
          />
        </el-form-item>
        <el-form-item>
          <template slot="label">最小区域<help-tip prop="addressLevel" /></template>
          <el-select v-model="formData.field_options.level" style="width:100%;" @change="changeLevel">
            <el-option
              v-for="item in areaOptions"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </el-form-item>
      </template>
    </template>
  </el-form>

</template>
<script>
import vuedraggable from 'vuedraggable'
// import { defaultsDeep } from 'lodash'
import RightsSelector from '@/business/platform/rights/config/selector'
import { queryFieldTypeOptions } from '../constants/editor-column'
import { queryConditionOptions, datefmtTypeOptions, selectorTypeOptions, selectorStoreOptions, dialogStoreOptions, areaOptions, dateScopeOptions } from '@/business/platform/form/constants/fieldOptions'
import FieldTypeMixin from '../mixins/field-type'
import DataTemplateMixin from '../mixins/data-template'
// import IbpsTreeSelect from '@/components/ibps-tree-select'
import CustomTimeScope from './custom-time-scope'
import IbpsAddress from '@/components/ibps-address/cascader'
import FieldOptions from '@/business/platform/data/components/field/options'
import IbpsTypeSelect from '@/business/platform/cat/type/select'
import IbpsDataTemplateSelector2 from '@/business/platform/data/dataTemplate/selector2'
import DataTemplateConfig from '@/business/platform/form/formbuilder/right-aside/components/data-template-config'

import { testField } from '@/utils/validate'

import AddressUtil from '@/components/ibps-address/util'
import Utils from '../../utils'

export default {
  components: {
    vuedraggable,
    RightsSelector,
    CustomTimeScope,
    FieldOptions,
    IbpsTypeSelect,
    IbpsDataTemplateSelector2,
    IbpsAddress,
    // IbpsTreeSelect
    DataTemplateConfig
  },
  mixins: [FieldTypeMixin, DataTemplateMixin],
  props: {
    data: {
      type: Object
    },
    datasetType: {
      type: String,
      default: 'table'
    },
    fields: {
      type: [Object, Array]
    },
    boData: {
      type: Array
    }
  },
  data() {
    return {
      queryFieldTypeOptions,
      queryConditionOptions,
      datefmtTypeOptions,
      selectorTypeOptions,
      selectorStoreOptions,
      dialogStoreOptions,
      dateScopeOptions,
      areaOptions,

      queryConditions: [],
      isDragging: false,
      draggableOptions: {
        handle: '.draggable',
        ghostClass: 'sortable-ghost',
        distance: 1,
        disabled: false,
        animation: 200,
        axis: 'y'
      },
      editData: {},
      editIndex: '',
      customTimeScopeVisible: false,
      showQueryCondition: false,

      paramTypeOptions: [{
        value: 'base',
        label: '基本参数'
      }, {
        value: 'object',
        label: '对象参数'
      }, {
        value: 'arrayObject',
        label: '数组对象'
      }],
      formName: 'form',
      formData: {
        name: '',
        label: '',
        rights: [{ type: 'all' }],
        common: 'Y',
        same: 'Y',
        field_type: 'text'
      },
      rules: {
        name: [{ required: true, message: this.$t('validate.required') }],
        label: [{ required: true, message: this.$t('validate.required') }],
        queryCondition: [{ required: true, message: this.$t('validate.required') }],
        combinationName: [
          { required: true, message: this.$t('validate.required') },
          { validator: testField, trigger: 'blur' }
        ]
      },
      dropdownItem: [{
        value: 'initScope',
        disabled: false,
        label: '初始化范围'
      }, {
        value: 'customScope',
        disabled: false,
        label: '自定义范围'
      }, {
        value: 'recentlyOnceWeek',
        disabled: false,
        label: '最近一周'
      }, {
        value: 'recentlyOnceMonth',
        disabled: false,
        label: '最近一个月'
      }, {
        value: 'recentlyThirdMonth',
        disabled: false,
        label: '最近三个月'
      }],
      isbetweenOption: [{
        value: 'between',
        label: '在...之间',
        suffix: ''
      },
      {
        value: 'no_between',
        label: '不在...之间',
        suffix: ''
      }],
      init: true,
      defaultValue: '',
      buttonKey: '',
      combinationKeyField: [],
      fieldsTypeOption: [
        {
          label: '字符串类型',
          value: 'varchar'
        }, {
          label: '日期类型',
          value: 'date'
        }, {
          label: '数字类型',
          value: 'number'
        }
      ]

    }
  },
  computed: {
    datasetData() {
      return Utils.getFieldsByType(this.fields, 'query')
    },
    topvalLevel() {
      return AddressUtil.getPrevLevel(this.formData.field_options.top)
    },
    columns() {
      if (this.$utils.isArray(this.fields)) {
        const arr = this.filterSelectorFields(this.fields)
        return arr
      } else {
        return []
      }
    },
    topval: {
      get() {
        return this.formData.field_options.topval || []
      },
      set(val) {
        this.formData.field_options.topval = val || []
      }
    }
  },
  watch: {
    data: {
      handler(val) {
        this.formData = val
        this.conversionData('array', val.combinationKeyField)
        this.initQueryColumn()
        if (val.field_options.defaultValue && val.field_options.defaultValue !== '') {
          this.defaultValue = val.field_options.defaultValue
        } else {
          this.defaultValue = ''
        }
        this.checkDefaultScope()
        // fieldsTypes
      },
      immediate: true
    },
    'formData.field_options.hasScope': {
      handler: function(val) {
        if (val === 'Y') {
          const pickerOptions = this.formData.field_options.pickerOptions
          if (!pickerOptions || pickerOptions === []) {
            this.formData.field_options.pickerOptions = JSON.parse(JSON.stringify(dateScopeOptions))
          }
        }
      },
      immediate: true
    }
  },
  beforeDestroy() {
    this.queryFieldTypeOptions = null
    this.datefmtTypeOptions = null
    this.selectorTypeOptions = null
    this.selectorStoreOptions = null
    this.dialogStoreOptions = null
    this.dateScopeOptions = null
    this.areaOptions = null
    this.paramTypeOptions = null
    this.formData = null
    this.rules = null
  },
  methods: {
    filterSelectorFields(fields) {
      const filedTypes = ['date', 'number', 'varchar']
      const arr = fields.filter(f => filedTypes.includes(f.type) === true)
      return arr
    },
    conversionData(conversionType, data) {
      if (this.$utils.isEmpty(data)) {
        conversionType === 'string' ? this.formData.combinationKeyField = '' : this.combinationKeyField = []
        return
      }
      if (conversionType === 'string') {
        this.formData.combinationKeyField = ''
        data.forEach(d => {
          this.formData.combinationKeyField += d
        })
      } else {
        const arr = data.split('#').filter(f => f !== '')
        this.combinationKeyField = []
        arr.forEach(f => {
          this.combinationKeyField.push(f + '#')
        })
      }
    },
    initQueryColumn() {
      // 查询条件控件类型
      const typeOptions = ['varchar', 'date', 'number']
      this.showQueryCondition = typeOptions.includes(this.formData.dataType) || this.formData.addType === 'combination'
      if (this.showQueryCondition) {
        this.changeFieldType(this.formData.field_type)
      }
      if (this.datasetType === 'thirdparty') {
        this.queryConditions = this.queryConditionOptions[this.formData.fieldsTypes]
      }
    },
    changeFieldsTypes(val) {
      this.queryConditions = this.queryConditionOptions[val]
      this.formData.same = 'Y'
      this.formData.field_type = ''
      this.formData.queryCondition = ''
    },
    changeQueryCondition(val) {
      this.$set(this.formData, 'queryCondition', val)
      const typeOptions = ['date', 'number']
      const specialQueryOptions = ['between', 'no_between']
      const dataType = this.formData.dataType || this.formData.fieldsTypes
      const linkagefiledType = typeOptions.includes(dataType)
      // 1.字段类型决定查询条件类别，2.如果选择 在...之间，不在...之间 时需要联动 控件类型：日期为/日期范围 数字/数字范围
      // 反之如果选择得控件类型为：日期为/日期范围 数字/数字范围 时，需要联动筛选当前查询条件只为：在...之间，不在...之间 默认为在...之间

      if (linkagefiledType) {
        if (specialQueryOptions.includes(val)) {
          this.formData.same = 'N'
          if (dataType === 'date') {
            this.formData.field_type = 'dateRange'
          } else {
            this.formData.field_type = 'numberRange'
          }
          this.queryConditions = this.isbetweenOption
        }
      }
    },
    changeFieldType(val) {
      const controlType = ['dateRange', 'numberRange']
      const typeOptions = ['date', 'number']
      const specialQueryOptions = ['between', 'no_between']
      const dataType = this.formData.dataType
      if (controlType.includes(val) && typeOptions.includes(dataType)) {
        this.queryConditions = this.isbetweenOption
        !specialQueryOptions.includes(this.formData.queryCondition) ? this.formData.queryCondition = 'between' : null
      } else {
        this.queryConditions = this.formData.dataType ? this.queryConditionOptions[this.formData.dataType] : this.queryConditionOptions[this.formData.addType]
      }
    },
    changeSame(val) {
      if (val === 'Y') {
        this.$set(this.formData, 'field_type', 'text')
        this.queryConditions = this.formData.dataType ? this.queryConditionOptions[this.formData.dataType] : this.queryConditionOptions[this.formData.addType]
      }
    },
    changeDatefmtType(value) {
      if (value !== 'date') {
        this.$set(this.formData.field_options, 'hasScope', 'N')
        this.initScopeAction()
      }
    },
    changeDateScope(val) {
      this.$set(this.formData.field_options, 'hasScope', val)
      if (val === 'N') {
        this.initScopeAction()
      }
    },
    dropdownSetting(command) {
      switch (command) {
        case 'initScope':
          this.initScopeAction()
          break
        case 'customScope':
          this.customScopeAction()
          break
        case 'recentlyOnceWeek':
        case 'recentlyOnceMonth':
        case 'recentlyThirdMonth':
          this.addDefalutScope(command)
          break
      }
    },
    addDefalutScope(command) {
      const dataIndex = dateScopeOptions.findIndex(d => d.value === command)
      const disabledIndex = this.dropdownItem.findIndex(d => d.value === command)
      const data = dateScopeOptions[dataIndex]
      this.dropdownItem[disabledIndex].disabled = true
      this.formData.field_options.pickerOptions.push(data)
    },
    // 初始化范围
    initScopeAction() {
      this.formData.field_options.pickerOptions = JSON.parse(JSON.stringify(dateScopeOptions))
      this.dropdownItem.forEach(d => {
        if (d.value === 'initScope' || d.value === 'customScope') {
          d.disabled = false
        } else {
          d.disabled = true
        }
      })
      this.formData.field_options.defaultValue = ''
      this.defaultValue = ''
      this.sortData()
    },
    // 检测已选的默认数据，设置禁用。
    checkDefaultScope() {
      const pickerOptions = this.formData.field_options.pickerOptions
      if (pickerOptions && pickerOptions !== []) {
        pickerOptions.forEach(p => {
          const index = this.dropdownItem.findIndex(d => d.value === p.value)
          if (index > -1) {
            this.dropdownItem[index].disabled = true
          }
        })
      } else {
        dateScopeOptions.forEach(p => {
          const index = this.dropdownItem.findIndex(d => d.value === p.value)
          if (index > -1) {
            this.dropdownItem[index].disabled = true
          }
        })
      }
    },

    // 添加自定义范围
    customScopeAction() {
      this.buttonKey = 'add'
      this.editData = {}
      this.editIndex = ''
      this.customTimeScopeVisible = true
    },

    // 排序事件
    sortData() {
      this.init = false
      this.$nextTick(() => {
        this.init = true
      })
    },
    handleDefaultValue(data) {
      const cilckIndex = this.formData.field_options.pickerOptions.findIndex((option) => option.value === data)
      const radios = this.$refs['radios']
      if (radios[cilckIndex].$refs['radio'].checked) {
        radios[cilckIndex].$el.checked = false
        this.defaultValue = ''
        this.formData.field_options.defaultValue = ''
      } else {
        this.defaultValue = data
        this.formData.field_options.defaultValue = data
      }
    },
    // 设置字段
    settingColumn(i) {
      this.buttonKey = 'edit'
      this.editData = this.formData.field_options.pickerOptions[i] || {}
      this.editIndex = i
      this.customTimeScopeVisible = true
    },
    // 删除字段
    removeColumn(i) {
      const scopeKey = this.formData.field_options.pickerOptions[i].value
      const disabledIndex = this.dropdownItem.findIndex(d => d.value === scopeKey)
      if (disabledIndex > -1) {
        this.dropdownItem[disabledIndex].disabled = false
      }
      this.formData.field_options.pickerOptions.splice(i, 1)
      this.sortData()
    },
    // 获取范围值
    getTimeScopeData(data) {
      const index = this.formData.field_options.pickerOptions.findIndex(f => f.value === data.value)
      if (index > -1) {
        this.formData.field_options.pickerOptions.splice(index, 1, data)
      } else {
        this.formData.field_options.pickerOptions.push(data)
      }
      this.sortData()
    },
    // ******
    changeTop() {
      this.formData.field_options.topval = []
      this.formData.field_options.default_value = ''
    },
    changeLevel() {
      this.formData.field_options.default_value = ''
    },
    changeTopval() {
      this.formData.field_options.default_value = ''
    },
    // 获取表单数据
    getFormData(callback) {
      this.$refs[this.formName].validate((valid) => {
        const valids = this.$utils.isNotEmpty(this.formData.combinationKeyField)
        if (valid) {
          this.formData.addType === 'combination' ? valids ? callback(this.formData) : callback(false, '关键字段不能为空') : callback(this.formData)
        } else {
          callback()
        }
      })
    },
    // 删除权限
    removeRight(index, item, items) {
      const obj = {}
      if (item.type === 'all') {
        this.formData.rights.splice(index, 1, { type: 'none' })
      }
      if (item.type === 'all' || item.type === 'none') return
      const rightsIdArr = item.rightsId.split(',')
      const rightsNameArr = item.rightsName.split(',')
      rightsIdArr.splice(index, 1)
      rightsNameArr.splice(index, 1)
      obj.type = item.type
      obj.rightsId = rightsIdArr.join(',')
      obj.rightsName = rightsNameArr.join(',')
      this.formData.rights.forEach((r, i) => {
        if (r.type === obj.type) {
          this.formData.rights.splice(i, 1, obj)
        }
      })
    }
  }
}
</script>

<style lang="scss">
.template-query-column {
  .el-select {
    width: 100%;
  }
  .combination-field{
    label{
      padding-top: 4px;
    }
  }
}
</style>

<style lang="scss" scoped>
  .list-group {
    display: flex;
    flex-direction: column;
    padding-left: 0;
    margin-bottom: 0;
    margin-top: 10px;
  .list-group-item {
    position: relative;
    display: block;
    padding: 5px;
    margin: 5px 0;
    border: 1px solid #ddd;
    .actions-left{
      height: 24px;
      line-height: 24px;
      margin-left: 5px;
    }

    .actions {
      position: absolute;
      width: 60px;
      top: 2px;
      right: 0;
      line-height: 20px;
      padding-left: 1px;
      .el-button {
        padding-right: 4px;
        margin-right: 2px;
      }
      [data-role="sort_choice"]{
          cursor: move
      }
    }
    .sort-column-actions{
        width: 80px;
    }
  }

  .flip-list-move {
    transition: transform 0.5s;
  }
  .no-move {
    transition: transform 0s;
  }
  .sortable-ghost {
    opacity: 0.5;
    background: #c8ebfb;
  }
}
</style>
