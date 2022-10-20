import Mock from 'mockjs'


const baseUrl = process.env.VUE_APP_API + process.env.VUE_APP_API_BUSINESS

// // 表单模拟
// Mock.mock(baseUrl + 'api/demo/tableData', /get|post/i, { 
//   code: 0,
//   msg: 'Mock接口模拟数据',
//   data: {
//     "data|10-50": [{
//           'name': '@cname',
//           'id|+1': 1,
//           'age|10-60': 0,  
//           'date': '@date("yyyy-MM-dd")',    
//           'city': '@city(true)'   
//         }]
//   }
// });

const Random = Mock.Random
// 用于接受生成数据的数组
let tableList = []
for (let i = 0; i < 100; i++) {
  let newObject = {
    id: i,
    title: Random.csentence(5, 10),
    name: Random.cname(), 
    city: Random.city(true),
    date: Random.date("yyyy-MM-dd")
  }
  tableList.push(newObject)
}

const getUrlParams = function(urlStr) {
  if (typeof urlStr == "undefined") {
    var url = decodeURI(location.search); //获取url中"?"符后的字符串
  } else {
      var url = "?" + urlStr.split("?")[1];
  }
  var theRequest = new Object();
  if (url.indexOf("?") != -1) {
      var str = url.substr(1);
      var strs = str.split("&");
      for (var i = 0; i < strs.length; i++) {
          theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
      }
  }
  return theRequest;
}

Mock.setup({
    timeout: '500-2000' 
})

// post请求分页
Mock.mock(RegExp(baseUrl + 'api/demo/tableData'+ ".*"), /get|post/i, (params) => {
  console.log('----------表格请求参数-----------------')
  console.log(params)
  // const requestParams = getUrlParams(params.url)
  const requestParams = JSON.parse(params.body)
  const page = requestParams.requestPage
  const [index, size, total] = [parseInt(page.pageNo), parseInt(page.limit), tableList.length]
  let len = total / size
  // console.log(index, size, total, 'index, size, total')
  const totalPages = len - parseInt(len) > 0 ? parseInt(len) + 1 : len
  // 截取list
  // const newProduceNewsData = tableList.slice(index * size, (index + 1) * size)
  const newProduceNewsData = tableList.slice((index - 1) * size, index * size)
  // console.log(newProduceNewsData, 'newProduceNewsData')

  return {
    code: '0',
    message: '',
    data: {
      dataResult: newProduceNewsData,
      pageResult: {
        totalCount: total,
        totalPages: totalPages
      }
    },
  
  }
})


Mock.mock(RegExp(baseUrl + 'api/demo/treedata'), /get|post/i, (params) => {     
    const trs = []

    for(let i = 0; i< 20;i++) {
      trs.push({
        id: Random.integer(1, 100000),
        text: Random.cname(),
        son: [{
          id:Random.integer(1, 100000),
          text: '二级 1-1',
          son: [{
            id:Random.integer(1, 100000),
            text: '三级 1-1-1'
          }]
        }]
      })
    }

    return trs

    return [{                                
        id:1,
        text: Random.cname(),
        son: [{
          id:10,
          text: '二级 1-1',
          son: [{
            id:100,
            text: '三级 1-1-1'
          }]
        }]
      }, {
        id:2,
        text: Random.cname(),
        son: [{
          id:20,
          text: '二级 2-1',
          son: [{
            id:200,
            text: '三级 2-1-1'
          }]
        }, {
          id:21,
          text: '二级 2-2',
          son: [{
            id:211,
            text: '三级 2-2-1'
          }]
        }]
      }, {
        id:3,
        text: Random.cname(),
        son: [{
          id:31,
          text: '二级 3-1',
          son: [{
            id:311,
            text: '三级 3-1-1'
          }]
        }, {
          id:32,
          text: '二级 3-2',
          son: [{
            id:322,
            text: '三级 3-2-1'
          }]
        }]
      }]
})

Mock.mock(RegExp(baseUrl + 'api/demo/xxxtedd'), /get|post/i, (params) => {     
  return [{                                
      id: Random.integer(1000, 100000),
      text: '1111',
      son: [{
        id:Random.integer(1000, 100000),
        text: '二级 1-1',
        son: [{
          id:Random.integer(1000, 100000),
          text: '三级 1-1-1'
        }]
      }]
    }]
})