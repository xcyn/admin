<template>
  <div>

    <el-table
      ref="table"
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      default-expand-all
      :span-method="arraySpanMethod"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column
        prop="date"
        label="日期"
        sortable
        width="180"
      >
        <template slot-scope="scope">
          <span v-if="$utils.isEmpty(scope.row.children)">{{ scope.row.date }}</span>
          <span v-else>{{ scope.row.desc }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        sortable
        width="180"
      />
      <el-table-column
        prop="address"
        label="地址"
      />
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [{
        id: 1,
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        id: 2,
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        id: 3,
        desc: '顶部树形分组下拉显示：',
        children: [{
          id: 31,
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          id: 32,
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }]
      }, {
        id: 4,
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]

    }
  },
  methods: {
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (this.$utils.isNotEmpty(row.children)) {
        if (columnIndex === 0) {
          const index = this.$refs.table.columns.length
          return [1, index]
        } else if (columnIndex === 1) {
          return [0, 0]
        }
      }
    }
  }
}
</script>
