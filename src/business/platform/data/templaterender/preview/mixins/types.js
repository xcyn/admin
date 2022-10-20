
import { getFormDataByFormKey } from '@/api/platform/form/formDef'
import { buildFelds } from '../../utils'

export default {
  methods: {
    initData(data) {
      if (data.attrs && this.$utils.isNotEmpty(data.attrs.form_key)) {
        this.dialogLoading = true

        if (this.$utils.isNotEmpty(this.templateFormData)) {
          const formData = this.$utils.parseData(this.templateFormData.form)
          const datasets = buildFelds(formData.fields, data.datasets)
          data.datasets = datasets
          this.dataTemplate = data

          this.dialogLoading = false
          return
        }

        getFormDataByFormKey({
          formKey: data.attrs.form_key
        }).then(response => {
          const formData = this.$utils.parseData(response.data)
          const datasets = buildFelds(formData.fields, data.datasets)
          data.datasets = datasets
          this.dataTemplate = data
          this.dialogLoading = false
        }).catch(() => {
          this.dialogLoading = false
        })
      } else {
        this.dataTemplate = data
      }
    }
  }
}
