<template>
  <el-dialog
    ref="editFormDialog"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="title"
    :width="width"
    class="edit-dialog"
    top="4vh"
    append-to-body
    @close="closeDialog"
  >
    <el-form ref="form" :model="form">
      <el-form-item label="整体背景" style="heght:32px">
        <el-color-picker v-model="form.allBackgroundColor" show-alpha />
      </el-form-item>
      <el-form-item prop="filterColor" label-width="0">
        <condition-color :fields="fields" :data="data" @callback="callbackData" /></el-form-item>
    </el-form>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>
<script>
import ConditionColor from './condition-color'
export default {
  components: {
    ConditionColor
  },
  props: {
    title: {
      type: String
    },
    width: {
      type: String,
      default: '70%'
    },
    data: {
      type: Object
    },
    fields: {
      type: Array,
      default: () => []
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        allBackgroundColor: '',
        fliter_conditon_config: []
      },
      dialogVisible: false,
      toolbars: [
        { key: 'confirm' },
        { key: 'cancel' }
      ]
    }
  },
  watch: {
    data: {
      handler(val) {
        if (!val) return
        this.form = val
      },
      immediate: true,
      deep: true
    },
    visible: {
      handler(val) {
        this.dialogVisible = val
      },
      immediate: true
    },
    dialogVisible: {
      handler(val) {
        this.$emit('update:visible', val)
      },
      immediate: true
    }
  },
  methods: {
    getType: function(dataType) {
      var type = 'string'
      switch (dataType) { // 字段数据类型
        case 'number':
          type = 'number'
          break
        case 'date':
          type = 'date'
          break
        default:
          type = 'string'
      }
      return type
    },
    closeDialog() {
      this.dialogVisible = false
    },
    handleActionEvent({ key }) {
      switch (key) {
        case 'confirm':
          this.handleConfirm(this.form)
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    handleConfirm(val) {
      this.dialogVisible = false
      this.$emit('callback', 'default_list_row_background', val)
    },
    callbackData(data) {
      this.form.fliter_conditon_config = data
    }
  }
}
</script>
