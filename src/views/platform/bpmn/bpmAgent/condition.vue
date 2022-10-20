<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="closeOnClickModal"
    title="添加条件"
    width="70%"
    class="dialog bpmn-agenter-dialog"
    append-to-body
    @open="open"
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
      <el-form-item label="代理人" prop="agenterId">
        <ibps-employee-selector
          v-model="form.agenterId"
          @callback="getAgenter"
        />
      </el-form-item>
      <el-form-item label="条件名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入内容" />
      </el-form-item>
      <el-form-item label="条件描述" prop="desc">
        <el-input v-model="form.desc" :rows="2" placeholder="请输入内容" type="textarea" />
      </el-form-item>
    </el-form>

    <!-- <form-rule
      :def-id="defId"
      :value="form.condition"
    /> -->
    <rule-setting
      v-if="$utils.isNotEmpty(filters)"
      v-model="condition"
      :filters="filters"
    />
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>

<script>
import IbpsEmployeeSelector from '@/business/platform/org/employee/selector'
// import FormRule from '@/business/platform/form/rule'
import ActionUtils from '@/utils/action'
import RuleSetting from '@/business/platform/bpmn/setting/bpmn-setting/components/form-condition/rule'
import QueryBuilder from '@/components/ibps-rule-setting/constants'
export default {
  components: {
    IbpsEmployeeSelector,
    // FormRule,
    RuleSetting
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    boDefData: {
      type: Array,
      default: () => []
    },
    value: {
      type: Object,
      default: () => {}
    },
    defId: String
    // code: String
  },
  data() {
    return {
      dialogVisible: this.visible,
      closeOnClickModal: false,
      formLabelWidth: '120px',
      formName: 'form',
      dialogLoading: false,
      form: {
        id: '',
        agenterId: '',
        agenterName: '',
        name: '',
        desc: '',
        condition: {}
      },
      rules: {
        agenterId: [{ required: true, message: this.$t('validate.required') }],
        name: [{ required: true, message: this.$t('validate.required') }]
      },
      toolbars: [
        { key: 'save', label: '确定' },
        { key: 'cancel' }
      ],
      condition: {
        condition: 'and',
        rules: []
      }
    }
  },
  computed: {
    filters() {
      let filters = []
      const _boDefData = JSON.parse(JSON.stringify(this.boDefData))
      filters = _boDefData.filter(item => {
        // return item.attrType !== 'table' && item.attrType !== 'subTable'
        // return item.attrType === 'field' || item.attrType === 'subField' // 隐藏子表的字段
        return item.attrType === 'field'
      })
      return filters
    }
  },
  watch: {
    value: {
      handler: function(val, oldVal) {
        if (this.$utils.isNotEmpty(val)) {
          this.form = JSON.parse(JSON.stringify(val))
        }
      },
      immediate: true
    },
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
      },
      immediate: true
    },
    form: {
      handler: function(val, oldVal) {
        if (val.agenterId !== '') {
          this.$nextTick(() => {
            this.$refs[this.formName].clearValidate('agenterId')
          })
        } else {
          this.formValidate()
        }
      },
      deep: true
    }
  },
  methods: {
    getAgenter(data) {
      this.form.agenterName = data.name
    },
    open() {
      this.formValidate()
      this.getFormData()
    },
    /**
     * 表单验证
     */
    formValidate() {
      if (this.readonly) return
      this.$nextTick(() => {
        this.$refs[this.formName].validate(() => {})
      })
    },
    handleActionEvent({ key }) {
      switch (key) {
        case 'save':
          this.handleConfirm()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
      this.resetData()
    },
    handleConfirm() {
      this.$refs[this.formName].validate(valid => {
        if (valid) {
          const rules = JSON.parse(JSON.stringify(this.condition))
          const flag = this.validateRuleSettings(rules.rules)
          if (flag) {
            this.$message.closeAll()
            this.$message({
              message: `规则设置存在未填的选项,请检查。`,
              type: 'warning'
            })
            return
          }
          this.form.condition = JSON.stringify(this.getCondition(rules))
          this.$emit('callback', JSON.parse(JSON.stringify(this.form)))
          this.resetData()
        } else {
          ActionUtils.saveErrorMessage()
        }
      })
    },
    // 获取规则设置
    getCondition(rules) {
      const _condition = []
      if (this.$utils.isEmpty(rules.rules)) return _condition
      rules.rules.forEach(item => {
        let temp = {}
        if (this.$utils.isNotEmpty(item.condition)) { // 复合规则
          temp = {
            branch: true,
            compType: rules.condition,
            sub: this.getCondition(item)
          }
        } else if (item.ruleType === '2') {
          temp = item
          temp.compType = rules.condition
        } else {
          if (this.$utils.isEmpty(item.valueText)) {
            item.valueText = item.value
          }
          const executorVar = {
            executorType: item.source,
            value: item.value,
            valueText: item.valueText
          }
          if (item.attrType === 'field') {
            executorVar.name = item.tableName + '.' + item.key
            executorVar.source = 'boVar'
          } else if (item.attrType === 'var') {
            executorVar.name = item.key
            executorVar.source = 'flowVar'
          } else if (item.attrType === 'bpmConstants') {
            executorVar.name = item.key
            executorVar.source = 'consVar'
          }
          if (this.$utils.isNotEmpty(item.valType)) {
            executorVar.valType = item.valType
          }
          temp = {
            compType: rules.condition,
            // conDesc: `[${item.name}]  ${this.$t('components.query-builder.operators.' + item.operator)}  [${item.valueText}]`,
            conDesc: `[${item.name}]  ${QueryBuilder.operatorLabel(item.operator)}  [${item.valueText}]`,
            dataType: item.type,
            // expression: item.operator,
            ruleType: item.ruleType,
            executorVar: executorVar
          }
          const operator = this.getOperator('type', item.operator)
          if (this.$utils.isNotEmpty(operator)) {
            temp.expression = operator.value
          }
        }
        _condition.push(temp)
      })
      return _condition
    },
    // 通过key和val获取QueryBuilder.OPERATORS的数据
    getOperator(key, val) {
      if (this.$utils.isNotEmpty(val)) {
        val = val.replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      }
      const arr = Object.keys(QueryBuilder.OPERATORS)
      for (let i = 0; i < arr.length; i++) {
        const operator = QueryBuilder.OPERATORS[arr[i]]
        if (operator[key] === val) {
          return operator
        }
      }
      return null
    },
    // 通过key获取filters的数据
    getDataBykey(key) {
      const filters = this.filters
      return filters.find((el) => (el.key === key))
    },
    setRules(condition) {
      const _data = {}
      if (this.$utils.isEmpty(condition) || condition.length === 0) return _data
      _data.condition = condition[0].compType
      const _rules = []
      condition.forEach(item => {
        let temp = {}
        if (this.$utils.isNotEmpty(item.sub)) {
          temp = this.setRules(item.sub)
        } else if (item.ruleType === '2') {
          temp = item
        } else {
          temp = {
            source: item.executorVar.executorType,
            value: item.executorVar.value,
            valueText: item.executorVar.valueText,
            key: item.executorVar.name,
            ruleType: item.ruleType,
            // operator: item.expression,
            type: item.dataType
          }
          const operator = this.getOperator('value', item.expression)
          if (this.$utils.isNotEmpty(operator)) {
            temp.operator = operator.type
          }
          let key = item.executorVar.name
          if (key.indexOf('.') !== -1) {
            const arr = key.split('.')
            temp.key = arr[1]
            temp.tableName = arr[0]
            key = arr[1]
          }
          const _filter = this.getDataBykey(key)
          if (this.$utils.isNotEmpty(_filter)) {
            temp.name = _filter.name
            temp.id = _filter.id
            temp.attrType = _filter.attrType
            temp.format = _filter.format
            temp.controlTypes = _filter.controlTypes
          }

          if (this.$utils.isNotEmpty(item.executorVar.valType)) {
            temp.valType = item.executorVar.valType
            temp.selectorId = item.executorVar.value
          }
        }

        _rules.push(temp)
      })

      _data.rules = _rules
      return _data
    },
    getFormData() {
      if (this.$utils.isNotEmpty(this.form)) {
        if (this.$utils.isEmpty(this.form.condition)) {
          this.resetData()
        } else {
          let data = []
          const _condition = this.form.condition
          if (this.$utils.isEmpty(_condition)) {
            data = []
          } else if (this.$utils.isString(_condition)) {
            data = JSON.parse(_condition)
          } else if (this.$utils.isArray(_condition)) {
            data = JSON.parse(JSON.stringify(_condition))
          } else {
            data = []
          }
          if (this.$utils.isEmpty(data)) {
            this.resetData()
          } else {
            this.condition = this.setRules(data)
          }
        }
      } else {
        this.resetData()
      }
    },
    // 验证规则设置是否存在未填选项
    validateRuleSettings(rules) {
      for (var i = 0; i < rules.length; i++) {
        if (this.$utils.isNotEmpty(rules[i].rules)) {
          const flag = this.validateRuleSettings(rules[i].rules)
          if (flag) return true
        } else if (rules[i].ruleType === '1' && this.$utils.isEmpty(rules[i].value)) {
          return true
        }
      }
      return false
    },
    resetData() {
      this.form = {
        id: '',
        agenterId: '',
        agenterName: '',
        name: '',
        desc: '',
        condition: {}
      }
      this.condition = {
        condition: 'and',
        rules: []
      }
    }
  }
}
</script>
<style lang="scss">
.bpmn-agenter-dialog{
  .el-dialog{
    .el-dialog__body{
      max-height: 60vh;
    }
  }
}
</style>
