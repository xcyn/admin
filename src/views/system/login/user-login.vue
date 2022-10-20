<template>
  <el-form ref="loginForm" :rules="loginRules" :model="loginForm" class="login-form" label-width="0" @submit.native.prevent>
    <el-form-item prop="username">
      <el-input v-model="loginForm.username" :placeholder="$t('system.login.username')" tabindex="1" clearable auto-complete="on" prefix-icon="ibps-icon-user" name="username" @keyup.enter.native="handleLogin" />
    </el-form-item>
    <el-tooltip v-model="capsTooltip" :content="$t('system.login.capsTooltip')" placement="right" manual>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          :type="passwordType"
          :placeholder="$t('system.login.password')"
          tabindex="2"
          clearable
          auto-complete="on"
          prefix-icon="ibps-icon-lock"
          name="password"
          @keyup.native="checkCapslock"
          @blur="capsTooltip = false"
          @keyup.enter.native="handleLogin"
        >
          <i slot="suffix" :class="passwordType === 'password' ? 'ibps-icon-eye-slash' : 'ibps-icon-eye'" class="el-input__icon" @click="showPassword" />
        </el-input>
      </el-form-item>
    </el-tooltip>
    <el-form-item v-if="enabledValidCode" prop="captcha">
      <el-row :span="24">
        <el-col :span="15">
          <el-input v-model="loginForm.captcha" clearable :maxlength="code.len" :placeholder="$t('system.login.code')" tabindex="3" auto-complete="on" prefix-icon="ibps-icon-qrcode" @keyup.enter.native="handleLogin" />
        </el-col>
        <el-col :span="9">
          <div class="login-code">
            <span v-if="code.type === 'text'" class="login-code-img" @click="refreshCode">{{ code.value }}</span>
            <img v-else :src="code.src" class="login-code-img" @click="refreshCode" />
          </div>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item prop="remember">
      <el-row :span="24">
        <el-col :span="14">
          <el-checkbox v-model="loginForm.remember">{{ $t('system.login.remember') }}</el-checkbox>
        </el-col>
        <el-col v-if="regOpen || tenantOpen" :span="10">
          <el-button v-if="!tenantOpen" type="text" class="forget" @click="forget">{{ $t('system.login.forget') }} </el-button>
          <el-button v-if="tenantOpen" type="text" class="forget" @click="tenantForget">{{ $t('system.login.forget') }} </el-button>
          <el-divider v-if="regOpen" direction="vertical" />
          <el-button v-if="regOpen" type="text" class="register" @click="register">{{ $t('system.login.register') }} </el-button>
          <el-divider v-if="tenantOpen" direction="vertical" />
          <el-button v-if="tenantOpen" type="text" class="register" @click="tenantRegister"> {{ $t('system.login.tenantRegister') }}</el-button>
        </el-col>
        <el-col v-if="!regOpen && !tenantOpen" :span="10">
          <el-divider direction="vertical" />
          <el-button type="text" class="forget" @click="forgetPassword">{{ $t('system.login.forget') }}</el-button>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item>
      <el-button :loading="loading" type="primary" class="login-submit" @click.native.prevent="handleLogin"> {{ $t('system.login.logIn') }}</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import Utils from '@/utils/util'
