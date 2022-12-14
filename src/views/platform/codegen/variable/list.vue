<template>
  <div class="main-container">
    <ibps-crud
      ref="crud"
      :height="height"
      :data="listData"
      :toolbars="listConfig.toolbars"
      :search-form="listConfig.searchForm"
      :pk-key="pkKey"
      :columns="listConfig.columns"
      :row-handle="listConfig.rowHandle"
      :pagination="pagination"
      :loading="loading"
      :identity="identity"
      @action-event="handleAction"
      @sort-change="handleSortChange"
      @pagination-change="handlePaginationChange"
    />
    <edit
      :id="editId"
      :title="title"
      :visible="dialogFormVisible"
      :readonly="readonly"
      :identity="identity"
      @callback="search"
      @close="visible => dialogFormVisible = visible"
    />
  </div>
</template>

<script>
import { queryPageList, remove, refresh } from '@/api/platform/codegen/variable'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import { typeOptions } from './constants'
import edit from './edit'
import Identity from '@/constants/identity'

export default {
  components: {
    edit
  },
  mixins: [FixHeight],
  data() {
    return {
      identity: Identity.IBPS.CODEGEN.VARIABLE,
      dialogFormVisible: false, // 弹窗
      editId: '', // 编辑dialog需要使用
      readonly: false, // 是否只读
      pkKey: 'id', // 主键  如果主键不是pk需要传主键

      title: '',
      loading: true,
      height: document.clientHeight,

      listData: [],
      pagination: {},
      sorts: {},
      listConfig: {
        toolbars: [
          {
            key: 'search'
          },
          {
            key: 'add'
          },
          {
            key: 'edit'
          },
          {
            key: 'remove'
          },
          {
            key: 'refresh',
            label: '重置'
          }
        ],
        searchForm: {
          forms: [
            { prop: 'Q^key_^SL', label: '变量key' },
            { prop: 'Q^name_^SL', label: '变量名' },
            {
              prop: 'Q^type_^SL',
              label: '变量类型',
              fieldType: 'select',
              options: typeOptions
            }
          ]
        },
        // 表格字段配置
        columns: [
          { prop: 'key', label: '变量key', sortable: 'custom' },
          { prop: 'name', label: '变量名', sortable: 'custom' },
          { prop: 'value', label: '变量值', sortable: 'custom' },
          { prop: 'type', label: '变量类型', tags: typeOptions, sortable: 'custom' },
          { prop: 'creatorName', label: '创建人' },
          { prop: 'createTime', label: '创建时间', sortable: 'custom', dateFormat: 'yyyy-MM-dd' }
        ],
        rowHandle: {
          actions: [{
            key: 'edit'
          }, {
            key: 'remove',
            hidden: (row, index) => {
              return row.deletable === 'N'
            }
          }, {
            key: 'detail'
          }]
        }
      }
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    // 加载数据
    loadData() {
      this.loading = true
      queryPageList(this.getSearcFormData()).then(response => {
        ActionUtils.handleListData(this, response.data)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    /**
     * 获取格式化参数
     */
    getSearcFormData() {
      return ActionUtils.formatParams(
        this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {},
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
    /**
     * 查询
     */
    search() {
      this.loadData()
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
        case 'refresh':// 重置
          this.refresh()
          break
        case 'add':// 添加
          this.handleEdit()
          this.title = '添加变量'
          break
        case 'edit':// 编辑
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleEdit(id)
            this.title = '编辑变量'
          }).catch(() => { })
          break
        case 'detail':// 明细
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleEdit(id, true)
            this.title = '变量明细'
          }).catch(() => { })
          break
        case 'remove':// 删除
          ActionUtils.removeRecord(selection).then((ids) => {
            this.handleRemove(ids)
          }).catch(() => { })
          break
        default:
          break
      }
    },
    /**
     * 重置
     */
    refresh() {
      refresh().then(response => {
        ActionUtils.success('重置变量成功')
        this.search()
      }).catch(() => {})
    },
    /**
     * 处理编辑
     */
    handleEdit(id = '', readonly = false) {
      this.editId = id
      this.readonly = readonly
      this.dialogFormVisible = true
    },
    /**
     * 处理删除
     */
    handleRemove(ids) {
      remove({ ids: ids }).then(response => {
        ActionUtils.removeSuccessMessage()
        this.search()
      }).catch(() => {})
    }
  }
}
</script>
