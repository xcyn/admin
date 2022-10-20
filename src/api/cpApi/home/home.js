import { businessRequest } from '../../plugin/axios/index';

export function getNotice(param) {
  return businessRequest({
    method: 'get',
    url: `/api/home/notice?userId=${param}`
  });
}

export function getCalendar(param) {
  return businessRequest({
    method: 'get',
    url: `/api/home/calendar?userId=${param}`
  });
}

// 标记已读
export function editNoticeStatus(param, param1) {
  return businessRequest({
    method: 'get',
    url: `/api/home/editNoticeStatus?id=${param}&userId=${param1}`
  });
}
