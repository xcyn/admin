import { businessRequest } from '@/plugins/axios/index';

// 根据当前用户id获取用户信息
export function getUserInfoById(param) {
  return businessRequest({
    method: 'get',
    url: `/api/feign/getUserInfoById`,
    params: param
  });
}

// 选择所有参培人员信息
export function query4Position(param) {
  return businessRequest({
    method: 'post',
    url: `/api/feign/query4Position`,
    params: param
  });
}

// 根据当前用户id获取组织信息
export function queryOrgInfoByUserId(param) {
  return businessRequest({
    method: 'get',
    url: `/api/feign/getOrgInfofoByUserId`,
    params: param
  });
}

// 根据证书类型获取考试通过的用户
export function queryExam(param) {
  return businessRequest({
    method: 'get',
    url: `/api/examScoreManage/queryExam`,
    params: param
  });
}

// 根据证书类型获取学习时长达标的用户
export function queryUserStudyHour(param) {
  return businessRequest({
    method: 'get',
    url: `/api/userStudyHour/queryUserStudyHour`,
    params: param
  });
}

// 根据证书类型获取学习时长达标的用户
export function queryTrain(param) {
  return businessRequest({
    method: 'get',
    url: `/api/trainUser/queryTrain`,
    params: param
  });
}

// 根据用户id及类型获取参与者属性
export function queryPartTypeAttr(param) {
  return businessRequest({
    method: 'get',
    url: `/api/feign/queryPartyTypeAttr`,
    params: param
  });
}
