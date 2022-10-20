<template>
  <ibps-layout ref="layout">
    <div slot="west">
      <ibps-tree
        ref="tree"
        :width="width"
        :height="height"
        :loading="loading"
        :data="treeData"
        :options="treeOptions"
        :contextmenus="treeContextmenus"
        :identity="RESOURCES_TREE"
        title="菜单管理"
        @action-event="handleTreeAction"
        @node-click="handleNodeClick"
        @expand-collapse="handleExpandCollapse"
      >

        <el-select
          slot="searchForm"
          v-model="systemId"
          placeholder="请先设置子系统"
          @change="changeSystem"
        >
          <el-option
            v-for="item in subsystemList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </ibps-tree>
      <ibps-container
        :margin-left="width+'px'"
        class="page"
      >
        <edit
          v-if="show==='edit'"
          :id="id"
          :parent-id="parentId"
          :system-id="systemId"
          @callback="search"
        />
        <el-alert
          v-else
          :closable="false"
          title="请选择左边菜单右键进行操作！"
          type="warning"
          show-icon
          style="height:50px;"
        />
      </ibps-container>

      <!-- 导入定义 -->
      <import-Menu
        :id="systemId"
        :resource-id="resourceId"
        :visible="importFormVisible"
        @callback="search"
        @close="visible => importFormVisible = visible"
      />

      <!--移动节点-->
      <move-node
        :id="id"
        :visible="moveNodeVisible"
        :system-id="systemId"
        :data="treeData"
        @callback="search"
        @close="visible => moveNodeVisible = visible"
      />

      <node-sort
        :data="sortData"
        :visible="nodeSortVisible"
        title="菜单排序"
        @close="visible => nodeSortVisible = visible"
        @callback="search"
      />
      <!-- API 授权申请 -->
      <client-grant
        :title="title"
        :client-key="clientKey"
        :grant-type="grantType"
        :visible="apiGrantVisible"
        :identity="identitys"
        @callback="search"
        @close="visible => apiGrantVisible = visible"
      />
    </div>
  </ibps-layout>
</template>
<script>
import { getTreeData, remove, exportXml, updateNode } from '@/api/platform/auth/resources'
import { findAllSubsystem } from '@/api/platform/auth/subsystem'
import ClientGrant from '@/views/platform/auth/client/grant/index'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'

