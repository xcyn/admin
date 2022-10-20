<template>
  <div ref="ibpsTree" :style="{width:templateTypeName==='ibps-data-template-tree'?'100%':width+'px'}" class="templateTree">
    <div v-if="title" ref="header" :class="['layout-header--' +$ELEMENT.size]" class="layout-header">
      <div v-show="isExpand" :style="{width:width-55+'px'}" class="layout-header-title-left ibps-ellipsis">{{ title }}</div>
      <div v-if="angleDouble" class="layout-header-tools-left">
        <el-tooltip :content="isExpand?'收缩':'展开'" placement="bottom-start">
          <a herf="javascript:void(0);" class="pinBtn" @click="handleExpandCollapse">
            <ibps-icon :name="isExpand ? 'angle-double-left' : 'angle-double-right' " />
          </a>
        </el-tooltip>
      </div>
    </div>
    <div v-if="toolbars&&isExpand" ref="toolbar" class="ibps-tree-toolbar">
      <ibps-toolbar :actions="toolbars" type="icon" @action-event="handleTreeAction" />
    </div>
    <div v-if="isExpand" class="ibps-tree-search-form">
      <!-- <el-row style="padding-right:12px;" :gutter="templateTypeName==='ibps-data-template-tree'?1:5">
        <el-col :span="templateTypeName==='ibps-data-template-tree'?23:17">
          <el-input v-model="filterText" placeholder="请输入" clearable />
        </el-col>
        <el-col :span="templateTypeName==='ibps-data-template-tree'?1:4">
          <el-button size="small" type="primary" icon="el-icon-search" @click="handleTreeNodeSearch">搜索</el-button>
        </el-col>
      </el-row> -->
      <div class="search-wrapper">
        <div class="search-input">
          <el-input v-model="filterText" placeholder="请输入" clearable @keyup.enter.native="handleTreeNodeSearch" />
        </div>
        <div class="search-buttons">
          <el-button v-if="$utils.isEmpty(searchToolbars)" class="search-buttons_search" size="small" type="primary" icon="el-icon-search" @click="handleTreeNodeSearch">搜索</el-button>
          <template v-if="$utils.isNotEmpty(searchToolbars)">
            <ibps-toolbar :actions="searchToolbars" @action-event="handleTreeAction" />
          </template>
        </div>
      </div>
    </div>
    <div :style="{ height:`calc(100vh - 232px)` }" class="ibps-show">
      <div :style="{ height: 100 + '%'}" class="ibps-tree-main">
        <el-scrollbar :style="scrollbarHeight" wrap-class="ibps-tree-wrapper">
         <!-- <ul v-infinite-scroll="startLazy ? loadMore : ()=>{}" infinite-scroll-delay="1000"> -->
		  <ul infinite-scroll-delay="1000">
            <template v-if="templateType==='dialog'">
              <!-- 多选-->
              <el-tree v-if="multiple" ref="elTree" v-loading="loading" :class="$utils.isEmpty(treeData)||isFilterText?'init-style':null" :data="treeData" :expand-on-click-node="false" :props="{ children:childrenKey, label: nameKey}" :show-checkbox="multiple" :check-strictly="true" :filter-node-method="filterNode" :node-key="pkKey" :pid-key="pidKey" :default-expand-all="startLazy ? false : template ? template.attrs.expand === 'Y' : true" :load="loadNode" highlight-current check-on-click-node
                :lazy="startLazy" @check-change="handleCheckChange" @node-contextmenu="handleNodeContextmenu" />
              <!-- 单选-->
              <el-tree v-else ref="elTree" v-loading="loading" :class="$utils.isEmpty(treeData)||isFilterText?'init-style':null" :data="treeData" :expand-on-click-node="false" :props="{ children: childrenKey, label: nameKey}" :show-checkbox="multiple" :filter-node-method="filterNode" :node-key="pkKey" :pid-key="pidKey" :default-expand-all="startLazy ? false : template ? template.attrs.expand === 'Y' : true" :load="loadNode" :lazy="startLazy" highlight-current @node-click="onNodeClick"
                @node-contextmenu="handleNodeContextmenu">
                <span slot-scope="{ node, data }" class="custom-tree-node">
                  <el-radio v-model="radio" :label="data[pkKey]" :disabled="data.disabled" @change="changeRadio(data)">{{ node.label }}</el-radio>
                </span>
              </el-tree>
            </template>
            <template v-else>
              <!--默认模版-->
              <el-tree v-if="isExpand" ref="elTree" v-loading="loading" :class="$utils.isEmpty(treeData)||isFilterText?'init-style':null" :data="treeData" :props="{ children: childrenKey, label: nameKey}" :check-strictly="true" :filter-node-method="filterNode" :node-key="pkKey" :pid-key="pidKey" :default-expand-all="startLazy ? false : template ? template.attrs.expand === 'Y' : true" :load="loadNode" highlight-current :lazy="startLazy" @node-click="onNodeClick"
                @node-contextmenu="handleNodeContextmenu" />
            </template>
          </ul>
        </el-scrollbar>
      </div>
    </div>
    <!--右键菜单-->
    <ibps-contextmenu v-if="contextmenus" ref="contextmenu" :data="contextmenuList" :z-index="zIndex" @click="handleContextmenuClick" />

    <data-template-formrender-dialog :visible="dialogFormVisible" :form-key="formKey" :default-data="defaultFormData" :pk-value="pkValue" :toolbars="editToolbars" :readonly="readonly" :buttons-position="buttonsPosition" @callback="search" @close="visible => dialogFormVisible = visible" />
  </div>
