<template>
  <el-form
    ref="passwordForm"
    v-loading="dialogLoading"
    :element-loading-text="$t('common.loading')"
    :model="password"
    :rules="rules"
  >
    <el-form-item prop="newPassword" :class="hasExtendItem?'extend_item':null">
      <el-input v-model="password.newPassword" clearable :type="passwordType1" :placeholder="$t('platform.org.employee.change-password.newPassword')" prefix-icon="ibps-icon-lock" auto-complete="off" @blur="formBlur" @keyup.enter.native="handleReset">
        <i slot="suffix" :class="passwordType1=='password'?'ibps-icon-eye-slash':'ibps-icon-eye'" class=" el-input__icon" @click="showPassword1" />
      </el-input>
    </el-form-item>
    <el-form-item prop="repeatPassword">
      <el-input v-model="password.repeatPassword" clearable :type="passwordType2" :placeholder="$t('platform.org.employee.change-password.repeatPassword')" prefix-icon="ibps-icon-lock" auto-complete="off" @keyup.enter.native="handleReset">
        <i slot="suffix" :class="passwordType2=='password'?'ibps-icon-eye-slash':'ibps-icon-eye'" class=" el-input__icon" @click="showPassword2" />
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" class="login-submit" @click.native.prevent="handleReset">{{ $t('system.login.resetPassword') }}</el-button>
    </el-form-item>
    <el-form-item>
      <el-button plain class="login-submit" @click.native.prevent="handleLogin">{{ $t('system.login.backLogin') }}</el-button>
    </el-form-item>
  </el-form>

</template>

<script>
import { userSecurityTextObj, regx } from '@/views/platform/org/employee/constants'
import { changePassword2 } from '@/api/platform/org/user'
import { getDefaultUserSecurity } from '@/api/platform/auth/userSecurity'
import Utils from '@/utils/util'
export default {
  data() {
    const hasExtendItem = false
    const validateNewPassword = (rule, value, callback) => {
      const reg = /(^\s+)|(\s+$)|\s+/g
      const complexityRegular = this.regx
      if (value === '') {
        callback(new Error('???????????????'))
        this.hasExtendItem = false
      } else {
        if (this.userSecurity.complexity.length === 0) {
          if (reg.test(value)) {
            callback(new Error('????????????????????????!'))
            this.hasExtendItem = false
          } else {
            if (this.password.repeatPassword !== '') {
              this.$refs[this.formName].validateField('repeatPassword')
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
            callback(new Error('?????????' + this.userSecurity.maxLengthText + ';' + this.userSecurity.minLengthText + ';' + this.userSecurity.complexityText))
          } else {
            if (value.length > this.userSecurity.maxLength || value.length < this.userSecurity.minLength) {
              this.hasExtendItem = true
              callback(new Error('?????????' + this.userSecurity.maxLengthText + ';' + this.userSecurity.minLengthText + ';' + this.userSecurity.complexityText))
            } else {
              callback()
              this.hasExtendItem = false
            }
          }
        }
      }
    }
    const validateRepeatPassword = (rule, value, callback) => {
      const reg = /(^\s+)|(\s+$)|\s+/g
      if (value === '') {
        callback(new Error('?????????????????????'))
      } else if (value !== this.password.newPassword) {
        callback(new Error('???????????????????????????!'))
      } else if (reg.test(value)) {
        callback(new Error('????????????????????????!'))
      } else {
        callback()
      }
    }
    return {
      hasExtendItem,
      regx,
      userSecurityTextObj,
      formName: 'passwordForm',
      passwordType1: 'password',
      passwordType2: 'password',
      dialogLoading: false,
      rules: {
        newPassword: [
          { required: true, message: this.$t('validate.required') },
          { validator: validateNewPassword, trigger: 'change' }
        ],
        repeatPassword: [
          { required: true, message: this.$t('validate.required') },
          { validator: validateRepeatPassword, trigger: 'change' }
        ]
      },
      password: {
        reset: 1,
        newPassword: '',
        repeatPassword: '',
        primitivePassword: ''// ????????????
      },
      // ??????????????????
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
    'password.newPassword': {
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
    const userId = this.$route.params.userId
    const state = this.$route.params.login_state
    if (Utils.isEmpty(userId) || Utils.isEmpty(state)) {
      this.handleLogin()
    } else {
      this.handleGetDefaultUserSecurity()
    }
  },
  methods: {
    formBlur() {
      this.hasExtendItem = false
    },
    showPassword1() {
      this.passwordType1 === ''
        ? (this.passwordType1 = 'password')
        : (this.passwordType1 = '')
    },
    showPassword2() {
      this.passwordType2 === ''
        ? (this.passwordType2 = 'password')
        : (this.passwordType2 = '')
    },
    handleReset() {
      this.$refs.passwordForm.validate(valid => {
        if (valid) {
          this.saveData()
        }
      })
    },
    handleLogin() {
      this.$router.push({ path: '/login' })
    },
    handleGetDefaultUserSecurity(params) {
      getDefaultUserSecurity(params).then(response => {
        const userSecurityTextObj = this.userSecurityTextObj
        const complexityArr = response.data.complexity.split(',').sort()
        const arr = []
        complexityArr.forEach(i => {
          arr.push(userSecurityTextObj[parseInt(i)])
        })
        this.userSecurity.complexity = complexityArr
        this.userSecurity.complexityText = '??????' + arr.join(',')
        this.userSecurity.maxLength = response.data.maxLength
        this.userSecurity.maxLengthText = '????????????' + response.data.maxLength
        this.userSecurity.minLength = response.data.minLength
        this.userSecurity.minLengthText = '????????????' + response.data.minLength
      }).catch(() => {})
    },
    /**
     * ????????????
     */
    formValidate() {
      this.$nextTick(() => {
        this.$refs[this.formName].validate(() => {})
      })
      this.handleGetDefaultUserSecurity()
    },
    // ??????????????????
    saveData() {
      let url = '/user/change/passwd?access_token=' + this.$route.params.login_state
      const tenantId = this.$route.params.tenantId
      if (Utils.isNotEmpty(tenantId)) {
        url += '&tenantId=' + tenantId
      }

      this.password.userIds = this.$route.params.userId.split(',')
      changePassword2(this.password, url).then(response => {
        this.$confirm('??????????????????', '??????', {
          confirmButtonText: '????????????',
          cancelButtonText: '??????',
          type: 'success'
        }).then(() => {
          this.handleLogin()
        }).catch(() => {
        })
      }).catch((err) => {
        console.error(err)
      })
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
</style>
