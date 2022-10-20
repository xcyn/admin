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
      :index-row="false"
      :identity="identity"
      @action-event="handleAction"
      @sort-change="handleSortChange"
      @pagination-change="handlePaginationChange"
    >
      <!-- 搜索栏插槽 -->
      <template #scope>
        <el-select v-model="typeValue" clearable placeholder="请选择">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </template>
      <!-- 表格字段插槽 -->
      <template slot="typeKeyColumns" slot-scope="typeKeyColumns">
        <el-tag>  {{ typeKeyColumns.row.typeKey|optionsFilter(typeOptions,'label') }} </el-tag>
      </template>
    </ibps-crud>
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
import { queryPageList, remove } from '@/api/platform/message/messageTemplate'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import { defaultOptions } from './constants'
import Edit from './edit'
import { findTreeData } from '@/api/platform/cat/type'
import Identity from '@/constants/identity'

export default {
  components: {
    Edit
  },
  mixins: [FixHeight],
  data() {
    return {
      identity: Identity.IBPS.MESSAGE.TEMPLATE,
      dialogFormVisible: false, // 弹窗
      editId: '', // 编辑dialog需要使用
      readonly: false, // 是否只读
      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      typeOptions: [],
      title: '',
      loading: true,
      height: document.clientHeight,
      typeValue: '',
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
            key: 'detail'
          }
        ],
        searchForm: {
          forms: [
            { prop: 'Q^name_^SL', label: '名称' },
            { prop: 'Q^key_^SL', label: '业务主键' },
            {
              prop: 'Q^type_key_^SL',
              label: '模板分类',
              placeholder: '全部',
              fieldType: 'slot',
              slotName: 'scope'
            },
            {
              prop: 'Q^is_default_^S',
              label: '是否默认',
              fieldType: 'select',
              placeholder: '全部',
              options: defaultOptions
            }
          ]
        },
        // 表格字段配置
        columns: [
          { prop: 'name', label: '名称', sortable: 'custom' },
          { prop: 'key', label: '业务主键', sortable: 'custom' },
          { prop: 'typeKey', label: '模板分类', slotName: 'typeKeyColumns', sortable: 'custom' },
          { prop: 'subject', label: '标题', sortable: 'custom' },
          { prop: 'createTime', label: '创建时间', sortable: 'custom', dateFormat: 'yyyy-MM-dd HH:mm:ss' },
          { prop: 'isDefault', label: '是否默认', tags: defaultOptions, valueKey: 'value', sortable: 'custom' }
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
    this.loadTypeData()
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
      const params = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
      params['Q^type_key_^SL'] = this.typeValue
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
    handleAction(command, position, selection, data) {
      switch (command) {
        case 'search':// 查询
          ActionUtils.setFirstPagination(this.pagination)
          this.search()
          break
        case 'add':// 添加
          this.handleEdit()
          this.title = '添加消息模板'
          break
        case 'edit':// 编辑
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleEdit(id)
            this.title = '编辑消息模板'
          }).catch(() => { })
          break
        case 'detail':// 明细
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleEdit(id, true)
            this.title = '消息模板明细'
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
      remove({ messageTemplateIds: ids }).then(response => {
        ActionUtils.removeSuccessMessage()
        this.search()
      }).catch(() => {})
    },
    loadTypeData() {
      findTreeData({ categoryKey: 'MSG_TEL_TYPE' }).then(response => {
        const data = response.data
        this.typeOptions = data.map(item => {
          return {
            value: item.typeKey,
            label: item.name
          }
        })
      }).catch(() => {
      })
    }
  }
}
</script>
