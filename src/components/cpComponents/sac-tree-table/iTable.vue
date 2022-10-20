<template>
  <div class="dmc-table-wrap">
    <el-table ref="elTable"  :height="maxHeight"  v-bind="$attrs" v-loading.iTable="loading" style="overflow-y:auto" :stripe="true" size="small" :border="border" :data="computedTableData" :max-height="tabelHeight" highlight-current-row :header-cell-class-name="headerRowClassName" :cell-class-name="cellClassName" :span-method="tableSpanMethod" v-on="$listeners" @row-click="rowClick" @sort-change="sortChange" @selection-change="changeFun">
      <slot name="expand" />
      <el-table-column v-if="selection" type="selection" width="40" align="center" />
      <el-table-column v-if="!selection" align="center" type="index" label="序号" width="70" />
      <!--region 表格-->
      <template v-for="(column,index) in columns">
        <el-table-column v-if="column.show == null || column.show == true" :key="(column.prop||column.label)+index" show-overflow-tooltip :fixed="column.fixed" :sortable="column.sortable" :prop="column.prop" :type="column.type" :align="column.align" :label="column.label" :width="column.width" :min-width="column.minWidth||''">
          <template v-if="column.headRender" slot="header">
            <header-content :column="column" />
          </template>
          <template slot-scope="scope">
            <template v-if="!column.render">
              <span v-if="!column.format">
                <span>{{ scope.row[column.prop] }}</span>
              </span>
              <span v-else @click="column.method&&column.method(scope.row,column,scope.row[column.prop])" v-html="column.format(scope.row,column,scope.row[column.prop])" />
            </template>
            <template v-else>
              <node-content :column="column" :row="scope.row" />
            </template>
          </template>
        </el-table-column>
      </template>
      <!--endregion-->
      <!--region 表格操作-->
      <el-table-column v-if="operateColumn" :fixed="operateColumn.fixed" :label="operateColumn.label||'操作'" :width="60">
        <template slot-scope="scope">
          <el-popover placement="top" trigger="hover">
            <div>
              <template v-for="(operate,operateIndex) in operateColumn.list">
                <template v-if="operate.isShowBtn">
                  <el-button v-if="operate.isShowBtn(scope.row)" :key="operateIndex" type="primary" size="mini" @click="operate.clickFun(scope.row)">{{ operate.text }}</el-button>
                </template>
                <el-button v-else :key="operateIndex" type="primary" size="mini" @click="operate.clickFun(scope.row)">{{ operate.text }}</el-button>
              </template>
            </div>
            <div slot="reference" style="background: #606266;width: 16px ;height: 16px;border-radius: 50%;    margin: 12px auto 0 auto;">
              <i class="el-icon-arrow-down" style="color: #fff;    vertical-align: 12px;margin-left: 2px;font-size: 12px;" />
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <!--endregion-->
    </el-table>
    <div class="bottom-content">
      <!--分页-->
      <div v-if="showPagination&&!loading" class="block pagination">
        <el-pagination :current-page="pagination.current" :page-size="pagination.size" background layout="total, sizes, prev, pager, next, jumper" :total="pagination.total" @current-change="handleCurrentChange" @size-change="handleSizeChange">
          <!-- <span class="el-pagination__total">
            第{{(tablePagination.current-1)*computedPagination.size+1}}到第
            {{(tablePagination.current-1)*computedPagination.size+computedTableData.length}}条
          </span> -->
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {
    NodeContent: {
      props: {
        column: {
          required: true
        },
        row: {
          required: true
        }
      },
      render(h) {
        return h('div', {}, [this.column.render(this.row, this.column)])
      }
    },
    HeaderContent: {
      props: {
        column: {
          required: true
        }
      },
      render(h) {
        return h(
          'div',
          {
            attrs: { class: 'clear-div' }
          },
          [this.column.headRender(this.column)]
        )
      }
    }
  },
  inheritAttrs: false,
  props: {
    tableData: Array, // 表格数据
    columns: Array, // 表头
    loading: Boolean, // 是否加表格loading
    customStyle: String, // 自定义样式
    pagination: {
      type: Object,
      default: {
        current: 1,
        size: 20,
        total: 0
      }
    }, // 分页
    operateColumn: {
      type: Object
    }, // 操作集合
    selection: {
      type: Boolean,
      default: false
    },
    maxHeight: {
      type: [Number, Object],
      default: null
    },
    otherHeight: {
      type: Number,
      default: 0
    }, // 表格之外的高度
    selectedKeys: {
      type: Object
    },
    showPagination: {
      type: Boolean,
      default: true
    }, // 是否显示分页
    headerRowClassName: {
      type: Function,
      default: ({ row, rowIndex }) => {
        return 'table-header-row'
      }
    },
    cellClassName: {
      type: Function,
      default: ({ row, rowIndex }) => {
        return 'table-cell-row'
      }
    },
    spanMethod: {
      type: Function
    },
    border: {
      type: Boolean,
      default: true
    },
    customSortChange: {
      type: Function
    },
    frame: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      sort: undefined,
      oHieght: 0,
      tabelHeight: 100,
      checkedData: []
    }
  },
  computed: {
    computedPagination() {
      if (this.pagination) {
        return this.pagination
      }
      return {
        size: this.pagination.size,
        total: this.tableData ? this.tableData.length : 0
      }
    },
    computedTableData() {
      this.handleResize()

      if (!this.showPagination || this.pagination) {
        return this.initSpanData(this.tableData)
      }
      if (this.tableData) {
        return this.initSpanData(
          this.tableData.slice(
            (this.pagination.current - 1) * this.pagination.size,
            this.pagination.current * this.pagination.size
          )
        )
      }
      return null
    }
  },
  watch: {},
  created() {
    // console.log(this.$attrs, 'button-$attrs')
    // console.log(this.$listeners, 'button-$listeners')
  },
  mounted() {
    window.addEventListener('resize', this.handleResize)
  },
  methods: {
    // 自动分页的情况下，重新查询时回到第一页
    initPagination() {
      this.pagination.current = 1
    },
    handleSizeChange(pageSize) {
      this.pagination = {
        current: 1,
        size: pageSize,
        total: this.pagination.total
      }
      console.log(this.pagination, 'this.pagination')
      this.$emit('handleTableChange', this.pagination)
    },
    handleCurrentChange(current, emit = true) {
      document.getElementsByClassName(
        'el-table__body-wrapper'
      )[0].scrollTop = 0
      if (this.pagination) {
        this.pagination = {
          current,
          size: this.pagination.size,
          total: this.pagination.total
        }
        console.log(this.pagination, 'this.paginationss')
        if (emit) {
          this.$emit('handleTableChange', this.pagination, this.sort)
        }
      }
    },
    sortChange(sort) {
      if (this.customSortChange) {
        this.customSortChange(sort)
      } else {
        document.getElementsByClassName(
          'el-table__body-wrapper'
        )[0].scrollTop = 0
        if (sort.prop) {
          this.sort = {
            prop: sort.prop,
            order: sort.order
          }
        } else {
          this.sort = undefined
        }
        this.$emit('handleTableChange', this.pagination, this.sort)
      }
    },
    changeFun(value, emit = true) {
      this.checkedData = value
      if (emit) {
        this.$emit('handleSelectChange', value)
      }
    },
    rowClick(row, column, event) {
      this.$emit('rowClick', row)
    },
    tableSpanMethod({ row, column, rowIndex, columnIndex }) {
      const spans = this.columns.filter(x => x.span)
      if (this.spanMethod) {
        // 自定义合并规则
        return this.spanMethod({ row, column, rowIndex, columnIndex })
      } else {
        if (spans.length > 0) {
          // 数据列数据合并
          for (let i = 0; i < spans.length; i++) {
            if (spans[i].label === column.label) {
              return {
                rowspan:
                  row['_' + spans[i].prop + 'SpanCount'] === undefined
                    ? row._commonSpanCount
                    : row['_' + spans[i].prop + 'SpanCount'],
                colspan:
                  ('_' + row[spans[i].prop + 'SpanCount'] === undefined
                    ? row._commonSpanCount
                    : row['_' + spans[i].prop + 'SpanCount']) === 0
                    ? 0
                    : 1
              }
            }
          }
        }
        if (this.operateColumn && this.operateColumn.span) {
          // 操作列数据合并
          if (column.label === '操作') {
            return {
              rowspan:
                row._operateColumnSpanCount === undefined
                  ? row._commonSpanCount
                  : row._operateColumnSpanCount,
              colspan:
                ('_' + row['operateColumn' + 'SpanCount'] === undefined
                  ? row._commonSpanCount
                  : row._operateColumnSpanCount) === 0
                  ? 0
                  : 1
            }
          }
        }
      }
    },
    initSpanData(list) {
      const spans = this.columns.filter(x => x.span)
      if (spans && spans.length > 0) {
        list.forEach(x => {
          x._commonSpanCount = 1
        })
        for (let i = list.length - 1; i >= 1; i--) {
          spans.forEach(y => {
            if (y.span(list[i - 1], list[i])) {
              list[i - 1]['_' + y.prop + 'SpanCount'] =
                list[i - 1]._commonSpanCount +
                (list[i]['_' + y.prop + 'SpanCount'] > 0
                  ? list[i]['_' + y.prop + 'SpanCount']
                  : list[i]._commonSpanCount)
              list[i]['_' + y.prop + 'SpanCount'] = 0
            }
          })
        }
      }
      if (this.operateColumn && this.operateColumn.span) {
        for (let i = list.length - 1; i >= 1; i--) {
          if (this.operateColumn.span(list[i - 1], list[i])) {
            list[i - 1]._operateColumnSpanCount =
              list[i - 1]._commonSpanCount +
              (list[i]._operateColumnSpanCount > 0
                ? list[i]._operateColumnSpanCount
                : list[i]._commonSpanCount)
            list[i]._operateColumnSpanCount = 0
          }
        }
      }
      return list
    },
    toggleAllSelection() {
      this.$refs.elTable.toggleAllSelection()
    },
    clearSelection() {
      this.$refs.elTable.clearSelection()
    },
    toggleRowSelection(info) {
      console.log(info)
      this.$refs.elTable.toggleRowSelection(info, true)
      this.$forceUpdate()
    },
    setHeight(h) {
      this.oHieght = h
      this.handleResize()
    },
    handleResize() {
      this.tabelHeight = this.height()
      var obj = document.getElementsByClassName('left')
      if (obj.length > 0) {
        obj[0].setAttribute('style', 'height:' + this.tabelHeight + 'px')
      }
    },
    height() {
      var w_h =
        document.documentElement.clientHeight || document.body.clientHeight
      return w_h - 310 - this.oHieght - this.otherHeight
      // if (this.maxHeight === null) {
      // if (this.tableData) {
      //   let h = this.otherHeight + 60;
      //   if (
      //     document.getElementsByClassName("filtersForm") &&
      //     document.getElementsByClassName("filtersForm").length > 0
      //   ) {
      //     h =
      //       document.getElementsByClassName("filtersForm")[0].clientHeight -
      //       510;
      //   }
      //   console.log("h:", h);
      //   var w_h =
      //     document.documentElement.clientHeight || document.body.clientHeight;
      //   return 500;
      // }
      //   return undefined;
      // } else if (this.maxHeight === 0) {
      //   return undefined;
      // } else {
      //   return this.maxHeight;
      // }
    }
  }
}
</script>
<style lang="scss" scoped>
.dmc-table-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
  .el-table {
    // margin-bottom: 37px !important;
  }
}
.bottom-content {
  height: 30px;
  padding: 6px 20px;
  border-top: none !important;
  bottom: 0px !important;
}
.el-table {
  flex: 1;
}
.el-table-column--selection .cell {
  padding-left: 0;
}

.clear-div {
  padding: 0;
  margin: 0;
  height: 22.73px;
  display: flex;
  align-items: center;
  div {
    padding: 0;
    margin: 0;
    line-height: 0;
  }
}

.operate-simple-btn + .operate-simple-btn {
  margin-top: 5px;
  margin-left: 0;
}
.dmc-table-wrap ::v-deep .el-table--scrollable-y .el-table__body-wrapper {
  max-height: calc(100% - 40px) !important;
}
</style>

