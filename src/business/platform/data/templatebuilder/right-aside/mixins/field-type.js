export default {
  methods: {
    changeFieldType(val) {
      let fieldOptions = {}
      switch (val) {
        case 'number':
          fieldOptions = {
            number_type: 'orig',
            number_format: 'orig',
            decimal_places: null,
            decimal_scale: false
          }
          break
        case 'radio':
        case 'checkbox':
        case 'select':
          fieldOptions = {
            options: [{
              val: '',
              label: ''
            }]
          }
          break
        case 'date':
        case 'dateRange':
          fieldOptions = {
            datefmt_type: 'date',
            datefmt: 'yyyy-MM-dd'
          }
          break
        case 'dictionary':
          fieldOptions = {
            dictionary: ''
          }
          break
        case 'selector':
          fieldOptions = {
            selector_type: 'user',
            store: 'id'
          }
          break
        case 'attachment':
          break
        case 'customDialog':
          fieldOptions = {
            store: 'id'
          }
          break
        default:
          break
      }
      const typeOptions = ['text', 'date', 'number']
      // 查询条件控件类型
      this.fieldType = typeOptions.includes(val)
      this.formData.field_options = null
      this.formData.field_options = fieldOptions
    }
  }
}
