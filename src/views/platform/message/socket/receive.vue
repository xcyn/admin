<template>
  <div class="socket-receive-container">
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
      @column-link-click="handleLinkClick"
      @pagination-change="handlePaginationChange"
    >
      <template slot="handIcon" slot-scope="scope">
        <el-tooltip v-if="scope.row.isReaded === 'Y'" class="item" effect="dark" content="已读" placement="bottom">
          <i class="ibps-icon-envelope-open-o" />
        </el-tooltip>
        <el-tooltip v-else class="item" effect="dark" content="未读" placement="bottom">
          <i class="ibps-icon-envelope-o" />
        </el-tooltip>
      </template>
    </ibps-crud>
    <!-- 明细 -->
    <detail
      :id="editId"
      :title="title"
      socket-type="receive"
      :readonly="readonly"
      :visible="dialogFormVisible"
      @close="visible => closeDetail(visible)"
    />
  </div>
</template>

<script>
import { receive, markRead, remove } from '@/api/platform/socket/message'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import { typeOptions, renderHeader } from './constants'
import Detail from './detail/dialog'
import Identity from '@/constants/identity'

export default {
  components: {
    Detail
  },
  mixins: [FixHeight],
  data() {
    return {
      identity: Identity.IBPS.MESSAGE.INNER_RECEIVE,
      dialogFormVisible: false, // 弹窗
      repliFormVisible: false, // 弹窗
      editId: '', // 编辑dialog需要使用
      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      title: '',
      loading: true,
      isEnvelope: true,
      link: false,
      readonly: false,
      height: document.clientHeight,
      listData: [],
      pagination: {},
      sorts: {},
      listConfig: {
        toolbars: [
          { key: 'search' },
          { key: 'remove' },
          {
            key: 'markRead',
            icon: 'ibps-icon-check-circle',
            label: '标记为已读'
          }
        ],
        searchForm: {
          forms: [
            { prop: 'Q^from_user_id_^SL', label: '发送方用户ID' },
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
          { prop: 'stateIcon', label: '', slotName: 'handIcon', width: '65', renderHeader: renderHeader },
          { prop: 'id', label: 'id' },
          { prop: 'fromUserId', label: '发送方用户ID' },
          { prop: 'type', label: '消息类型', tags: typeOptions },
          { prop: 'sendTime', label: '发送时间', dateFormat: 'yyyy-MM-dd HH:mm:ss' },
          { prop: 'receiveTime', label: '接收时间', dateFormat: 'yyyy-MM-dd HH:mm:ss' }
        ],
        rowHandle: {
          actions: [{
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
    // 加载数据
    loadData() {
      this.loading = true
      receive(this.getSearcFormData()).then(response => {
        ActionUtils.handleListData(this, response.data)
        this.loading = false
      }).catch((err) => {
        this.loading = false
        console.error(err)
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
    handleLinkClick(data, columns) {
      this.handleEdit(data.id, true)
      this.title = '信息明细'
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
        case 'markRead':// 标记为已读
          ActionUtils.selectedRecord(selection).then((id) => {
            let _data = data
            if (this.$utils.isArray(data)) {
              _data = data[0]
            }
            if (_data.isReaded === 'Y') {
              ActionUtils.warning('选择的数据已读，不需要重新标记！')
              return
            }
            this.handleAlreadyRead(_data)
          }).catch(() => { })
          break
        case 'detail':// 明细
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleEdit(id, true)
            this.title = '信息明细'
            let _data = data
            if (this.$utils.isArray(data)) {
              _data = data[0]
            }
            this.handleAlreadyRead(_data, true)
          }).catch(() => { })
          break
        case 'remove':// 删除
          ActionUtils.removeRecord(selection).then((ids) => {
            this.handleRemove(ids)
          }).catch(() => { })
          break
        default:
          break
      }
    },
    /**
     * 标记为已读
     */
    handleAlreadyRead(data, hidden) {
      if (data.isReaded === 'Y') return
      markRead({ messageId: data.id }).then(response => {
        if (!hidden) ActionUtils.success('标记已读成功')
        this.search()
      }).catch(() => {})
    },
    /**
     * 处理回复
     */
    handleReply(id = '') {
      this.editId = id
      this.repliFormVisible = true
    },
    /**
     * 处理明细
     */
    handleEdit(id = '', readonly) {
      this.editId = id
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
    },
    closeDetail(visible) {
      this.dialogFormVisible = visible
      this.search()
    }
  }
}
</script>
