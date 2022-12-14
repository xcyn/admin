<template>
  <ibps-layout ref="layout">
    <!--  -->
    <div slot="west">
      <ibps-tree
        :width="width"
        :height="height"
        :data="treeData"
        :options="treeOptions"
        :contextmenus="treeContextmenus"
        :identity="CAT_DICTIONARY_TREE"
        title="数据字典"
        @action-event="handleTreeAction"
        @node-click="handleNodeClick"
        @expand-collapse="handleExpandCollapse"
      />

    </div>
    <ibps-container
      :margin-left="width+'px'"
      class="page"
    >
      <el-alert
        v-if="!show"
        :closable="false"
        title="请选择左边菜单右键进行操作！"
        type="warning"
        show-icon
        style="height:50px;"
      />

      <template v-if="show && isTree">
        <ibps-crud
          key="istree"
          ref="crud"
          :height="height"
          :data="isTree?listTreeData:listData"
          :toolbars="listConfig.toolbars"
          :search-form="listConfig.searchForm"
          :pk-key="pkKey"
          :columns="listConfig.columns"
          :pagination="pagination"
          :loading="loading"
          :options="listOptions"
          :show-pagination="!isTree"
          :identity="identity"
          @action-event="handleAction"
          @sort-change="handleSortChange"
          @pagination-change="handlePaginationChange"
        />
      </template>
      <template v-else>
        <ibps-crud
          key="notTree"
          ref="crud"
          :height="height"
          :data="isTree?listTreeData:listData"
          :toolbars="listConfig.toolbars"
          :search-form="listConfig.searchForm"
          :pk-key="pkKey"
          :columns="listConfig.columns"
          :pagination="pagination"
          :loading="loading"
          :options="listOptions"
          :show-pagination="!isTree"
          :identity="identity"
          @action-event="handleAction"
          @sort-change="handleSortChange"
          @pagination-change="handlePaginationChange"
        />
      </template>

    </ibps-container>
    <!-- 数据字典项 -->
    <edit
      :id="editId"
      :type-id="typeId"
      :parent="parent"
      :dic-parent="dicParent"
      :title="title"
      :visible="dialogFormVisible"
      :readonly="readonly"
      :is-tree="isTree"
      :identity="identity"
      @callback="search"
      @close="visible => dialogFormVisible = visible"
    />
    <!-- 数据字典的分类编辑 -->
    <edit-type
      :id="editId"
      :parent-data="dicParent"
      :is-private="isPrivate"
      :title="title"
      :visible="dicFormVisible"
      :identity="identity+'_tree'"
      category-key="DIC_TYPE"
      @callback="search"
      @close="visible => dicFormVisible = visible"
      @refresh-tree="loadTreeData"
    />
    <import-xml
      :id="editId"
      :visible="importFormVisible"
      @callback="search"
      @close="visible => importFormVisible = visible"
    />
    <sort
      :id="editId"
      :visible="sortFormVisible"
      title="分类排序"
      @callback="search"
      @close="visible => sortFormVisible = visible"
      @refresh-tree="loadTreeData"
    />
  </ibps-layout>
</template>
<script>
import { remove, queryPageList, exportXml } from '@/api/platform/cat/dictionary'
import { remove as removeType, findTreeData } from '@/api/platform/cat/type'
import ActionUtils from '@/utils/action'
import TreeUtils from '@/utils/tree'
import FixHeight from '@/mixins/height'
import EditType from '@/views/platform/cat/type/edit'
import Edit from './edit'
import ImportXml from './import-xml'
import Sort from './sort'
import Identity from '@/constants/identity'

