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
      :identity="identity"
      :visible="dialogFormVisible"
      :readonly="readonly"
      @callback="search"
      @close="visible => dialogFormVisible = visible"
    />
  </div>
</template>

<script>
import { queryPageList, remove } from '@/api/platform/org/level'
import ActionUtils from '@/utils/action'
import Identity from '@/constants/identity'
import FixHeight from '@/mixins/height'
import { typeOptions } from './constants'
import Edit from './edit'

export default {
  components: {
    Edit
  },
  mixins: [FixHeight],
  data() {
    return {
      dialogFormVisible: false, // 弹窗
      editId: '', // 编辑dialog需要使用
      readonly: false, // 是否只读
      pkKey: 'id', // 主键  如果主键不是pk需要传主键

      title: '',
      loading: true,
      height: document.clientHeight,
      identity: Identity.IBPS.ORG.LEVEL,
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
          }
        ],
        searchForm: {
          forms: [
            { prop: 'Q^NAME_^SL', label: this.$t('platform.org.level.prop.name') },
            {
              prop: 'Q^TYPE_^S',
              label: this.$t('platform.org.level.prop.type'),
              fieldType: 'select',
              options: typeOptions
            }
          ]
        },
        // 表格字段配置
        columns: [
          { prop: 'name', label: this.$t('platform.org.level.prop.name') },
          { prop: 'type', label: this.$t('platform.org.level.prop.type'), tags: typeOptions },
          { prop: 'level', label: this.$t('platform.org.level.prop.level') },
          { prop: 'createTime', label: this.$t('common.field.createTime'), sortable: 'custom' }
        ],
        rowHandle: {
          actions: [{
            key: 'edit'
          }, {
            key: 'remove'
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
        case 'add':// 添加
          this.handleEdit()
          this.title = this.$t('common.title.add', { title: this.$t('platform.org.level.title') })
          break
        case 'edit':// 编辑
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleEdit(id)
            this.title = this.$t('common.title.edit', { title: this.$t('platform.org.level.title') })
          }).catch(() => { })
          break
        case 'detail':// 明细
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleEdit(id, true)
            this.title = this.$t('common.title.detail', { title: this.$t('platform.org.level.title') })
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
      remove({ levelIds: ids }).then(response => {
        ActionUtils.removeSuccessMessage()
        this.search()
      }).catch(() => {})
    }
  }
}
</script>
