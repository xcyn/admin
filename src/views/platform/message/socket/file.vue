<template>
  <div class="socket-file-container">
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
        <el-tooltip v-if="scope.row.isDownload === 'Y'" class="item" effect="dark" content="已下载" placement="bottom">
          <i class="el-icon-download" />
        </el-tooltip>
        <el-tooltip v-else class="item" effect="dark" content="未下载" placement="bottom">
          <i class="el-icon-paperclip" />
        </el-tooltip>

      </template>
    </ibps-crud>
    <!-- 明细 -->
    <detail
      :id="editId"
      :title="title"
      :readonly="readonly"
      :visible="dialogFormVisible"
      @callback="search"
      @download="handleDownloaded"
      @close="visible => closeDetail(visible)"
    />

    <!-- 预览 -->
    <ibps-file-viewer
      :visible.sync="dialogVisible"
      :title="file.name"
      :url="file.url"
      :file-ext="file.type"
      @close="()=>{dialogVisible = false}"
    />
  </div>
</template>

<script>
import { receive, markDownloaded, remove } from '@/api/platform/socket/file'
import { previewFile, download } from '@/api/platform/file/attachment'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import { renderFileHeader } from './constants'
import Detail from './detail/dialog'
import Identity from '@/constants/identity'
import IbpsFileViewer from '@/components/ibps-file-viewer'

export default {
  components: {
    Detail,
    IbpsFileViewer
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
          { key: 'remove' }
        ],
        searchForm: {
          forms: [
            { prop: 'Q^name_^SL', label: '文件名' },
            { prop: 'Q^type_^SL', label: '文件类型' }
          ]
        },
        // 表格字段配置
        columns: [
          { prop: 'stateIcon', label: '', slotName: 'handIcon', width: '65', renderHeader: renderFileHeader },
          { prop: 'id', label: 'id' },
          { prop: 'name', label: '文件名' },
          { prop: 'type', label: '文件类型' },
          { prop: 'createTime', label: '发送时间', dateFormat: 'yyyy-MM-dd HH:mm:ss' }
        ],
        rowHandle: {
          actions: [{
            key: 'remove'
          }, {
            key: 'detail'
          },
          {
            key: 'download',
            icon: 'el-icon-download',
            label: '下载'
          },
          {
            icon: 'el-icon-view',
            label: '预览',
            key: 'preview'
          },
          {
            key: 'markDownloaded',
            icon: 'ibps-icon-check-circle',
            label: '标记为已下载'
          }
          ]
        }
      },
      dialogVisible: false,
      file: {
        url: '',
        name: '',
        type: ''
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
        case 'download':// 下载
          ActionUtils.selectedRecord(selection).then((id) => {
            if (this.$utils.isArray(data)) {
              this.download(data[0])
            } else {
              this.download(data)
            }
          }).catch(() => { })
          break
        case 'preview':// 预览
          ActionUtils.selectedRecord(selection).then(() => {
            if (this.$utils.isArray(data)) {
              this.preview(data[0])
            } else {
              this.preview(data)
            }
          }).catch(() => { })
          break
        case 'markDownloaded':// 标记为已下载
          ActionUtils.selectedRecord(selection).then((id) => {
            let _data = data
            if (this.$utils.isArray(data)) {
              _data = data[0]
            }
            this.handleDownloaded(_data)
          }).catch(() => { })
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
        default:
          break
      }
    },
    preview(extra) {
      this.file = {
        url: previewFile(extra.storageId),
        name: extra.name,
        type: extra.type
      }

      this.dialogVisible = true
    },
    download(fileItem) {
      const vm = this
      const loadingInstance = this.$loading({
        lock: true,
        text: '下载中..'
      })
      download({
        attachmentId: fileItem.storageId
      }).then(response => {
        loadingInstance.close()
        if (!response) {
          return
        }
        ActionUtils.exportFile(
          response.data,
          fileItem.name + (this.$utils.isNotEmpty(fileItem.type) ? '.' + fileItem.type : '')
        )
        vm.markDownloaded(fileItem)
      }).catch(() => {
        loadingInstance.close()
      })
    },
    /**
     * 标记为已下载
     */
    handleDownloaded(data) {
      this.markDownloaded(data, true)
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
