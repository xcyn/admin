<template>
  <div class="login-container pull-height">
    <login-info />
    <div class="login-border pull-height">
      <div class="login-main animated fadeIn">
        <div class="login-title-container">
          <h3 class="title"><i class="ibps-icon-logo" />{{ $t('system.login.title') }}</h3>

        </div>
        <h3>
          <div v-if="tenantOpen" class="ibps-pl-5">
            <el-radio-group v-model="regType">
              <el-radio-button label="tenant">企业注册</el-radio-button>
              <el-radio-button label="user">用户注册</el-radio-button>
            </el-radio-group>
          </div>
          <span v-else class="title">
            {{ $t('system.login.register') }}
          </span>
        </h3>
        <tenant-form v-if="regType=='tenant'" />
        <user-form v-else />
        <login-bottom />
      </div>
    </div>

  </div>
</template>
<script>
import { mapState } from 'vuex'
import '@/assets/styles/pages/login.scss'
import LoginInfo from '../login/login-info'
import LoginBottom from '../login/login-bottom'
import UserForm from './user-form'
import TenantForm from './tenant-form'

export default {
  components: {
    LoginInfo,
    LoginBottom,
    UserForm,
    TenantForm
  },
  data() {
    return {
      regType: 'user'
    }
  },
  computed: {
    ...mapState('ibps/user', [
      'tenantOpen'
    ])
  },
  watch: {
    tenantOpen() {
      this.regType = this.tenantOpen ? 'tenant' : 'user'
    }
  }
}
</script>

<style>
  .login-main > h3 .title {
    margin-left: 5px;
    color: #409eff;
    float: none;
  }
  .title {
    font-size: 18px;
    border: none;
  }
</style>
