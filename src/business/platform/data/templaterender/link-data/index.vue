<template>
  <div v-if="structure==='list'">
    <template v-if="!readonly">
      <el-select
        v-if="!initLoading"
        v-model="selectData"
        v-load-more="loadMore"
        :filterable="filterable"
        :clearable="clearable"
        :no-data-text="showEmptyText"
        :loading="loading"
        :multiple="multiple"
        :placeholder="placeholder"
        style="width:100%"
        :remote="remote"
        :remote-method="remoteMethod"
        @focus="focusData"
        @change="changeData"
        @clear="clearData"
        v-on="listeners"
      >
        <el-option
          v-for="(item,i) in selectDataOptions"
          :key="i"
          :label="labelFilter(item,'label') "
          :value="labelFilter(item,'value') "
        />
      </el-select>
      <el-select v-else v-model="initValue" :placeholder="placeholder" style="width:100%" />
    </template>
    <!--只读-->
    <template v-else>
      <template v-if="!initLoading && $utils.isNotEmpty(treeDataOptions) && $utils.isNotEmpty(selectData)">
        <template v-if="multiple">
          <el-tag
            v-for="(item,index) in selectData"
            :key="item+index"
            disable-transitions
            class="ibps-mr-5"
          >
            {{ item|optionsFilter(treeDataOptions,'label') }}
          </el-tag>
        </template>
        <template v-else>
          {{ selectData|optionsFilter(treeDataOptions,'label') }}
        </template>
      </template>
    </template>
  </div>
  <ibps-tree-select
    v-else
    v-model="selectData"
    :data="treeData"
    :props="props"
    :node-key="pkKey"
    :multiple="multiple"
    :placeholder="placeholder"
    :empty-text="showEmptyText"
    :clearable="clearable"
    :filterable="filterable"
    :select-mode="selectMode"
    :display-mode="displayMode"
    :separator="separator"
    :disabled="disabled"
    :readonly="readonly"
    :readonly-text="readonlyText"
    @focus="focusData"
    @change="changeData"
    @clear="clearData"
    v-on="listeners"
  />
</template>
<script>
import { getByKey, queryDataTable, queryLinkData } from '@/api/platform/data/dataTemplate'
import ActionUtils from '@/utils/action'
import { remoteRequest } from '@/utils/remote'
import { getDynamicParamsConditions, buildLabelTitle, buildLinkLabelTitle } from '../utils'
import TreeUtils from '@/utils/tree'

import IbpsTreeSelect from '@/components/ibps-tree-select'

