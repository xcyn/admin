<template>
  <ibps-container type="full" class="page">
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
      :display-field="listConfig.displayField"
      :display-field-data="displayFieldData"
      @display-field-change="handleDisplayField"
      @header-dragend="handleHeaderDragend"
      @action-event="handleAction"
      @sort-change="handleSortChange"
      @pagination-change="handlePaginationChange"
    />
    <!-- 添加、编辑、明细 -->
    <edit
      :id="editId"
      :title="title"
      :identity="identity"
      :visible="dialogFormVisible"
      :readonly="readonly"
      :span="span"
      @dialog-callback="search"
      @close="visible => dialogFormVisible = visible"
    />
    <!-- 重置密码 -->
    <change-password
      :ids="changePasswordIds"
      :visible="changePasswordVisible"
      :title="$t('platform.org.employee.change-password.resetPassword')"
      is-reset
      :reg-open="true"
      @dialog-callback="search"
      @close="visible => changePasswordVisible = visible"
    />
    <more-search
      ref="moreSearch"
      :title="moreSearchTitle"
      :visible="dialogMoreSearchVisible"
      party-type="employee"
      @callback="search"
      @close="visible => dialogMoreSearchVisible = visible"
      @action-event="handleMoreSearchAction"
    />
  </ibps-container>
</template>

<script>
import { queryPageList, remove, active, disable } from '@/api/platform/org/employee'
import ActionUtils from '@/utils/action'
import Identity from '@/constants/identity'
import { statusOptions, genderOptions } from './constants'
import { mapActions, mapMutations } from 'vuex'
import Edit from './edit/index'
import ChangePassword from './change-password'
import CustomDataDisplayMixin from '@/business/platform/system/mixins/customDataDisplay'
import MoreSearch from './more-search'

const UNIQUE_IDENTITY = Identity.IBPS.ORG.EMPLOYEE

