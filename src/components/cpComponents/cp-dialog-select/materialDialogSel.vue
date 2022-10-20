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
      <el-form-item label="物资">
        <el-input v-model="stdWOProp.toolbarProp.searchData.itemName" placeholder="请输入"></el-input>
      </el-form-item>
    </template>
  </z-dialog-table>
</template>
<script>
import * as materialClassifyHttp from "@/api/cpApi/materialsManagement/basics/materialClassify";
import * as materialHttp from "@/api/cpApi/materialsManagement/basics/material";
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
        title: "物资主数据",
        baseUnitList: [],
        selectionHandle: this.stdWOSelection,
        key: "igId",
        toolbarProp: {
          // 搜索数据
          searchData: {
            isOn: true,
            igName: ""
          }
        },
        // 表格属性
        tableProp: {
          multipleSelect: this.multipleSelect, // 是否可多选
          dataSource: materialHttp.list, // 表格分页查询接口， Promise 对象
          paginationHandle: this.busiPagination, // 分页条件处理 返回分页查询条件
          columns: [
            // 显示列
            {
              title: "物资编码",
              key: "itemNo"
            },
            {
              title: "物资名称",
              key: "itemName"
            },
            {
              title: "规格型号",
              key: "modelNo"
            },
            {
              title: "规格型号",
              key: "modelNo"
            },
            {
              title: "材质/技术参数",
              key: "techParam"
            },
            {
              title: "计量单位",
              key: "baseUnit",
              formatter: (row, col, val) => {
                this.baseUnitList.forEach(item => {
                  if (item.id == val) {
                    val = item.name;
                    return false;
                  }
                });
                return val;
              }
            },
            {
              title: "物资分类",
              key: "icName"
            },
            {
              title: "所属分组",
              key: "igName"
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
    getDictByTypeKey() {
      let param = { typeKey: "jldw" };
      dictHttp.getDictByTypeKey(param).then(ret => {
        this.baseUnitList = ret.data;
      });
    },
    dialogloadTreeData(node, resolve, loadDone) {
      materialClassifyHttp.tree().then(res => {
        resolve(res.result.children);
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

    onStdWOSearch(params) {
      // 加载列表数据
      const pa = {
        itemName: params.itemName,
        isOn: true
      };
      this.$refs.stdWODiaTb.tableQuery(pa);
    },

    /**
     * 返回分页条件
     */
    busiPagination(pagination) {
      return { pageNo: pagination.pageNo, pageSize: pagination.limit };
    },

    /**
     * 处理勾选数据展示
     */
    stdWOSelection(selection) {
      // 标准工单
      return selection.itemName;
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
@import url("./dialog.css");
</style>
