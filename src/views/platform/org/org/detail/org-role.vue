<template>
  <div :style="{height:height+'px'}">
    <ibps-crud
      v-if="visible"
      ref="crud"
      :height="tableHeight"
      :data="listData"
      :toolbars="listConfig.toolbars"
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
    <!-- 角色选择器 -->
    <ibps-role-selector-dialog
      :visible="selectorVisible"
      :is-auth="isAuth"
      :org-id="id"
      :value="[]"
      multiple
      @close="visible => selectorVisible = visible"
      @action-event="handleSelectorActionEvent"
    />
  </div>
</template>
<script>
import IbpsRoleSelectorDialog from '@/business/platform/org/role/dialog'
import { queryByOrgId as queryPageList } from '@/api/platform/org/role' // 组织角色
import { assignRole, removeRole } from '@/api/platform/org/org' // 组织角色

import ActionUtils from '@/utils/action'

export default {
  components: {
    IbpsRoleSelectorDialog
  },
  props: {
    id: [String, Number],
    height: Number,
    visible: Boolean,
    rightsArr: {
      type: Array,
      default: () => []
    },
    identity: String,
    isAuth: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectorVisible: false,

      pkKey: 'id',
      loading: false,
      listData: [],
      pagination: {},
      sorts: {},
      listConfig: {
        toolbars: [
          {
            key: 'add',
            label: '添加角色',
            icon: 'el-icon-circle-plus-outline',
            hidden: () => {
              if (this.rightsArr.includes('add')) return false
              if (this.rightsArr.includes('join')) return false
              return true
            }
          },
          {
            key: 'remove',
            label: '移除',
            icon: 'el-icon-delete',
            hidden: () => {
              if (this.rightsArr.includes('remove')) return false
              if (this.readonly !== true) return false
              return true
            }
          }
        ],
        // 表格字段配置
        columns: [
          { prop: 'name', label: '角色名' },
          { prop: 'roleAlias', label: '别名' },
          { prop: 'subSystemName', label: '子系统名称' },
          { prop: 'source', label: '来源' }
        ],
        rowHandle: {
          actions: [
            {
              key: 'remove',
              label: '移除',
              icon: 'el-icon-delete',
              hidden: (row, index) => {
                if (row.canDelete === true && this.readonly !== true) return false
                return true
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
    }
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
      params['orgId'] = this.id
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
        case 'add':// 添加
          this.handleAdd()
          break
        case 'remove':// 删除
          ActionUtils.removeRecord(selection, '此操作将移除该角色数据, 是否确定?').then((ids) => {
            this.handleRemove(ids)
          }).catch(() => { })
          break
        default:
          break
      }
    },
    // 添加角色
    handleAdd() {
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
      assignRole({
        orgId: this.id,
        roleIds: data.map((d) => { return d.id }).join(',')
      }).then(response => {
        this.selectorVisible = false
        ActionUtils.success('设置角色成功!')
        this.search()
      })
    },
    checkOther(ids) {
      let isMove = true
      const idArr = ids.split(',')
      const data = this.listData
      idArr.forEach(i => {
        data.forEach(l => {
          if (i === l.id && l.canDelete === false) {
            isMove = false
          }
        })
      })
      return isMove
    },
    handleRemove(ids) {
      if (!this.checkOther(ids)) {
        this.$message({
          message: '删除的数据中包含其他来源，请勿删除。',
          type: 'warning'
        })
        return
      }
      removeRole({
        orgId: this.id,
        roleIds: ids
      }).then(response => {
        ActionUtils.removeSuccessMessage()
        this.search()
      })
    }
  }
}
</script>
