<template>
  <div class="socket-sent-container">
    <ibps-crud
      ref="crud"
      :height="height"
      :data="listData"
      :toolbars="listConfig.toolbars"
      :search-form="listConfig.searchForm"
      :pk-key="pkKey"
      :columns="listConfig.columns"
      :row-handle="listConfig.rowHandle"
      :pagination="pagination"
      :loading="loading"
      :index-row="false"
      :identity="identity"
      @action-event="handleAction"
      @sort-change="handleSortChange"
      @pagination-change="handlePaginationChange"
      @column-link-click="handleColumnLink"
    />
    <!-- 明细 -->
    <detail
      :id="detailId"
      :title="title"
      socket-type="sent"
      :readonly="readonly"
      :visible="dialogFormVisible"
      @close="visible => dialogFormVisible = visible"
    />

    <!-- 发送/通知 -->
    <send
      :title="sendProps.title"
      :command="sendProps.command"
      :visible="dialogSendVisible"
      @callback="search"
      @close="visible => dialogSendVisible = visible"
    />
  </div>
</template>

<script>
import { send, remove } from '@/api/platform/socket/message'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import { typeOptions } from './constants'
import Detail from './detail/dialog'
import Send from './send'
import Identity from '@/constants/identity'

export default {
  components: {
    Detail,
    Send
  },
  mixins: [FixHeight],
  data() {
    return {
      dialogSendVisible: false,
      sendProps: {
        command: '',
        title: ''
      },
      identity: Identity.IBPS.MESSAGE.INNER_SENT,
      dialogFormVisible: false, // 弹窗
      detailId: '', // 明细dialog需要使用
      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      icon: 'envelope',
      title: '',
      loading: true,
      readonly: false,
      height: document.clientHeight,
      listData: [],
      pagination: {},
      sorts: {},
      listConfig: {
        toolbars: [
          { key: 'search' },
          { key: 'remove' },
          { key: 'send', label: '发送', icon: 'ibps-icon-send' },
          { key: 'notice', label: '通知', icon: 'ibps-icon-send' }
        ],
        searchForm: {
          forms: [
            { prop: 'Q^to_user_id_^SL', label: '接收方用户ID' },
            {
              prop: 'Q^type_^SL',
              label: '消息类型',
              fieldType: 'select',
              options: typeOptions
            }
          ]
        },
        // 表格字段配置
        columns: [
          { prop: 'id', label: 'id' },
          { prop: 'toUserId', label: '接收方用户ID' },
          { prop: 'type', label: '消息类型', tags: typeOptions },
          { prop: 'createTime', label: '发送时间', dateFormat: 'yyyy-MM-dd HH:mm:ss' }
        ],
        rowHandle: {
          actions: [
            {
              key: 'remove'
            }, {
              key: 'detail'
            }]
        }
      }
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    reply(id) {
      this.detailId = id
      this.repliFormVisible = true
    },
    // 加载数据
    loadData() {
      this.loading = true
      send(this.getSearcFormData()).then(response => {
        ActionUtils.handleListData(this, response.data)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    /**
     * 获取格式化参数
     */
    getSearcFormData() {
      return ActionUtils.formatParams(
        this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {},
        this.pagination,
        this.sorts)
    },
    /**
     * 处理分页事件
     */
    handlePaginationChange(page) {
      ActionUtils.setPagination(this.pagination, page)
      this.loadData()
    },
    /**
     * 处理排序
     */
    handleSortChange(sort) {
      ActionUtils.setSorts(this.sorts, sort)
      this.loadData()
    },
    /**
     * 查询
     */
    search() {
      this.loadData()
    },
    handleColumnLink(column, row) {
      this.handleEdit(column.id, true)
      this.title = '发送信息明细'
    },
    /**
     * 处理按钮事件
     */
    handleAction(command, position, selection, data) {
      switch (command) {
        case 'search':// 查询
          ActionUtils.setFirstPagination(this.pagination)
          this.search()
          break
        case 'detail':// 明细
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleEdit(id, true)
            this.title = '信息明细'
          }).catch(() => { })
          break
        case 'remove':// 删除
          ActionUtils.removeRecord(selection).then((ids) => {
            this.handleRemove(ids)
          }).catch(() => { })
          break
        case 'send':// 发送
          this.handleSend(command)
          break
        case 'notice':// 通知
          this.handleSend(command)
          break
        default:
          break
      }
    },
    /**
     * 处理消息发送/通知操作
     */
    handleSend(command) {
      this.sendProps = {
        command,
        title: command === 'notice' ? '消息通知' : '消息发送'
      }
      this.dialogSendVisible = true
    },
    /**
     * 处理明细
     */
    handleEdit(id = '', readonly) {
      this.detailId = id
      this.readonly = readonly
      this.dialogFormVisible = true
    },
    /**
     * 处理删除
     */
    handleRemove(ids) {
      remove({ ids: ids }).then(response => {
        ActionUtils.removeSuccessMessage()
        this.search()
      }).catch(() => {})
    }
  }
}
</script>
