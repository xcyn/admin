//系统地址
//促普
var serverhost = "http://172.169.50.10:5100";
// 模拟器
// var rdburl = "http://124.222.18.188:21001";
// var serverhost = "http://127.0.0.1:21001";

//实时数据
var rdburl = serverhost + '/ibps/calculation/v3/api/diagram/showPointsValue';
//技术参数
var tprdburl = serverhost + '/ibps/calculation/v3/api/diagram/showTpValue';
//修改测点
var updatepointurl = serverhost + '/ibps/calculation/v3/api/diagram/updateSvgSisPoint';
//查看修改日志
var viewLogurl = serverhost + '/ibps/calculation/v3/api/diagram/selectSvgPointLog';

var rdbinterval  = 5000 ; //实时数据刷新间隔，ms
//历史趋势
// var histrendsurl = "http://112.4.136.182:1880/#/calculation/mpAnalysis?";

//打开历史趋势
function mpAnalysis(tagid) {  
  window.parent.mpAnalysis(tagid);  
}

//打开报警趋势
function amAlarmList(tagid) {
	window.parent.amAlarm(tagid);
}

//更新测点
function updatePoint(oldPoint,gid){
	
	var bodyparam = {
	  "newPoint": $('#newPointName').val(),
	  "oldPoint": oldPoint,
	  "htmlUrl": decodeURI(window.location.href),
	  "gid": gid
	}
	
	$.ajax({
		  type: "post",
		  url: updatepointurl,
		  data:JSON.stringify(bodyparam),
		  contentType: "application/json",
		  success: (res) => {			
			if(res.code === 0){					    
					if(res.data.flag === 1){
						layer.msg("测点修改成功");						
					}else{
						layer.msg(res.msg);						
					}				    
				}else{
				console.log(res.msg);
			}					
			
		  },
		  error: (err) => {
			this.loginLoading = false;
			console.log(err);
		  }
		});			
}


//查看日志
function viewLog(pointCode,gid){		
	$.ajax({
		  type: "post",
		  url: viewLogurl + '?pointCode=' +viewLogurl + '&requestPage.limit=20&requestPage.pageNo=1',		  
		  contentType: "application/json",
		  success: (res) => {	
			console.log(res);  
			if(res.code === 0){	
				var tabdata = res.data.records;						
					layer.open({
					  type: 1, 
					  skin: 'layui-layer-molv', //样式类名 
					  title: '测点修改日志',
					  area: ['800px', '500px'],
					  closeBtn:0,
					  shadeClose:true,
					  content: '<table id="viewlogtab" lay-filter="viewlogtab">',
					  success:function(){
						table.render({
							elem: '#viewlogtab'							
							,data:tabdata							
							, cols: [[ //表头
								{field: 'id', title: 'ID', sort: true, width:140}
								, {field: 'fileName', title: '文件名', width:140}
								, {field: 'pointCode', title: '当前测点', width:140}
								, {field: 'pointDesc', title: '当前测点描述', width:140}
								, {field: 'pointCodeLast', title: '修改前测点', width:140}
								, {field: 'pointLastDesc', title: '修改前测点描述', width:140}
								, {field: 'pointId', title: '文件标识', width:100}
								, {field: 'creator', title: '修改人', width:100}
								, {field: 'createTime', title: '修改时间', width:160}
							]]					
						});
					  }
					});
				}else{
				console.log(res.msg);
			}					
			
		  },
		  error: (err) => {
			this.loginLoading = false;
			console.log(err);
		  }
		});
			
}

