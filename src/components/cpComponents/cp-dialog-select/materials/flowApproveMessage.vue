<!--流程审核信息-->
<template>
  <div class="flowHistoryMain">
    <div class="form-title-small">流程审核信息</div>
    <el-row style="margin-top:10px">
      <el-table ref="table" border :data="tableData" tooltip-effect="dark" class="tableStyleA" :row-class-name="tableRowClassName">
        <el-table-column prop="taskName" label="环节名称" min-width="100" align="center" />
        <el-table-column prop="auditorName" label="处理人" min-width="80" align="center" />
        <el-table-column prop="createTime" label="创建时间" min-width="120" align="center" />
        <el-table-column prop="completeTime" label="处理时间" min-width="120" align="center" />
        <el-table-column label="处理意见" min-width="200" align="center">
          <template slot-scope="scope">
            <el-tooltip placement="top" effect="dark">
              <div slot="content">{{ scope.row.opinion }}</div>
              <span>{{ scope.row.opinion }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>
<script>
import {flowHistory} from '@/api/platform/bpmn/bpmInst'

export default {
  props: {
    id: {
      type: String,
      default: ''
    },
    defKey: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      tableData: []
    }
  },
  created(){
    if (this.id){
      this.getTableData()
    }
  },

  watch: {
    id (newName, oldName) {
      //if (this.$route.query.isView == 1) {
      if (this.id) {
        this.getTableData()
      }
      //}
    }
  },
  methods: {

    /**
     * 加载基础数据
     * @author mbb
     */
    getTableData () {
      flowHistory({ bizKey: this.id, defKey: this.defKey, ignoreInstIdNull: true }).then((res) => {
        this.tableData = res.data && res.data.length > 0 ? res.data : []
        // 删除最后一条pending状态
        if (this.tableData && this.tableData.length > 0) {
          if (this.tableData[this.tableData.length - 1].status == 'pending') { this.tableData.splice(this.tableData.length - 1, 1) }
        }
      })
    },

    // 表格斑马纹!
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex % 2 == 0) {
        return ''
      } else {
        return 'dark-row'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.flowHistoryMain {
  width: calc(100% - 10px);
  min-height: calc(100% - 20px);
  margin: 10px 0;
  height: inherit;
  background: #fff;
  overflow: hidden;
}

.tableStyleA {
  width: 100%;
  /* height: 200px; */
  min-height: 100px;
  overflow-y: auto !important;
}
.form-title-small {
  margin-top: 10px;
  border-left: 4px solid #188ae2;
  padding-left: 8px;
  color: #666;
  margin: 10px 0;
  font-size: 16px;
  float: left;
}
</style>
