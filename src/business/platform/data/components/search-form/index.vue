<template>
  <el-form
    v-if="forms"
    ref="form"
    :model="params"
    :inline="inline"
    :label-width="labelWidth ? (labelWidth + 'px') : ''"
    class="ibps-crud-search-form"
    @keyup.enter.native.stop="handleEnter"
  >
    <template v-for="(item, index) in forms">
      <el-form-item
        v-if="item.fieldType !== 'hidden'"
        :key="index"
        :prop="item.modelValue"
        :label="item.label"
        :rules="item.rules || []"
        :label-width="item.labelWidth ? (item.labelWidth + 'px') : ''"
        class="search-form-item"
        @submit.native.prevent
      >
        <!-- 文本框-->
        <el-input
          v-if="item.fieldType === 'input' ||item.fieldType === 'text'|| item.fieldType === undefined"
          v-model="params[item.modelValue]"
          :size="item.size ? item.size : size"
          :readonly="item.readonly"
          :disabled="item.disabled"
          :placeholder="item.placeholder?item.placeholder:'请输入'"
          :style="itemStyle + (item.itemWidth ? `width: ${item.itemWidth}px;` : '')"
          clearable
          @keyup.enter.native.stop="handleEnter"
        />
        <!-- 下拉框-->
        <el-select
          v-else-if="item.fieldType === 'select'"
          v-model="params[item.modelValue]"
          :size="item.size ? item.size : size"
          :disabled="item.disabled"
          :multiple="item.multiple"
          :placeholder="item.placeholder?item.placeholder:'请选择'"
          :style="itemStyle + (item.itemWidth ? `width: ${item.itemWidth}px;` : '')"
          clearable
          @keyup.enter.native.stop="handleEnter"
        >
          <el-option
            v-for="(option, optionIndex) in item.options"
            :key="optionIndex + '_local'"
            :value="(typeof option === 'object') ? option[item.valueKey || 'value'] : option"
            :label="(typeof option === 'object') ? option[item.labelKey || 'label'] : option"
          />
          <el-option
            v-for="(op, opIndex) in selectOptions[selectOptionPrefix + index]"
            :key="opIndex + '_remote'"
            :value="(typeof op === 'object') ? op[item.valueKey || 'value'] : op"
            :label="(typeof op === 'object') ? op[item.labelKey || 'label'] : op"
          />
        </el-select>
        <!--数字范围-->
        <ibps-number-range
          v-else-if="item.fieldType === 'numberRange'"
          v-model="params[item.modelValue]"
          :placeholder="item.placeholder?item.placeholder:'请输入'"
          :disabled="item.disabled"
          :readonly="item.readonly"
          :style="itemStyle + (item.itemWidth ? `width: ${item.itemWidth}px;` : '')"
          @input="data => changeNumber(data, item.prop[0], item.prop[1])"
          @keyup.enter.native.stop="handleEnter"
        />
        <!-- 日期-->
        <el-date-picker
          v-else-if="item.fieldType === 'date'"
          v-model="params[item.modelValue]"
          :placeholder="item.placeholder?item.placeholder:'请输入'"
          :size="item.size ? item.size : size"
          :disabled="item.disabled"
          :readonly="item.readonly"
          :editable="item.editable"
          :style="itemStyle + (item.itemWidth ? `width: ${item.itemWidth}px;` : '')"
          :picker-options="item.pickerOptions || {}"
          :value-format="item.field_options.datefmt||'yyyy-MM-dd'"
          @keyup.enter.native.stop="handleEnter"
        />
        <!-- 日期范围(年)-->
        <ibps-date-range
          v-else-if="item.fieldType === 'yearrange'"
          v-model="params[item.modelValue]"
          :size="item.size ? item.size : size"
          :disabled="item.disabled"
          :readonly="item.readonly"
          :editable="item.editable"
          :placeholder="item.placeholder?item.placeholder:'请选择'"
          :style="itemStyle + (item.itemWidth ? `width: ${item.itemWidth}px;` : '')"
          :value-format="item.field_options.datefmt||'yyyy'"
          :format="item.field_options.datefmt||'yyyy'"
          type="year"
          clearable
          @change="date => changeDate(date, item.prop[0], item.prop[1])"
          @keyup.enter.native.stop="handleEnter"
        />
        <!-- 日期控件(月，日期，时间)-->
        <el-date-picker
          v-else-if="item.fieldType === 'monthrange' ||item.fieldType === 'daterange' ||item.fieldType === 'datetimerange'"
          v-model="params[item.modelValue]"
          :size="item.size ? item.size : size"
          :disabled="item.disabled"
          :readonly="item.readonly"
          :editable="item.editable"
          :placeholder="item.placeholder?item.placeholder:'请选择'"
          :start-placeholder="item.placeholder?item.placeholder:'请选择'"
          :end-placeholder="item.placeholder?item.placeholder:'请选择'"
          :style="itemStyle + (item.itemWidth ? `width: ${item.itemWidth}px;` : '')"
          :picker-options="item.pickerOptions"
          :type="item.fieldType"
          :value-format="item.field_options.datefmt||'yyyy-MM-dd'"
          :format="item.field_options.datefmt||'yyyy-MM-dd'"
          clearable
          @change="date => changeDate(date, item.prop[0], item.prop[1])"
          @keyup.enter.native.stop="handleEnter"
        />
        <!-- 时间范围-->
        <el-time-picker
          v-else-if="item.fieldType === 'timerange'"
          v-model="params[item.modelValue]"
          is-range
          :size="item.size ? item.size : size"
          :disabled="item.disabled"
          :readonly="item.readonly"
          :editable="item.editable"
          :placeholder="item.placeholder?item.placeholder:'请选择'"
          :start-placeholder="item.placeholder?item.placeholder:'请选择'"
          :end-placeholder="item.placeholder?item.placeholder:'请选择'"
          :style="itemStyle + (item.itemWidth ? `width: ${item.itemWidth}px;` : '')"
          :picker-options="item.pickerOptions || {}"
          :value-format="item.field_options.datefmt"
          @change="date => changeDate(date, item.prop[0], item.prop[1])"
          @keyup.enter.native.stop="handleEnter"
        />
        <!-- 数据字典-->
        <ibps-dictionary
          v-else-if="item.fieldType === 'dictionary'"
          v-model="params[item.modelValue]"
          :type-key="item.field_options.dictionary"
          :placeholder="item.placeholder?item.placeholder:'请选择'"
          :multiple="item.multiple"
          :disabled="item.disabled"
          :store="item.multiple?'array':'string'"
          clearable
        />
        <!-- 选择器-->
        <ibps-user-selector
          v-else-if="item.fieldType === 'selector'"
          v-model="params[item.modelValue]"
          :type="item.selectorType||'user'"
          :placeholder="item.placeholder?item.placeholder:'请选择'"
          :multiple="false"
          :store="'id'"
          :disabled="item.disabled"
        />
        <!--自定义对话框-->
        <ibps-custom-dialog
          v-else-if="item.fieldType === 'customDialog'"
          v-model="params[item.modelValue]"
          :template-key="item.field_options.dialog"
          :placeholder="item.placeholder?item.placeholder:'请选择'"
          :multiple="false"
          :store="item.field_options.store"
          :icon="item.field_options.icon?'ibps-icon-'+item.field_options.icon:'ibps-icon-search'"
          :type="item.field_options.dialog_type||'dialog'"
          :dynamic-params="getLinkDynamicParams(item.field_options,params)"
          :disabled="item.disabled"
          readonly-text="original"
        />
        <!-- 关联数据-->
        <ibps-link-data
          v-else-if="item.fieldType==='linkdata'"
          v-model="params[item.modelValue]"
          :template-key="item.field_options.linkdata"
          :placeholder="item.placeholder?item.placeholder:'请选择'"
          :multiple="item.field_options.multiple === 'Y'"
          :dynamic-params="getLinkDynamicParams(item.field_options,params)"
          :value-key="getLinkValueKey(item.field_options)"
          :label-type="getLinkLabelType(item.field_options)"
          :label-key="getLinkLabelKey(item.field_options)"
          :disabled="item.disabled"
        />

        <!-- 地址-->
        <ibps-address
          v-else-if="item.fieldType === 'address'"
          v-model="params[item.modelValue]"
          :placeholder="item.placeholder?item.placeholder:'请选择'"
          :size="item.field_options.size"
          :top="item.field_options.top || 'country'"
          :top-val="getAddressTopVal(item.field_options)"
          :level="item.field_options.level||'district'"
          :props="{ checkStrictly: true }"
          :disabled="item.disabled"
          clearable
          data-type="codeString"
        />
        <!-- 自定义slot-->
        <template v-else-if="item.fieldType === 'slot'">
          <slot :name="item.slotName" :item="item" />
        </template>
      <!--TODO: 查询字段类型持续开发中-->
      </el-form-item>
    </template>
  </el-form>
