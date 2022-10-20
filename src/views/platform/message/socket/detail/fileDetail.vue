<template>
  <el-form
    ref="form"
    v-loading="loading"
    :element-loading-text="$t('common.loading')"
    :label-width="formLabelWidth"
    class="inner-detail"
    @submit.native.prevent
  >
    <el-row>
      <el-col :span="24">
        <el-form-item label="ID:">
          <span>{{ form.id }}</span>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="创建时间:">
          <span>{{ form.createTime | dateFormat }}</span>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="文件名:">
          <span>{{ form.name }}</span>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="文件类型:">
          <el-tag>{{ form.type }}</el-tag>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="是否已下载:">
          <el-tag :type="form.isDownload|optionsFilter(publicOrCanreplyOptions,'type')">{{ form.isDownload|optionsFilter(publicOrCanreplyOptions,'label') }}</el-tag>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="文件地址:">
          <span>{{ form.path }}</span></el-form-item>
      </el-col>

      <el-col v-if="$utils.isNotEmpty(form.storageId)" :span="24">
        <el-form-item label="文件:">
          <ibps-attachment-selector
            v-model="form.storageId"
            :download="readonly"
            :readonly="readonly"
            multiple
            @download="download"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { get } from '@/api/platform/socket/file'
import { typeOptions, publicOrCanreplyOptions } from '../constants'
import IbpsAttachmentSelector from '@/business/platform/file/attachment/selector'

export default {
  components: {
    IbpsAttachmentSelector
  },
  props: {
    socketType: {
      type: String,
      default: 'sent'
    },
    inside: {
      type: Boolean,
      default: false
    },
    visible: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    id: String,
    title: String
  },
  data() {
    return {
      formLabelWidth: '120px',
      typeOptions: typeOptions,
      publicOrCanreplyOptions: publicOrCanreplyOptions,
      loading: false,
      form: {}
    }
  },
  computed: {
    formId() {
      return this.id
    }
  },
  methods: {
    download() {
      this.$emit('download', this.form)
    },
    /**
     * 获取表单数据
     */
    getFormData() {
      this.form = {}
      this.loading = true
      get({
        id: this.formId
      }).then(response => {
        this.form = response.data
        this.loading = false
        this.$emit('callback', true)
      }).catch(() => {
        this.loading = false
      })
    }
  }

}
</script>
<style lang="scss">
.inner-detail{
  .original-content{
    p{
      margin:0;
    }
  }
}
</style>
