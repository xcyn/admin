<template>
  <el-select
    v-model="selectVal"
    :placeholder="ph"
    @change="changeSelect"
    :multiple="multiple"
    clearable
    filterable
    @clear="clear"
    ref="selforgselect"
  >
    <el-option
      v-for="(item,index) of orgList"
      :key="index"
      v-show="levelID==item.levelID"
      :label="item.name"
      :value="item.id"
    ></el-option>
  </el-select>
</template>
<script>
import * as ibps from "@/api/cpApi/ibps/index";
export default {
  name: "orgSelect",
  props: ["org", "ph", "levelID", "multiple"],
  data() {
    return {
      orgList: [],
      selectVal: ""
    };
  },
  watch: {
    org(val) {
      let org = val;
      if (this.multiple) {
        if (typeof val === "string") {
          org = val.split(",");
        }
      }
      this.selectVal = org;
    }
  },
  created() {
    this.$nextTick(() => {
      ibps.orgFindAll().then(res => {
        this.orgList = res.data;
        if (this.org) {
          if (this.multiple) {
            if (typeof this.org === "string") {
              this.org = this.org.split(",");
            }
          }
          this.selectVal = this.org;
        }
      });
    });
  },
  methods: {
    setOrg(val) {
      this.selectVal = val;
      this.$forceUpdate();
    },
    changeSelect(val) {
      this.orgList.map(item => {
        if (item.id == val) {
          this.$emit("edit", val, item.name);
        }
      });
    },
    clear() {
      this.selectVal = "";
      this.$emit("edit", "", "");
    }
  }
};
</script>