import * as piInstHttp from "@/api/cpApi/cpisPiInst/index"
import * as wtPersonRoleAPI from '@/api/cpApi/twoTickets/wtPersonRole'

export default {
  async queryUserByPiInstKeys(piInstKeys, params) {
    return new Promise(async resolve =>{
      let userList = {}
      await piInstHttp.getInterfaceInstList({ instKeys: piInstKeys }).then(async res =>{
        if (res.data != null) {
          // 三种人
          let threeData = res.data.filter(one => one.piKey == 'three')
          if (threeData) {
            let threeUserList = await hanldeThreeUser(threeData, params)
            Object.assign(userList, threeUserList)
          }
          // // 交接班
          // let shiftData = res.data.filter(one => one.piKey == 'shift')
          // if (shiftData) {
          //   let shiftUserList = hanldeShiftUser(shiftData, params)
          //   userList.push(shiftUserList)
          // }
          // // 系统人员
          // let systemData = res.data.filter(one => one.piKey == 'system')
          // if (systemData) {
          //   let systemUserList = hanldeSystemUser(systemData, params)
          //   userList.push(systemUserList)
          // }
          //
          // // 三外人员
          // let outsourceData = res.data.filter(one => one.piKey == 'outsource')
          // if (outsourceData) {
          //   let outsourceUserList = hanldeOutsourceUser(outsourceData, params)
          //   userList.push(outsourceUserList)
          // }
        }
      }).catch(e => {
        console.log(e)
      })
      resolve(userList)
    })
  },
  async queryUserByPiInstKey(piInstKey, params) {
    let userList = []
    await piInstHttp.getInterfaceInst({ instKey: piInstKey }).then(res =>{
      userList = res.data
      if (res.data != null) {
        let piKey = res.data.piKey
        switch (piKey) {
          case 'three':
            userList = getThreeUser(res.data, params)
            break;
          case 'shift':
            userList = getShiftUser(res.data, params)
            break;
          case 'system':
            userList = getSystemUser(res.data, params)
            break;
          case 'outsource':
            userList = getOutSourceUser(res.data, params)
            break;
        }
      }
    }).catch(e => {
      console.log(e)
    })
    return userList
  },

}
function hanldeThreeUser(configData, params) {
  return new Promise(async resolve =>{
    wtPersonRoleAPI.listByDO({}).then(response => {
      let dataList = response.data
      let userData = {}
      configData.forEach(async item =>{
        let piInstKey = item.piInstKey
        let keyParams = null
        if (params != null && params[piInstKey]) {
          let pageParams = params[piInstKey]
          if(item.shieldParams != "" && item.shieldParams != null){
            let shieldParamsArr = item.shieldParams.split(',')
            shieldParamsArr.forEach(p => {
              delete pageParams[p]
            })
          }
          if(item.setParams != "" && item.setParams != null){
            let setParamsObj = JSON.parse(item.setParams)
            keyParams = Object.assign(pageParams, setParamsObj)
          }
        } else {
          if(item.setParams != "" && item.setParams != null){
            keyParams = JSON.parse(item.setParams)
          }
        }
        if(keyParams != null){
          userData[piInstKey] = dataList
          for (const [key, value] of Object.entries(keyParams)) {
            userData[piInstKey] = userData[piInstKey].filter(one => one[key] === value)
          }
        }
      })
      resolve(userData)
    })
  })
}
function hanldeShiftUser(configData, params) {

}
function hanldeSystemUser(configData, params) {

}
function hanldeOutsourceUser(configData, params) {

}


function getThreeUser(configData, params) {
  wtPersonRoleAPI.listByDO({ isOn: 1 }).then(response => {
    let dataList             = response?.data || []
    this.baseData.outIssuerList = dataList.filter(one => one.isIssuer === "1" && one.isPo === "1")
    this.baseData.issuerList = dataList.filter(one => one.isIssuer === "1")
    this.baseData.managerList = dataList.filter(one => one.isManager === "1")
    this.baseData.dutyList = dataList.filter(one => one.isPermitor === "1")
  })
}
function getShiftUser(configData, params) {

}
function getSystemUser(configData, params) {

}
function getOutSourceUser(configData, params) {

}

