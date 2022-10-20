import $ from 'jquery'
const validateEmpty = (rule, value, callback) => {
  if (!value || value === '') {
    callback(new Error('请输入'))
  } else if ($.trim(value) === '') {
    callback(new Error('请不要只输入空格'))
  } else {
    callback()
  }
}
const validatePhone = (rule, value, callback) => {
  if (value && value !== '') {
    let myReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
    if (!myReg.test(value)) {
      callback(new Error('手机号码格式不正确！'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

export const voa = {
  // 输入框
  rW: { validator: validateEmpty, trigger: 'blur' }, // requireWrite的简写
  vIdCard: { min: 18, max: 18, message: '长度应为是18位', trigger: 'blur' }, // 身份证validate ID card
  vPhone: { validator: validatePhone, trigger: 'blur' }, // 手机号码，validate Phone
  maxFifty: { max: 50, message: '长度不能超过50', trigger: 'blur' }, //
  maxTH: { max: 200, message: '长度不能超过200', trigger: 'blur' }, // TH为two hundred 简写
  maxFH: { max: 500, message: '长度不能超过500', trigger: 'blur' }, // TH为five hundred 简写
  maxOT: { max: 1000, message: '长度不能超过1000', trigger: 'blur' }, // TH为one thousand 简写
  maxTT: { max: 2000, message: '长度不能超过2000', trigger: 'blur' }, // TH为two thousand 简写
  maxFT: { max: 5000, message: '长度不能超过5000', trigger: 'blur' }, // TH为five thousand 简写
  // 选择框
  rC: { required: true, message: '请选择', trigger: 'change' }
}

