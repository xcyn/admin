<template>
  <div :style="{height:height+'px'}">
    <ibps-crud
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
    >
      <template slot="levelOptions" slot-scope="scope">
        <el-tooltip :content="scope.row.levelID |optionsFilter(levelOptions,'name','id') ">
          <el-tag>
            {{ scope.row.levelID |optionsFilter(levelOptions,'name','id') }}
          </el-tag>
        </el-tooltip>
      </template>
    </ibps-crud>
    <!-- 岗位选择器 -->
    <ibps-position-selector-dialog
      :visible="selectorVisible"
      :value="[]"
      multiple
      class="auth-position-dialog"
      @close="visible => selectorVisible = visible"
      @action-event="handleSelectorActionEvent"
    />
    <!-- 添加 -->
    <edit
      :id="editId"
      :title="title"
      :readonly="readonly"
      :visible="editVisible"
      :org-id="id"
      :identity="identity"
      @close="visible => editVisible = visible"
      @callback="search"
    />
  </div>
</template>
<script>
import IbpsPositionSelectorDialog from '@/business/platform/org/position/dialog'
import edit from './edit'
import ActionUtils from '@/utils/action'
import { queryWithLevelByOrgId as queryPageList, assignOrg, removeOrg } from '@/api/platform/org/position'
import { findByType as findLevelByType } from '@/api/platform/org/level'
export default {
  components: {
    IbpsPositionSelectorDialog,
    edit
  },
  props: {
    rowHandle: {
      type: Boolean,
      default: false
    },
    id: [String, Number],
    height: Number,
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
      readonly: false,
      pkKey: 'id',
      editId: '',
      title: '',
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
            icon: 'el-icon-delete',
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
            { prop: 'Q^NAME_^SL', label: '岗位名称：' }
          ]
        },
        // 表格字段配置
        columns: [
          { prop: 'name', label: '岗位名称' },
          { prop: 'levelID', label: '等级', slotName: 'levelOptions' }
          // { prop: 'type', label: '业务类型', options: [{ value: 'no', label: '无' }] }
        ],
        rowHandle: {
          actions: [
            {
              key: 'edit',
              hidden: () => {
                return !this.rightsArr.includes('edit') && !this.rowHandle
              }
            },
            {
              key: 'remove',
              label: this.rightsArr.includes('delete') ? '移除' : '删除',
              hidden: () => {
                return !this.rightsArr.includes('remove') && !this.rowHandle
              }
            },
            {
              key: 'detail',
              hidden: () => {
                return !this.rightsArr.includes('detail') && !this.rowHandle
              }
            }
          ]
        }
      },
      levelOptions: []
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
  created() {
    this.loadLevelList()
  },
  methods: {
    loadLevelList() {
      findLevelByType({
        type: 'position'
      }).then(response => {
        this.levelOptions = response.data
      })
    },
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
      params['Q^ORG_ID_^S'] = this.id
      // 和分页数据合并
      return ActionUtils.formatParams(params, this.pagination, this.sorts)
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
        case 'join':// 设置
          this.handlejoin()
          break
        case 'add'://
          this.title = '添加岗位'
          this.handleAdd()
          break
        case 'edit'://
          this.title = '编辑岗位'
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleAdd(id)
          }).catch(() => {})
          break
        case 'detail'://
          this.title = '明细岗位'
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleAdd(id, true)
          }).catch(() => {})
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
    // 处理 添加岗位
    handlejoin() {
      this.selectorVisible = true
    },
    handleAdd(editId = '', readonly = false) {
      this.editId = editId
      this.readonly = readonly
      this.editVisible = true
    },
    handleSelectorActionEvent(buttonKey, data) {
      switch (buttonKey) {
        case 'confirm':// 确定
          this.handleConfirm(data)
          break
      }
    },
    handleConfirm(data) {
      assignOrg({
        orgId: this.id,
        positionIds: data.map((d) => { return d.id }).join(',')
      }).then(response => {
        this.selectorVisible = false
        ActionUtils.success('加入组织成功!')
        this.search()
      })
    },
    handleRemove(ids) {
      // 获取数据
      removeOrg({ positionIds: ids }).then(response => {
        ActionUtils.removeSuccessMessage()
        this.search()
      })
    }
  }
}
</script>
<style lang="scss">
// .auth-position-dialog{
//   .el-dialog__body{
//     height:  calc(73vh - 120px) !important;
//   }
// }
</style>
