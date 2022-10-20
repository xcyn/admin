<template>
  <el-form
    ref="form"
    :model="formData"
    style="height:400px;"
    label-width="120px"
    size="mini"
    @submit.native.prevent
  >
    <el-form-item label-width="0">
      <el-button type="primary" icon="el-icon-plus" size="mini" @click="addCondition">添加条件</el-button>
    </el-form-item>
    <el-form-item label-width="0">
      <condition-group :fields="columns" :data.sync="conditionData" />
    </el-form-item>
  </el-form>
</template>
<script>
import ConditionGroup from './condition-group'

export default {
  components: {
    ConditionGroup
  },
  props: {
    data: {
      type: Object
    },
    fields: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      formData: {},
      conditionData: []
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
    }
  },
  watch: {
    data: {
      handler: function(val) {
        this.conditionData = val && val.fliter_conditon_config ? val.fliter_conditon_config : []
      },
      deep: true,
      immediate: true
    },
    conditionData: {
      handler: function(val) {
        this.$emit('callback', val)
      },
      deep: true,
      immediate: true
    }
  },
  beforeDestroy() {
  },
  methods: {
    filterSelectorFields(fields) {
      const filedTypes = ['date', 'number', 'varchar']
      const arr = fields.filter(f => filedTypes.includes(f.type) === true)
      return arr
    },
    addCondition() {
      const obj = {
        conditionData: [
          {
            selectField: '',
            selectCondition: '',
            conditionPrice: '',
            logic: 'or',
            dataType: 'varchar'
          }
        ],
        conditionColor: ''
      }
      this.conditionData.push(obj)
    }
  }
}
</script>
