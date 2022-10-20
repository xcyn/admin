<template>
  <div class="login-container pull-height" @keyup.enter="handleLogin" :style="{backgroundImage: 'url(' + loginImg + ')', left: '0',top: '0',backgroundSize:'100% 100%'}">
    <login-info />
    <div class="login-border pull-height">
      <div class="login-main animated fadeIn">
        <div class="login-title-container">
          <h3 class="title"><i class="ibps-icon-logo" />{{ $t('system.login.title') }}</h3>
        </div>
        <h3><span class="title">{{ $t('system.login.userLogin') }}</span>

          <ibps-plugin-language v-if="language" class="ibps-fr" />
          <ibps-api-base-url-controller v-if="$nodeEnv === 'development'">
            <el-tooltip effect="dark" :content="$t('navbar.switchEnvironment')" placement="bottom">
              <el-button type="text" class="ibps-fr ibps-mr-5 btn-text can-hover">
                <ibps-icon name="wifi" style="font-size: 18px;" />
              </el-button>
            </el-tooltip>
          </ibps-api-base-url-controller>
        </h3>
        <user-login />
        <login-bottom />
      </div>
    </div>

  </div>
</template>
<script>
import '@/assets/styles/pages/login.scss'
import LoginInfo from './login-info'
import LoginBottom from './login-bottom'
import UserLogin from './user-login'
import IbpsPluginLanguage from '@/plugins/language'
import IbpsApiBaseUrlController from '@/plugins/api-base-url'

export default {
  name: 'Login',
  components: {
    LoginInfo,
    LoginBottom,
    UserLogin,
    IbpsPluginLanguage,
    IbpsApiBaseUrlController
  },
  data () {
    return {
      activeName: 'user',
      language: true,
      loginImg: '',
    }
  },
  mounted () {
    this.language = process.env.VUE_APP_IS_LOCALE === 'true'
    this.loginImg = require(process.env.VUE_APP_LOGIN_BACKGROUND_IMG)
  },
  methods: {
    handleLogin () { }
  }
}
</script>
