<template>
  <div class="ibps-mr-5">
    <el-tooltip
      v-if="loadCount === 0"
      :content="tooltipContent"
      effect="dark"
      placement="bottom"
    >
      <el-button
        class="ibps-ml-0 ibps-mr btn-text can-hover"
        type="text"
      >
        <el-badge
          :max="99"
          :hidden="loadCount === 0"
          :value="loadCount"
        >
          <ibps-icon
            name="bell-o"
            size="16"
          />
        </el-badge>
      </el-button>
    </el-tooltip>
    <el-popover
      v-else
      v-model="popoverVisible"
      placement="bottom-end"
      width="450"
      trigger="click"
      popper-class="header-socket-message"
    >
      <el-button
        slot="reference"
        class="ibps-ml-0 ibps-mr btn-text can-hover"
        type="text"
      >
        <el-badge
          :max="99"
          :value="loadCount"
        >
          <ibps-icon
            name="bell-o"
            size="16"
          />
        </el-badge>
      </el-button>

      <el-card body-style="padding:0;">
        <el-row slot="header" :gutter="24">
          <el-col :span="10">
            <h2 style="margin: 0;">消息列表({{ loadCount }}条)</h2>
          </el-col>
          <el-col :span="12" :offset="2">
            <el-input v-model="search.parameters[0].value" placeholder="消息名称" @keyup.enter.native.stop="query">
              <el-button slot="append" icon="el-icon-search" />
            </el-input>
          </el-col>
        </el-row>
        <div style="height:249px;">
          <el-scrollbar
            ref="myScrollbar"
            style="height: 100%;width:100%;"
            wrap-class="ibps-scrollbar-wrapper "
          >
            <ibps-list class="ibps-pr-10 ibps-pt-10">
              <el-timeline>
                <el-timeline-item
                  v-for="item in loadList"
                  :key="item.dateGroup"
                  :timestamp="item.dateGroup"
                  placement="top"
                >
                  <el-card>
                    <ibps-list-download
                      v-for="(message,index) in item.messages"
                      :key="index"
                      :title="message.name"
                      :extra="message"
                      :hidden-handle="true"
                      badge-name="isReaded"
                      @click="handelClick"
                    >
                      <span slot="label">消息类型: {{ message.type|optionsFilter(typeOptions,'label') }}</span>
                      <el-avatar
                        slot="icon"
                        :icon="fileType2Icon(message.type)"
                        shape="circle"
                        style="background-color: #87d068"
                      />
                      <span slot="receiveTime">接收时间: {{ message.receiveTime || '--' }}</span>
                      <span slot="sendTime">发送时间: {{ message.sendTime || '--' }}</span>

                    </ibps-list-download>
                  </el-card>
                </el-timeline-item>
              </el-timeline>

            </ibps-list>
          </el-scrollbar>
        </div>
        <div class="message-more">
          <el-link type="primary" @click="clickMore"> 查看更多</el-link>
        </div>
      </el-card>
    </el-popover>
    <!-- 明细 -->
    <detail
      :id="detailId"
      title="消息明细"
      socket-type="receive"
      readonly
      :visible="dialogVisible"
      @close="()=>{dialogVisible = false}"
    />
  </div>
</template>

<script>
import { unreadReceive, markRead } from '@/api/platform/socket/message'
import IbpsListDownload from '@/business/platform/socket/list-download/list-download'
import Detail from '@/views/platform/message/socket/detail/dialog'
import FileUtils from '@/business/platform/file/utils/file'
import { typeOptions } from '@/views/platform/message/socket/constants'

export default {
  components: {
    IbpsListDownload,
    Detail
  },
  data() {
    return {
      typeOptions: typeOptions,
      detailId: '',
      dialogVisible: false,
      popoverVisible: false,
      loading: false,
      search: {
        parameters: [{
          key: 'name',
          value: ''
        }],
        requestPage: {
          limit: 10,
          pageNo: 1
        }
      },
      loadList: [],
      loadCount: 0
    }
  },
  computed: {
    tooltipContent() {
      return this.loadCount === 0 ? this.$t('layout.header-aside.header-message.empty') : ''
    }
  },
  created() {
    this.query()
    this.$nextTick(() => {
      this.handleScroll()
    })
  },
  beforeDestroy() {
    this.search = null
    this.loadList = null
  },
  methods: {
    handelClick(data) {
      this.dialogVisible = true
      this.detailId = data.id
      this.markRead(data, true)
    },
    query() {
      this.loadData().then(response => {
        const data = response.data
        this.loadList = data.dataResult
        this.loadCount = data.pageResult ? data.pageResult.totalCount : 0
      })
    },
    scrollLoad() {
      if (this.loading) return
      this.loading = true
      this.search.requestPage.pageNo++
      this.loadData().then(response => {
        const data = response.data
        if (data.pageResult) {
          if (data.pageResult.page === this.search.requestPage.pageNo - 1) {
            this.search.requestPage.pageNo = data.pageResult.page
          } else {
            if (this.$utils.isEmpty(this.loadList)) {
              this.loadList.push(...data.dataResult)
            } else {
              const _data = JSON.parse(JSON.stringify(this.loadList))
              for (let i = 0; i < data.dataResult.length; i++) {
                let falg = true
                for (let j = 0; j < _data.length; j++) {
                  if (_data[j].dateGroup === data.dataResult[i].dateGroup) {
                    this.loadList[j].messages.push(...data.dataResult[i].messages)
                    falg = false
                    break
                  }
                }
                if (falg) this.loadList.push(...data.dataResult)
              }
            }
          }

          this.loadCount = data.pageResult.totalCount
        } else {
          this.loadCount = 0
        }

        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleScroll() {
      const scrollbarEl = this.$refs.myScrollbar.wrap
      scrollbarEl.onscroll = () => {
        const _top = scrollbarEl.scrollTop // 滚动条滚动距离
        const _height = scrollbarEl.scrollHeight // 总高度
        const _clientHeight = scrollbarEl.clientHeight
        const _bottom = _height - _clientHeight - _top
        if (_bottom <= 10) {
          this.scrollLoad()
        }
      }
    },
    /**
     * 加载数据
     */
    loadData() {
      return unreadReceive(this.search)
    },
    /**
     * 获取更多
     */
    clickMore() {
      this.popoverVisible = false
      // 更多消息
      this.$router.push('/officeDesk/socketMessage/socketReceiveMessage')
    },
    /**
     * 文件后缀转成 faIcon
     * @param fileType
     * @returns {string}
     */
    fileType2Icon(fileType) {
      return FileUtils.getFileType(fileType)
    },
    /**
     * 设置为已读
     * @param item
     */
    markRead(item, hidden) {
      if (item.isReaded === 'Y') return
      const vm = this
      markRead({ messageId: item.id }).then(() => {
        vm.$store.dispatch('ibps/message/set', true).then(() => {
          console.info('推送消息个数更新')
          this.query()
        })
      })
    }
  }

}
</script>
<style lang="scss">
  .header-socket-message {
    padding: 0 !important;
    .footer-pagination{
      padding: 2px 0;
      border-top: 1px solid #cfd7e5;
      background: #FFF;
    }
    .message-more {
      padding: 15px 0;
      text-align: center;
      border-top: 1px solid #EBEEF5;
    }
  }
  .ibps-list-group > .el-timeline {
    padding-left: 10px;
    padding-top: 20px;
  }
  .el-timeline-item__content {
    width: 90%;
  }
</style>
