<template>
  <el-dialog
    ref="settingGlobalDialog"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="title"
    class="setting-dialog"
    top="5vh"
    width="80%"
    append-to-body
    @close="closeDialog"
  >
    <div class="setting-global">
      <!-- 编辑页时，按钮位置设置 -->
      <div v-if="type==='edit_buttons'" class="sg-row">
        <div>
          <span class="sg-row-text ibps-pr-10">按钮位置</span>
          <div class="sg-row-content">
            <el-radio-group v-model="buttonPosition">
              <el-radio-button
                v-for="t in positions"
                :key="t.value"
                :label="t.value"
              >{{ t.label }}
              </el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </div>

      <!-- 全部应用 -->
      <div v-if="$utils.isNotEmpty(buttons)" class="sg-row sg-row_global">
        <div class="sg-row-label"><span class="sg-row-text sg-row-blue">{{ global.label }}:</span></div>
        <div class="sg-row-rights">
          <span class="sg-row-text">权限</span>
          <div class="sg-row-content">
            <rights-selector :value="global.rights" @input="changeGlobalRights" />
          </div>
        </div>
        <div class="sg-row-style">
          <span class="sg-row-text">按钮颜色</span>
          <div class="sg-row-content">
            <el-select v-model="global.style" placeholder="按钮颜色" @change="setDataByGlobal('style')">
              <el-option
                v-for="item in colors"
                :key="item.type"
                :label="item.label"
                :value="item.type"
              >
                <el-link :underline="false" :type="item.type " class="ibps-fl">{{ item.label }}</el-link>
              </el-option>
            </el-select>
          </div>
        </div>
        <div v-if="type==='function_buttons' && !judgeIsOne()" class="sg-row-position">
          <span class="sg-row-text">按钮位置</span>
          <div class="sg-row-content">
            <el-radio-group v-model="global.position" @change="setDataByGlobal('position')">
              <el-radio-button
                v-for="t in getCommonPositionType()"
                :key="t.value"
                :label="t.value"
              >{{ t.label }}
              </el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </div>
      <div v-for="(button, i) in buttons" :key="i" class="sg-row">
        <div class="sg-row-label"><span class="sg-row-text">{{ button.label }}:</span></div>
        <div class="sg-row-rights">
          <span class="sg-row-text">权限</span>
          <div class="sg-row-content">
            <rights-selector v-model="button.rights" />
          </div>
        </div>
        <div class="sg-row-style">
          <span class="sg-row-text">按钮颜色</span>
          <div class="sg-row-content">
            <el-select v-model="button.style" placeholder="按钮颜色" @change="changeStyle">
              <el-option
                v-for="item in colorOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                <el-link :underline="false" :type="item.value " class="ibps-fl">{{ item.label }}</el-link>
              </el-option>
            </el-select>
          </div>
        </div>
        <div v-if="type==='function_buttons' && !judgeIsOne()" class="sg-row-position">
          <span class="sg-row-text">按钮位置</span>
          <div class="sg-row-content">
            <el-radio-group v-model="button.position" @change="changePosition">
              <el-radio-button
                v-for="t in buttonPositions[i]"
                :key="t.value"
                :label="t.value"
              >{{ t.label }}
              </el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </div>
    </div>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>

</template>
<script>
import { colorOptions } from '@/business/platform/form/constants/fieldOptions'
import ButtonsConstants, { hasPermission } from '@/business/platform/data/constants/buttons'
import RightsSelector from '@/business/platform/rights/config/selector'

