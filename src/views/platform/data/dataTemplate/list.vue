<template>
  <div>
    <ibps-card-list
      ref="crud"
      :title="title"
      :height="height"
      :data="listData"
      :pagination="pagination"
      :pk-key="pkKey"
      :toolbars="listConfig.toolbars"
      :search-form="listConfig.searchForm"
      :columns="listConfig.columns"
      :row-handle="listConfig.rowHandle"
      :loading="loading"
      :create-text="createText"
      :identity="identity"
      @action-event="handleAction"
      @sort-change="handleSortChange"
      @pagination-change="handlePaginationChange"
    >
      <template slot="east">
        <ibps-type-tree
          :width="width"
          :height="treeHeight"
          :has-contextmenu="true"
          :category-key="categoryKey"
          :identity="DATATEMPLATE_TREE"
          title="数据模版分类"
          position="east"
          @node-click="handleNodeClick"
          @expand-collapse="handleExpandCollapse"
        />
      </template>
      <template slot="searchForm">
        <el-form class="search-form" inline @keyup.enter.native.stop="search">

          <el-form-item>
            <el-input v-model="searchField" :placeholder="searchPlaceholder" clearable class="input-with-select">
              <template slot="prepend">
                <el-select v-model="searchName" placeholder="请选择" @change="changeSearchField">
                  <el-option
                    v-for="option in searchFieldOptions"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>
              </template>
              <template slot="append">
                <el-select v-model="searchTemplateType" placeholder="选择类型" clearable class="data-template-search__type">
                  <el-option
                    v-for="item in templateTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <!-- v-permission="identity+'_search'" -->
                <el-button icon="el-icon-search" class="data-template-search__button" @click="search" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <ibps-toolbar
              :identity="identity"
              :actions="listConfig.toolbars"
              @action-event="handleActionEvent"
            />
          </el-form-item>
        </el-form>
      </template>

      <template slot="item-symbol" slot-scope="scope">
        <template v-if="scope.data.type === 'default'">
          <i
            class="symbol-icon "
            :class="scope.data.showType === 'list'?'ibps-icon-table':(scope.data.showType === 'tree'?'ibps-icon-tree':'ibps-icon-puzzle-piece')"
          />
        </template>
        <template v-else-if="scope.data.type === 'dialog'">
          <span class="ibps-icon-stack symbol-icon " style="font-size:0.55em;">

            <i class="ibps-icon-window-maximize ibps-icon-stack-2x" />
            <i
              :class=" scope.data.showType === 'list'?'ibps-icon-table':(scope.data.showType === 'tree'?'ibps-icon-tree':'ibps-icon-puzzle-piece')"
              class="ibps-icon-stack-1x"
              style="top: 5px;"
            />
          </span>
        </template>
        <template v-else>
          <i class="symbol-icon ibps-icon-database" />
        </template>

      </template>
    </ibps-card-list>
    <!-- 导入数据 -->
    <import-data
      :id="editId"
      :visible="importFormVisible"
      @callback="search"
      @close="visible => importFormVisible = visible"
    />
    <!-- 复制数据模版 -->
    <copy
      :id="editId"
      :copy-data="copyData"
      :visible="copyDialogFormVisible"
      @close="visible => copyDialogFormVisible = visible"
    />
    <!--创建数据模版-->
    <create
      :title="createText"
      :type-id="typeId"
      :visible="dialogFormVisible"
      @callback="search"
      @close="visible => dialogFormVisible = visible"
    />
    <template-builder
      :id="editId"
      :visible="templatebuilderDialogVisible"
      @callback="search"
      @close="visible => templatebuilderDialogVisible = visible"
    />

    <!--数据模版预览-动态参数-->
    <dynamic-params-preview
      :visible="dynamicParamsDialogVisible"
      :conditions="conditions"
      @close="visible => dynamicParamsDialogVisible = visible"
      @callback="handleDynamicParams"
    />
    <!--数据模版预览-->
    <data-template-render-preview
      :visible="templateRendererDialogVisible"
      :data="dataTemplate"
      :value="selectedValue"
      :multiple="multiple"
      :label-key="labelKey"
      :dynamic-params="dynamicParams"
      preview
      @close="visible => templateRendererDialogVisible = visible"
      @action-event="handleTemplaterenderActionEvent"
    />
    <!--数据模版预览-数据-->
    <data-template-render-preview-data
      :visible="previewDialogVisible"
      :data="previewFormData"
      @close="visible => previewDialogVisible = visible"
    />
  </div>
</template>
<script>
import { queryPageList, remove, exportFile, getByKey } from '@/api/platform/data/dataTemplate'
import ActionUtils from '@/utils/action'
import fecha from '@/utils/fecha'
import FixHeight from '@/mixins/height'
import Identity from '@/constants/identity'
import { templateTypeOptions } from '@/business/platform/data/constants'
import PreviewMixin from '@/business/platform/data/templaterender/preview/mixins/preview'
import IbpsCardList from '@/components/ibps-card-list'
import IbpsTypeTree from '@/business/platform/cat/type/tree'
import Create from './create'
import TemplateBuilder from '@/business/platform/data/templatebuilder/dialog'
import ImportData from './import'
import Copy from './copy'
import DynamicParamsPreview from '@/business/platform/data/templaterender/preview/dynamic-params'
import DataTemplateRenderPreview from '@/business/platform/data/templaterender/preview'
import DataTemplateRenderPreviewData from '@/business/platform/data/templaterender/preview/preview-data'

