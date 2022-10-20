let util = {
  /** {{user.telephoneNum.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2")}}**/
  formatDate: {
    format: function(date, pattern) {
      function padding(s, len) {
        var len = len - (s + '').length
        for (var i = 0; i < len; i++) {
          s = '0' + s
        }
        return s
      }

      pattern = pattern || 'yyyy-MM-dd'
      return pattern.replace(/([yMdhsm])(\1*)/g, function($0) {
        switch ($0.charAt(0)) {
          case 'y':
            return padding(date.getFullYear(), $0.length)
          case 'M':
            return padding(date.getMonth() + 1, $0.length)
          case 'd':
            return padding(date.getDate(), $0.length)
          case 'w':
            return date.getDay() + 1
          case 'h':
            return padding(date.getHours(), $0.length)
          case 'm':
            return padding(date.getMinutes(), $0.length)
          case 's':
            return padding(date.getSeconds(), $0.length)
        }
      })
    },
    parse: function(dateString, pattern) {
      var matchs1 = pattern.match(/([yMdhsm])(\1*)/g)
      var matchs2 = dateString.match(/(\d)+/g)
      if (matchs1.length == matchs2.length) {
        var _date = new Date(1970, 0, 1)
        for (var i = 0; i < matchs1.length; i++) {
          var _int = parseInt(matchs2[i])
          var sign = matchs1[i]
          switch (sign.charAt(0)) {
            case 'y':
              _date.setFullYear(_int)
              break
            case 'M':
              _date.setMonth(_int - 1)
              break
            case 'd':
              _date.setDate(_int)
              break
            case 'h':
              _date.setHours(_int)
              break
            case 'm':
              _date.setMinutes(_int)
              break
            case 's':
              _date.setSeconds(_int)
              break
          }
        }
        return _date
      }
      return null
    }
  },
  myValidate(_target, form) {
    let rules = _target._props.rules
    rules.forEach(item => {

    })
  },
  /**
     * 校验数据
     * @author mbb
     */
  validate(_target, form) {
    let requireItems = _target.$el.getElementsByClassName('require')
    if (requireItems.length) {
      let msg = null
      try {
        requireItems.forEach(item => {
          let prop = item.parentNode.getAttribute('prop')
          if (form[prop] === 0) {
            form[prop] = '0'
          }
          if (!form[prop] || String(form[prop]).trim() == '') {
            msg = item.parentNode.innerText.replace('*', '')
            throw msg
          }
        })
      } catch (e) {
        if (e != msg) {
          throw e
        }
      }
      return msg
    }
  },
  signMix(strFormat, ...args) {
    if (typeof (strFormat) !== 'string') {
      return ''
    }
    if (args.length === 0) {
      return strFormat
    }
    var param = args[0]
    var str = strFormat
    if (typeof (param) === 'object') {
      for (var key in param) {
        str = str.replace(new RegExp('\\{' + key + '\\}', 'g'), param[key])
      }
      return str
    } else {
      for (var i = 0; i < args.length; i++) {
        str = str.replace(new RegExp('\\{' + i + '\\}', 'g'), args[i])
      }
      return str
    }
  },
  // 时间开始
  // 时间转换方法
  formatNum(s) {
    return s < 10 ? '0' + s : s
  },
  // type n：返回到日，m,返回到月，其他：返回到秒
  formatTime(val, type) {
    const d = new Date(val)
    const resDate =
            d.getFullYear() + '-' +
            this.formatNum(d.getMonth() + 1) + '-' +
            this.formatNum(d.getDate())
    const resTime =
            this.formatNum(d.getHours()) + ':' +
            this.formatNum(d.getMinutes()) + ':' +
            this.formatNum(d.getSeconds())
    if (type && type == 'n') {
      return resDate
    }
    if (type && type == 'm') {
      return d.getFullYear() + '-' +
      this.formatNum(d.getMonth() + 1)
    }
    return resDate + ' ' + resTime
  },
  // 时间结束
  // 两个时间比大小
  contrastDate(stratTime, endTime) {
    const timeS = new Date(stratTime).getTime()
    const timeE = new Date(endTime).getTime()
    const flag = timeE >= timeS
    return flag
  }
}
export default util
