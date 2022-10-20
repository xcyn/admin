<template>
  <el-dialog
    ref="editFormDialog"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="title"
    :width="width"
    class="edit-dialog"
    top="5vh"
    append-to-body
    @close="closeDialog"
  >
    <el-button icon="el-icon-circle-plus-outline" size="small" type="primary" @click="handleAdd">添加参数</el-button>
    <el-table
      :data="tableData"
      :empty-text="'请添加参数'"
      height="300px"
      border
      style="width: 100%;margin-top:10px;"
    >
      <el-table-column
        label="查询字段"
      >
        <template slot-scope="scope">
          <el-select v-model="scope.row['paramsFiledName']" placeholder="请选择" style="width:100%;" @change="value=>checkFields(value,scope.$index)">
            <el-option
              v-for="item in fieldsOption"
              :key="item.value"
              :label="item.label"
              :value="item"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        label="约束条件"
      >
        <template slot-scope="scope">
          <el-select
            v-model="scope.row['constraint']"
            style="width:100%;"
            placeholder="请选择"
            @change="data =>changeConstraint(data,scope.$index)"
          >
            <el-option
              v-for="item in filterconstraintOptions(scope.row.filed_type)"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="赋值方式">
        <template slot-scope="scope">
          <el-select
            v-model="scope.row['givePriceWay']"
            placeholder="请选择"
            style="width:100%;"
            @change="data =>changeGivePriceWay(data,scope.$index)"
          >
            <el-option
              v-for="item in givePriceWayOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        label="值"
      >
        <template slot-scope="scope">
          <el-input v-if="scope.row.filed_type!=='date'||scope.row.givePriceWay==='javaScript'" v-model="scope.row['paramsFiledValue']" :type="scope.row.givePriceWay==='fixed'?'text':'textarea'" @change="data => scope.row.paramsFiledValue = data" />
          <el-date-picker
            v-if="scope.row.filed_type==='date'&&scope.row.constraint!=='middle'&&scope.row.givePriceWay==='fixed'"
            v-model="scope.row['paramsFiledValue']"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            style="width:100%;"
          />
          <el-date-picker
            v-if="scope.row.filed_type==='date'&&scope.row.constraint==='middle'&&scope.row.givePriceWay==='fixed'"
            v-model="scope.row['paramsFiledValue']"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width:100%;"
            value-format="yyyy-MM-dd"
          />
        </template>
      </el-table-column>
      <el-table-column label="管理" width="100">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            icon="ibps-icon-delete"
            @click="handleDelete(scope.$index, tableData)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>
<script>
import { stringConstraintOptions, dateConstraintOptions } from './constants'
export default {
  props: {
    title: {
      type: String
    },
    width: {
      type: String,
      default: '85%'
    },
    data: {
      type: Array
    },
    fields: {
      type: Array,
      default: () => []
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formName: 'form',
      tableData: [],
      dialogVisible: false,
      dateConstraintOptions,
      stringConstraintOptions,
      givePriceWayOptions: [
        {
          value: 'fixed',
          label: '固定值'
        },
        {
          value: 'javaScript',
          label: '脚本'
        }
        // {
        //   value: 'groovy',
        //   label: 'Groovy脚本值'
        // }
      ],
      fieldsOption: [],
      toolbars: [
        { key: 'confirm' },
        { key: 'cancel' }
      ]
    }
  },
  computed: {
  },
  watch: {
    data: {
      handler(val) {
        if (val) {
          this.tableData = JSON.parse(JSON.stringify(val))
        }
      },
      immediate: true
    },
    visible: {
      handler(val) {
        this.dialogVisible = val
      },
      immediate: true
    },
    dialogVisible: {
      handler(val) {
        this.$emit('update:visible', val)
      },
      immediate: true
    },
    fields: {
      handler(val) {
        this.fieldsOption = val.map(v => {
          return {
            label: v.label,
            value: v.name,
            filed_type: v.type
          }
        })
      },
      immediate: true,
      deep: true
    }
  },
  beforeDestroy() {
    this.conditions = null
    this.formData = null
    this.rules = null
  },
  methods: {
    // 关闭当前窗口
    closeDialog() {
      this.dialogVisible = false
    },
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
    handleAdd() {
      const rowParams = {
        paramsFiledName: '',
        paramsField: '',
        constraint: 'equalTo',
        paramsFiledValue: '',
        givePriceWay: 'fixed',
        filed_type: ''
      }
      this.tableData.push(rowParams)
    },
    checkFields(data, index) {
      const obj = {
        paramsFiledName: data.label,
        paramsField: data.value,
        constraint: 'equalTo',
        paramsFiledValue: '',
        givePriceWay: 'fixed',
        filed_type: data.filed_type
      }
      this.tableData.splice(index, 1, obj)
    },
    filterconstraintOptions(type) {
      const constraintOptions = type === 'date' ? this.dateConstraintOptions : this.stringConstraintOptions
      return constraintOptions
    },
    handleConfirm() {
      const tableData = this.tableData
      let check = true
      let text = ''
      for (var t = 0; t < tableData.length; t++) {
        if (tableData[t].paramsFiledValue === '') {
          check = false
          text = tableData[t].paramsFiledName + '字段的值不能为空！'
          break
        }
      }
      if (!check) {
        this.$message({
          message: text,
          type: 'warning'
        })
        return
      }
      this.dialogVisible = false
      this.$emit('callback', 'default_query_condition', tableData)
    },
    handleDelete(index, row) {
      row.splice(index, 1)
    },
    changeConstraint(data, index) {
      this.tableData[index].constraint = data
      this.tableData[index].paramsFiledValue = ''
    },
    changeGivePriceWay(data, index) {
      this.tableData[index].paramsFiledValue = ''
    },
    // 是否禁用
    isDisabled(key) {
      if (this.$utils.isEmpty(this.tableData)) {
        return false
      } else {
        const tableData = this.tableData
        return !!tableData.find((column) => {
          return column.paramsField === key
        })
      }
    }
  }
}
</script>
