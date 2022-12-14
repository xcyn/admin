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
        :identity="CAT_TYPE_TREE"
        title="分类管理"
        @action-event="handleTreeAction"
        @node-click="handleNodeClick"
        @expand-collapse="handleExpandCollapse"
      >
        <el-select slot="searchForm" v-model="categoryKey" @change="loadTreeData(false)">
          <el-option
            v-for="item in categoryOptions"
            :key="item.id"
            :label="item.name"
            :value="item.categoryKey"
          />
        </el-select>
      </ibps-tree>
    </div>

    <ibps-container
      :margin-left="width+'px'"
      class="page"
    >
      <edit
        v-show="show"
        :id="editId"
        ref="editForm"
        :readonly="readonly"
        :category-key="categoryKey"
        :parent-data="nodeData"
        :is-private="isPrivate"
        :random-num="randomNum"
        display-type="edit"
        @callback="loadTreeData"
      />
      <el-alert
        v-show="!show"
        :closable="false"
        title="请选择左边菜单右键进行操作！"
        type="warning"
        show-icon
        style="height:50px;"
      />
    </ibps-container>

    <!-- 数据字典 -->
    <import-xml
      :id="editId"
      :visible="importFormVisible"
      @callback="callback"
      @close="visible => importFormVisible = visible"
    />
    <sort
      :id="editId"
      :visible="sortFormVisible"
      title="分类排序"
      @callback="callback"
      @close="visible => sortFormVisible = visible"
    />
  </ibps-layout>
</template>
<script>
import { queryPageList } from '@/api/platform/cat/category'
import { remove, exportXml, findTreeData } from '@/api/platform/cat/type'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import ImportXml from './import-xml'
import Sort from './sort'
import Edit from './edit'
import Identity from '@/constants/identity'

export default {
  components: {
    ImportXml,
    Sort,
    Edit
  },
  mixins: [FixHeight],
  data() {
    return {
      width: 200,
      CAT_TYPE_TREE: Identity.IBPS.SYSTEM.CAT_TYPE_TREE,
      height: document.clientHeight,
      importFormVisible: false,
      sortFormVisible: false,
      editId: '0', // 编辑dialog需要使用
      readonly: false, // 是否只读
      randomNum: '',
      loading: false,
      // 树配置
      treeOptions: { 'rootPId': '-1' },
      treeContextmenus: [
        { icon: 'add',
          label: '添加分类',
          key: 'add',
          rights: function(menu, data, isRoot) {
            if (isRoot) return true
            if (data.struType === '0') return false // 平铺结构类型不允许添加子分类
            if (!(data.ownerId === '0' || this.$utils.isEmpty(data.ownerId))) {
              return false
            }
            return true
          } },
        { icon: 'add',
          label: '添加私有分类',
          key: 'addPrivate',
          rights: function(menu, data, isRoot) {
            if (data.struType === '0') return false // 平铺结构类型不允许添加子分类
            return true
          } },
        { icon: 'edit', label: '编辑分类', key: 'edit', rights: ['node'] },
        { icon: 'delete', label: '删除分类', key: 'remove', rights: ['node'] },
        { divided: true },
        { icon: 'export', label: '导出', key: 'export' },
        { icon: 'import', label: '导入', key: 'import' },
        { divided: true,
          rights: function(menu, data, isRoot) {
            if (isRoot) return true
            if (data.isLeaf === 'Y') return false
            return true
          } },
        { icon: 'sort',
          label: '子节点排序',
          key: 'sort',
          rights: function(menu, data, isRoot) {
            if (isRoot) return true
            if (data.isLeaf === 'Y') return false
            return true
          } }
      ],
      treeData: [],
      nodeData: {},
      isPrivate: false,
      type: {},
      categoryKey: 'FLOW_TYPE',
      categoryOptions: [],
      show: false
    }
  },
  created() {
    this.loadCategoryData()
    this.loadTreeData()
  },
  methods: {
    // 加载下拉框 分类标识数据
    loadCategoryData() {
      this.loading = true
      queryPageList({}).then(response => {
        this.categoryOptions = response.data.dataResult
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 加载具体分类数据
    loadTreeData(isEdit) {
      findTreeData({ 'categoryKey': this.categoryKey }).then(response => {
        const data = response.data
        this.treeData = data
        this.show = isEdit
      })
    },
    handleTreeAction(command, position, selection, data) {
      if (position === 'toolbar') {
        if (command === 'refresh') {
          this.loadTreeData()
        }
      } else {
        if (command === 'add') { // 添加
          this.editId = null
          this.nodeData = data
          this.isPrivate = false
          this.handTreeEdit()
        } else if (command === 'addPrivate') {
          this.editId = null
          this.isPrivate = true
          this.nodeData = data
          this.handTreeEdit()
        } else if (command === 'edit') {
          this.handleNodeClick(data, false)
        } else if (command === 'remove') {
          this.handleTreeRemove(data.id)
        } else if (command === 'export') {
          this.handTreeExport(data.id, data.name)
        } else if (command === 'import') {
          this.handTreeImport(data.id)
        } else if (command === 'sort') {
          this.handTreeSort(data)
        }
      }
    },
    handleNodeClick(data, readonly = true) {
      if (data.depth === 0 || data.parentId === '-1') {
        return
      }
      this.readonly = readonly
      this.nodeData = data
      this.editId = data.id
      this.show = true
      this.randomNum = (new Date()).getTime()
    },
    handleExpandCollapse(isExpand, readonly = false) {
      this.width = isExpand ? 200 : 50
    },
    handTreeEdit(editId, readonly = false) {
      this.editId = editId || ''
      this.readonly = readonly
      this.show = true
      this.randomNum = (new Date()).getTime()
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
    handTreeExport(editId, name) {
      // 获取数据
      exportXml({ typeId: editId }).then(response => {
        ActionUtils.exportFile(response.data, name + '.xml')
      }).catch(() => {

      })
    },
    handleTreeRemove(ids) {
      // 获取数据
      remove({ typeId: ids }).then(response => {
        ActionUtils.removeSuccessMessage()
        this.loadTreeData()
      }).catch(() => {

      })
    },
    getSelectedData(id, list) {
      for (let index = 0; index < list.length; index++) {
        if (list[index].id === id) {
          return list[index]
        }
      }
    },
    callback(data) {
      this.loadTreeData()
    }

  }
}
</script>
