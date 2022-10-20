<template>
  <div>
    <z-dialog-table
      ref="stdWODiaTb"
      :title="stdWOProp.title"
      :key_="stdWOProp.key"
      :toolbar-prop="stdWOProp.toolbarProp"
      :table-prop="stdWOProp.tableProp"
      :tree-prop="stdWOProp.treeProp"
      :selection-handle="stdWOProp.selectionHandle"
      @tree-click="onTreeClick"
      @toolbar-search="onStdWOSearch"
      @on-reset="reset"
      @ok="onStdWOOk"
    >
      <template slot="searchBar">
        <el-form-item label="物资">
          <el-input
            v-model="stdWOProp.toolbarProp.searchData.itemSearchKey"
            clearable
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="所属场站">
          <el-select
            v-model="stdWOProp.toolbarProp.searchData.siteId"
            clearable
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="(item,index) of stations"
              :key="index"
              :value="item.id"
              :label="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="!searchSlId" label="所在仓库">
          <template>
            <el-input
              v-model="stdWOProp.toolbarProp.searchData.slName"
              placeholder="请选择所属仓库"
              clearable
              @click.native="selectStorageLocationGrid"
            >
              <el-button slot="append" icon="el-icon-plus" @click="selectStorageLocationGrid" />
            </el-input>
          </template>
        </el-form-item>
      </template>
    </z-dialog-table>
    <!-- 仓库弹出框 -->
    <storagelocation-dialog-sel
      ref="storageLocationDialogTable"
      :multiple-select="false"
      @onDTableOk="onStorageLocationDialogTableOk"
    />
  </div>
</template>
<script>
import * as materialClassifyHttp from '@/api/cpApi/materialsManagement/basics/materialClassify'
import * as stockHttp from '@/api/cpApi/materialsManagement/stock/stock'
import * as dictHttp from '@/api/cpApi/dict/index'
import * as comnHttp from '@/api/cpApi/common/index'
import storagelocationDialogSel from './storagelocationDialogSel.vue'

export default {
  components: { storagelocationDialogSel },
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
    searchSlId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      stations: [],
      stdWOProp: {
        title: '库存数据',
        baseUnitList: [],
        selectionHandle: this.stdWOSelection,
        key: 'itemId',
        toolbarProp: {
          // 搜索数据
          searchData: {
            itemSearchKey: '',
            siteId: '',
            slId: '',
            icId: '',
            slName: ''
          }
        },
        // 表格属性
        tableProp: {
          multipleSelect: this.multipleSelect, // 是否可多选
          dataSource: stockHttp.overall, // 表格分页查询接口， Promise 对象
          paginationHandle: this.busiPagination, // 分页条件处理 返回分页查询条件
          columns: [
            // 显示列
            {
              title: '物资编码',
              key: 'itemNo'
            },
            {
              title: '物资名称',
              key: 'item.itemName'
            },
            {
              title: '规格型号',
              key: 'item.modelNo'
            },
            {
              title: '物资分类',
              key: 'item.icName'
            },
            {
              title: '所属分组',
              key: 'item.igName'
            },
            {
              title: '批次',
              key: 'batch'
            },
            {
              title: '计量单位',
              key: 'item.baseUnit',
              formatter: (row, col, val) => {
                this.baseUnitList.forEach(item => {
                  if (item.id == val) {
                    val = item.name
                    return false
                  }
                })
                return val
              }
            },
            {
              title: '所属场站',
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
              title: '所属仓库',
              key: 'slName'
            },
            {
              title: '库存数量',
              key: 'quantity'
            }
          ]
        },
        // 树控件属性
        treeProp: {
          title: '物资分类',
          nodeKey: 'icId',

          multipleSelect: false,
          treeData: this.dialogloadTreeData,
          lazyLoad: false,
          propMapping: {
            // 根据返回值的映射
            label: 'icName',
            children: 'children'
          }
        }
      }
    }
  },

  mounted() {
    this.getDictByTypeKey()
  },

  methods: {
    /**
     * 仓库选择
     */
    selectStorageLocationGrid() {
      this.$refs.storageLocationDialogTable.init()
    },
    reset() {
      this.stdWOProp.toolbarProp.searchData.itemSearchKey = ''
      this.stdWOProp.toolbarProp.searchData.siteId = ''
      this.stdWOProp.toolbarProp.searchData.slId = ''
      this.stdWOProp.toolbarProp.searchData.icId = ''
      this.stdWOProp.toolbarProp.searchData.slName = ''
    },
    /**
     * 仓库选择回调
     */
    onStorageLocationDialogTableOk(selectData) {
      console.log('--------仓库确定事件--------', selectData)
      console.log(selectData)
      // 确认返回
      if (selectData.length == 1) {
        let column = selectData[0].column
        this.stdWOProp.toolbarProp.searchData.slId = column.slId
        this.stdWOProp.toolbarProp.searchData.slName = column.slName
        this.$forceUpdate()
      }
    },
    getDictByTypeKey() {
      let param = { typeKey: 'jldw' }
      dictHttp.getDictByTypeKey(param).then(ret => {
        this.baseUnitList = ret.data
      })

      this.stations = this.$store.state.ibps.user.info.stationList
    },
    dialogloadTreeData(node, resolve, loadDone) {
      materialClassifyHttp.tree().then(res => {
        resolve(res.data.children)
        loadDone()
      })
    },
    onTreeClick(node) {
      console.log(node)
      const pa = Object.assign(
        {
          icId: node.icId
        },
        this.initParam
      )
      if (this.searchSlId) {
        pa.slId = this.searchSlId
      }
      this.$refs.stdWODiaTb.tableQuery(pa)
    },
    selectStdWO() {
      let selected = {
        key: 'itemId',
        data: []
      }
      if (this.selectedIds != undefined && this.selectedNames != undefined) {
        let size = this.selectedIds.split(',').length
        for (var i = 0; i < size; i++) {
          selected.data.push({
            stdWoId: this.selectedIds.split(',')[i],
            text: this.selectedNames.split(',')[i]
          })
        }
      }
      this.$refs.stdWODiaTb.open(selected)
      // 加载弹出框列表数据
      this.$nextTick(() => {
        setTimeout(() => {
          const pa = Object.assign({}, this.initParam)
          if (this.searchSlId) {
            pa.slId = this.searchSlId
          }
          this.$refs.stdWODiaTb.tableQuery(pa)
        }, 600)
      })
    },

    onStdWOSearch(params) {
      // 加载列表数据
      this.$refs.stdWODiaTb.tableQuery(params)
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
      return selection.itemName
    },

    /**
     * 弹出表格确定事件
     */
    onStdWOOk(seleted) {
      this.$emit('onDTableOk', seleted)
    },

    init() {
      if (this.searchSlId) {
        this.stdWOProp.toolbarProp.searchData.slId = this.searchSlId
      }
      this.selectStdWO()
    }
  }
}
</script>
<style scoped>
@import url("../dialog.css");
</style>
