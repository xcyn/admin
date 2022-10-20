<template>
  <div id="sac-duty-log">
    <div class="log-table" v-show="isShow">
      <div class="header log-style">
        <div class="add-icon add-header ">
          <span class="icon-c" @click="addCloum">+</span>
        </div>
        <div class="add-header">顺序号</div>
        <div class="add-header">类型编码</div>
        <div class="add-header">类型名称</div>
        <div class="add-header">状态</div>
      </div>
      <div class="log-table-body log-style" v-for="(val,key) in tableData" :key='key'>

        <div class="delete-icon">
          <span class="icon-c" @click="deleteCloum(key)">-</span>
        </div>
        <div class="code-number">
          {{key+1}}
        </div>
        <div class="code-type">
          <el-input v-model="val.codeNum"></el-input>

        </div>
        <div class="name-type">
          <el-input v-model="val.codeType"></el-input>

        </div>
        <div class="type">
          <el-radio-group v-model="val.type">
            <el-radio :label="1">有效</el-radio>
            <el-radio :label="2">无效</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="bottom-btn">
        <el-button size="medium" type="primary" @click="onOk">保存</el-button>
        <el-button size="medium" type="primary" @click="onCance">关闭</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SacDutyLog',
  props: {
    /** 开启下拉树多选 */
    multiple: {
      type: Boolean,
      default: false
    }
  },
  components: {

  },
  data () {
    return {
      isShow: true,
      tableData: [{
        type: 1,
        codeNum: 1,
        codeType: 2
      }]
    };
  },
  methods: {
    getSelectTreeId (value, i) {
      this.$emit('getSelectTreeId', value);
    },
    deleteCloum (index) {
      const { tableData } = this;
      if (tableData.length === 1) {
        this.$notify({
          title: '提示',
          message: '至少保留一条数据'
        });
        return;
      }

      tableData.splice(index, 1);
    },
    addCloum () {
      this.tableData.push({
        type: 1,
        codeNum: null,
        codeType: null
      });
    },
    onCance () {
      this.isShow = false;
    },
    onOk () {
      this.$emit('getLogData', this.tableData);
    }
  }
};
</script>

<style lang="scss" >
#sac-duty-log {
  width: 100%;
  .log-table {
    width: 100%;
    .header {
      background-color: #f2f2f2;
    }
    .log-table-body {
      background-color: #fff;
      border-top: 0px !important;
    }
    .log-style {
      display: flex;
      width: 100%;
      box-sizing: border-box;
      color: #666;
      font-size: 14px;
      border: 1px solid #ccc;
      & > div {
        height: 40px;
        line-height: 40px;
        padding-left: 10px;
        border-right: 1px solid #ccc;
      }
      & > div:nth-child(1) {
        flex: 0.6;
        font-size: 18px;
        text-align: center;
      }
      & > div:nth-child(2) {
        flex: 1.5;
        text-align: center;
      }
      & > div:nth-child(3) {
        flex: 2;
      }
      & > div:nth-child(4) {
        flex: 5;
      }
      & > div:nth-child(5) {
        flex: 2;
        border-right: 0;
      }
      .el-input__inner {
        border: 0;
      }
      .icon-c {
        cursor: pointer;
      }
    }
  }
  .bottom-btn {
    padding: 15px 20px;
    background-color: #f2f2f2;
    border: 1px solid #ccc;
    border-top: 0 !important;
  }
}
</style>
