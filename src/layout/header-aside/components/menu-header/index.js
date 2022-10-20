
import { throttle } from 'lodash'
import { mapState } from 'vuex'
import menuMixin from '../mixin/menu'
import { createMenu } from '../libs/util.menu'

export default {
  name: 'ibps-layout-header-aside-menu-header',
  mixins: [
    menuMixin
  ],

  data() {
    return {
      active: this.activeHeader,
      isScroll: false,
      scrollWidth: 0,
      contentWidth: 0,
      currentTranslateX: 0,
      throttledCheckScroll: null
    }
  },
  computed: {
    ...mapState('ibps/menu', [
      'activeHeader',
      'header'
    ])
  },
  watch: {
    'activeHeader': {
      handler(val) {
        this.active = this.activeHeader
      },
      immediate: true
    }
    // '$route.matched': {
    //   handler(val) {
    //     this.active = val[val.length - 1].path
    //   },
    //   immediate: true
    // }
  },
  mounted() {
    // 初始化判断
    // 默认判断父元素和子元素的大小，以确定初始情况是否显示滚动
    window.addEventListener('load', this.checkScroll)
    // 全局窗口变化监听，判断父元素和子元素的大小，从而控制isScroll的开关
    this.throttledCheckScroll = throttle(this.checkScroll, 300)
    window.addEventListener('resize', this.throttledCheckScroll)
    // 初始化延迟以确定初始情况是否显示滚动
    this.$nextTick(() => {
      setTimeout(() => {
        this.checkScroll()
      }, 500)
    })
  },
  beforeDestroy() {
    // 取消监听
    window.removeEventListener('resize', this.throttledCheckScroll)
    window.removeEventListener('load', this.checkScroll)
  },
  methods: {
    scroll(direction) {
      if (direction === 'left') {
        // 向右滚动
        this.currentTranslateX = 0
      } else {
        // 向左滚动
        if (this.contentWidth * 2 - this.currentTranslateX <= this.scrollWidth) {
          this.currentTranslateX -= this.contentWidth
        } else {
          this.currentTranslateX = this.contentWidth - this.scrollWidth
        }
      }
    },
    checkScroll() {
		if(!this.$refs.content || !this.$refs.content.clientWidth || !this.$refs.scroll || !this.$refs.scroll.clientWidth){
			return
		}
      let contentWidth = this.$refs.content.clientWidth
      let scrollWidth = this.$refs.scroll.clientWidth
      if (this.isScroll) {
        // 页面依旧允许滚动的情况，需要更新width
        if (this.contentWidth - this.scrollWidth === this.currentTranslateX) {
          // currentTranslateX 也需要相应变化【在右端到头的情况时】
          this.currentTranslateX = contentWidth - scrollWidth
          // 快速的滑动依旧存在判断和计算时对应的contentWidth变成正数，所以需要限制一下
          if (this.currentTranslateX > 0) {
            this.currentTranslateX = 0
          }
        }
        // 更新元素数据
        this.contentWidth = contentWidth
        this.scrollWidth = scrollWidth
        // 判断何时滚动消失: 当scroll > content
        if (contentWidth > scrollWidth) {
          this.isScroll = false
        }
      }
      // 判断何时滚动出现: 当scroll < content
      if (!this.isScroll && contentWidth < scrollWidth) {
        this.isScroll = true
        // 注意，当isScroll变为true，对应的元素盒子大小会发生变化
        this.$nextTick(() => {
          contentWidth = this.$refs.content.clientWidth
          scrollWidth = this.$refs.scroll.clientWidth
          this.contentWidth = contentWidth
          this.scrollWidth = scrollWidth
          this.currentTranslateX = 0
        })
      }
    }
  },
  render(h) {
    return <div
      flex='cross:center'
      class={ { 'ibps-theme-header-menu': true, 'is-scrollable': this.isScroll } }
      ref='page'>
      <div
        ref='content'
        class='ibps-theme-header-menu__content'
        flex-box='1'
        flex>
        <div
          class='ibps-theme-header-menu__scroll'
          flex-box='0'
          style={ { transform: `translateX(${this.currentTranslateX}px)` } }
          ref='scroll'>
          <el-menu
            mode='horizontal'
            defaultActive={ this.active }
            onSelect={ this.handleHeaderMenuSelect }>
            { this.header.map(menu => createMenu.call(this, h, menu, 'header')) }
          </el-menu>
        </div>
      </div>
      {
        this.isScroll
          ? [
            <div
              class='ibps-theme-header-menu__prev'
              flex='main:center cross:center'
              flex-box='0'
              onClick={ () => this.scroll('left') }>
              <i class='el-icon-arrow-left'></i>
            </div>,
            <div
              class='ibps-theme-header-menu__next'
              flex='main:center cross:center'
              flex-box='0'
              onClick={ () => this.scroll('right') }>
              <i class='el-icon-arrow-right'></i>
            </div>
          ]
          : []
      }
    </div>
  }
}
