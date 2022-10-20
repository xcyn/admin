<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="socket-send"
    append-to-body
    fullscreen
    @open="openDialog"
    @close="closeDialog"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="150px" class="demo-form" @submit.native.prevent>
      <el-form-item v-if="command !== 'notice'" label="收件人：" prop="toUserIds">
        <ibps-employee-selector
          :value="form.toUserIds"
          multiple
          @input="handleInput"
        />
      </el-form-item>
      <el-form-item label="类型：" prop="type">
        <el-select v-model="form.type" style="width:100%;" placeholder="请选择">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <!-- <el-form-item label="自定义消息类型：" prop="customType">
        <el-input v-model="form.customType" />
      </el-form-item> -->

      <el-collapse accordion style="margin-bottom: 18px;">
        <el-collapse-item title="扩展信息">
          <el-form-item label="消息标题：" prop="title">
            <el-input v-model="form.expand.title" />
          </el-form-item>
          <el-form-item label="样式(class)：" prop="style">
            <el-select v-model="form.expand.style" style="width:100%;" placeholder="请选择">
              <el-option
                v-for="item in styleOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="展示位置：" prop="position">
            <el-select v-model="form.expand.position" style="width:100%;" placeholder="请选择">
              <el-option
                v-for="item in positionOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="驻留时间(ms)：" prop="duration">
            <ibps-number
              v-model="form.expand.duration"
              :precision="0"
              :active-change="false"
              :keep-decimals="true"
            />
          </el-form-item>
        </el-collapse-item>
      </el-collapse>

      <el-form-item label="正文：" prop="body" class="demo-form-content">
        <ibps-ueditor v-model="form.body" :z-index="2000" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :identity="identity"
        :actions="toolbars"
        :socpe="thatSocpe"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>
<script>
import { pushEverybodyMessage, pushSomebodiesMessage } from '@/api/platform/socket/push'
import ActionUtils from '@/utils/action'
import IbpsEmployeeSelector from '@/business/platform/org/employee/selector'
import IbpsUeditor from '@/components/ibps-ueditor'
import IbpsNumber from '@/components/ibps-number'
import Identity from '@/constants/identity'
import { typeOptions, styleOptions, positionOptions } from './constants'

export default {
  components: {
    IbpsUeditor,
    IbpsEmployeeSelector,
    IbpsNumber
  },
  props: {
    command: {
      type: String
    },
    visible: {
      type: Boolean,
      default: false
    },
    title: String
  },
  data() {
    return {
      // typeOptions: typeOptions,
      styleOptions: styleOptions,
      positionOptions: positionOptions,
      dialogVisible: false,
      identity: Identity.IBPS.MESSAGE.INNER_SENT,
      formName: 'form',
      toolbars: [
        { key: 'send', label: '发送', icon: 'ibps-icon-send' },
        { key: 'cancel' }
      ],
      form: {
        body: '',
        expand: {},
        fromUserId: '',
        type: ''
      },
      rules: {
        // customType: [{ required: true, message: this.$t('validate.required') }],
        type: [{ required: true, message: this.$t('validate.required') }],
        body: [{ required: true, message: this.$t('validate.required') }],
        toUserIds: [{ required: false, message: this.$t('validate.required') }]
      }
    }
  },
  computed: {
    thatSocpe() {
      return this
    },
    typeOptions() {
      if (this.command === 'notice') {
        return [{
          value: 'system',
          label: '系统消息'
        }]
      }
      return typeOptions
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
  methods: {
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    /**
     * 获取表单数据
     */
    openDialog() {
      let bool = true
      if (this.command === 'notice') bool = false
      this.$set(this.rules.toUserIds[0], 'required', bool)
      // this.$set(this.rules.customType[0], 'required', !bool)
      this.form = {
        body: '',
        expand: {},
        fromUserId: '',
        type: ''
      }
      this.$nextTick(() => {
        this.validate()
      })
    },
    validate() {
      this.$refs[this.formName].validate(() => {})
    },
    handleInput(data) {
      this.$set(this.form, 'toUserIds', data)
    },
    depNameInput(data) {
      this.form.groupId = data
    },
    handleActionEvent({ key }) {
      switch (key) {
        case 'send':// 发送信息
          this.handSend()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    handSend() {
      this.$refs[this.formName].validate(valid => {
        if (valid) {
          this.sendNews()
        } else {
          ActionUtils.saveErrorMessage()
        }
      })
    },
    sendNews() {
      this.form.fromUserId = this.$store.getters.userId
      const _form = JSON.parse(JSON.stringify(this.form))
      if (this.$utils.isEmpty(_form.expand)) {
        _form.expand = {}
      }
      _form.expand = JSON.stringify(_form.expand)
      if (this.command === 'notice') {
        this.pushEverybodyMessage(_form)
      } else {
        if (this.$utils.isEmpty(_form.toUserIds)) {
          ActionUtils.warning('至少选择一个收件人!')
          return
        }
        const _toUserIds = _form.toUserIds.split(',')
        delete _form.toUserIds
        const data = {
          message: _form,
          toUserIds: _toUserIds
        }
        this.pushSomebodiesMessage(data)
      }
    },
    // 成功提示
    successAlert() {
      ActionUtils.saveSuccessAlert('消息发送成功', () => {
        this.$refs[this.formName].resetFields()
        this.$emit('callback', true)
        this.closeDialog()
      })
    },
    // 为指定某些人发送消息
    pushSomebodiesMessage(data) {
      pushSomebodiesMessage(data).then(response => {
        this.successAlert()
      }).catch((err) => {
        console.error(err)
        ActionUtils.saveErrorMessage('消息发送失败')
      })
    },
    // 为所有人发送消息
    pushEverybodyMessage(data) {
      pushEverybodyMessage(data).then(response => {
        this.successAlert()
      }).catch((err) => {
        console.error(err)
        ActionUtils.saveErrorMessage('消息发送失败')
      })
    }
  }
}
</script>
<style lang="scss">
.socket-send{
  .demo-form-content{
    .edui-editor-iframeholder{
      height: 100% !important;
    }
  }
}
</style>
