<template>
  <div class="login-container pull-height">
    <login-info />
    <div class="login-border pull-height">
      <div class="login-main animated fadeIn">
        <div class="login-title-container">
          <h3 class="title"><i class="ibps-icon-logo" />{{ $t('system.login.title') }}</h3>

        </div>
        <h3><span class="title">{{ $t('system.login.forget') }}</span></h3>
        <el-tabs
          v-model="activeName"
          :element-loading-text="$t('common.loading')"
          class="emp-tab"
          @tab-click="changeType"
        >
          <el-tab-pane label="短信验证" name="smsCaptcha">
            <el-form ref="smsCaptchaForm" :rules="rules" :model="smsCaptchaForm" class="login-form" label-width="0">
              <el-form-item prop="mobile">
                <el-input v-model="smsCaptchaForm.mobile" clearable :placeholder="$t('system.login.mobile')" auto-complete="off" prefix-icon="iconfont ibps-icon-mobile" />
              </el-form-item>
              <el-form-item prop="passWd" :class="hasExtendItem?'extend_item':null">
                <el-input v-model="smsCaptchaForm.passWd" clearable :type="passwordType" :placeholder="$t('system.login.password')" prefix-icon="ibps-icon-lock" auto-complete="off">
                  <i slot="suffix" :class="passwordType=='password'?'ibps-icon-eye-slash':'ibps-icon-eye'" class=" el-input__icon" @click="showPassword" />
                </el-input>
              </el-form-item>
              <el-form-item prop="validCode">
                <el-input v-model="smsCaptchaForm.validCode" clearable :placeholder="$t('system.login.code')" auto-complete="off" prefix-icon="iconfont ibps-icon-qrcode">
                  <template slot="append"><span :class="[{display:msgKey}]" class="msg-text" @click="handleSend">{{ $t(msgKey?'system.login.msgScuccess':'system.login.msgInit',{'time':msgTime}) }}</span></template>
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" class="login-submit" @click.native.prevent="handleSmsForget">{{ $t('system.login.resetPassword') }}</el-button>
              </el-form-item>
              <el-form-item>
                <el-button plain class="login-submit" @click.native.prevent="handleLogin">{{ $t('system.login.backLogin') }}</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="邮箱验证" name="emailCaptcha">
            <el-form ref="emailCaptchaForm" :rules="rules" :model="emailCaptchaForm" class="login-form" label-width="0">
              <el-form-item prop="email">
                <el-input v-model="emailCaptchaForm.email" clearable :placeholder="$t('system.login.mail')" auto-complete="off" prefix-icon="iconfont ibps-icon-mobile" />
              </el-form-item>
              <el-form-item prop="passWd" :class="hasExtendItem?'extend_item':null">
                <el-input v-model="emailCaptchaForm.passWd" clearable :type="passwordType" :placeholder="$t('system.login.password')" prefix-icon="ibps-icon-lock" auto-complete="off">
                  <i slot="suffix" :class="passwordType=='password'?'ibps-icon-eye-slash':'ibps-icon-eye'" class=" el-input__icon" @click="showPassword" />
                </el-input>
              </el-form-item>
              <el-form-item prop="validCode">
                <el-input v-model="emailCaptchaForm.validCode" clearable :placeholder="$t('system.login.code')" auto-complete="off" prefix-icon="iconfont ibps-icon-qrcode">
                  <template slot="append"><span :class="[{display:msgKey}]" class="msg-text" @click="handleSend">{{ $t(msgKey?'system.login.msgScuccess':'system.login.msgInit',{'time':msgTime}) }}</span></template>
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" class="login-submit" @click.native.prevent="handleEmailForget">{{ $t('system.login.resetPassword') }}</el-button>
              </el-form-item>
              <el-form-item>
                <el-button plain class="login-submit" @click.native.prevent="handleLogin">{{ $t('system.login.backLogin') }}</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
        <login-bottom />
      </div>
    </div>

  </div>
</template>
<script>
import { userSecurityTextObj, regx } from '@/views/platform/org/employee/constants'
import '@/assets/styles/pages/login.scss'
import LoginInfo from '../login/login-info'
import LoginBottom from '../login/login-bottom'
import { validateMobile } from '@/utils/validate'
import { sendCaptcha } from '@/api/oauth2/user'
import { getDefaultUserSecurity } from '@/api/platform/auth/userSecurity'

