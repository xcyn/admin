<template>
  <div id="sac-tree-table">
    <div class="left" :style="{'height':tabelHeight}" v-if="showLeft">
      <SacTree
        :props="treeProps"
        :data="treeData"
        :filterable="filterable"
        :defaultExpandAll="true"
        @node-click="nodeClick"
        ref="iTree"
      ></SacTree>
    </div>

    <div class="right">
      <iTable
        :selection="selection"
        :showPagination="showPagination"
        :operateColumn="operateColumn"
        :table-data="dataList"
        :columns="columns"
        :loading="loading"
        :max-height="maxHeight"
        :pagination="pagination"
        @handleTableChange="handleTableChange"
        @handleSelectChange="handleSelectChange"
        @rowClick="rowClick"
        ref="iTable"
      ></iTable>
    </div>
  </div>
</template>

<script>
import SacTree from "@/components/cpComponents/sac-system-tree/SacSystemTree.vue";
import iTable from "@/components/cpComponents/sac-tree-table/iTable.vue";
export default {
  name: "SacTreeTable",
  props: {
    columns: Array,
    searchForm: Object,
    tableFun: Function,
    treeFun: Function,
    operateColumn: Object,
    showLeft: Boolean,
    treeProps: Object,
    treeTitle: String,
    selection: Boolean,
    initTreeId: {
      type: String,
      default: ""
    },
    maxHeight: {
      type: String,
      default: null
    },
    showPagination: { type: Boolean, default: true },
      customTree: { type: Boolean, default: false }
  },
  components: {
    SacTree,
    iTable
  },
  data() {
    return {
      dataList: [],
      filterable: true,
      treeData: [],
      tabelHeight: 100,
      pagination: {
        current: 1,
        size: 20,
        total: 0
      },
      loading: false
    };
  },
  methods: {
    //			下一页的的回调
    handleTableChange(pagination) {
      this.getList(pagination);
    },
    //点击树节点，回调的参数和处理事件的地方
    nodeClick(data) {
      if (data) {
        console.log("nodeClick(data)",data)
        this.getList(null, data[this.treeProps.id]);
        this.$emit("nodeClick", data);
      }
    },
    handleSelectChange(val) {
      this.selectList = val;
      this.$emit("handleSelectChange", val);
    },
    toggleRowSelection(data) {
      data.map(item => {
        this.dataList.forEach(_item => {
          if (item.assessItemId == _item.assessItemId) {
            this.$refs.iTable.toggleRowSelection(item);
            return false;
          }
        });
      });
    },
  /*  getList(pagination, treeId) {
      this.loading = true;
      this.searchForm["limit"] = this.pagination.size;

      if (pagination) {
        this.searchForm["limit"] = pagination.size;
        this.searchForm["pageNo"] = pagination.current;
      } else {
        this.searchForm["pageNo"] = 1;
        this.$refs.iTable.initPagination();
        delete this.searchForm[this.treeProps ? this.treeProps.queryZd : ""];
      }
  if(this.customTree){
     this.searchForm[this.treeProps.queryZd] = treeId;
 this.treeFun().then(res => {
            res.data[this.treeProps["label"]] = this.treeTitle;
            this.treeData = [];
            this.treeData.push(res.data);
            this.handleResize();
          });
  }else  if (this.initTreeId) {
        this.searchForm[this.treeProps.queryZd] = treeId;
        if (this.treeFun && !pagination) {
          this.treeFun().then(res => {
            res.data[this.treeProps["label"]] = this.treeTitle;
            this.treeData = [];
            let json = JSON.parse(JSON.stringify(res.data));
            if (json.hasChildren) {
              this.treeData = this.findPathByLeafId(
                this.initTreeId,
                json.children
              );
            }
              console.log(this.treeData,"this.treeData1");
            // this.treeData.push(res.data);
            this.handleResize();
          });
        }
      } else {
        if (this.treeFun && !pagination) {
          this.treeFun().then(res => {
            res.data[this.treeProps["label"]] = this.treeTitle;
            this.treeData = [];
            this.treeData.push(res.data);
            this.handleResize();
          });
        }
      }
      this.tableFun(this.searchForm).then(res => {
        this.dataList = [];
        this.pagination.total = {
          current: 1,
          size: 20,
          total: 0
        };
        if (res.data.records && res.data.records.length > 0) {
          this.dataList = res.data.records;
          this.pagination.total = res.data.total;
          this.pagination.size = res.data.size;
          this.pagination.current = res.data.current;
        }

        this.loading = false;
      });
    },*/
    async getList (pagination, treeId) {
      this.loading = true;
      this.searchForm["limit"] = this.pagination.size;

      if (pagination) {
        this.searchForm["limit"] = pagination.size;
        this.searchForm["pageNo"] = pagination.current;
      } else {
        this.searchForm["pageNo"] = 1;
        this.$refs.iTable.initPagination();
        delete this.searchForm[this.treeProps ? this.treeProps.queryZd : ""];
      }

      if (treeId) {
        this.searchForm[this.treeProps.queryZd] = treeId;
      } else {
        if (this.treeFun && !pagination) {
          let res = await this.treeFun()
          res.data[this.treeProps["label"]] = this.treeTitle;
          this.treeData = [];
          this.treeData.push(res.data);
          this.handleResize();

        }
      }
      let res = await this.tableFun(this.searchForm)
      this.dataList = [];
      this.pagination.total = {
        current: 1,
        size: 20,
        total: 0
      };
      if (res.data && res.data.records && res.data.records.length > 0) {
        this.dataList = res.data.records;
        this.pagination.total = res.data.total;
        this.pagination.size = res.data.size;
        this.pagination.current = res.data.current;
      }
      this.$set(this, "loading", false)
    },
    findPathByLeafId(leafId, nodes, path) {
      if (path === undefined) {
        path = [];
      }
      if (path.length > 0) {
        return path;
      }
      for (var i = 0; i < nodes.length; i++) {
        var tmpPath = path.concat();
        tmpPath.push(nodes[i]);
        if (leafId == nodes[i].id) {
          return tmpPath;
        }
        if (nodes[i].children) {
          var findResult = this.findPathByLeafId(
            leafId,
            nodes[i].children,
            tmpPath
          );
          if (findResult) {
            return findResult;
          }
        }
      }
    },
    rowClick(row) {
      this.$emit("rowClick", row);
    },
    handleResize() {
      var w_h =
        document.documentElement.clientHeight || document.body.clientHeight;
      this.tabelHeight = w_h - 310;
    }
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.getList(null, this.initTreeId);
      }, 500);
    });
    window.addEventListener("resize", this.handleResize);
  }
};
</script>

<style lang="scss">
#sac-tree-table {
  display: flex;
  flex: 1;
  width: 100%;
  background-color: #fff;
  & > div {
    height: 100%;
    overflow: auto;
    margin-bottom: 40px;
  }
  & > .left {
    width: 200px;
    min-height: 300px;
    border-right: 3px solid #e8e8e8;
    box-sizing: border-box;
    padding: 5px;
  }
  & > .right {
    flex: 1;
    width: 100%;
  }
}
</style>
