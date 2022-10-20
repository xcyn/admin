export const typeOptions = [
  {
    value: 'text',
    label: '文本'
  },
  // {
  //   value: 'audio',
  //   label: '音频'
  // },
  // {
  //   value: 'file',
  //   label: '文件'
  // },
  // {
  //   value: 'position',
  //   label: '定位'
  // },
  // {
  //   value: 'custom',
  //   label: '自定义'
  // },
  {
    value: 'system',
    label: '系统消息'
  }
]
export const renderHeader = function(h, { column, $index }) {
  return h('span', [
    h('el-tooltip', {
      props: {
        content: '是否已读'
      }
    }, [h('i', { class: 'ibps-icon-envelope-o' })]),
    h('el-tooltip', {
      props: {
        content: '是否有附件'
      }
    }, [h('i', { class: 'ibps-icon-paperclip' })]
    )
  ])
}
export const renderFileHeader = function(h, { column, $index }) {
  return h('span', [
    h('el-tooltip', {
      props: {
        content: '是否已下载'
      }
    }, [h('i', { class: 'el-icon-download' })])
  ])
}
export const publicOrCanreplyOptions = [
  {
    value: 'N',
    label: '否',
    type: 'danger'
  },
  {
    value: 'Y',
    label: '是'
  }
]
export const styleOptions = [
  { value: 'primary', label: '主要' },
  { value: 'success', label: '成功' },
  { value: 'info', label: '信息' },
  { value: 'warning', label: '警告' },
  { value: 'danger', label: '危险' },
  { value: 'custom', label: '自定义' }
]
export const positionOptions = [
  { value: 'top-left', label: '左上角' },
  { value: 'bottom-left', label: '左下角' },
  { value: 'top-right', label: '右上角' },
  { value: 'bottom-right', label: '右下角' }
]

