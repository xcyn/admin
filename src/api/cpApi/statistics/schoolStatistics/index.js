import { businessRequest } from '@/plugin/axios';

// 查询学习统计的图表数据
export function getEchart(param) {
  return businessRequest({
    method: 'get',
    url: `/api/statistics/schoolChart`,
    params: param
  });
}

// 查询学习统计的列表数据
export function getTable(param) {
  return businessRequest({
    method: 'get',
    url: `/api/statistics/schoolList`,
    params: param
  });
}

// 查询学习统计的岗位数据
export function getPost() {
  return businessRequest({
    method: 'post',
    url: `/api/SchoolStatistic/getPost`
  });
}

// 查询学习统计的人员分组数据
export function getUserGroup() {
  return businessRequest({
    method: 'post',
    url: `/api/SchoolStatistic/getUserGroup`
  });
}
