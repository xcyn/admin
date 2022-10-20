<template>
  <ibps-layout ref="layout">
    <div slot="west">
      <ibps-tree
        ref="tree"
        :width="width"
        :height="height"
        :options="orgTreeoptions"
        :contextmenus="orgTreeContextmenus"
        :load="loadNode"
        :identity="POSITION_TREE"
        lazy
        title="岗位管理"
        @action-event="handleTreeAction"
        @node-click="handleNodeClick"
        @expand-collapse="handleExpandCollapse"
      />
      <ibps-container
        :margin-left="width+'px'"
        class="page"
      >
        <detail
          v-if="show==='detail'"
          :id="positionId"
          :readonly="readonly"
        />
        <edit
          v-else-if="show==='edit'"
          :id="positionId"
          :level-id="levelId"
          :parent-id="parentId"
          @callback="refreshTree"
        />

        <edit-position
          v-else-if="show==='addPosition'"
          @callback="callback"
        />
        <el-col v-else-if="show==='changeCompany'">
          <el-form-item label="所属组织:">
            <el-select  v-model="roleOrg.companyId" placeholder="请选择" style="width:100%;">
              <el-option
                v-for="option in companyList"
                :key="option.id"
                :label="option.name"
                :value="option.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-alert
          v-else
          :closable="false"
          title="尚未指定一个岗位"
          type="warning"
          show-icon
          style="height:50px;"
        />

      </ibps-container>

      <move-node
        :id="positionId"
        :visible="moveNodeVisible"
        :data="orgTreeData"
        @callback="loadTreeData"
        @close="visible => moveNodeVisible = visible"
      />
      <!--节点排序-->
      <node-sort
        :data="sortData"
        :visible="nodeSortVisible"
        title="岗位排序"
        @close="visible => nodeSortVisible = visible"
        @callback="search"
      />
    </div>
  </ibps-layout>
</template>
<script>
import { remove } from '@/api/platform/org/position'
import { findTreeData as getTreeData } from '@/api/platform/org/position'
import TreeUtils from '@/utils/tree'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import Detail from './detail'
import Edit from './edit'
import MoveNode from './move-node'
import NodeSort from './sort'
import Identity from '@/constants/identity'
import { getCompanyByCurrentUser } from '@/api/platform/auth/subsystem'

export default {
  components: {
    Detail,
    Edit,
    MoveNode,
    NodeSort
  },
  mixins: [FixHeight],
  data() {
    return {
      show: '',
      width: 230,
      POSITION_TREE: Identity.IBPS.ORG.POSITION_TREE,
      height: document.clientHeight,
      positionId: '',
      levelId: '',
      editName: '',
      readonly:false,
      // 移动节点
      settingGradeAdminVisible: false,
      moveNodeVisible: false,
      // 节点排序
      sortData: [],
      nodeSortVisible: false,
      roleOrg: {
        superType: '',
        companyId: '',
      },
      companyList: [],
      // 组织树配置
      orgTreeoptions: {
        'default-expand-all': false,
        'expand-on-click-node': false,
        'default-expanded-keys': ['0'],
        props: {
          children: 'children',
          label: 'name'
        }},
      orgTreeContextmenus: [
        { icon: 'add', label: '添加', key: 'add' },
        { icon: 'edit', label: '编辑', key: 'edit', rights: ['node'] },
        { icon: 'remove', label: '删除', key: 'remove', rights: ['node'] },
        { divided: true, rights: ['node'] },
        { icon: 'arrows-v', label: '移动节点', key: 'moveNode', rights: ['node'] },
        { divided: true },
        { icon: 'sort', label: '节点排序', key: 'nodeSort' }
      ],
      orgTreeData: []
    }
  },
  methods: {
    loadNode(node, resolve) {
      let params = {
        type: 1,
        posId: node.level === 0 ? null : node.data.id,
      }
      this.loading = true
      if(node.level !== 0){
        if(node.level === 1){
          params = {
            type: 1,
            posId: 0,
            orgId: 0
          }
        }
        if(node.data.type === 'org'){
          params = {
            type: 1,
            posId: 0,
            orgId: node.data.id
          }
        }
      }
      getTreeData(params).then(res => {
        this.loading = false
        resolve(this.toTree(res.data))
      }).catch(res => {
        this.loading = false
        resolve([])
      })
    },
    toTree(data) {
      return TreeUtils.transformToTreeFormat(data, {
        idKey: 'id',
        pIdKey: 'parentId',
        childrenKey: 'children'
      })
    },
    refreshTree() {
      // this.parentId = '0'
      // this.search()
    },
    // 返回右明细模块未显示
    back() {
      this.positionId = ''
      this.show = 'detail'
    },
    // 获取ID后显示右明细模块
    showDetail() {
      this.positionId = this.gainId
      this.show = 'detail'
    },

    handleTreeAction(command, position, selection, data) {
      if (position === 'toolbar') {
        if (command === 'refresh') {
          this.refreshTree()
        }
      } else {
        const id = data.id
        if (data.type === 'org' && command === 'add') {
          this.handleEdit('', 0)
        } else if(data.type != 'org') {
          switch (command) {
            // 组织负责人
            case 'add':// 添加
              this.handleEdit('', id)
              break
            case 'edit':// 编辑
              this.levelId = data.levelID
              this.handleEdit(id)
              break
            case 'remove':// 删除
              ActionUtils.removeRecord(id).then((ids) => {
                this.handleRemove(ids, data)
              }).catch(() => { })
              break
            case 'moveNode':// 移动节点
              this.handleMoveNode(id)
              break
            case 'nodeSort':// 排序
              this.handleNodeSort(data)
              break
            default:
              break
          }
        }
      }
    },
    // 添加 编辑
    handleEdit(id = '', parentId) {
      this.show = 'edit'
      this.positionId = id
      this.parentId = parentId
    },
    // 处理删除
    handleRemove(ids, data) {
      if (data.children && data.children !== []) {
        this.$message({
          message: '请先删除子节点！',
          type: 'warning'
        })
        return
      }
      remove({ positionIds: ids }).then(response => {
        ActionUtils.removeSuccessMessage()
        this.refreshTree()
      }).catch(() => {})
    },
    // 移动节点
    handleMoveNode(id = '') {
      this.moveNodeVisible = true
      this.positionId = id
    },
    // 树点击
    handleNodeClick(data) {
      console.log(data)
      if (data.id === 0 || data.id === '0' || data.type === 'org') {
        this.show = 'empty'
        return
      }
      this.readonly = true
      this.positionId = data.id + ''
      this.show = 'detail'
    },
    handleExpandCollapse(isExpand) {
      this.width = isExpand ? 230 : 30
    },
    loadTreeData() {
      this.search()
    },
    // 查询
    search() {
      this.$refs.tree.refreshNode(this.parentId)
    },
    handleNodeSort(data) {
      getTreeData({
        type: 1,
        posId: data.id
      }).then(res => {
        const children = res.data
        if (children && children.length > 0) {
          if (children.length === 1) {
            ActionUtils.warning('只有一个节点无需排序')
          } else {
            this.nodeSortVisible = true
            this.sortData = children
          }
        } else {
          ActionUtils.warning('无子节点排序')
        }
      }).catch(res => { })
    }
  }
}
</script>