export default {
  components: {
    RightsSelector
  },
  props: {
    position: {
      type: String,
      default: 'topLeft'
    },
    data: {
      type: Array
    },
    type: {
      type: String,
      default: 'function_buttons'
    },
    title: {
      type: String,
      default: '设置全局'
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      colorOptions,
      toolbars: [
        { key: 'confirm' },
        { key: 'cancel' }
      ],
      buttons: [],
      buttonPositions: [],
      global: {
        label: '全局设置',
        rights: [{ type: 'none' }],
        style: '',
        position: ''
      },
      buttonPosition: 'topLeft',
      positions: [{
        value: 'topLeft',
        label: '左上角'
      }, {
        value: 'lowerLeft',
        label: '左下角'
      }, {
        value: 'topRight',
        label: '右上角'
      }, {
        value: 'lowerRight',
        label: '右下角'
      }, {
        value: 'center',
        label: '底部居中'
      }]
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
      },
      immediate: true
    },
    position: {
      handler: function(val, oldVal) {
        if (this.$utils.isNotEmpty(val)) this.buttonPosition = val
      },
      immediate: true
    },
    data: {
      handler(val) {
        if (val) {
          this.buttons = val
          this.setButtonPositions()
          this.initGlobal(val)
        }
      },
      immediate: true
    }
  },
  beforeDestroy() {
    this.colors = null
    this.toolbars = null
    this.buttons = null
    this.buttonPositions = null
    this.global = null
    this.positions = null
  },
  methods: {
    arrayEquals(arrA, arrB) { // 权限数组判断
      if (this.$utils.isEmpty(arrA) && this.$utils.isEmpty(arrB)) return true
      else if (this.$utils.isEmpty(arrA) && this.$utils.isNotEmpty(arrB)) return false
      else if (this.$utils.isEmpty(arrB) && this.$utils.isNotEmpty(arrA)) return false
      else if (arrA.length !== arrB.length) return false

      for (let i = 0; i < arrA.length; i++) {
        if (arrA[i].type !== arrB[i].type) return false
      }
      return true
    },
    initGlobal(val) { // 根据传入的数据，初始化全局的设置
      let _global = {
        label: '全局设置',
        rights: [{ type: 'none' }],
        style: '',
        position: ''
      }
      if (this.$utils.isEmpty(val)) {
        this.global = _global
        return
      }
      const _button = JSON.parse(JSON.stringify(val[0]))
      _global = {
        label: '全局设置',
        rights: _button.rights,
        style: _button.style,
        position: _button.position
      }
      let _rFlag = true // 权限
      let _sFlag = true // 颜色
      let _pFlag = true // 位置
      for (let i = 1; i < val.length; i++) {
        if (_rFlag && (this.$utils.isEmpty(_button.rights) || !this.arrayEquals(_button.rights, val[i].rights))) {
          _rFlag = false
          _global.rights = [{ type: 'none' }]
        }
        if (_sFlag && (_button.style === '' || _button.style !== val[i].style)) {
          _sFlag = false
          _global.style = ''
        }
        if (_pFlag && (_button.position === '' || _button.position !== val[i].position)) {
          _pFlag = false
          _global.position = ''
        }
        if (!_rFlag && !_sFlag && !_pFlag) break
      }
      this.global = _global
    },
    judgeIsOne() { // 判断是否所有按钮的选项只有一个
      for (let i = 0; i < this.buttonPositions.length; i++) {
        if (this.buttonPositions[i].length !== 2) return false
      }
      return true
    },
    setButtonPositions() { // 获取所有按钮对应下标上的按钮位置选项
      this.buttonPositions = []
      if (this.$utils.isNotEmpty(this.buttons) && this.buttons.length > 0) {
        this.buttons.forEach(button => {
          const temp = this.positionType(button)
          this.buttonPositions.push(temp)
        })
      }
    },
    changePosition() { // 单一按钮选择按钮位置时改变全局设置中的按钮位置
      if (this.$utils.isNotEmpty(this.global.position)) this.global.position = ''
    },
    changeStyle() { // 单一按钮选择按钮颜色时改变全局设置中的按钮颜色
      this.$forceUpdate()
      if (this.$utils.isNotEmpty(this.global.style)) this.global.style = ''
    },
    // 全局权限发生变化
    changeGlobalRights(data) {
      this.global.rights = data
      this.setDataByGlobal('rights')
    },
    // 设置全局属性发生变化时，将所有按钮全部修改
    setDataByGlobal(name) {
      this.buttons.forEach(el => {
        el[name] = this.global[name]
      })
    },
    getCommonScopeByArray(data) {
      const temp = []
      if (this.$utils.isEmpty(data)) return temp
      if (data.length === 1) return data
      data[0].forEach(el => {
        for (let i = 1; i < data.length; i++) {
          if (!data[i].includes(el)) return
        }
        temp.push(el)
      })
      return temp
    },
    // 获取所有按钮的共同的位置数据
    getCommonPositionType() {
      const positionType = []
      positionType.push({
        value: 'all',
        label: '所有'
      })

      const _data = []
      this.buttons.forEach(item => {
        if (this.$utils.isEmpty(item.button_type)) return
        const result = ButtonsConstants[item.button_type]
        if (this.$utils.isNotEmpty(result) && this.$utils.isNotEmpty(result.scope)) _data.push(result.scope)
      })
      const temp = this.getCommonScopeByArray(_data)

      if (temp.includes('toolbar') && this.type === 'function_buttons') {
        positionType.push({
          value: 'toolbar',
          label: '仅顶部'
        })
      }

      if (temp.includes('manage') && this.type === 'function_buttons') {
        positionType.push({
          value: 'manage',
          label: '仅管理列'
        })
      }
      if (temp.includes('search') && this.type === 'function_buttons') {
        positionType.push({
          value: 'search',
          label: '仅查询列'
        })
      }

      if (temp.includes('edit') && this.type === 'edit_buttons') {
        positionType.push({
          value: 'edit',
          label: '仅编辑'
        })
      }
      return positionType
    },
    // 获取按钮位置数据
    positionType(data) {
      const positionType = []
      positionType.push({
        value: 'all',
        label: '所有'
      })

      const buttonType = data.button_type || ''
      return this.setPositionType(buttonType, positionType)
    },
    // 设置按钮位置的数据
    setPositionType(buttonType, positionType) {
      if (hasPermission(buttonType, 'toolbar') && this.type === 'function_buttons') {
        positionType.push({
          value: 'toolbar',
          label: '仅顶部'
        })
      }

      if (hasPermission(buttonType, 'manage') && this.type === 'function_buttons') {
        positionType.push({
          value: 'manage',
          label: '仅管理列'
        })
      }
      if (hasPermission(buttonType, 'search') && this.type === 'function_buttons') {
        positionType.push({
          value: 'search',
          label: '仅查询列'
        })
      }

      if (hasPermission(buttonType, 'edit') && this.type === 'edit_buttons') {
        positionType.push({
          value: 'edit',
          label: '仅编辑'
        })
      }

      return positionType
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
    closeDialog() {
      this.$emit('close', false)
    },
    handleConfirm() {
      const data = {}
      data.buttons = JSON.parse(JSON.stringify(this.buttons))
      if (this.type === 'edit_buttons') data.position = this.buttonPosition
      this.$emit('confirm', data)
    }
  }
}
</script>
<style lang="scss">
.setting-global{
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  .sg-row_global{
    border: 1px solid #e3e3e3;
    border-radius: 5px;
  }
  .sg-row{
    width: 100%;
    display: flex;
    padding: 10px;
    box-sizing: border-box;
    .sg-row-blue{
      color: #429efd;
    }
    .sg-row-label{
      width: 10%;
      justify-content: flex-end;
    }
    .sg-row-text{
      font-size: 14px;
      white-space: nowrap;
    }
    .sg-row-rights{
      width: 25%;
    }
    .sg-row-style{
      width: 25%;
    }
    .sg-row-position{
      width: 40%;
    }
    .sg-row-content{
      flex: 1;
      padding-left: 10px;
    }
    & > div {
      display: flex;
      align-items: center;
      padding-right: 20px;
    }
    & > div:last-child{
      padding-right: 0;
    }
  }
}
</style>