export default {
  components: {
    Edit,
    ChangePassword,
    MoreSearch
  },
  mixins: [CustomDataDisplayMixin],
  data() {
    return {
      identity: Identity.IBPS.ORG.EMPLOYEE,
      height: document.clientHeight,
      title: '',
      moreSearchTitle: '更多查询',
      loading: true,
      // 编辑dialog需要使用
      editId: '',
      span: '',
      dialogFormVisible: false,
      readonly: false, // 是否只读

      changePasswordIds: '',
      changePasswordVisible: false,
      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      listData: [],
      displayFieldData: [],
      listConfig: {
        displayField: true,
        toolbars: [
          { key: 'search' },
          { key: 'add' },
          { key: 'edit' },
          { key: 'remove' },
          {
            key: 'changePassword',
            label: this.$t('platform.org.employee.button.changePassword'),
            icon: 'el-icon-refresh',
            hidden: () => {
              return !this.$store.getters.isSuper
            }
          }
          // { key: 'more', icon: 'ibps-icon-ellipsis-h' }
        ],
        searchForm: {
          forms: [
            { prop: 'Q^NAME_^SL', label: this.$t('platform.org.employee.prop.name'), labelWidth: 60, itemWidth: 200 },
            { prop: 'Q^ACCOUNT_^SL', label: this.$t('platform.org.employee.prop.account'), labelWidth: 80, itemWidth: 200 },
            {
              prop: 'Q^STATUS_^SL',
              label: this.$t('platform.org.employee.prop.status'),
              fieldType: 'select',
              options: statusOptions.filter((status) => {
                return status.value !== 'deleted'
              }),
              labelWidth: 65,
              itemWidth: 200
            },
            {
              prop: ['Q^CREATE_TIME_^DL', 'Q^CREATE_TIME_^DG'],
              label: this.$t('common.field.createTime'),
              fieldType: 'daterange',
              labelWidth: 80,
              itemWidth: 220
            }
          ]
        },
        // 表格字段配置
        columns: [
          { prop: 'name', label: this.$t('platform.org.employee.prop.name') },
          { prop: 'account', label: this.$t('platform.org.employee.prop.account') },
          { prop: 'wcAccount', label: this.$t('platform.org.employee.prop.wcAccount') },
          { prop: 'orgName', label: this.$t('platform.org.employee.prop.orgPath'), sortable: false },
          { prop: 'gender', label: this.$t('platform.org.employee.prop.gender'), tags: genderOptions },
          { prop: 'createTime', label: this.$t('common.field.createTime') },
          { prop: 'status', label: this.$t('platform.org.employee.prop.status'), tags: statusOptions }
        ],
        rowHandle: {
          actions: [
            {
              key: 'changePassword',
              label: this.$t('platform.org.employee.button.changePassword'),
              icon: 'el-icon-refresh',
              hidden: (rowData, index) => {
                if (rowData.status === 'deleted') { return true }
                if (this.$store.getters.userId === rowData.id) { return true }
                if (!this.$store.getters.isSuper) { return true }
              }
            },
            {
              key: 'edit',
              hidden: (rowData, index) => {
                if (rowData.status === 'deleted') { return true }
                // if (this.$store.getters.userId === rowData.id) { return true }
                if (this.$store.getters.isSuper) { return false }
              }
            },
            {
              key: 'remove',
              hidden: (rowData, index) => {
                if (rowData.status === 'deleted') { return true }
                if (this.$store.getters.userId === rowData.id) { return true }
                if (this.$store.getters.isSuper) { return false }
              }
            },
            {
              key: 'detail'
            },
            {
              key: 'actived',
              label: this.$t('platform.org.employee.button.actived'),
              icon: 'ibps-icon-unlock',
              hidden: (rowData, index) => {
                if (rowData.status === 'actived') { return true }
                if (this.$store.getters.userId === rowData.id) { return true }
                if (!this.$store.getters.isSuper) { return true }
              }
            },
            {
              key: 'disable',
              label: this.$t('platform.org.employee.button.disable'),
              icon: 'ibps-icon-ban',
              hidden: function(rowData, index) {
                if (rowData.status !== 'actived') { return true }
                if (this.$store.getters.userId === rowData.id) { return true }
                if (!this.$store.getters.isSuper) { return true }
              }
            },
            {
              key: 'switchUser',
              label: this.$t('platform.org.employee.button.switchUser'),
              icon: 'el-icon-sort',
              hidden: function(rowData, index) {
                const userId = this.$store.getters.userId
                const isSuper = this.$store.getters.isSuper
                const isTenantAdmin = this.$store.getters.isTenantAdmin
                return isTenantAdmin === true || rowData.status !== 'actived' || userId === rowData.id || !isSuper
              }
            }
          ]
        }
      },
      pagination: {},
      sorts: {},
      moreSearchParams: {},
      dialogMoreSearchVisible: false
    }
  },
  created() {
    this.loadData()
    this.loadDisplayField()
  },
  methods: {
    ...mapMutations({
      pageKeepAliveClean: 'ibps/page/keepAliveClean'
    }),
    ...mapActions({
      switchUser: 'ibps/user/switchUser'
    }),
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
      const params = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
      if (this.moreSearchParams) {
        Object.assign(params, this.moreSearchParams)
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

    /**
     * 获取显示字段
     */
    loadDisplayField() {
      this.getCustomDataDisplay(UNIQUE_IDENTITY).then((data) => {
        this.displayFieldData = data
      })
    },
    // 默认显示字段
    getDefaultDisplayFieldData() {
      const displayFields = []
      this.listConfig.columns.forEach((column) => {
        if (!column.hidden) {
          displayFields.push(column)
        }
      })
      return JSON.parse(JSON.stringify(displayFields))
    },

    handleHeaderDragend(newWidth, oldWidth, column, event) {
      let displayFieldData = []
      if (this.$utils.isEmpty(this.displayFieldData)) {
        displayFieldData = this.getDefaultDisplayFieldData()
      } else {
        displayFieldData = JSON.parse(JSON.stringify(this.displayFieldData))
      }

      for (let i = 0; i < displayFieldData.length; i++) {
        const displayField = displayFieldData[i]
        if (displayField.prop === column.property) {
          displayField.width = parseInt(newWidth)
        }
      }

      this.handleDisplayField(displayFieldData, () => {}, false)
    },
    /**
     * 保存显示字段
     */
    handleDisplayField(data, callback, hasMessage = true) {
      this.saveCustomDataDisplay(data, UNIQUE_IDENTITY).then((response) => {
        this.displayFieldData = data
        if (hasMessage) ActionUtils.success(response.message)
        callback(true)
      }).catch(() => {
        callback(false)
      })
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
    handleAction(buttonKey, position, selection, data) {
      switch (buttonKey) {
        case 'search':// 查询
          ActionUtils.setFirstPagination(this.pagination)
          this.search()
          break
        case 'add':// 添加
          this.handleEdit()
          this.title = this.$t('common.title.add', { title: this.$t('platform.org.employee.title') })
          this.span = 13
          break
        case 'edit':// 编辑
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleEdit(id)
            this.title = this.$t('common.title.edit', { title: this.$t('platform.org.employee.title') })
            this.span = 13
          }).catch(() => { })
          break
        case 'changePassword':// 重置密码
          ActionUtils.selectedMultiRecord(selection).then((ids) => {
            this.handlereChangePassword(ids)
          }).catch(() => { })
          break
        case 'detail':// 明细
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleEdit(id, true)
            this.span = 24
            this.title = this.$t('common.title.detail', { title: this.$t('platform.org.employee.title') })
          }).catch(() => { })
          break
        case 'remove':// 删除
          ActionUtils.removeRecord(selection).then((ids) => {
            this.handleRemove(ids)
          }).catch(() => { })
          break
        case 'actived':// 激活
          this.handleActived(selection)
          break
        case 'more':// 更多
          this.handleMoreSearchParams()
          break
        case 'disable':// 禁用
          this.handleDisable(selection)
          break
        case 'switchUser':// 切换用户
          this.handleSwitchUser(data.account)
          break
        default:
          break
      }
    },
    /**
     * 处理更多
     */
    handleMoreSearchParams() {
      this.dialogMoreSearchVisible = true
    },
    handleMoreSearchAction(data) {
      ActionUtils.setFirstPagination(this.pagination)
      this.moreSearchParams = data
      this.loadData()
    },
    /**
     * 处理编辑
     */
    handleEdit(editId, readonly = false) {
      this.editId = editId || ''
      this.dialogFormVisible = true
      this.readonly = readonly
    },
    /**
     * 处理重置密码
     */
    handlereChangePassword(ids) {
      this.changePasswordIds = ids
      this.changePasswordVisible = true
    },
    handleRemove(ids) {
      // 删除数据
      remove({ employeeIds: ids }).then(response => {
        ActionUtils.removeSuccessMessage()
        this.search()
      })
    },
    handleActived(id) {
      active({ employeeId: id }).then(response => {
        ActionUtils.successMessage('激活成功！')
        this.search()
      })
    },
    handleDisable(id) {
      disable({ employeeId: id }).then(response => {
        ActionUtils.successMessage('禁用成功!')
        this.search()
      })
    },
    handleSwitchUser(username) {
      this.switchUser(username).then(() => {
        ActionUtils.successMessage('切换用户成功!')
        // 由于已经加载过设置 需要清空缓存设置
        this.pageKeepAliveClean()
        // 由于已经加载过设置 需要刷新此页面
        // this.$router.replace('/')

        window.location.href = this.$baseUrl
      })
    }

  }
}
</script>
