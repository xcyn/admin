<template>
  <!-- 供应商选择器 -->
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
      <el-form-item label="供应商">
        <el-input v-model="stdWOProp.toolbarProp.searchData.searchKey" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item title="供应商分类">
        <el-select
          v-model="stdWOProp.toolbarProp.searchData.suppType"
          placeholder="请选择供应商分类"
          clearable
        >
          <el-option
            v-for="(item,index) of suppTypeList"
            :key="index"
            :value="item.id"
            :label="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item title="级别">
        <el-select
          v-model="stdWOProp.toolbarProp.searchData.suppLevel"
          placeholder="请选择级别"
          clearable
        >
          <el-option
            v-for="item in suppLevelList"
            :key="item.key"
            :value="item.id"
            :label="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
    </template>
  </z-dialog-table>
</template>
<script>
import * as supplierHttp from "@/api/cpApi/materialsManagement/basics/supplier";
import * as dictHttp from "@/api/cpApi/dict/index";
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
      suppTypeList: [],
      suppLevelList: [],
      stdWOProp: {
        title: "供应商",
        selectionHandle: this.stdWOSelection,
        key: "suppId",
        toolbarProp: {
          // 搜索数据
          searchData: {
            status: true,
            searchKey: "",
            suppType: "",
            suppLevel: ""
          }
        },
        // 表格属性
        tableProp: {
          multipleSelect: this.multipleSelect, // 是否可多选
          dataSource: supplierHttp.list, // 表格分页查询接口， Promise 对象
          paginationHandle: this.busiPagination, // 分页条件处理 返回分页查询条件
          columns: [
            // 显示列
            {
              title: "供应商编码",
              key: "suppNo"
            },
            {
              title: "供应商名称",
              key: "suppName"
            },
            {
              title: "供应商分类",
              key: "suppType",
              formatter: (row, column, cellValue) => {
                let val = cellValue;
                this.suppTypeList.forEach(item => {
                  if (item.id == cellValue) {
                    val = item.name;
                    return false;
                  }
                });
                return val;
              }
            },
            {
              title: "级别",
              key: "suppLevel",
              formatter: (row, column, cellValue) => {
                let val = cellValue;
                this.suppLevelList.forEach(item => {
                  if (item.id == cellValue) {
                    val = item.name;
                    return false;
                  }
                });
                return val;
              }
            },
            {
              title: "区域",
              key: "areaId"
            },
            {
              title: "业务负责人",
              key: "bizRespPerson"
            },
            {
              title: "移动电话",
              key: "bizRespMobile"
            },
            {
              title: "电子邮箱",
              key: "bizRespMail"
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
    let param = { typeKey: "gysjb" };
    dictHttp.getDictByTypeKey(param).then(ret => {
      this.suppLevelList = ret.data;
    });

    param = { typeKey: "gysfl" };
    dictHttp.getDictByTypeKey(param).then(ret => {
      this.suppTypeList = ret.data;
    });
  },

  methods: {
    selectStdWO() {
      let selected = {
        key: "suppId",
        data: []
      };
      if (this.selectedIds != undefined && this.selectedNames != undefined) {
        let size = this.selectedIds.split(",").length;
        for (var i = 0; i < size; i++) {
          selected.data.push({
            suppId: this.selectedIds.split(",")[i],
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
              status: true
            },
            this.initParam
          );
          this.$refs.stdWODiaTb.tableQuery(pa);
        }, 600);
      });
    },

    reset() {
      this.stdWOProp.toolbarProp.searchData.searchKey = "";
      this.stdWOProp.toolbarProp.searchData.suppType = "";
      this.stdWOProp.toolbarProp.searchData.suppLevel = "";
    },

    onStdWOSearch(params) {
      // 加载列表数据
      const pa = {
        searchKey: params.searchKey,
        suppType: params.suppType,
        suppLevel: params.suppLevel,
        status: true
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
      return selection.suppName;
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
