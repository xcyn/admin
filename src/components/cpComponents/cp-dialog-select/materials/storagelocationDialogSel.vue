<template>
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
    @on-reset="reset"
  >
    <template slot="searchBar">
      <el-form-item label="仓库">
        <el-input v-model="stdWOProp.toolbarProp.searchData.searchKey" placeholder="请输入" />
      </el-form-item>
    </template>
  </z-dialog-table>
</template>
<script>
import * as storageLocationHttp from '@/api/cpApi/materialsManagement/basics/storageLocation'
import * as comnHttp from '@/api/cpApi/common/index'
export default {
  name: 'StoragelocationDialogSel',
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
    siteId: {
      type: String,
      default: ''
    },
    slAttr: {
      type: String,
      default: '1'
    }
  },

  data() {
    return {
      stdWOProp: {
        stations: [],
        title: '仓库选择',
        selectionHandle: this.stdWOSelection,
        key: 'slId',
        toolbarProp: {
          // 搜索数据
          searchData: {
            isOn: true,
            searchKey: ''
          }
        },
        // 表格属性
        tableProp: {
          multipleSelect: this.multipleSelect, // 是否可多选
          dataSource: storageLocationHttp.list, // 表格分页查询接口， Promise 对象
          paginationHandle: this.busiPagination, // 分页条件处理 返回分页查询条件
          columns: [
            // 显示列
            {
              title: '仓库编码',
              key: 'slNo'
            },
            {
              title: '仓库名称',
              key: 'slName'
            },
            {
              title: '所属场站',
              key: 'siteId',
              formatter: (row, column, cellValue) => {
                let val = cellValue
                this.stations.forEach(item => {
                  if (item.id == cellValue) {
                    val = item.name
                    return false
                  }
                })
                return val
              }
            },
            {
              title: '库管员',
              key: 'storekeeperName'
            },
            {
              title: '备注',
              key: 'memo'
            },
            {
              title: '状态',
              key: 'isOn',
              formatter: (row, column, cellValue) => {
                return cellValue ? '启用' : '停用'
              }
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
    // storageLocationHttp.list({
    //   isOn: true,
    //   pageSize: 1,
    //   pageNo: 20
    // }).then(res=>{
    // });;
    this.stations = this.$store.state.ibps.user.info.stationList
  },

  methods: {
    reset() {
      this.stdWOProp.toolbarProp.searchData.searchKey = ''
    },
    selectStdWO() {
      let selected = {
        key: 'slId',
        data: []
      }
      console.log(this.selectedNames)
      if (this.selectedIds != undefined && this.selectedNames != undefined) {
        let size = this.selectedIds.split(',').length
        for (var i = 0; i < size; i++) {
          selected.data.push({
            slId: this.selectedIds.split(',')[i],
            text: this.selectedNames.split(',')[i]
          })
        }
      }
      this.$refs.stdWODiaTb.open(selected)
      // 加载弹出框列表数据
      this.$nextTick(() => {
        setTimeout(() => {
          let pa = Object.assign(
            {
              isOn: true
            },
            this.initParam
          )
          if (this.siteId) {
            pa.siteId = this.siteId
          }
          pa.slAttr = this.slAttr
          this.$refs.stdWODiaTb.tableQuery(pa)
        }, 600)
      })
    },

    onStdWOSearch(params) {
      // 加载列表数据
      let pa = {
        searchKey: params.searchKey,
        slAttr: this.slAttr,
        isOn: true
      }
      if (this.siteId) {
        pa.siteId = this.siteId
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
      // 标准工单
      return selection.slName
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
