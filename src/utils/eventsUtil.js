/**
 * 表单--封装自定义代码扩展接口
 */
import _ from 'lodash'
import Utils from '@/utils/util'
import ActionUtils from '@/utils/action'
import Vue from 'vue'
import request from '@/utils/request'
import dialog from '@/utils/dialog'
const _import = require('@/utils/util.import.' + process.env.NODE_ENV)

// 常量
const LBrace = '{'
const RBrace = '}'
// const LCurves = '('
// const RCurves = ')'
const LineFeed = '\n'
const Start = 'Object.assign'

/**
 * 转换为新对象
 * @param {*} object
 */
// function tranformObject(object, name) {
//   if (object === null || object === undefined || object === '') return object
//   const newObject = {}
//   for (const o in object) {
//     console.info(o, name)
//     if (name === o) continue
//     if (typeof (object[o]) === 'object') {
//       newObject[o] = tranformObject(object[o])
//     } else {
//       newObject[o] = object[o]
//     }
//   }
//   return newObject
// }

const template = {
  // 已经初始化
  _isInitialization: false,
  _isLoadJavaScriptFile: false,

  // 初始化表单
  _init: function(data) {
    if (this._isInitialization) return
    this.$template = data
    this.$form = data
    this.$vue = Vue
    this.$request = request
    this.$dialog = dialog
    this.$import = _import
    this.$ActionUtils = ActionUtils
    this._ = _
    this._isInitialization = true
  },

  // 事件调用
  _eventCall: function(events, name, ...args) {
    if (name === 'onLoad' && Utils.isNotEmpty(events)) {
      let _data
      if (Utils.isNotEmpty(args)) _data = args[0]
      events._init(_data)
    }
    if (Utils.isNotEmpty(name) &&
      Utils.isNotEmpty(events) &&
      Utils.isNotEmpty(events[name]) &&
      _.isFunction(events[name])) {
      return events[name](...args)
    }
    if (Utils.isNotEmpty(args) && _.isFunction(args[args.length - 1])) { args[args.length - 1](true) }
  },
  // 清理所有自定义事件
  cleanEvents: function() {
    this.onLoad = null
    this.onLoadActions = null
    this.onValidate = null
    this.afterSubButton = null
    this.beforeSubButton = null
    this.summaryMethod = null
    this.beforeSubmit = null
    this.afterSubmit = null
    this.customFormatter = null
    this.afterSubButton = null
  },
  cleanEventsByName: function(name) {
    if (Utils.isNotEmpty(this[name])) {
      this[name] = null
    }
  }
}

/**
   * 封装自定义代码扩展接口
   */
const eventsUtil = _.cloneDeep(template)

/**
 * 封装自定义代码扩展接口
 */
_.extend(eventsUtil, {
  // 初始化表单事件
  _initEvents: function(data, name, isGenerate) {
    const events = {}
    if (Utils.isEmpty(data)) return events
    if (!Utils.isString(data)) return events
    if ((Utils.isEmpty(isGenerate) || !isGenerate) && Utils.isNotEmpty(name)) {
      if (Utils.isNotEmpty(this[name])) {
        return this[name]
      }
    }

    data = Utils.trim(data)
    data = data.replace(':\/\/', '@:@/@/@').replace(/(\/\/.*)|(\/\*[\s\S]*?\*\/)/g, '')

    // 保存对象数据
    let obj = {}

    // 1.对data进行行的分割，组合成一个数组
    const arrs = data.split(LineFeed)
    let str = ''

    // 2.遍历分割后的数组，判断是否为注释的格式，对数据进行操作，并去除注释的数据
    let temp = ''
    for (let i = 0; i < arrs.length; i++) {
      temp = Utils.trim(arrs[i])
      if (Utils.isEmpty(temp)) continue // 去除空数据
      str += temp + LineFeed
    }
    data = str.substring(0, str.length - LineFeed.length)
    if (data.indexOf('@:@/@/@') > -1) {
      data = data.replace('@:@/@/@', ':\/\/')
    }
    // 3.判断是否以Object.assign开头
    // 当以Object.assign开头，则对data进行截取，获取事件的字符串；当不以Object.assign开头，则可直接对data直接操作
    if (data.startsWith(Start)) {
      data = data.substring(data.indexOf(LBrace) + 1, data.lastIndexOf(RBrace))
      data = Utils.trim(data)
    }
    if (data.substring(data.length - 1) === ',') {
      data = data.substring(0, data.length - 1)
    }
    try {
      // eslint-disable-next-line no-eval
      obj = eval('({' + data + '})')
    } catch (error) {
      console.warn(error)
    }
    const _this = _.cloneDeep(template)
    const _eventsUtils = _.extend(_this, obj)
    _eventsUtils._eventsUtilsID = name
    if (Utils.isNotEmpty(name)) {
      this[name] = _eventsUtils
    }
    return _eventsUtils
  }
})

