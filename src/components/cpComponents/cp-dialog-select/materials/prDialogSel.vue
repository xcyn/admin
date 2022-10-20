<template>
  <!-- 采购结果选择器 -->
  <z-dialog-table
    ref="stdWODiaTb"
    :title="stdWOProp.title"
    :key_="stdWOProp.key"
    :toolbar-prop="stdWOProp.toolbarProp"
    :table-prop="stdWOProp.tableProp"
    :tree-prop="stdWOProp.treeProp"
    :selection-handle="stdWOProp.selectionHandle"
    @toolbar-search="onStdWOSearch"
    @ok="onStdWOOk"
  >
    <template slot="searchBar">
      <el-form-item label="采购结果">
        <el-input v-model="stdWOProp.toolbarProp.searchData.searchKey" placeholder="请输入" />
      </el-form-item>
    </template>
  </z-dialog-table>
</template>
<script>
import * as prHttp from '@/api/cpApi/materialsManagement/stock/pr'
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
    }
  },

  data() {
    return {
      stations: [],
      sourceList: [],
      stdWOProp: {
        title: '采购结果',
        selectionHandle: this.stdWOSelection,
        key: 'suppId',
        toolbarProp: {
          // 搜索数据
          searchData: {
            searchKey: ''
          }
        },
        // 表格属性
        tableProp: {
          multipleSelect: this.multipleSelect, // 是否可多选
          dataSource: prHttp.list, // 表格分页查询接口， Promise 对象
          paginationHandle: this.busiPagination, // 分页条件处理 返回分页查询条件
          columns: [
            // 显示列
            {
              title: '采购来源',
              key: 'source',
              formatter: (row, col, val) => {
                this.sourceList.forEach(item => {
                  if (item.key == val) {
                    val = item.name
                    return false
                  }
                })
                return val
              }
            },
            {
              title: '是否直发场站',
              key: 'sendDirectly',
              formatter: (row, column, cellValue) => {
                return cellValue ? '是' : '否'
              }
            },
            {
              title: '采购订单号',
              key: 'prNo'
            },
            {
              title: '采购结果描述',
              key: 'prDesc'
            },
            {
              title: '需求场站',
              key: 'siteId',
              formatter: (row, col, val) => {
                this.stations.forEach(item => {
                  if (item.id == val) {
                    val = item.name
                    return false
                  }
                })
                return val
              }
            },
            {
              title: '供应商',
              key: 'winningSupplierName'
            },
            {
              title: '合同号',
              key: 'contractNo'
            },
            {
              title: '订货日期',
              key: 'orderDate'
            },
            {
              title: '约定到货日期',
              key: 'agreedDeliveryDate'
            }
          ]
        },
        // 树控件属性
        treeProp: {
          show: false
        }
      }
    }
  },

  mounted() {
    // 场站字典
    this.stations = this.$store.state.ibps.user.info.stationList

    // 采购来源字典
    let param = { typeKey: 'cgly' }
    dictHttp.getDictByTypeKey(param).then(ret => {
      this.sourceList = ret.data
    })
  },

  methods: {
    selectStdWO() {
      let selected = {
        key: 'prId',
        data: []
      }
      if (this.selectedIds != undefined && this.selectedNames != undefined) {
        let size = this.selectedIds.split(',').length
        for (var i = 0; i < size; i++) {
          selected.data.push({
            suppId: this.selectedIds.split(',')[i],
            text: this.selectedNames.split(',')[i]
          })
        }
      }
      this.$refs.stdWODiaTb.open(selected)
      // 加载弹出框列表数据
      this.$nextTick(() => {
        setTimeout(() => {
          const pa = Object.assign(
            {
              isOn: true
            },
            this.initParam
          )
          this.$refs.stdWODiaTb.tableQuery(pa)
        }, 600)
      })
    },

    onStdWOSearch(params) {
      // 加载列表数据
      const pa = {
        searchKey: params.searchKey
      }
      this.$refs.stdWODiaTb.tableQuery(pa)
    },

    /**
     * 返回分页条件
     */
    busiPagination(pagination) {
      return { pageNo: pagination.pageNo, limit: pagination.limit }
    },

    /**
     * 处理勾选数据展示
     */
    stdWOSelection(selection) {
      return selection.prDesc
    },

    /**
     * 弹出表格确定事件
     */
    onStdWOOk(seleted) {
      this.$emit('onDTableOk', seleted)
    },

    init() {
      this.selectStdWO()
    }
  }
}
</script>
<style scoped>
@import url("../dialog.css");
</style>
