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
    <!-- 编辑 -->
    <edit
      :id="editId"
      :title="title"
      :status="status"
      :visible="dialogFormVisible"
      :readonly="readonly"
      :identity="identity"
      @callback="search"
      @close="visible => dialogFormVisible = visible"
    />
    <!-- 明细 -->
    <detail
      :id="editId"
      :title="title"
      :visible="dialogdetailVisible"
      :readonly="readonly"
      @callback="search"
      @close="visible => dialogdetailVisible = visible"
    />
  </div>
</template>

<script>
import { queryPageList, remove } from '@/api/platform/system/news'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import { publicItemOptions, isPublicOptions, typeOptions } from './constants'
import Edit from './edit'
import Detail from './detail'
import Identity from '@/constants/identity'

export default {
  components: {
    Edit,
    Detail
  },
  mixins: [FixHeight],
  data() {
    return {
      identity: Identity.IBPS.SYSTEM.NEWS,
      dialogFormVisible: false, // 弹窗
      dialogdetailVisible: false,
      editId: '', // 编辑dialog需要使用
      readonly: false, // 是否只读
      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      status: '',
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
            key: 'remove'
          }
        ],
        searchForm: {
          forms: [
            { prop: 'Q^TITLE_^SL', label: '标题' },
            { prop: 'Q^USER_NAME_^SL', label: '发布人' },
            { prop: ['Q^PUBLIC_DATE_^DL', 'Q^PUBLIC_DATE_^DG'], label: '发布时间', fieldType: 'daterange' }
          ]
        },
        // 表格字段配置
        columns: [
          { prop: 'title', label: '标题' },
          { prop: 'publicItem', label: '发布选项', tags: publicItemOptions },
          { prop: 'userName', label: '发布人' },
          { prop: 'publicDate', label: '发布时间', dateFormat: 'yyyy-MM-dd' },
          { prop: 'loseDate', label: '失效时间', dateFormat: 'yyyy-MM-dd' },
          { prop: 'public0', label: '是否公共', tags: isPublicOptions },
          { prop: 'status', label: '发布状态', tags: typeOptions },
          { prop: 'depName', label: '发布范围' }
        ],
        rowHandle: {
          actions: [{
            key: 'edit',
            hidden: (row, index) => {
              return row.status === 'publish' || row.status === 'expired'
            }
          }, {
            key: 'remove',
            hidden: (row, index) => {
              return row.status === 'publish' || row.status === 'expired'
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
        case 'add':// 添加
          this.handleEdit()
          this.title = '添加公告'
          break
        case 'edit':// 编辑
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleEdit(id)
            this.title = '编辑'
            this.status = data.status
          }).catch(() => { })
          break
        case 'detail':// 明细
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleDetail(id, true)
            this.title = '公告明细'
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
     * 处理明细
     */
    handleDetail(id = '', readonly = false) {
      this.editId = id
      this.readonly = readonly
      this.dialogdetailVisible = true
    },
    /**
     * 处理删除
     */
    handleRemove(ids) {
      // 获取数据
      remove({ newsIds: ids }).then(response => {
        ActionUtils.removeSuccessMessage()
        this.search()
      }).catch(() => {})
    },
    /**
     * 处理展示发布组织
     */
    handleDepName(value) {
      // 获取数据
      let className
      const arr = value.split(',')
      if (this.$utils.isEmpty(arr)) {
        className = null
      } else if (arr.length > 2) {
        className = 'table-row-depNames'
      }
      return className
    }
  }
}
</script>
<style lang="scss">
.table-row-depName{
  input{
    display:none;
  }
}
.table-row-depNames{
  .el-selector__tags{
    position: relative !important;
    -webkit-transform: translateY(10%) !important;
    transform: translateY(10%) !important;
  }
}
</style>
