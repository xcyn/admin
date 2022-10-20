<template>
  <!-- 发票类型选择器 -->
  <z-dialog-table
    ref="stdWODiaTb"
    :title="stdWOProp.title"
    :key_="stdWOProp.key"
    :toolbar-prop="stdWOProp.toolbarProp"
    :table-prop="stdWOProp.tableProp"
    :tree-prop="stdWOProp.treeProp"
    :selection-handle="stdWOProp.selectionHandle"
    @toolbar-search="onStdWOSearch"
    @on-reset="reset"
    @ok="onStdWOOk"
  >
    <template slot="searchBar">
      <el-form-item label="发票类型">
        <el-input v-model="stdWOProp.toolbarProp.searchData.searchKey" placeholder="请输入" />
      </el-form-item>
    </template>
  </z-dialog-table>
</template>
<script>
import * as receiptTypeHttp from '@/api/cpApi/materialsManagement/basics/receiptType'
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
      stdWOProp: {
        title: '发票类型',
        selectionHandle: this.stdWOSelection,
        key: 'receTypeId',
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
          dataSource: receiptTypeHttp.list, // 表格分页查询接口， Promise 对象
          paginationHandle: this.busiPagination, // 分页条件处理 返回分页查询条件
          columns: [
            // 显示列
            {
              title: '发票类型编码',
              key: 'receNo'
            },
            {
              title: '发票类型名称',
              key: 'receName'
            },
            {
              title: '税率',
              key: 'rate'
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
    let param = { typeKey: 'gysjb' }
    dictHttp.getDictByTypeKey(param).then(ret => {
      this.suppLevelList = ret.data
    })

    param = { typeKey: 'gysfl' }
    dictHttp.getDictByTypeKey(param).then(ret => {
      this.suppTypeList = ret.data
    })
  },

  methods: {
    selectStdWO() {
      let selected = {
        key: 'receTypeId',
        data: []
      }
      if (this.selectedIds != undefined && this.selectedNames != undefined) {
        let size = this.selectedIds.split(',').length
        for (var i = 0; i < size; i++) {
          selected.data.push({
            receTypeId: this.selectedIds.split(',')[i],
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

    reset() {
      this.stdWOProp.toolbarProp.searchData.searchKey = ''
    },

    onStdWOSearch(params) {
      // 加载列表数据
      const pa = {
        searchKey: params.searchKey,
        isOn: true
      }
      if (!pa.searchKey) delete pa.searchKey
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
      if (selection) {
        return selection.receName
      }
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
