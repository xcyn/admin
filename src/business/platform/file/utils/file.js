/**
 * 文件帮助类
 * 处理增删改查、分页等相关操作
 * <pre>
 * 作者:hugh zhuang
 * 邮箱:3378340995@qq.com
 * 日期:2018-10-08-下午3:29:34
 * 版权:广州流辰信息技术有限公司
 * </pre>
 */
import { BASE_GATEWAY_API, SOCKET_URL } from '@/api/baseUrl'

const file = {}
const fileType2faIcon = {
  // 代码类
  'css': 'ibps-icon-file-code-o',
  'txt': 'ibps-icon-file-code-o',
  'js': 'ibps-icon-file-code-o',
  'html': 'ibps-icon-file-code-o',
  'htm': 'ibps-icon-file-code-o',
  'shtml': 'ibps-icon-file-code-o',
  'xml': 'ibps-icon-file-code-o',
  'xsl': 'ibps-icon-file-code-o',
  // PDF
  'pdf': 'ibps-icon-file-pdf-o',
  // word
  'doc': 'ibps-icon-file-word-o',
  'docx': 'ibps-icon-file-word-o',
  // excel
  'xls': 'ibps-icon-file-excel-o',
  'xlsx': 'ibps-icon-file-excel-o',
  //  ppt
  'ppt': 'ibps-icon-file-powerpoint-o',
  'pptx': 'ibps-icon-file-powerpoint-o',
  //  压缩包
  'zip': 'ibps-icon-file-archive-o',
  'rar': 'ibps-icon-file-archive-o',
  'gzip': 'ibps-icon-file-archive-o',
  'jar': 'ibps-icon-file-archive-o',
  'lzh': 'ibps-icon-file-archive-o',
  // 图片
  'psd': 'ibps-icon-file-photo-o',
  'jpg': 'ibps-icon-file-photo-o',
  'gif': 'ibps-icon-file-photo-o',
  //  数媒
  'ra': 'ibps-icon-file-sound-o',
  'rm': 'ibps-icon-file-sound-o',
  'rmvb': 'ibps-icon-file-sound-o',
  'mp3': 'ibps-icon-file-sound-o',
  'wma': 'ibps-icon-file-sound-o',
  'avi': 'ibps-icon-file-sound-o'
}
const DEFAULT_ICON = 'ibps-icon-file-o'

file.getFileType = (fileType) => {
  return fileType2faIcon[fileType] ? fileType2faIcon[fileType] : DEFAULT_ICON
}

file.genDownloadUrl = (link) => {
  return BASE_GATEWAY_API() + `${SOCKET_URL}/file/download?link=${link}`
}
export default file
