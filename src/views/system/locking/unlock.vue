
<template>
  <transition name="show-unlock">
    <div v-if="showUnlock" class="unlock-body-con" @keydown.enter="handleUnlock">
      <div :style="{marginLeft: avatarLeft}" class="unlock-avatar-con" @click="handleClickAvatar">
        <el-avatar
          :src="avatar"
          :text="userName"
          shape="square"
          class="unlock-avatar-img"
          @error="errorImageHandler"
        >
          <img :src="errorImage">
        </el-avatar>
        <div class="unlock-avatar-cover">
          <span><i class="ibps-icon-unlock" /></span>
          <p>{{ $t('components.lock.unlock') }}</p>
        </div>
      </div>
      <div :style="{marginLeft: avatarLeft}" class="unlock-avatar-under-back" />
      <div class="unlock-input-con">
        <div class="unlock-input-overflow-con">
          <div :style="{right: inputLeft}" class="unlock-overflow-body">
            <input ref="inputEle" v-model="password" :placeholder="$t('components.lock.placeholder')" class="unlock-input" autocomplete="false" type="password">
            <button ref="unlockBtn" class="unlock-btn" @mousedown="unlockMousedown" @mouseup="unlockMouseup" @click="handleUnlock">
              <i class="ibps-icon-key" />
            </button>
          </div>
        </div>
      </div>
      <div class="unlock-locking-tip-con logo-title">{{ $t('components.lock.locked') }}</div>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex'
import hotkeys from 'hotkeys-js'
import { getFile } from '@/business/platform/file/utils/avatar'
import setting from '@/setting.js'

export default {
  name: 'Unlock',
  props: {
    showUnlock: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      open: false,
      avatarLeft: '0px',
      inputLeft: '400px',
      password: '',
      check: null
    }
  },
  computed: {
    ...mapState('ibps/user', [
      'info'
    ]),
    avatar() {
      const photo = this.info && this.info.employee ? this.info.employee.photo : null
      if (this.$utils.isEmpty(photo)) {
        return this.errorImage
      }
      return getFile(photo)
    },
    errorImage() {
      return this.$baseUrl + setting.userInfo.user.photo
    },
    userName() {
      return this.info && this.info.user ? this.info.user.fullname : ''
    }
  },
  mounted() {
    // ???????????????????????????
    hotkeys('Enter', event => {
      event.preventDefault()
      this.handleEnter()
    })
  },
  beforeDestroy() {
    hotkeys.unbind('Enter')
  },
  methods: {
    errorImageHandler() {
      return false
    },
    validator() {
      if (this.password === '') { return false }
      return true // TODO: ???????????????????????????????????????????????????ajax??????????????????????????????this.password??????????????????????????????
    },
    handleEnter() {
      if (this.open) {
        this.handleUnlock()
      } else {
        this.handleClickAvatar()
      }
    },
    handleClickAvatar() {
      this.open = true
      this.avatarLeft = '-180px'
      this.inputLeft = '0px'
      if (this.$refs && this.$refs.inputEle) {
        this.$refs.inputEle.focus()
      }
    },

    handleUnlock() {
      if (this.validator()) {
        this.open = false
        this.avatarLeft = '0px'
        this.inputLeft = '400px'
        this.password = ''
        this.$utils.cookies.set('locking', 'unlock')
        this.$emit('on-unlock')
      } else {
        this.$message({
          message: this.$t('components.lock.tip'),
          type: 'error'
        })
      }
    },
    unlockMousedown() {
      this.$refs.unlockBtn.className = 'unlock-btn click-unlock-btn'
    },
    unlockMouseup() {
      this.$refs.unlockBtn.className = 'unlock-btn'
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/assets/styles/pages/unlock.scss'
</style>
