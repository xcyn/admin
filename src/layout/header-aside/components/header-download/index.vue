<template>
  <div class="ibps-mr-5">
    <el-tooltip
      v-if="downloadCount === 0"
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
          :hidden="downloadCount === 0"
          :value="downloadCount"
        >
          <ibps-icon
            name="download"
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
      popper-class="header-download-popper"
    >
      <el-button
        slot="reference"
        class="ibps-ml-0 ibps-mr btn-text can-hover"
        type="text"
      >
        <el-badge
          :max="99"
          :value="downloadCount"
        >
          <ibps-icon
            name="download"
            size="16"
          />
        </el-badge>
      </el-button>

      <el-card body-style="padding:0;">
        <el-row slot="header" :gutter="24">
          <el-col :span="10">
            <h2 style="margin: 0;">下载列表({{ downloadCount }}条)</h2>
          </el-col>
          <el-col :span="12" :offset="2">
            <el-input v-model="search.parameters[0].value" placeholder="文件名称" @keyup.enter.native.stop="query">
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
                  v-for="download in downloadList"
                  :key="download.dateGroup"
                  :timestamp="download.dateGroup"
                  placement="top"
                >
                  <el-card>
                    <ibps-list-download
                      v-for="(file,index) in download.files"
                      :key="index"
                      :title="file.name"
                      :label="file.desc"
                      :extra="file"
                      :to="genDownloadUrl(file.link)"
                      @click="handelFileClick"
                    >
                      <el-avatar
                        slot="icon"
                        :icon="fileType2Icon(file.type)"
                        shape="circle"
                        style="background-color: #87d068"
                      />
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
      title="文件明细"
      readonly
      :visible="dialogVisible"
      @download="(data)=>markDownloaded(data,true)"
      @close="()=>{dialogVisible = false}"
    />
  </div>
</template>

<script>
import { unreadReceive, markDownloaded } from '@/api/platform/socket/file'
import IbpsListDownload from '@/business/platform/socket/list-download/list-download'
import Detail from '@/views/platform/message/socket/detail/dialog'
import FileUtils from '@/business/platform/file/utils/file'
import { mapState } from 'vuex'

export default {
  components: {
    IbpsListDownload,
    Detail
  },
  data() {
    return {
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
      downloadList: [],
      downloadCount: 0
    }
  },
  computed: {
    ...mapState('ibps', {
      messageNew: state => state.message.hasNew
    }),
    tooltipContent() {
      return this.downloadCount === 0 ? '暂无未下载文件' : ''
    }
  },
  watch: {
    messageNew: function(val) {
      if (val) {
        this.query()
      }
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
    this.downloadList = null
  },
  methods: {
    handelFileClick(file) {
      console.info(file)
      this.dialogVisible = true
      this.detailId = file.id
    },
    query() {
      this.loadData().then(response => {
        const data = response.data
        this.downloadList = data.dataResult
        this.downloadCount = data.pageResult ? data.pageResult.totalCount : 0
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
            if (this.$utils.isEmpty(this.downloadList)) {
              this.downloadList.push(...data.dataResult)
            } else {
              const _data = JSON.parse(JSON.stringify(this.downloadList))
              for (let i = 0; i < data.dataResult.length; i++) {
                let falg = true
                for (let j = 0; j < _data.length; j++) {
                  if (_data[j].dateGroup === data.dataResult[i].dateGroup) {
                    this.downloadList[j].files.push(...data.dataResult[i].files)
                    falg = false
                    break
                  }
                }
                if (falg) this.downloadList.push(...data.dataResult)
              }
            }
          }

          this.downloadCount = data.pageResult.totalCount
        } else {
          this.downloadCount = 0
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
      this.$router.push('/officeDesk/socketMessage/socketFile')
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
     * 根据伪链生成下载地址
     * @param link
     * @returns {string}
     */
    genDownloadUrl(link) {
      return FileUtils.genDownloadUrl(link)
    },
    /**
     * 设置文件为已下载
     * @param fileItem
     */
    markDownloaded(fileItem, hidden) {
      if (fileItem.isDownload === 'Y') {
        this.alertDown(hidden)
        return
      }
      const vm = this
      markDownloaded({ fileId: fileItem.id }).then(() => {
        vm.$store.dispatch('ibps/message/set', true).then(() => {
          console.info('推送消息个数更新')
          this.query()
        })
        this.alertDown(hidden)
      })
    },
    /**
     * 提示
     */
    alertDown(hidden) {
      if (!hidden) {
        this.$notify({
          title: '提示',
          message: '下载成功',
          type: 'success',
          position: 'top-left',
          duration: 3 * 1000
        })
      }
    }
  }

}
</script>
<style lang="scss">
  .header-download-popper {
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
