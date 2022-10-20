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
      <el-col :span="12">
        <el-form-item label="ID:">
          <span>{{ form.id }}</span>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="消息类型:">
          <el-tag :type="form.type|optionsFilter(typeOptions,'type')">{{ form.type|optionsFilter(typeOptions,'label') }}</el-tag>
        </el-form-item>
      </el-col>

      <template v-if="$utils.isNotEmpty(form.expand)">
        <el-col v-if="$utils.isNotEmpty(form.expand.title)" :span="12">
          <el-form-item label="消息标题:">
            <span>{{ form.expand.title }}</span></el-form-item>
        </el-col>
        <el-col v-if="$utils.isNotEmpty(form.expand.style)" :span="12">
          <el-form-item label="样式(class):">
            <el-tag>{{ form.expand.style|optionsFilter(styleOptions,'label') }}</el-tag>
          </el-form-item>
        </el-col>
        <el-col v-if="$utils.isNotEmpty(form.expand.position)" :span="12">
          <el-form-item label="展示位置:">
            <el-tag>{{ form.expand.position|optionsFilter(positionOptions,'label') }}</el-tag>
          </el-form-item>
        </el-col>
        <el-col v-if="$utils.isNotEmpty(form.expand.duration)" :span="12">
          <el-form-item label="驻留时间(ms):">
            <span>{{ form.expand.duration }}</span></el-form-item>
        </el-col>
      </template>

      <template v-if="socketType === 'receive'">
        <el-col :span="24">
          <el-form-item label="接收方ID:">
            <span>{{ form.toUserId }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否已读:">
            <el-tag :type="form.isReaded|optionsFilter(publicOrCanreplyOptions,'type')">{{ form.isReaded|optionsFilter(publicOrCanreplyOptions,'label') }}</el-tag>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否已接收:">
            <el-tag :type="form.isReceive|optionsFilter(publicOrCanreplyOptions,'type')">{{ form.isReceive|optionsFilter(publicOrCanreplyOptions,'label') }}</el-tag>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="接收时间:">
            <span>{{ form.receiveTime | dateFormat }}</span>
          </el-form-item>
        </el-col>
      </template>
      <template v-else>
        <el-col :span="12">
          <el-form-item label="发送人ID:">
            <span>{{ form.fromUserId }}</span>
          </el-form-item>
        </el-col>
      </template>
      <el-col :span="12">
        <el-form-item label="发送时间:">
          <span>{{ form.sendTime | dateFormat }}</span>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="创建时间:">
          <span>{{ form.createTime | dateFormat }}</span>
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <el-form-item label="消息内容:">
          <span class="original-content" v-html="$utils.formatText(form.body)" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { get } from '@/api/platform/socket/message'
import { typeOptions, publicOrCanreplyOptions, styleOptions, positionOptions } from '../constants'

export default {
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
      styleOptions: styleOptions,
      positionOptions: positionOptions,
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
        if (this.$utils.isEmpty(this.form.expand)) this.$set(this.form, 'expand', {})
        else this.$set(this.form, 'expand', JSON.parse(this.form.expand))
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
