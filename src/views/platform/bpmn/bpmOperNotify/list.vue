<template>
  <div class="receive-container">
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
      <!-- <template slot="handIcon" slot-scope="scope">
        <i v-if="!scope.row.receiverTime" class="ibps-icon-envelope-o" />
        <i v-else class="ibps-icon-envelope" />
      </template> -->
      <template slot="procDefIdSelect">
        <bpm-definition-selector
          v-model="procDefId"
          style="width:200px;display:block;"
          :multiple="false"
          @input="getProcDefId"
          @callback="data => formId= data.id"
        />
      </template>
      <template slot="notifierSelect">
        <ibps-employee-selector v-model="notifier" style="width:200px;" />
      </template>
    </ibps-crud>
    <edit
      :id="editId"
      :title="title"
      :visible="dialogFormVisible"
      :identity="identity"
      @callback="search"
      @close="visible => dialogFormVisible = visible"
    />
  </div>
</template>

<script>
import { queryPageList, readAll } from '@/api/platform/bpmn/bpmOperNotify'
import BpmDefinitionSelector from '@/business/platform/bpmn/definition/selector'
import IbpsEmployeeSelector from '@/business/platform/org/employee/selector'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import Identity from '@/constants/identity'
import Edit from './edit'

export default {
  components: {
    Edit,
    BpmDefinitionSelector,
    IbpsEmployeeSelector
  },
  mixins: [FixHeight],
  data() {
    return {
      dialogFormVisible: false, // ??????
      identity: Identity.IBPS.BPMN.BPM_OPER_NOTIFY,
      editId: '', // ??????dialog????????????
      pkKey: 'id', // ??????  ??????????????????pk???????????????
      title: '',
      formId: '',
      notifier: '',
      procDefId: '',
      loading: true,
      isEnvelope: true,
      link: false,
      height: document.clientHeight,
      listData: [],
      pagination: {},
      sorts: {},
      listConfig: {
        toolbars: [
          {
            key: 'search'
          }
          // {
          //   key: 'markRead',
          //   icon: 'ibps-icon-check-circle',
          //   label: '???????????????'
          // }
        ],
        searchForm: {
          forms: [
            // TODO: ????????????????????? ????????????icon?????????????????????[????????????,?????????]
            { prop: 'Q^PROC_DEF_ID_^S', label: '????????????', fieldType: 'slot', slotName: 'procDefIdSelect' },
            { prop: 'Q^NOTIFIER_^S', label: '?????????', fieldType: 'slot', slotName: 'notifierSelect' },
            {
              prop: ['Q^CREATE_TIME_^DL', 'Q^CREATE_TIME_^DG'],
              label: '????????????',
              fieldType: 'daterange'
            }
          ]
        },
        // ??????????????????
        columns: [
          // { prop: 'stateIcon', label: '', slotName: 'handIcon', width: '50' },
          { prop: 'notifyTitle', label: '????????????', sortable: 'custom', link: 'dialog' },
          { prop: 'procDefName', label: '????????????' },
          { prop: 'nodeName', label: '??????' },
          { prop: 'notifierName', label: '?????????' },
          { prop: 'createTime', label: '????????????' }
        ],
        rowHandle: {
          actions: [{
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
    getProcDefId(data) {
      this.procDefId = data
    },
    // ????????????
    loadData() {
      this.loading = true
      queryPageList(this.getSearcFormData()).then(response => {
        ActionUtils.handleListData(this, response.data)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    /**
     * ?????????????????????
     */
    getSearcFormData() {
      const params = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
      params['Q^PROC_DEF_ID_^S'] = this.procDefId
      params['Q^NOTIFIER_^S'] = this.notifier
      return ActionUtils.formatParams(
        params,
        this.pagination,
        this.sorts)
    },
    /**
     * ??????????????????
     */
    handlePaginationChange(page) {
      ActionUtils.setPagination(this.pagination, page)
      this.loadData()
    },
    /**
     * ????????????
     */
    handleSortChange(sort) {
      ActionUtils.setSorts(this.sorts, sort)
      this.loadData()
    },
    /**
     * ??????
     */
    search() {
      this.loadData()
    },
    /**
     * ??????????????????
     */
    handleAction(command, position, selection, data) {
      switch (command) {
        case 'search':// ??????
          ActionUtils.setFirstPagination(this.pagination)
          this.search()
          break
        case 'markRead':// ???????????????
          ActionUtils.selectedMultiRecord(selection).then((id) => {
            this.handleAlreadyRead(id)
          }).catch(() => { })
          break
        case 'detail':// ??????
          ActionUtils.selectedRecord(selection).then((id) => {
            this.title = '??????????????????'
            this.handleEdit(id, true)
          }).catch(() => { })
          break
        default:
          break
      }
    },
    /**
     * ???????????????
     */
    handleAlreadyRead(ids) {
      readAll({ ids: ids }).then(response => {
        ActionUtils.success('???????????????')
        this.search()
      }).catch(() => {})
    },
    /**
     * ????????????
     */
    handleEdit(id = '') {
      this.editId = id
      this.dialogFormVisible = true
    },
    /**
     * ????????????
     */
    handleLinkClick(data) {
      this.title = '??????????????????'
      this.editId = data.id || ''
      this.dialogFormVisible = true
    }
  }
}
</script>
