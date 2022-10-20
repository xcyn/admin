<template>
  <div class="ibps-mr-5">
    <!-- <el-tooltip v-if="messageCount === 0" :content="tooltipContent" effect="dark" placement="bottom">
      <el-button class="ibps-ml-0 ibps-mr btn-text can-hover" type="text"> -->
    <!--<el-badge :max="99" :value="messageCount">-->
    <!--	<ibps-icon name="bell-o" size="16" />-->
    <!--</el-badge>-->
    <!-- <ibps-icon name="bell-o" size="16" />
      </el-button>
    </el-tooltip> -->

    <!-- <el-popover v-else v-model="popoverVisible" placement="bottom-end" width="350" trigger="click" popper-class="header-message-popper">

      <el-button slot="reference" class="ibps-ml-0 ibps-mr btn-text can-hover" type="text">
        <el-badge :max="99" :value="messageCount">
          <ibps-icon name="bell-o" size="16" />
        </el-badge>
      </el-button>

      <el-card body-style="padding:0;">
        <div slot="header" style="font-size: 20px; font-weight: 600;">
          {{ $t("layout.header-aside.header-message.message-count", { messageCount: messageCount }) }}
        </div>
        <div style="height:250px;">
          <el-scrollbar style="height: 100%;width:100%;" wrap-class="ibps-scrollbar-wrapper ">
            <ibps-list class="ibps-p-10">
              <ibps-list-item v-for="(message,index) in messageList" :key="index" @click.native="handelInteriorClick(message)">
                <ibps-list-item-meta :title="message.subject" :description="message.ownerName">
                  <el-avatar slot="avatar" :icon="message.messageType==='bulletin'?'ibps-icon-bullhorn':'ibps-icon-user'" shape="circle" style="background-color: #87d068" />
                </ibps-list-item-meta>
                <div slot="extra">
                  {{ message.createTime|formatRelativeTime({ "year": "yyyy-MM-dd" }) }}
                </div>
              </ibps-list-item>
            </ibps-list>
          </el-scrollbar>
        </div>

        <div class="message-more">
          <el-link type="primary" @click="clickMore">{{ $t("layout.header-aside.header-message.viewmore") }}</el-link>
        </div>
      </el-card>
    </el-popover> -->

    <el-button class="ibps-ml-0 ibps-mr btn-text can-hover" type="text" @click="clickMore">
      <el-badge :max="99" :value="messageCount">
        <ibps-icon name="bell-o" size="16" />
      </el-badge>
    </el-button>

    <!-- 消息明细 -->
    <inner-detail-dialog :id="editId" :visible="dialogFormVisible" :title="$t('layout.header-aside.header-message.details')" inside readonly @callback="loadData" @close="visible => dialogFormVisible = visible" />
  </div>
</template>

<script>
import { ENABLE_REFRESH_MESSAGE, REFRESH_MESSAGE_TIME } from '@/constant'
import { getMsgList } from '@/api/platform/message/innerMessage'
import { queryUnreadMessageCount } from '@/api/cpApi/message/index'
import InnerDetailDialog from '@/views/platform/message/inner/detail/dialog'

export default {
  components: {
    InnerDetailDialog
  },
  data () {
    return {
      editId: '',
      dialogFormVisible: false,

      messageList: [],
      messageCount: 0,

      popoverVisible: false,
      intervalAction: null,
      intervalTimes: 3
    }
  },
  computed: {
    tooltipContent () {
      return this.messageCount === 0 ? this.$t('layout.header-aside.header-message.empty') : ''
    }
  },
  created () {
    this.loadData()
  },
  mounted () {
    this.refreshData()
  },
  // 实例销毁前去除定时器
  beforeDestroy () {
    if (this.intervalAction) {
      clearInterval(this.intervalAction)
      this.intervalAction = null
    }
    this.messageList = null
  },
  methods: {
    refreshData () {
      if (this.$utils.toBoolean(ENABLE_REFRESH_MESSAGE)) {
        this.intervalAction = setInterval(() => {
          this.loadData()
        }, REFRESH_MESSAGE_TIME)
      }
    },
    // 加载数据
    loadData () {
      const params = {
        userId: this.$store.state.ibps.user.info.user.id
      }
      queryUnreadMessageCount(params).then(response => {
        this.messageCount = response.data ? response.data : 0
      }).catch(err => {
        console.error(err)
      })

      // getMsgList().then(response => {
      //   const data = response.data
      //   this.messageList = data.dataResult
      //   this.messageCount = data.pageResult ? data.pageResult.totalCount : 0
      // }).catch(err => {
      //   console.error(err)
      // })
    },
    handelInteriorClick (message) {
      this.editId = message.id
      this.dialogFormVisible = true
    },
    clickMore () {
      this.popoverVisible = false
      // 更多消息
      // this.$router.push("/officeDesk/innerMessage/receiveMessage")
      this.$router.push({
        name: 'platform-message'
      })
    }
  }

}
</script>
<style lang="scss">
.header-message-popper {
  padding: 0 !important;

  .message-more {
    padding: 15px 0;
    text-align: center;
    border-top: 1px solid #ebeef5;
  }
}
</style>
