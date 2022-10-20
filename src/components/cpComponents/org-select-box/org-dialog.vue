<template>
  <el-dialog class="yj-dialog" :visible.sync="visible" :before-close="handleDialogClose">
    <div slot="title">
      <span>组织架构</span>
    </div>
    <div id="org-tree-table">
      <div class="left" style="width:100%">
        <el-tree :props="props" :load="loadNode" node-key="id" lazy @node-click="nodeClick"></el-tree>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import iTable from "@/components/cpComponents/sac-tree-table/iTable.vue";
import * as ipbsHttp from "@/api/cpApi/ibps/index";

export default {
  name: "orgSelectBox",
  components: { iTable },
  props: ["visible"],
  data() {
    return {
      loading: false,
      selectName: "",
      props: {
        label: "name",
        id: "id"
      },
      employeeList: []
    };
  },
  created() {
    this.loadNode(null);
  },
  methods: {
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
        });
        if (resolve) return resolve(json);
      });
    },
    nodeClick(node) {
      this.$emit("nodeClick", {
        orgId: node.id,
        orgName: node.name
      });

      this.handleDialogClose();
    },
    handleDialogClose() {
      this.$emit("close");
    }
  }
};
</script>