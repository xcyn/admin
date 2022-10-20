<template>
  <div class="container">
    <el-dialog
      :visible.sync="dialogVisible"
      width="70%"
      :modal = "false"
      :show-close="false"
      :close-on-click-modal="false"
      @close="handleDialogClose"
    >
      <div slot="title">
        <span>{{dialogMode}}</span>
      </div>

      <major v-if="tableComponent=='major'" style="height: 400px" @rowClick="rowClick"></major>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleDialogSave()">确定</el-button>
        <el-button @click="handleDialogClose()">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import * as a from '../index'
  export default {
    name: 'modelDialog',
    components: {
    },
    props: {
      tableComponent: {
        type: String,
        default: '新增'
      },
      dataBag: {
        type: Object,
        default() {
          return {};
        }
      },
      visible: {
        type: Boolean,
        default: false
      },
      mode: {
        type: String,
        default: '新增'
      }
    },
    data() {
      return {
        dialogVisible: false,
        choseData: null
      };
    },
    methods: {
      handleDialogSave(formName) {
        // 表单验证
        if(this.choseData){
          this.$emit('handleDialogSave', this.choseData)
        }else {
          this.$message.warning('请选择一行数据');
        }
      },
      handleDialogClose(formName) {
        this.$emit('handleDialogClose', this.choseData)
      },
      rowClick(row){
         this.choseData = row
      }
    },
    computed: {
    },
    mounted() {
    },
    watch: {
      'dataBag': {
        immediate: true,
        deep: true,
        handler(newVal, oldValue) {
          this.dialogForm = JSON.parse(JSON.stringify(newVal));
        }
      },
      'visible': {
        immediate: true,
        handler(newVal, oldValue) {
          this.dialogVisible = newVal;
        }
      },
      'mode': {
        immediate: true,
        handler(newVal, oldValue) {
          this.dialogMode = newVal;
        }
      }
    }
  };
</script>

