<template>
  <div>
    <!--  svg 方式 -->
    <!-- {{system.logoType}} -->
    <div v-if="system.logoType ==='svg'" class="logo-group-icon">
      <ibps-icon-svg :size="logoSize" :name="system.logo||'logo'" :title="system.name" class="ibps-pr-5" />
      <div v-if="!asideCollapse" class="logo-title ibps-ellipsis" style="width:auto;">>{{ system.name }}</div>
      <i v-if="subsystemList && subsystemList.length >1 " class="el-icon-arrow-down el-icon--right" />
    </div>
    <!-- 图片方式-->
    <!--<div v-if="system.logoType ==='image'" class="logo-group-image">
      <img :src="asideCollapse?logoIconOnly:logoIconAll" :class="['logo-group-image--'+(asideCollapse?'collapse':'expand')]">
      <i v-if="subsystemList && subsystemList.length >1 " class="el-icon-arrow-down el-icon--right" />
    </div>-->
    <!--  icon 方式  -->
    <div v-else class="logo-group-icon">
      <ibps-icon :name="system.logo||'logo'" :size="logoSize" :title="system.name" class="ibps-pr-5" />
      <p class="header-logo">
        <img :src="imgSrc">
        <span class="company">{{ projectName }}</span>
      </p>
      <div v-if="!asideCollapse" class="logo-title ibps-ellipsis" style="width:auto;">{{ system.name }}</div>
      <i v-if="subsystemList && subsystemList.length >1 " class="el-icon-arrow-down el-icon--right" />
    </div>

  </div>
</template>
<script>
export default {
  props: {
    system: Object,
    asideCollapse: Boolean,
    subsystemList: Array,
    themeName: String
  },
  data () {
    return {
      imgSrc: '',
      projectName: ''
    }
  },
  computed: {
    logoSize () {
      return this.asideCollapse ? 32 : 26
    },
    logoIconAll () {
      return `${this.$baseUrl}images/theme/${this.themeName}/all.png`
    },
    logoIconOnly () {
      return `${this.$baseUrl}images/theme/${this.themeName}/only.png`
    }
  },
  created () {
    this.configLogin()
  },
  methods: {
    // 登录配置
    configLogin () {
      // let flag = process.env.VUE_APP_ENVIRONMENT_CONFIG == 'scene'
      // 默认加载生产环境配置
      this.imgSrc = require(process.env.VUE_APP_IMG)
      this.projectName = this.$t(process.env.VUE_APP_COMPANY)
      // if (flag) {
      //   // 现场环境配置
      //   this.imgSrc = require(process.env.VUE_APP_HN_IMG)
      //   this.projectName = this.$t('common.company')
      // }
    }
  }
}
</script>
