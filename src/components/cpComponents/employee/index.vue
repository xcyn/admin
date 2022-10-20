<template>
  <el-select
    v-model="employeeSelect"
    :validate-event="false"
    ref="selfSelect"
    @change="changeSelect"
    filterable
    clearable
    autocomplete="off"
    :multiple="multiple"
  >
    <el-option
      v-for="(item,index) of employeeList"
      :key="index"
      :label="item.name"
      :value="item.id"
    ></el-option>
  </el-select>
</template>
<script>
import * as ibps from "@/api/cpApi/ibps/index";
export default {
  name: "employee",
  props: ["employee", "multiple"],
  data() {
    return {
      employeeList: [],
      employeeSelect: ""
    };
  },
  methods: {
    changeSelect(val) {
      if (this.multiple) {
        let nameArray = [];
        val.map(_item => {
          let obj = this.employeeList.find(function(item) {
            return item.id == _item;
          });
          console.log(obj);
          nameArray.push(obj.name);
        });
        this.$emit("edit", val, nameArray);
      } else {
        var obj = {};
        obj = this.employeeList.find(function(item) {
          return item.id == val;
        });
        console.log(obj);
        //obj 就是被选中的那个对象，也就能拿到label值了。
        this.$emit("edit", val, obj.name);
      }
    },
    findOrg() {
      ibps.getOrgByUserId(this.employeeSelect).then(res => {
        console.log(res);
      });
    },
    clear() {
      if (this.multiple) {
        this.employeeSelect = [];
      } else this.employeeSelect = "";
      this.$emit("edit", "");
    },
    setSelectEmplyee(val) {
      if (val) {
        this.employee = val;
        console.log(this.employee);
        if (this.multiple) {
          this.employeeSelect = this.employee.split(",");
        } else {
          this.employeeSelect = this.employee;
        }
      }
    }
  },
  created() {
    ibps.employeeFindAll().then(res => {
      this.employeeList = res.data;
      this.$nextTick(() => {
        this.setSelectEmplyee(this.employee);
      });
    });
  }
};
</script>