<template>
  <ibps-container>
    <div class="wrap form-wrap">
      <div id="sac-duty-table">
        <div class="workRoster">
          <div class="rosterHead">
            <p class="form-title">{{ $t('shiftduty.schedule.scheduleQuery') }}</p>
          </div>
          <!-- <div class="rosterMenu"> -->
          <el-row style="line-height: 30px;text-align: right;">
            <el-col :span="1">{{ $t('common.field.dept') }}</el-col>
            <el-col :span="3" style="margin-left:5px">
              <el-select v-model="deptId" :placeholder="$t('common.field.pleaseSelect', { title: ''})" clearable @change="getschedule">
                <el-option v-for="item in treeData" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-col>
            <el-col :span="1" style="margin-left:15px">{{ $t('shiftduty.schedule.schedule') }}</el-col>
            <el-col :span="3" style="margin-left:5px">
              <el-select v-model="spruleId" :placeholder="$t('common.field.pleaseSelect', { title: ''})" clearable>
                <el-option v-for="item in scheduling" :key="item.srId" :label="item.srName" :value="item.srId" />
              </el-select>
            </el-col>
            <el-col :span="1" style="margin-left:10px">
              <el-button type="primary" @click="getDutyInfo">{{ $t('common.buttons.search') }}</el-button>
            </el-col>
            <el-col :span="2" :offset="6">{{ $t('shiftduty.schedule.queryTime') }}</el-col>
            <el-col :span="3" style="margin-left:5px">
              <el-date-picker v-model="searchMonth" type="month" :placeholder="$t('common.field.pleaseSelect', { title: $t('baseCommon.time.month')})" @change="getDate()" />
            </el-col>
            <el-col :span="1" style="margin-left:15px">
              <el-button type="primary" @click="monthSearch('preview')">{{ $t('baseCommon.time.lastMon') }}</el-button>
            </el-col>
            <el-col :span="1" style="margin-left:25px">
              <el-button type="primary" @click="monthSearch('next')">{{ $t('baseCommon.time.nextMon') }}</el-button>
            </el-col>
          </el-row>

          <!-- <div class="leftMenu">
              <div class="roster leftMenuItem">
                <div class="menu-title">部门</div>
                <el-select v-model="deptId" placeholder="请选择" clearable @change="getschedule">
                  <el-option v-for="item in treeData" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </div>

              <div class="roster leftMenuItem">
                <div class="menu-title">排班表</div>
                <el-select v-model="spruleId" placeholder="请选择" clearable>
                  <el-option v-for="item in scheduling" :key="item.srId" :label="item.srName" :value="item.srId"></el-option>
                </el-select>
              </div>
              <button class="searchBtn" @click="getDutyInfo">查询</button>
            </div> -->

          <!-- <div style="    width: 306px;display: inline-flex; margin-left: 10px;">
              <div>查询时间</div>
              <el-date-picker v-model="gainMonth" type="month" placeholder="选择月" @change="getDate()">
              </el-date-picker>
            </div> -->

          <!-- <div class="rightMenu">
              <div class="preview" @click="monthSearch('preview')">
                <em class="el-icon-caret-left"></em>
                <span>上月</span>
              </div>
              <div class="next" @click="monthSearch('next')">
                <em class="el-icon-caret-right"></em>
                <span>下月</span>
              </div>
            </div> -->
          <!-- </div> -->
          <div class="rosterResult" style="margin-top:15px">
            <div class="resultHead">
              <div class="dateHead" style="width: 8%">{{ $t('baseCommon.time.week') }}</div>
              <div class="dateInfo">
                <div v-for="(items, index) in date" :key="index" class="dateItem">
                  {{ items }}
                </div>
              </div>
            </div>

            <div v-for="count in 5" class="resultDetail">
              <div class="banzhiItem" style="width: 8%;">
                <div class="dateHead">{{ $t('shiftduty.schedule.Scheduling') }}</div>
                <div v-for="(items, index) in banci" :key="index" class="dateHead">
                  {{ items.shiftName }}
                </div>
              </div>
              <div style="display:flex;justify-content: space-around;flex:1">
                <div v-for="(item, index) in tableData" v-if="index >= (count - 1) * 7 && index < count * 7" class="detailItem">
                  <div v-for="(key, name, index) in item" class="itemInfo" style="background:#e9f5fc">{{ name }}
                    <div v-for="(banciItems, banciIndex) in key" class="itemInfo" :class="{selected: selectedItem == index}">
                      <div @click="getSelected(banciItems.scheduleId)">{{ banciItems.sname }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <el-dialog :title="$t('shiftduty.schedule.changePersonOnDuty')" class="dutyDialog" :visible.sync="dialogVisible" width="40%">
          <div class="duty-ul">
            <div class="duty-head">
              <div style="display: table; margin: 0 auto; text-align: center;">
                <div>{{ staff.splanName }}</div>
                <div>{{ staff.shiftStartTime }}</div>
                <div>{{ staff.teamName }}</div>
                <div>{{ staff.shiftName }}</div>
              </div>
            </div>
            <div class="form-box">
              <vxe-form :data="staff" title-align="right" title-width="100" prevent-submit title-colon>
                <div class="duty-master">
                  <vxe-form-item :title="$t('shiftduty.schedule.dutySupReview')" span="24">
                    <template #default>
                      <vxe-input v-model="staff.dutyManagerName" @click="principal">
                        <template #suffix>
                          <i class="fa fa-plus" @click="principal" />
                        </template>
                      </vxe-input>
                    </template>
                  </vxe-form-item>
                  <!-- <div class="duty-title">值班负责人</div>
              <div class="duty-info"> -->
                  <!-- <em class="el-icon-plus" @click="setMember('master')"></em> -->
                  <!-- <div class="duty-item">{{staff.dutyManagerName}}</div>
                <el-select v-model="fuzeren" filterable placeholder="请选择" @change="choiceFunctionary" value-key="id">
                  <el-option v-for="item in users" :key="item.id" :label="item.name" :value="item"></el-option>
                </el-select>
               </div> -->
                </div>
                <div class="duty-member">
                  <vxe-form-item :title="$t('shiftduty.schedule.personOnDuty')" span="24">
                    <template #default>
                      <vxe-input v-model="staff.dutyStaffNames" @click="prinstaff">
                        <template #suffix>
                          <i class="fa fa-plus" @click="prinstaff" />
                        </template>
                      </vxe-input>
                    </template>
                  </vxe-form-item>
                  <!-- <div class="duty-title">值班人员</div>
              <div class="duty-info"> -->
                  <!-- <em class="el-icon-plus" @click="setMember('member')"></em> -->
                  <!-- <div class="duty-item">{{staff.dutyStaffNames}}</div>
                <el-select v-model="renyuan" multiple filterable placeholder="请选择" @change="choiceStaff" value-key="id">
                  <el-option v-for="item in users" :key="item.id" :label="item.name" :value="item"></el-option>
                </el-select>
              </div> -->
                </div>
              </vxe-form>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" class="save-btn" @click="confirm()">{{ $t('common.buttons.confirm') }}</el-button>
            <el-button class="cancel" @click="cancel()">{{ $t('common.buttons.cancel') }}</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
    <user-dialog-select ref="userDSel" :multiple-select="false" :selected-ids="staff.dutyManagerId" :selected-names="staff.dutyManagerName" @onDTableOk="onuserDTableOk" />
    <user-dialog-select ref="userSel" :selected-ids="staff.dutyStaffIds" :selected-names="staff.dutyStaffNames" @onDTableOk="onuserTableOk" />
  </ibps-container>
</template>

<script>
import * as dlHttp from '@/api/cpApi/schedule/index'
import iTable from '@/components/cpComponents/sac-tree-table/iTable.vue'
import userDialogSelect from '@/components/cpComponents/cp-dialog-select/userDialogSel.vue'

export default {
  name: 'Sacdutytable',
  components: {
    iTable,
    userDialogSelect
  },
  props: {
    /** 开启下拉树多选 */
    multiple: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      month: 0,
      selectedItem: 0,
      deptId: '',
      spruleId: '',
      scheduleId: '',
      memberType: null,
      searchMonth: new Date(),
      master: [],
      member: [],
      scheduling: [],
      banci: [],
      dialogVisible: false,
      memberSelect: false,
      date: [this.$t('shiftduty.schedule.sunDay'), this.$t('shiftduty.schedule.one'), this.$t('shiftduty.schedule.two'), this.$t('shiftduty.schedule.three'), this.$t('shiftduty.schedule.four'), this.$t('shiftduty.schedule.five'), this.$t('shiftduty.schedule.six')],
      tableData: [],
      treeData: [],
      org: [],
      yh: [],
      staff: [],
      selection: true,
      pagination: {
        size: 20
      },
      loading: false,
      forData: {
        fid: '',
        fname: '',
        rids: '',
        ridNames: '',
        spId: ''
      }
    }
  },
  mounted() {
    this.treeData = this.$store.state.ibps.user.info.stationList
    // this.loadBaseData();
  },
  methods: {
    /**
     * 加载基础数据
     */
    loadBaseData() {
      return new Promise(resolve => {
        let need2load = 5
        let loadDone = function () {
          need2load--
          if (need2load === 0) {
            resolve()
          }
        }

        // 1.场站
        this.treeData = this.$store.state.ibps.user.info.stationList
        loadDone()

        // 2
        this.deptId = this.treeData[0].id
        let _par = {
          deptId: this.deptId
        }
        let splan = []
        dlHttp.getschedule(_par).then((ret) => {
          splan = ret.data
        }).finally(loadDone)

        // 3
        dlHttp.getrule({ splanId: splan[0].splanId }).then((ret) => {
          let rule = ret.data
          for (let r of rule) {
            var obj = {
              srId: '',
              srName: '',
              splanId: ''
            }
            obj.srName = s.splanName + '+' + r.ruleName
            obj.srId = r.spruleId
            obj.splanId = s.splanId
            this.scheduling.push(obj)
          }
        }).finally(loadDone)

        // 4
        this.spruleId = this.scheduling[0].srId
        let _pa = {
          spruleId: this.spruleId
        }
        dlHttp.getShift(_pa).then((ret) => {
          this.banci = ret.data
        }).finally(loadDone)

        // 5
        let obj = {
          deptId: this.deptId,
          spruleId: this.spruleId,
          currentTime: this.searchMonth
        }
        var this_ = this
        dlHttp.getTable(obj).then((ret) => {
          this_.tableData = ret.data
        }).finally(loadDone)
      })
    },
    // 查询点击人员信息
    getSelected(scheduleId) {
      this.dialogVisible = true
      this.scheduleId = scheduleId
      let obj = {
        scheduleId: this.scheduleId
      }
      dlHttp.getStaff(obj).then((ret) => {
        this.staff = ret.data
      })
    },
    // 页面查询
    getDutyInfo() {
      // 操作日志
      this.$CpisBusinessOpLog.saveOpLog('query', 'duty_sch', null)

      let _par = {
        spruleId: this.spruleId
      }
      dlHttp.getShift(_par).then((ret) => {
        this.banci = ret.data
      })
      let obj = {
        deptId: this.deptId,
        spruleId: this.spruleId,
        currentTime: this.searchMonth.getTime()
      }
      var this_ = this
      dlHttp.getTable(obj).then((ret) => {
        this_.tableData = ret.data
      })
    },
    /**
     * 选择时间
     */
    getDate() {
      this.getDutyInfo()
    },
    // 上月  下月
    monthSearch(type) {
      // this.searchMonth = type == 'next' ? (this.getMonthTime(++this.month)) : (this.getMonthTime(--this.month));
      this.searchMonth = type == 'next' ? (this.getMonthTime(1)) : (this.getMonthTime(-1))
      this.getDutyInfo()
    },
    /**
     * 返回所到月的日期
     * @param  revise   加减月,当月的就传0,下个月传1,下下月2,上月-1,上上月-2
     */
    getMonthTime(revise) {
      let dateBase = this.searchMonth
      dateBase.setDate(1)
      dateBase = new Date(dateBase.toLocaleDateString())
      dateBase.setMonth(dateBase.getMonth() + revise)
      return dateBase
    },
    /**
     * 负责人
     */
    principal() {
      this.$nextTick(() => {
        this.$refs.userDSel.init(this.deptId)
      })
    },
    onuserDTableOk(seleted) {
      console.log('--------弹出表格确定事件--------', seleted)
      this.forData.fid = seleted[0]['column']['id']
      this.forData.fname = seleted[0]['column']['name']
      this.staff.dutyManagerName = this.forData.fname
    },

    /**
     * 人员
     */
    prinstaff() {
      this.$nextTick(() => {
        this.$refs.userSel.init(this.deptId)
      })
    },
    onuserTableOk (seleted) {
      console.log('--------弹出表格确定事件--------', seleted)
      this.forData.rids = ''
      this.forData.ridNames = ''
      for (let index in seleted) {
        this.forData.rids += seleted[index]['column']['id'] + ','
        this.forData.ridNames += seleted[index]['column']['name'] + ','
      }
      if (this.forData.ridNames.lastIndexOf(',') != -1) {
        this.forData.ridNames = this.forData.ridNames.substring(0, this.forData.ridNames.length - 1)
      }
      if (this.forData.rids.lastIndexOf(',') != -1) {
        this.forData.rids = this.forData.rids.substring(0, this.forData.rids.length - 1)
      }
      this.staff.dutyStaffNames = this.forData.ridNames
    },
    /**
     * 确定   修改当前排班表人员信息
     */
    confirm () {
      this.dialogVisible = false
      this.forData.spId = this.scheduleId
      if (this.forData.fid == '') {
        this.forData.fid = this.staff.dutyManagerId
      }
      if (this.forData.fname == '') {
        this.forData.fname = this.staff.dutyManagerName
      }
      if (this.forData.rids == '') {
        this.forData.rids = this.staff.dutyStaffIds
      }
      if (this.forData.ridNames == '') {
        this.forData.ridNames = this.staff.dutyStaffNames
      }
      dlHttp.editStaff(this.forData).then((res) => {
        if (res.code == 0) {
          this.forData.fid = ''
          this.forData.fname = ''
          this.forData.rids = ''
          this.forData.ridNames = ''
          this.getDutyInfo()
        }
      })
    },
    /**
     * 取消
     */
    cancel() {
      this.dialogVisible = false
    },
    /**
     * 排班表
     */
    getschedule() {
      this.spruleId = ''
      var splan = []
      var rule = []
      this.scheduling = []
      let _par = {
        deptId: this.deptId
      }
      dlHttp.getschedule(_par).then((ret) => {
        splan = ret.data
        for (let s of splan) {
          dlHttp.getrule({ splanId: s.splanId }).then((ret) => {
            rule = ret.data
            for (let r of rule) {
              var obj = {
                srId: '',
                srName: '',
                splanId: ''
              }
              obj.srName = s.splanName + '+' + r.ruleName
              obj.srId = r.spruleId
              obj.splanId = s.splanId
              this.scheduling.push(obj)
            }
          })
        }
      })
    }
  }
}
</script>
<style scoped>
.dutyDialog .el-dialog__header {
  background: #fff;
}