export default {
  components: {
    IbpsTreeSelect
  },
  props: {
    value: {
      type: [String, Number, Array, Object],
      default: ''
    },
    templateKey: { // 数据模版key
      type: String
    },
    allowEmptyDynamicParams: {
      type: Boolean,
      default: false
    },
    hasDynamicParams: {
      type: Boolean,
      default: false
    },
    dynamicParams: { // 动态参数
      type: Object
    },
    data: {
      type: Array
    },
    multiple: { // 是否多选
      type: Boolean,
      default: false
    },
    structure: {
      type: String,
      default: 'list'
    },
    valueKey: { // 值key
      type: String
    },
    labelType: { // 文本类型
      type: String,
      default: 'first'
    },
    labelKey: { // 文本key
      type: [String, Function]
    },
    config: { // 配置
      type: Object
    },
    disabled: { // 是否禁用
      type: Boolean,
      default: false
    },
    readonly: { // 是否只读
      type: Boolean,
      default: false
    },
    placeholder: { // 输入框占位文本
      type: String,
      default: '请选择'
    },
    emptyText: {
      type: String,
      default: '暂无数据'
    },
    store: { // 存储类型 对应[多选]有效，array 数组。string 字符串类型
      type: String,
      default: 'string',
      validator: function(value) {
        return ['array', 'string'].indexOf(value) !== -1
      }
    },
    storeSeparator: { // 存储值分割符，对于设置字符串类型的分隔符
      type: String,
      default: ','
    },
    clearable: { // 是否允许清空
      type: Boolean,
      default: true
    },
    filterable: { // 是否查询
      type: Boolean,
      default: true
    },
    emptyFilterText: { // 空的过滤条件
      type: String,
      default: '请输入或选择过滤条件'
    },
    pageable: { // 是否可分页
      type: Boolean,
      default: false
    },
    pageSize: { // 分页大小
      type: Number,
      default: 20
    },
    readonlyText: { // 只读样式
      type: String,
      default: 'original'
    }
  },
  data() {
    return {
      dataTemplate: {},
      template: {},

      loading: false,
      initLoading: true,
      initValue: '',

      pkKey: this.valueKey,
      props: {
        children: 'children',
        label: this.labelKey
      },
      listData: [],
      selectData: this.multiple ? [] : '',
      treeData: [],
      treeDataOptions: [],
      dynamicConditions: {},
      showEmptyText: this.emptyText,
      selectDataOptions: [],
      pagination: {
        page: 1,
        limit: 100,
        totalCount: 0
      }
    }
  },
  computed: {
    pidKey() {
      return this.config ? this.config.parentId || '' : ''
    },
    selectMode() {
      return this.config ? this.config.selectMode || 'any' : 'any'
    },
    displayMode() {
      return this.config ? this.config.displayMode || 'path' : 'path'
    },
    separator() {
      return this.config ? this.config.split || '/' : '/'
    },
    remote() {
      return !!this.pageable
    },
    listeners() {
      return {
        ...this.$listeners,
        input: (val) => { // 在 Input 值改变时触发
          this.emitEvent('input', this.getStoreValue(val))
        }
      }
    }
  },
  watch: {
    selectData(val, oldVal) {
      this.$emit('input', this.getStoreValue(val))
    },
    templateKey: {
      handler(val, oldVal) {
        if (val !== oldVal && val) {
          this.loadTemplateData()
        } else {
          this.treeData = []
          this.treeDataOptions = []
          this.selectDataOptions = []
        }
      },
      immediate: true
    },
    dynamicParams: {
      handler(val, oldVal) {
        if (!this.valueEqual(val, oldVal) && this.hasDynamicParams && !this.initLoading) {
          this.treeData = []
          this.treeDataOptions = []
          this.selectDataOptions = []
          this.clearData()
        }
      },
      immediate: true
    },
    structure: {
      handler(val, oldVal) {
        if (val !== oldVal && val) {
          this.loadTemplateData()
        }
      },
      immediate: true
    },
    emptyText(val, oldVal) {
      if (this.$utils.isEmpty(this.templateKey)) {
        this.showEmptyText = '请设置关联数据'
      } else {
        this.showEmptyText = val
      }
    },
    multiple(val, oldVal) {
      if (val !== oldVal && !this.initLoading) {
        this.initData()
      }
    },
    value: {
      handler(val, oldVal) {
        if (val !== oldVal && !this.initLoading) {
          this.initData()
          this.changeLinkAttr()
        }
      },
      immediate: true
    },
    labelKey: {
      handler(val, oldVal) {
        if (val !== oldVal && val) {
          this.props.label = buildLinkLabelTitle(this.labelType, this.labelKey, this.labelKey)
        }
      },
      immediate: true
    },
    valueKey: {
      handler(val, oldVal) {
        if (val !== oldVal && val) {
          this.pkKey = this.valueKey
        }
      },
      immediate: true
    }
  },
  created() {
    this.defaultPagination = JSON.parse(JSON.stringify(this.pagination))
  },
  beforeDestroy() {
    this.listData = null
    this.treeData = null
    this.treeDataOptions = null
    this.selectDataOptions = null
  },
  methods: {
    emitEvent(event) {
      this.$emit(event, ...Array.from(arguments).slice(1))
    },
    valueEqual(obj1, obj2) {
      const o1 = obj1 instanceof Object
      const o2 = obj2 instanceof Object
      // 判断是不是对象
      if (!o1 || !o2) {
        return obj1 === obj2
      }

      if (Object.keys(obj1).length !== Object.keys(obj2).length) {
        return false
      }

      for (var o in obj1) {
        const t1 = obj1[o] instanceof Object
        const t2 = obj2[o] instanceof Object
        if (t1 && t2) {
          return this.valueEqual(obj1[o], obj2[o])
        } else if (obj1[o] !== obj2[o]) {
          return false
        }
      }
      return true
    },
    labelFilter(item, key) {
      if (this.$utils.isEmpty(item)) {
        return ''
      }
      const opt = this.treeDataOptions.find((opt) => {
        return opt.value === item[this.pkKey]
      })
      return opt ? opt[key] : ''
    },
    /**
     *加载更多
     */
    loadMore() {
      this.$set(this.pagination, 'page', this.pagination.page + 1)
      if (this.pageable) {
        this.loadLinkData()
      } else {
        const pageSize = this.pagination.limit * (this.pagination.page - 1)
        if (pageSize >= this.pagination.totalCount) {
          return
        }
        const data = this.treeData.slice(pageSize + 1, pageSize + this.pagination.limit + 1)
        if (this.$utils.isNotEmpty(data)) {
          data.forEach(d => {
            this.selectDataOptions.push(d)
          })
        }
      }
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        if (this.pageable) {
          this.remoteQueryPageData(query)
        } else {
          this.remoteQueryData(query)
        }
      } else {
        this.$set(this.pagination, 'page', 1)
        this.selectDataOptions = this.treeData.slice(this.pagination.page - 1, this.pagination.limit + 1)
      }
    },
    remoteQueryData(query) {
      setTimeout(() => {
        this.loading = false
        this.selectDataOptions = this.treeData.filter(item => {
          let labelData = ''
          if (typeof this.props.label === 'string') {
            labelData = item[this.props.label] + ''
          } else {
            labelData = this.props.label(item) + ''
          }
          return labelData.toLowerCase()
            .indexOf(query.toLowerCase()) > -1
        })
      }, 200)
    },
    remoteQueryPageData(query) {
      const formParams = {
        key: this.templateKey,
        'dynamic_params': JSON.stringify(this.dynamicParams),
        queryKey: this.props.label,
        queryValue: query
      }
      this.selectDataOptions = []
      // 查询分页暂时写死
      const params = ActionUtils.formatParams(formParams, {
        page: 1,
        limit: 100
      })
      remoteRequest('dataTemplate_remoteQueryPageData', params, () => {
        return this.getRemoteQueryLinkDataFunc(params)
      }).then(response => {
        this.loading = false
        const d = response.data.data
        if (this.$utils.isNotEmpty(d)) {
          // this.pagination = responseData.pageResult
          this.selectDataOptions = this.selectDataOptions.concat(d)
          this.listData = this.treeData = this.selectDataOptions
          this.treeDataOptions = this.buildTreeDataOptions(this.selectDataOptions)
        }
      }).catch((error) => {
        console.error(error)
      })
    },
    loadTemplateData() {
      if (this.$utils.isEmpty(this.templateKey)) {
        return
      }
      this.loading = true
      remoteRequest('dataTemplate', this.templateKey, () => {
        return this.getRemoteDataTemplateFunc(this.templateKey)
      }).then(response => {
        this.loading = false
        this.dataTemplate = this.$utils.parseData(response.data)
        this.template = this.dataTemplate.templates[0]
        this.initDataTemplate()
        this.loadLinkData(true)
      }).catch(() => {
      })
    },
    getRemoteDataTemplateFunc(templateKey) {
      return new Promise((resolve, reject) => {
        getByKey({ dataTemplateKey: templateKey }).then(response => {
          resolve(response)
        }).catch((error) => {
          reject(error)
        })
      })
    },
    initDataTemplate() {
      this.pkKey = this.$utils.isEmpty(this.valueKey) ? this.dataTemplate.unique || 'id_' : this.valueKey
      this.props.label = this.buildLabelTitle(this.labelKey)
      this.dynamicConditions = getDynamicParamsConditions(this.dataTemplate)
    },
    /**
     * 构建标题
     */
    buildLabelTitle(labelKey) {
      if (this.$utils.isEmpty(labelKey)) {
        return buildLabelTitle(this.dataTemplate)
      } else {
        return buildLinkLabelTitle(this.labelType, labelKey, labelKey)
      }
    },
    focusData(event) {
      if (!event.sourceCapabilities) return // 如果是勾选或反选下拉选项
      if (!event.target.value) { // 输入框没有搜索条件时触发
        this.loadLinkData(true)
      }
    },
    /**
     * 加载联动数据
     */
    loadLinkData(init = false) {
      if (init) {
        this.listData = []
        this.treeData = []
        this.treeDataOptions = []
        this.selectDataOptions = []
        this.initLoading = true
      }
      if (this.$utils.isEmpty(this.templateKey)) {
        this.showEmptyText = '请设置关联数据'
        this.initLoading = false
        return
      }

      // 遍历所有条件
      if (this.$utils.isNotEmpty(this.dynamicConditions) && !this.allowEmptyDynamicParams) {
        for (const key in this.dynamicConditions) {
          const value = this.dynamicParams[key]
          if (this.$utils.isEmpty(value)) {
            this.listData = []
            this.treeData = []
            this.treeDataOptions = []
            this.selectDataOptions = []
            this.showEmptyText = this.emptyFilterText
            this.initLoading = false
            return
          }
        }
      }

      if (this.$utils.isEmpty(this.template)) {
        this.showEmptyText = '加载中...'
        this.initLoading = false
        return
      }
      this.showEmptyText = '加载中...'

      const params = this.getFormatParams()
      remoteRequest('dataTemplate', params, () => {
        return this.getRemoteQueryDataTableFunc(params)
      }).then(response => {
        this.showEmptyText = this.emptyText
        const responseData = response.data
        const data = responseData.dataResult || []

        if (this.structure === 'list') {
          if (this.pageable) { // 需要分页
            this.pagination = responseData.pageResult
            this.selectDataOptions = this.selectDataOptions.concat(data)
            this.listData = this.treeData = this.selectDataOptions
          } else { // 不需要分页，采用假分页，避免数据太多卡顿
            this.handlerPagination(JSON.parse(JSON.stringify(this.defaultPagination)))
            this.pagination.totalCount = data.length
            this.selectDataOptions = data.slice(this.pagination.page - 1, this.pagination.limit + 1)
            this.listData = this.treeData = data
          }
        } else {
          this.treeData = TreeUtils.transformToTreeFormat(data, {
            idKey: this.pkKey,
            pIdKey: this.pidKey
          })
          this.listData = data
        }

        this.treeDataOptions = this.buildTreeDataOptions(this.listData)

        if (init) {
          this.initLoading = false
          this.initData()
          this.changeData(this.value)
          this.changeLinkAttr()
        }
        this.$emit('load-data', this.listData)
      }).catch(() => {
        this.showEmptyText = '加载数据出错了'
        this.loading = false
        this.initLoading = false
      })
    },
    /**
     * 获取格式化参数
     */
    getFormatParams() {
      let formParams = {}
      if (this.$refs['searchForm']) {
        formParams = this.$refs['searchForm'].getSearcFormData() || {}
      }
      const responseData = JSON.parse(JSON.stringify(this.template))

      responseData.datasetKey = this.dataTemplate.datasetKey
      responseData.unique = this.pkKey
      responseData['key'] = this.templateKey
      responseData['dynamic_params'] = this.dynamicParams
      formParams['response_data'] = JSON.stringify(responseData)
      formParams['filter_condition_key'] = this.filterConditionKey || ''
      let pagination = null
      if (this.pageable) {
        pagination = {
          page: this.pagination.page,
          limit: this.pageSize
        }
      }
      return ActionUtils.formatParams(formParams, pagination)
    },
    buildTreeDataOptions(data) {
      return data.map(item => {
        let labelData = ''
        if (typeof this.props.label === 'string') {
          labelData = item[this.props.label]
        } else {
          labelData = this.props.label(item)
        }
        return {
          value: item[this.pkKey],
          label: labelData
        }
      })
    },
    getRemoteQueryDataTableFunc(p) {
      return new Promise((resolve, reject) => {
        queryDataTable(p).then(response => {
          resolve(response)
        }).catch((error) => {
          reject(error)
        })
      })
    },
    handlerPagination(pagination) {
      this.pagination = pagination
    },
    async initData() {
      let value
      if (this.multiple) {
        value = this.getArrayValue()
      } else {
        value = this.value
      }
      await this.initSelectDataOptions(value)
      this.selectData = value
    },
    async initSelectDataOptions(value) {
      if (this.$utils.isEmpty(this.selectDataOptions) || this.$utils.isEmpty(value)) return
      if (this.multiple) {
        value.forEach(async(data) => {
          await this.setSelectDataOptions(data)
        })
      } else {
        await this.setSelectDataOptions(value)
      }
    },
    async setSelectDataOptions(v) {
      const data = this.selectDataOptions.find((item) => {
        return item[this.valueKey] === v
      })
      if (!data) {
        // 不在选项里面
        if (this.pageable) {
          await this.getLinkData(v)
        } else {
          const d = this.getTreeData(v)
          if (d) {
            this.selectDataOptions.push(d)
          }
        }
      }
    },
    getTreeData(id) {
      return this.treeData.find((opt) => {
        return opt[this.pkKey] === id
      })
    },
    async getLinkData(v) {
      const formParams = {
        key: this.templateKey,
        'dynamic_params': JSON.stringify(this.dynamicParams),
        queryKey: this.pkKey,
        queryValue: v
      }

      const params = ActionUtils.formatParams(formParams, {
        page: 1,
        limit: 1
      })
      remoteRequest('dataTemplate_queryLinkData', params, () => {
        return this.getRemoteQueryLinkDataFunc(params)
      }).then(response => {
        const d = response.data.data
        if (this.$utils.isNotEmpty(d)) {
          const data = this.selectDataOptions.find((item) => {
            return item[this.valueKey] === v
          })
          if (!data) {
            this.selectDataOptions.push(d[0])
            this.treeDataOptions = this.buildTreeDataOptions(this.selectDataOptions)
          }
        }
      }).catch((error) => {
        console.error(error)
      })
    },
    getRemoteQueryLinkDataFunc(p) {
      return new Promise((resolve, reject) => {
        queryLinkData(p).then(response => {
          resolve(response)
        }).catch((error) => {
          reject(error)
        })
      })
    },
    getArrayValue() {
      if (this.store === 'string') {
        return this.$utils.isNotEmpty(this.value) ? this.value.split(this.storeSeparator) : []
      } else {
        return this.value || []
      }
    },
    getStoreValue(val) {
      if (this.multiple) {
        if (this.store === 'string') {
          return this.$utils.isNotEmpty(val) ? val.join(this.storeSeparator) : ''
        } else {
          return val || []
        }
      } else {
        return val
      }
    },
    getSelectedData(val) {
      if (this.$utils.isEmpty(val) || this.$utils.isEmpty(this.listData)) {
        return {}
      }
      const data = this.listData.find((d) => {
        if (d[this.pkKey] === val) { return d }
      })
      return data
    },
    clearData() {
      this.$set(this.pagination, 'page', 1)
      const val = ''
      this.$emit('input', this.getStoreValue(val))
      this.changeData(val)
      this.changeLinkAttr()
    },
    changeData(val) {
      if (!this.multiple) {
        this.$emit('change-link-data', val, this.getSelectedData(val))
      }
    },
    changeLinkAttr() {
      if (!this.multiple) {
        this.$emit('change-link-attr', this.value, this.getSelectedData(this.value))
      }
    }
  }

}
</script>