/**
 * 封装自定义代码扩展接口
 */
// _.extend(eventsUtil, {
//   // 已经初始化
//   _isInitialization: false,
//   _isLoadJavaScriptFile: false,

//   // 初始化表单
//   _init: function(data) {
//     if (this._isInitialization) return
//     this.$template = data
//     this.$form = data
//     this.$vue = Vue
//     this.$request = request
//     this.$dialog = dialog
//     this.$import = _import
//     this._ = _
//     this._isInitialization = true
//   },

//   _initEvents: function(data, name, isGenerate) {
//     const events = {}
//     if (Utils.isEmpty(data)) return events
//     if (!Utils.isString(data)) return events
//     if ((Utils.isEmpty(isGenerate) || !isGenerate) && Utils.isNotEmpty(name)) {
//       if (Utils.isNotEmpty(this[name])) {
//         return this[name]
//       }
//     }

//     data = Utils.trim(data)

//     // 保存对象数据
//     let obj = {}

//     // 1.对data进行行的分割，组合成一个数组
//     const arrs = data.split(LineFeed)
//     let str = ''
//     // 判断是否为多行注释文本
//     let bool = false

//     // 2.遍历分割后的数组，判断是否为注释的格式，对数据进行操作，并去除注释的数据
//     let temp = ''
//     for (let i = 0; i < arrs.length; i++) {
//       temp = Utils.trim(arrs[i])

//       if (Utils.isEmpty(temp)) continue // 去除空数据
//       // 去除多行注释
//       if (temp.startsWith('/*')) {
//         bool = true
//         continue
//       }
//       if (bool) {
//         if (temp.endsWith('*/')) bool = false
//         continue
//       }
//       if (temp.startsWith('//')) continue // 去除单行注释
//       str += temp + LineFeed
//     }
//     data = str.substring(0, str.length - LineFeed.length)

//     // 3.判断是否以Object.assign开头
//     // 当以Object.assign开头，则对data进行截取，获取事件的字符串；当不以Object.assign开头，则可直接对data直接操作
//     if (data.startsWith(Start)) {
//       data = data.substring(data.indexOf(LBrace) + 1, data.lastIndexOf(RBrace))
//       data = Utils.trim(data)
//     }
//     if (data.substring(data.length - 1) === ',') {
//       data = data.substring(0, data.length - 1)
//     }
//     try {
//       // eslint-disable-next-line no-eval
//       obj = eval('({' + data + '})')
//     } catch (error) {
//       console.warn(error)
//     }
//     const _this = _.cloneDeep(this)
//     const _eventsUtils = _.extend(_this, obj)
//     _eventsUtils._eventsUtilsID = name
//     if (Utils.isNotEmpty(name)) {
//       this[name] = _eventsUtils
//     }
//     return _eventsUtils
//   },
//   // 初始化表单事件
//   _initFunEvents: function(data) {
//     const events = {}
//     if (Utils.isEmpty(data)) return events
//     if (!Utils.isString(data)) return events
//     data = Utils.trim(data)

//     // 保存分割后的数据
//     let arrs = []
//     // 保存组合成的函数的字符串
//     let str = ''
//     // 判断是否为多行注释文本
//     let bool = false
//     // 保存分割好后的对象数据
//     let obj = {}

//     // 正则表达式
//     const regExp_one = /^(var|let|const)( ){1,}[a-zA-Z0-9_]{1,}( )*=( )*function/
//     const regExp_two = /^[a-zA-Z0-9_]{1,}( )*:( )*function/
//     const regExp_three = /^function( ){1,}[a-zA-Z0-9_]{1,}/