export default {
  components: {
    IbpsTypeTree,
    IbpsCardList,
    Create,
    Copy,
    ImportData,
    TemplateBuilder,
    DynamicParamsPreview,
    DataTemplateRenderPreview,
    DataTemplateRenderPreviewData
  },
  mixins: [FixHeight, PreviewMixin],
  data() {
    return {
      width: 220,
      height: 500,
      title: '数据模版管理',
      createText: '创建数据模版',
      categoryKey: 'DATA_TEMPLATE_TYPE',
      typeId: '',
      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      loading: false,
      dialogFormVisible: false,
      templatebuilderDialogVisible: false,
      importFormVisible: false,
      copyDialogFormVisible: false,
      identity: Identity.IBPS.DATA.DATATEMPLATE,
      DATATEMPLATE_TREE: Identity.IBPS.DATA.DATATEMPLATE_TREE,
      dataTemplate: {},
      copyData: {},

      searchField: '',
      searchName: 'Q^name_^SL',
      searchPlaceholder: '请输入模版名称',
      searchFieldOptions: [{
        label: '模版名称',
        value: 'Q^name_^SL'
      }, {
        label: '模版key',
        value: 'Q^key_^SL'
      }],
      searchTemplateType: '',
      templateTypeOptions,

      editId: '',
      listData: [],
      listConfig: {
        // 查询条件
        searchForm: { prop: 'Q^name_^SL', label: '模版名称' },
        // 工具栏
        toolbars: [
          { key: 'import' },
          { key: 'export' }
        ],

        // 表格字段配置
        columns: [
          { prop: 'name', label: '模版名称' }
        ],
        // 管理列
        rowHandle: {
          actions: [
            { key: 'preview', label: '预览', icon: 'el-icon-view' },
            { key: 'edit', label: '编辑', icon: 'ibps-icon-edit' },
            { key: 'remove', label: '删除', icon: 'ibps-icon-remove' },
            { key: 'copy', label: '复制', icon: 'ibps-icon-copy' }
          ]
        }
      },
      pagination: {},
      sorts: {}
    }
  },
  computed: {
    treeHeight() {
      return this.height - 75
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    // 加载数据
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
     * 获取格式化参数
     */
    getSearcFormData() {
      const params = {}
      if (this.$utils.isNotEmpty(this.searchField)) {
        params[this.searchName] = this.searchField
      }
      if (this.$utils.isNotEmpty(this.typeId)) {
        params['Q^TYPE_ID_^S'] = this.typeId
      }
      if (this.$utils.isNotEmpty(this.searchTemplateType)) {
        params['Q^TYPE_^S'] = this.searchTemplateType
      }
      return ActionUtils.formatParams(
        params,
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
    changeSearchField(value) {
      const option = this.searchFieldOptions.find((option) => {
        return option.value === value
      })
      this.searchPlaceholder = '请输入' + option.label
    },
    /**
     * @description 处理按钮的事件 【包含增删改查】
     * @param {*} buttonKey
     * @param {*} position
     * @param {*} data
     */
    handleActionEvent(action, position, data, index) {
      const buttonKey = action.key
      let selection = []
      if (this.$refs.crud) {
        selection = this.$refs.crud.getSelectedIds()
      }
      this.handleAction(buttonKey, position, selection, data)
    },
    handleAction(command, position, selection, data) {
      switch (command) {
        case 'search':// 查询
          ActionUtils.setFirstPagination(this.pagination)
          this.search()
          break
        case 'add':// 添加
          this.dialogFormVisible = true
          break
        case 'edit':// 编辑
          this.handleEdit(selection)
          break
        case 'remove':// 删除
          ActionUtils.removeRecord(selection).then((ids) => {
            this.handleRemove(ids)
          }).catch(() => { })
          break
        case 'import':// 导入
          this.handleImport()
          break
        case 'export':// 导出
          ActionUtils.selectedMultiRecord(selection).then((ids) => {
            this.handleExport(ids)
          }).catch(() => { })
          break
        case 'preview':// 预览
          this.handlePreview(data.key)
          break
        case 'copy':// 复制
          this.handleCopy(data)
          break
      }
    },
    handleImport() {
      this.importFormVisible = true
    },
    handleExport(ids) {
      exportFile({ templateIds: ids }).then((response) => {
        if (!response) {
          return
        }
        ActionUtils.exportFile(
          response.data,
          'dataTemplate_' + fecha.formatDate('yyyyMMddHHmmss') + '.zip'
        )
      }).catch(() => {

      })
    },
    handleEdit(id) {
      this.templatebuilderDialogVisible = true
      this.editId = id
    },
    handleCopy(data) {
      this.copyDialogFormVisible = true
      this.editId = data.id
      this.copyData = data
    },
    /**
     * 处理删除
     */
    handleRemove(ids) {
      remove({ dataTemplateIds: ids }).then(response => {
        ActionUtils.removeSuccessMessage()
        this.search()
      }).catch(() => {})
    },
    handleNodeClick(typeId) {
      this.typeId = typeId
      this.loadData()
    },
    handleExpandCollapse(isExpand) {
      this.width = isExpand ? 200 : 30
    },
    // 预览
    handlePreview(key) {
      // this.dialogLoading = true
      this.dataTemplate = {}
      getByKey({
        dataTemplateKey: key
      }).then(response => {
        // 从后台获取数据
        this.dataTemplate = this.$utils.parseData(response.data)
        setTimeout(() => {
          this.previewTemplate()
        }, 100)
        // this.dialogLoading = false
      }).catch(() => {
        // this.dialogLoading = false
      })
    }
  }
}
</script>
<style lang="scss">
  .data-template-search__type {
    border-right: 1px solid #DCDFE6 !important;
  }
  .data-template-search__button {
    padding-left :50px !important;
  }
</style>
