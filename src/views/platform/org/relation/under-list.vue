<template>
  <div ref="relation" class="relation-list">
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
    <!-- 人员选择器 -->
    <ibps-employee-selector-dialog
      :visible="selectorVisible"
      :value="[]"
      multiple
      :is-super-init-tree="initNodeConfig"
      :custom-party-type-options="customPartyTypeOptions"
      :current-org-id="groupId"
      :party-type-id="typeId"
      :external-use-id="id"
      :options="extraOptions"
      @close="visible => selectorVisible = visible"
      @action-event="handleSelectorActionEvent"
    />
  </div>
</template>

<script>
import IbpsEmployeeSelectorDialog from '@/business/platform/org/employee/dialog'
import { queryUnderPageList, addUnder, removeUnder, get } from '@/api/platform/org/employee'

import ActionUtils from '@/utils/action'
import { statusOptions } from './constants'

export default {
  components: {
    IbpsEmployeeSelectorDialog
  },
  props: {
    id: [String, Number],
    externalGrounpId: String,
    identity: String,
    valid: {
      type: Boolean,
      default: true
    },
    superiorData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      height: document.clientHeight,
      clientHeight: '',
      title: '',
      loading: false,
      selectorVisible: false,
      typeId: '5',
      groupId: '',
      initNodeConfig: {
        initNode: this.$store.getters.isSuper
      },
      customPartyTypeOptions: [
        {
          value: 'org',
          label: '机构'
        }
      ],
      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      listData: [],
      listConfig: {
        toolbars: [
          { key: 'search' },
          { key: 'add' },
          { key: 'remove', label: '移除' }
        ],
        searchForm: {
          forms: [
            {
              prop: 'Q^NAME_^SL', label: '姓名'
            }, {
              prop: 'Q^STATUS_^S',
              label: '员工状态',
              fieldType: 'select',
              options: statusOptions
            }, {
              prop: ['Q^C.CREATE_TIME_^DL', 'Q^C.CREATE_TIME_^DG'],
              label: '添加为下级的时间',
              labelWidth: 130,
              fieldType: 'daterange'
            }
          ]
        },
        // 表格配置
        // 表格字段配置
        columns: [
          { prop: 'name', label: '姓名' },
          { prop: 'status', label: '员工状态', tags: statusOptions },
          { prop: 'gender',
            label: '性别',
            options: [{
              value: 'male',
              label: '男'
            },
            {
              value: 'female',
              label: '女',
              type: 'danger'
            }] },
          { prop: 'orgName', label: '归属组织路径' },
          { prop: 'createTime', label: '添加为下级的时间' }
        ],
        rowHandle: {
          actions: [
            {
              key: 'remove',
              label: '移除'
            }
          ]
        }
      },
      pagination: {},
      sorts: {},
      statusOptions: statusOptions,
      extraOptions: {}

    }
  },
  computed: {
    superior() {
      return this.superiorData
    }
  },
  watch: {
    clientHeight() {
      this.changeFixed(this.clientHeight)
    },
    id: {
      handler: function(val, oldVal) {
        if (this.$utils.isNotEmpty(val) && val !== oldVal) {
          this.search()
        }
      },
      immediate: true
    },
    externalGrounpId: {
      handler: function(val) {
        const isSuper = this.$store.getters.isSuper
        const userId = this.$store.getters.userId
        if (isSuper && userId !== val) {
          this.groupId = val
        }
      },
      immediate: true
    }
  },
  created() {
    this.clientHeight = `${document.documentElement.clientHeight}` - (this.$store.getters.isSuper ? 215 : 150)
    this.gettypeId()
  },
  methods: {
    gettypeId() {
      get({
        employeeId: this.id
      }).then(response => {
        this.groupId = response.data.groupID
      })
    },
    changeFixed(clientHeight) {
      this.$refs.relation.style.height = clientHeight + 'px'
    },
    // 加载数据
    loadData() {
      this.loading = true
      queryUnderPageList(this.getSearcFormData()).then(response => {
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
      params['Q^MAIN_PID_^S'] = this.id
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
          this.handleAdd()
          // alert(1)
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
    handleAdd() {
      this.selectorVisible = true
      this.extraOptions = {
        userid: this.id,
        initLoad: true
      }
    },
    handleSelectorActionEvent(buttonKey, data) {
      switch (buttonKey) {
        case 'confirm':// 确定
          this.handleConfirm(data)
          break
      }
    },
    handleConfirm(data) {
      if (!this.valid) {
        this.$message({
          message: '外部员工值不能为空！',
          type: 'warning'
        })
        return
      }
      const sameIdIndex = data.findIndex(item => item.id === this.id)
      let isExistSuperior = false
      const superior = this.superior
      const params = {}
      params.employeeId = this.id
      params.underIds = data.map((d) => { return d.id }).join(',')
      superior.forEach(i => {
        data.forEach(l => {
          if (i.id === l.id) {
            isExistSuperior = true
          }
        })
      })
      if (sameIdIndex > -1 || isExistSuperior) {
        ActionUtils.warning('添加失败，不能添加自己或者上属')
        return
      }
      addUnder({
        employeeId: this.id,
        underIds: data.map((d) => { return d.id }).join(',')
      }).then(response => {
        this.selectorVisible = false
        ActionUtils.success('添加下属员工成功!')
        this.search()
      })
    },
    handleRemove(ids) {
      // 删除数据
      removeUnder({
        employeeId: this.id,
        underIds: ids }
      ).then(response => {
        ActionUtils.removeSuccessMessage()
        this.search()
      })
    }
  }
}
</script>
<style lang="scss">
.relation-list {
  .ibps-container-crud{
    border: none !important;
  }
}
</style>
