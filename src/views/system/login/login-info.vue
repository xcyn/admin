<template>
  <div class="login-info text-white animated fadeInLeft">
    <p class="login-logo" style="background: none; box-shadow: none;"><img :src="imgSrc"></p>
    <h2 class="login-info-title" style="display: none;">Welcome to</h2>
    <p class="system-name">{{ projectName }}</p>
    <h2 class="login-info-title">process management system</h2>
  </div>
</template>
<script>

export default {
  data () {
    return {
      imgSrc: '',
      projectName: ''
    }
  },
  watch: {},
  mounted () {
    this.configLogin()
  },
  methods: {
    // 登录配置
    configLogin () {
      // let flag = process.env.VUE_APP_ENVIRONMENT_CONFIG == 'scene'
      // 默认加载生产环境配置
      this.imgSrc = require(process.env.VUE_APP_LOGIN_IMG)
      this.projectName = this.$t(process.env.VUE_APP_COMPANY)
      // if (flag) {
      //   // 现场环境配置
      //   this.imgSrc = require(process.env.VUE_APP_HN_LOGIN_IMG)
      //   this.projectName = this.$t('common.systemName')
      // }
    }
  }
}
</script>
<style>
.login-info-title {
  text-transform: uppercase;
  font-size: 24px;
  text-align: center;
  width: 100%;
  font-style: unset;
  letter-spacing: 3px;
  line-height: 60px;
  margin: 0;
  position: fixed;
  top: 28vh;
  left: 0;
  color: #777;
  font-weight: normal;
}
.system-name {
  font-size: 60px;
  font-weight: bold;
  margin: 0;
  position: fixed;
  top: 20vh;
  left: 0;
  width: 100%;
  color: #2b7fd0;
  text-align: center;
}
.login-logo {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  background: #fff;
  padding: 16px 30px;
  margin: 0;
  box-shadow: 0 10px 10px 0 rgba(0, 0, 0, 0.24);
}
.login-logo img {
  height: auto;
  width: auto;
  max-width: 450px;
  max-height: 60px;
}
.login-container .login-border {
  background: none;
}
.login-main {
  position: relative;
  z-index: 10;
  padding: 30px 40px;
  position: fixed;
  left: 50%;
  top: 40vh;
  margin-left: -225px;
}
.login-main:before {
  content: "";
  display: block;
  border: 20px solid rgba(0, 0, 0, 0.12);
  width: 100%;
  height: 100%;
  position: absolute;
  left: -20px;
  top: -20px;
  border-radius: 4px;
}
.login-title-container .title {
  display: none;
}
.login-form .el-input__inner {
  text-align: left;
}
.el-form-item__content .el-form-item__error {
  left: 0;
  top: 32px;
}
.login-bottom-container {
  display: none;
}
.login-container {
  background: none;
}
.login-container::before {
  background-size: 100% 100%;
}
@media screen and (max-width: 1600px) {
  .system-name {
    font-size: 50px;
  }
}
@media screen and (max-width: 1440px) {
  .login-logo {
    position: fixed;
  }
  .login-logo img {
    height: auto;
    width: auto;
    max-width: 350px;
    max-height: 60px;
  }
  .login-info-title {
    font-size: 18px;
    margin-bottom: 0;
  }
  .system-name {
    font-size: 48px;
    font-weight: bold;
    margin: 0;
  }
  .login-main {
    margin-right: 100px;
    padding: 20px 30px;
    width: 400px;
    margin-left: -200px;
  }
}
</style>
