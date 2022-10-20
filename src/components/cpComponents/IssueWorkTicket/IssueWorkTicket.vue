<template>
  <el-dropdown id="issueWorkTicket" ref="dropDown" trigger="click" placement="top" style="margin: 0px 63px;margin-top: 8px;" @command="handleCommand">
    <el-button :type="type" @click="issueWork">开具工作票</el-button>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-for="(items, index) in workTypeList" :key="index" :command="items">{{ items.wtTypeName }}</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>
<script>

import * as wtPersonRoleAPI from "@/api/cpApi/twoTickets/wtPersonRole";
import * as utils from "@/utils/cpUtils";
import * as wtTypeAPI from "@/api/cpApi/twoTickets/wtType";
import * as wtTypePageAPI from "@/api/cpApi/twoTickets/wtTypePage";

export default {
  props: {
    params: {},
    type: 'text'
  },

  data() {
    return {
      userInfo: {},
      workTypeList: [], // 关注票类型
      typePageUrlList: []
    }
  },
  created() {
    const curUserObj = utils.getLoginInfo()
    this.userInfo.userId = curUserObj['user'].id
    this.userInfo.userName = curUserObj['user'].name
    wtTypePageAPI.list().then(response => {
      this.typePageUrlList = response?.data || []
    })
    wtTypeAPI.list().then(res => {
      let wtTypeList = res?.data || []
      this.workTypeList = wtTypeList.filter(item => item.isMain === 1 &&  item.isOn === 1)
        .sort((a, b) => a.sortNo - b.sortNo)
    })
  },
  methods: {
    // 开具工作票
    issueWork() { // this.userInfo.userId
      wtPersonRoleAPI.getByUserId({
        userId: this.userInfo.userId
      }).then(response => {
        if (response?.data?.isManager !== '1') {
          this.$refs.dropDown.hide()
          this.$message.error('您不具备工作票工作负责人权限，请联系管理员！')
        }
      })
    },

    handleCommand(command) {
      let path = ''
      this.typePageUrlList.forEach(item => {
        if (item.wtTypeId == command.wtTypeId) {
          if (item.pageType == 'add') {
            if (item.pcPageUrl != '') {
              path = item.pcPageUrl
            }
          }
        }
      })

      if (path != '') {
        let value = {
          path: path,
          query: {
            option: 'add',
            wtTypeNo: command.wtTypeNo,
            wtTypeId: command.wtTypeId,
          }
        }
        Object.assign(value.query,this.params)
        this.$router.push(value)
      } else {
        this.$message.error('请在类型中配置相关路由')
      }
    }
  }
}
</script>
