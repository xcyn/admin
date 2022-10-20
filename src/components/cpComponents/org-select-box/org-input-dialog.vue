<template>
  <div @click="dialogVisible=true">
    <el-input v-model="selectName" placeholder="请选择" :validate-event="false" readonly></el-input>
    <el-dialog
      class="yj-dialog"
      append-to-body
      :visible.sync="dialogVisible"
      :before-close="handleDialogClose"
    >
      <div slot="title">
        <span>组织架构</span>
      </div>
      <div id="org-tree-table">
        <div class="left" style="width:100%">
          <el-tree :props="props" show-checkbox :load="loadNode" node-key="id" lazy ref="checkTree"></el-tree>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleDialogSave">确定</el-button>
        <el-button @click="handleDialogClose">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import iTable from "@/components/cpComponents/sac-tree-table/iTable.vue";
import * as ipbsHttp from "@/api/cpApi/ibps/index";

export default {
  name: "orgSelectBox",
  components: { iTable },
  props: ["orgname", "orgId"],
  data() {
    return {
      loading: false,
      selectName: "",
      selectArray: [],
      dialogVisible: false,
      props: {
        label: "name",
        id: "id"
      },
      employeeList: []
    };
  },
  created() {
    this.$nextTick(() => {
      this.loadNode(null);
      console.log(this.orgname);
      if (this.orgname) {
        this.selectName = this.orgname;
      }
      if (this.orgId) {
        this.selectArray = this.orgId.split(",");
      }
    });
  },
  methods: {
    setName(id, name) {
      this.selectName = name;
      this.selectArray = id.split(",");
    },
    loadNode(node, resolve) {
      let data;
      if (node === null || !node.data) {
        data = {
          parameters: [
            { key: "type", value: 1 },
            { key: "orgId", value: 0 }
          ]
        };
      } else {
        data = {
          parameters: [
            { key: "type", value: 1 },
            { key: "orgId", value: node.data.id }
          ]
        };
      }
      ipbsHttp.orgTree(data).then(res => {
        let json = [];
        res.data.forEach(element => {
          json.push({
            name: element.name,
            id: element.id,
            type: element.type,
            alias: element.alias
          });
          // this.selectArray.map(item => {
          //   if (item == element.id) {
          //     console.log(111)
          if (this.selectArray.length > 0) {
            setTimeout(() => {
              this.$refs.checkTree.setCheckedKeys(this.selectArray);
            }, 300);
          }

          // }
          // });
        });
        if (resolve) return resolve(json);
      });
    },
    handleDialogSave() {
      let data = this.$refs.checkTree.getCheckedNodes();
      this.selectName = "";
      data.map((item, index) => {
        this.selectName += item.name;
        if (index < data.length - 1) {
          this.selectName += ",";
        }
      });
      this.$emit("nodeClick", this.$refs.checkTree.getCheckedNodes());
      this.handleDialogClose();
    },
    nodeClick(node) {
      this.$emit("nodeClick", {
        orgId: node.id,
        orgName: node.name
      });
      this.selectName = node.name;
      this.handleDialogClose();
    },
    handleDialogClose() {
      this.dialogVisible = false;
    }
  }
};
</script>
