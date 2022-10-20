<template>
  <div>
    <!-- :auto-upload="limit>1?true:false" -->
    <el-upload
      id="uploadControl"
      ref="uploadControl"
      class="upload-demo"
      :accept="accept"
      drag
      :limit="limit"
      :multiple="limit>1?true:false"
      :disabled="disabled"
      action="#"
      :before-upload="beforeUpload"
      :on-success="handSuccess"
      :before-remove="beforeRemove"
      :on-remove="handleRemove"
      :on-preview="handlePreview"
      :file-list="fileList"
    >


       <i class="el-icon-upload"></i>
  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
  <div class="el-upload__tip" slot="tip">{{ tip }}</div>

      <!-- （文件格式：*.jpg、*.png'、*.doc、*.docx、*.xls、*.xlsx） -->
    </el-upload>

    <el-dialog :visible.sync="dialogVisible" :modal-append-to-body="false" :append-to-body="true" title="图片预览" class="yj-dialog">
      <img width="100%" :src="dialogImageUrl" alt>
    </el-dialog>

    <vxe-modal v-model="dialogVisiblePPT" show-zoom resize width="70%" height="90%" title="文件预览（部分格式文件预览乱码或预览失败，请下载原文件查看）">
      <el-row id="pptRow" style="overflow: hidden;width:100%;height:calc(100% - 40px)">
        <iframe id="frameForm" ref="frameForm" :src="src" frameborder="0" style="overflow-y: auto;width:100%;height:98%" @load="imgStyle" />
      </el-row>
      <el-row style="display: flex;justify-content: center;height:40px">
        <el-button type="primary" @click="downFile">下载原文件</el-button>
      </el-row>
    </vxe-modal>
    <!-- <el-dialog :visible.sync="dialogVisiblePPT" :modal-append-to-body="false" :append-to-body="true" title="PPT预览" class="yj-dialog"> -->

    <!-- </el-dialog> -->
  </div>