import I18n from '@/utils/i18n'
import * as ipbsHttp from '@/api/cpApi/ibps/index'
const validateUsername = (rule, value, callback) => {
  if (Utils.isEmpty(value)) {
    return callback(new Error(I18n.t('system.login.usernameCorrect')))
  }
  callback()
}
const validateMobile = (rule, value, callback) => {
  if (Utils.isEmpty(value)) {
    return callback(new Error(I18n.t('手机号不能为空')))
  } else {
    const isPhone = /^1(3|4|5|6|7|8|9)\d{9}$/
    if (value.length === 11) {
      if (!isPhone.test(value)) {
        return callback(new Error(I18n.t('请输入正确手机号')))
      } else {
        callback()
      }
    } else {
      if (!isPhone.test(value)) {
        return callback(new Error(I18n.t('请输入正确手机号')))
      } else {
        return callback(new Error(I18n.t('请输入正确手机号长度')))
      }
    }
  }
}
const validateCode = (rule, value, callback) => {
  callback()
}
export default {
  name: 'LoginForm',
  data() {
    return {
      enabledValidCode: false,
      loginForm: { username: '', password: '', captcha: '', remember: true, requestId: '' },
      validateMobile,
      code: { src: '', value: '', len: 5, type: 'src' },
      loginRules: {
        username: [
          {
            required: true,
            trigger: 'change',
            message: this.$t('system.login.usernameCorrect'),
            validator: validateUsername
          }
        ],
        password: [
          {
            required: true,
            message: this.$t('system.login.password'),
            trigger: 'change'
          },
          {
            min: 1,
            message: this.$t('system.login.passwordCorrect'),
            trigger: 'change'
          }
        ],
        captcha: [
          {
            required: true,
            message: this.$t('system.login.code'),
            trigger: 'change'
          },
          {
            required: true,
            trigger: 'change',
            validator: validateCode
          }
        ]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      usernameMap: {}
    }
  },
  computed: {
    ...mapState('ibps/user', ['regOpen', 'tenantOpen'])
  },
  watch: {
    regOpen: {
      handler: function (val, oldVal) {
        if (val) {
          this.loginRules.username = [
            {
              required: true,
              trigger: 'blur',
              validator: validateMobile
            }
          ]
        } else {
          this.loginRules.username = [
            {
              required: true,
              trigger: 'blur',
              validator: validateUsername
            }
          ]
        }
      },
      immediate: true
    }
  },
  created() {
    // this.initValidCode()
    // this.loadValidCode(true)
  },
  mounted() {
    // 注销退出清空验证码
    this.loginForm.captcha = ''
    // 注销退出清空请求ID
    this.loginForm.requestId = ''
    let that = this
    if (process.env.VUE_APP_CAS_OPEN === 'on') {
      let Base64 = require('js-base64').Base64
      that.loginForm.username = that.getUrlParms('encodeName') || ''
      if (undefined != that.loginForm.username && that.loginForm.username != '') {
        that.loginForm.username = Base64.decode(that.loginForm.username)
        that.loginForm.password = '******'
        setTimeout(function () {
          that.handleSSOLogin()
        })
      } else {
        // 处理跳到单点登录界面
        window.location.href = process.env.VUE_APP_CAS_SERVER_LOGIN_ON
      }
    }
  },
  methods: {
    ...mapActions({
      login: 'ibps/account/login',
      // 单点登录处理
      loginSSO: 'ibps/account/loginSSO',
      getCaptcha: 'ibps/account/getCaptcha'
    }),
    initValidCode() {
      if (this.enabledValidCode) {
        this.loginRules.captcha[0]['required'] = true
        this.loginRules.captcha[1]['required'] = true
      } else {
        this.loginRules.captcha[0]['required'] = false
        this.loginRules.captcha[1]['required'] = false
      }
    },
    // 获取验证码
    loadValidCode(isBackfill) {
      if (Utils.isEmpty(this.loginForm.requestId)) {
        this.loginForm.requestId = Utils.guid()
      }
      this.getCaptcha({
        params: {
          requestId: this.loginForm.requestId
        }
      })
        .then(data => {
          // 返回状态501，说明系统没有开启验证码
          if (data.state === 501) {
            this.enabledValidCode = false
          } else {
            this.enabledValidCode = true
            this.code.src = data.data
            this.loginForm.requestId = data.variables.requestId
          }
          this.initValidCode()
          if (isBackfill) {
            this.loginForm.code = this.code.value
          }
        })
        .catch(e => {})
    },
    refreshCode() {
      this.loadValidCode()
    },
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if ((shiftKey && key >= 'a' && key <= 'z') || (!shiftKey && key >= 'A' && key <= 'Z')) {
          this.capsTooltip = true
        } else {
          this.capsTooltip = false
        }
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false
      }
    },
    showPassword() {
      this.passwordType === '' ? (this.passwordType = 'password') : (this.passwordType = '')
    },
    forget() {
      this.$router.replace('/forget')
    },
    tenantForget() {
      this.$router.replace('/tenantForget')
    },
    register() {
      this.$router.replace('/register')
    },
    tenantRegister() {
      this.$router.replace('/tenantRegister')
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          const loading = this.$loading({
            lock: true,
            text: this.$t('common.loading'),
            background: 'rgba(0, 0, 0, 0.7)'
          })
          this.login({
            form: this.loginForm
          })
            .then(() => {
              // 获取用户信息
              ipbsHttp.getLocalUser(this.loginForm.username).then(res => {
                window.localStorage.setItem('userinfo', JSON.stringify(res.data.dataResult[0]))
              })
              // 获取公司数据
              ipbsHttp
                .orgTree({
                  parameters: [
                    {
                      key: 'type',
                      value: 1
                    },
                    {
                      key: 'orgId',
                      value: '0'
                    }
                  ]
                })
                .then(res => {
                  window.localStorage.setItem('depInfo', JSON.stringify(res.data))
                })
              // 更新路由 尝试去获取 cookie 里保存的需要重定向的页面完整地址
              const redirect = this.$route.query.redirect
              if (redirect && redirect !== '/refresh') {
                // 重定向到指定的页面
                this.$router.replace(redirect)
              } else {
                // 重定向到开始路径
                this.$router.replace('/')
              }
              // 延迟10秒关闭遮盖层
              setTimeout(() => {
                this.loading = false
                loading.close()
              }, 1000)
            })
            .catch(err => {
              // 验证码错误自动清空&密码输入错误3次后触发验证码填写模块
              if (err && err.state === 6020104) {
                this.loginForm.captcha = ''
                this.enabledValidCode = true
                this.refreshCode()
              }
              // 有错误状态开启验证码需要刷新验证码
              if (err && err.state && this.enabledValidCode) {
                this.loginForm.captcha = ''
                this.refreshCode()
              }
              if (!this.usernameMap[this.loginForm.username]) {
                this.usernameMap[this.loginForm.username] = 0
              }
              this.usernameMap[this.loginForm.username]++
              if (this.usernameMap[this.loginForm.username] >= 5) {
                this.enabledValidCode = true
                this.refreshCode()
              }
              this.loading = false
              loading.close()
            })
        } else {
          this.$message.closeAll()
          this.$message({
            message: this.$t('common.dialog.saveError'),
            type: 'warning'
          })
          return false
        }
      })
    },
    // 单点登录入口
    handleSSOLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          const loading = this.$loading({
            lock: true,
            text: this.$t('common.loading'),
            background: 'rgba(0, 0, 0, 0.7)'
          })
          this.loginSSO({
            form: this.loginForm
          })
            .then(() => {
              // 获取用户信息
              ipbsHttp.getUserInfo(this.loginForm.username).then(res => {
                window.localStorage.setItem('userinfo', JSON.stringify(res.data.dataResult[0]))
                this.getSubCompany(res.data.dataResult[0].groupID, function (ret) {
                  if (res.state == 200) {
                    if (ret.data && ret.data.dataResult && ret.data.dataResult.length > 0) {
                      window.localStorage.setItem('companyInfo', JSON.stringify(ret.data.dataResult[0]))
                    }
                  }
                })
              })
              ipbsHttp
                .orgTree({
                  parameters: [
                    {
                      key: 'type',
                      value: 1
                    },
                    {
                      key: 'orgId',
                      value: '0'
                    }
                  ]
                })
                .then(res => {
                  window.localStorage.setItem('depInfo', JSON.stringify(res.data))
                })
              // 更新路由 尝试去获取 cookie 里保存的需要重定向的页面完整地址
              const redirect = this.$route.query.redirect
              if (redirect && redirect !== '/refresh') {
                // 重定向到指定的页面
                this.$router.replace(redirect)
              } else {
                // 重定向到开始路径
                this.$router.replace('/')
              }
              // 延迟10秒关闭遮盖层
              setTimeout(() => {
                this.loading = false
                loading.close()
              }, 1000)
            })
            .catch(err => {
              // 验证码错误自动清空&密码输入错误3次后触发验证码填写模块
              if (err && err.state === 6020104) {
                this.loginForm.captcha = ''
                this.enabledValidCode = true
                this.refreshCode()
              }
              // 有错误状态开启验证码需要刷新验证码
              if (err && err.state && this.enabledValidCode) {
                this.loginForm.captcha = ''
                this.refreshCode()
              }
              if (!this.usernameMap[this.loginForm.username]) {
                this.usernameMap[this.loginForm.username] = 0
              }
              this.usernameMap[this.loginForm.username]++
              if (this.usernameMap[this.loginForm.username] >= 5) {
                this.enabledValidCode = true
                this.refreshCode()
              }
              this.loading = false
              loading.close()
            })
        } else {
          this.$message.closeAll()
          this.$message({
            message: this.$t('common.dialog.saveError'),
            type: 'warning'
          })
          return false
        }
      })
    },
    forgetPassword() {
      this.$router.replace('/forgetUsual')
    },
    getUrlParms(name) {
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
      var r = window.location.search.substr(1).match(reg)
      if (r != null) {
        return unescape(r[2])
      }
      return null
    }
  }
}
</script>
