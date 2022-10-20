<template>
  <div :style="styleLayoutMainGroup" :class="{ grayMode: grayActive }" class="ibps-layout-header-aside-group hidden-print">
    <!-- 半透明遮罩 -->
    <div class="ibps-layout-header-aside-mask" />
    <!-- websocket -->
    <!-- <ibps-notify-monitor /> -->
    <!-- 主体内容 -->
    <div class="ibps-layout-header-aside-content" flex="dir:top">
      <!-- 顶栏 -->
      <div
        :style="{
          opacity: searchActive ? 0.5 : 1
        }"
        class="ibps-theme-header"
        flex-box="0"
        flex
      >
        <div :class="{ 'logo-group': true, 'logo-transition': asideTransition, 'ibps-pt-5': system.logoType === 'image', 'ibps-pl-0': system.logoType === 'image' }" :style="{ width: 'auto' }" flex-box="0">
          <!--logo-->
          <el-dropdown v-if="subsystemList && subsystemList.length > 1" trigger="click" placement="bottom-end" @command="command => handleSubsystemClick(command)">
            <ibps-logo :system="system" :aside-collapse="asideCollapse" :subsystem-list="subsystemList" :theme-name="themeActiveSetting ? themeActiveSetting.name : 'ibps'" />
            <el-dropdown-menu slot="dropdown" style="width: 180px">
              <el-dropdown-item v-for="(item, index) in subsystemList" :key="index" :disabled="item.id === system.id" :command="item"> <ibps-icon :name="item.logo || 'logo'" :title="item.name" /> {{ item.name }} </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <ibps-logo v-else :system="system" :aside-collapse="asideCollapse" :subsystem-list="subsystemList" :theme-name="themeActiveSetting ? themeActiveSetting.name : 'ibps'" />
        </div>
        <div class="toggle-aside-btn" flex-box="0" @click="handleToggleAside">
          <ibps-icon :name="asideCollapse ? 'indent' : 'outdent'" />
        </div>
        <ibps-menu-header flex-box="1" />
        <!-- 顶栏右侧 -->
        <div class="ibps-header-right" flex-box="0">
          <!-- 如果你只想在开发环境显示这个按钮请添加 v-if="$nodeEnv === 'development'" -->
          <ibps-header-search @click="handleSearchClick" />
          <!-- <ibps-header-error-log v-if="$nodeEnv === 'development'" />
          <ibps-header-base-url v-if="$nodeEnv === 'development'" /> -->
          <ibps-header-message />
          <!-- <ibps-header-download /> -->
          <!-- <ibps-header-locking />
          <ibps-header-theme />
          <ibps-header-language />
          <ibps-header-size /> -->
          <ibps-header-fullscreen />
          <!-- <ibps-header-tenant /> -->
          <ibps-header-user />
          <!-- <ibps-header-setting /> -->
        </div>
      </div>
      <!-- 下面 主体 -->
      <div class="ibps-theme-container" flex-box="1" flex>
        <!-- 主体 侧边栏 -->
        <div
          ref="aside"
          flex-box="0"
          :class="{ 'ibps-theme-container-aside': true, 'ibps-theme-container-transition': asideTransition }"
          :style="{
            width: asideCollapse ? asideWidthCollapse : asideWidth,
            opacity: searchActive ? 0.5 : 1
          }"
        >
          <ibps-menu-side />
        </div>
        <!-- 主体 -->
        <div class="ibps-theme-container-main" flex-box="1" flex>
          <!-- 搜索 -->
          <transition name="fade-scale">
            <div v-show="searchActive" class="ibps-theme-container-main-layer" flex>
              <ibps-panel-search ref="panelSearch" @close="searchPanelClose" />
            </div>
          </transition>
          <!-- 内容 -->
          <transition name="fade-scale">
            <div v-show="!searchActive" class="ibps-theme-container-main-layer" flex="dir:top">
              <!-- tab -->
              <div class="ibps-theme-container-main-header" flex-box="0">
                <ibps-tabs />
              </div>
              <!-- 页面 -->
              <div class="ibps-theme-container-main-body" flex-box="1">
                <transition :name="transitionActive ? 'fade-transverse' : ''">
                  <keep-alive :include="keepAlive">
                    <div>
                      <div id="child"></div>
                      <router-view :key="routerViewKey" />
                    </div>
                  </keep-alive>
                </transition>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
    <CpNotification></CpNotification>
  </div>
