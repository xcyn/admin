<template>
  <z-dialog-table ref="assetDTable" :title="componentName||assetDialogProp.title" :toolbar-prop="assetDialogProp.toolbarProp" :table-prop="assetDialogProp.tableProp" :selection-handle="assetDialogProp.selectionHandle" :tree-prop="assetDialogProp.treeProp" @toolbar-search="onSearch" @tree-click="onTreeClick" @ok="onassetDTableOk" @on-reset="resetCon">
    <template slot="searchBar">
      <el-form-item :label="$t('equipment.common.locaNo')" prop="locaNo">
        <el-input v-model="assetDialogProp.toolbarProp.searchData.locaNo" clearable />
      </el-form-item>

      <el-form-item :label="$t('equipment.common.loca')" prop="locaName">
        <el-input v-model="assetDialogProp.toolbarProp.searchData.locaName" clearable />
      </el-form-item>

      <el-form-item label="">
        <el-checkbox id="isSub" size="medium" style="font-size:14px;margin-left:5px;float:left" @change="subChange">
          {{$t('common.field.currentLocation')}}
        </el-checkbox>
      </el-form-item>
    </template>

  </z-dialog-table>
</template>
<script>
import {
  initDeviceTree,
  initDeviceData
} from '@/api/cpApi/equipment/list.js'

