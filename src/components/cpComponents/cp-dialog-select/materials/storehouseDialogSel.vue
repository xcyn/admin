<template>
  <z-dialog-table
    ref="stdWODiaTb"
    :title="stdWOProp.title"
    :key_="stdWOProp.key"
    :toolbar-prop="stdWOProp.toolbarProp"
    :table-prop="stdWOProp.tableProp"
    :tree-prop="stdWOProp.treeProp"
    :selection-handle="stdWOProp.selectionHandle"
    @tree-click="onTreeClick"
    @toolbar-search="onStdWOSearch"
    @ok="onStdWOOk"
  >
    <template slot="searchBar">
      <el-form-item label="仓库">
        <el-input v-model="stdWOProp.toolbarProp.searchData.searchKey" placeholder="请输入"></el-input>
      </el-form-item>
    </template>
  </z-dialog-table>
</template>
<script>
import * as materialClassifyHttp from "@/api/cpApi/materialsManagement/basics/materialClassify";
import * as storehouseHttp from "@/api/cpApi/materialsManagement/basics/storehouse";
import * as dictHttp from "@/api/cpApi/dict/index";

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
        title: "仓位",
        selectionHandle: this.stdWOSelection,
        key: "id",
        toolbarProp: {
          // 搜索数据
          searchData: {
            status: 0,
            searchKey: ""
          }
        },
        // 表格属性
        tableProp: {
          multipleSelect: this.multipleSelect, // 是否可多选
          dataSource: storehouseHttp.list, // 表格分页查询接口， Promise 对象
          paginationHandle: this.busiPagination, // 分页条件处理 返回分页查询条件
          columns: [
            // 显示列
            {
              title: "仓位",
              key: "hjh"
            },
            {
              title: "所属仓库",
              key: "slName"
            },
            {
              title: "备注",
              key: "remark"
            }
          ]
        },
        // 树控件属性
        treeProp: {
          title: "物资分类",
          nodeKey: "icId",

          multipleSelect: false,
          treeData: this.dialogloadTreeData,
          lazyLoad: false,
          propMapping: {
            // 根据返回值的映射
            label: "icName",
            children: "children"
          }
        }
      }
    };
  },

  mounted() {
    this.getDictByTypeKey();
  },

  methods: {
    getDictByTypeKey() {},
    dialogloadTreeData(node, resolve, loadDone) {
      materialClassifyHttp.tree().then(res => {
        resolve(res.data.children);
        loadDone();
      });
    },
    onTreeClick(node) {
      console.log(node);
      const pa = Object.assign(
        {
          isOn: true,
          icId: node.icId
        },
        this.initParam
      );
      this.$refs.stdWODiaTb.tableQuery(pa);
    },
    selectStdWO() {
      let selected = {
        key: "itemId",
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
        status: 0
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
      return selection.hjh;
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
 @import "../../../../../assets/cpStyle/style/dialog.css";
</style>