import Edit from './edit'
import MoveNode from './move-node'
import NodeSort from './sort'
import ImportMenu from './import'
import Identity from '@/constants/identity'
export default {
  components: {
    Edit,
    MoveNode,
    NodeSort,
    ClientGrant,
    ImportMenu
  },
  mixins: [FixHeight],
  data() {
    return {
      show: '',
      width: 230,
      RESOURCES_TREE: Identity.IBPS.SYSTEM.RESOURCES_TREE,
      identitys: {
        CLIENTGRANTDIALOG: Identity.IBPS.SYSTEM.APP_GRANT_DIALOG,
        CLIENTGRANTDIALOGAUDIT: Identity.IBPS.SYSTEM.APP_GRANT_DIALOG_AUDIT
      },
      height: document.clientHeight,
      id: '',
      title: '',
      parentId: '',
      // 移动节点
      moveNodeVisible: false,
      importFormVisible: false,
      apiGrantVisible: false,
      subsystemList: [],
      systemId: '',
      resourceId: '',
      sortData: '',
      nodeSortVisible: false,
      clientKey: '',
      grantType: '',
      // 树配置
      loading: false,
      treeOptions: { 'rootPId': '-1', showIcon: true },
      treeContextmenus: [
        { icon: 'add',
          label: '添加',
          key: 'add',
          rights: function(menu, data, isRoot) {
            if (isRoot) return true
            return data.isFolder
          } },
        // { icon: 'edit', label: '编辑', key: 'edit', rights: ['node'] },
        { icon: 'remove', label: '删除', key: 'remove', rights: ['node'] },
        { divided: true, rights: ['node'] },
        { icon: 'export', label: '导出', key: 'export' },
        { icon: 'import', label: '导入', key: 'import' },
        { divided: true },
        { icon: 'ticket', label: '接口授权', key: 'authApiGrant', rights: ['node'] },
        { divided: true, rights: ['node'] },
        { icon: 'arrows-v', label: '移动节点', key: 'moveNode', rights: ['node'] },
        { icon: 'sort', label: '节点排序', key: 'nodeSort' },
        { icon: 'refresh',
          label: '更新数据',
          key: 'nodeUpdate',
          rights: function(menu, data, isRoot) {
            return isRoot
          } }
      ],
      treeData: []
    }
  },
  created() {
    this.loadSubsystemData()
  },
  methods: {
    loadSubsystemData() {
      findAllSubsystem().then(response => {
        this.subsystemList = response.data
        this.systemId = this.subsystemList && this.subsystemList.length > 0 ? this.subsystemList[0].id : ''
        this.loadTreeData()
      })
    },
    changeSystem(value) {
      this.systemId = value
      this.loadTreeData()
    },
    loadTreeData() {
      this.loading = true
      getTreeData({
        systemId: this.systemId
      }).then(response => {
        this.loading = false
        this.treeData = response.data
      }).catch(() => {
        this.loading = false
      })
    },
    // 查询
    search() {
      this.loadTreeData()
    },
    handleTreeAction(command, position, selection, data) {
      if (position === 'toolbar') {
        if (command === 'refresh') {
          this.loadTreeData()
        }
      } else {
        const id = data.id
        switch (command) {
        // 组织负责人
          case 'add':// 添加
            if (data.isFolder !== 'Y') {
              ActionUtils.warning('否目录不能再添加子节点')
            } else {
              this.handleEdit('', id)
            }
            break
          // case 'edit':// 编辑
          //   this.handleEdit(id)
          //   break
          case 'remove':// 删除
            ActionUtils.removeRecord(id).then((ids) => {
              if (data.children && this.$utils.isNotEmpty(data.children)) {
                ActionUtils.removeRecord(id, '是否删除子菜单？不删除则子菜单层次会转换到该菜单层次！').then((ids) => {
                  this.handleRemove(ids, true)
                }).catch(() => {
                  this.handleRemove(ids)
                })
              } else {
                this.handleRemove(ids)
              }
            }).catch(() => { })
            break
          case 'export':// 导出
            this.handleExport(id, this.systemId, data.name)
            break
          case 'import':// 导入
            this.handImport(id)
            break
          case 'authApiGrant':// 接口授权
            this.title = '接口授权申请'
            this.clientKey = data.alias
            this.grantType = 'res'
            this.handleApiGrant()
            break
          case 'moveNode':// 移动节点
            this.handleMoveNode(id)
            break
          case 'nodeSort':// 节点排序
            this.handleNodeSort(data)
            break
          case 'nodeUpdate':// 更新数据
            this.handleNodeUpdate(this.systemId)
            break
          default:
            break
        }
      }
    },
    /**
     * 接口授权申请
     */
    handleApiGrant() {
      this.apiGrantVisible = true
    },
    // 导入
    handImport(resourceId) {
      this.resourceId = resourceId
      this.importFormVisible = true
    },
    handleExport(resourceId, systemId, name) {
      exportXml({
        resourceId: resourceId,
        systemId: systemId
      }).then(response => {
        ActionUtils.exportFile(response.data, name + '.xml')
      }).catch(() => {})
    },
    // 添加 编辑
    handleEdit(id = '', parentId) {
      if (this.id === id) {
        this.show = ''
      }
      setTimeout(() => {
        this.show = 'edit'
        this.id = id
        this.parentId = parentId
      }, 0)
    },
    // 处理删除
    handleRemove(ids, cascade) {
      remove({ resourceIds: ids, cascade: cascade || false }).then(response => {
        ActionUtils.removeSuccessMessage()
        this.loadTreeData()
      }).catch(() => {})
    },
    // 移动节点
    handleMoveNode(id = '') {
      this.moveNodeVisible = true
      this.id = id
    },
    handleNodeSort(data) {
      if (this.$utils.isEmpty(data.children)) {
        ActionUtils.warning('无子节点排序')
        return
      }
      if (data.children.length === 1) {
        ActionUtils.warning('只有一个节点无需排序')
      } else {
        this.nodeSortVisible = true
        this.sortData = data.children
      }
    },
    // 树点击
    handleNodeClick(data) {
      if (data.id === '0' || data.id === 0) {
        this.show = ''
      } else {
        this.show = 'edit'
        this.id = data.id
      }
    },
    handleExpandCollapse(isExpand) {
      this.width = isExpand ? 230 : 30
    },
    handleNodeUpdate(systemId) {
      this.loading = true
      updateNode({ systemId: systemId }).then(response => {
        this.loadTreeData()
      }).catch((err) => {
        this.loading = false
        console.error(err)
      })
    }
  }
}
</script>