</template>
<script>
import { queryTreeData, removeFormData } from '@/api/platform/data/dataTemplate'
import { getScriptValue } from '@/api/platform/form/common.js'
import ButtonsConstants, { hasButton } from '@/business/platform/data/constants/buttons'
import TreeUtils from '@/utils/tree'
import ActionUtils from '@/utils/action'
import PopupManager from '@/utils/popup'
import { camelCase, mergeWith, isArray } from 'lodash'

import IbpsContextmenu from '@/components/ibps-contextmenu'
import DataTemplateFormrenderDialog from '../form/dialog'
import JTreeTemplate from '../utils/JTreeTemplate'// 自定义脚本

export default {
  name: 'Tree',
  components: {
    IbpsContextmenu,
    DataTemplateFormrenderDialog
  },
  props: {
    title: String,
    functions: Function,
    templateTypeName: String,
    angleDouble: {
      type: Boolean,
      default: true
    },
    position: {
      type: String,
      default: 'west'
    },
    width: {
      type: Number,
      default: 200
    },
    height: {
      type: Number,
      default: 570
    },
    dataTemplate: Object,
    template: Object,
    dynamicParams: Object,
    value: [String, Number, Array, Object],
    showContextmenus: {
      type: Boolean,
      default: true
    },
    preview: {
      type: Boolean,
      default: false
    },
    combination: {
      type: Boolean,
      default: false
    },
    afterSubmitAction: Function,
    multiple: Boolean,
    fields: Object
  },
  data() {
    return {
      /**
       * 是否启用懒加载
       */
      startLazy: true,
      loading: false,
      isFilterText: false,
      treeData: [],
      toolbars: [],
      searchToolbars: [],
      contextmenus: [],
      colorFilters: [
        { type: 'default', color: '#606266' },
        { type: 'primary', color: '#409EFF' },
        { type: 'success', color: '#67C23A' },
        { type: 'info', color: '#909399' },
        { type: 'warning', color: '#E6A23C' },
        { type: 'danger', color: '#F56C6C' }
      ],
      options: {
        emptyText: '未设置显示字段'
      },
      radio: '',
      rootTreeId: '',
      rootTreeName: '',
      pkKey: 'id',
      pidKey: 'parentId',
      childrenKey: '___children',
      nameKey: '',
      filterText: '',
      treeHeight: this.height,

      scrollbarHeight: 'height: 100%; width:100%',
      ibpsShowHeight: `calc(100vh - 89px)`,
      isExpand: true,
      // 右键菜单数据
      contextmenuFlag: false,
      contentmenuX: 0,
      contentmenuY: 0,
      contextmenuData: {},
      contextmenuList: [],
      zIndex: 2003,

      pkValue: '',
      readonly: false,
      dialogFormVisible: false,
      editButtons: [], // 表单按钮
      editToolbars: [],
      filterConditionKey: '',
      defaultFormData: {}, // 默认表单数据
      initialization: false,
      page: {},
      notData: false
    }
  },
  computed: {
    buttonsPosition() {
      if (this.$utils.isNotEmpty(this.template) &&
        this.$utils.isNotEmpty(this.template.attrs)) {
        return this.template.attrs.buttons_position || ''
      } else {
        return ''
      }
    },
    templateType() {
      if (this.dataTemplate.showType === 'compose') {
        // TODO:
        return null
      } else {
        return this.dataTemplate.type
      }
    },
    formKey() {
      return this.dataTemplate.attrs ? this.dataTemplate.attrs.form_key || '' : ''
    }
  },
  watch: {
    template: {
      handler(val, oldVal) {
        this.isFilterText = false
        if (!this.template) { return }
        this.isExpand = false
        setTimeout(() => {
          this.isExpand = true
        }, 10)
        if (this.template.display_columns) {
          this.rootTreeId = this.template.display_columns.root_pid
          // this.rootTreeName = this.template.display_columns.root_label
          this.rootTreeName = ''
          this.filterRootTreeName()

          this.pkKey = this.template.display_columns.id_key
          this.pidKey = this.template.display_columns.pid_key
          this.nameKey = this.template.display_columns.name_key
        }
        const toolbarButtons = this.template.buttons ? this.template.buttons.function_buttons || [] : []
        // 工具栏
        const toolbars = []
        const searchToolbars = []
        toolbarButtons.forEach(button => {
          if (this.$utils.isEmpty(button.position)) {
            const _button = ButtonsConstants[button.button_type]
            if (this.$utils.isNotEmpty(_button)) {
              const scope = _button.scope
              if (this.$utils.isNotEmpty(scope) && this.$utils.isArray(scope)) {
                if (scope.includes('manage')) { // 默认存在manage则选择manage
                  button.position = 'manage'
                } else if (scope.includes('search')) { // 默认存在search则选择search
                  button.position = 'search'
                } else if (scope.includes('toolbar')) { // 默认存在toolbar则选择toolbar
                  button.position = 'toolbar'
                } else {
                  button.position = scope[0]
                }
              }
            }
          }
          const btn = {}
          btn.key = button.button_type
          btn.label = button.label
          if (button.icon) {
            btn.icon = 'ibps-icon ibps-icon-' + button.icon
          }
          if (button.style) {
            btn.type = button.style
          }

          if (hasButton(button.button_type, 'toolbar', button.position)) {
            toolbars.push(btn)
          }

          if (hasButton(button.button_type, 'search', button.position)) {
            searchToolbars.push(btn)
          }
        })

        this.toolbars = toolbars
        this.searchToolbars = searchToolbars

        // 右键菜单
        // const contextmenuButtons = this.template.buttons ? this.template.buttons.contextmenu_buttons || [] : []
        const contextmenuButtons = this.showContextmenus ? this.template.buttons ? this.template.buttons.contextmenu_buttons || [] : [] : []
        const contextmenus = []
        contextmenuButtons.forEach(button => {
          const btn = this.buildButton(button)
          btn.icon = {
            custom: btn.icon ? btn.icon : '',
            color: btn.type ? this.colorFilters[btn.type] : null
          }
          contextmenus.push(btn)
        })

        this.contextmenus = contextmenus
        if (this.contextmenus && this.contextmenus.length > 0) {
          this.fixZIndex()
        }
        this.editButtons = this.template.buttons ? this.template.buttons.edit_buttons || [] : []

        this.initUI()
        this.init()
        this.loadData()
      },
      immediate: true
    },
    value(val, oldVal) {
      if (this.$utils.isEmpty(val)) {
        // this.$refs['tree'].clearSelection()
        if (this.multiple) {
          oldVal.forEach(data => {
            this.$refs.elTree.setChecked(data[this.pkKey], false)
          })
        } else {
          this.$refs.elTree.setChecked(oldVal[this.pkKey], false)
          this.radio = ''
        }
      } else {
        if (this.multiple) {
          if (val.length < oldVal.length) {
            oldVal.forEach(row => {
              const index = val.find(item => { return item[this.pkKey] === row[this.pkKey] })
              if (!index) {
                this.$refs['elTree'].setChecked(row[this.pkKey], false)
              }
            })
          }
        }
      }
    }
  },
  mounted() {
    if (this.$refs['ibpsTree'].parentElement.className === 'el-dialog__body') {
      this.scrollbarHeight = 'height: 100%; width:100%'
    } else if (this.$refs['ibpsTree'].parentElement.className === 'leftTree' || this.$refs['ibpsTree'].parentElement.className === 'rightTree') {
      this.ibpsShowHeight = this.preview ? `calc(93vh - 89px)` : `calc(81vh - 89px)`
    } else {
      this.scrollbarHeight = 'height: 100%; width:100%'
    }
  },
  beforeDestroy() {
    const script = document.getElementById('JTreeTemplate')
    if (script) {
      script.parentNode.removeChild(script)
    }
    this.treeData = null
    this.toolbars = null
    this.searchToolbars = null
    this.contextmenus = null
    this.colorFilters = null
    this.options = null
    this.contextmenuData = null
    this.contextmenuList = null
    this.editButtons = null
    this.editToolbars = null
    this.defaultFormData = null
  },
  methods: {
    filterRootTreeName() {
      const display_columns = this.template.display_columns
      const is_script = display_columns.is_script
      if (is_script) {
        getScriptValue({
          script: display_columns.root_label,
          // vars: JSON.stringify(vars) || ''
          vars: ''
        }).then(res => {
          this.rootTreeName = res.data
        }).catch(err => {
          console.error(err)
        })
      } else {
        this.rootTreeName = display_columns.root_label
      }
    },
    initUI() {
      this.initialization = false
      if (!this.initialization) {
        this.initJTreeTemplate()
        this.initialization = true
        setTimeout(() => {
          this.loadScript()
        }, 1000)
      }
    },
    /**
     * zxh 修复zindex 不是最高的被遮住
     */
    fixZIndex() {
      this.zIndex = PopupManager.getZIndex()
    },
    loadData() {
      this.loading = true
      if (this.$utils.isEmpty(this.template.display_columns)) {
        ActionUtils.warning('未配置显示字段!')
        this.loading = false
        return
      }
      const params = {}
      if (this.startLazy) {
        params.parameters = []
        params.parameters.push({
          key: 'lazzy',
          value: true
        })
      }
      queryTreeData(this.getParams(params) || {}).then(response => {
        const data = response.data
        if (this.$utils.isNotEmpty(this.rootTreeName)) {
          data.unshift({
            [this.pkKey]: this.rootTreeId,
            [this.nameKey]: this.rootTreeName,
            [this.pidKey]: this.$utils.guid()
          })
        }
        if (!data || data.length === 0) this.notData = true
        this.treeData = [...this.treeData, ...TreeUtils.transformToTreeFormat(data, {
          idKey: this.pkKey,
          pIdKey: this.pidKey,
          nameKey: this.nameKey,
          childrenKey: this.childrenKey
        })]

        this.loading = false
        // this.$nextTick(function() {
        //   this.initCheck()
        // })
      }).catch(() => {
        this.loading = false
      })
    },
    init() {
      this.notData = false
      this.page = { limit: 150, page: 1 }
      this.treeData = []
    },
    loadTreeData(params, callback = () => { }) {
      queryTreeData(params || {}).then(response => {
        callback(response)
      }).catch(() => {
        this.loading = false
      })
    },
    /**
     * 懒加载
     */
    loadNode(node, resolve) {
      if (node.level === 0) return resolve(this.treeData)
      const params = {}
      params.parameters = []
      params.parameters.push({
        key: 'Q^' + this.pidKey + '^S',
        value: node.data[this.pkKey]
      })
      this.page.page = 1
      this.loadTreeData(this.getParams(params), (response) => {
        return resolve(response && response.data ? response.data : [])
      })
    },
    getParams(defaultParams = {}) {
      const params = this.getFormatParams()
      return defaultParams ? mergeWith(defaultParams, params, (objValue, srcValue) => {
        if (isArray(objValue)) {
          return objValue.concat(srcValue)
        }
      }) : params
    },
    loadMore() {
      if (!this.notData) {
        this.page.page++
        this.loadData()
      }
    },
    /**
     * 获取格式化参数
     */
    getFormatParams() {
      let formParams = {}
      if (this.$refs['searchForm']) {
        formParams = this.$refs['searchForm'].getSearcFormData() || {}
      }
      const responseData = JSON.parse(JSON.stringify(this.template))
      responseData.datasetKey = this.dataTemplate.datasetKey
      responseData.unique = this.pkKey
      responseData['dynamic_params'] = this.dynamicParams
      formParams['response_data'] = JSON.stringify(responseData)
      formParams['filter_condition_key'] = this.filterConditionKey
      return ActionUtils.formatParams(formParams, this.startLazy ? this.page : null, this.sorts)
    },
    search() {
      this.loadData()
    },
    /**
     * 初始化默认选中状态
     */
    initCheck() {
      if (this.$utils.isNotEmpty(this.value)) {
        if (this.multiple) {
          Array.isArray(this.value) && this.value.forEach(data => {
            const pkKey = typeof data === 'string' ? data : data[this.pkKey]
            this.$refs.elTree.setChecked(pkKey, true)
          })
        } else {
          if (Array.isArray(this.value)) { return }
          const pkKey = typeof this.value === 'string' ? this.value : this.value[this.pkKey]
          this.$refs.elTree.setChecked(pkKey, true)
        }
      }
    },
    filter() {
      this.$refs.elTree.filter(this.filterText)
    },
    filterNode(value, data) {
      if (!value) return true
      return data[this.nameKey].indexOf(value) !== -1
    },
    handleTreeNodeSearch() {
      if (this.startLazy) {
        const params = {}
        if (this.filterText) {
          params.parameters = []
          params.parameters.push({
            key: 'Q^' + this.nameKey + '^SL',
            value: this.filterText
          },
            {
              key: 'lazzy',
              value: true
            })
          this.page = {}
          this.loadTreeData(this.getParams(params), (response) => {
            this.treeData = response && response.data ? response.data : []
          })
        } else {
          this.init()
          this.loadData()
        }
      } else {
        this.isFilterText = true
        this.$refs.elTree.filter(this.filterText)
      }
    },
    handleTreeAction(action, position, selection, data) {
      const command = action.key
      if (position === 'toolbar' && command === 'refresh') {
        this.init()
        this.loadData()
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
    /**
     * 清空选择的
     */
    clearSelection() {
      if (this.multiple) {
        this.$refs.elTree.setCheckedKeys([])
      } else {
        this.radio = ''
      }
    },
    handleCheckChange(data, checked) {
      const checkedNodes = this.$refs.elTree.getCheckedNodes()
      const result = []
      checkedNodes.forEach(node => {
        if (node[this.pkKey] !== this.rootTreeId) {
          delete node[this.childrenKey]
          result.push(node)
        }
      })
      this.$emit('selected', result)
    },
    changeRadio(data) {
      if (data[this.pkKey] === this.rootTreeId) return
      const result = JSON.parse(JSON.stringify(data))
      delete result[this.childrenKey]
      this.$emit('selected', result)
    },
    onNodeClick(data, node, obj) {
      if (data[this.pkKey] === this.rootTreeId) return
      this.radio = data[this.pkKey]
      this.changeRadio(data)
    },
    /**
     * 处理节点右键菜单
     */
    handleNodeContextmenu(event, data) {
      if (!this.contextmenus || this.contextmenus.length === 0) return
      let target = event.target
      let flag = false
      if (target && (target.className.indexOf('el-tree-node__content') > -1 ||
        target.className.indexOf('ibps-custom-tree-node') > -1)) {
        flag = true
      } else if (target && (target.parentNode.className.indexOf('el-tree-node__content') > -1 ||
        target.parentNode.className.indexOf('ibps-custom-tree-node') > -1)) {
        target = target.parentNode
        flag = true
      }
      if (flag) {
        event.preventDefault()
        event.stopPropagation()
        this.handleContextmenuList(data)
        this.contextmenuData = data
        this.contextmenuFlag = true
        this.handleReferenceContextmenu(event)
      }
    },
    filterContextmenuList(menu) {
      const pk = this.template.display_columns.pid_key
      let str
      let arr = []
      for (var m in menu) {
        if (pk === m) {
          str = menu[m]
        }
      }
      const res = new RegExp(/^[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}$/)
      if (this.$utils.isNotEmpty(str) && res.test(str)) {
        const index = this.contextmenus.findIndex(c => c.button_type === 'add')
        arr.push(this.contextmenus[index])
      } else if (!res.test(str)) {
        arr = this.contextmenus
      }
      return arr
    },
    handleContextmenuList(data) {
      this.contextmenuList = []
      const isRoot = data[this.pidKey] === this.rootTreeId
      const contextmenus = this.filterContextmenuList(data)
      contextmenus.forEach((menu) => {
        if (!menu.rights) {
          this.contextmenuList.push(menu)
        } else {
          if (Array.isArray(menu.rights)) {
            if (menu.rights.indexOf('node') > -1 && !isRoot) {
              this.contextmenuList.push(menu)
            }
          } else if (typeof menu.rights === 'function') {
            if (menu.rights.call(this, menu, data, isRoot)) {
              this.contextmenuList.push(menu)
            }
          }
        }
      })
    },
    // 增删改查表单处理
    handleContextmenuClick(item) {
      const command = item.key
      this.$emit('action-even', this.dataTemplate.showType, command, 'contextmenu', this.contextmenuData[this.pkKey], this.contextmenuData)
      this.handleAction(command, 'contextmenu', this.contextmenuData[this.pkKey], this.contextmenuData)
    },
    handleAction(command, position, selection, data) {
      const beforeScript = this.$utils.isEmpty(this.functions) ? this.beforeScript : this.functions
      this.readonly = false
      // 前置事件
      beforeScript(command, position, selection, data, () => {
        switch (command) {
          case 'add':// 添加
          case 'edit':// 编辑
          case 'detail':// 明细
            this.handleEdit(selection, command, position, data)
            break
          case 'remove':// 删除
            ActionUtils.removeRecord(selection).then((ids) => {
              if (data.___children && data.___children.length > 0) {
                this.$message({
                  message: '请先删除子节点',
                  type: 'warning'
                })
                return
              }
              this.handleRemove(ids)
            }).catch(() => { })
            break
          case 'custom':// 自定义按钮
            // TODO: 自定义按钮事件
            break
          default:
            break
        }
      })
    },
    getDefaultFormData(selection) {
      const parentIdField = this.fields[this.pidKey] || {}
      const pidKey = parentIdField ? this.combination ? camelCase(parentIdField.name) : parentIdField.form_field_name || this.pidKey : this.pidKey // 如果不是就按命名规律
      return {
        [pidKey]: selection
      }
    },
    /**
     * 添加、编辑表单
     */
    handleEdit(selection, action, position, data) {
      if (this.$utils.isEmpty(this.formKey)) {
        ActionUtils.warning('请绑定表单')
        return
      }
      this.defaultFormData = action === 'add' ? this.getDefaultFormData(selection) : null
      this.readonly = action === 'detail'
      const editToolbars = []
      this.editButtons.forEach(rf => {
        const btn = this.buildButton(rf)
        // 编辑页顶部按钮
        if (hasButton(rf.button_type, action === 'detail' ? 'detail' : 'edit', rf.position)) {
          // 明细页是否有按钮
          if ((!this.readonly) || (
            this.readonly && (rf.enabledDetail === 'Y' || (!rf.enabledDetail && rf.button_type === 'close'))
          )) {
            editToolbars.push(btn)
          }
        }
      })
      this.editToolbars = editToolbars
      this.pkValue = action === 'add' ? null : (selection || '')
      this.dialogFormVisible = true

      this.afterScript(action, position, this.pkValue, data, () => {
        this.dialogFormVisible = true
      })
    },
    /**
     * 构建按钮
     */
    buildButton(rf, i) {
      const defaultButton = ButtonsConstants[rf.button_type] || {}
      let key = rf.button_type

      if (rf.button_type === 'custom') {
        key = rf.code ? rf.code : 'custom' + i
      }
      if (rf.button_type === 'sefStartFlow') {
        key = rf.code ? rf.code : 'sefStartFlow' + i
      }
      if (rf.button_type === 'export') {
        rf.menus = ButtonsConstants[rf.button_type].menus
      }
      return {
        '$index': i,
        key: key,
        button_type: rf.button_type,
        code: rf.code,
        label: rf.label || defaultButton.style,
        icon: 'ibps-icon-' + (rf.icon || defaultButton.icon),
        type: rf.style || defaultButton.type,
        deflow: rf.deflow || null
      }
    },
    handleExpandCollapse() {
      this.isExpand = !this.isExpand
      this.$emit('expand-collapse', this.isExpand)
    },
    /**
     * 删除表单
     */
    handleRemove(ids, action, position, selection, data) {
      if (this.$utils.isEmpty(this.formKey)) {
        ActionUtils.warning('请绑定表单')
        return
      }
      removeFormData({
        formKey: this.formKey,
        ids: ids
      }).then(response => {
        this.afterScript(action, position, selection, data, () => {
          ActionUtils.removeSuccessMessage()
          this.search()
        })
      }).catch(() => {
      })
    },
    // =================================处理脚本================================
    /**
     * 初始化脚本
     */
    initJTreeTemplate() {
      const id = 'JTreeTemplate'
      let script = document.getElementById(id)
      if (script) {
        script.parentNode.removeChild(script)
      }
      if (this.dataTemplate.attrs && this.dataTemplate.attrs.script) {
        const codeScript = this.dataTemplate.attrs.script
        script = document.createElement('script')
        script.type = 'text/javascript'
        script.id = id
        document.body.appendChild(script)
        try {
          script.appendChild(document.createTextNode(codeScript))
        } catch (ex) {
          console.error(ex)
          script.text = codeScript
        }
        document.body.appendChild(script)
      }
    },
    // 处理脚本
    hasScript() {
      return true
    },
    // 加载脚本
    loadScript() {
      if (!this.hasScript()) {
        return
      }
      JTreeTemplate._onLoad(this)
    },
    // 前置脚本
    beforeScript(action, position, selection, data, callback) {
      if (!this.hasScript()) {
        const flag = true
        callback(flag)
        return
      }
      JTreeTemplate._beforeSubmit(this, action, position, selection, data, callback)
    },
    // 后置脚本
    afterScript(action, position, selection, data, callback) {
      if (!this.hasScript()) {
        const flag = true
        callback(flag)
        return
      }
      JTreeTemplate._afterSubmit(this, action, position, selection, data, callback)
    }
  }
}
</script>
<style lang="scss" >
$border-color: #e5e6e7;
.templateTree {
  padding: 0 !important;
  .layout-header {
    background: #e7eaec;
    height: 35px;
    border-left: 1px solid $border-color;
    border-bottom: 1px solid $border-color;
    font-weight: bold;
    text-align: center;
    padding: 5px;
    position: relative;
    overflow: hidden;
    &--medium {
      height: 40px;
    }
    &--small {
      height: 35px;
    }
    &--mini {
      height: 30px;
    }
    .layout-header-title-left {
      float: left;
      text-align: left;
      font-size: 14px;
      margin: 10px 5px 5px;
      padding: 0;
    }
    .layout-header-title-right {
      float: right;
      text-align: right;
      font-size: 14px;
      margin: 10px 5px 5px;
      padding: 0;
    }
    .layout-header-tools-left {
      float: right;
      margin-top: 5px;
      position: relative;
      padding: 0;
      .pinBtn {
        cursor: pointer;
        margin-left: 5px;
        color: #c4c4c4;
        font-size: 25px;
      }
    }
    .layout-header-tools-right {
      float: left;
      margin-top: 5px;
      position: relative;
      padding: 0;
      .pinBtn {
        cursor: pointer;
        margin-left: 5px;
        color: #c4c4c4;
        font-size: 25px;
      }
    }
  }
  .ibps-show {
    height: 42px;
    background: white;
  }
  .ibps-tree-toolbar {
    border: 1px solid $border-color;
    height: 35px;
    padding: 5px;
  }

  .ibps-tree-search-form {
    padding: 5px;
    border-right: 1px solid $border-color;
    background: #ffffff;

    .search-wrapper {
      display: flex;
      flex-wrap: wrap;
      .search-input {
        flex: 1;
        margin-right: 10px;
        min-width: 100px;
        padding: 5px 0;
      }
      .search-buttons {
        padding: 5px 0;
      }
    }
  }
  .ibps-tree-main {
    border: 1px solid $border-color;
  }
  .ibps-tree-wrapper {
    background: #ffffff;
    .el-tree {
      display: inline-block;
    }
  }
  .custom-tree-node {
    font-size: 14px;
    padding-right: 8px;
  }
  .init-style {
    width: 100%;
  }
}
</style>
