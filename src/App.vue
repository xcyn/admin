<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
import { mapActions } from "vuex"
import { logout } from "@/api/oauth2/user"
import { getToken, setLang } from "@/utils/auth"
export default {
  name: "App",
  watch: {
    "$i18n.locale": "i18nHandle"
  },
  created() {
    this.i18nHandle(this.$i18n.locale)
    window.addEventListener("beforeunload", e => this.beforeunloadHandler(e))
    window.addEventListener("unload", e => this.unloadHandler(e))
  },
  destroyed() {
    window.removeEventListener("beforeunload", e => this.beforeunloadHandler(e))
    window.removeEventListener("unload", e => this.unloadHandler(e))
  },
  mounted() {
    // 清除缓存的设置租户ID
    this.setDesignTenantid("")
  },
  methods: {
    ...mapActions({
      setDesignTenantid: "ibps/user/setDesignTenantid"
    }),
    i18nHandle(val, oldVal) {
      setLang(val)
      document.querySelector("html").setAttribute("lang", val)
    },
    beforeunloadHandler() {
      this.beforeUnloadTime = new Date().getTime()
    },
    unloadHandler(e) {
      this.gapTime = new Date().getTime() - this.beforeUnloadTime
      // 判断是窗口关闭还是刷新
      if (this.gapTime <= 5) {
        const token = getToken()
        logout(token)
      }
    }
  }
}
</script>
<style lang="scss">
@import "~@/assets/styles/public-class.scss";
@import "~@/assets/styles/sys.scss";
@import "~@/assets/cpStyle/style/yj-layout.scss";
@import "~@/assets/cpStyle/style/jianxiu.scss";
@import "~@/assets/cpStyle/style/common.scss";
@import "~@/assets/cpStyle/style/main.css";
@import "~@/assets/cpStyle/style/dialog.css";
@import "~@/assets/cpStyle/style/table.css";
@import "~@/assets/cpStyle/style/search.css";
@import "~@/assets/cpStyle/style/form.css";
</style>
