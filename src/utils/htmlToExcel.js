import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import XLSX2 from 'xlsx-style'
// npm install xlsx -s
// npm install file-saver  -s

const htmlToExcel = {
  getExcel(dom, title = '默认标题') {
    var excelTitle = title
    var wb = XLSX.utils.table_to_book(document.querySelector(dom))
    /* 获取二进制字符串作为输出 */
    var wbout = XLSX2.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
    try {
      FileSaver.saveAs(
        new Blob([wbout], { type: 'application/octet-stream' }),
        excelTitle + '.xlsx'
      )
    } catch (e) {
      if (typeof console !== 'undefined') console.log(e, wbout)
    }
    return wbout
  },
  /**
   * 导出excel(指定样式)
   * @param tableId
   * @param fileTitle
   * @param sytleFunCallback
   * @returns {*}
   */
  exportData(tableId, fileTitle, sytleFunCallback) {
    let excelName = fileTitle + '.xlsx'
    // 克隆节点
    let tables = document.getElementById(tableId).cloneNode(true)
    // 判断是否为固定列，解决（为固定列时，会重复生成表格）
    if (tables.querySelector('.el-table__fixed') !== null) {
      tables.removeChild(tables.querySelector('.el-table__fixed'))
    }
    let opt = {
      rowIndex: 5
    } //
    let ws = XLSX.utils.table_to_sheet(tables, opt)

    /**
     * 将 String 转换成 ArrayBuffer
     * @method 类型转换
     * @param {String} [s] wordBook内容
     * @return {Array} 二进制流数组
     */
    function s2ab(wbout) {
      let buf = new ArrayBuffer(wbout.length)
      let view = new Uint8Array(buf)
      for (let i = 0; i !== wbout.length; ++i) view[i] = wbout.charCodeAt(i) & 0xFF
      return buf
    }

    // 设置样式 开始
    function styleFun(ws) { // 自定义样式
      // 单元格边框样式
      let borderStyle = {
        top: {
          style: 'thin',
          color: { rgb: '000000' }
        },
        bottom: {
          style: 'thin',
          color: { rgb: '000000' }
        },
        left: {
          style: 'thin',
          color: { rgb: '000000' }
        },
        right: {
          style: 'thin',
          color: { rgb: '000000' }
        }
      }
      for (let key in ws) {
        if (key.indexOf('!') !== 0) {
          // 给特定格子（带'1'的，即首行 标题）添加样式，下面同理
          if (key.replace(/[^0-9]/ig, '') === '1') {
            ws[key].s = {
              alignment: { horizontal: 'center', vertical: 'center', wrapText: false }, // 设置标题水平竖直方向居中，并自动换行展示
              fill: { // 背景色
                fgColor: { rgb: 'F5F5F6' },
                bgColor: {
                  indexed: 64
                }
              },
              border: borderStyle,
              font: { // 覆盖字体
                name: '等线',
                sz: 11,
                bold: true
              }
            }
          } else {
            ws[key]['s'] = {
              border: borderStyle,
              font: {
                sz: 10
              },
              alignment: { horizontal: 'center', vertical: 'center', wrapText: true }
            }
          }
        }
      }
    }

    /**
     * 设置样式
     */
    styleFun(ws)
    if (sytleFunCallback != null) {
      sytleFunCallback(ws)
    }
    let wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, fileTitle)
    let table_write = XLSX2.write(wb, {
      autoWidth: true, // 自动设置列的宽度
      bookType: 'xlsx',
      bookSST: true,
      type: 'binary',
      showGridLines: true
    })
    try {
      FileSaver.saveAs(
        new Blob([s2ab(table_write)], { type: 'application/octet-stream' }),
        excelName
      )
    } catch (e) {
      if (typeof console !== 'undefined') console.log(e, table_write)
    }
    return table_write
  }
}

export default htmlToExcel
