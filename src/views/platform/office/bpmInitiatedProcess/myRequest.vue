<template>
  <ibps-layout ref="layout">
    <div slot="west">
      <ibps-type-tree
        :width="width"
        :height="height"
        title="流程分类"
        category-key="FLOW_TYPE"
        @node-click="handleNodeClick"
        @expand-collapse="handleExpandCollapse"
      />
    </div>
    <ibps-crud
      ref="crud"
      :style="{ marginLeft: width+'px' }"
      :height="height"
      :data="listData"
      :toolbars="listConfig.toolbars"
      :search-form="listConfig.searchForm"
      :pk-key="pkKey"
      :columns="listConfig.columns"
      :row-handle="listConfig.rowHandle"
      :pagination="pagination"
      :loading="loading"
      :selection-row="false"
      :index-row="false"
      :identity="identity"
      @action-event="handleAction"
      @sort-change="handleSortChange"
      @column-link-click="handleLinkClick"
      @pagination-change="handlePaginationChange"
    >
      <template slot="statusCloum" slot-scope="scope">
        <el-tag>{{ scope.row.status|optionsFilter(stautusOptions,'value','key') }}</el-tag>
      </template>
    </ibps-crud>
    <bpmn-formrender
      :visible="dialogFormVisible"
      :instance-id="instanceId"
      :pro-inst-id="proInstId"
      :def-id="defId"
      :copy-flow="copyFlow"
      @callback="search"
      @close="visible => dialogFormVisible = visible"
    />

  </ibps-layout>
</template>
<script>
import { myRequested } from '@/api/platform/office/bpmInitiated'
import { findProcInstStatus } from '@/api/platform/bpmn/bpmInfo'
import ActionUtils from '@/utils/action'
import Identity from '@/constants/identity'
import FixHeight from '@/mixins/height'
import IbpsTypeTree from '@/business/platform/cat/type/tree'
import BpmnFormrender from '@/business/platform/bpmn/form/dialog'

export default {
  components: {
    IbpsTypeTree,
    BpmnFormrender
  },
  mixins: [FixHeight],
  data() {
    return {
      width: 200,
      identity: Identity.IBPS.OFFICE_DESK.BPM_INITIATED_PROCESS_MY_REQUEST,
      height: document.clientHeight,
      dialogFormVisible: false, // 弹窗
      instanceId: '',
      proInstId: '',
      defId: '',
      copyFlow: false,

      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      typeId: '',
      loading: false,
      listData: [],
      stautusOptions: [],
      listConfig: {
        // 工具栏
        toolbars: [
          { key: 'search' }
        ],
        // 查询条件
        searchForm: {
          forms: [
            { prop: 'Q^subject_^SL', label: '请求标题' },
            { prop: 'Q^proc_def_name_^SL', label: '流程名称' },
            {
              prop: ['Q^create_time_^DL', 'Q^create_time_^DG'],
              label: '创建时间',
              fieldType: 'daterange'
            }
          ]
        },
        // 表格字段配置
        columns: [
          { prop: 'subject', label: '请求标题', link: 'dialog' },
          { prop: 'procDefName', label: '流程名称', width: 200 },
          { prop: 'createTime', label: '创建时间', width: 140 },
          { prop: 'status', label: '状态', slotName: 'statusCloum', width: 150 }
        ],
        // 管理列
        rowHandle: {
          effect: 'display',
          width: '70px',
          actions: [
            {
              key: 'copy',
              label: '复制',
              icon: 'ibps-icon-copy'
            }
          ]
        }
      },
      pagination: {},
      sorts: {}
    }
  },
  created() {
    this.loadData()
    this.findProcInstStatus()
  },
  methods: {
    findProcInstStatus() {
      findProcInstStatus().then(response => {
        this.stautusOptions = response.data
      })
    },
    /**
     * 加载数据
     */
    loadData() {
      this.loading = true
      myRequested(this.getFormatParams()).then(response => {
        ActionUtils.handleListData(this, response.data)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    /**
     * 获取格式化参数
     */
    getFormatParams() {
      const params = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
      if (this.$utils.isNotEmpty(this.typeId)) {
        params['Q^TYPE_ID_^S'] = this.typeId
      }
      return ActionUtils.formatParams(
        params,
        this.pagination,
        this.sorts)
    },
    /**
     * 处理分页事件
     */
    handlePaginationChange(page) {
      ActionUtils.setPagination(this.pagination, page)
      this.loadData()
    },
    /**
     * 处理排序
     */
    handleSortChange(sort) {
      ActionUtils.setSorts(this.sorts, sort)
      this.loadData()
    },
    search() {
      this.loadData()
    },
    /**
     * 重置查询条件
     */
    reset() {
      this.$refs['crud'].handleReset()
    },
    /**
     * 点击表格
     */
    handleLinkClick(data) {
      this.instanceId = data.id || ''
      this.proInstId = ''
      this.defId = ''
      this.copyFlow = false
      this.dialogFormVisible = true
    },
    /**
     * 处理按钮事件
     */
    handleAction(command, position, selection, data) {
      switch (command) {
        case 'search':// 查询
          ActionUtils.setFirstPagination(this.pagination)
          this.search()
          break
        case 'copy':// 复制
          this.handleCopy(data)
          break
        default:
          break
      }
    },
    handleNodeClick(typeId) {
      this.typeId = typeId
      this.loadData()
    },
    handleExpandCollapse(isExpand) {
      this.width = isExpand ? 230 : 30
    },
    handleCopy(data) {
      this.instanceId = ''
      this.proInstId = data.id || ''
      this.defId = data.procDefId || ''
      this.copyFlow = true
      this.dialogFormVisible = true
    }
  }
}
</script>
