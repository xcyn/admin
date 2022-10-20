<template>
  <!-- 借用申请物资明细选择器 -->
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="70%"
      :modal="true"
      :show-close="true"
      :close-on-click-modal="false"
      @close="handleDialogClose"
    >
      <div slot="title">
        <span>物资明细</span>
      </div>
      <el-table :data="tableData" @selection-change="handleItemsSelectionChange">
        <el-table-column type="selection" width="60" />
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="item.itemNo" label="物资编码" width="120">
          <template scope="scope">
            <el-tooltip
              v-if="scope.row.isError"
              :content="scope.row.errMsg"
              placement="top"
              style="margin-right:5px;"
            >
              <a>
                <i style="color:#F56C6C;" class="el-icon-warning" />
              </a>
            </el-tooltip>
            <span :style="{color:scope.row.isError?'#F56C6C':'#000'}">{{ scope.row.item.itemNo }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="item.itemDesc" label="物资描述" />
        <el-table-column prop="stock.storehouseDO.hjh" label="所在仓位" />
        <el-table-column prop="stock.winningSupplierName" label="供应商" />
        <el-table-column label="计量单位" width="80">
          <template scope="scope">
            <span>{{ fomatBaseUnit(scope.row.item.baseUnit) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="stock.batch" label="批次" />
        <el-table-column prop="stock.price" label="不含税单价" />
        <el-table-column prop="stockQuantity" label="库存数量" />
        <el-table-column prop="quantity" label="借用数量" />
        <el-table-column label="金额（含税）" width="130">
          <template scope="scope">
            <span>{{ (scope.row.stock.price * scope.row.quantity * (1 + scope.row.stock.rate / 100)).toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="金额（不含税）" width="130">
          <template scope="scope">
            <span>{{ (scope.row.stock.price * scope.row.quantity).toFixed(2) }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onStdWOOk()">确定</el-button>
        <el-button @click="dialogVisible=false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import * as borrowHttp from '@/api/cpApi/materialsManagement/stock/borrow'
import * as comnHttp from '@/api/cpApi/common/index'
import * as dictHttp from '@/api/cpApi/dict/index'
export default {
  props: {
    multipleSelect: {
      type: Boolean,
      default: true
    },
    initParam: {
      type: Object,
      default: null
    },
    selectedIds: {
      type: String
    },
    selectedNames: {
      type: String
    },
    borrowId: {
      type: String
    }
  },

  data() {
    return {
      baseUnitList: [],
      dialogVisible: false,
      tableData: [],
      choseData: [],
      winningSupplier: '',
      winningSupplierName: ''
    }
  },

  mounted() {
    // 计量单位
    let param = { typeKey: 'jldw' }
    dictHttp.getDictByTypeKey(param).then(ret => {
      this.baseUnitList = ret.data
    })
  },

  methods: {
    selectStdWO() {
      // 加载弹出框列表数据
      this.$nextTick(() => {
        setTimeout(() => {
          borrowHttp.detail(this.borrowId).then(res => {
            this.tableData = res.data.borrowItemList
            this.winningSupplier = res.data.winningSupplier
            this.winningSupplierName = res.data.winningSupplierName
          })
        }, 600)
      })
    },

    // 计量单位匹配
    fomatBaseUnit(val) {
      this.baseUnitList.forEach(item => {
        if (item.key == val) {
          val = item.name
          return false
        }
      })
      return val
    },

    /**
     * 弹出表格确定事件
     */
    onStdWOOk() {
      this.choseData.forEach(item => {
        item.winningSupplier = this.winningSupplier
        item.winningSupplierName = this.winningSupplierName
      })
      this.$emit('onDTableOk', this.choseData)
      this.handleDialogClose()
    },

    init() {
      this.dialogVisible = true
      this.selectStdWO()
    },
    handleItemsSelectionChange(data) {
      this.choseData = data
    },
    handleDialogClose() {
      this.dialogVisible = false
    }
  }
}
</script>
<style scoped>
@import url("../dialog.css");
</style>