</template>
<script>
// import EXIF from 'exif-js'
import $ from 'jquery'
import * as ipbsHttp from '@/api/cpApi/common/index'
import { uploadFile, previewFile } from '@/api/platform/file/attachment'
import * as fileUtil from '@/business/platform/file/utils/index.js'
export default {
  name: 'InputUploadFile',

  props: {
    disabled: { type: Boolean, default: false }, //是否禁用文件上传组件
    isView: { //是否显示文件上传组件内容
      type: Boolean,
      default: true
    },
    limit: {//最大允许上传个数
      type: Number,
      default: 1000
    },
    // 默认无提示，如 提示文件内容等
    tip: {
      type: String,
      default: ''
    },
    accept: {//接受上传的文件类型
      type: String,
      default: ''
    }
  },

  data() {
    return {
      dialogVisible: false,
      dialogVisiblePPT: false,
      dialogImageUrl: '',
      fileListEmit: [],
      fileNames: '',
      // 上传的文件列表
      fileList: [],
      src: '',
      fileObj: {}
    }
  },

  methods: {
    /**
		 * 上传的地址
		 * @author mbb
		 */
    uploadUrl() {
      return process.env.VUE_APP_BASE_API + '/platform/v3/file/upload'
    },
    // getImgLocation(img){
    //   EXIF.getData(img,function(){
    //     //图片包含的所有信息(例：拍照方向、相机设备型号、拍摄时间、ISO 感光度、GPS 地理位置等数据。)
    //     const imgAllInfo = EXIF.getAllTags(this);
    //     console.log(imgAllInfo,"aaaaaaaa")
    //   })
    // },
    /**
		 * 上传文件之前的钩子
		 * @author mbb
		 */
    beforeUpload(file) {
      // 图片限制
      if (file.type.indexOf('image') === 0 && file.size > 20480000) {
        this.$message.error('单张图片不能超过20M')
        return false
      }

      //文件格式限制
      if(this.accept!=null && this.accept!=''){
        let acceptArray = this.accept.split(",");
        let flag=false;
        for(let i=0;i<acceptArray.length;i++){
          if(file.name.indexOf(acceptArray[i])>=0){
            flag =true;
          }
        }
        if(!flag){
          this.$message.error('文件格式不正确')
          return false
        }
      }

      // this.getImgLocation(file)
      uploadFile(file).then(response => {
        if (response.state === 200) {
          let data = {
            id: response.data.id,
            name: response.data.fileName,
            ext: response.data.ext,
            fileType: file.type,
            size: file.size
          }
          this.fileListEmit.push(data)
          this.fileList.push(data)
          this.$emit('edit', this.fileListEmit)
        }
      })
    },

    /**
		 * 文件上传成功时的钩子
		 * @author mbb
		 */
    handSuccess(response, file, fileList) {

    },

    /**
		 * 删除文件之前的钩子
		 * @author mbb
		 */
    beforeRemove() {
    },

    /**
		 * 文件列表移除文件时的钩子
		 * @author mbb
		 */
    handleRemove(file) {
      let id = file.id || file.response.data.id
      this.fileListEmit.forEach((item, index) => {
        if (item.id == id) {
          this.fileListEmit.splice(index, 1)
          return false
        }
      })
      this.fileList.forEach((item, index) => {
        if (item.id == id) {
          this.fileList.splice(index, 1)
          return false
        }
      })
      this.$emit('edit', this.fileListEmit)
    },
    // 预览新版本开始
    handlePreview(file) {
      this.fileObj = file
      if (file.response && file.response.data && file.response.data.id) {
        this.getImage(file.response.data.id)
      } else if (file.id) {
        this.getImage(file.id)
      } else {
        this.$message('该文件无法预览！')
      }
    },
    getImage(id) {
      this.dialogVisiblePPT = true
      this.dialogImageUrl = process.env.VUE_APP_BASE_API + '/platform/v3/file/preview?attachmentId=' + id
      this.$nextTick(() => {
        $('#frameForm').attr('src', this.dialogImageUrl)
        //this.imgStyle()
      })
    },
    imgStyle() {
      let iframeBox = document.getElementById('frameForm')
      let doc = iframeBox.contentWindow.document
      let _body = doc.getElementsByTagName('body')[0]
      let _box = doc.getElementsByTagName('img')[0]
      _body.style.textAlign = 'center'
      _box.style.width = 'auto'
      _box.style.maxWidth = '100%'
      _box.style.height = 'auto'
      _box.style.maxHeight = '100%'
    },
    downFile() {
      fileUtil.downloadFile(this.fileObj)
    },

    downLoadFile(id, fileType, name) {
      let newName = ''
      if (fileType.split('/')[1] == 'pdf') {
        newName = name + '.pdf'
      } else {
        newName = name
      }
      // 执行下载
      ipbsHttp.fileDownload(id).then(res => {
        let a = document.createElement('a')
        let blob = new Blob([res], { type: fileType })
        let objectUrl = URL.createObjectURL(blob)
        a.setAttribute('href', objectUrl)
        a.setAttribute('download', newName)
        a.click()
      })
    },

    clear() {
      this.fileListEmit = []
      this.fileList = []
      this.$refs.uploadControl.clearFiles()
    },

    /**
		 * 设置文件
		 * @author mbb
		 */
    setVal(files) {
      if (files) {
        try {
          if (files.indexOf('[{') == 0) {
            this.fileList = JSON.parse(files)
            this.fileListEmit = JSON.parse(files)
          } else {
            this.$emit('edit', '')
          }
        } catch {
          this.$emit('edit', '')
          this.fileList = []
          this.fileListEmit = []
        }
      }
    }
  }
}
</script>

<style>
#uploadControl .el-upload {
	display: block !important;
	text-align: left;
}
#uploadControl.view .el-upload-list__item-status-label {
	display: none !important;
}

#uploadControl.view .el-icon-circle-check:before {
	content: "\e6db" !important;
}

#uploadControl.view .el-icon-close {
	display: none !important;
}

.el-form-item__content {
	height: auto !important;
}
</style>
<style  lang="scss" scoped>
::v-deep .el-button {
	background-size: 18px;
}
::v-deep .el-dialog {
	height: 72vh !important;
}
</style>

