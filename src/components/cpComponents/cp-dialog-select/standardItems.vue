<template>
  <!-- 标准项目弹窗 -->
  <z-dialog-table ref="projectDia" :title="stdWOProp.title" :toolbar-prop="stdWOProp.toolbarProp" :table-prop="stdWOProp.tableProp" :tree-prop="stdWOProp.treeProp" :selection-handle="stdWOProp.selectionHandle" @toolbar-search="onStdWOSearch" @ok="onStdWOOk">
    <template slot="searchBar">
      <el-form-item label="项目类型" prop="type">
        <el-select v-model="stdWOProp.toolbarProp.searchData.type" placeholder="请选择项目类型" clearable>
          <el-option v-for="(item, key) in proTypeList" :key="key" :value="item.id" :label="item.name" />
        </el-select>
      </el-form-item>

      <el-form-item label="时间类型" prop="overhaulPeriod">
        <el-select v-model="stdWOProp.toolbarProp.searchData.overhaulPeriod" placeholder="请选择时间类型" clearable>
          <el-option v-for="(item, key) in sjlxList" :key="key" :value="item.name" :label="`${item.name}个月`" />
        </el-select>
      </el-form-item>

      <el-form-item label="项目名称" prop="name">
        <el-input v-model="stdWOProp.toolbarProp.searchData.name" placeholder="请输入" />
      </el-form-item>
    </template>
  </z-dialog-table>
</template>
<script>
import * as dictHttp from '@/api/cpApi/dict/index'
import * as comnHttp from '@/api/cpApi/common/index'

export default {
  name: 'StandardItemsDialog',
  props: {
    multipleSelect: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      proTypeList: [],
      sjlxList: [],
      departArr: [],
      departments: '',
      stdWOProp: {
        title: '标准项目',
        selectionHandle: this.stdWOSelection,
        toolbarProp: {
          // 搜索数据
          searchData: {
            type: '',
            overhaulPeriod: '',
            name: ''
          }
        },
        // 表格属性
        tableProp: {
          multipleSelect: this.multipleSelect, // 是否可多选
          dataSource: '', // 表格分页查询接口， Promise 对象
          paginationHandle: this.busiPagination, // 分页条件处理 返回分页查询条件
          columns: [
            // 显示列
            {
              title: '项目名称',
              key: 'name'
            },
            {
              title: '类别',
              key: 'type',
              formatter: (row, col, val) => {
                console.log(val)
                let newVal = val
                this.proTypeList.forEach(item => {
                  console.log(item)
                  if (item.id == val) {
                    newVal = item.name
                    return false
                  }
                })

                return newVal
              }
            },
            {
              title: '设备位置',
              key: 'devicePositionDescription'
            },
            {
              title: '场站',
              key: 'station',
              formatter: (row, col, val) => {
                return this.foamtDepart(val)
              }
            },
            {
              title: '检修班组',
              key: 'team',
              formatter: (row, col, val) => {
                return this.foamtDeparts(val)
              }
            },
            {
              title: '检修周期',
              key: 'overhaulPeriod',
              formatter: (row, col, val) => {
                return val ? val + '个月' : ''
              }
            },
            {
              title: '状态',
              key: 'status',
              formatter: (row, column, cellValue) => {
                return cellValue == '1' ? '启用' : '停用'
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
    this.getWoTypeList()
    this.getDictByTypeKey()
    this.searchAllDepart()
    this.getDepartments()
  },
  methods: {
    selectStdWO() {
      this.$refs.projectDia.open()
      // 加载弹出框列表数据
      this.$nextTick(() => {
        setTimeout(() => {
          const pa = {
            status: 1
          }
          this.$refs.projectDia.tableQuery(pa)
        }, 600)
      })
    },
    foamtDepart(id) {
      let val = ''
      this.departArr.map(item => {
        if (item.ID_ == id) {
          val = item.NAME_
          return false
        }
      })
      return val
    },
    foamtDeparts(id) {
      let val = ''
      this.departments.map(item => {
        if (item.ID_ == id) {
          val = item.NAME_
          return false
        }
      })
      return val
    },
    searchAllDepart() {
      let param = {
        parameters: [
          {
            key: 'key',
            value: 'cz'
          }
        ]
      }
      comnHttp.findDataByKey(param).then(ret => {
        this.departArr = ret.data.dataResult
      })
    },
    getDepartments() {
      let param = {
        parameters: [
          {
            key: 'key',
            value: 'bm'
          },
          {
            key: 'Q^PARTY_TYPE_^S',
            value: 'org'
          },
          {
            key: 'Q^PATH_^SL',
            value: '774689130775838720'
          }
        ]
      }
      comnHttp.findDataByKey(param).then(res => {
        this.departments = res.data.dataResult
      })
    },
    onStdWOSearch(params) {
      console.log('--------搜索条件--------', params)
      // 加载列表数据
      const pa = {
        type: params.type,
        overhaulPeriod: params.overhaulPeriod,
        name: params.name,
        status: 1
      }
      this.$refs.projectDia.tableQuery(pa)
    },
    /**
     * 返回分页条件
     */
    busiPagination(pagination) {
      console.log('--------分页事件--------', pagination)
      return {
        pageNo: pagination.pageNo,
        pageSize: pagination.limit
      }
    },
    /**
     * 处理勾选数据展示
     */
    stdWOSelection(selection) {
      // 标准工单
      console.log('--------弹出框勾选数据--------', selection)
      return selection.name
    },
    /**
     * 弹出表格确定事件
     */
    onStdWOOk(seleted) {
      console.log('--------弹出表格确定事件--------', seleted)
      this.$emit('onDTableOk', seleted)
    },
    init() {
      this.selectStdWO()
    },
    getWoTypeList() {
      const param = { typeKey: 'xmlx' }
      dictHttp.getDictByTypeKey(param).then(ret => {
        console.log('***************')
        console.log(ret)
        this.proTypeList = ret.data
      })
    },
    getDictByTypeKey() {
      dictHttp.getDictByTypeKey({ typeKey: 'sjlx' }).then(ret => {
        this.sjlxList = ret.data
      })
    }
  }
}
</script>
<style scoped>
@import url("./dialog.css");
</style>
