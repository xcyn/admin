<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :title="title"
    width="70%"
    top="10vh"
    append-to-body
    class="bpmn-node-user-dialog"
    @close="closeDialog"
    @open="getFormData"
  >
    <!--表单规则-->
    <rule-setting
      v-if="$utils.isNotEmpty(filters)"
      v-model="rules"
      :filters="filters"
    />
    <div
      v-else
      class="text"
      v-html="'提示：设置人员规则时，流程需先绑定业务对象。'"
    />
    <!--用户设置-->
    <user-setting
      v-model="userCalcs"
      :plugin-type-options="pluginTypeOptions"
      :logic-cal-options="logicCalOptions"
      :extract-optins="extractOptins"
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
import RuleSetting from './form-condition/rule'
import UserSetting from './user-setting'
import { pluginTypeOptions, logicCalOptions, extractOptins } from './user-setting/constants'
import { mapState } from 'vuex'
import QueryBuilder from '@/components/ibps-rule-setting/constants'

export default {
  components: {
    RuleSetting,
    UserSetting
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: String,
    data: {
      type: Object
    }
  },
  data() {
    return {
      pluginTypeOptions,
      logicCalOptions,
      extractOptins,
      dialogVisible: this.visible,
      userCalcs: [],
      condition: {},
      buttonDisable: false,
      toolbars: [
        { key: 'confirm', label: '确定' },
        { key: 'cancel' }
      ],
      rules: {
        condition: 'and',
        rules: []
      }
    }
  },
  computed: {
    ...mapState({
      boDefData: state => state.ibps.bpmn.boDefData
    }),
    filters() {
      let filters = []
      const _boDefData = JSON.parse(JSON.stringify(this.boDefData))
      filters = _boDefData.filter(item => {
        // return item.attrType !== 'table' && item.attrType !== 'subTable'
        // return item.attrType === 'field' || item.attrType === 'subField' // 隐藏子表的字段
        return item.attrType === 'field'
      })
      return filters
    },
    pluginTypeMap() {
      const pluginTypeMap = {}
      this.pluginTypeOptions.forEach(item => {
        pluginTypeMap[item.value] = item
      })
      return pluginTypeMap
    },
    logicCalMap() {
      const logicCalMap = {}
      this.logicCalOptions.forEach(item => {
        logicCalMap[item.value] = item
      })
      return logicCalMap
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.buttonDisable = false
        this.dialogVisible = this.visible
      },
      immediate: true
    }
  },
  beforeDestroy() {
    this.pluginTypeOptions = null
    this.logicCalOptions = null
    this.extractOptins = null
    this.userCalcs = null
    this.condition = null
    this.rules = null
  },
  methods: {
    handleActionEvent({ key }) {
      switch (key) {
        case 'confirm':
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
      this.buttonDisable = true
      this.$emit('close', false)
    },
    getDescription() {
      // 规则拼装
      // ==============TODO:人员规则====
      // 拼装描述

      let description = ''
      this.userCalcs.forEach((item) => {
        description = description + '【' + this.pluginTypeMap[item.pluginType].label + '】' +
                   item.description + '（' + this.logicCalMap[item.logicCal].label + '） ;　'
      })

      return description
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
    handleConfirm() {
      if (this.buttonDisable) {
        return
      }
      if (this.userCalcs.length < 1) {
        this.$message.closeAll()
        this.$message({
          message: '请添加人员配置项',
          type: 'warning'
        })
        return
      }
      for (var i = 0; i < this.userCalcs.length; i++) {
        // 如果 配置条件为空 则return
        if (!this.userCalcs[i]['description']) {
          this.$message.closeAll()
          this.$message({
            message: `第${i + 1}行人员配置无效,请检查。`,
            type: 'warning'
          })
          return
        }
      }
      const rules = JSON.parse(JSON.stringify(this.rules))
      const flag = this.validateRuleSettings(rules.rules)
      if (flag) {
        this.$message.closeAll()
        this.$message({
          message: `规则设置存在未填的选项,请检查。`,
          type: 'warning'
        })
        return
      }
      const data = {
        calcs: this.userCalcs,
        condition: this.getCondition(rules),
        conditionMode: '',
        description: this.getDescription(),
        groupNo: this.data.groupNo || 1
      }
      this.resetData()
      this.$emit('callback', data)
      this.closeDialog()
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
            conDesc: `[${item.name}]  ${this.$t('components.query-builder.operators.' + item.operator)}  [${item.valueText}]`,
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
            // temp.selectorId = item.executorVar.value
          }
        }

        _rules.push(temp)
      })

      _data.rules = _rules
      return _data
    },
    getFormData() {
      if (this.$utils.isNotEmpty(this.data)) {
        const _condition = this.data.condition
        if (this.$utils.isEmpty(_condition)) {
          this.condition = []
        } else if (this.$utils.isString(_condition)) {
          this.condition = JSON.parse(_condition)
        } else if (this.$utils.isArray(_condition)) {
          this.condition = JSON.parse(JSON.stringify(_condition))
        } else {
          this.condition = []
        }

        if (this.$utils.isEmpty(this.condition)) {
          this.resetData()
        } else {
          this.rules = this.setRules(this.condition)
        }
        this.userCalcs = JSON.parse(JSON.stringify(this.data.calcs))
      } else {
        this.resetData()
        this.userCalcs = []
      }
    },
    resetData() {
      this.condition = {}
      this.rules = {
        condition: 'and',
        rules: []
      }
    }
  }
}
</script>
<style lang="scss">
.bpmn-node-user-dialog{
 .el-dialog{
  .el-dialog__body{
    height: 60vh;
  }
  }
  .text{
    font-size: 16px;
    padding-bottom: 10px;
  }
}
</style>
