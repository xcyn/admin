const numUtils = {
  // 数字加减leftNum, rightNum, type:不传默认为减，传true为加
  calculateNum(arg1, arg2, type) {
    if (arg1 == null || arg1 == undefined || arg1 == '') {
      arg1 = 0
    }
    if (arg2 == null || arg2 == undefined || arg2 == '') {
      arg2 = 0
    }
    let r1, r2, m, n, num
    try { r1 = arg1.toString().split('.')[1].length } catch (e) { r1 = 0 }
    try { r2 = arg2.toString().split('.')[1].length } catch (e) { r2 = 0 }
    m = Math.pow(10, Math.max(r1, r2))
    n = (r1 >= r2) ? r1 : r2
    if (type) {
      num = ((arg1 * m + arg2 * m) / m).toFixed(n)
    } else {
      num = ((arg1 * m - arg2 * m) / m).toFixed(n)
    }
    return num
  },
  // arg1分子，arg2分母
  divideNum(arg1, arg2) {
    let num = '0.00%'
    if (arg1 && arg2 && parseInt(arg2) != 0) {
      num = ((parseInt(arg1) / parseInt(arg2)) * 100).toFixed(2) + '%'
    }
    return num
  }
}
export default numUtils
