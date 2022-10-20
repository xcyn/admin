import { getData } from '@/api/platform/desktop/column'
import { getFile } from '@/business/platform/file/utils/avatar'
import { mapState } from 'vuex'
import { taskTypeOptions, dashboardStatus, genderOptions, favoritesOptions, noticeOptions, unreadMessageOptions, imgOptionsData } from '@/business/platform/bpmn/constants'
import ActionUtils from '@/utils/action'
import Utils from '@/utils/util'
const defaultRouterAlias = '/router-alias/'

import { getLoginInfo } from '@/utils/cpUtils/index'
import * as IndexHttp from '@/api/cpApi/xundianjian/index'

// 平台组织接口
import { getDeptId } from '@/framework/api/reqdemo'

/**
 * 创建组件
 */
export function buildComponent (name, column) {
  try {
    return {
      name: name,
      props: {
        params: {
          type: Object,
          default: function () {
            return {}
          }
        },
        height: {
          type: Number,
          default: column.height ? column.height : 300
        },
        visible: {
          type: Boolean,
          default: false
        }
      },
      filters: {
        filterStatus (val, type) {
          if (Utils.isEmpty(val)) {
            return ''
          }
          if (type === 'pending') {
            const opt = taskTypeOptions.find(x => x['value'] === val)
            return opt ? opt['label'] || '' : ''
          } else if (type === 'already' || type === 'myRequest') {
            const opt = dashboardStatus.find(x => x['value'] === val)
            return opt ? opt['label'] || '' : ''
          } else if (type === 'gender') {
            const opt = genderOptions.find(x => x['value'] === val)
            return opt ? opt['label'] || '' : ''
          } else if (type === 'favorites') {
            const opt = favoritesOptions.find(x => x['value'] === val)
            return opt ? opt['label'] || '' : ''
          } else if (type === 'notice') {
            const opt = noticeOptions.find(x => x['value'] === val)
            return opt ? opt['label'] || '' : ''
          } else if (type === 'unreadMessage') {
            const opt = unreadMessageOptions.find(x => x['value'] === val)
            return opt ? opt['label'] || '' : ''
          }
          return val
        }
      },
      data () {
        return {
          loading: false,
          title: `${column.name}`,
          alias: `${column.alias}`,
          attrs: this.getAttrs(),
          variables: {}, // 一些变量，比如分页信息
          data: null,
          quickNavigationData: [],
          stautusOptions: [],
          bpmnFormrenderDialogVisible: false, // 表单
          editId: '',
          imgOptionsData: imgOptionsData,
          bodyShow: true,
          show: false,
          showHeight: '',
          cardHeight: 100 + '%',

          limitCountData: {},
          totalCount: 0,
          limit: 0,
          page: 1,
          needPage: false,
          isTrottingHorseLamp: false,

          activeName: 'innerMessage',
          unreadMessageOption: {},

          intervalAction: '',

          formName: 'form',
          dialogFormVisible: false,
          formLabelWidth: '120px',
          form: {
            label: '',
            url: '',
            target: ''
          },
          defaultForm: {},

          pendingTabActiveName: 'user-type',
          bodyParams: ActionUtils.formatParams({}, {}, {}),
          pendingBusinessOption: {},

          rules: {
            label: [{ required: true, message: this.$t('validate.required') }],
            url: [{ required: true, message: this.$t('validate.required') }],
            target: [{ required: true, message: this.$t('validate.required') }]
          },
          checked: false,
          deptIds: [],

          //* *****************巡点检 start***********************//
          user: {},

          userId: '',
          userName: '',
          orgId: '',
          companyId: '',

          waitTaskLoading: false,
          waitTaskSelectValue: '1',
          waitTaskList: [], // 存储待检任务列表

          abnormalLoading: false,
          abnormalSelectValue: '1',
          abnormalTaskList: [], // 存储异常信息列表

          taskStatLoading: false, // 任务统计相关
          taskStatSelectValue: '1',
          taskStatStartDate: '',
          taskStatEndDate: '',
          pickerOptionsStart: { // 开始时间小于等于结束时间
            disabledDate: time => {
              if (this.taskStatEndDate) {
                return time.getTime() > new Date(this.taskStatEndDate).getTime()
              }
            }
          },
          pickerOptionsEnd: { // 结束时间大于等于开始时间
            disabledDate: time => {
              if (this.taskStatStartDate) {
                return time.getTime() < new Date(this.taskStatStartDate).getTime() - 86400000
              }
            }
          },
          leakStatLoading: false, // 漏检统计相关
          leakStatSelectValue: '1',
          leakMonth: '',
          nofify: '', // 报警弹出框
          currentDate: this.formatDate(0), // 当前日期
          currentMonth: this.formatMonth(), // 当前星期
          //* *****************巡点检 end***********************//
          //* *****************两票管理 start***********************//
          buttonHeight: '',
          buttonData: [
            { name: '电气工作票', link: { path: '/workPicketManage/wtWorkTktInvAdd', query: { option: 'add', wtTypeNo: 'DQ', wtTypeId: '1352445942619488258' } } },
            { name: '风电机组工作票', link: { path: '/workPicketManage/wtWorkTktInvAdd', query: { option: 'add', wtTypeNo: 'FD', wtTypeId: '1335749492414099458' } } },
            { name: '外包电气工作票', link: { path: '/workPicketManage/wtWorkTktInvAdd', query: { option: 'add', wtTypeNo: 'DW', wtTypeId: '1351479322367541249' } } },
            { name: '外包风电机组工作票', link: { path: '/workPicketManage/wtWorkTktInvAdd', query: { option: 'add', wtTypeNo: 'FW', wtTypeId: '1349310644293218306' } } },
            { name: '特殊作业票', link: { path: '/workPicketManage/wtWorkAttTktAdd', query: { option: 'add', wtTypeNo: 'TS' } } },
            { name: '生产区域工作联系单', link: { path: '/workPicketManage/wtWorkTktInvAdd', query: { option: 'add', wtTypeNo: 'SQ', wtTypeId: '1334849037962063874' } } },
            { name: '外包生产区域工作联系单', link: { path: '/workPicketManage/wtWorkTktInvAdd', query: { option: 'add', wtTypeNo: 'DW', wtTypeId: '1353976825696608258' } } },
            { name: '紧急抢修单', link: { path: '/workPicketManage/wtWorkTktInvAdd', query: { option: 'add', wtTypeNo: 'QX', wtTypeId: '1340525405404241922' } } },
            { name: '一级动火票', link: { path: '/workPicketManage/wtWorkAttTktAdd', query: { option: 'add', wtTypeNo: 'DH1' } } },
            { name: '二级动火票', link: { path: '/workPicketManage/wtWorkAttTktAdd', query: { option: 'add', wtTypeNo: 'DH2' } } },
            { name: '倒闸操作票', link: { path: '/workPicketManage/otOpTktInvAdd', query: { option: 'add' } } },
            { name: '机械操作票', link: { path: '/workPicketManage/otOpTktInvAdd', query: { option: 'add' } } }
          ]
          //* *****************两票管理 end***********************//

        }
      },
      computed: {
        ...mapState({
          userInfo: state => state.ibps.user.info
        })
      },
      mounted () {
        this.defaultForm = JSON.parse(JSON.stringify(this.form))
        this.$nextTick(() => {
          // this.loading = true
          // 巡检初始化
          if (column && column.alias && column.alias.indexOf('xdj_') > -1) {
            this.user = getLoginInfo()
            this.userId = this.user?.user?.id ?? ''
            this.userName = this.user?.user?.name ?? ''
            this.orgId = this.user?.org?.id ?? ''
            this.companyId = this.user?.company?.companyId ?? ''
            this.taskStatStartDate = this.$tools.formatTime((new Date().getTime() - 1000 * 60 * 60 * 24 * 10), 'n')
            this.taskStatEndDate = this.$tools.formatTime(new Date(), 'n')
            this.leakMonth = this.$tools.formatTime(new Date(), 'm')
          }

          this.fetchData()
          // 初始加载巡点检方法
          // this.initXunDianJian()
          //* *****************两票管理 ***********************//
          setTimeout(() => {
            this.resetHeight()
          }, 500)
          window.addEventListener('resize', () => {
            this.resetHeight()
          })
        })
        // 启用刷新
        if (column.supportRefesh) {
          this.resfresh(column.refeshTime, column.timeUnit)
        }
      },
      // 实例销毁前去除定时器
      beforeDestroy () {
        clearInterval(this.intervalAction)
      },
      methods: {
        //* *****************两票管理 start***********************//
        jumpLink (link) {
          this.$router.push(link)
        },
        resetHeight () {
          this.$nextTick(() => {
            let widthB = parseInt($('#buttomRow').width() * 0.075)
            this.buttonHeight = widthB + 'px'
          })
        },
        initXunjianParam (param) {
          let obj = {
            flag: false,
            params: {}
          }
          if (param.alias) {
            // 待检任务
            if (param.alias === 'xdj_djrw') {
              obj.flag = true
              obj.params = {
                userId: this.userId,
                orgId: this.orgId,
                companyId: this.companyId,
                type: this.waitTaskSelectValue
              }
            }
            // 任务统计
            if (param.alias === 'xdj_rwtj') {
              obj.flag = true
              obj.params = {
                userId: this.userId,
                orgId: this.orgId,
                companyId: this.companyId,
                type: this.taskStatSelectValue,
                startDate: this.taskStatStartDate,
                endDate: this.taskStatEndDate
              }
            }
            // 漏检信息
            if (param.alias === 'xdj_ljtj') {
              obj.flag = true
              obj.params = {
                userId: this.userId,
                userName: this.userName,
                orgId: this.orgId,
                companyId: this.companyId,
                type: this.leakStatSelectValue,
                month: this.leakMonth
              }
            }
            // 异常信息
            if (param.alias === 'xdj_ycxx') {
              obj.flag = true
              obj.params = {
                userId: this.userId,
                orgId: this.orgId,
                companyId: this.companyId,
                type: this.abnormalSelectValue
              }
            }
          }
          return obj
        },
        //* *****************两票管理 end***********************//
        async fetchData (columns, params = {}) {
          // let param = { userId: this.userId, orgId: this.orgId, companyId: this.companyId, type: type }
          // this.fetchData('', param)
          this.showHeight = this.getHeight()
          this.isTrottingHorseLamp = column.showEffect === 1
          const param = Utils.isNotEmpty(columns) ? columns : column.alias === 'unreadMessage' || column.alias === 'pendingBusiness' ? { dataMode: column.dataMode, dataFrom: column.dataFrom } : column
          if (param.name === '日志登记') {
            // 根据登录人组织id获取部门
            await getDeptId({ orgId: this.$store.state.ibps.user.info.org.id }).then(res => {
              if (res.state == 200) {
                if (res.data != null) {
                  this.deptIds = res.data
                }
              }
            })
            var parm = {
              companyId: this.$store.state.ibps.user.info.company.companyId,
              deptId: this.deptIds.toString()
            }
            params = parm
          }
          // 巡检
          let xunjianObj = this.initXunjianParam(param)
          if (xunjianObj.flag) {
            params = xunjianObj.params
          }
          getData(param, params).then(response => {
            let data = null
            try {
              if (response.data && response.data.records != null) {
                data = response.data.records
              } else if (response.data != null) {
                data = response.data
              } else if (response.result != null) {
                if (response.result.records != null) {
                  data = response.result.records
                } else {
                  data = response.result
                }
              } else {
                data = response.message
              }
              // data = (null != response.data) ? response.data : response.result.records : response.result;
            } catch (e) {
              console.log(e)
            }

            if (Utils.isNotEmpty(data) && Utils.isString(data)) {
              data = Utils.parseData(data)
            }

            if (param.name == '缺陷统计') {
              var this_ = this
              let tmp_data = data.filter(function (item, index, array) {
                return !!this_.stateFormat(item, null)
              })
              data = tmp_data
            }
            var check = Object.prototype.toString
            this.data = (check.call(data) === '[object Object]') ? data.dataResult ? data.dataResult : data : data
            this.variables = response.variables
            this.loading = false
          }).catch((e) => {
            this.loading = false
          })
        },
        getPhoto (photo) {
          return getFile(photo)
        },
        getHeightNoUnit () {
          // 高度 - header - 边框
          if (!this.visible) {
            return this.height ? (this.height - 60 - 20) : 150
          } else {
            return 150
          }
        },
        getHeight () {
          // 高度 - header - 边框
          if (!this.visible) {
            return this.height ? (this.height - 60 - 20) + 'px' : '150px'
          } else {
            return 100 + '%'
          }
        },
        getDashboardHeight () {
          return this.height ? (this.height + 20) + 'px' : '150px'
        },
        getAttrs () {
          const item = JSON.parse(JSON.stringify(column))
          item.templateHtml = null
          return item
        },
        getFullCalendarEvents (data) {

        },
        getFullCalendarConfig (data) {
          const events = data === null ? [] : Utils.parseJSON(data)
          return {
            height: this.height ? this.height : 180,
            headerToolbar: {
              start: 'title',
              center: '',
              end: 'prev,next,today,dayGridMonth,timeGridWeek,timeGridDay,listMonth'
              //  end: 'prev,next,today,month,agendaWeek,agendaDay,listWeek'
            },
            selectable: true,
            editable: false,
            dayMaxEvents: 3, // allow "more" link when too many events
            locale: this.$i18n.locale ? this.$i18n.locale.toLowerCase() : 'zh-cn',
            events: events
          }
        },
        refreshData () {
          this.fetchData()
        },
        /**
                 * 处理按钮事件
                 * @param {*} command
                 * @param {*} position
                 * @param {*} data
                 * @param {*} actions
                 */
        handleActionEvent (command, position, data, actions) {
          switch (command) {
            case 'refresh': // 刷新
              this.refreshData()
              if (column.alias === 'unreadMessage' && this.activeName !== 'innerMessage') {
                this.activeName = 'innerMessage'
              } else if (column.alias === 'pendingBusiness' && this.pendingTabActiveName !== 'user-type') {
                this.pendingTabActiveName = 'user-type'
              }
              this.$refs['toolbar'].$children[0].$children[0].$children[0].$el.blur()
              break
            case 'fullscreen': // 全屏
              this.handleFullscreen()
              break
            case 'more': // 更多
              this.handleMore()
              break
            case 'collapse': // 收缩
            case 'expansion': // 展开
              this.handleCollapseExpand(command, data, actions)
              break
            default:
              break
          }
        },
        // 分页
        currentChange (page) {
          this.data = this.limitCountData[page]
        },
        initAttr () {
          this.activeName = 'innerMessage'
          this.pendingTabActiveName = 'user-type'
        },
        // 刷新
        resfresh (refeshTime, timeUnit) {
          var h, m
          const currentTimestamp = Math.round(new Date() / 1000)
          switch (timeUnit) {
            case 'hour':
              h = Number(refeshTime * 3600)
              var hourTimestamp = currentTimestamp + h
              this.intervalAction = setInterval(() => {
                const timestamp = Math.round(new Date() / 1000)
                this.loading = false
                if (timestamp === hourTimestamp) {
                  this.refreshData()
                  this.initAttr()
                  hourTimestamp = timestamp + h
                  this.loading = true
                }
              }, 1000)
              break
            case 'minute':
              m = Number(refeshTime * 60)
              var minuteTimestamp = currentTimestamp + m
              this.intervalAction = setInterval(() => {
                const timestamp = Math.round(new Date() / 1000)
                this.loading = false
                if (timestamp === minuteTimestamp) {
                  this.refreshData()
                  this.initAttr()
                  minuteTimestamp = timestamp + m
                  this.loading = true
                }
              }, 1000)
              break
            case 'second':
              var secondTimestamp = currentTimestamp + refeshTime
              this.intervalAction = setInterval(() => {
                const timestamp = Math.round(new Date() / 1000)
                this.loading = false
                if (timestamp === secondTimestamp) {
                  this.refreshData()
                  this.initAttr()
                  secondTimestamp = timestamp + refeshTime
                  this.loading = true
                }
              }, 1000)
              break
          }
        },
        // ***************
        // 传递 年份
        transmityear () {
          var dd = new Date()
          var year = dd.getFullYear()
          var startDate = year + '-01-01'
          var endDate = year + '-12-31'
          var param = { 'startDate': startDate, 'endDate': endDate }
          if (this.checked == true) {
            param.level = 'zdyh'
          }
          this.fetchData('', param)
        },
        // 传递 月份
        transmitmonth () {
          var d = new Date()
          var year = d.getFullYear()
          var month = d.getMonth() + 1
          month = month < 10 ? '0' + month : month
          var firstday = year + '-' + month + '-' + '01'
          var lastday = ''
          if (month == '01' || month == '03' || month == '05' || month == '07' || month == '08' || month == '10' || month == '12') {
            lastday = year + '-' + month + '-' + 31
          } else if (month == '02') {
            if ((year % 4 == 0 && year % 100 != 0) || (year % 100 == 0 && year % 400 == 0)) {
              lastday = year + '-' + month + '-' + 29
            } else {
              lastday = year + '-' + month + '-' + 28
            }
          } else {
            lastday = year + '-' + month + '-' + 30
          }
          var param = { 'startDate': firstday, 'endDate': lastday }
          if (this.checked == true) {
            param.level = 'zdyh'
          }
          this.fetchData('', param)
        },
        // 跳转定期工作列表页
        skip (row) {
          this.$router.push({
            name: 'regularWork-woReguWorkList',
            params: {
              data: { planId: row.planId },
              type: 'view'
            }
          })
        },
        // 缺陷统计场站名称转换
        stateFormat (row, column) {
          for (let cz of this.$store.state.ibps.user.info.stationList) {
            if (row.cz === cz.id) {
              return cz.name
            }
          }
          return ''
        },
        // 新增缺陷
        defectAdd () {
          this.$router.push({ name: 'equipDefect-defectMgtListAdd' })
        },
        // 根据场站id跳转缺陷页面
        equipDefect (row) {
          this.$router.push({ name: 'equipDefect-defectMgtList', params: { cz: row.cz } })
        },
        // 缺陷统计  已消除
        yxc (row) {
          this.$router.push({ name: 'equipDefect-defectMgtList', params: { cz: row.cz, state: 'closed' } })
        },
        // 缺陷统计   不具备消缺
        bjbxqtj (row) {
          this.$router.push({ name: 'equipDefect-defectMgtList', params: { cz: row.cz, state: 'suspended' } })
        },
        // 日志登记  更多信息
        logAll () {
          var ldate = [
            this.getBeforeDate(5),
            this.getdate()
          ]
          this.$router.push({ name: 'shiftduty-shiftDutyLogList', query: { ldate: ldate } })
        },
        /**
                 * 日期转换
                 */
        getBeforeDate (num) {
          let n = num
          let d = new Date()
          let year = d.getFullYear()
          let mon = d.getMonth() + 1
          let day = d.getDate()
          if (day <= n) {
            if (mon > 1) {
              mon = mon - 1
            } else {
              year = year - 1
              mon = 12
            }
          }
          d.setDate(d.getDate() - n)
          year = d.getFullYear()
          mon = d.getMonth() + 1
          day = d.getDate()
          let s = year + '-' + (mon < 10 ? ('0' + mon) : mon) + '-' + (day < 10 ? ('0' + day) : day)
          return s
        },
        /**
                 * 时间转换
                 */
        getdate () {
          var date = new Date()
          var year = date.getFullYear()
          var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
          var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
          // 拼接
          return year + '-' + month + '-' + day
        },
        // 跳转日志浏览页面
        browse (row) {
          this.$router.push({
            name: 'shiftduty-logBrowse',
            query: {
              logId: row.logId
            }
          })
        },
        // 首页日志登记   登记按钮是否展示
        isShowDj (row) {
          return row.state == 0 && row.dutyManagerId == this.$store.state.ibps.user.info.user.id
        },
        // 首页日志登记   接班按钮是否展示
        isShowJb (row) {
          return row.state == 1 && row.dutyManagerId == this.$store.state.ibps.user.info.user.id
        },
        // 跳转日志登记页面
        dj (row) {
          // if (this.$store.state.ibps.user.info.user.id == row.dutyManagerId) {
          this.$router.push({
            name: 'shiftduty-logregister',
            query: {
              logId: row.logId
            }
          })
          // } else {
          //   this.$message.warning("不是日志当前值班负责人,无法登记")
          // }
        },
        // 对于当前日志接班
        jb (row) {

        },
        operationDeptName (row) {
          this.$router.push({
            name: 'woOrder-woReguWorkTask',
            query: {
              operationDeptId: row.operationDeptId,
              woTypeNo: 'ta_pw'
            }
          })
        },
        woNumber (row) {
          this.$router.push({
            name: 'woOrder-woReguWorkTask',
            query: {
              operationDeptId: row.operationDeptId,
              woTypeNo: 'ta_pw'
            }
          })
        },
        completeNumber (row) {
          this.$router.push({
            name: 'woOrder-woReguWorkTask',
            query: {
              operationDeptId: row.operationDeptId,
              woTypeNo: 'ta_pw',
              state: 'js'
            }
          })
        },
        unCompleteNumber (row) {
          this.$router.push({
            name: 'woOrder-woReguWorkTask',
            query: {
              operationDeptId: row.operationDeptId,
              woTypeNo: 'ta_pw',
              state: 'zx'
            }
          })
        },

        emitActionEventHandler (command) {
          this.$emit('action-event', command, ...Array.from(arguments).slice(1))
        },

        handleApprove (id) {
          this.$emit('action-event', 'approve', id)
        },

        handleUnreadMessage (id) {
          this.$emit('action-event', 'unRead', id)
        },
        // 处理全屏
        handleFullscreen () {
          this.emitActionEventHandler('fullscreen', {
            id: this.attrs.id
          })
        },
        openPlate (url) {
          this.$router.push(defaultRouterAlias + url)
        },
        /**
                 * 处理更多
                 */
        handleMore () {
          if (this.attrs.colUrl === '') {
            this.$message({
              message: '未设置更多路径的url',
              type: 'warning'
            })
            return
          }
          if (this.attrs.colUrl.indexOf('type') != -1) {
            this.$router.push(this.attrs.colUrl.substring(0, this.attrs.colUrl.indexOf('?')))
          } else {
            this.$router.push(defaultRouterAlias + this.attrs.colUrl)
          }
        },
        // 未读消息
        handleClick (option) {
          this.unreadMessageOption = option
          option[this.activeName].dataMode = column.dataMode
          this.fetchData(option[this.activeName])
        },
        // 待办事务
        handleTabClick (option) {
          this.pendingBusinessOption = option
          option[this.pendingTabActiveName].dataMode = column.dataMode
          this.fetchData(option[this.pendingTabActiveName])
        },
        handleFlowClick (params) {
          params.$alias = this.alias
          this.emitActionEventHandler('flow', params)
        },
        addBreadcrumb () {
          let i = this.data.length
          i++
          this.data.push({
            url: 'http://bpmhome.cn/index.html',
            label: '地址' + i
          })
        },
        handleCollapseExpand (command, data, actions) {
          this.bodyShow = !this.bodyShow
          const index = actions.findIndex(action => action.key === data.key)
          actions[index].key = this.bodyShow ? 'collapse' : 'expansion'
          if (!this.visible) {
            this.emitActionEventHandler(command, {})
            return
          }
          this.showHeight = this.bodyShow ? this.getHeight() : 0
          this.$refs['toolbar'].callback(actions)
        },

        formValidate () {
          this.$nextTick(() => {
            this.$refs[this.formName].validate(() => { })
          })
        },
        getFormData () {
          // 固定模拟数据
          this.form = JSON.parse(JSON.stringify(this.defaultForm))
          this.formValidate()
          this.dialogFormVisible = true
          // this.$refs[this.formName] ? this.$refs[this.formName].resetFields() : null
          // TODO:接口暂未构建，先隐藏。
          // this.fetchData()
        },
        handleClose (i) {
          this.quickNavigationData.splice(i, 1)
          // TODO: 传递后台删减后得数据。
        },
        // 错误头像的照片
        errorAvatarHandler (data) {
          // data.photo = require('https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png')
          return true
        },
        close () {
          this.$refs[this.formName].resetFields()
          this.dialogFormVisible = false
        },
        confirm () {
          // TODO:未有API接口 模拟数据不会因添加而变化
          this.$refs[this.formName].validate(valid => {
            if (valid) {
              this.quickNavigationData.push(this.form)
              this.dialogFormVisible = false
            } else {
              ActionUtils.saveErrorMessage()
            }
          })
        },

        //* ********************巡点检项目首页js方法开始******************* *//

        // initXunDianJian() {
        //   // 获得当前人的信息
        //   this.user = getLoginInfo()

        //   this.userId = this.user.user.id
        //   this.userName = this.user.user.name
        //   this.orgId = this.user.org.id
        //   // this.userId = "791951250265473024";
        //   // this.userName = "wangyu";
        //   // this.orgId = "789146440629747712";

        //   // 结束日期，默认为当前日期
        //   var curDate = new Date()
        //   var endYear = curDate.getFullYear().toString()
        //   var endMonth = curDate.getMonth() + 1
        //   var endDay = curDate.getDate().toString()
        //   endMonth = (endMonth < 10 ? '0' + endMonth : endMonth)
        //   endDay = (endDay < 10 ? '0' + endDay : endDay)
        //   var endDate = (endYear + '-' + endMonth.toString() + '-' + endDay)

        //   // 开始日期,默认比结束日期小10天
        //   curDate.setDate(curDate.getDate() - 10)

        //   var startYear = curDate.getFullYear().toString()
        //   var startMonth = curDate.getMonth() + 1
        //   var startDay = curDate.getDate().toString()

        //   startMonth = (startMonth < 10 ? '0' + startMonth : startMonth)
        //   startDay = (startDay < 10 ? '0' + startDay : startDay)
        //   var startDate = (startYear + '-' + startMonth.toString() + '-' + startDay)

        //   this.taskStatStartDate = startDate
        //   this.taskStatEndDate = endDate

        //   this.leakMonth = endYear + '-' + endMonth.toString()

        //   // 获得公司列表
        //   CommonHttp.queryCompany(this.orgId).then((ret) => {
        //     let company = ret.data.dataResult
        //     if (company != null && company.length > 0) {
        //       this.companyId = company[0].ID_
        //       //  this.companyId = "775492674567274496";
        //       this.waitTaskSelectValue = '1'
        //       this.onWaitTaskChanged(1)

        //       this.abnormalSelectValue = '1'
        //       this.onAbnormalChanged(1)

        //       this.taskStatSelectValue = '1'
        //       this.onTaskStat(1)

        //       this.leakStatSelectValue = '1'
        //       this.onLeakStat(1)
        //     }
        //     setTimeout(function() {
        //       this.loading = false
        //     }, 1000)
        //   })
        // },
        // 全屏
        onFullscreen () {
          this.emitActionEventHandler('fullscreen', {
            id: this.attrs.id
          })
        },
        // 收缩
        onExpansion () {
          this.bodyShow = !this.bodyShow
          if (!this.visible) {
            this.emitActionEventHandler('expansion', {})
            return
          }
        },
        // 展开
        onCollapse () {
          this.bodyShow = !this.bodyShow
          if (!this.visible) {
            this.emitActionEventHandler('collapse', {})
            return
          }
        },
        // 调整图表的高
        getXunDianJianHeight () {
          // 高度 - header - 边框
          if (!this.visible) {
            return this.height ? (this.height - 100 - 20) + 'px' : '150px'
          } else {
            return 100 + '%'
          }
        },

        /** ***********************待检任务 开始*****************************/
        // 待检任务的列表事件
        onWaitTaskChanged (type) {
          // 查询待检任务
          this.waitTaskSelectValue = type
          this.fetchData('')
        },
        // 待检任务的刷新事件
        onWaitTaskRefresh () {
          this.fetchData('')
        },
        // 待检任务的更多事件
        onWaitTaskMore () {
          if (this.waitTaskSelectValue == '1') {
            let formSearchData = { taskState: '1', companyId: this.companyId, planStaffIds: this.userId }
            this.$router.push({ path: '/xundianjian/taskPlanList', query: { formSearchData: formSearchData } })
          } else if (this.waitTaskSelectValue == '2') {
            let formSearchData = { taskState: '1', companyId: '' + this.companyId, workDeptNo: '' + this.orgId }
            this.$router.push({ path: '/xundianjian/taskPlanList', query: { formSearchData: formSearchData } })
          } else if (this.waitTaskSelectValue == '3') {
            let formSearchData = { taskState: '1', companyId: '' + this.companyId }
            this.$router.push({ path: '/xundianjian/taskPlanList', query: { formSearchData: formSearchData } })
          }
        },
        // 格式化待办任务的日期，只显示年月日
        formatPlanStartTime (row, column) {
          if (row.planStartTime != null && row.planStartTime != '') {
            return row.planStartTime.substring(0, 10)
          }
          return ''
        },
        // 格式化待办任务的开始结束时间
        formatPlanEndTime (row, column) {
          let time = ''
          if (row.planStartTime != null && row.planStartTime != '') {
            time += row.planStartTime.substring(11, 16) + '-'
          }
          if (row.planEndTime != null && row.planEndTime != '') {
            time += row.planEndTime.substring(11, 16)
          }
          return time
        },
        // 浏览事件
        onWaitTaskView (taskId) {
          this.$router.push({ path: '/xundianjian/inspTourCheckPlanMgtBrowse', query: { taskId: taskId, type: 'view' } })
        },
        // 领取任务
        onGateTask (planStaffIds, taskId, taskState) {
          if (planStaffIds != null && planStaffIds.indexOf(this.userId) > -1) {
            if (taskState == 1) {
              IndexHttp.getGateTask(taskId, this.userId, this.userName).then((res) => {
                if (res.code === 0) {
                  this.$router.push({ path: '/xundianjian/taskDo', query: { taskId: taskId } })
                } else {
                  this.$XModal.message({ message: '领取失败', status: 'error' })
                }
              })
            } else {
              this.$router.push({ path: '/xundianjian/taskDo', query: { taskId: taskId } })
            }
          } else {
            this.$message.error('您不是计划巡检人，无法领取任务!')
          }
        },
        // 华能项目领取任务
        onHnGateTask (planStaffIds, taskId, taskState, actualStaffId, riMethod) {
          this.$store.commit('ibps/page/noKeepAlivePush', 'hnTaskDo')
          if (planStaffIds != null && planStaffIds.indexOf(this.userId) > -1) {
            if (taskState == 1) {
              IndexHttp.getGateTask(taskId, this.userId, this.userName).then((res) => {
                if (res.code === 0) {
                  if (riMethod === 0) {
                    this.$store.commit('ibps/page/noKeepAlivePush', 'hnTaskDo')
                    this.$router.push({ path: '/xundianjian/hnTaskDo', query: { taskId: taskId } })
                  } else {
                    this.$router.push({ path: '/xundianjian/taskDo', query: { taskId: taskId } })
                  }
                } else {
                  this.$XModal.message({ message: '领取失败', status: 'error' })
                }
              })
            } else {
              if (actualStaffId != null && actualStaffId.indexOf(this.userInfo.user.id) > -1) {
                if (riMethod === 0) {
                  this.$store.commit('ibps/page/noKeepAlivePush', 'hnTaskDo')
                  this.$router.push({ path: '/xundianjian/hnTaskDo', query: { taskId: taskId } })
                } else {
                  this.$router.push({ path: '/xundianjian/taskDo', query: { taskId: taskId } })
                }
              } else {
                this.$message.error('您不是领取任务执行人，无法执行任务!')
              }
            }
          } else {
            this.$message.error('您不是计划巡检人，无法领取/执行任务!')
          }
        },
        // 生成临时任务，路线弹出框
        onGenTempTask () {
          IndexHttp.getMyLineList(this.companyId, this.userId).then((res) => {
            if (res.code === 0) {
              this.$prompt('请输入邮箱', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                selectPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
                inputErrorMessage: '邮箱格式不正确'
              }).then(({ value }) => {
                this.$message({
                  type: 'success',
                  message: '你的邮箱是: ' + value
                })
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '取消输入'
                })
              })

              let hml = "请选择路线：<select id='tempTaskSelect'><option value=''>请选择</option>"
              let data = res.result
              for (let i = 0; i < data.length; i++) {
                hml += "<option value='" + data[i].lineId + "'>" + data[i].lineName + '</option>'
              }
              hml += '</select>'
              this.$alert(hml, {
                dangerouslyUseHTMLString: true
              }).then(({ value }) => {
                let lineId = $('#tempTaskSelect').val()
                if (lineId != null && lineId != '') {
                  IndexHttp.taskIndexForTemp(lineId).then((res) => {
                    if (res.code === 0) {
                      this.$message({ type: 'success', message: '生成临时任务成功！' })
                      this.onWaitTaskChanged(this.waitTaskSelectValue)
                    } else {
                      this.$message({ type: 'error', message: '生成临时任务失败！' })
                    }
                  })
                }
              })
            }
          })
        },
        /** ***********************待检任务 结束*****************************/

        /** ***********************异常信息 开始*****************************/
        // 异常信息的列表事件
        onAbnormalChanged (type) {
          // 查询待检任务
          // this.waitTaskLoading=true;
          this.abnormalSelectValue = type
          this.fetchData('')
        },
        // 异常信息的刷新事件
        onAbnormalRefresh () {
          this.fetchData('')
        },
        // 异常信息的更多事件
        onAbnormalMore () {
          if (this.abnormalSelectValue == '1') {
            let formSearchData = { inspMethod: '1', execStatus: '1', companyId: this.companyId, execUserId: this.userId }
            this.$router.push({ path: '/xundianjian/inspAbnlDataMgt', query: { formSearchData: formSearchData } })
          } else if (this.abnormalSelectValue == '2') {
            let formSearchData = { inspMethod: '1', execStatus: '1', companyId: this.companyId, workDeptNo: this.orgId }
            this.$router.push({ path: '/xundianjian/inspAbnlDataMgt', query: { formSearchData: formSearchData } })
          } else if (this.abnormalSelectValue == '3') {
            let formSearchData = { inspMethod: '1', execStatus: '1', companyId: this.companyId }
            this.$router.push({ path: '/xundianjian/inspAbnlDataMgt', query: { formSearchData: formSearchData } })
          }
        },
        // 进入新增缺陷页面，把设备位置及异常信息带过去
        onAddDf (row) {
          if (row != null) {
            this.$router.push({ path: '/equipDefect/defectMgtListAdd', query: { source: 'xundianjian', locaId: row.locaId, locaNo: row.locaNo, locaName: row.locaName, abnormalMemo: row.abnormalMemo } })
          }
        },
        // 链接查看缺陷详细信息
        onInfoDf (row) {
          if (row != null) {
            this.$router.push({ path: '/equipDefect/defectMgtListBrowse', query: { source: 'xundianjian', dfNo: row.dfNo } })
          }
        },
        // 浏览事件
        onAbnormalView (taskInspId) {
          this.$router.push({ path: '/xundianjian/abnormalDataInfo', query: { taskInspId: taskInspId } })
        },
        // 判断测量范围上下限是否填写,给不同的展示方式
        judgeMeasuringRange (lowerLimit, upperLimit) {
          if (lowerLimit === '') {
            return '< ' + upperLimit
          } else if (upperLimit === '') {
            return '> ' + lowerLimit
          } else {
            return lowerLimit + ' ~ ' + upperLimit
          }
        },
        /** ***********************异常信息 结束*****************************/

        /** ***********************任务统计 开始*****************************/
        // 查询图表数据
        onTaskStat (type) {
          // this.taskStatLoading=true;
          this.taskStatSelectValue = type
          this.fetchData('')
        },
        // 刷新图表数据
        onTaskStatRefresh () {
          this.fetchData('')
        },
        /** ***********************任务统计 结束*****************************/

        /** ***********************漏检统计 开始*****************************/
        // 查询图表数据
        onLeakStat (type) {
          // this.taskStatLoading=true;
          this.leakStatSelectValue = type
          this.fetchData('')
        },
        // 刷新图表数据
        onLeakStatRefresh () {
          this.fetchData('')
        },
        // 左右箭头查询图表数据
        onLeakSearch (flag) {
          // 获得查询条件上的日期并转换成日期类型
          var s = this.leakMonth
          s = s.replace(/-/g, '/')
          var d = new Date(s + '/01 :00:00:00') // 此处加日时分秒是为了在各浏览器下兼容时间格式

          // 如果向左，月份减一，如果向右，月份加一
          if (flag == 1) {
            d.setMonth(d.getMonth() - 1)
          } else if (flag == 2) {
            d.setMonth(d.getMonth() + 1)
          }

          // 取出年、月，重新组合字符串在查询条件中显示
          var year = d.getFullYear()
          var month = d.getMonth() + 1
          month = (month < 10 ? '0' + month : month)
          var mydate = (year.toString() + '-' + month.toString())

          this.leakMonth = mydate

          // 执行查询
          this.onLeakStat(this.leakStatSelectValue)
        },
        /** ***********************漏检统计 结束*****************************/

        //* **************报警 start ******************//
        getAlarm () {
          IndexHttp.getNewAlarm(this.userId).then((res) => {
            let thisTimeCount = res.data.thisTimeCount
            if (thisTimeCount > 0) {
              const h = this.$createElement

              let iscLinkageEventsData = res.data.iscLinkageEventsDataDO
              let dataTypeName = ''
              if (iscLinkageEventsData.dataType == 1) {
                dataTypeName = '视频报警'
              } else if (iscLinkageEventsData.dataType == 2) {
                dataTypeName = '传感器报警'
              } else if (iscLinkageEventsData.dataType == 3) {
                dataTypeName = '未带安全帽报警'
              }
              if (iscLinkageEventsData.dataType == 4) {
                dataTypeName = '烟火报警'
              }

              let alarmTime = iscLinkageEventsData.alarmTime
              let thisTimeCount = res.data.thisTimeCount
              let todayCount = res.data.todayCount
              let monthCount = res.data.monthCount

              let ht = '<div style="width:100%;float:left;box-sizing:border-box;">'
              ht += '<div style="font-size:18px;color:#e42904;margin:10px 0;line-height:24px;"><bentiao style="cursor: pointer;">' + dataTypeName + '，请及时查看！</bentiao></div>'
              ht += '<span style="color:#4b9ff0;font-size:16px;">告警时间：</span>'
              ht += '<p style="color: #e42904;font-size: 18px;">' + alarmTime + '</p>'
              ht += '<p style="font-size:14px;color:#666; margin-top:10px;">&nbsp;&nbsp;&nbsp;最近：<zuijin style="font-size:20px; margin:0 5px;color:#4b9ff0;cursor: pointer;">' + thisTimeCount + '</zuijin>条,&nbsp;&nbsp;&nbsp;今日：<jinri style="font-size:20px; margin:0 5px;color:#4b9ff0;cursor: pointer;">' + todayCount + '</jinri>条&nbsp;&nbsp;&nbsp;当月：<benyue style="font-size:20px; margin:0 5px;color:#4b9ff0;cursor: pointer;">' + monthCount + '</benyue>条&nbsp;&nbsp;&nbsp;</p>'
              ht += '<gengduo style="float:right;font-size:14px;color:#4b9ff0;cursor: pointer;">查看更多</gengduo>'
              ht += '</div>'

              // 在API中notify有一个close（）方法，利用这个可以控制每次只会弹出一个notify。
              if (this.nofify) {
                this.nofify.close()
              }

              this.nofify = this.$notify({
                title: '告警提醒',
                dangerouslyUseHTMLString: true,
                message: ht,
                position: 'bottom-right',
                duration: 0,
                type: 'warning',
                onClose: () => {
                  IndexHttp.saveUserLookAlarm(this.userId, this.userName, res.data.thisTimeCountTimeSearch).then((res) => {
                    if (res.code === 0) {

                    }
                  })
                }
              })

              // 点击 最近数量 查询报警列表
              this.nofify.$el.querySelector('zuijin').onclick = () => {
                let thisTimeCountTimeSearch = res.data.thisTimeCountTimeSearch
                this.$router.push({
                  path: '/xundianjian/linkageEventsDataList',
                  query: {
                    formSql: { strAlarmTime: thisTimeCountTimeSearch }
                  }
                })
              }

              // 点击 今日数量 查询报警列表
              this.nofify.$el.querySelector('jinri').onclick = () => {
                let todayCountTimeSearch = res.data.todayCountTimeSearch
                this.$router.push({
                  path: '/xundianjian/linkageEventsDataList',
                  query: {
                    formSql: { strAlarmTime: todayCountTimeSearch }
                  }
                })
              }

              // 点击 本月数量 查询报警列表
              this.nofify.$el.querySelector('benyue').onclick = () => {
                let monthCountTimeSearch = res.data.monthCountTimeSearch
                this.$router.push({
                  path: '/xundianjian/linkageEventsDataList',
                  query: {
                    formSql: { strAlarmTime: monthCountTimeSearch }
                  }
                })
              }

              // 点击 查看更多 查询报警列表
              this.nofify.$el.querySelector('gengduo').onclick = () => {
                let monthCountTimeSearch = res.data.monthCountTimeSearch
                this.$router.push({
                  path: '/xundianjian/linkageEventsDataList'
                })
              }

              // 点击 本月 查询报警列表
              this.nofify.$el.querySelector('bentiao').onclick = () => {
                let id = iscLinkageEventsData.id
                this.$router.push({
                  path: '/xundianjian/linkageEventsDataList',
                  query: {
                    formSql: { id: id }
                  }
                })
              }
            }
          })
        },
        //* **************报警 end ******************//
        // 全厂视频链接
        onAllVideo () {
          this.$router.push({ path: '/xundianjian/camera' })
        },
        // 地图视频总览
        onMapCamera () {
          this.$router.push({ path: '/xundianjian/cameraAll' })
        },
        // 查看报警链接
        onAllAlarm () {
          this.$router.push({ path: '/xundianjian/linkageEventsDataList' })
        },

        //* **************首页我的任务 start ******************//

        /**
        * 时间转换
        */
        formatDate (day, type) {
          const time = new Date().getTime() - day * 24 * 60 * 60 * 1000
          const d = new Date(time)
          const resDate =
            d.getFullYear() + '-' +
            this.formatNum(d.getMonth() + 1) + '-' +
            this.formatNum(d.getDate())
          const resTime =
            this.formatNum(d.getHours()) + ':' +
            this.formatNum(d.getMinutes()) + ':' +
            this.formatNum(d.getSeconds())
          if (type && type == 's') {
            return resDate + ' ' + resTime
          }
          return resDate
        },
        formatNum (s) {
          return s < 10 ? '0' + s : s
        },
        // 获取星期
        formatMonth() {
          var myDate = new Date()
          var days = myDate.getDay()
          switch (days) {
            case 1:
              return '周一'
            case 2:
              return '周二'
            case 3:
              return '周三'
            case 4:
              return '周四'
            case 5:
              return '周五'
            case 6:
              return '周六'
            case 0:
              return '周日'
          }
        },
        //* **************首页我的任务 end ******************//

        //* ********************巡点检项目首页js方法结束******************* *//


        // ---------------------单县污水处理系统点击指标弹出趋势图事件
        onShanXianIdx (catNo) {
          this.$router.push({
            path: '/xundianjian/indicator',
            query: {
              catNo: catNo
            }
          })
        }

      },
      destroyed () {
        if (this.nofify) {
          this.nofify.close() // 销毁报警弹出框组件
        }
      },
      template: column.templateHtml !== '' ? `${column.templateHtml}` : `<div></div>`
    }
  } catch (error) {
    console.error(error)
  }
}
