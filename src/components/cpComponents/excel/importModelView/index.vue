<template>
  <vxe-modal v-if="importVisible" v-model="importVisible" width="480" height="320">
    <template #title>
      <span>{{ $t('equipment.import.dataImport') }}</span>
    </template>
    <template #default>
      <el-alert
        :title="$t('equipment.import.downTempUp')"
        type="info"
        :closable="false"
      />

      <div style="width: 400px; margin: 0 auto;padding-top: 15px">
        <el-upload
          ref="upload"
          style="display: inline"
          class="upload-demo"
          :limit="1"
          :auto-upload="false"
          :before-upload="beforeUpload"
          :on-change="valid"
          accept=".xls, .xlsx"
          :http-request="httpRequestNew"
        >
          <el-button slot="trigger" @click="downloadTpl">{{ $t('equipment.import.downloadTemp') }}</el-button>
          <el-button slot="trigger" size="small" type="primary">{{ $t('equipment.import.selectFile') }}</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">{{ $t('equipment.import.uploadServer') }}</el-button>
          <div slot="tip" class="el-upload__tip">{{ $t('equipment.import.uploadExcMore',{title: size}) }}</div>
        </el-upload>
      </div>
    </template>
  </vxe-modal>
</template>
<script>
import { check } from '@/api/cpApi/extend'
import { uploadFile } from '@/api/platform/file/attachment'
import { importSync as equipImportSync } from '@/api/cpApi/equip/eqLocation/index'
import { importSync as materImportSync } from '@/api/cpApi/materialsManagement/basics/material'
import moment from 'moment'

export default {
  name: 'ImportModalView',
  props: {
    userInfo: {
      type: Object,
      default: null
    },
    dataCode: {
      type: String,
      default: ''
    },
    bizCode: {
      type: String,
      default: ''
    },
    url: { //导入模板文件下载路径
      type: URL
    },
    size:{
      type: Number,
      default:  5
    },
  },
  data() {
    return {
      checkData: {},
      importVisible: false
    }
  },
  created() {
    // 监听提示信息点击事件，打开信息提示窗口
    let _this = this
    window.goImport = _this.goImport
  },
  mount() {
  },
  methods: {
    /**
    * 下载模板
    */
    downloadTpl() {
    //   const a = document.createElement('a') // 创建a标签
    //   a.setAttribute('download', '')// download属性
    //   a.setAttribute('href', this.url)// href链接
    //   a.click()// 自执行点击事件
        console.log('downloadTpl.url', this.url)
        window.open(this.url)
    },
    /**
     * 导入事件
     */
    submitUpload() {
      this.$refs.upload.submit()
    },
    /**
     * 附件验证
     */
    async valid(file){
        console.log('file',file)

        let isExcel = ('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' == file.raw.type || 'application/vnd.ms-excel' == file.raw.type)
        let isLt5M = file.size / 1024 / 1024 < this.size;
        if(!isExcel){
            this.$message.error(this.$t('baseCommon.message.fileFormatError'))
            this.$refs.upload.handleRemove(file)
            return false;
        }
        if(!isLt5M){
            this.$message.error(this.$t('baseCommon.message.fileSizeError',{title:this.size}))
            this.$refs.upload.handleRemove(file)
            return false;
        }

        //检测在配置表中是否有配置登记记录
        let f = false
        // cpis_dio_conf注册的业务数据编码
        this.checkData.dataCode = this.dataCode
        // cpis_dio_conf注册的业务编码
        this.checkData.bizCode = this.bizCode
        await check(this.checkData).then(res => {
            console.log('res.data', res.data)
            if (res.data && res.data!=null) {
                this.checkData = res.data
                f = true
            }
        })
        if(!f){
            this.$message.error(this.$t('baseCommon.message.regFileUpload'))
            this.$refs.upload.handleRemove(file)
            return false;
        }

        return true
    },
    async beforeUpload(file) {

    },
    /**
     * 进入 查看导入结果 页面
     */
    goImport() {
      this.$router.push({ name: 'record-importRecord' })
    },
    /**
     * 提交导入
     */
    httpRequestNew(f) {
      uploadFile(f.file).then(res => {
        if (res.state === 200) {
          let cpisDiTaskPo = {
            // 任务名
            taskName: this.checkData.bizName + moment().format('YYYYMMDDHHmmss'),
            // cpis_dio_conf注册的业务数据编码
            dataCode: this.dataCode,
            // cpis_dio_conf注册的业务编码
            bizCode: this.bizCode,
            // 初始行号
            lineNo: 0,
            // 初始执行数
            execNum: 0,
            // 初始异常数
            exceptNum: 0,
            // 文件id
            attachmentId: res.data.id,
            companyId: this.userInfo.company.companyId,
            createUser: this.userInfo.user.id,
            createUserName: this.userInfo.user.name,
            updateUser: this.userInfo.user.id,
            updateUserName: this.userInfo.user.name
          }

          if (this.bizCode.startsWith('eq_')) {
            // 设备导入
            equipImportSync(cpisDiTaskPo).then(r => {
              if (r.code === 0) {
                this.$message({ dangerouslyUseHTMLString: true, type: 'success', showClose: true, message: this.$t('baseCommon.message.importSubProMsg') + '<a onclick="goImport()">“' + this.$t('baseCommon.buttons.vwImportRes') + '”</a>' })
                this.importVisible = false
              }
            })
          } else if (this.bizCode.startsWith('mat_')) {
            // 物资导入
            materImportSync(cpisDiTaskPo).then(r => {
              if (r.code === 0) {
                this.$message({ dangerouslyUseHTMLString: true, type: 'success', showClose: true, message: this.$t('baseCommon.message.importSubProMsg') + '<a onclick="goImport()">“' + this.$t('baseCommon.buttons.vwImportRes') + '”</a>' })
                this.importVisible = false
              }
            })
          }
        }
      })
    }
  }
}
</script>