//     // 1.判断是否以Object.assign开头
//     // 2.当以Object.assign开头，则对data进行截取，获取事件的字符串；当不以Object.assign开头，则可直接对data直接操作
//     if (data.startsWith(Start)) {
//       data = data.substring(data.indexOf(LBrace) + 1, data.lastIndexOf(RBrace))
//     }

//     // 3.对data进行行的分割，组合成一个数组
//     arrs = data.split(LineFeed)

//     // 4.遍历分割后的数组，判断是否为函数的格式，对数据进行操作，并赋值到对象内
//     let temp = ''
//     for (let i = 0; i < arrs.length; i++) {
//       temp = Utils.trim(arrs[i])

//       if (Utils.isEmpty(temp)) continue // 去除空数据
//       // 去除多行注释
//       if (temp.startsWith('/*')) {
//         bool = true
//         continue
//       }
//       if (bool) {
//         if (temp.endsWith('*/')) bool = false
//         continue
//       }
//       if (temp.startsWith('//')) continue // 去除单行注释
//       // 判断行是否为函数开头的
//       if (regExp_one.test(temp) || regExp_two.test(temp) || regExp_three.test(temp)) {
//         if (Utils.isNotEmpty(str) && Utils.isNotEmpty(obj)) {
//           str = str.substring(str.indexOf(LBrace) + 1, str.lastIndexOf(RBrace))
//           try {
//             const _fun = new Function(...obj.args, str)
//             events[obj.name] = _fun
//           } catch (error) {
//             console.warn('事件脚本格式出错', str)
//           }
//         }
//         str = ''
//         obj = {}
//         const _argsStr = temp.substring(temp.indexOf(LCurves) + 1, temp.indexOf(RCurves))
//         const _args = _argsStr.split(',')
//         obj.args = _args
//         const _temp = temp.substring(temp.indexOf(LBrace))
//         str += _temp + LineFeed

//         if (regExp_one.test(temp)) {
//           obj.name = Utils.trim(temp.split('=')[0].split(/( ){1,}/)[1])
//         } else if (regExp_two.test(temp)) {
//           obj.name = Utils.trim(temp.split(':')[0])
//         } else if (regExp_three.test(temp)) {
//           obj.name = Utils.trim(temp.substring(0, temp.indexOf(LCurves)).split(/( ){1,}/)[1])
//         }
//       } else {
//         str += temp + LineFeed
//       }
//     }
//     if (Utils.isNotEmpty(str) && Utils.isNotEmpty(obj)) {
//       str = str.substring(str.indexOf(LBrace) + 1, str.lastIndexOf(RBrace))
//       try {
//         const _fun = new Function(...obj.args, str)
//         events[obj.name] = _fun
//       } catch (error) {
//         console.warn('事件脚本格式出错', str)
//       }
//     }
//     const _eventsUtils = _.extend(tranformObject(this), events)
//     return _eventsUtils
//   },
//   // 事件调用
//   _eventCall: function(events, name, ...args) {
//     if (name === 'onLoad' && Utils.isNotEmpty(events)) {
//       let _data
//       if (Utils.isNotEmpty(args)) _data = args[0]
//       events._init(_data)
//     }
//     if (Utils.isNotEmpty(name) &&
//       Utils.isNotEmpty(events) &&
//       Utils.isNotEmpty(events[name]) &&
//       _.isFunction(events[name])) {
//       return events[name](...args)
//     }
//     if (Utils.isNotEmpty(args) && _.isFunction(args[args.length - 1])) { args[args.length - 1](true) }
//   },
//   // 清理所有自定义事件
//   cleanEvents: function() {
//     this.onLoad = null
//     this.onLoadActions = null
//     this.onValidate = null
//     this.afterSubButton = null
//     this.beforeSubButton = null
//     this.summaryMethod = null
//     this.beforeSubmit = null
//     this.afterSubmit = null
//     this.customFormatter = null
//     this.afterSubButton = null
//   },
//   cleanEventsByName: function(name) {
//     if (Utils.isNotEmpty(this[name])) {
//       this[name] = null
//     }
//   }
// })

export default eventsUtil