</template>
<script>
import CpNotification from "@/components/cpComponents/notification/CpNotification"
import IbpsLogo from "./components/logo"
import IbpsMenuSide from "./components/menu-side/index.js"
import IbpsMenuHeader from "./components/menu-header/index.js"
import IbpsTabs from "./components/tabs"
import IbpsHeaderSearch from "./components/header-search"
import IbpsHeaderFullscreen from "./components/header-fullscreen"
// import IbpsHeaderLocking from './components/header-locking'
// import IbpsHeaderLanguage from './components/header-language'
// import IbpsHeaderSize from './components/header-size'
// import IbpsHeaderTheme from './components/header-theme'
// import IbpsHeaderToolbar from './components/header-toolbar'
// import IbpsHeaderTenant from './components/header-tenant'
import IbpsHeaderSetting from "./components/header-setting"
import IbpsHeaderMessage from "./components/header-message"
import IbpsHeaderUser from "./components/header-user"
// import IbpsHeaderErrorLog from './components/header-error-log'
// import IbpsHeaderBaseUrl from './components/header-base-url'
// import IbpsHeaderDownload from './components/header-download'
// import IbpsNotifyMonitor from '@/business/platform/socket/notify-monitor'
import { Notification } from "element-ui"
import { mapState, mapGetters, mapActions } from "vuex"
import mixinSearch from "./mixins/search"
import mixinLock from "./mixins/lock"
import Template from "@/business/platform/form/form-print/template"
export default {
  name: "IbpsLayoutHeaderAside",
  components: {
    Template,
    IbpsLogo,
    IbpsMenuSide,
    IbpsMenuHeader,
    IbpsTabs,
    IbpsHeaderSearch,
    IbpsHeaderFullscreen,
    // IbpsHeaderLocking,
    // IbpsHeaderLanguage,
    // IbpsHeaderSize,
    // IbpsHeaderTheme,
    // IbpsHeaderToolbar,
    // IbpsHeaderTenant,
    IbpsHeaderSetting,
    IbpsHeaderMessage,
    IbpsHeaderUser,
    CpNotification
    // IbpsHeaderErrorLog,
    // IbpsHeaderBaseUrl
    // IbpsHeaderDownload,
    // IbpsNotifyMonitor
  },
  mixins: [mixinSearch, mixinLock],
  data() {
    return {
      // [侧边栏宽度] 正常状态
      asideWidth: "200px",
      // [侧边栏宽度] 折叠状态
      asideWidthCollapse: "65px",
      isShow: false
    }
  },
  computed: {
    ...mapState("ibps", {
      keepAlive: state => state.page.keepAlive,
      noKeepAlive: state => state.page.noKeepAlive,
      grayActive: state => state.gray.active,
      transitionActive: state => state.transition.active,
      asideCollapse: state => state.menu.asideCollapse,
      asideTransition: state => state.menu.asideTransition,
      system: state => state.system.system,
      subsystemList: state => state.system.subsystemList
    }),
    ...mapGetters("ibps", {
      themeActiveSetting: "theme/activeSetting"
    }),
    /**
     * @description 用来实现带参路由的缓存
     */
    routerViewKey() {
      // 默认情况下 key 类似 __transition-n-/foo
      // 这里的字符串操作是为了最终 key 的格式和原来相同 类似 __transition-n-__stamp-time-/foo
      const stamp = this.$route.meta[`__stamp-${this.$route.fullPath}`] || ""
      return `${stamp ? `__stamp-${stamp}-` : ""}${this.$route.fullPath}`
    },
    /**
    /**
     * @description 最外层容器的背景图片样式
     */
    styleLayoutMainGroup() {
      return {
        ...(this.themeActiveSetting.backgroundImage
          ? {
              backgroundImage: `url('${this.$baseUrl}${this.themeActiveSetting.backgroundImage}')`
            }
          : {})
      }
    }
  },
  methods: {
    ...mapActions("ibps/menu", ["asideCollapseToggle"]),
    /**
     * 接收点击切换侧边栏的按钮
     */
    handleToggleAside() {
      this.asideCollapseToggle()
    },
    handleSubsystemClick(system) {
      this.$store.dispatch("ibps/system/set", system)
      window.location.href = this.$baseUrl
      // location.reload() // 为了重新实例化vue-router对象 避免bug
    }
  }
}
</script>
<style lang="scss">
// 注册主题
@import "~@/assets/styles/theme/register.scss";
</style>
