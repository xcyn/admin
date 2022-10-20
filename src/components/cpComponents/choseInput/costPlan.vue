<template>
  <div id="selectInput">
    <el-dialog
      class="yj-dialog"
      append-to-body
      :visible.sync="choseDialogVisible"
    >
      <div slot="title">
        <span>费用年度计划</span>
      </div>
      <div class="sac-tree-table" style="margin:-20px 0 0 0;">
        <div class="filter-top">
          <el-form
            :model="searchForm"
            ref="searchForm"
            label-width="90px"
            :inline="true"
            class="yj-search-form"
          >
            <el-form-item label="年份" class="yl-col6">
              <el-input v-model="searchForm.year" placeholder="请输入年份" :clearable="true"></el-input>
            </el-form-item>
            <el-form-item label="公司" class="yl-col6">
              <orgSelect
                :ph="'请选择公司'"
                :levelID="466946461976756224"
                :org="searchForm.company"
                @edit="searchForm.companyId=arguments[0];searchForm.company=arguments[1]"
                ref="orgselect"
              ></orgSelect>
            </el-form-item>
            <el-form-item label="部门" class="yl-col6">
              <orgSelect
                :ph="'请选择部门'"
                :levelID="743056808754544640"
                @edit="searchForm.departmentId=arguments[0]"
                ref="departmentsselect"
              ></orgSelect>
            </el-form-item>
            <el-form-item label class="yl-col6">
              <el-button type="primary" size="small" @click="getList">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div id="org-tree-table">
          <div class="right">
            <iTable
              :table-data="dataList"
              :columns="columns"
              :loading="loading"
              :pagination="pagination"
              @handleTableChange="handleTableChange"
              @rowClick="rowClick"
              ref="iTable"
            ></iTable>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import iTable from "@/components/cpComponents/sac-tree-table/iTable.vue";
import * as safetFeeHttp from "@/api/cpApi/base/safetFee/plan";
import * as codeHttp from "@/api/cpApi/code";
import { code } from "@/utils/cpUtils/constant";
import orgSelect from "@/components/cpComponents/org-select/index";

export default {
  name: "choseInput",
  props: ["choseDialogVisible"],
  components: {
    iTable,
    orgSelect
  },
  data() {
    return {
      loading: false,
      yalxOptions: [],
      yllxOptions: [],
      yljbOptions: [],
      searchForm: {
        status: "0"
      },
      value: "",
      columns: [
        {
          prop: "year",
          label: "年度"
        },
        {
          prop: "company",
          label: "公司"
        },
        {
          prop: "department",
          label: "部门"
        },
        {
          prop: "planFee",
          label: "计划费用(万元)"
        },
        {
          prop: "usedFee",
          label: "实际使用(万元)"
        },
        {
          prop: "updateTime",
          label: "最近更新时间"
        },
        {
          prop: "updateUser",
          label: "更新人"
        }
      ],
      dataList: [],
      pagination: {
        size: 20,
        total: 0
      }
    };
  },
  mounted() {
    codeHttp.getIbpsCode(code.yalx).then(res => {
      res.data.map(item => {
        this.yalxOptions.push({
          value: item.key,
          label: item.name
        });
      });
    });

    codeHttp.getIbpsCode(code.yllx).then(res => {
      res.data.map(item => {
        this.yllxOptions.push({
          value: item.key,
          label: item.name
        });
      });
    });

    codeHttp.getIbpsCode(code.yljb).then(res => {
      res.data.map(item => {
        this.yllxOptions.push({
          value: item.key,
          label: item.name
        });
      });
    });
  },
  computed: {},
  watch: {
    choseDialogVisible(newval) {
      if (newval) {
        this.getList();
        this.$nextTick(() => {
          console.log(222);
          if (this.setvalue) {
            console.log(this.setvalue);
            this.value = this.setvalue;
          }
        });
      }
    }
  },
  created() {
    this.$nextTick(() => {
      this.getList(true);
    });
  },
  methods: {
    handleIconClick() {
      this.choseDialogVisible = true;
    },
    reset() {
      delete this.searchForm.hazardCategoryId;
      this.searchForm = {
        status: "0"
      };
      this.$forceUpdate();
    },
    clear() {
      delete this.searchForm.hazardType;
    },
    //下一页的的回调
    handleTableChange(pagination) {
      this.getList(pagination);
    },
    //加载数据
    getList(init) {
      this.loading = true;
      safetFeeHttp.list(this.searchForm).then(res => {
        console.log(res);
        this.dataList = res.data.records;
        this.pagination.total = res.data.total;
        this.loading = false;
        if (init) {
          this.value = this.setvalue;
        }
      });
    },
    handleChoseDialogClose(row) {
      this.choseDialogVisible = false;
    },
    rowClick(data) {
      console.log(data);
      this.value = data.name;
      this.$emit("edit", data);
    }
  }
};
</script>

<style lang="scss">
.el-input__icon {
  cursor: pointer;
}

#selectInput {
  .el-input-group__append {
    padding: 0;
    background: transparent;
    border: none;
    i {
      font-size: 22px;
    }
  }
}

#org-tree-table {
  height: auto;
  .right {
    height: auto;
  }
}
</style>
