<template>
  <el-form
    ref="form"
    :model="formData"
    :rules="rules"
    label-width="120px"
    size="mini"
    class="template-display-column"
    @submit.native.prevent
  >
    <el-form-item label="显示名称" prop="label">
      <el-input v-model="formData.label" v-pinyin="{vm:formData,name:'label',key:'combinationName'}" placeholder="显示名称" />
    </el-form-item>
    <template v-if="datasetType === 'thirdparty'">
      <el-form-item label="标识（name）" prop="name">
        <el-input v-model="formData.name" placeholder="标识（name）" />
      </el-form-item>
    </template>
    <el-form-item label="权限" prop="rights">
      <rights-selector v-model="formData.rights" @remove="removeRights" />
    </el-form-item>
    <el-form-item v-if="formData.addType!=='combination'" label="无权限样式" prop="noRightStyle">
      <el-select v-model="formData.noRightStyle" placeholder="无权限样式">
        <el-option value="" label="不显示" />
        <el-option value="asterisk" label="星号(*)" />
      </el-select>
    </el-form-item>

    <el-form-item v-if="formData.addType==='combination'" disabled label="组合字段标识">
      <el-input v-model="formData.combinationName" />
    </el-form-item>
    <el-form-item v-if="formData.addType==='combination'" label="组合类型">
      <el-radio-group v-model="formData.combinationType" @change="changeType">
        <el-radio label="field">字段</el-radio>
        <!-- <el-radio label="formula">公式</el-radio>
        <el-radio label="javascript">脚本</el-radio> -->
      </el-radio-group>
    </el-form-item>
    <el-form-item v-if="formData.addType==='combination'" label="组合字段" :class="combinationClass">
      <template v-if="formData.combinationType==='field'">
        <combination-field
          v-model="formData.combinationKeyField"
          :fields="columns"
          value-key="name"
          tips="选择的字段必须在显示字段,如果不在显示字段，请到显示字段添加。"
        />
      </template>
      <el-row v-if="formData.combinationType==='formula'">
        <el-col :span="24"><el-button type="primary" size="mini" @click="handlerFormula">公式计算</el-button></el-col>
      </el-row>
      <el-row v-if="formData.combinationType==='javascript'">
        <el-col :span="24"><el-button type="primary" size="mini" @click="handlerJavaScript">脚本</el-button></el-col>
      </el-row>
    </el-form-item>

    <el-form-item label="整列背景" prop="columnsBackGround">
      <el-col :span="6">
        <span>
          <el-select v-model="formData.columnsBackGround" placeholder="请选择">
            <el-option
              v-for="item in colors"
              :key="item.type"
              :label="item.label"
              :value="item.type"
            >
              <el-link :underline="false" :type="item.type " class="ibps-fl">{{ item.label }}</el-link>
            </el-option>
          </el-select>
        </span>
      </el-col>
      <el-col :span="6" style="height:32px;">
        <el-color-picker v-if="formData.columnsBackGround === 'custom'" v-model="formData.columnsCustomBackGround" />
      </el-col>
    </el-form-item>
    <el-form-item label="字体颜色">
      <el-col :span="6">
        <span>
          <el-select v-model="formData.fieldColor" placeholder="请选择">
            <el-option
              v-for="item in colors"
              :key="item.colors"
              :label="item.label"
              :value="item.colors"
            >
              <el-link :underline="false" :type="item.type " class="ibps-fl">{{ item.label }}</el-link>
            </el-option>
          </el-select>
        </span>
      </el-col>
      <el-col :span="6" style="height:32px;">
        <el-color-picker v-if="formData.fieldColor === 'custom'" v-model="formData.customfieldColor" />
      </el-col>
    </el-form-item>

    <el-form-item label="允许排序" prop="sortable">
      <el-switch v-model="formData.sortable" />
    </el-form-item>
    <el-form-item label="对齐方式" prop="align">
      <el-radio-group v-model="formData.align">
        <el-radio-button label="left">左对齐</el-radio-button>
        <el-radio-button label="center">居中对齐</el-radio-button>
        <el-radio-button label="right">右对齐</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="宽度" prop="width">
      <el-input v-model="formData.width" type="number" />
    </el-form-item>
    <el-form-item label="内容过长被隐藏" prop="show_overflow_tooltip">
      <el-switch v-model="formData.showOverflowTooltip" />
    </el-form-item>
    <el-form-item v-if="formData.addType!=='combination'" label="跟字段控件一致" prop="same">
      <el-switch v-model="formData.same" active-value="Y" inactive-value="N" />
    </el-form-item>
    <!--控件类型-->
    <template v-if="formData.same === 'N'">
      <el-form-item label="显示格式" prop="field_type">
        <el-select v-model="formData.field_type" @change="changeFieldType">
          <el-option
            v-for="item in displayFieldTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <!-- 数字格式 -->
      <template v-if="formData.field_type === 'number'">
        <el-form-item label="数字类型" prop="number_type">
          <el-select v-model="formData.field_options.number_type">
            <el-option
              v-for="item in numberTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="formData.field_options.number_type ==='integer' ||formData.field_options.number_type ==='number'||formData.field_options.number_type ==='currency'"
          label="数字格式"
          prop="number_type"
        >
          <el-select v-model="formData.field_options.number_format">
            <el-option
              v-for="item in numberFormatOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="formData.field_options.number_type ==='number' ||formData.field_options.number_type ==='currency'"
          label="小数精确位数"
          prop="decimal_places"
        >
          <el-input-number v-model="formData.field_options.decimal_places" />
        </el-form-item>

        <el-form-item
          v-if="formData.field_options.number_type ==='number'||formData.field_options.number_type ==='currency'"
          label="不足时补0"
          prop="decimal_scale"
        >
          <el-switch v-model="formData.field_options.decimal_scale" />
        </el-form-item>

        <el-form-item
          v-if="formData.field_options.number_type ==='currency'"
          label="前缀"
          prop="prefix"
        >
          <el-input v-model="formData.field_options.prefix" />
        </el-form-item>

        <el-form-item
          v-if="formData.field_options.number_type ==='currency'"
          label="后缀"
          prop="suffix"
        >
          <el-input v-model="formData.field_options.suffix" />
        </el-form-item>
      </template>

      <!-- 枚举值格式 -->
      <template v-else-if="formData.field_type === 'select'">
        <el-form-item label-width="0" prop="options">
          <field-options v-model="formData.field_options.options" />
        </el-form-item>
      </template>
      <!-- 日期格式 -->
      <el-form-item v-else-if="formData.field_type === 'datePicker'" label="日期格式" prop="datefmt_type">
        <el-select v-model="formData.field_options.datefmt_type">
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
      <template v-else-if="formData.field_type === 'selector'">
        <el-form-item label="选择器类型" prop="selector_type">
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
        <el-form-item>
          <template slot="label">是否多选</template>
          <el-switch
            v-model="formData.field_options.multiple"
            active-value="Y"
            inactive-value="N"
          />
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
      <!-- end -->
    </template>
    <!-- 公式计算 -->
    <formula-edit
      :visible="formulaEditVisible"
      :title="'表单校验'"
      :bo-data="boData"
      :data="formVerify"
      verify
      @callback="handlerFormVerify"
      @close="visible => formulaEditVisible = visible"
    />
    <!-- 脚本 :data="formScript"-->
    <form-script
      :visible="formScriptVisible"
      :title="formScriptTitle"
      :bo-data="boData"
      @callback="handlerFormScript"
      @close="visible => formScriptVisible = visible"
    />
  </el-form>
