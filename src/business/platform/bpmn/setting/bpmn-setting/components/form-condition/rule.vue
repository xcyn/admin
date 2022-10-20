<template>
  <fieldset class="scheduler-border">
    <legend style=" width: 90px;border-bottom:0;margin-bottom:10px;">
      <span :style="'marginLeft:8px;font-size:18px;'">规则设置</span>
    </legend>
    <ibps-rule-setting
      ref="ruleBuilder"
      v-model="rules"
      :filters="filters"
      :conditions="conditions"
      :control-types="controlTypes"
    />
  </fieldset>
</template>
<script>
import IbpsRuleSetting from '@/components/ibps-rule-setting'

export default {
  components: {
    IbpsRuleSetting
  },
  props: {
    fields: {
      type: Array,
      default: () => []
    },
    filters: {
      type: Array,
      default: () => []
    },
    value: {
      type: Object
    }
  },
  data() {
    return {
      controlTypes: {
        'text': '单行文本',
        'number': '数字',
        'radio': '单选框',
        'checkbox': '多选框',
        'select': '下拉框',
        'datePicker': '日期控件',
        'dictionary': '数据字典',
        'selector': '选择器',
        'customDialog': '自定义对话框',
        'linkdata': '关联数据'
      },
      formData: {
        label: '默认条件',
        key: '',
        rights: [],
        filter: {}
      },
      conditions: {
        'and': '并且',
        'or': '或者'
      },
      rules: {
        'condition': 'and',
        'rules': []
      }
    }
  },
  watch: {
    value: {
      handler(val, oldVal) {
        this.rules = val
      },
      deep: true,
      immediate: true
    }
  },
  beforeDestroy() {
    this.conditions = null
    this.controlTypes = null
    this.formData = null
    this.rules = null
  }
}
</script>
<style lang="scss">
  .scheduler-border {
      border: 1px groove #ddd !important;
      padding: 0 0.4em 1.4em 0.4em !important;
      margin-bottom: 10px;
  }

</style>
