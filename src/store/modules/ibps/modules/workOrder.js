export default {
  namespaced: true,
  state: {
    woTypeNoArr: [],// 工单类型
    woOrderInfo: {},// 工单基本信息
    woStdWorderInfo: [],// 标准工单基本信息
    stdWoTicketInfo: {},// 标准工作票基本信息
    projectInfo: {}, // 项目信息
    dictInfoArr: [], // 数据字典信息
    currVersion: '' // 标准工单--当前版本
  },
  mutations: {
    setWoTypeNoArr (state, woTypeNoArr) {
      state.woTypeNoArr = woTypeNoArr;
    },
    setWoOrderInfo (state, woOrderInfo) {
      state.woOrderInfo = woOrderInfo;
    },
    setWoStdWorderInfo (state, woStdWorderInfo) {
      state.woStdWorderInfo = woStdWorderInfo;
    },
    setStdWoTicketInfo (state, stdWoTicketInfo) {
      state.stdWoTicketInfo = stdWoTicketInfo;
    },
    setProjectInfo (state, projectInfo) {
      state.projectInfo = projectInfo;
    },
    setDictInfoArr (state, dictInfoArr) {
      state.dictInfoArr = dictInfoArr;
    },
    setCurrVersion (state, currVersion) {
      state.currVersion = currVersion;
    }
  }
}