<template>
  <div :style="{height:height+'px'}">
    <ibps-crud
      v-if="visible"
      ref="crud"
      :data="listData"
      :height="tableHeight"
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
    <!-- 人员选择器 -->
    <ibps-employee-selector-dialog
      :visible="selectorVisible"
      :value="[]"
      :show-tree="showTree"
      :current-org-id="id"
      title="人员选择器"
      multiple
      @close="visible => selectorVisible = visible"
      @action-event="handleSelectorActionEvent"
    />
    <!-- 分级管理添加 -->
    <edit
      :id="editId"
      :cero-params="ceroParams"
      :title="title"
      :identity="identity"
      :visible="editVisible"
      :readonly="readonly"
      :span="span"
      @dialog-callback="search"
      @close="visible => editVisible = visible"
    />
  </div>
</template>
<script>
import IbpsEmployeeSelectorDialog from '@/business/platform/org/employee/dialog'
import edit from '@/views/platform/org/employee/edit'
import ActionUtils from '@/utils/action'
import { queryOrgUser as queryPageList, removeOrgUser, addOrgUser } from '@/api/platform/org/employee'
import { employeeStatusOption, genderOption } from '../constants'
export default {
  components: {
    edit,
    IbpsEmployeeSelectorDialog
  },
  props: {
    id: [String, Number],
    height: Number,
    showTree: {
      type: Boolean,
      default: true
    },
    rightsArr: {
      type: Array,
      default: () => []
    },
    identity: String,
    visible: Boolean
  },
  data() {
    return {
      selectorVisible: false,
      editVisible: false,

      pkKey: 'id',

      editId: '',
      title: '',
      span: '',
      readonly: false,
      ceroParams: {
        unshow: ['org-info', 'role-info'],
        groundId: '',
        prem: 'add,delete,edit'
      },
      loading: true,
      listData: [],
      pagination: {},
      sorts: {},
      listConfig: {
        toolbars: [
          {
            key: 'search'
          },
          {
            key: 'join',
            label: '加入',
            icon: 'el-icon-plus',
            hidden: () => {
              return !this.rightsArr.includes('join')
            }
          },
          {
            key: 'add',
            label: '添加',
            icon: 'el-icon-plus',
            hidden: () => {
              return !this.rightsArr.includes('add')
            }
          },
          {
            key: 'edit',
            label: '编辑',
            icon: 'el-icon-edit',
            hidden: () => {
              return !this.rightsArr.includes('edit')
            }
          },
          {
            key: 'remove',
            label: this.rightsArr.includes('delete') ? '移除' : '删除',
            icon: this.rightsArr.includes('delete') ? 'el-icon-delete' : '',
            hidden: () => {
              if (this.rightsArr.includes('remove')) return false
              if (this.rightsArr.includes('delete')) return false
              return true
            }
          }
        ],
        searchForm: {
          inline: true,
          forms: [
            { prop: 'Q^NAME_^SL', label: '姓名：' },
            { prop: ['Q^CREATE_TIME_^DL', 'Q^CREATE_TIME_^DG'], label: '创建时间：', fieldType: 'daterange' }
          ]
        },
        // 表格字段配置
        columns: [
          { prop: 'name', label: '姓名' },
          { prop: 'status', label: '状态', tags: employeeStatusOption },
          { prop: 'gender', label: '性别', tags: genderOption },
          { prop: 'createTime', label: '创建时间' }
        ],
        rowHandle: {
          actions: [
            {
              key: 'remove',
              label: this.rightsArr.includes('delete') ? '移除' : '删除',
              icon: this.rightsArr.includes('delete') ? 'el-icon-delete' : '',
              hidden: () => {
                if (this.rightsArr.includes('delete')) return false
                if (this.rightsArr.includes('remove')) return false
                return true
              }
            },
            {
              key: 'edit',
              hidden: () => {
                return !this.rightsArr.includes('edit')
              }
            },
            {
              key: 'detail',
              hidden: () => {
                return !this.rightsArr.includes('detail')
              }
            }
          ]
        }
      }
    }
  },
  computed: {
    tableHeight() {
      return this.height
    }
  },
  watch: {
    visible() {
      if (this.visible) {
        this.loadData()
      }
    },
    id: {
      handler: function(val, oldVal) {
        this.ceroParams.groundId = val
        this.loadData()
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    // 初始化数据
    loadData() {
      this.loading = true
      queryPageList(this.getSearcFormData()).then(response => {
        ActionUtils.handleListData(this, response.data)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 查询
    getSearcFormData() {
      const params = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
      params['Q^GROUP_ID_^S'] = this.id
      return ActionUtils.formatParams(
        params,
        this.pagination,
        this.sorts)
    },
    /**
     * 处理排序
     */
    handleSortChange(sort) {
      ActionUtils.setSorts(this.sorts, sort)
      this.loadData()
    },
    /**
     * 处理分页事件
     */
    handlePaginationChange(page) {
      ActionUtils.setPagination(this.pagination, page)
      this.loadData()
    },
    search() {
      this.loadData()
    },
    handleAction(buttonKey, position, selection, data) {
      switch (buttonKey) {
        // 组织负责人
        case 'search':// 查询
          ActionUtils.setFirstPagination(this.pagination)
          this.search()
          break
        case 'join':// 加入
          this.handleJoin()
          break
        case 'edit':// 编辑
          ActionUtils.selectedRecord(selection).then((id) => {
            this.title = '编辑员工'
            this.span = 13
            this.handleAdd(id)
          }).catch(() => {})
          break
        case 'detail':// 明细
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleAdd(id, true)
            this.span = 24
            this.title = '员工明细'
          }).catch(() => {})
          break
        case 'add':// 添加
          this.span = 13
          this.title = '员工添加'
          this.handleAdd()
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
    // 添加人员
    handleAdd(editId, readonly = false) {
      this.editId = editId || ''
      this.editVisible = true
      this.readonly = readonly
    },
    // 加入人员
    handleJoin() {
      this.selectorVisible = true
    },
    handleSelectorActionEvent(buttonKey, data) {
      switch (buttonKey) {
        case 'confirm':// 确定
          this.handleConfirm(data)
          break
      }
    },
    handleConfirm(data) {
      addOrgUser({
        orgId: this.id,
        userIds: data.map((d) => { return d.id }).join(',')
      }).then(response => {
        this.selectorVisible = false
        ActionUtils.success('加入人员成功!')
        this.search()
      })
    },
    handleRemove(ids) {
      removeOrgUser({
        orgId: this.id,
        userIds: ids }).then(response => {
        ActionUtils.removeSuccessMessage()
        this.search()
      })
    }
  }
}
</script>
