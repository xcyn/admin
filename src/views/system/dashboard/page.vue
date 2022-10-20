<template>
  <ibps-container ref="dashboardContainer" v-loading="loading" :element-loading-text="$t('common.loading')"
                  :scroll-delay="scrollDelay" type="full" class="ibps-desktop-page"
                  @scroll="({x, y}) => { scrollTop = y }"
  >
    <template v-if="initLoading">
      <template v-if="localSystem">
        <ibps-grid-layout v-if="layout && layout.length >0" :layout.sync="layout" :col-num="colNum"
                          :row-height="rowHeight" :is-draggable="isDraggable" :is-resizable="isResizable"
                          :is-mirrored="isMirrored" :vertical-compact="verticalCompact" :margin="margin"
                          :use-css-transforms="useCssTransforms"
        >
          <ibps-grid-item v-for="(item,index) in layout" :key="item.i" :x="item.x" :y="item.y" :w="item.w" :h="item.h"
                          :i="item.i"
          >
            <component :is="'ibps-desktop-'+item.alias" v-if="hasComponent(item.alias)" :id="item.i" :ref="item.alias"
                       :alias="item.alias" :height="getHeight(item.h)"
                       @action-event="(command,data)=> handleActionEvent(command,data,index)"
            />
          </ibps-grid-item>
        </ibps-grid-layout>
        <el-alert v-else-if="!loading" :closable="false" type="warning" show-icon style="height:50px">
          <span slot="title">
            未设置个人桌面布局，可以通过“<a href="javascript:void(0)" @click="goMyLayout">个人办公-》个人桌面布局</a>”进行设置
          </span>
        </el-alert>
      </template>
      <!--不是本地系统-->
      <template v-else>
        <!--iframe方式-->
        <iframe v-if="systemUrlType === 'iframe'" ref="systemrender" class="ibps-container-frame" frameborder="0"/>
        <!--vue组件方式-->
        <component :is="systemUrlName" v-else ref="systemrender" v-bind="systemUrlParams"/>

      </template>
    </template>
    <ibps-back-to-top :visibility-height="150" :scroll-top="scrollTop" transition-name="fade"
                      @scroll-to-top="scrollToTop"
    />
    <preview :id="id" :visible="dialogPreviewVisible" title="全屏预览" screen
             @close="visible => dialogPreviewVisible = visible"
    />
    <bpmn-formrender :visible="bpmnFormrenderDialogVisible" :def-id="defId" :task-id="taskId" :instance-id="instanceId"
                     @close="visible => bpmnFormrenderDialogVisible = visible" @callback="handleFlowCallback"
    />

    <ibps-news-dialog :id="newsEditId" title="公告栏目明细" :visible="ibpsNewsDialogVisible" :readonly="true"
                      @close="visible => ibpsNewsDialogVisible = visible"
    />

    <ibps-message-dialog :id="messageEditId" title="消息明细" :readonly="true" :visible="ibpsMessageDialogVisible"
                         @close="visible => ibpsMessageDialogVisible = visible"
    />

  </ibps-container>
</template>

<script>

import { getMyDesktop } from '@/api/platform/desktop/myLayout'
import { initColumn, isInit, getComponents } from './components'
//  网格布局组件
import { GridLayout, GridItem } from 'vue-grid-layout'
import IbpsBackToTop from '@/components/ibps-back-to-top'
import Preview from '@/views/platform/desktop/column/preview'
import BpmnFormrender from '@/business/platform/bpmn/form/dialog'

import IbpsNewsDialog from '@/views/platform/system/news/detail'
import IbpsMessageDialog from '@/views/platform/message/inner/detail/dialog'

const _import = require('@/utils/util.import.' + process.env.NODE_ENV)