export default {
  name: 'AssetDialogSelect',

  props: { // String Number Boolean Array Object Function || validator (value) {}
    fatherMethod: { // 父组件传过来的方法 fatherMethod
      type: Function,
      required: false,
      default: function () {
      }
    },
    multipleSelect: {
      type: Boolean,
      default: true
    },
    conStr: {
      type: String,
      default: ''
    },
    locaId: {
      type: String
    },
    locaNo: {
      type: String
    },
    locaName: {
      type: String
    },
    componentName: {
      type: String
    },
    closeTree: {
      type: Boolean
    },
    showTreeTitle: {
      type: Boolean,
      default: true
    }
  },

  data () {
    return {
      selectData: {},
      pageNo: 1,
      curChange: false,
      nodeLocaId: '',
      // 弹出属性
      assetDialogProp: {
        //title: '设备位置弹出框',
        title: this.$t('ticket.optTicket.equipPopUpBox'),
        key: 'id',
        selectionHandle: this.selectionHandle,
        toolbarProp: {
          // 搜索数据
          searchData: {
            locaNo: '',
            locaName: '',
            assetName: '',
            manageObjName: ''
          }
        },
        // 表格属性
        tableProp: {
          multipleSelect: this.multipleSelect, // 是否可多选
          dataSource: this.getTableData, // 表格分页查询接口， Promise 对象
          paginationHandle: this.dialogPaginationHandle, // 分页条件处理 返回分页查询条件
          columns: [ // 显示列
            {
              //title: '设备资产编码',
              title: this.$t('equipment.common.assetNo'),
              key: 'assetNo',
              width: '180',
              show: false
            },
            {
              //title: '设备资产名称',
              title: this.$t('equipment.common.assetName'),
              key: 'assetName',
              width: '180',
              show: false
            },
            {
              //title: '设备位置编码',
              title: this.$t('equipment.common.locaNo'),
              key: 'locaNo'
            },
            {
              //title: '设备位置名称',
              title: this.$t('equipment.common.locaName'),
              key: 'locaName'
            },
            {
              //title: '机组',
              title: this.$t('ticket.optTicket.crew'),
              show: false,
              key: 'manageObjName'
            },
            {
              //title: '设备位置id',
              title: this.$t('equipment.common.locaNo'),
              show: false,
              key: 'locaId'
            }
          ]
        },
        // 树控件属性
        treeProp: {
          show: !this.closeTree,
          //title: this.showTreeTitle ? '设备位置' : '',
          title: this.showTreeTitle ? this.$t('equipment.common.loca'): '',
          nodeKey: 'locaNo',
          clickNodeHandle: this.treeClickNodeHandle, // 树点击节点处理
          multipleSelect: false,
          treeData: this.dialogloadTreeData,
          lazyLoad: true,
          propMapping: { // 根据返回值的映射
            label: 'locaName',
            children: 'son'
          }
        }
      },

      initParam: {}
    }
  },

  methods: {
    /**
     * 对外初始化
     * @author mbb
     */
    init (initParam) {
      this.initParam = initParam
      let selected = {
        key: 'id',
        data: []
      }
      selected.data.push({
        id: this.locaId,
        text: this.locaName
      })

      this.$refs.assetDTable.open(selected)
      // 加载弹出框列表数据
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.assetDTable.tableQuery()
        }, 600)
      })
    },

    /**
     * 根据条件查询数据
     * @author mbb
     */
    getTableData (param) {
      var param_ = {}
      if (param.parameters === null || undefined === param.parameters) {
        param_ = {
          parameters: [
            {
              key: 'locaId',
              value: this.conStr || ''
            }
          ],
          requestPage: {
            limit: 20,
            pageNo: this.pageNo
          }
        }
      } else {
        // 添加树点击节点数据  过滤查询
        param.parameters.push({
          key: 'path',
          value: this.nodeLocaId
        })
        param_ = param
      }
      // 有初始化需求
      if (this.initParam) {
        // 初始化部门
        if (this.initParam.maintainDeptNo) {
          param_.parameters.push({
            key: 'maintainDeptNo',
            value: this.initParam.maintainDeptNo
          })
        }
      }
      return initDeviceData(param_)
    },

    reloadTable (param_obj) {
      this.$refs.assetDTable.tableQuery(param_obj)
    },

    /**
     * 提交查询
     */
    onSearch (params) {
      let param = {
        parameters: []
      }
      if (params.locaNo != null && params.locaNo !== '') {
        param.parameters.push({
          key: 'locaNo',
          value: params.locaNo
        })
      }
      if (params.locaName != null && params.locaName !== '') {
        param.parameters.push({
          key: 'locaName',
          value: params.locaName
        })
      }
      if (params.assetName != null && params.assetName !== '') {
        param.parameters.push({
          key: 'assetName',
          value: params.assetName
        })
      }
      if (params.manageObjName != null && params.manageObjName !== '') {
        param.parameters.push({
          key: 'manageObjName',
          value: params.manageObjName
        })
      }
      // 加载列表数据
      this.$refs.assetDTable.tableQuery(param)
    },

    /**
     * 弹出框勾选数据
     */
    selectionHandle (selection) {
      return selection.locaName
    },

    /**
     * 弹出表格确定事件
     */
    onassetDTableOk (seleted) {
      this.assetNoNames = ''
      this.assetNoIds = ''
      for (let index in seleted) {
        this.assetNoNames += (seleted[index]['column']['locaName'] || '') + ','
        this.assetNoIds += (seleted[index]['column']['locaId'] || '') + ','
      }
      if (this.assetNoNames.lastIndexOf(',') !== -1) {
        this.assetNoNames = this.assetNoNames.substring(0, this.assetNoNames.length - 1)
      }
      if (this.assetNoIds.lastIndexOf(',') !== -1) {
        this.assetNoIds = this.assetNoIds.substring(0, this.assetNoIds.length - 1)
      }
      this.selectData = {
        ids: this.assetNoIds,
        names: this.assetNoNames,
        seleted: seleted
      }
      this.$emit('onDTableOk', seleted)
      this.fatherMethod(this.selectData)
    },

    /**
     * 分页事件
     */
    dialogPaginationHandle (pagination) {
      this.pageNo = pagination.pageNo
      return { requestPage: pagination }
    },

    /**
     * 树节点点击事件处理
     * 返回 对象，用于表单查询条件
     * 返回 null 不进行查询，可自定义一些处理
     */
    onTreeClick (node) {
      let param = {
        parameters: []
      }
      // 点击树节点,把树节点数据保存
      this.nodeLocaId = node.locaId

      if (this.curChange) {
        param.parameters.push({
          key: 'locaId',
          value: node.locaId
        })
      } else {
        param.parameters.push({
          key: 'path',
          value: node.locaId
        })
      }
      this.reloadTable(param)
    },

    /**
     * 加载树组件数据 (非懒加载)
     */
    dialogloadTreeData (node, resolve, loadDone) {
      if (node.level === 0) {
        initDeviceTree('').then(res => {
          resolve(res.data)
          loadDone()
        })
      } else {
        initDeviceTree(node.data.locaId).then(res => {
          resolve(res.data)
          loadDone()
        })
      }
    },

    /**
     * 重置
     */
    resetCon () {
      this.assetDialogProp.toolbarProp.searchData.locaNo = ''
      this.assetDialogProp.toolbarProp.searchData.locaName = ''
    },

    /**
     * 切换只显示当前位置
     */
    subChange (value) {
      this.curChange = value
    }
  }
}
</script>
<style scoped>
@import url("./dialog.css");
</style>
