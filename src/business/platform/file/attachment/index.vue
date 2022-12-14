<template>
  <div class="ibps-attachment-selector">
    <template v-if="uploadable">
      <!--ibps 附件上传方式-->
      <template v-if="uploadType==='attachment'">
        <ul
          :class="{disabled:disabled}"
          class="selector-list"
          @click="handleUpload"
        >
          <label>
            <div class="plus">+</div>
            <div class="selector-empty">{{ placeholder }}</div>
          </label>
        </ul>
      </template>
      <!--直接弹出选择文件框-->
      <template v-else>
        <el-upload
          ref="upload"
          :file-list="fileList"
          :on-success="handleSuccess"
          :on-error="handleError"
          :before-upload="beforeUpload"
          :http-request="httpRequest"
          :multiple="multiple"
          :accept="accept"
          :show-file-list="false"
          :action="fileUploadAction"
          name="file"
          drag
          class="ibps-default-upload"
        >
          <ul
            :class="{disabled:disabled}"
            class="selector-list"
          >
            <label>
              <div class="plus">+</div>
              <div class="selector-empty">{{ placeholder }}</div>
            </label>
          </ul>
        </el-upload>
      </template>
    </template>
    <ul
      v-if="$utils.isNotEmpty(items)"
      :class="[
        'el-upload-list',
        'el-upload-list--' + listType,
        { 'is-disabled': !editable }
      ]"
    >
      <li
        v-for="(file,index) in items"
        :key="index"
        tabindex="0"
        class="files-list"
        @focus="focusing = true"
        @blur="focusing = false"
        @click.stop="focusing = false"
      >
        <!-- :class="['el-upload-list__item', focusing ? 'focusing' : '']" -->
        <slot :file="file">
          <a
            class="el-upload-list__item-name"
            :style="{
              marginRight:toolsWidth
            }"
            :title="file"
            @click.stop="handlePreview(index)"
          >
            <i class="el-icon-document" />{{ file }}
          </a>
          <label
            class="tools"
          >
            <template v-if="editable">
              <!--默认附件上传 -->
              <!--重选附件-->
              <el-upload
                v-if="setting!=='setting'&&!multiple"
                ref="defaultReselectUpload"
                :action="fileUploadAction"
                :on-success="handleReselectSuccess"
                :before-upload="beforeUpload"
                :http-request="httpRequest"
                :file-list="fileList"
                :multiple="false"
                :accept="accept"
                name="file"
                class="el-upload-unsetting"
                drag
              >
                <el-tooltip effect="dark" content="重新选择" placement="bottom-start">
                  <el-link type="primary" :underline="false" icon="ibps-icon-undo" @click.stop="handleReselect(index)">&nbsp;</el-link>
                </el-tooltip>
              </el-upload>
              <el-tooltip v-else effect="dark" content="重新选择" placement="bottom-start">
                <el-link type="primary" :underline="false" icon="ibps-icon-undo" @click.stop="handleReselect(index)">&nbsp;</el-link>
              </el-tooltip>
              <el-divider direction="vertical" />
              <el-tooltip effect="dark" content="删除" placement="bottom-start">
                <el-link type="danger" :underline="false" icon="ibps-icon-delete" @click.stop="handleRemove(index)">&nbsp;</el-link>
              </el-tooltip>
            </template>

            <el-divider v-if="editable && download" direction="vertical" />
            <template v-if="download">
              <el-tooltip effect="dark" content="下载" placement="bottom-start">
                <el-link type="primary" :underline="false" icon="ibps-icon-download" @click.stop="handleDownload(index)">&nbsp;</el-link>
              </el-tooltip>
            </template>
          </label>
        </slot>
      </li>
    </ul>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import setting from '@/setting.js'
import { fileTypes, allFileTypes, accept as acceptTypes } from '@/business/platform/file/constants/fileTypes'
import { uploadFile } from '@/api/platform/file/attachment'

