/**
 * 权限字段sql
 */
import { getDataByParam } from '@/api/cpApi/baseService/baseService.js' // 基础服务
import store from '@/store'

export default {
  namespaced: true,
  state: {
    auColumnSqlAll: []
  },
  // 同步方案
  mutations: {
    /**
		 * 清空权限列表
		 * @author mbb
		 */
    resetAuth(state) {
      state.auColumnSqlAll = []
    }
  },
  // 异步方案
  actions: {
    /**
		 * 当前人:      {local_user}     :  从
		 * 当前部门:    {local_dept}     :  从
		 * 当前公司:    {local_com}      :  从
		 * @description 查询用户所有权限,并根据url 存放每条sql
		 */
    async loadAll({ rootState, state, dispatch }) {
      state.auColumnSqlAll = []
      try {
        let userInfo = store.state.ibps.user.info
        let userId = userInfo.user.id
        let companyId = !userInfo.company ? ' ' : userInfo.company.companyId
        let deptId = !userInfo.superDepart ? ' ' : userInfo.superDepart.id

        let ids = rootState.ibps.user.info.role.map(one => {
          return one.id
        }).join(',')

        // let res = await getDataByParam({
        //   'parameters': [
        //     { key: 'key', value: 'qxzdsql' },
        //     { key: 'Q^role_id^SIN', value: ids }
        //   ]
        // })

        let auColumnSqlAll = []
        // res.data.dataResult.forEach(element => {
        //   let sql_content = element.sql_content
        //   sql_content = sql_content.replace('{local_user}', userId)
        //   sql_content = sql_content.replace('{local_dept}', deptId)
        //   sql_content = sql_content.replace('{local_com}', companyId)
        //   if (!auColumnSqlAll.hasOwnProperty(element.uri)) {
        //     auColumnSqlAll[element.uri] = sql_content
        //   } else {
        //     auColumnSqlAll[element.uri] += ' or ' + sql_content
        //   }
        // })
        state.auColumnSqlAll = auColumnSqlAll
      } catch (error) {
        console.log(error)
      }
    }
  }
}
