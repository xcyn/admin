<template>
  <z-dialog-table
    ref="stdWODiaTb"
    :title="stdWOProp.title"
    :key_="stdWOProp.key"
    :toolbar-prop="stdWOProp.toolbarProp"
    :table-prop="stdWOProp.tableProp"
    :tree-prop="stdWOProp.treeProp"
    :selection-handle="stdWOProp.selectionHandle"
    @toolbar-search="onStdWOSearch"
    @on-reset="reset"
    @ok="onStdWOOk"
  >
    <template slot="searchBar">
      <el-form-item label="物资分类">
        <el-input v-model="stdWOProp.toolbarProp.searchData.searchKey" placeholder="请输入"></el-input>
      </el-form-item>
    </template>
  </z-dialog-table>
</template>
<script>
import * as materialClassifyHttp from "@/api/cpApi/materialsManagement/basics/materialClassify";
export default {
  props: {
    multipleSelect: {
      type: Boolean,
      default: true
    },
    /**
     * 初始化条件
     * :initParam="{woTypeNo:'ta_pw'}"
     * 只查询定期工单
     */
    initParam: {
      type: Object,
      default: null
    },
    selectedIds: {
      type: String
    },
    selectedNames: {
      type: String
    }
  },

  data() {
    return {
      stdWOProp: {
        title: "物资分类",
        selectionHandle: this.stdWOSelection,
        key: "icId",
        toolbarProp: {
          // 搜索数据
          searchData: {
            isOn: true,
            searchKey: ""
          }
        },
        // 表格属性
        tableProp: {
          multipleSelect: this.multipleSelect, // 是否可多选
          dataSource: materialClassifyHttp.list, // 表格分页查询接口， Promise 对象
          paginationHandle: this.busiPagination, // 分页条件处理 返回分页查询条件
          columns: [
            // 显示列
            {
              title: "物资分类编码",
              key: "icNo"
            },
            {
              title: "物资分类名称",
              key: "icName"
            },
            {
              title: "上级分类",
              key: "parentIcName",
              formatter: (row, column, cellValue) => {
                return cellValue == "0" ? "" : cellValue;
              }
            },
            {
              title: "所属分组",
              key: "igName"
            }
          ]
        },
        // 树控件属性
        treeProp: {
          show: false
        }
      }
    };
  },

  mounted() {},

  methods: {
    selectStdWO() {
      let selected = {
        key: "icId",
        data: []
      };
      if (this.selectedIds != undefined && this.selectedNames != undefined) {
        let size = this.selectedIds.split(",").length;
        for (var i = 0; i < size; i++) {
          selected.data.push({
            stdWoId: this.selectedIds.split(",")[i],
            text: this.selectedNames.split(",")[i]
          });
        }
      }
      this.$refs.stdWODiaTb.open(selected);
      // 加载弹出框列表数据
      this.$nextTick(() => {
        setTimeout(() => {
          const pa = Object.assign(
            {
              isOn: true
            },
            this.initParam
          );
          this.$refs.stdWODiaTb.tableQuery(pa);
        }, 600);
      });
    },
    reset() {
      this.stdWOProp.toolbarProp.searchData.searchKey = "";
    },
    onStdWOSearch(params) {
      // 加载列表数据
      const pa = {
        searchKey: params.searchKey,
        isOn: true
      };
      this.$refs.stdWODiaTb.tableQuery(pa);
    },

    /**
     * 返回分页条件
     */
    busiPagination(pagination) {
      return { pageNo: pagination.pageNo, limit: pagination.limit };
    },

    /**
     * 处理勾选数据展示
     */
    stdWOSelection(selection) {
      // 标准工单
      return selection.icName;
    },

    /**
     * 弹出表格确定事件
     */
    onStdWOOk(seleted) {
      this.$emit("onDTableOk", seleted);
    },

    init() {
      this.selectStdWO();
    }
  }
};
</script>
<style scoped>
@import url("../dialog.css");
</style>