export default {
  name: 'IbpsAttachmentSelector',
  props: {
    items: {
      type: Array
    },
    value: {
      type: [Array, Object]
    },
    mediaType: String,
    media: String,
    placeholder: {
      type: String,
      default: '请选择'
    },
    multiple: { // 是否多选
      type: Boolean,
      default: false
    },
    setting: { // 区分设置默认值值
      type: String,
      default: 'unSetting'
    },
    limit: { // 最大允许上传个数
      type: Number
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    download: {
      type: Boolean,
      default: false
    },
    preview: {
      type: Boolean,
      default: true
    },
    uploadType: { // 上传方式 （ default:直接打开上传，attachment：ibps上传附件打开上传 ）
      type: String,
      default: 'attachment'
    },
    accept: String, // 允许上传类型
    fileSize: Number, // 尺寸
    fileExt: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      fileUploadAction: setting.fileUploadAction,
      fileList: [],
      targetExt: false,
      fileTypes: fileTypes,
      allFileTypes: allFileTypes,
      acceptTypes: acceptTypes,
      defaultSelectIndex: 0,
      listType: 'text',
      focusing: false,
      defaultDisabled: true
    }
  },
  computed: {
    ...mapState('ibps/system', [
      'info'
    ]),
    // 是否允许上传
    uploadable() {
      if (this.readonly) return false
      if (!this.multiple && this.items.length >= 1) return false
      if (this.multiple && (this.limit && this.items.length >= this.limit)) return false
      return true
    },
    editable() {
      return !(this.readonly || this.disabled)
    },
    toolsWidth() {
      const length = this.editable ? 3 : 1
      return (30 * length) + 'px'
    }
  },
  beforeDestroy() {
    this.fileList = null
    this.fileTypes = null
    this.allFileTypes = null
    this.acceptTypes = null
  },
  methods: {
    init() {
      this.fileList = []
    },
    handleUpload() {
      if (!this.editable) return
      this.$emit('action-event', 'select')
    },
    handleReselect(index) {
      if (!this.editable) return
      if (this.uploadType === 'attachment') {
        this.$emit('action-event', 'reselect', index)
      } else {
        this.$refs.defaultReselectUpload.$refs['upload-inner'].handleClick()
        this.defaultSelectIndex = index
      }
    },
    handleRemove(index) {
      if (!this.editable) return
      this.$emit('action-event', 'remove', index)
    },
    handleDownload(index) {
      this.$emit('action-event', 'download', index)
    },
    handlePreview(index) {
      this.$emit('action-event', 'preview', index)
    },
    // 默认上传模块
    httpRequest(options) {
      return uploadFile(options.file, {})
    },
    handleSuccess(response, file, fileList) {
      this.fileList = fileList
      this.emitCallback(fileList, file)
    },
    emitCallback(list, file) {
      let data = this.multiple ? [] : {}
      if (this.multiple) {
        data = this.getFileDataList(list)
      } else {
        data = file.response.data
      }
      this.$emit('action-event', 'confirm', data)
    },
    getFileDataList(fileList) {
      if (this.$utils.isEmpty(fileList)) {
        return []
      }
      return fileList.map((file) => {
        return file.response.data
      })
    },
    handleError() {
      // TODO:
    },
    beforeUpload(file) {
      if (this.limit && this.limit === 0) {
        this.$message({
          message: '上传文件个数不能为0，请重新设置',
          type: 'warning'
        })
        return false
      }
      const MAX_FILE_SIZE = this.info.maxUploadSize
      if (this.$utils.isNotEmpty(MAX_FILE_SIZE) && file.size > MAX_FILE_SIZE) {
        this.$message.closeAll()
        this.$message({
          message: `上传文件的尺寸大于${this.$utils.formatSize(MAX_FILE_SIZE, 0, ['B', 'KB', 'MB', 'GB', 'TB'])}`,
          type: 'warning'
        })
        return false
      }
      if (this.fileSize && file.size > (this.fileSize * 1024 * 1024)) {
        this.$message.closeAll()
        this.$message({
          message: `上传文件的尺寸大于${this.$utils.formatSize(this.fileSize * 1024 * 1024, 2, ['B', 'KB', 'MB', 'GB', 'TB'])}`,
          type: 'warning'
        })
        return false
      }
      if (this.accept && !this.fileExtType(file)) {
        this.$message.closeAll()
        this.$message({
          message: '不允许的文件类型',
          type: 'warning'
        })
        return false
      }
    },
    /**
     * 文件类型的检测
     */
    fileExtType(file) {
      const accept = this.accept
      const acceptTypes = this.acceptTypes
      const fileTypes = this.fileTypes
      const arr = file.name.split('.')
      const result = arr[arr.length - 1]
      let type = ''
      this.targetExt = false
      for (const i in acceptTypes) {
        if (acceptTypes[i] === accept) {
          type = i
        }
      }
      if (type !== '' && this.accept !== '*') {
        // 现存的附件类型
        const targetFileTypes = fileTypes[type]
        this.targetExt = targetFileTypes.includes(result)
      } else {
        if (this.accept === '*') {
        // 不限制
          this.targetExt = true
        } else {
        // 自定义
          const targetFileTypes = this.accept.split(',')
          this.targetExt = targetFileTypes.includes('.' + result)
        }
      }
      return this.targetExt
    },

    handleReselectSuccess(response, file, fileList) {
      this.fileList = fileList
      const targetFile = file.response.data
      var data = this.value
      if (this.multiple) {
        data.splice(this.defaultSelectIndex, 1, targetFile)
      } else {
        data = targetFile
      }
      this.$emit('action-event', 'confirm', data)
    }
  }
}
</script>
