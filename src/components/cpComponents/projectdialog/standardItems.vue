<template>
  <div class="modelTable">
    <el-row class="mainModelTable">
      <el-row class="modelBody">
        <el-row class="modelHead">
          <el-form ref="searchObj" :model="searchObj" :inline="true" label-width="100px">
            <el-row style="height: 45px;">
              <div class="modelSearchTopLeft overWidth">
                <el-form-item label="场站" prop="operationDeptId">
                  <el-select v-model="searchObj.station" placeholder="请选择场站" clearable filterable>
                    <el-option
                      v-for="(item,index) in stations"
                      :key="index"
                      :value="item.ID_"
                      :label="item.NAME_"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="项目类型" prop="type">
                  <el-select v-model="searchObj.type" placeholder="请选择项目类型" clearable filterable>
                    <el-option
                      v-for="(item, key) in proTypeList"
                      :key="key"
                      :value="item.id"
                      :label="item.name"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="外委单位" prop="overhaulPeriod">
                  <el-select v-model="searchObj.overhaulPeriod" placeholder="请选择时间类型" clearable filterable>
                    <el-option
                      v-for="(item, key) in dateType"
                      :key="key"
                      :value="item.name"
                      :label="`${item.name}个月`"
                    />
                  </el-select>
                </el-form-item>
              </div>
              <div class="modelSearchTopRight">
                <el-form-item>
                  <el-button type="primary" icon="el-icon-search" style="margin-left:15px;" @click="initTable(1)">查询</el-button>
                  <el-button icon="el-icon-refresh" @click="resetForm">重置</el-button>
                </el-form-item>
              </div>
            </el-row>
          </el-form>
        </el-row>
        <el-row>
          <el-table ref="table" max-height="488px" :data="tableData" tooltip-effect="light" highlight-current-row="true" border @current-change="changeTable">
            <!-- 长度固定的列用width，需要自适应的用 min-width="100" -->
            <el-table-column  label="序号" type="index" width="50" />
            <el-table-column  label="项目名称" prop="name"  show-overflow-tooltip min-width="105"/>
            <el-table-column label="类型" prop="type" width="80">
              <template slot-scope="scope">{{ foamtType(scope.row.type) }}</template>
            </el-table-column>
            <el-table-column label="设备位置" prop="devicePositionDescription" show-overflow-tooltip width="200"/>
            <el-table-column label="场站" prop="station">
              <template slot-scope="scope">{{ foamtStation(scope.row.station) }}</template>
            </el-table-column>
            <el-table-column prop="team" label="检修班组">
              <template slot-scope="scope">{{ foamtDepart(scope.row.team) }}</template>
            </el-table-column>
            <el-table-column prop="overhaulPeriod" label="检修周期" />
            <el-table-column prop="lastOverhaulDate" label="上次检修时间" />
            <el-table-column label="状态" width="60">
              <template slot-scope="scope">
                <span>{{ scope.row.status == 1 ? '启用':'停用' }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-row class="modelPageRow">
          <el-pagination :current-page="pageObj.pageNo" :page-sizes="[10, 20, 30, 50,100]" :page-size="pageObj.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageObj.totalResult" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </el-row>
      </el-row>
    </el-row>
  </div>
</template>
<script>
import cpSelect from '@/components/cpComponents/cp/cpSelect.vue'
import orgSelect from '@/components/cpComponents/org-select/index'
import * as comnHttp from "@/api/cpApi/common";
import * as codeHttp from "@/api/cpApi/code";
import {findDataByKey} from "@/api/cpApi/common";
export default {
  name: 'DemoTable',
  components: {
    cpSelect,
    orgSelect
  },
  data() {
    return {
      proTypeList:[],
      stations:[],
      dateType:[],
      departArr: [], // 所有部门

      // 表格三要素：头部搜索栏；表格；分页
      searchObj: {
        station: '',
        type: '',
        overhaulPeriod: '',
      },
      tableData: [],
      pageObj: {
        pageNo: 1,
        pageSize: 20,
        totalResult: 0
      },

      choosed: {}, // 选择的行

    }
  },
  watch: {},
  created() {

  },
  async mounted() {
    await this.LoadBase()
    this.initTable()
  },
  methods: {
    searchAllDepart() {
      let param = {
        parameters: [
          {
            key: 'key',
            value: 'bm'
          },
          {
            key: 'Q^PARTY_TYPE_^S',
            value: 'org'
          },
          {
            key: 'Q^PATH_^SL',
            value: '774689130775838720'
          }
        ]
      }
      findDataByKey(param).then(ret => {
        this.departArr = ret.data.dataResult
      })
    },
    foamtType(id) {
      let val = ''
      this.proTypeList.map(item => {
        if (item.id == id) {
          val = item.name
          return false
        }
      })
      return val
    },
    foamtStation(id) {
      let val = ''
      this.stations.map(item => {
        if (item.ID_ == id) {
          val = item.NAME_
          return false
        }
      })
      return val
    },
    foamtDepart(id) {
      let val = ''
      this.departArr.map(item => {
        if (item.ID_ == id) {
          val = item.NAME_
          return false
        }
      })
      return val
    },
    async LoadBase() {
      // 项目类型
      codeHttp.getIbpsCode('xmlx').then(res => {
        this.proTypeList = res.data
      })
      // 时间类型
      codeHttp.getIbpsCode('sjlx').then(res => {
        this.dateType = res.data
      })
     let param = {
        parameters: [
          {
            key: 'key',
            value: 'cz'
          }
        ]
      }
      comnHttp.findDataByKey(param).then(res => {
        this.stations = res.data.dataResult
      })
      this.searchAllDepart()

    },

    // 重置表单,此方法需要prop与属性值对应
    resetForm() {
      this.searchObj = {
        station: '',
        type: '',
        overhaulPeriod: '',
      }
    },
    // 提交时间一定要转为string
    getQueryObj() {
      // 整合参数
      let queryObj = {
        overhaulPeriod: this.searchObj.overhaulPeriod ? this.searchObj.overhaulPeriod :null,
        station: this.searchObj.station ? this.searchObj.station : null,
        type: this.searchObj.type ? this.searchObj.type : null,
        currentPage: this.pageObj.currentPage,
        pageSize: this.pageObj.pageSize,
        pageNo:this.pageObj.pageNo
      }
      return queryObj
      // 以下调用查询方法
    },
    // 搜索栏结束
    // 表格开始
    // 数据初始化
    initTable(val) {
      // 当带查询条件时或改变分页大小，传val值，使其获取第一页的值
      if (val) {
        this.pageObj.pageNo = val
      }
      let queryObj = this.getQueryObj()// 查询入参以待使用;
    },
    // 选择列赋值
    changeTable(data) {
      this.choosed = data
    },
    // 表格结束
    // 分页功能开始
    handleSizeChange(size) {
      this.pageObj.pageSize = size
      this.initTable(1)
    },
    handleCurrentChange(current) {
      this.pageObj.pageNo = current
      this.initTable()
    }
    // 分页功能结束
  }
}
</script>