export default {
  components: {
    Edit,
    EditType,
    ImportXml,
    Sort
  },
  mixins: [FixHeight],
  data() {
    return {
      identity: Identity.IBPS.SYSTEM.CAT_DICTIONARY,
      CAT_DICTIONARY_TREE: Identity.IBPS.SYSTEM.CAT_DICTIONARY_TREE,
      show: false,
      width: 200,
      height: document.clientHeight,
      dialogFormVisible: false, // 弹窗
      dicFormVisible: false, // 弹窗
      importFormVisible: false,
      sortFormVisible: false,
      editId: '', // 编辑dialog需要使用
      dicParent: {}, // 记录数据字典信息
      readonly: false, // 是否只读
      title: '数据字典',

      // 数据字典列表
      isTree: false,
      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      loading: false,
      listData: [],
      listTreeData: [],
      listConfig: {
        // 工具栏
        toolbars: [
          { key: 'search' },
          { key: 'add' },
          { key: 'edit' },
          { key: 'remove' }
        ],
        // 查询条件
        searchForm: {
          forms: [
            { prop: 'Q^NAME_^SL', label: '字典对照值' },
            { prop: 'Q^KEY_^SL', label: '字典对照码' }
          ]
        },
        // 表格字段配置
        columns: [
          { prop: 'name', label: '字典对照值' },
          { prop: 'key', label: '字典对照码' }
        ]
      },
      listOptions: {
        border: true,
        stripe: true
      },
      pagination: {},
      sorts: {},

      // 树配置
      treeOptions: { 'rootPId': '-1' },
      treeContextmenus: [
        { icon: 'add',
          label: '添加字典分类',
          key: 'add',
          rights: function(menu, data, isRoot) {
            if (isRoot) return true
            if (!(data.ownerId === '0' || this.$utils.isEmpty(data.ownerId))) {
              return false
            }
            return true
          } },
        { icon: 'add', label: '添加私有字典分类', key: 'addPrivate' },
        { icon: 'edit', label: '编辑字典分类', key: 'edit', rights: ['node'] },
        { icon: 'delete', label: '删除字典分类', key: 'remove', rights: ['node'] },
        { divided: true, rights: ['node'] },
        { icon: 'export', label: '导出', key: 'export' },
        { icon: 'import', label: '导入', key: 'import' },
        { divided: true },
        { icon: 'sort', label: '子节点排序', key: 'sort' }
      ],
      treeData: [],
      parent: {},
      isPrivate: false,
      typeId: ''
    }
  },
  created() {
    // this.loadData()
    this.loadTreeData()
  },
  methods: {
    /**
     * 加载数据
     */
    loadData() {
      this.loading = true
      queryPageList(this.getSearcFormData()).then(response => {
        ActionUtils.handleListData(this, response.data)
        if (this.isTree) {
          this.listTreeData = TreeUtils.transformToTreeFormat(JSON.parse(JSON.stringify(this.listData)), {
            idKey: 'id',
            pIdKey: 'parentId',
            childrenKey: 'children'
          })
        }
        // this.pagination.totalCount = this.listData.length
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    getPagination() {
      return this.isTree ? {
        pageNo: 1,
        limit: 1000000000
      } : this.pagination
    },
    /**
     * 获取格式化参数
     */
    getSearcFormData() {
      const params = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
      params['Q^TYPE_ID_^S'] = this.dicParent.id
      return ActionUtils.formatParams(
        params,
        this.getPagination(),
        this.sorts)
    },
    /**
     * 处理分页事件
     */
    handlePaginationChange(page) {
      ActionUtils.setPagination(this.getPagination(), page)
      this.loadData()
    },
    /**
     * 处理排序
     */
    handleSortChange(sort) {
      ActionUtils.setSorts(this.sorts, sort)
      this.loadData()
    },
    search() {
      this.loadData()
      this.loadTreeData()
    },
    /**
     * 重置查询条件
     */
    reset() {
      this.$refs['crud'].handleReset()
    },
    /**
     * 处理编辑
     */
    handleEdit(editId) {
      this.editId = editId || ''
      this.dialogFormVisible = true
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
          this.title = '添加数据字典项'
          if (selection && selection.length >= 1) {
            this.parent = this.getSelectedData(selection[0])
            this.handleEdit()
          } else {
            this.parent = this.dicParent
            this.handleEdit()
          }
          break
        case 'edit':// 编辑
          this.title = '编辑数据字典项'
          ActionUtils.selectedRecord(selection).then((id) => {
            this.typeId = this.getSelectedData(id).typeId
            this.handleEdit(id)
          }).catch(() => { })
          break
        case 'remove':// 删除
          ActionUtils.removeRecord(selection, this.$t('common.dialog.removeRecord'), true).then((ids) => {
            this.handleRemove(ids)
          }).catch(() => { })
          break
        default:
          break
      }
    },
    handleRemove(ids) {
      ids.forEach(id => {
        remove({ dictionaryId: id }).then(response => {
          ActionUtils.removeSuccessMessage()
          this.search()
        }).catch(() => {
        })
      })
    },
    loadTreeData() {
      findTreeData({ 'categoryKey': 'DIC_TYPE' }).then(response => {
        this.treeData = response.data
      })
    },
    handleTreeAction(command, position, selection, data) {
      switch (command) {
        case 'refresh':// 查询
          this.loadTreeData()
          break
        case 'add':// 添加数据字典分类
          this.dicParent = data
          this.isPrivate = false
          this.title = '添加数据字典分类'
          this.handTreeEdit()
          break
        case 'addPrivate':// 添加私有字典分类
          this.dicParent = data // { 'name': data.name, 'id': data.id }
          this.isPrivate = true
          this.title = '添加私有字典分类'
          this.handTreeEdit()
          break
        case 'edit':// 编辑
          this.dicParent = data
          this.isPrivate = true
          this.title = '编辑数据字典分类'
          this.handTreeEdit(data.id)
          break
        case 'remove':// 删除
          this.handleTreeRemove(data.id)
          break
        case 'export':// 导出
          this.handTreeExport(data)
          break
        case 'import':// 导入
          this.handTreeImport(data.id)
          break
        case 'sort':// 排序
          this.handTreeSort(data)
          break
      }
    },
    handleNodeClick(data) {
      if (data.typeKey === 'DIC_TYPE') {
        this.show = false
        return
      }
      this.show = true
      this.dicParent = data
      this.isTree = data.struType === '1'
      this.listOptions = {}
      if (this.isTree) {
        this.listOptions = {
          highlightCurrentRow: true,
          defaultExpandAll: true,
          rowKey: 'id',
          treeProps: {
            children: 'children',
            hasChildren: 'hasChildren'
          }
        }
      } else {
        this.listOptions = {
          highlightCurrentRow: true,
          border: true,
          stripe: true
        }
      }
      this.pagination = {}
      this.loadData()
    },
    handleExpandCollapse(isExpand) {
      this.width = isExpand ? 200 : 30
    },
    handTreeEdit(editId) {
      this.editId = editId || ''
      this.dicFormVisible = true
    },
    handTreeImport(editId) {
      this.editId = editId || ''
      this.importFormVisible = true
    },
    handTreeSort(data) {
      const children = data.children
      if (children && children.length > 0) {
        if (children.length === 1) {
          ActionUtils.warning('只有一个节点无需排序')
        } else {
          this.editId = data.id || ''
          this.sortFormVisible = true
        }
      } else {
        ActionUtils.warning('无子节点排序')
      }
    },
    handTreeExport(data) {
      const name = data.name
      const isRoot = data.typeKey === 'DIC_TYPE' || false
      const params = { dictionaryId: data.id }
      if (isRoot) {
        params.isRoot = true
      }
      // 获取数据
      exportXml(params).then(response => {
        ActionUtils.exportFile(response.data, name + '.xml')
      }).catch(() => {

      })
    },
    handleTreeRemove(ids) {
      this.$confirm(this.$t('common.dialog.removeRecord')).then(() => {
        removeType({ typeId: ids }).then(response => {
          ActionUtils.removeSuccessMessage()
          this.loadTreeData()
        }).catch((err) => {
          console.err(err)
        })
      }).catch(() => {})
    },
    getSelectedData(id) {
      const data = this.listData
      for (let index = 0; index < data.length; index++) {
        if (data[index].id === id) {
          return data[index]
        }
      }
    }
  }
}
</script>
