<template>
	<!-- 新版上传附件组件 -->
	<div>
		<!-- :auto-upload="limit>1?true:false" -->
		<el-upload id="uploadControl" ref="uploadControl" :limit="limit" :multiple="limit>1?true:false"
			style="max-width:300px;margin:10px 0;display:block;" :disabled="isView" action="#"
			:http-request="httpRequest" drag :on-success="handleSuccess" :before-remove="beforeRemove"
			list-type="picture" :on-remove="handleRemove" :on-preview="handlePreview" :file-list="fileList">
			<!-- <el-button v-if="!isView" size="small" type="primary" :disabled="disabled">点击上传</el-button>
      <div v-if="!isView" slot="tip" class="el-upload__tip">{{ tip }}</div> -->
			<!-- （文件格式：*.jpg、*.png'、*.doc、*.docx、*.xls、*.xlsx） -->
			<div v-if="!isView">
				<i class="el-icon-upload" />
				<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
			</div>
		</el-upload>

		<el-dialog :visible.sync="dialogVisible" :modal-append-to-body="false" :append-to-body="true" title="图片预览"
			class="yj-dialog">
			<img width="100%" :src="dialogImageUrl" alt>
		</el-dialog>

		<vxe-modal v-model="dialogVisiblePPT" show-zoom resize width="70%" height="90%"
			title="文件预览（部分格式文件预览乱码或预览失败，请下载原文件查看）">
			<el-row id="pptRow" style="overflow: hidden;width:100%;height:calc(100% - 40px)">
				<iframe id="frameForm" ref="frameForm" :src="src" frameborder="0"
					style="overflow-y: auto;width:100%;height:98%" />
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
	import $ from 'jquery'
	import * as ipbsHttp from "@/api/cpApi/common/index"
	import {
		uploadFile,
		remove,
		previewFile
	} from '@/api/platform/file/attachment'
	import * as fileUtil from "@/business/platform/file/utils/index.js"
	import setting from '@/setting.js'
	import {
		fileTypes,
		allFileTypes,
		accept as acceptTypes
	} from '@/business/platform/file/constants/fileTypes'
	import FormulaUtil from '@/business/platform/form/utils/formula'
	export default {
		name: 'InputUploadFile',

		props: {
			disabled: {
				type: Boolean,
				default: false
			},
			isView: {
				type: Boolean,
				default: true
			},
			limit: {
				type: Number,
				default: 1000
			},
			//默认无提示
			tip: {
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
				fileObj: {},
				dialogImageUrl: '',
				fileTypes: fileTypes,
				allFileTypes: allFileTypes,
				acceptTypes: acceptTypes,
				fileUploadAction: setting.fileUploadAction,
			}
		},
		methods: {
			/**
			 * 文件上传
			 */
			httpRequest(options) {
				return uploadFile(options.file, {})
			},
			handlePreview(file) {
				handlePreview(file);
			},
			handleSuccess(response, file, fileList) {
				if (response.state === 200) {
					let data = {
						id: response.data.id,
						name: response.data.fileName,
						ext: response.data.ext,
						fileType: file.type,
						size: file.size
					}
					let ext = this.getExtName(file.name)
					let url = ''
					if (this.$utils.isEmpty(ext)) {
						ext = 'enlarge'
					}
					if (['jpg', 'jpeg', 'bmp', 'png'].includes(ext)) {
						url = file.url
					} else {
						if (['7z', 'acc', 'accdb', 'ai', 'ape', 'arj', 'attachement', 'au', 'avi', 'bmp', 'css', 'csv',
								'doc', 'docx', 'eml', 'fla', 'flac', 'gif', 'gz', 'html', 'ind', 'ini', 'jpeg', 'jpg',
								'jsf', 'mp3', 'mp4', 'pdf', 'ppt', 'pptx', 'rar', 'swf', 'text', 'xls', 'xlsx', 'txt'
							].includes(ext)) {
							url = `${this.$baseUrl}images/file/${ext}.png`
						} else {
							url = `${this.$baseUrl}images/file/enlarge.png`
						}
					}
					file.url = url
					this.fileList = fileList
					this.fileListEmit.push(data)
					this.$emit('edit', this.fileListEmit)
				}
			},
			// 获取扩展名
			getExtName(name) {
				return name ? name.substring(name.lastIndexOf('.') + 1, name.length) : ''
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
					const fileAccept = FormulaUtil.LOWER(result) // 统一处理文件大小写
					const targetFileTypes = fileTypes[type]
					this.targetExt = targetFileTypes.includes(fileAccept)
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
			handleError(err, file, fileList) {
				this.fileList = fileList
				if (!(err instanceof Error)) {
					const data = this.$utils.parseJSON(err.message)
					this.$message.closeAll()
					this.$message({
						message: this.$utils.isNotEmpty(data.message) ? data.message : data.cause,
						type: 'error'
					})
				}
			},
			/**
			 * 上传的地址
			 * @author mbb
			 */
			uploadUrl() {
				return process.env.VUE_APP_BASE_API + '/platform/v3/file/upload'
			},

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
			beforeRemove() {},

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
				})
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
					let blob = new Blob([res], {
						type: fileType
					})
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
							this.fileList.forEach((item, index) => {
								if (['jpg', 'jpeg', 'bmp', 'png'].includes(item.ext))
									return item['url'] = process.env.VUE_APP_BASE_API +
										'/platform/v3/file/getImage?attachmentId=' + item.id
							})
							this.fileListEmit = JSON.parse(files)
						} else {
							this.$emit('edit', '')
						}
					} catch {
						this.$emit('edit', '')
						this.fileList = []
						this.fileListEmit = []
					}
				} else {
					this.$emit('edit', '')
					this.fileList = []
					this.fileListEmit = []
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
<style lang="scss" scoped>
	::v-deep .el-button {
		background-size: 18px;
	}

	::v-deep .el-dialog {
		height: 72vh !important;
	}

	::v-deep .el-upload-dragger {
		width: 210px;
		height: 80px;
		padding: 5px;
	}

	::v-deep .el-upload-list--picture-card .el-upload-list__item {
		width: 88px;
		height: 88px;
	}

	.el-upload-dragger .el-icon-upload {
		float: left;
		margin: 8px 0;
	}

	.el-upload-dragger .el-upload__text {
		padding-top: 8px;
	}

	.el-upload-list--picture .el-upload-list__item {
		height: 80px;
	}

	::v-deep .el-upload-list--picture .el-upload-list__item {
		margin-top: 4px;
		margin-right: 10px;
		height: 80px;
	}

	::v-deep .el-upload-list__item-name {
		margin-right: 20px;
	}

	::v-deep .el-upload-list--picture .el-upload-list__item-thumbnail {
		width: 60px;
		height: 60px;
	}

	::v-deep .el-upload-list--picture .el-upload-list__item.is-success .el-upload-list__item-name {
		line-height: 60px;
	}

	::v-deep {}

	.ibps-uplpad {
		overflow-y: auto;

		.header {
			height: 45px;
			border-bottom: 1px solid #dadada;
			margin: 0;
			padding: 0;
			line-height: 45px;
			vertical-align: middle;
			position: relative;
		}

		.btns {
			position: absolute;
			top: 7px;
			right: 0;
			line-height: 30px;
		}

		.uploader {
			list-style: none;
			margin: 0;
			padding-top: 5px;
		}

		.el-upload--picture-card {
			border: 0;
		}

		.el-upload-dragger {
			width: 148px;
			height: 148px;
		}

		.el-upload-list--picture-card .el-upload-list__item-name {
			display: block;
			position: absolute;
			top: 0px;
			background: rgba(0, 0, 0, 0.6);
			color: white;
			margin: 0;
			width: 100%;
		}
	}
</style>
