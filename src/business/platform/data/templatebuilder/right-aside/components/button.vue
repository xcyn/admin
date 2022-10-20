<template>
  <div class="panel panel-default">
    <div class="panel-heading">
      <span>{{ title }}</span>
      <div class="ibps-fr ibps-pr-10">
        <!-- 全局设置 -->
        <template v-if="prop === 'edit_buttons' || prop === 'function_buttons'">
          <el-tooltip content="设置全局" placement="top">
            <span class="el-dropdown-link" @click="settingGlobal">
              <i class="ibps-icon ibps-icon-cog" />
            </span>
          </el-tooltip>
          <el-divider direction="vertical" />
        </template>

        <el-dropdown :hide-on-click="false" trigger="click" @command="addButton">
          <el-tooltip :content="'添加按钮'" placement="top">
            <span class="el-dropdown-link">
              <i class="el-icon-circle-plus el-icon--right" />
            </span>
          </el-tooltip>
          <el-dropdown-menu slot="dropdown">
            <el-scrollbar
              tag="div"
              wrap-class="el-select-dropdown__wrap"
              view-class="el-select-dropdown__list"
            >
              <el-dropdown-item
                v-for="(button,index) in functionButtons"
                :key="button[buttonTypeKey]+index"
                :disabled="isDisabled(button[buttonTypeKey])"
                :command="button"
              >
                {{ button.label }}
              </el-dropdown-item>
            </el-scrollbar>
          </el-dropdown-menu>
        </el-dropdown>
        <el-divider direction="vertical" />
        <!-- 快捷权限设置-->
        <el-dropdown trigger="click" @command="settingRights">
          <el-tooltip content="快捷权限设置" placement="top">
            <span class="el-dropdown-link">
              <i class="ibps-icon ibps-icon-shield" />
            </span>
          </el-tooltip>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="(rightsType,index) in rightsTypes"
              :key="rightsType.value+index"
              :command="rightsType.value"
            >
              {{ rightsType.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="panel-body">
      <vuedraggable
        v-if="buttons && buttons.length >0"
        v-model="buttons"
        v-bind="draggableOptions"
        class="list-group"
        @start="isDragging = true"
        @end="()=>{isDragging= false}"
      >
        <div v-for="(button,i) in buttons" :key="button[buttonTypeKey]+i" class="list-group-item">
          <div class="actions-left">
            {{ button.label }}
          </div>
          <el-button-group class="actions">
            <el-button size="small" type="text" title="设置" icon="ibps-icon-cog" @click="settingButton(i)" />
            <el-button size="small" type="text" title="删除" icon="el-icon-delete" @click="removeButton(i)" />
            <el-button class="draggable" title="拖动排序" data-role="sort_choice" size="small" type="text" icon="ibps-icon-arrows" />
          </el-button-group>
        </div>
      </vuedraggable>
      <div v-else>
        <el-alert
          :closable="false"
          :title="'未设置'+title"
          type="info"
          center
        />
      </div>
    </div>
    <!--按钮编辑-->
    <el-dialog
      ref="editFormDialog"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :title="buttonTitle"
      class="edit-dialog"
      top="5vh"
      width="60%"
      append-to-body
      @close="closeDialog"
    >
      <slot v-if="dialogVisible" :data="editData" :buttonCodes="buttonCodes" name="edit" />
      <div slot="footer" class="el-dialog--center">
        <ibps-toolbar
          :actions="toolbars"
          @action-event="handleActionEvent"
        />
      </div>
    </el-dialog>

    <!-- 设置全局 -->
    <setting-global
      v-if="prop === 'edit_buttons' || prop === 'function_buttons'"
      v-show="dialogSettingGlobalVisible"
      :visible="dialogSettingGlobalVisible"
      :data="buttonsData"
      :type="prop"
      :title="title"
      :position="position"
      @close="closeSettingGlobalDialog"
      @confirm="handleConfirmBySettingGlobal"
    />

    <rights-config
      :visible="dialogRightsVisible"
      :data="rightsData"
      title="权限配置"
      @callback="handleRightsConfirm"
      @close="visible => dialogRightsVisible = visible"
    />

    <!--导出字段-->
    <export-column
      :visible="exportFieldDialogVisible"
      :data="data"
      @callback="handleExportColumn"
      @close="(visible)=>exportFieldDialogVisible=visible"
    />
  </div>
</template>
<script>
import ActionUtils from '@/utils/action'
import vuedraggable from 'vuedraggable'
import RightsConfig from '@/business/platform/rights/config'
import { rightsTypes } from '../constants'
import { defaultsDeep } from 'lodash'
import ButtonsConstants, { hasSearchPermission } from '@/business/platform/data/constants/buttons'
import ExportColumn from './export-column'
import SettingGlobal from '@/business/platform/data/templatebuilder/right-aside/editors/setting-global'

export default {
  components: {
    vuedraggable,
    RightsConfig,
    ExportColumn,
    SettingGlobal
  },
  props: {
    title: {
      type: String
    },
    position: {
      type: String
    },
    prop: {
      type: String
    },
    data: {
      type: Object
    },
    callModule: {
      type: String
    },
    template: { // 模版
      type: Object,
      default: () => {}
    },
    types: {
      type: Array
    },
    defaultValue: { // 默认值
      type: Object,
      default: () => {
        return {
          position: 'all',
          rights: [{ type: 'all' }]
        }
      }
    }
  },
  data() {
    return {
      isDragging: false,
      exportFieldDialogVisible: false,
      dialogSettingGlobalVisible: false,
      draggableOptions: {
        handle: '.draggable',
        ghostClass: 'sortable-ghost',
        distance: 1,
        disabled: false,
        animation: 200,
        axis: 'y'
      },
      rightsTypes: rightsTypes,
      buttonTypeKey: 'button_type',
      dialogVisible: false,
      buttonTitle: '',
      editData: {},
      editIndex: -1,
      dialogRightsVisible: false,
      toolbars: [
        { key: 'confirm' },
        { key: 'cancel' }
      ],
      buttonsData: [],
      rightsData: [],
      allRightData: {},
      allButtons: ['search', 'add', 'remove']
    }
  },
  computed: {
    buttons: {
      get() {
        return this.template[this.prop] || []
      },
      set(value) {
        this.handleInput(value)
      }
    },
    functionButtons() {
      const buttons = []
      this.types.forEach(type => {
        const button = ButtonsConstants[type]
        if (!button) {
          console.error('Undefined type:' + type)
          return false
        }
        button[this.buttonTypeKey] = type
        button.code = type
        buttons.push(button)
      })
      return buttons
    },
    buttonCodes() {
      const b = []
      for (let i = 0; i < this.buttons.length; i++) {
        const button = this.buttons[i]
        if (this.editIndex !== i && this.allowMultiple(button.button_type)) {
          b.push(button.code)
        }
      }
      for (let i = 0; i < this.types.length; i++) {
        const type = this.types[i]
        if (!this.allowMultiple(type)) {
          b.push(type)
        }
      }
      return b
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
      },
      immediate: true
    }
  },
  beforeDestroy() {
    this.draggableOptions = null
    this.rightsTypes = null
    this.editData = null
    this.toolbars = null
    this.buttonsData = null
  },
  methods: {
    settingGlobal() {
      this.buttonsData = this.buttons.map((button) => {
        if (this.$utils.isEmpty(button.position)) {
          const defaultButton = ButtonsConstants[button.button_type] || {}
          const scope = defaultButton.scope
          // 为新增的按钮赋值默认位置(只有prop为"function_buttons"才设置默认位置)
          if (this.prop === 'function_buttons' && this.$utils.isNotEmpty(scope) && this.$utils.isArray(scope)) {
            if (this.allButtons.includes(button.button_type)) { // 默认查询、新增、删除为所有
              button.position = 'all'
            } else if (scope.includes('manage')) { // 默认存在manage则选择manage
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
        // 查询列默认是顶部
        if (hasSearchPermission(button[this.buttonTypeKey]) && !button.position) {
          button.position = 'toolbar'
        }
        button = defaultsDeep(JSON.parse(JSON.stringify(button)), this.defaultValue)
        return button
      })
      this.dialogSettingGlobalVisible = true
    },
    handleActionEvent({ key }) {
      switch (key) {
        case 'confirm':
          this.handleConfirm()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    // 添加按钮
    addButton(button) {
      const type = button[this.buttonTypeKey]
      if (this.allowMultiple(type) || type === 'export') {
        this.addCustomButton(type)
      } else {
        const buttons = this.buttons
        const _temp = {
          label: button.label,
          [this.buttonTypeKey]: button[this.buttonTypeKey]
        }
        const scope = button.scope
        // 为新增的按钮赋值默认位置(只有prop为"function_buttons"才设置默认位置)
        if (this.prop === 'function_buttons' && this.$utils.isNotEmpty(scope) && this.$utils.isArray(scope)) {
          if (this.allButtons.includes(button[this.buttonTypeKey])) { // 默认查询、新增、删除为所有
            _temp.position = 'all'
          } else if (scope.includes('manage')) { // 默认存在manage则选择manage
            _temp.position = 'manage'
          } else if (scope.includes('search')) { // 默认存在search则选择search
            _temp.position = 'search'
          } else if (scope.includes('toolbar')) { // 默认存在toolbar则选择toolbar
            _temp.position = 'toolbar'
          } else {
            _temp.position = scope[0]
          }
        }

        buttons.push(_temp)
        this.handleInput(buttons)
      }
    },
    // 添加自定义按钮
    addCustomButton(type) {
      const button = JSON.parse(JSON.stringify(ButtonsConstants[type]))
      button[this.buttonTypeKey] = type
      button.position = 'all'
      button.rights = [{ type: 'all' }]

      const editButton = defaultsDeep(JSON.parse(JSON.stringify(button)), this.defaultValue)
      this.editData = editButton
      this.editIndex = -1
      this.buttonTitle = `添加【${button.label}】按钮`
      this.dialogVisible = true
    },

    // 设置按钮
    settingButton(i) {
      const data = this.buttons[i]
      if (this.$utils.isEmpty(data.position)) {
        const defaultButton = ButtonsConstants[data.button_type] || {}
        const scope = defaultButton.scope
        // 为新增的按钮赋值默认位置(只有prop为"function_buttons"才设置默认位置)
        if (this.prop === 'function_buttons' && this.$utils.isNotEmpty(scope) && this.$utils.isArray(scope)) {
          if (this.allButtons.includes(data.button_type)) { // 默认查询、新增、删除为所有
            data.position = 'all'
          } else if (scope.includes('manage')) { // 默认存在manage则选择manage
            data.position = 'manage'
          } else if (scope.includes('search')) { // 默认存在search则选择search
            data.position = 'search'
          } else if (scope.includes('toolbar')) { // 默认存在toolbar则选择toolbar
            data.position = 'toolbar'
          } else {
            data.position = scope[0]
          }
        }
      }

      const button = JSON.parse(JSON.stringify(ButtonsConstants[data[this.buttonTypeKey]]))
      // 查询列默认是顶部
      if (hasSearchPermission(data[this.buttonTypeKey]) && !data.position) {
        data.position = 'toolbar'
      }
      if (!this.allowMultiple(data.button_type)) {
        data.code = data.button_type
      }
      this.editData = defaultsDeep(JSON.parse(JSON.stringify(data)), this.defaultValue)
      this.buttonTitle = `设置【${button.label}】按钮`
      this.editIndex = i
      this.dialogVisible = true
    },
    // 删除按钮
    removeButton(i) {
      this.buttons.splice(i, 1)
      this.handleInput(this.buttons)
    },
    // 设置权限
    settingRights(type) {
      if (this.buttons.length === 0) { return }
      if (type === 'none' || type === 'all') {
        const data = [{ type: type }]
        this.setRightsData(data)
      } else {
        this.rightsData = this.allRightData[this.prop]
        this.dialogRightsVisible = true
      }
    },
    handleRightsConfirm(data) {
      if (data.length === 0) {
        data = [{ type: 'none' }]
      }
      this.setRightsData(data)
    },
    setRightsData(data) {
      this.allRightData[this.prop] = data
      const buttons = this.buttons.map((button) => {
        button.rights = data
        return button
      })
      this.handleInput(buttons)
      ActionUtils.success('设置权限成功')
    },
    allowMultiple(type) {
      return type === 'custom' || type === 'sefStartFlow' || type === 'customDetail'
    },
    // 是否禁用
    isDisabled(key) {
      if (this.allowMultiple(key) || !this.buttons) {
        return
      }
      return !!this.buttons.find((button) => {
        return button[this.buttonTypeKey] === key
      })
    },
    // 关闭当前窗口
    closeDialog() {
      this.dialogVisible = false
    },
    // 关闭设置全局窗口
    closeSettingGlobalDialog() {
      this.dialogSettingGlobalVisible = false
    },
    handleConfirm() {
      const componentInstance = this.callModule === 'list' || this.callModule === 'dialog' || this.callModule === 'tree-edit' ? this.$refs.editFormDialog.$slots.default[0].componentInstance : this.$refs.editFormDialog.$slots.default[0].children[0].componentInstance
      componentInstance.getFormData((data) => {
        if (!data) {
          ActionUtils.saveErrorMessage()
          return
        }
        if (this.editIndex > -1) {
          this.buttons.splice(this.editIndex, 1, data)
        } else {
          this.buttons.push(data)
        }
        this.handleInput(this.buttons)
        this.closeDialog()
      })
    },
    handleConfirmBySettingGlobal(data) {
      this.$emit('input', this.prop, data.buttons, data.position)
      this.closeSettingGlobalDialog()
    },
    handleInput(value) {
      this.$emit('input', this.prop, value)
    },
    handleExportColumn(data) {
      this.$emit('callback-field', 'export_columns', data)
    }
  }
}
</script>

<style lang="scss" scoped>
  .list-group {
    display: flex;
    flex-direction: column;
    padding-left: 0;
    margin-bottom: 0;
  .list-group-item {
    position: relative;
    display: block;
    padding: 5px;
    margin: 5px;
    border: 1px solid #ddd;
    .actions-left{
      height: 24px;
      line-height: 24px;
      margin-left: 5px;
    }

    .actions {
      position: absolute;
      width: 60px;
      top: 2px;
      right: 0;
      line-height: 20px;
      padding-left: 1px;
      .el-button {
        padding-right: 4px;
        // margin-right: 2px;
      }
      [data-role="sort_choice"]{
          cursor: move
      }
    }
  }

  .flip-list-move {
    transition: transform 0.5s;
  }
  .no-move {
    transition: transform 0s;
  }
  .sortable-ghost {
    opacity: 0.5;
    background: #c8ebfb;
  }
}
  .more-actions {
    text-align: right;
    margin-top: 5px;
    margin-right:10px;
    .el-button {
      padding-right: 0;
      margin-right: 0;
    }
  }

</style>