</template>

<script>
import { formProps } from './props.js'
import request from '@/utils/request'
import FormUtils from '@/business/platform/form/utils/formUtil'
import IbpsNumberRange from '@/components/ibps-number-range'
import IbpsDateRange from '@/components/ibps-date-range'

import IbpsDictionary from '@/business/platform/cat/dictionary/select'
import IbpsUserSelector from '@/business/platform/org/selector'
import IbpsAddress from '@/components/ibps-address/cascader'
import IbpsCustomDialog from '@/business/platform/data/templaterender/custom-dialog'
import IbpsLinkData from '@/business/platform/data/templaterender/link-data'

export default {
  components: {
    IbpsNumberRange,
    IbpsDateRange,
    IbpsDictionary,
    IbpsUserSelector,
    IbpsCustomDialog,
    IbpsLinkData,
    IbpsAddress
  },
  props: formProps,
  data() {
    const { forms, fuzzy } = this.$props
    const datePrefix = 'daterange-prefix'
    const selectOptionPrefix = 'select-option-prefix'
    const fieldTypes = ['select', 'checkbox']
    const dataObj = {
      selectOptions: {}
    }
    const params = {}
    const nameParams = {}
    const format = {}
    const fuzzyOps = {}
    forms.forEach((v, i) => {
      const propType = typeof v.prop
      if (propType === 'string') {
        v.modelValue = v.fieldType === 'customDialog' ? v.prop + 'L' : v.prop
        params[v.prop] = v.value || ''
        if (v.name) {
          nameParams[v.prop] = v.name
        }

        fuzzyOps[v.prop] = v.fuzzy ? v.fuzzy : fuzzy
        if (v.format) {
          format[v.prop] = v.format
        }
      } else if (propType === 'object' && Object.prototype.toString.call(v.prop) === '[object Array]') {
        const multiple = v.multiple || false
        if (fieldTypes.includes(v.fieldType) && multiple) {
          params[v.prop[0]] = []
        } else {
          v.prop.forEach((vv, j) => {
            params[vv] = v.value ? v.value[j] || '' : ''
            if (v.name) {
              nameParams[vv] = v.name[j]
            }
            if (v.format) {
              format[vv] = v.format
            }
            fuzzyOps[vv] = v.fuzzy ? v.fuzzy : fuzzy
          })
        }
      }
      if (v.fieldType === 'yearrange' || v.fieldType === 'monthrange' || v.fieldType === 'daterange' || v.fieldType === 'datetimerange' || v.fieldType === 'timerange' || v.fieldType === 'numberRange') {
        params[datePrefix + i] = v.fieldType === 'numberRange' ? [] : this.$utils.isNotEmpty(v.value) ? v.value : ''
        v.modelValue = datePrefix + i
      } else if (v.fieldType === 'select' && (v.selectFetch || v.selectUrl)) {
        const dataKey = selectOptionPrefix + i
        dataObj.selectOptions[dataKey] = []
        if (!v.selectMethod) {
          v.selectMethod = 'get'
        }
        this.getRemoteData({
          fetch: v.selectFetch ? v.selectFetch : () => {
            const p = v.selectMethod.toLowerCase() === 'get'
              ? { params: v.selectParams } : v.selectParams
            return request({
              url: v.selectUrl,
              method: v.selectMethod,
              p
            })
          },
          dataKey,
          resultField: v.resultField || 'data',
          resultHandler: v.resultHandler
        })
      }
    })
    return {
      params,
      nameParams,
      datePrefix,
      selectOptionPrefix,
      ...dataObj,
      format,
      fuzzyOps
    }
  },
  computed: {
    itemStyle() {
      const { itemWidth } = this
      if (itemWidth) {
        return `width: ${itemWidth}px;`
      }
      return ''
    }
  },
  methods: {
    /**
     * 处理回车
     */
    handleEnter() {
      this.$emit('search')
    },
    isArray(value) {
      return typeof value === 'object' && Object.prototype.toString.call(value) === '[object Array]'
    },
    getParamFuzzy() {
      return this.fuzzyOps
    },
    getParam() {
      return this.params
    },
    /**
     * 获取参数
     */
    getSearcFormData() {
      const { params, nameParams, datePrefix, format } = this
      const formattedForm = {}
      Object.keys(params).forEach(v => {
        if (v && v.indexOf(datePrefix) === -1) {
          const val = format[v] ? format[v](params[v], v) : params[v]
          if (this.$utils.isNotEmpty(val) && !Array.isArray(val)) {
            let key = v
            if (nameParams[v]) {
              key = nameParams[v]
            }
            formattedForm[key] = val
          } else {
            formattedForm[v] = params[v]
          }
        }
      })
      return formattedForm
    },
    /**
     *重置表单
     */
    resetSearchForm() {
      const { params, datePrefix } = this
      Object.keys(params).forEach(v => {
        if (v && v.indexOf(datePrefix) === -1) {
          params[v] = ''
        }
      })
      this.$refs['form'].resetFields()
    },
    changeNumber(data, start, end) {
      let startVal = null
      let endVal = null
      if (data !== null) {
        startVal = data[0] || null
        endVal = data[1] || null
      }
      this.params[start] = startVal
      this.params[end] = endVal
    },
    changeDate(date, startDate, endDate) {
      if (date === null) {
        this.params[startDate] = ''
        this.params[endDate] = ''
        return
      }
      this.params[startDate] = date[0]
      this.params[endDate] = date[1]
    },
    /**
     * 获取的远程数据【下拉框】
     */
    getRemoteData({ fetch, dataKey, resultField, resultHandler }) {
      fetch().then(response => {
        let result = response
        if (typeof response === 'object' && !this.isArray(response)) {
          if (resultField.indexOf('.') !== -1) {
            resultField.split('.').forEach(vv => {
              result = result[vv]
            })
          } else {
            result = response[resultField]
          }
        }
        if (!result || !(result instanceof Array)) {
          throw new Error(`The result of key:${resultField} is not Array.`)// 接口返回的字段:${resultField} 不是一个数组
        }
        if (this.resultHandler) {
          this.selectOptions[dataKey] = result.map(this.resultHandler)
        } else {
          this.selectOptions[dataKey] = result
        }
      })
    },
    getAddressTopVal(fieldOptions) {
      return FormUtils.getAddressTopVal(fieldOptions)
    },
    getLinkDynamicParams(fieldOptions, data) {
      return FormUtils.getLinkDynamicParams(fieldOptions, data)
    },
    getLinkValueKey(fieldOptions, data) {
      return FormUtils.getLinkValueKey(fieldOptions, data)
    },
    getLinkLabelType(fieldOptions, data) {
      return FormUtils.getLinkLabelType(fieldOptions, data)
    },
    getLinkLabelKey(fieldOptions, data) {
      return FormUtils.getLinkLabelKey(fieldOptions, data)
    }
  }
}
</script>