const MSGTIME = 60 // 时间 60秒
export default {
  name: 'Codelogin',
  components: {
    LoginInfo,
    LoginBottom
  },
  data() {
    const hasExtendItem = false
    const validatePassword = (rule, value, callback) => {
      const reg = /(^\s+)|(\s+$)|\s+/g
      const complexityRegular = this.regx
      if (value === '') {
        callback(new Error('请输入密码'))
        this.hasExtendItem = false
      } else {
        if (this.userSecurity.complexity.length === 0) {
          if (reg.test(value)) {
            callback(new Error('请勿携带空格字符!'))
            this.hasExtendItem = false
          } else {
            if (this.password.repeatPassword !== '') {
              this.$refs[this.formName + 'Form'].validateField('passWd')
            }
            this.hasExtendItem = false
            callback()
          }
        } else {
          const flag = []
          for (var l in complexityRegular) {
            if (value.match(complexityRegular[l]) !== null) {
              flag.push(l)
            }
          }
          if (flag.toString() !== this.userSecurity.complexity.toString()) {
            this.hasExtendItem = true
            callback(new Error('格式：' + this.userSecurity.maxLengthText + ';' + this.userSecurity.minLengthText + ';' + this.userSecurity.complexityText))
          } else {
            if (value.length > this.userSecurity.maxLength || value.length < this.userSecurity.minLength) {
              this.hasExtendItem = true
              callback(new Error('格式：' + this.userSecurity.maxLengthText + ';' + this.userSecurity.minLengthText + ';' + this.userSecurity.complexityText))
            } else {
              this.hasExtendItem = false
              callback()
            }
          }
        }
      }
    }
    const validatePhone = (rule, value, callback) => {
      const isMobile = validateMobile(value)
      if (!isMobile.result) {
        callback(new Error(this.$t('validate.mobile.' + isMobile.msg)))
      } else {
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      var search = '@'
      var start = value.indexOf(search)// 获得字符串的开始位置
      // 获取@前面字符
      // var anteriorSegment = value.substring(0, start)
      // 获取@后面字符
      var posteriorSegment = value.substring(start, search.length - start)
      const re = /^[0-9a-zA-Z]{1}[0-9a-zA-Z_.-]{1,318}[0-9a-zA-Z]{1}$/
      if (!re.test(posteriorSegment) && posteriorSegment.length > 2 && posteriorSegment.length < 321) {
        callback(new Error('必须以字母或者数字开头；字母或者数字结尾（结尾不包括邮箱后缀名），且字符类型为字母、数字、下划线、点、减号'))
      } else if (!re.test(posteriorSegment) && (posteriorSegment.length > 2 || posteriorSegment.length < 321)) {
        callback(new Error('长度最少为3位，最多为320位'))
      } else {
        callback()
      }
    }
    const validateCode = (rule, value, callback) => {
      if (value.length !== 6) {
        callback(new Error(this.$t('system.login.codeLength')))
      } else {
        callback()
      }
    }
    return {
      hasExtendItem,
      regx,
      userSecurityTextObj,
      activeName: 'smsCaptcha',
      msgTime: MSGTIME,
      msgKey: false,
      passwordType: 'password',
      smsCaptchaForm: {
        mobile: '',
        passWd: '',
        validCode: ''
      },
      emailCaptchaForm: {
        email: '',
        passWd: '',
        validCode: ''
      },
      rules: {
        mobile: [{ required: true, trigger: 'blur', validator: validatePhone }],
        email: [{ required: true, trigger: 'blur', validator: validateEmail }],
        passWd: [
          { required: true, message: this.$t('validate.required') },
          { validator: validatePassword, trigger: 'blur' },
          { validator: validatePassword, trigger: 'change' }],
        validCode: [{ required: true, trigger: 'blur', validator: validateCode }]
      },
      // 用户安全设置
      userSecurity: {
        complexity: [],
        complexityText: '',
        maxLength: '',
        maxLengthText: '',
        minLength: '',
        minLengthText: ''
      }
    }
  },
  watch: {
    'emailCaptchaForm.passWd': {
      handler: function(val) {
        if (val === '') {
          this.hasExtendItem = false
        }
      },
      immediate: true,
      deep: true
    },
    'smsCaptchaForm.passWd': {
      handler: function(val) {
        if (val === '') {
          this.hasExtendItem = false
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    this.handleGetDefaultUserSecurity()
  },
  methods: {
    showPassword() {
      this.passwordType === ''
        ? (this.passwordType = 'password')
        : (this.passwordType = '')
    },
    // 发送验证码
    handleSend() {
      if (this.activeName === 'smsCaptcha') {
        this.sendSmsCaptcha()
      } else {
        this.sendEmailCaptcha()
      }
    },
    sendSmsCaptcha() {
      const isMobile = validateMobile(this.smsCaptchaForm.mobile)
      if (!isMobile.result) {
        this.$message.closeAll()
        this.$message.error(this.$t('system.login.mobileCorrect'))
        this.$el[0].focus()
        return
      }

      // 真正发送验证码
      sendCaptcha({
        mobile: this.smsCaptchaForm.mobile,
        forget: true
      }).then((data) => {
        if (this.msgKey) { return }
        this.msgKey = true
        const time = setInterval(() => {
          this.msgTime--
          if (this.msgTime === 0) {
            this.msgTime = MSGTIME
            this.msgKey = false
            clearInterval(time)
          }
        }, 1000)
      }).catch((e) => {

      })
    },
    sendEmailCaptcha() {
      const isEmail = this.validateEmail(this.emailCaptchaForm.email)
      if (!isEmail) {
        this.$message.closeAll()
        this.$message.error(this.$t('system.login.mailCorrect'))
        this.$el[0].focus()
        return
      }

      // 真正发送验证码
      sendCaptcha({
        email: this.emailCaptchaForm.email,
        forget: true
      }).then((data) => {
        if (this.msgKey) { return }
        this.msgKey = true
        const time = setInterval(() => {
          this.msgTime--
          if (this.msgTime === 0) {
            this.msgTime = MSGTIME
            this.msgKey = false
            clearInterval(time)
          }
        }, 1000)
      }).catch((e) => {

      })
    },
    handleSmsForget() {
      this.$refs.smsCaptchaForm.validate(valid => {
        if (valid) {
          this.$store.dispatch('ibps/account/resetPassword', this.smsCaptchaForm).then(res => {
            this.$confirm('重置密码成功', '提示', {
              confirmButtonText: '重新登录',
              cancelButtonText: '取消',
              type: 'success'
            }).then(() => {
              this.$router.push({ path: '/login' })
            }).catch(() => {
            })
          })
        }
      })
    },
    handleEmailForget() {
      this.$refs.emailCaptchaForm.validate(valid => {
        if (valid) {
          this.$store.dispatch('ibps/account/resetPassword', this.emailCaptchaForm).then(res => {
            this.$confirm('重置密码成功', '提示', {
              confirmButtonText: '重新登录',
              cancelButtonText: '取消',
              type: 'success'
            }).then(() => {
              this.$router.push({ path: '/login' })
            }).catch(() => {
            })
          })
        }
      })
    },
    handleLogin() {
      this.$router.push({ path: '/login' })
    },
    changeType(tab) {
      if (tab.name === 'smsCaptcha') {
        this.emailCaptchaForm = {
          email: '',
          passWd: '',
          validCode: ''
        }
      } else {
        this.smsCaptchaForm = {
          mobile: '',
          passWd: '',
          validCode: ''
        }
      }
    },
    validateEmail(value) {
      var search = '@'
      var start = value.indexOf(search)// 获得字符串的开始位置
      var posteriorSegment = value.substring(start, search.length - start)
      const re = /^[0-9a-zA-Z]{1}[0-9a-zA-Z_.-]{1,318}[0-9a-zA-Z]{1}$/
      if (!re.test(posteriorSegment) && posteriorSegment.length > 2 && posteriorSegment.length < 321) {
        return false
      } else if (!re.test(posteriorSegment) && (posteriorSegment.length > 2 || posteriorSegment.length < 321)) {
        return false
      } else {
        return true
      }
    },
    handleGetDefaultUserSecurity(params) {
      getDefaultUserSecurity(params).then(response => {
        if (this.$utils.isEmpty(response.data)) {
          this.rules.passWd = [{ required: true, message: this.$t('validate.required') }]
          return
        }
        const userSecurityTextObj = this.userSecurityTextObj
        const complexityArr = response.data.complexity.split(',').sort()
        const arr = []
        complexityArr.forEach(i => {
          arr.push(userSecurityTextObj[parseInt(i)])
        })
        this.userSecurity.complexity = complexityArr
        this.userSecurity.complexityText = '必须' + arr.join(',')
        this.userSecurity.maxLength = response.data.maxLength
        this.userSecurity.maxLengthText = '最大长度' + response.data.maxLength
        this.userSecurity.minLength = response.data.minLength
        this.userSecurity.minLengthText = '最小长度' + response.data.minLength
      }).catch(() => {})
    }
  }
}
</script>

<style>
.msg-text {
  display: block;
  width: 60px;
  font-size: 12px;
  text-align: center;
  cursor: pointer;
}
.msg-text.display {
  color: #ccc;
}
.extend_item{
  padding-bottom: 15px;
}
</style>
