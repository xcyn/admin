<template>
  <div class="home">
    <div class="home-box">
      <div>
        <div class="marquee">
          <div class="marquee_box">
            <ul
              ref="marqueeList"
              class="marquee_list"
              :class="{marquee_top:animate}"
              :style="{'margin-top':animate? -clientHeight + 'px':0}"
              @mouseenter="enter"
              @mouseleave="leave"
            >
              <li v-for="(item, index) in announcementArr" :key="index" ref="marqueeListLi" @click="click(item)">
                <el-row>
                  <el-col :span="18">
                    <slot name="title" :row="item" />
                  </el-col>
                  <el-col :span="6">
                    <slot name="extra" :row="item" />
                  </el-col>
                </el-row>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Home',
  props: {
    data: Array,
    interval: {
      type: Number,
      default: 2
    },
    activeName: {
      type: String,
      default: ''
    },
    name: String,
    isTrottingHorseLamp: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      announcementArr: this.data,
      animate: false,
      intervalAction: null,
      clientHeight: ''
    }
  },
  watch: {
    animate: {
      handler: function() {
        this.computationalFormat()
      },
      immediate: true
    },
    activeName: {
      handler: function(val, oldVal) {
        if (!this.isTrottingHorseLamp) return
        clearInterval(this.intervalAction)
        if (val !== '') {
        // tab类型时的处理方式，同时处理重复渲染导致多次触发定时器的问题。
          if (val === this.name) {
            clearInterval(this.intervalAction)
            this.intervalAction = setInterval(this.showMarquee, this.interval * 1000)
          }
        } else {
          clearInterval(this.intervalAction)
          this.intervalAction = setInterval(this.showMarquee, this.interval * 1000)
        }
      },
      immediate: true
    },
    data: {
      handler: function(val) {
        this.announcementArr = val
      },
      immediate: true,
      deep: true
    }
  },
  beforeDestroy() {
    if (this.intervalAction) {
      clearInterval(this.intervalAction)
      this.intervalAction = null
    }
    this.announcementArr = null
  },
  methods: {
    computationalFormat() {
      // 内容li高度自动获取
      const marqueeListLi = this.$refs['marqueeListLi'] ? this.$refs['marqueeListLi'] : null
      this.clientHeight = marqueeListLi && this.animate ? marqueeListLi[0].clientHeight : 0
    },
    enter() {
      clearInterval(this.intervalAction)
    },
    leave() {
      if (!this.isTrottingHorseLamp) return
      clearInterval(this.intervalAction)
      this.intervalAction = setInterval(this.showMarquee, this.interval * 1000)
    },
    click(item) {
      this.$emit('click', item)
    },
    showMarquee: function() {
      this.animate = true
      setTimeout(() => {
        if (this.announcementArr) {
          this.announcementArr.push(this.announcementArr[0])
          this.announcementArr.shift()
        }
        this.animate = false
      }, (this.interval / 2) * 1000)
    }
  }
}
</script>
<style lang="scss">
.home {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.home-box {
    width: 100%;
    height: 100%;
    >div{
      height: 100%;
    }
}
.marquee {
    width: 100%;
    height: 100%;
    align-items: center;
    color: #3A3A3A;
    display: flex;
    box-sizing: border-box;
}

.marquee_box {
    display: block;
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.marquee_list {
    margin: 0 ;
    width: 100%;
    display: block;
    position: absolute;
    top: -10px;
    left: -40px;
}

.marquee_top {
    transition: all 0.5s;
}

.marquee_list li {
    // height: 30px;
    line-height: 35px;
    font-size: 12px;
}
 .marquee_list li span {
  display: block;
  width: 100%;
}
</style>
