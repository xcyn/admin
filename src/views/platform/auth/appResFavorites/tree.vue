<template>
  <div ref="ibpsTree" class="ibps-tree">
    <div v-if="toolbars" ref="toolbar" class="ibps-tree-toolbar">
      <ibps-toolbar
        :actions="toolbars"
        type="icon"
        @action-event="handleActionEvent"
      />
    </div>
    <div v-if="$slots.searchForm" ref="searchForm" class="ibps-tree-search-form">
      <slot name="searchForm" />
    </div>
    <div
      :style="{ height:treeHeight+'px'}"
    >
      <el-scrollbar
        style="height: 100%;"
        wrap-class="ibps-tree-wrapper"
      >
        <el-tree
          v-if="multiple"
          ref="elTree"
          :props="treeOptions.props"
          :data="treeData"
          v-bind="treeOptions"
          :check-strictly="strictly"
          :node-key="nodeKey"
          :default-checked-keys="defaultCheckedKeys"
          :show-checkbox="showCheckbox||true"
          :check-on-click-node="true"
          @node-click="handleNodeClick"
          @check="handleCheck"
        />
      </el-scrollbar>
    </div>
  </div>
</template>
<script>
import TreeUtils from '@/utils/tree'

export default {
  props: {
    title: String,
    nodeKey: {
      type: String,
      default: 'id'
    },
    showCheckbox: Boolean,
    checkOnClickNode: {
      type: Boolean,
      default: true
    },
    checkStrictly: Boolean,
    height: {
      type: Number,
      default: 400
    },
    dataType: { // 数据类型，tree：树形，list:列表
      type: String,
      default: 'list'
    },
    data: {
      type: Array,
      required: true
    },
    options: {
      type: Object,
      default: () => {
        return {}
      }
    },
    defaultCheckedKeys: {
      type: Array
    },
    multiple: {
      type: Boolean,
      default: true
    },
    firstCheckNode: {
      type: Boolean,
      default: false
    },
    toolbars: {
      type: Array,
      default: () => {
        return [{
          key: 'refresh'
        }, {
          key: 'expand'
        }, {
          key: 'compress'
        }]
      }
    },
    contextmenus: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      checkedId: '',
      treeHeight: this.height,
      isExpand: true,
      childrenKey: 'children',
      radio: '',
      check: true,
      strictly: true
    }
  },
  computed: {
    treeData() {
      if (!this.data || this.data.length === 0) return []
      if (this.dataType === 'list') {
        return TreeUtils.transformToTreeFormat(JSON.parse(JSON.stringify(this.data)), {
          idKey: this.treeOptions['node-key'],
          pIdKey: this.pidKey,
          childrenKey: this.treeOptions['props']['children']
        })
      } else {
        return JSON.parse(JSON.stringify(this.data))
      }
    },

    treeOptions() {
      const defaultOptions = {
        'node-key': 'id',
        'pid-key': 'parentId',
        'rootPId': null,
        'default-expand-all': true,
        'expand-on-click-node': false,
        'highlight-current': true,
        props: {
          children: 'children',
          label: 'name',
          disabled: function(data, node) {
            return data.resourceType !== 'menu' || (data.checked === 'true' && data.resourceType === 'menu')
          }
        }
      }
      return Object.assign(defaultOptions, this.options)
    },
    pkKey() {
      return this.treeOptions['node-key'] || 'id'
    },
    pidKey() {
      return this.treeOptions['pid-key']
    },
    rootPId() {
      return this.treeOptions['rootPId'] || null
    }
  },
  watch: {
    height() {
      this.handleTreeHeight()
    },
    checkStrictly(val) {
      this.strictly = val
    }
  },
  mounted() {
    this.handleTreeHeight()
  },
  methods: {
    initRadio() {
      this.radio = ''
    },
    getCheckedId() {
      return this.radio
    },
    // 返回目前被选中的节点所组成的数组
    getCheckedNodes() {
      return this.$refs.elTree.getCheckedNodes()
    },
    // 返回目前半选中的节点所组成的数组
    getHalfCheckedNodes() {
      return this.$refs.elTree.getHalfCheckedNodes()
    },
    // 返回目前被选中的节点父节点
    getNode(id) {
      return this.$refs.elTree.getNode(id)
    },
    setCheckedNodes(data) {
      this.$refs.elTree.setCheckedNodes(data)
    },
    setCheckedKeys(data, boolean) {
      this.$refs.elTree.setCheckedKeys(data, boolean)
    },
    /**
     * 若节点可被选择（即 show-checkbox 为 true），则返回目前被选中的节点的 key 所组成的数组
     */
    getCheckedKeys() {
      return this.$refs.elTree.getCheckedKeys()
    },
    handleTreeHeight() {
      this.treeHeight = this.height - 5
      if (this.$refs.header) {
        this.treeHeight -= this.$refs.header.clientHeight
      }
      if (this.$refs.toolbar) {
        this.treeHeight -= this.$refs.toolbar.clientHeight
      }
      if (this.$refs.searchForm) {
        this.treeHeight -= this.$refs.searchForm.clientHeight
      }
    },
    handleActionEvent(action, position, data) {
      const command = action.key
      if (command === 'expand') {
        this.expandCompressTree(true)
      } else if (command === 'compress') {
        this.expandCompressTree(false)
      }
      this.$emit('action-event', command, position, data)
    },
    expandCompressTree(expanded) {
      for (var i = 0; i < this.$refs.elTree.store._getAllNodes().length; i++) {
        this.$refs.elTree.store._getAllNodes()[i].expanded = expanded
      }
    },
    handleCheck(data, state) {
      this.$emit('check', data, state)
      const { treeData, childrenKey, firstCheckNode } = this
      let setCheckedKeys = []
      var filterId = function(data) {
        data.find(item => {
          setCheckedKeys.push(item.id)
          if (item[childrenKey] && item[childrenKey] !== []) {
            filterId(item[childrenKey])
          }
        })
      }
      const checkDatas = this.getCheckedNodes()
      const alreadyIndex = checkDatas.findIndex(checkData => checkData.id === data.id)
      if (!firstCheckNode) return // 初始化方法执行一次

      if (alreadyIndex === -1) {
        filterId([data])
        checkDatas.forEach(checkData => {
          setCheckedKeys.forEach(checkedKey => {
            if (checkData.id === checkedKey) {
              this.$refs.elTree.setChecked(checkData.id, false)
            }
          })
        })
      } else {
        const children = []
        const parent = []
        var filter = function(data, type) {
          data.find(item => {
            if (item[childrenKey] && item[childrenKey] !== []) {
              children.push(item[childrenKey])
              parent.push(item)
              filter(item[childrenKey])
            }
          })
        }
        filter(treeData)
        let childrenIndex
        children.forEach((chil, i) => {
          chil.forEach(son => {
            if (son.id === data.id) {
              childrenIndex = i
            }
          })
        })
        let parentIndex
        parent.forEach((chil, i) => {
          if (chil.id === data.id) {
            parentIndex = i
          }
        })
        const targetIndx = !parentIndex && parentIndex === -1 ? childrenIndex : parentIndex
        if (this.$utils.isEmpty(targetIndx)) return
        filterId(children[targetIndx])
        setCheckedKeys = setCheckedKeys.concat(parent[targetIndx].id, this.defaultCheckedKeys)
        this.setCheckedKeys(setCheckedKeys)
      }
    },
    handleNodeClick(data, node, tree) {
      if (data.id === 0 || data.id === '0') return
      this.radio = data[this.pkKey]
      this.$emit('node-click', data)
    },
    changeRadio(data) {
      if (data.id === 0 || data.id === '0') {
        this.radio = ''
        return
      }
      this.$emit('selected', data)
    },
    handleExpandCollapse() {
      this.isExpand = !this.isExpand
      this.$emit('expand-collapse', this.isExpand)
    }
  }
}
</script>

<style lang="scss" scoped>
  .layout-header {
    background: #e7eaec ;
    border-bottom: 1px solid  #e5e6e7;
    font-weight: bold;
    text-align: center;
    padding: 4px;
    position: relative;
    overflow: hidden;
    .layout-header-title {
      float: left;
      font-size: 14px;
      margin: 5px;
      padding: 0;
    }
    .layout-header-tools {
      float:right;
      margin-top: 0;
      position: relative;
      padding: 0;
      .pinBtn  {
        cursor: pointer;
        margin-left: 5px;
        color: #c4c4c4;
        font-size: 25px;
      }
    }
  }

  .ibps-tree-toolbar{
      background: #ffffff;
      border-top: 1px solid #e5e6e7;
      border-bottom: 1px solid #e5e6e7;
      height: 30px;
      padding: 5px;
  }
  .ibps-tree-search-form{
      background: #ffffff;
       padding-left: 5px;
        padding-right: 5px;
  }

  .ibps-tree-wrapper {
    background: #ffffff;
    border: 1px solid #ebeef5;
    .el-tree>.el-tree-node{display:inline-block;}
  }

</style>
