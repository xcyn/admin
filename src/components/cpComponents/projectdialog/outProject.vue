<template>
  <div class="modelTable">
    <el-row class="mainModelTable">
      <el-row class="modelBody">
        <el-row class="modelHead">
          <el-form ref="searchObj" :model="searchObj" :inline="true" label-width="100px">
            <el-row style="height: 45px;">
              <div class="modelSearchTopLeft overWidth">
                <el-form-item label="主管部门/场站" prop="operationDeptId">
                  <orgSelect ref="orgSelect" :org="searchObj.operationDeptId" :ph="'请选择主管部门/场站'" :level-i-d="743056808754544640" @edit="changeDept" />
                </el-form-item>
                <el-form-item label="项目类型" prop="mpTypeNo">
                  <el-select v-model="searchObj.mpTypeNo" placeholder="请选择项目类型" clearable>
                    <el-option v-for="item in baseInfo.projectTypes" :key="item.key" :label="item.name" :value="item.key" />
                  </el-select>
                </el-form-item>
                <el-form-item label="外委单位" prop="mtnDeptName">
                  <cpSelect v-model="searchObj.mtnDeptName" :i-labels="['legalRepresentative','name']" :data-list="baseInfo.outUnits" @change="changeOutUnit" />
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
            <el-table-column prop="proName" label="项目名称" show-overflow-tooltip min-width="105"/>
            <el-table-column label="类型" prop="mpTypeNo" width="80">
              <template slot-scope="scope">
                {{ baseInfo.projectTypeObj[scope.row.mpTypeNo] }}
              </template>
            </el-table-column>
            <el-table-column label="主管部门" show-overflow-tooltip width="180" prop="operationDeptName" />
            <el-table-column label="外委单位" show-overflow-tooltip width="150" prop="mtnDeptName"/>
            <el-table-column label="计划时间" show-overflow-tooltip width="280" prop="entName">
              <template slot-scope="scope">
                <span v-if="scope.row.planStartTime"> {{ scope.row.planStartTime }}~{{ scope.row.planEndTime }}</span>
              </template>
            </el-table-column>
            <el-table-column label="项目内容" show-overflow-tooltip min-width="180" prop="workContent" />
            <el-table-column label="工作联系人" width="100" prop="managerName" />
            <el-table-column label="外委负责人" width="100" prop="outManagerName" />
            <el-table-column label="状态" width="80" prop="state">
              <template slot-scope="scope">
                {{ baseInfo.projectStatusObj[scope.row.state] }}
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-row class="modelPageRow">
          <el-pagination :current-page="pageObj.current" :page-sizes="[10, 20, 30, 50,100]" :page-size="pageObj.size" layout="total, sizes, prev, pager, next, jumper" :total="pageObj.total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </el-row>
      </el-row>
    </el-row>
  </div>
</template>
<script>
import * as outUnitsHttp from '@/api/cpApi/base/outUnits/outUnits'
import cpSelect from '@/components/cpComponents/cp/cpSelect.vue'
import orgSelect from '@/components/cpComponents/org-select/index'
import * as dictHttp from '@/api/cpApi/equipment/list'
import * as outProjectHttp from '@api/cpApi/base/outProject/index'
export default {
  name: 'DemoTable',
  components: {
    cpSelect,
    orgSelect
  },
  data() {
    return {
      // 基础信息
      baseInfo: {
        projectTypes: [],
        projectTypeObj: {},
        outUnits: [],
        projectStatus: [],
        projectStatusObj: {}
      },
      // 表格三要素：头部搜索栏；表格；分页
      searchObj: {
        operationDeptId: '',
        mpTypeNo: '',
        mtnDeptId: '',
        mtnDeptName: ''
      },
      tableData: [],
      pageObj: {
        current: 1,
        size: 20,
        total: 0
      },
      sexList: [
        { value: '1', label: '男' },
        { value: '2', label: '女' }
      ],
      choosed: {}, // 选择的行
      sexObj: {
        '1': '男',
        '2': '女'
      },
      whetherObj: {
        0: '否',
        1: '是'
      }

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
    validateData() {
      let flag = true
      if (this.choosedList && this.choosedList.length === 1) {
        flag = false
        this.choosedList.forEach(item => {
          if (item.state !== 'ng') {
            flag = true
          }
        })
      }
      return flag
    },
    /**
     * @desc: 外单位
     */
    changeOutUnit(data) {
      this.searchObj.mtnDeptId = data?.id ?? ''
      this.searchObj.mtnDeptName = data?.name ?? ''
    },
    /**
     * @desc: 部门/场站
     */
    changeDept(id, name) {
      this.searchObj.operationDeptId = id || ''
    },
    async LoadBase() {
      // 项目类别
      let resXMLB = await dictHttp.getDictionary('xmlx')
      this.baseInfo.projectTypes = resXMLB?.data ?? []
      if (this.baseInfo.projectTypes && this.baseInfo.projectTypes.length > 0) {
        this.baseInfo.projectTypes.forEach((item) => {
          this.baseInfo.projectTypeObj[item.key] = item.name
        })
      }
      // 外单位
      const queryOutUnit = { blacklist: false, limit: 5000, pageNo: 1 }
      let resOutUnit = await outUnitsHttp.list(queryOutUnit)
      this.baseInfo.outUnits = resOutUnit?.data?.records ?? []
      // 状态
      let resXMZT = await dictHttp.getDictionary('xmzt')
      this.baseInfo.projectStatus = resXMZT?.data ?? []
      if (this.baseInfo.projectStatus && this.baseInfo.projectStatus.length > 0) {
        this.baseInfo.projectStatus.forEach((item) => {
          this.baseInfo.projectStatusObj[item.key] = item.name
        })
      }
    },

    // 重置表单,此方法需要prop与属性值对应
    resetForm() {
      this.searchObj = {
        operationDeptId: '',
        mpTypeNo: '',
        mtnDeptId: '',
        mtnDeptName: ''
      }
    },
    // 提交时间一定要转为string
    getQueryObj() {
      // 整合参数
      let queryObj = {
        operationDeptId: this.searchObj.operationDeptId,
        mpTypeNo: this.searchObj.mpTypeNo,
        mtnDeptId: this.searchObj.mtnDeptId,
        current: this.pageObj.current,
        size: this.pageObj.size
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
        this.pageObj.current = val
      }
      let queryObj = this.getQueryObj()// 查询入参以待使用;
      outProjectHttp.list(queryObj).then(res => {
        this.tableData = res?.data?.records ?? []
        this.pageObj = {
          current: res?.data?.current ?? 1,
          size: res?.data?.size ?? 20,
          total: res?.data?.total ?? 0
        }
      })
    },
    // 选择列赋值
    changeTable(data) {
      this.choosed = data
    },
    // 表格结束
    // 分页功能开始
    handleSizeChange(size) {
      this.pageObj.size = size
      this.initTable(1)
    },
    handleCurrentChange(current) {
      this.pageObj.current = current
      this.initTable()
    }
    // 分页功能结束
  }
}
</script>
