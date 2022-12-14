<template>
  <div>
    <div v-if="toolbars" ref="toolbar" class="ibps-tree-toolbar">
      <ibps-toolbar
        :actions="toolbars"
        type="icon"
        @action-event="handleTreeAction"
      />
    </div>
    <div ref="searchForm" class="ibps-tree-search-form">
      <el-select
        slot="searchForm"
        v-model="systemId"
        placeholder="请先设置子系统"
        style="width:100%;"
        @change="changeSystem"
      >
        <el-option
          v-for="item in subsystemList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </div>
    <div
      :style="{ height:(tableHeight)+'px'}"
    >
      <el-scrollbar
        style="height: 100%;"
        wrap-class="ibps-tree-wrapper ibps-scrollbar-wrapper"
      >
        <!-- 多选-->
        <el-tree
          v-if="multiple"
          ref="elTree"
          v-loading="loading"
          :data="treeData"
          :expand-on-click-node="false"
          :props="{ children: 'children', label: 'name'}"
          :show-checkbox="multiple"
          :check-strictly="true"
          :filter-node-method="filterNode"
          node-key="id"
          pid-key="parentId"
          default-expand-all
          highlight-current
          check-on-click-node
          @check-change="handleCheckChange"
        />
        <!-- 单选-->
        <el-tree
          v-else
          ref="elTree"
          :data="treeData"
          :expand-on-click-node="false"
          :props="{ children: 'children', label: 'name'}"
          node-key="id"
          pid-key="parentId"
          default-expand-all
          highlight-current
          :show-checkbox="multiple"
          @node-click="onNodeClick"
        >
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <el-radio
              v-model="radio"
              :label="data[pkKey]"
              :disabled="data.disabled"
              @change="changeRadio(data)"
            >{{ node.label }}</el-radio>
          </span>
        </el-tree>
      </el-scrollbar>
    </div>
  </div>
</template>
<script>

import { getTreeData } from '@/api/platform/auth/resources'
import { findAllSubsystem } from '@/api/platform/auth/subsystem'
import ActionUtils from '@/utils/action'
import TreeUtils from '@/utils/tree'

export default {
  props: {
    value: [Object, Array],
    multiple: Boolean,
    height: {
      type: String,
      default: '400px'
    }
  },
  data() {
    return {
      radio: '',
      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      loading: false,

      filterText: '',
      // 树配置
      treeData: [],

      subsystemList: [],
      systemId: '',

      toolbars: [{
        key: 'refresh'
      }, {
        key: 'expand'
      }, {
        key: 'compress'
      }]

    }
  },
  computed: {
    tableHeight() {
      const h = this.height.substr(0, this.height.length - 2)
      return parseInt(h) - 10
    }
  },
  watch: {
    filterText(val) {
      this.$refs.elTree.filter(val)
    }
  },
  created() {
    this.loadSubsystemData()
  },
  beforeDestroy() {
    this.treeData = null
    this.subsystemList = null
    this.toolbars = null
  },
  methods: {
    changeSystem(value) {
      this.systemId = value
      this.loadTreeData()
    },
    loadSubsystemData() {
      findAllSubsystem().then(response => {
        this.subsystemList = response.data
        this.systemId = this.subsystemList && this.subsystemList.length > 0 ? this.subsystemList[0].id : ''
        this.loadTreeData()
      })
    },
    setChecked(data, selected) {
      if (data !== undefined) {
        this.$refs['elTree'].setChecked(data, selected)
      } else {
        this.radio = ''
      }
    },
    cleanData(multiple) {
      if (multiple) {
        this.$refs['elTree'].setCheckedKeys([])
      } else {
        this.radio = ''
      }
    },
    // 加载资源树
    loadTreeData() {
      this.loading = true
      getTreeData({
        systemId: this.systemId
      }).then(response => {
        const data = response.data
        data.forEach(i => {
          if (i.id === '0' || i.id === 0) {
            i.disabled = true
          }
        })
        this.treeData = TreeUtils.transformToTreeFormat(data)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },

    /**
     * 查询
     */
    search() {
      ActionUtils.setPagination(this.pagination)
      this.loadListData()
    },
    /**
     * 重置查询条件
     */
    reset() {
      this.$refs['crud'].handleReset()
    },
    handleTreeAction(action, position, selection, data) {
      const command = action.key
      if (position === 'toolbar' && command === 'refresh') {
        this.loadTreeData()
      }
      if (command === 'expand') {
        this.expandCompressTree(true)
      } else if (command === 'compress') {
        this.expandCompressTree(false)
      }
    },
    expandCompressTree(expanded) {
      for (let i = 0; i < this.$refs.elTree.store._getAllNodes().length; i++) {
        this.$refs.elTree.store._getAllNodes()[i].expanded = expanded
      }
    },
    handleCheckChange(data, checked) {
      if (data.id === 0 || data.id === '0') return
      let val = JSON.parse(JSON.stringify(this.value))
      if (checked) {
        const index = val.find((v) => {
          return v[this.pkKey] === data[this.pkKey]
        })
        if (!index) { val.push(data) }
      } else {
        val = val.filter((v) => {
          return v[this.pkKey] !== data[this.pkKey]
        })
      }
      this.$emit('selected', val)
    },
    changeRadio(data) {
      if (data.id === 0 || data.id === '0') return
      this.$emit('selected', data)
    },
    onNodeClick(data, node, obj) {
      if (data.id === 0 || data.id === '0') return
      this.radio = data[this.pkKey]
      this.$emit('selected', data)
    }
  }
}
</script>
<style lang="scss" scoped>
$border-color: #e5e6e7;
.ibps-tree-toolbar {
    border: 1px solid $border-color;
    height: 30px;
    padding: 5px;
  }
  .ibps-tree-search-form {
    padding: 5px;
    border-right: 1px solid $border-color;
    background: #ffffff;
  }
  .ibps-tree-main {
    border: 1px solid $border-color;
  }
  .ibps-tree-wrapper {
    background: #ffffff;
    .el-tree > .el-tree-node {
      display: inline-block;
    }
  }
</style>
