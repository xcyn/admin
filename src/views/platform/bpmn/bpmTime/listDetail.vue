<template>
  <ibps-container>
    <z-comb ref="comb" :tree-prop="treeProp" :toolbar-prop="toolbarProp" :table-prop="tableProp"
            @toolbar-search="commitSearch"
            @on-reset="commitReset"
            @table-selection-one="tableSelectChange">
      <!-- 搜索条件 -->
      <template slot="searchBar">
        <el-form-item label="流程名称" style="max-width: 340px">
          <el-select v-model="dataIO.procDefName" placeholder="流程名称" clearable >
            <el-option v-for="item in baseData.procDefList" :key="item.key" :label="item.name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="日期" >
          <el-date-picker v-model="dataIO.createTime" type="daterange" :range-separator="$t('baseCommon.other.to')" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>

        <el-form-item label="处理人" >
          <el-input v-model="dataIO.handerName"></el-input>
        </el-form-item>
      </template>
    </z-comb>

  </ibps-container>

</template>

<script>
  import FixHeight from '@/mixins/height'
  import * as bpmTimeApi     from '@/api/platform/bpmn/cpisBpmOverTimeConf.js'
  import { getProcDefList } from '@/api/platform/bpmn/cpisBpmOverTimeConf.js'
  import * as utils from '@/utils/cpUtils'
  export default {
    name:"wtBpmApproveDetail",
    components: {
    },
    mixins: [FixHeight],
    data() {
      return {
        treeProp: { show: false },

        toolbarProp: {
          addEnable   : false,
          deleteEnable: false,
          updateEnable: false,
          queryEnable : false,

          optionBtnIsShow: true,
          optionEnable   : true,

          settingEnable: false,
        },
        tableProp: {
          slotColumns     : [],//列使用插槽
          dataSource      : bpmTimeApi.findOverTimeFlowList,
          paginationHandle: (pagination) => {
            return {
              requestPage: pagination,
            }
          },
          // 显示列
          // 表格字段配置
          columns: [
            { key: 'taskTitle', title: '任务标题' }
            ,{ key: 'procDefName', title: '流程名称' }
            ,{ key: 'nodeName', title: '节点名称' }
            ,{ key: 'timeLimit', title: '要求时限(分钟)' }
            ,{ key: 'approveTime', title: '审核时长(分钟)' }
            ,{ key: 'overTime', title: '超时时长(分钟)' }
            ,{ key: 'handerName', title: '处理人' }
          ]
        },
        dataIO: {
            procDefName: null,
            handerName: null,
            createTime:  [
              utils.formatDateSub(new Date(), 'yyyy-MM-dd'),
              utils.formatDate(new Date(), 'yyyy-MM-dd')
            ],
            nodeName: null
        },
        requestIO : {
        },
        /**
         * ----------------------------------------------基础数据----------------------------------------------
         */
        baseData: {
          procDefList: []
        }
      }
    },
    mounted(){
      this.loadBaseData()
      let procDefName = this.$route.query.procDefName
      let nodeName = this.$route.query.nodeName
      this.dataIO.procDefName = procDefName
      this.dataIO.nodeName = nodeName
      this.commitSearch()
    },
    methods: {
      loadBaseData() {
        return new Promise(resolve => {
            let need2load = 1
            let loadDone  = function(){
              need2load--
              if(need2load === 0){
                resolve()
              }
            }
        getProcDefList().then(res => {
          this.baseData.procDefList = res.data.map(item => ({ value: item.procDefName, key: item.procDefName }))
        }).finally(loadDone)
        })
      },
      /**
       * 提交查询
       * @author mbb
       */
      commitSearch(){
        let startTime = null;
        let endTime = null;
        if (this.dataIO.createTime != null) {
          startTime = this.dataIO.createTime[0]
          endTime = this.dataIO.createTime[1]
        }
        let requestIO = {
          parameters:[
            { key: "procDefName", value: this.dataIO.procDefName },
            { key: "nodeName", value: this.dataIO.nodeName },
            { key: "startTime", value: startTime },
            { key: "endTime", value: endTime },
            { key: "handerName", value: this.dataIO.handerName }
          ]
        }
        this.$refs.comb.tableQuery(requestIO)
      },
      /**
       * 提交重置
       * @author mbb
       */
      commitReset(){
        this.dataIO = {
          procDefName: null,
          handerName: null,
          createTime: null,
          nodeName: null
        }
      },
      /**
       * 列表选择
       * @author mbb
       */
      tableSelectChange(columns){
        this.selectCount = columns.length
        this.selectOne   = columns.length === 1 ? columns[0].column : {}
      },
    }
  }
</script>
