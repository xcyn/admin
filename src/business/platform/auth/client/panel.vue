<template>
  <ibps-layout ref="layout">
    <ibps-crud
      ref="crud"
      :height="tableHeight"
      :data="listData"
      :toolbars="listConfig.toolbars"
      :search-form="listConfig.searchForm"
      :pk-key="pkKey"
      :columns="listConfig.columns"
      :pagination="pagination"
      :loading="loading"
      :selection-type="multiple?'checkbox':'radio'"
      @selection-change="handleSelectionChange"
      @action-event="handleAction"
      @sort-change="handleSortChange"
      @pagination-change="handlePaginationChange"
    />
  </ibps-layout>
</template>
<script>
import { queryClientSelector } from '@/api/platform/auth/client'
import { scopeTypeOptions, grantTypeOptions, statusTypeOptions } from '@/business/platform/auth/api/constants'
import ActionUtils from '@/utils/action'
import SelectionMixin from '@/components/ibps-selector/mixins/selection'

export default {
  mixins: [SelectionMixin],
  props: {
    value: [Object, Array],
    multiple: Boolean,
    height: {
      type: String,
      default: '400px'
    }
  },
  data() {
    return {
      partyId: '',

      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      loading: false,
      listData: [],
      listConfig: {
        // 工具栏
        toolbars: [
          { key: 'search' }
        ],
        // 查询条件
        searchForm: {
          forms: [
            { prop: 'Q^CLIENT_KEY_^SL', label: '标识' },
            { prop: 'Q^CLIENT_NAME_^SL', label: '名称' },
            { prop: 'Q^SCOPE_^SL', label: '作用域', fieldType: 'select', options: scopeTypeOptions },
            { prop: 'Q^GRANT_TYPES_^SL', label: '授权类型', fieldType: 'select', options: grantTypeOptions },
            { prop: ['Q^CREATE_TIME_^DL', 'Q^CREATE_TIME_^DG'], label: '申请时间', fieldType: 'daterange' }
          ]
        },
        // 表格字段配置
        columns: [
          { prop: 'clientKey', label: '标识' },
          { prop: 'clientName', label: '名称' },
          { prop: 'clientUri', label: 'Domain' },
          { prop: 'scope', label: '作用域', tags: scopeTypeOptions, dataType: 'stringArray' },
          { prop: 'grantTypes', label: '授权类型', tags: grantTypeOptions, dataType: 'stringArray' },
          { prop: 'status', label: '状态', tags: statusTypeOptions },
          { prop: 'creator', label: '创建人' },
          { prop: 'expireTime', label: '过期时间' }
        ]
      },
      pagination: {},
      sorts: {}
    }
  },
  computed: {
    tableHeight() {
      const h = this.height.substr(0, this.height.length - 2)
      return parseInt(h) - 10
    }
  },
  created() {
    this.loadListData()
  },
  beforeDestroy() {
    this.listData = null
    this.listConfig = null
    this.pagination = null
    this.sorts = null
  },
  methods: {
    /**
     * 加载数据
     */
    loadListData() {
      this.loading = true
      queryClientSelector(this.getFormatParams()).then(response => {
        this.loading = false
        ActionUtils.handleListData(this, response.data)
        this.setSelectRow()
      }).catch(() => {
        this.loading = false
      })
    },
    /**
     * 获取格式化参数
     */
    getFormatParams() {
      const params = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
      params['status'] = 'effect'
      return ActionUtils.formatParams(
        params,
        this.pagination,
        this.sorts)
    },
    /**
     * 处理分页事件
     */
    handlePaginationChange(page) {
      this.changePageCoreRecordData()
      ActionUtils.setPagination(this.pagination, page)
      this.loadListData()
    },
    /**
     * 处理排序
     */
    handleSortChange(sort) {
      ActionUtils.setSorts(this.sorts, sort)
      this.loadListData()
    },
    /**
     * 查询
     */
    search() {
      this.loadListData()
    },
    /**
     * 重置查询条件
     */
    reset() {
      this.$refs['crud'].handleReset()
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
        default:
          break
      }
    }
  }
}
</script>
