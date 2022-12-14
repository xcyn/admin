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
      <template slot="isMulti" slot-scope="isMultiRows">
        <el-tag v-if="isMultiRows.row.dataType!=='OPTION'" type="danger">否</el-tag>
        <el-tag v-else :type="isMultiRows.row.isMulti|optionsFilter(multiOptions,'type')">  {{ isMultiRows.row.isMulti|optionsFilter(multiOptions,'label') }} </el-tag>
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
import { queryPageList, remove } from '@/api/platform/org/attr'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import { partyTypeOptions, attrTypeOptions, dataTypeOptions } from './constants'
import Edit from './edit'
import Identity from '@/constants/identity'

export default {
  components: {
    Edit
  },
  mixins: [FixHeight],
  data() {
    const multiOptions = [
      { value: 'Y', label: '是', type: 'primary' },
      { value: 'N', label: '否', type: 'danger' }
    ]
    return {
      identity: Identity.IBPS.ORG.ATTR,
      dialogFormVisible: false, // 弹窗
      editId: '', // 编辑dialog需要使用
      readonly: false, // 是否只读
      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      multiOptions: multiOptions,
      title: '',
      loading: true,
      height: document.clientHeight,
      pagination: {},
      sorts: {},
      listData: [],
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
            { prop: 'Q^NAME_^SL', label: '属性名称', itemWidth: 190, labelWidth: 85 },
            { prop: 'Q^PARTY_TYPE_^S', label: '参与者类型', fieldType: 'select', options: partyTypeOptions, itemWidth: 190, labelWidth: 85 },
            // { prop: 'Q^TYPE_^S', label: '属性类型', fieldType: 'select', options: attrTypeOptions, itemWidth: 190, labelWidth: 85 },
            { prop: 'Q^DATA_TYPE_^S', label: '数据类型', fieldType: 'select', options: dataTypeOptions, itemWidth: 190, labelWidth: 85 }
          ]
        },
        // 表格字段配置
        columns: [
          { prop: 'name', label: '属性名称' },
          { prop: 'key', label: '业务主键' },
          { prop: 'partyTypeName', label: '参与者类型', options: partyTypeOptions },
          { prop: 'typeName', label: '属性类型', options: attrTypeOptions },
          { prop: 'dataTypeName', label: '数据类型', options: dataTypeOptions },
          { prop: 'isMulti', label: '是否多选', slotName: 'isMulti' },
          { prop: 'createTime', label: '创建时间' }
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
          this.title = '添加属性'
          break
        case 'edit':// 编辑
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleEdit(id)
            this.title = '编辑属性'
          }).catch(() => { })
          break
        case 'detail':// 明细
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleEdit(id, true)
            this.title = '属性明细'
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
      remove({ attrIds: ids }).then(response => {
        ActionUtils.removeSuccessMessage()
        this.search()
      }).catch(() => {})
    }
  }
}
</script>
