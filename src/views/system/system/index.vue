<template>
  <div class="ibps-login-select-system login-container pull-height" :style="{backgroundImage: 'url(' + loginImg + ')', left: '0',top: '0',backgroundSize:'100% 100%'}">
    <login-info />
    <div class="login-border pull-height">
      <div class="login-main animated fadeIn">
        <div class="login-title-container">
          <h3 class="title"><i class="ibps-icon-logo" />{{ $t('system.login.title') }}</h3>

        </div>
        <h3><span class="title">{{ $t('system.login.selectSystem') }}</span></h3>
        <el-table
          ref="elTable"
          :data="subsystemList"
          :show-header="false"
          :empty-text="'当前用户没有权限访问系统，请与管理员联系'"
          border
          size="medium"
          @cell-click="onClick"
        >
          <el-table-column :label="$t('system.login.selectSystem')">
            <div slot-scope="scope" class="logo-group-icon ibps-ellipsis">
              <i
                :class="'ibps-icon-'+scope.row.logo"
                class="ibps-icon"
              />
              <span class="logo-title ibps-pl-5">{{ scope.row.name }} </span>
            </div>
          </el-table-column>
        </el-table>
        <br>
        <el-row :span="24">
          <el-col :offset="16" :span="8">
            <el-button
              type="info"
              icon="ibps-icon-sign-out"
              class="login-submit"
              @click.native.prevent="handleLogout"
            >{{ $t('system.login.logOut') }}</el-button>
          </el-col>
        </el-row>
        <br>
        <login-bottom />
      </div>
    </div>

  </div>
</template>
<script>
import '@/assets/styles/pages/login.scss'

import { mapActions, mapState } from 'vuex'
import LoginInfo from '../login/login-info'
import LoginBottom from '../login/login-bottom'

export default {
  name: 'SystemSelect',
  components: {
    LoginInfo,
    LoginBottom
  },
  computed: {
    ...mapState({
      subsystemList: state => state.ibps.system.subsystemList
    })
  },
  data() {
    return {
      loginImg: ''
    }
  },
  mounted() {
    this.loginImg = require(process.env.VUE_APP_LOGIN_BACKGROUND_IMG)
    this.$nextTick(() => {
      this.$refs.elTable.doLayout()
    })
  },
  methods: {
    ...mapActions('ibps/account', [
      'logout'
    ]),
    onClick(item) {
      const loading = this.$loading({
        lock: true,
        text: this.$t('common.loading'),
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.$store.dispatch('ibps/system/set', item)
      this.$router.push({ path: '/dashboard' })
      // 延迟10秒关闭遮盖层
      setTimeout(() => {
        loading.close()
      }, 3000)
    },
    handleLogout() {
      this.logout({
        vm: this,
        confirm: true
      })
    }
  }
}
</script>
<style lang="scss">
  .ibps-login-select-system{
    .el-table__empty-text{
      width: 100%;
    }
  }
</style>
