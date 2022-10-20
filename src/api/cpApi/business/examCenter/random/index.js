import { businessRequest } from '@/plugin/axios/index';

// 获取表格信息
export function getTable(param) {
    return businessRequest({
        method: 'get',
        url: `/api/examAnswer/queryRandomExamList`,
        params: param
    });
}

// 通过考试ID查询试题
export function getExamTopic(param) {
    return businessRequest({
        method: 'get',
        url: `/api/examAnswer/queryExamTopicByExamId`,
        params: param
    });
}

// 添加
export function addRandomExam(param) {
    return businessRequest({
        method: 'post',
        url: `/api/examAnswer/add`,
        data: param
    });
}

// 交卷
export function submitPaper(param) {
    return businessRequest({
        method: 'post',
        url: `/api/examAnswer/submitPaper`,
        data: param
    });
}

// 点击开始考试按钮
export function getBeginExam(param, param2) {
    return businessRequest({
        method: 'get',
        url: `/api/exam/beginExam?id=${param}&userId=${param2}`
    });
}

// 交卷时验证 提示是否有题目未做
export function getSubmitExamValidate(data) {
    let _singleCount = 0;
    let _moreCount = 0;
    let _judgeCount = 0;
    let _shortAnswerCount = 0;
    let _resMsg = [];
    let topicIds = [];
    let _singleTopicList = data.singleTopicList;
    for (let i = 0; i < _singleTopicList.length; i++) {
        let branchList = _singleTopicList[i].topicBranchVOList;
        let res = branchList.filter(function(branch) {
            return branch.izCheck === true;
        });
        if (res.length === 0) {
            _singleCount++;
            topicIds.push(_singleTopicList[i].topicId);
        }
    }
    if (_singleCount > 0) {
        _resMsg.push(_singleCount + '道单选题');
    }

    let _moreTopicList = data.moreTopicList;
    for (let i = 0; i < _moreTopicList.length; i++) {
        let branchList = _moreTopicList[i].topicBranchVOList;
        let res = branchList.filter(function(branch) {
            return branch.izCheck === true;
        });
        if (res.length === 0) {
            _moreCount++;
            topicIds.push(_moreTopicList[i].topicId);
        }
    }
    if (_moreCount > 0) {
        _resMsg.push(_moreCount + '道多选题');
    }

    let _judgeTopicList = data.judgeTopicList;
    for (let i = 0; i < _judgeTopicList.length; i++) {
        let branchList = _judgeTopicList[i].topicBranchVOList;
        let res = branchList.filter(function(branch) {
            return branch.izCheck === true;
        });
        if (res.length === 0) {
            _judgeCount++;
            topicIds.push(_judgeTopicList[i].topicId);
        }
    }
    if (_judgeCount > 0) {
        _resMsg.push(_judgeCount + '道判断题');
    }

    let _shortAnswerTopicList = data.shortAnswerTopicList;
    for (let i = 0; i < _shortAnswerTopicList.length; i++) {
        if (_shortAnswerTopicList[i].shortAnswer === null) {
            _shortAnswerCount++;
            topicIds.push(_shortAnswerTopicList[i].topicId);
        }
    }
    if (_shortAnswerCount > 0) {
        _resMsg.push(_shortAnswerCount + '道简答题');
    }
    if (_resMsg.length > 0) {
        let msg = '有' + _resMsg.join(',') + '未做';
        let result = {
            msg: msg,
            topicIds: topicIds
        };
        return result;
    } else {
        return null;
    }
}