</template>
<script>
import RightsSelector from '@/business/platform/rights/config/selector'

import FormulaEdit from '../components/formula-edit'
import FormScript from '../components/form-script'

import { stringConditionOptions, dateConditionOptions, colors } from '../constants/condition'

import { displayFieldTypeOptions, numberTypeOptions, numberFormatOptions } from '../constants/editor-column'
import { datefmtTypeOptions, selectorTypeOptions, selectorStoreOptions, dialogStoreOptions, areaOptions } from '@/business/platform/form/constants/fieldOptions'
import FieldTypeMixin from '../mixins/field-type'
import DataTemplateMixin from '../mixins/data-template'
import FieldOptions from '@/business/platform/data/components/field/options'
import IbpsTypeSelect from '@/business/platform/cat/type/select'
import IbpsDataTemplateSelector2 from '@/business/platform/data/dataTemplate/selector2'
import DataTemplateConfig from '@/business/platform/form/formbuilder/right-aside/components/data-template-config'
import CombinationField from '@/business/platform/form/components/combination-field'
import IbpsAddress from '@/components/ibps-address/cascader'
import AddressUtil from '@/components/ibps-address/util'

export default {
  components: {
    FormulaEdit,
    FormScript,
    RightsSelector,
    FieldOptions,
    IbpsTypeSelect,
    IbpsDataTemplateSelector2,
    IbpsAddress,
    DataTemplateConfig,
    CombinationField
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
    fields: { // 字段
      type: [Array, Object],
      default: () => []
    },
    boData: {
      type: Array
    }
  },
  data() {
    return {
      displayFieldTypeOptions,
      numberTypeOptions,
      numberFormatOptions,
      datefmtTypeOptions,
      selectorTypeOptions,
      selectorStoreOptions,
      dialogStoreOptions,
      areaOptions,

      stringConditionOptions,
      dateConditionOptions,
      colors,

      formName: 'form',
      formData: {
        label: ''
      },
      rules: {
        name: [{ required: true, message: this.$t('validate.required') }],
        label: [{ required: true, message: this.$t('validate.required') }]
      },
      editor: null,
      combinationClass: 'combination-filed-block',
      formulaEditVisible: false,
      formVerify: '',

      formScriptVisible: false,
      formScriptTitle: '表单脚本'

    }
  },
  computed: {
    columns() {
      if (this.$utils.isArray(this.fields)) {
        const arr = this.filterSelectorFields(this.fields)
        return arr
      } else {
        return []
      }
    },
    topvalLevel() {
      return AddressUtil.getPrevLevel(this.formData.field_options.top)
    },
    topval: {
      get() {
        return this.formData.field_options.topval || []
      },
      set(val) {
        this.formData.field_options.topval = val || []
      }
    }
    // formScript() {
    //   // return this.formType === 'mobile' ? this.formDef.attrs.mobile_script || '' : this.formDef.attrs.script || ''
    // }
  },
  watch: {
    data: {
      handler(val) {
        this.formData = val
      },
      immediate: true
    }
  },
  beforeDestroy() {
    this.displayFieldTypeOptions = null
    this.numberTypeOptions = null
    this.numberFormatOptions = null
    this.datefmtTypeOptions = null
    this.selectorTypeOptions = null
    this.selectorStoreOptions = null
    this.dialogStoreOptions = null
    this.formData = null
    this.rules = null
  },
  methods: {
    filterSelectorFields(fields) {
      const filedTypes = ['date', 'number', 'varchar']
      const arr = fields.filter(f => filedTypes.includes(f.type) === true)
      return arr
    },
    handlerFormula() {
      this.formulaEditVisible = true
      // this.formVerify = this.formVerifyList[index]
    },
    handlerJavaScript() {
      this.formScriptVisible = true
    },
    handlerFormVerify(data) {
      this.formData.verifys = data
    },
    handlerFormScript(data) {
      this.formData.script = data
    },
    // 过滤
    filterConditionOptions() {
      const dataType = this.formData.dataType
      return dataType === 'date' ? this.dateConditionOptions : this.stringConditionOptions
    },
    // 获取表单数据
    getFormData(callback) {
      this.$refs[this.formName].validate((valid) => {
        if (valid) {
          callback(this.formData)
        } else {
          callback()
        }
      })
    },
    changeType(value) {
      // 切换类型初始化值
      this.$set(this.formData, 'combinationType', value)
      // this.setValue()
      if (value === 'field') {
        this.combinationClass = 'combination-filed-block'
      } else {
        this.combinationClass = 'combination-filed-none'
      }
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
    removeRights(index, item, items) {
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
.template-display-column {
  .el-select {
    width:100%;
  }
}
</style>
