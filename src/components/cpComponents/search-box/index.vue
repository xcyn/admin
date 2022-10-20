<template>
  <div :class="['youjiang-search-card',isUp ? 'up' : '']" ref="searchBox">
    <div
      v-if="showDownBtn"
      :class="['boxdown',isUp ? 'up' : '',mnues.length>0?'':'no-right']"
      @click="setUp"
    ></div>
    <el-dropdown trigger="click" class="more" @command="handleCommand" v-if="mnues.length>0">
      <span class="el-dropdown-link">
        <i></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <!-- <el-dropdown-item command="100">编辑列表</el-dropdown-item> -->
      </el-dropdown-menu>
    </el-dropdown>
    <div class="box">
      <slot name="box"></slot>
      <div class="work-box">
        <a href="#" @click="reset">清空</a>
        <a href="#" @click="isUp=false" class="close">收起</a>
      </div>
    </div>
    <el-drawer id="el-drawer" title="列设置" :visible.sync="editColunms">
      <el-form>
        <el-row v-for="(item,index) of columns" :key="index">
          <el-col :span="12">
            <el-form-item>
              <el-checkbox v-model="item.check" :label="item.label"></el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-button-group>
              <el-button type="primary" icon="el-icon-arrow-left"></el-button>
              <el-button type="primary" icon="el-icon-delete"></el-button>
              <el-button type="primary" icon="el-icon-arrow-right"></el-button>
            </el-button-group>
          </el-col>
        </el-row>
      </el-form>
    </el-drawer>
  </div>
</template>
<script>
export default {
  name: "searchBox",
  props: {
    columns: Array,
    mnues: {
      type: Array,
      default: () => []
    },
    showDownBtn: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isUp: false,
      editColunms: false
    };
  },
  methods: {
    reset() {
      this.$emit("reset");
    },
    setUp() {
      let height = this.$refs.searchBox.offsetHeight;
      console.log(height);
      this.isUp = !this.isUp;
      setTimeout(() => {
        let new_height = this.$refs.searchBox.offsetHeight;
        console.log(new_height);
        this.$parent.$refs.SacTreeTable.$refs.iTable.setHeight(
          new_height - height
        );
      }, 400);
      //elTable
    },

    handleCommand(command) {
      console.log(command);
      switch (command) {
        case "100":
          this.editColunms = true;
          break;
      }
    }
  }
};
</script>
<style lang="scss">
.youjiang-search-card {
  width: 100%;
  // overflow-x: hidden;
  font-family: "微软雅黑";
  font-size: 14px;
  background: #fff;
  border-bottom: 8px solid #f8f8f8;
  padding: 0px 0 10px 0;
  box-sizing: border-box;
  position: relative;
  &.up {
    .box {
      .layui-row.more-row {
        height: 52px;
        transition: height ease-in 0.3s;
      }
      .work-box {
        height: 40px;
        transition: height ease-in 0.3s;
      }
    }
  }
  .boxdown {
    cursor: pointer;
    z-index: 1000;
    width: 32px;
    height: 32px;
    background: url(../../../assets/images/more.png) center no-repeat;
    background-size: 24px;
    position: absolute;
    right: 60px;
    top: 12px;
    opacity: 0.72;
    transition: all 0.3s;
    &.no-right {
      right: 20px;
    }
    &.up {
      background: url(../../../assets/images/more-cur.png) center no-repeat;
      background-size: 24px;
      transition: all 0.5s;
    }
  }
  .more {
    position: absolute;
    right: 20px;
    top: 12px;
    z-index: 100;
    height: 32px;
    width: 32px;
    cursor: pointer;
    .more-menu {
      float: left;
      position: relative;
    }
    i {
      display: block;
      width: 32px;
      height: 32px;
      background: url(../../../assets/images/more-ico.png) center no-repeat;
      background-size: 24px;
    }
    ul {
      display: block;
      float: left;
      position: absolute;
      right: -200px;
      top: 40px;
      width: 80px;
      background: #eee;
      border-radius: 4px;
      box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.3);
      overflow: hidden;
      opacity: 0;
      transition: all 0.3s;
      li {
        display: block;
        float: left;
        width: 100%;
        text-align: center;
        padding: 10px 0;
        cursor: pointer;
      }
    }
  }
  .box {
    padding: 0 8px;
    box-sizing: border-box;
    background: #fff;
    .work-box {
      width: 100%;
      height: 0;
      overflow: hidden;
      // margin: 0 0 8px 0;
      padding: 0 15px;
      // border-top: 1px solid #efefef;
      line-height: 40px;
      background: #f5f5f5;
      box-sizing: border-box;
      transition: height ease-in 0.3s;
      a {
        float: left;
        margin: 0 10px;
        color: #188ae2;
        opacity: 0.7;
        transition: all 0.3s;
        &:horver {
          opacity: 1;
          text-decoration: none;
        }
        &:last-of-type {
          float: right;
        }
      }
    }
    .layui-row {
      margin-top: 5px;
      padding: 10px 0px 10px;
      color: #666;
      &.more-row {
        background: rgb(249, 249, 249);
        margin-top: 0;
        height: 0px;
        padding: 0;
        box-sizing: border-box;
        overflow: hidden;
        transition: height ease-in 0.3s;
        table {
          margin-top: 10px;
        }
      }
      table {
        border-collapse: collapse;
        border-spacing: 0;
        th {
          font-weight: normal;
          padding: 0 10px;
          box-sizing: border-box;
          text-align: right;
          width: 120px;
          margin-bottom: 10px;
          &.auto-width {
            width: auto;
          }
        }
        td {
          width: 220px;
          .el-select {
            width: 100%;
          }
          .el-input {
            width: 100% !important;
          }
          input::-webkit-outer-spin-button,
          input::-webkit-inner-spin-button {
            -webkit-appearance: none;
          }
          input[type="number"] {
            -moz-appearance: textfield;
          }
        }
      }
    }
  }
}

#el-drawer {
  .el-drawer__header {
    padding: 8px 16px;
    margin-bottom: 0;
    span {
      font-weight: bold;
    }
  }
  .el-drawer__body {
    padding: 20px;
  }
}
</style>