export default {
  components: {
    'ibps-news-dialog': IbpsNewsDialog,
    'ibps-message-dialog': IbpsMessageDialog,
    IbpsBackToTop,
    Preview,
    BpmnFormrender,
    'ibps-grid-layout': GridLayout,
    'ibps-grid-item': GridItem
  },
  data() {
    return {
      layout: null,
      colNum: 24,
      rowHeight: 30,
      isDraggable: false,
      isResizable: false,
      isMirrored: false,
      verticalCompact: true,
      margin: [5, 5],
      useCssTransforms: true,

      ibpsNewsDialogVisible: false,
      newsEditId: '',

      ibpsMessageDialogVisible: false,
      messageEditId: '',

      scrollDelay: 0,
      scrollTop: 0,
      initLoading: false,
      loading: false,
      id: '',
      dialogPreviewVisible: false, // 预览
      defaultData: [],

      bpmnFormrenderDialogVisible: false, // 流程
      defId: '',
      taskId: '',
      instanceId: '',
      layoutIndex: '',

      systemUrlType: 'iframe',
      systemUrlName: '',
      systemUrlParams: {},
      alias: ''

    }
  },
  computed: {
    system() {
      return this.$store.getters.system ? this.$store.getters.system : null
    },
    systemAlias() {
      return this.$store.getters.system ? this.$store.getters.system.alias : ''
    },
    localSystem() {
      return this.system.isLocal
    }
  },
  mounted() {
    this.initLoading = false
    this.initData()
  },
  methods: {
    scrollToTop() {
      this.$refs.dashboardContainer.scrollToTop()
    },
    initData() {
      const initInterval = setInterval(() => {
        if (this.$utils.isNotEmpty(this.systemAlias)) {
          this.initLoading = true
          try {
            if (this.localSystem) {
              this.fetchData()
            } else {
              this.initSystemUrl(this.system.homePage)
            }

            // 单点登录，默认选中处理
            this.defaultOpenPage()
          } catch (error) {
            clearInterval(initInterval)
          }

          clearInterval(initInterval)
        }
      }, 100)
    },
    // 抓取数据
    fetchData() {
      initColumn(this.systemAlias)
      this.loading = true
      const interval = setInterval(() => {
        if (isInit()) {
          getMyDesktop({
            systemAlias: this.systemAlias
          }).then(response => {
            try {
              this.layout = this.$utils.parseData(response.data)
              this.defaultData = this.$utils.parseData(response.data)
            } catch (error) {
              console.error(error)
              this.layout = []
              this.defaultData = []
              clearInterval(interval)
            }
            this.loading = false
          }).catch(() => {
            this.loading = false
            clearInterval(interval)
          })
          clearInterval(interval)
        }
      }, 100)
    },
    getHeight(h) {
      return (h - 1) * (this.rowHeight + this.margin[1]) + this.margin[1]
    },
    hasComponent(alias) {
      const name = 'ibps-desktop-' + alias
      const components = getComponents()
      if (components) {
        return components.includes(name)
      } else {
        return false
      }
    },
    resizedHandler(i, newH, newW, newHPx, newWPx) {
      if (!this.layout) return
      this.layout.layout.find((n) => {
        if (i === n.i) {
          n.widthPx = this.getWidth(n.w)
          n.heightPx = this.getHeight(n.h)
        }
      })
    },
    goMyLayout() {
      this.$router.push({
        path: '/officeDesk/desktopMyLayout'
      })
    },
    handleActionEvent(command, params, index) {
      this.layoutIndex = index
      this.alias = params.$alias
      switch (command) {
        case 'fullscreen':
          this.handleFullscreen(params.id)
          break
        case 'collapse':
        case 'expansion':
          this.handleCollapseExpansion(index, command === 'collapse')
          break
        case 'flow':
          this.handleFlow(params)
          break
        case 'approve':
          this.handleApprove(params)
          break
        case 'unRead':
          this.handleUnreadMessage(params)
          break

        default:
          break
      }
    },
    /**
     * 全屏展示切换
     */
    handleFullscreen(id) {
      this.dialogPreviewVisible = true
      this.id = id
    },
    // 处理收缩/展开
    handleCollapseExpansion(index, isCollapse) {
      this.layout[index].h = isCollapse ? 2 : this.defaultData[index].h
      this.layout.push({ i: '0' })
      const deleteIndex = this.layout.findIndex(item => item.i === '0')
      this.layout.splice(deleteIndex, 1)
    },

    handleApprove(id) {
      this.ibpsNewsDialogVisible = true
      this.newsEditId = id
    },

    handleUnreadMessage(id) {
      this.ibpsMessageDialogVisible = true
      this.messageEditId = id
    },

    handleFlow(params) {
      this.defId = params.defId || null
      this.taskId = params.taskId || null
      this.instanceId = params.instanceId || null

      this.instanceId = params.instanceId || null
      this.instanceId = params.instanceId || null

      this.bpmnFormrenderDialogVisible = true
    },
    handleFlowCallback() {
      this.$refs[this.alias] ? this.$refs[this.alias][0].refreshData() : null
    },

    //
    initSystemUrl(url) {
      if (url.startsWith('http')) {
        this.systemUrlType = 'iframe'
        this.$nextTick(() => {
          this.$refs.systemrender.src = url
          // 传递消息
          // this.$refs.systemrender.contentWindow.postMessage({ data: this.attributes }, '*')
        })
      } else {
        const component = url.split('?')[0]
        this.systemUrlParams = this.urlParse(url)
        this.systemUrlType = 'inner'
        const systemUrlName = 'IbpsDesktopSystemUrl'
        this.$options.components[systemUrlName] = _import(component)
        this.systemUrlName = systemUrlName
      }
    },
    urlParse(str) {
      const obj = {}
      if (str.indexOf('?') !== -1) {
        const str1 = str.split('?')[1].split('&')
        for (let i = 0; i < str1.length; i++) {
          const params = str1[i].split('=')
          obj[params[0]] = params[1]
        }
      }
      return obj
    },
    /**
     * 默认选中打开指定页面
     */
    defaultOpenPage() {
      // 单点登录，默认选中处理
      if (top.module != null) {
        switch (top.module) {
          // 两票管理
          case 'lpgl':
            // 默认打开两票管理的工作票管理模块列表
            this.$router.push(process.env.VUE_APP_MODULE_LPGL_OPEN)
            break
          // 设备管理
          case 'sbgl':
            this.$router.push(process.env.VUE_APP_MODULE_SBGL_OPEN)
            break
          // 巡点检系统
          case 'xdjxt':
            this.$router.push(process.env.VUE_APP_MODULE_XDJGL_OPEN)
            break
          // 缺陷管理
          case 'qxgl':
            this.$router.push(process.env.VUE_APP_MODULE_QXGL_OPEN)
            break
          // 用户管理
          case 'yhgl':
            this.$router.push(process.env.VUE_APP_MODULE_YHGL_OPEN)
            break
          // 告警信息
          case 'gjxx':
            var gjxx_url = process.env.VUE_APP_MODULE_GJXX_OPEN
            if (gjxx_url != null && gjxx_url !== '') {
              this.$router.push(process.env.VUE_APP_MODULE_GJXX_OPEN)
            }
            break
        }
        setTimeout(function() {
          // 设置成空
          top.module = null
          top.selectModule = true
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/public.scss";

.ibps-desktop-page {
  .ibps-container-frame {
    position: absolute;
    top: 0px;
    left: 0px;
    height: 100%;
    width: 100%;
  }

  .ibps-grid-item,
  .el-card {
    height: 100%;
  }

  .vue-grid-layout {
    border-radius: 4px;
    // margin: -10px;
    .page_card {
      height: 100%;
      @extend %unable-select;
    }

    .vue-resizable-handle {
      opacity: 0.3;

      &:hover {
        opacity: 1;
      }
    }
  }
}
</style>

<style lang="scss">
.ibps-desktop-dashboard {
  .item {
    position: relative;
    margin: 12px;
    padding: 12px;
    height: 90px;
    border-radius: 4px;
    box-sizing: border-box;
    overflow: hidden;
    color: #fff;
  }

  .item-header {
    position: relative;

    & > p {
      margin: 0px;
      font-size: 14px;
    }

    & > span {
      position: absolute;
      right: 0px;
      top: 0px;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 12px;
      background: rgba(255, 255, 255, 0.3);
    }
  }

  .item-body {
    & > h2 {
      margin: 0;
      font-size: 32px;
      line-height: 60px;
    }
  }

  // .item-footer {
  //   line-height: 16px;
  //   & > span {
  //     font-size: 10px;
  //   }
  //   & > p {
  //     margin: 0px;
  //     font-size: 12px;
  //   }
  // }
  .item-tip {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    width: 80px;
    height: 80px;
    bottom: -35px;
    right: 50px;
    border: 2px solid #fff;
    border-radius: 100%;
    font-size: 48px;
    transform: rotate(-40deg);
    opacity: 0.1;
  }
}
</style>
