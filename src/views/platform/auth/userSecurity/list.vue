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
    >
      <!-- 表格字段插槽 -->
      <template slot="complexityColumns" slot-scope="scope">
        <span v-for="(item,i) in dataConvert(scope.row.complexity)" :key="i" style="margin-top:2px;display:block;">
          <el-tag> {{ item|optionsFilter(checkListOptions,'label') }}</el-tag>
        </span>
      </template>
    </ibps-crud>
    <edit
      :id="editId"
      ref="edit"
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
import { queryPageList, remove, setUse, setDefault } from '@/api/platform/auth/userSecurity'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import Identity from '@/constants/identity'
import { statusOptions, defaultOptions, checkListOptions } from './constants'
import Edit from './edit'

export default {
  components: {
    Edit
  },
  mixins: [FixHeight],
  data() {
    return {
      identity: Identity.IBPS.SYSTEM.USER_SECURITY,
      checkListOptions,
      dialogFormVisible: false, // 弹窗
      readonly: false, // 是否只读
      editId: '', // 编辑dialog需要使用
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
            key: 'add'
          },
          {
            key: 'edit'
          },
          {
            key: 'remove'
          }
        ],
        searchForm: {},
        // 表格字段配置
        columns: [
          { prop: 'isUseComp', label: '是否启用复杂度策略', tags: statusOptions },
          { prop: 'complexity', label: '复杂度', slotName: 'complexityColumns' },
          { prop: 'minLength', label: '密码长度最小值' },
          { prop: 'maxLength', label: '密码长度最大值' },
          { prop: 'updTlimit', label: '强制更改密码时间（天）' },
          { prop: 'timeLimit', label: '最长使用期限' },
          { prop: 'isDefault', label: '是否为系统默认', tags: defaultOptions }
        ],
        rowHandle: {
          actions: [{
            key: 'setDefault',
            label: '设置默认',
            icon: 'ibps-icon-play',
            hidden: (row, index) => {
              return row.isUseComp === 'N' || (row.isUseComp === 'Y' && row.isDefault === 'Y')
            }
          }, {
            key: 'setUse',
            label: '禁用',
            icon: 'ibps-icon-ban',
            hidden: (row, index) => {
              return row.isUseComp === 'N'
            }
          }, {
            key: 'isUse',
            label: '启用',
            icon: 'ibps-icon-toggle-on',
            hidden: (row, index) => {
              return row.isUseComp === 'Y'
            }
          }, {
            key: 'edit'
          }, {
            key: 'remove'
          }, {
            key: 'detail'
          }]
        },
        statusOption: statusOptions
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
      ActionUtils.setSorts(this.sorts)
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
      ActionUtils.setPagination(this.pagination)
      ActionUtils.setSorts(this.sorts)
      this.loadData()
    },
    tip(title) {
      ActionUtils.success(title + '用户密码安全设置成功')
    },
    /**
     * 处理按钮事件
     */
    handleAction(command, position, selection, data) {
      switch (command) {
        case 'search':// 查询
          this.search()
          break
        case 'add':// 添加
          this.handleEdit()
          this.title = '添加用户安全设置'
          break
        case 'setDefault':// 设置默认
          data.isUseComp = 'Y'
          data.isDefault = 'Y'
          this.tip('设置默认')
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleSetDefault(id)
          }).catch(() => { })
          break
        case 'setUse':// 禁用
          this.tip('禁用')
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleSetUse(id, data.isUseComp)
          }).catch(() => { })
          data.isUseComp = 'N'
          break
        case 'isUse':// 启用
          this.tip('启用')
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleSetUse(id, data.isUseComp)
          }).catch(() => { })
          data.isUseComp = 'Y'
          break
        case 'edit':// 编辑
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleEdit(id)
            this.title = '编辑用户安全设置'
          }).catch(() => { })
          break
        case 'detail':// 明细
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleEdit(id, true)
            this.title = '用户安全设置明细'
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
    handleSetDefault(id) {
      setDefault({
        userSecurityId: id
      }).then(response => {
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
      // 获取数据
      remove({ userSecurityIds: ids }).then(response => {
        ActionUtils.removeSuccessMessage()
        this.search()
      }).catch(() => {})
    },
    /**
     * 处理启用，禁用
     */
    handleSetUse(id, value) {
      // 获取数据
      setUse({
        userSecurityId: id,
        use: value
      }).then(response => {
        this.search()
      }).catch(() => {})
    },
    dataConvert(data) {
      return data.split(',')
    }
  }
}
</script>
