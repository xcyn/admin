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
    @ok="onStdWOOk"
  >
    <template slot="searchBar">
      <el-form-item label="仓库">
        <el-input v-model="stdWOProp.toolbarProp.searchData.slName" placeholder="请输入"></el-input>
      </el-form-item>
    </template>
  </z-dialog-table>
</template>
<script>
import * as storageLocationHttp from "@/api/cpApi/materialsManagement/basics/storageLocation";
import * as comnHttp from "@/api/cpApi/common/index";
export default {
  props: {
    multipleSelect: {
      type: Boolean,
      default: true
    },
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
        stations: [],
        title: "仓库选择",
        selectionHandle: this.stdWOSelection,
        key: "slId",
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
          dataSource: storageLocationHttp.list, // 表格分页查询接口， Promise 对象
          paginationHandle: this.busiPagination, // 分页条件处理 返回分页查询条件
          columns: [
            // 显示列
            {
              title: "仓库编码",
              key: "slNo"
            },
            {
              title: "仓库名称",
              key: "slName"
            },
            {
              title: "所属场站",
              key: "siteId",
              formatter: (row, column, cellValue) => {
                let val = cellValue;
                this.stations.forEach(item => {
                  if (item.ID_ == cellValue) {
                    val = item.NAME_;
                    return false;
                  }
                });
                return val;
              }
            },
            {
              title: "库管员",
              key: "storekeeperName"
            },
            {
              title: "备注",
              key: "memo"
            },
            {
              title: "状态",
              key: "inOn",
              formatter: (row, column, cellValue) => {
                return cellValue ? "启用" : "停用";
              }
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

  mounted() {
    // storageLocationHttp.list({
    //   isOn: true,
    //   pageSize: 1,
    //   pageNo: 20
    // }).then(res=>{
    // });;
    var param = {
      parameters: [
        {
          key: "key",
          value: "cz"
        }
      ]
    };
    comnHttp.findDataByKey(param).then(res => {
      this.stations = res.data.dataResult;
    });
  },

  methods: {
    selectStdWO() {
      let selected = {
        key: "igId",
        data: []
      };
      if (this.selectedIds != undefined && this.selectedNames != undefined) {
        let size = this.selectedIds.split(",").length;
        for (var i = 0; i < size; i++) {
          selected.data.push({
            slId: this.selectedIds.split(",")[i],
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
        slName: params.slName,
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
      return selection.slName;
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
