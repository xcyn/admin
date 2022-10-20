<template>
  <div>
    <ibps-crud
      :data="data"
      :toolbars="listConfig.toolbars"
      :search-toolbars="listConfig.searchToolbars"
      :search-form="listConfig.searchForm"
      :pk-key="pkKey"
      :columns="listConfig.columns"
      :show-pagination="showPagination"
      :pagination="pagination"
      :index-row="indexRow"
      :height="height"
      :style="{
        width:width+'px'
      }"
    >
      <!--自定义查询条件-->
      <template #searchForm>
        <search-form
          v-if="listConfig.searchForm && listConfig.searchForm.forms "
          ref="searchForm"
          :selection-row="selectionRow"
          :forms="listConfig.searchForm.forms||[]"
          :size="listConfig.searchForm.size"
          :fuzzy="listConfig.searchForm.fuzzy"
          :inline="listConfig.searchForm.inline"
          :label-width="listConfig.searchForm.labelWidth"
          :item-width="listConfig.searchForm.itemWidth"
          disabled
        />
      </template>
    </ibps-crud>
  </div>

</template>
<script>
import SearchForm from '@/business/platform/data/components/search-form/index.vue'
import ButtonsConstants, { hasButton } from '@/business/platform/data/constants/buttons'
import { isIE } from 'element-ui/lib/utils/util'

export default {
  components: {
    SearchForm
  },
  props: {
    template: Object,
    dataTemplate: Object
  },
  data() {
    const flexWidth = isIE() ? 20 : 0
    return {
      width: document.body.clientWidth - 575 - flexWidth,
      data: [],
      pkKey: 'id',
      indexRow: false,
      height: 350,
      listConfig: {
        // 工具栏
        toolbars: [
          { key: 'search' },
          { key: 'add' },
          { key: 'edit' },
          { key: 'remove' }
        ],
        columns: [],
        searchForm: null,
        rowHandle: {
          actions: [{
            key: 'edit'
          }]
        }
      },
      showPagination: true,
      selectionRow: true,
      pagination: {
        page: 1,
        limit: 20
      },
      allButtons: ['search', 'add', 'remove']
    }
  },
  watch: {
    template: {
      handler(val, oldVal) {
        if (!this.template) { return }

        this.selectionRow = this.template.attrs ? this.$utils.toBoolean(this.template.attrs.selectionRow, true) : true

        const toolbarButtons = this.template.buttons ? this.template.buttons.function_buttons || [] : []

        // 工具栏
        const toolbars = []
        // 搜索工具栏
        const searchToolbars = []
        toolbarButtons.forEach((button, i) => {
          const defaultButton = ButtonsConstants[button.button_type] || {}
          if (this.$utils.isEmpty(button.position)) {
            if (this.$utils.isNotEmpty(defaultButton)) {
              const scope = defaultButton.scope
              if (this.$utils.isNotEmpty(scope) && this.$utils.isArray(scope)) {
                if (this.allButtons.includes(button.button_type)) { // 默认查询、新增、删除为所有
                  button.position = 'all'
                } else if (scope.includes('manage')) { // 默认存在manage则选择manage
                  button.position = 'manage'
                } else if (scope.includes('search')) { // 默认存在search则选择search
                  button.position = 'search'
                } else if (scope.includes('toolbar')) { // 默认存在toolbar则选择toolbar
                  button.position = 'toolbar'
                } else {
                  button.position = scope[0]
                }
              }
            }
          }
          toolbars.push({
            key: button.button_type + i,
            label: button.label || defaultButton.label,
            // position的值有:toolbar manage search edit all
            hidden: button.position === 'manage' || button.position === 'search' || button.position === 'edit',
            icon: 'ibps-icon-' + (button.icon ? button.icon : defaultButton.icon),
            type: button.style || defaultButton.style,
            disabled: true
          })
          const temp = {
            key: button.button_type + i,
            label: button.label || defaultButton.label,
            // position的值有:toolbar manage search edit all
            hidden: true,
            icon: 'ibps-icon-' + (button.icon ? button.icon : defaultButton.icon),
            type: button.style || defaultButton.style,
            disabled: true
          }
          if (button.position && hasButton(button.button_type, 'search', button.position)) {
            temp.hidden = false
          }
          searchToolbars.push(temp)
        })

        // 显示字段
        const columns = []
        const displayColumns = this.template.display_columns || []
        displayColumns.forEach(column => {
          columns.push({
            prop: column.name,
            label: column.label,
            align: column.align,
            sortable: column.sortable
          })
        })

        // 查询字段
        const searchForms = []
        const queryColumns = this.template.query_columns || []
        queryColumns.forEach(column => {
          const fieldType = column.field_type || 'input'
          searchForms.push({
            prop: column.name,
            label: column.label,
            fieldType: fieldType === 'datePicker' ? 'date' : (fieldType === 'dateRange' ? 'daterange' : fieldType),
            options: column.field_options ? column.field_options.options || [] : [],
            field_options: column.field_options || {},
            modelValue: column.name,
            disabled: true
          })
        })

        this.listConfig = {
          toolbars: toolbars,
          searchToolbars: searchToolbars,
          columns: columns
        }
        this.listConfig.searchForm = null
        if (searchForms.length > 0) {
          this.listConfig.searchForm = {
            forms: searchForms
          }
        }

        this.showPagination = this.template.attrs ? this.template.attrs.need_page === 'Y' : true
        // 分页
        this.pagination.limit = this.template.attrs ? parseInt(this.template.attrs.page_size, 10) || 20 : 20

        this.indexRow = this.template.attrs ? this.template.attrs.indexRow || false : false
      },
      deep: true,
      immediate: true
    }
  },
  beforeDestroy() {
    this.data = null
    this.listConfig = null
    this.pagination = null
  }
}
</script>
