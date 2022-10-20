import { businessRequest } from '@/plugin/axios/index';

// 添加
export function addQuestionExercise(param) {
    return businessRequest({
        method: 'post',
        url: `/api/questionExercise/add`,
        data: param
    });
}