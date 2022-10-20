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
      @toolbar-search="onStdWOSearch"
      @ok="onStdWOOk"
    >
      <template slot="searchBar">
        <el-form-item label="领用单">
          <el-input v-model="stdWOProp.toolbarProp.searchData.searchKey" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="申请日期">
          <el-date-picker
            v-model="stdWOProp.toolbarProp.searchData.applyTime"
            style="min-width:250px"
            value-format="yyyy-MM-dd"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            clearable
          />
        </el-form-item>
        <!-- <el-form-item label="借用人" name="con" folding>
          <el-input
            v-model="stdWOProp.toolbarProp.searchData.borrowPersonName"
            placeholder="请输入"
            clearable
            @click.native="selectUserGrid"
          >
            <el-button slot="append" icon="el-icon-plus" @click="selectUserGrid"></el-button>
          </el-input>
        </el-form-item>-->
      </template>
    </z-dialog-table>
    <!-- 人员弹出框 -->
    <user-dialog-sel
      ref="userDialogTable"
      :multiple-select="false"
      @onDTableOk="onUserDialogTableOk"
    />
  </div>
</template>
<script>
import * as collarHttp from '@/api/cpApi/materialsManagement/stock/collar'
import userDialogSel from '@/components/cpComponents/cp-dialog-select/userDialogSel.vue'
import * as comnHttp from '@/api/cpApi/common/index'
export default {
  components: { userDialogSel },
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
    }
  },

  data() {
    return {
      stdWOProp: {
        stations: [],
        title: '领用申请',
        selectionHandle: this.stdWOSelection,
        key: 'collarId',
        toolbarProp: {
          // 搜索数据
          searchData: {
            searchKey: '',
            collarPersonName: '',
            collarPerson: '',
            applyTime: '',
            flowStatus: 'spjs'
          }
        },
        // 表格属性
        tableProp: {
          multipleSelect: this.multipleSelect, // 是否可多选
          dataSource: collarHttp.list, // 表格分页查询接口， Promise 对象
          paginationHandle: this.busiPagination, // 分页条件处理 返回分页查询条件
          columns: [
            // 显示列
            {
              title: '领用单号',
              key: 'collarNo'
            },
            {
              title: '领用单描述',
              key: 'collarDesc'
            },
            {
              title: '所属仓库',
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
              title: '申请日期',
              key: 'applyTime'
            },
            {
              title: '领用人',
              key: 'collarPersonName'
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
    /**
     * 人员选择
     */
    selectUserGrid() {
      this.$refs.userDialogTable.init()
    },
    /**
     * 人员选择回调
     */
    onUserDialogTableOk(selectData) {
      console.log('--------人员确定事件--------', selectData)
      console.log(selectData)
      // 确认返回
      if (selectData.length == 1) {
        let column = selectData[0].column
        this.stdWOProp.toolbarProp.searchData.collarPerson = column.id
        this.$set(
          this.stdWOProp.toolbarProp.searchData,
          'collarPersonName',
          column.name
        )
      }
    },
    selectStdWO() {
      let selected = {
        key: 'collarId',
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
          let pa
          if (this.siteId) {
            pa = Object.assign(
              {
                flowStatus: 'spjs',
                siteId: this.siteId
              },
              this.initParam
            )
          } else {
            pa = Object.assign(
              {
                flowStatus: 'spjs'
              },
              this.initParam
            )
          }
          this.$refs.stdWODiaTb.tableQuery(pa)
        }, 600)
      })
    },

    onStdWOSearch(params) {
      // 加载列表数据
      const pa = {
        searchKey: params.searchKey,
        collarPerson: params.collarPerson,
        flowStatus: 'spjs'
      }
      if (params.applyTime && params.applyTime.length == 2) {
        pa.applyTimeFrom = params.applyTime[0]
        pa.applyTimeTo = params.applyTime[1]
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
      return selection.collarNo
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
