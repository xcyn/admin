import CallActivity from '../settings/call-activity'
import FormSetting from '../settings/form-setting'
import EventScript from '../settings/event-script'
import ButtonSetting from '../settings/button-setting'
import ReminderSetting from '../settings/reminder-setting'
import JumpRule from '../settings/jump-rule'
import UserSetting from '../settings/user-setting'
import SignRule from '../settings/sign-rule'
import SignPrivileges from '../settings/sign-privileges'
import OtherAttribute from '../settings/other-attribute'
import OtherAttributeNode from '../settings/other-attribute-node'
import TriggerFlow from '../settings/trigger-flow'
import BranchCondition from '../settings/branch-condition'
import ServiceSetting from '../settings/service-setting'
import BoSetting from '../settings/bo-setting'
import VariableSetting from '../settings/variable-setting'
import MessageSetting from '../settings/message-setting'
import NotifySetting from '../settings/notify-setting'

export default {
  components: {
    ServiceSetting,
    MessageSetting,
    BoSetting,
    VariableSetting,
    BranchCondition,
    TriggerFlow,
    CallActivity,
    FormSetting,
    EventScript,
    ButtonSetting,
    ReminderSetting,
    JumpRule,
    UserSetting,
    SignRule,
    SignPrivileges,
    NotifySetting,
    OtherAttribute,
    OtherAttributeNode
  },
  props: {
    data: Object
  },
  data() {
    return {
      defaultActiveNames: [],
      expand: true
    }
  },
  created() {
    this.defaultActiveNames = JSON.parse(JSON.stringify(this.activeNames))
  },
  methods: {
    getGlobal(key, value) {
      this.$emit('update-global', key, value)
    },
    onTitle() {
      this.expand = !this.expand
      this.activeNames = this.expand ? JSON.parse(JSON.stringify(this.defaultActiveNames)) : []
    }
  }
}
