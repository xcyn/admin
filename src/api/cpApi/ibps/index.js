import axios from "axios";
import { Message } from 'element-ui';

const baseUrl = process.env.VUE_APP_BASE_API + "/platform/v3";

axios.interceptors.request.use(
    function(config) {
        return config;
    },
    function(error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

//获取所有用户
export function employeeFindAll() {
    return new Promise((resolve, reject) => {
        axios.get(baseUrl + '/employee/findAll').then(res => {
            if (res.status === 200) {
                resolve(res.data);
            } else {
                Message({
                    message: res.message,
                    type: 'error'
                });
                reject(res);
            }
        });
    })
}

//获取所有用户
export function employeeQuery() {
    return new Promise((resolve, reject) => {
        axios.post(baseUrl + '/employee/query', { "parameters": [], "requestPage": { "pageNo": 1, "limit": 100000 }, "sorts": [] }).then(res => {
            if (res.status === 200) {
                resolve(res.data);
            } else {
                Message({
                    message: res.message,
                    type: 'error'
                });
                reject(res);
            }
        });
    })
}

//获取所有组织
export function orgFindAll() {
    return new Promise((resolve, reject) => {
        axios.get(baseUrl + '/org/findAll').then(res => {
            if (res.status === 200) {
                resolve(res.data);
            } else {
                Message({
                    message: res.message,
                    type: 'error'
                });
                reject(res);
            }
        });
    })
}

export function getUserInfo(account) {
    return new Promise((resolve, reject) => {
        axios.post(baseUrl + '/employee/query', { "parameters": [{ "key": "Q^ACCOUNT_^SL", "value": account }], "requestPage": { "pageNo": 1, "limit": 20, "totalCount": 181 }, "sorts": [] }).then(res => {
            if (res.status === 200) {
                resolve(res.data);
            } else {
                Message({
                    message: res.message,
                    type: 'error'
                });
                reject(res);
            }
        });
    })

}

export function getLocalUser(account) {
    return new Promise((resolve, reject) => {
        axios.post(baseUrl + '/employee/query', { "parameters": [{ "key": "Q^ACCOUNT_^S", "value": account }], "requestPage": { "pageNo": 1, "limit": 20, }, "sorts": [] }).then(res => {
            if (res.status === 200) {
                resolve(res.data);
            } else {
                Message({
                    message: res.message,
                    type: 'error'
                });
                reject(res);
            }
        });
    })

}

//获取组织树
export function orgTree(data) {
    return new Promise((resolve, reject) => {
        axios.post(baseUrl + '/org/findTreeData', data).then(res => {
            if (res.status === 200) {
                resolve(res.data);
            } else {
                Message({
                    message: res.message,
                    type: 'error'
                });
                reject(res);
            }
        });
    })
}

//根据组织ID查询人员
export function employeeQueryOrgUser(data) {
    return new Promise((resolve, reject) => {
        axios.post(baseUrl + '/employee/queryOrgUser', data).then(res => {
            if (res.status === 200) {
                resolve(res.data);
            } else {
                Message({
                    message: res.message,
                    type: 'error'
                });
                reject(res);
            }
        });
    })
}

/**根据用户ID查询组织 */
export function getOrgByUserId(data) {
    return new Promise((resolve, reject) => {
        axios.get(baseUrl + '/org/findByUserId?userId=' + data).then(res => {
            if (res.status === 200) {
                resolve(res.data);
            } else {
                Message({
                    message: res.message,
                    type: 'error'
                });
                reject(res);
            }
        });
    })
}

//文件上传
export function fileUpload(file) {
    return new Promise((resolve, reject) => {
        var formData = new FormData();
        formData.append("file", file);
        axios.post(baseUrl + '/file/upload', formData).then(res => {
            if (res.status === 200) {
                resolve(res.data);
            } else {
                Message({
                    message: res.message,
                    type: 'error'
                });
                reject(res);
            }
        });
    })
}

//文件下载
export function fileDownload(attachmentId) {
    return new Promise((resolve, reject) => {
        let data = {
            method: "GET",
            url: baseUrl + '/file/download?attachmentId=' + attachmentId,
            responseType: "arraybuffer"
        };

        resolve(axios(data));
    })
}

//文件预览
export function filePreview(attachmentId) {
    return new Promise((resolve, reject) => {
        let data = {
            method: "GET",
            url: baseUrl + '/file/getImage?attachmentId=' + attachmentId,
            responseType: "arraybuffer",
            Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8"
        };
        resolve(axios(data));
    })
}

//获取岗位信息
export function getPositions(positionIds) {
    return new Promise((resolve, reject) => {
        axios.post(baseUrl + '/position/findByIds?positionIds=' + positionIds).then(res => {
            if (res.status === 200) {
                resolve(res.data);
            } else {
                Message({
                    message: res.message,
                    type: 'error'
                });
                reject(res);
            }
        });
    })
}

//获取所有岗位信息
export function getAllPositions() {
    return new Promise((resolve, reject) => {
        axios.get(baseUrl + '/position/findAll').then(res => {
            if (res.status === 200) {
                resolve(res.data);
            } else {
                Message({
                    message: res.message,
                    type: 'error'
                });
                reject(res);
            }
        });
    })
}

// axios.interceptors.response.use(function (response) {
//   //对响应数据做些事
//   if (response.data.head && response.data.head.resCode && response.data.head.resCode == '3000000002') {
//     router.replace({
//       path: '/login',
//       query: { redirect: router.currentRoute.fullPath }
//     })
//   }
//   return response;
// }, function (error) {
//   //请求错误时做些事
//   return Promise.reject(error);
// })

// Vue.prototype.$http = axios;
// Vue.$baseUrl = Vue.prototype.$baseUrl = baseUrl;
// Vue.config.productionTip = false;
// Vue.$resMsg = Vue.prototype.$resMsg = resMsg;