.dutyDialog .el-dialog__header .el-dialog__title {
  color: #606266;
  font-weight: bold;
}

.dutyDialog .el-dialog__body {
  padding: 0px !important;
  min-height: 0px !important;
}

.dutyDialog .el-dialog__headerbtn .el-dialog__close {
  color: #909399 !important;
}

.dutyDialog .el-button {
  padding: 6px 24px !important;
}

#sac-duty-table {
  width: 100%;
  height: 100%;
}

.workRoster .rosterHead div {
  padding: 10px;
  font-weight: bold;
  border-bottom: 1px solid #ddd;
}

.rosterMenu {
  display: flex;
  line-height: 32px;
  padding: 4px 10px;
}

.leftMenu {
  display: flex;
  cursor: pointer;
  flex: 1;
}

.leftMenu .leftMenuItem {
  margin-right: 30px;
  display: flex;
}

.leftMenu .leftMenuItem div {
  margin-right: 10px;
  color: #666;
}

.leftMenu .dep {
  width: 30%;
  max-width: 200px;
}

.leftMenu #sac-select-tree {
  flex: 1;
}

.duty-select {
  padding: 4px;
  width: 120px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.searchBtn {
  color: #fff;
  background: #4b9ff0;
  padding: 2px 16px;
  border-radius: 3px;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  height: 32px;
}

.searchBtn:hover {
  background: #5faeff;
}

.resultHead {
  display: flex;
}

.dateInfo {
  display: flex;
  flex: 1;
  justify-content: space-between;
}

.dateInfo .dateItem {
  text-align: center;
  border: 1px solid #e6e6e6;
  border-right: none;
  border-bottom: none;
  padding: 6px 0px;
  background: #4b9ff0;
  flex: 1;
  color: #fff;
}

.itemInfo {
  text-align: center;
  border: 1px solid #fff;
  border-left: none;
  border-bottom: none;
  height: 34px;
  box-sizing: border-box;
  line-height: 32px;
  background: #f7f6f6;
  flex: 1;
  color: #666;
}

.detailItem {
  flex: 1;
}

.dateHead {
  border: 1px solid #fff;
  border-right: none;
  border-bottom: none;
  height: 34px;
  line-height: 34px;
  background: #f5f5f5;
  box-sizing: border-box;
  text-align: center;
  color: #666;
}

.resultHead .dateHead {
  background: #4b9ff0;
  color: #fff;
}

.rightMenu {
  display: flex;
  cursor: pointer;
  color: #4b9ff0;
}

.rightMenu div {
  margin: 0 8px;
  height: 32px;
  background: #f5f5f5;
  padding: 0 16px;
  border-radius: 3px;
  transition: all 0.3s;
  font-size: 14px;
}

.rightMenu div:hover {
  background: #4b9ff0;
  color: #fff;
}

.resultDetail {
  display: flex;
  margin-bottom: 2px;
}

.selected {
  background: #d8fad8;
}

.resultList {
  height: 42px;
  background: #f7f6f6;
  margin-top: -10px;
}

.duty-head {
  display: flex;
  padding: 10px 0;
  line-height: 1;
  background: #eee;
  border: 1px solid #ddd;
  justify-content: space-around;
}

.duty-master {
  display: flex;
}

.duty-title {
  width: 20%;
  padding: 10px;
  background: #eee;
  text-align: center;
  border-right: 1px solid #ddd;
  box-sizing: border-box;
}

.duty-info {
  flex: 1;
  display: flex;
  align-items: center;
}

.duty-info:nth-child(0) {
  border-bottom: 1px;
}

.duty-info .el-icon-plus {
  margin: 10px;
  cursor: pointer;
}

.duty-member {
  display: flex;
}

.duty-item {
  display: flex;
}

.duty-item div {
  margin: 0px 4px;
}

.rosterResult {
  height: calc(100% - 86px);
  overflow: auto;
}

.rostr .workRoster[data-v-0a719203] {
  border: none;
}

.workRoster {
  width: 100%;
  height: 100%;
  font-size: 14px;
}

.rosterMenu {
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 4px;
}

.el-input__inner {
  text-align: left;
}

.banzhiItem {
  border: 1px solid #fff;
  border-left: none;
  border-top: none;
}

.itemInfo div {
  padding: 0 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
}

.el-dialog__wrapper.dutyDialog .el-dialog {
  height: 300px;
}

.duty-head div div {
  float: left;
  margin: 0 8px;
}
</style>
<style scoped lang="scss">
::v-deep .el-input__inner {
  height: 30px !important;
  text-align: center;
  line-height: 30px;
}
</style>
