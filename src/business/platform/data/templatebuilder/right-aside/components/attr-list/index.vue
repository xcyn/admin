<template>
  <div class="panel panel-default">
    <div class="panel-heading">列表</div>
    <div class="panel-body">
      <el-form
        size="mini"
        label-width="120px"
        @submit.native.prevent
      >
        <el-form-item>
          <template slot="label">初始化是否查询:</template>
          <el-switch
            v-model="attrs.init_query"
            active-value="Y"
            inactive-value="N"
            @change="(value)=>handleData('init_query',value)"
          />
          <el-button v-if="attrs.init_query==='Y'" style="margin-left:5px;" type="primary" icon="el-icon-s-tools" size="mini" @click="setQueryCondition">设置默认条件</el-button>
        </el-form-item>
        <el-form-item>
          <template slot="label">是否显示序号:</template>
          <el-switch
            v-model="attrs.indexRow"
            :active-value="true"
            :inactive-value="false"
            @change="(value)=>handleData('index',value)"
          />
        </el-form-item>
        <el-form-item>
          <template slot="label">是否分页:</template>
          <el-switch
            v-model="attrs.need_page"
            active-value="Y"
            inactive-value="N"
            @change="(value)=>handleData('need_page',value)"
          />
        </el-form-item>
        <el-form-item v-if="attrs.need_page==='Y'">
          <template slot="label">分页大小:</template>
          <el-select
            v-model="attrs.page_size"
            placeholder="分页大小"
            @change="(value)=>handleData('page_size',value)"
          >
            <el-option
              v-for="item in pageSizeOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <template slot="label">是否自定义列:</template>
          <el-switch
            v-model="attrs.display_field"
            active-value="Y"
            inactive-value="N"
            @change="(value)=>handleData('display_field',value)"
          />
        </el-form-item>
        <el-form-item>
          <template slot="label">显示多选框:</template>
          <el-switch
            v-model="selectionRow"
            @change="(value)=>handleData('selectionRow',value)"
          />
        </el-form-item>
        <el-form-item>
          <template slot="label">管理列主题:</template>
          <el-switch
            v-model="attrs.manage_effect"
            active-value="Y"
            inactive-value="N"
            active-text="按钮"
            inactive-text="默认"
            @change="(value)=>{
              handleData('manage_effect',value)
              handleData('row_handle_show_icon',true)
            }"
          />
        </el-form-item>
        <el-form-item v-if="attrs.manage_effect==='Y'">
          <template slot="label">显示按钮数量:</template>
          <el-input v-model="attrs.button_number" placeholder="默认显示所有按钮" />
        </el-form-item>
        <el-form-item v-if="attrs.manage_effect==='Y'">
          <template slot="label">管理列宽度:</template>
          <el-input v-model="attrs.row_handle_width" type="number" placeholder="默认列表原先宽度" />
        </el-form-item>
        <el-form-item v-if="attrs.manage_effect==='Y'">
          <template slot="label">管理显示图标:</template>
          <el-switch v-model="attrs.row_handle_show_icon" />
        </el-form-item>
        <el-form-item>
          <template slot="label">列表背景设置:</template>
          <el-button type="primary" icon="el-icon-s-tools" size="mini" @click="setListRowBackground">设置</el-button>
        </el-form-item>
        <el-form-item prop="es_enable">
          <template slot="label">ES检索:</template>
          <el-switch
            v-model="attrs.es_enable"
            :active-value="true"
            :inactive-value="false"
            active-text="开启"
            inactive-text="不开启"
          />
        </el-form-item>
      </el-form>
    </div>
    <query-condition-dialog :data="attrs.default_query_condition" :visible.sync="queryConditionDialogVisible" :fields="fields" title="默认条件设置" @callback="handleData" />
    <list-row-background :data="attrs.default_list_row_background" :visible.sync="listRowBackgroundVisible" :fields="fields" title="列表背景设置" @callback="handleData" />
  </div>
</template>
<script>
import queryConditionDialog from './query-condition-dialog'
import listRowBackground from './list-row-background'
export default {
  components: {
    queryConditionDialog,
    listRowBackground
  },
  props: {
    data: Object,
    fields: Array,
    defaultValue: { // 默认值
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      attrs: {},
      pageSizeOptions: [10, 20, 50, 100],
      queryConditionDialogVisible: false,
      listRowBackgroundVisible: false,
      selectionRow: this.attrs ? this.attrs.selectionRow : undefined
    }
  },
  computed: {
    isSelectionRow: {
      get() {
        return this.$utils.toBoolean(this.selectionRow, true)
      },
      set(val) {
        this.selectionRow = val
        if (this.attrs) {
          this.$set(this.attrs, 'selectionRow', val)
        }
      }
    }
  },
  watch: {
    'data.attrs': {
      handler: function(val, oldVal) {
        this.attrs = this.data.attrs || {}
        this.selectionRow = this.attrs ? this.attrs.selectionRow : true
      },
      immediate: true
    },
    selectionRow: {
      handler(val, oldVal) {
        if (this.attrs && this.$utils.isEmpty(this.attrs.selectionRow)) {
          this.isSelectionRow = true
          if (this.attrs) {
            this.$set(this.attrs, 'selectionRow', this.isSelectionRow)
          }
        } else {
          if (val !== oldVal) {
            this.isSelectionRow = val
            if (this.attrs) {
              this.$set(this.attrs, 'selectionRow', this.isSelectionRow)
            }
          }
        }
      },
      immediate: true
    }
  },
  beforeDestroy() {
    this.attrs = null
  },
  methods: {
    handleData(key, value) {
      this.$emit('input', key, value)
      if (key === 'init_query' && value === 'N') {
        this.$emit('input', 'default_query_condition', [])
      }
    },
    setQueryCondition() {
      this.queryConditionDialogVisible = true
    },
    setListRowBackground() {
      this.listRowBackgroundVisible = true
    }
  }
}
</script>
