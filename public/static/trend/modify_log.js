
$(function() {
    /* var CALCULATION_URL=getQueryString('CALCULATION_URL');
    var api_url=getQueryString('api_url'); */

	var CALCULATION_URL=localStorage.getItem('CALCULATION_URL');
	var api_url=localStorage.getItem('api_url');
	
    var fileName =getQueryString('fileName');
    var pointId = getQueryString('pointId');
    $('#fileName').textbox('setValue',fileName);
    $('#pointId').textbox('setValue',pointId);
       
    $("#ptab").datagrid({
		url: api_url+CALCULATION_URL+'/api/diagram/selectSvgPointLog',

		queryParams:{
			fileName:fileName,
			pointId:pointId
		},
		singleSelect:true,
		fitColumns:true,
		fit:true,
		pagination:true,
		pageList:[20,40,60],
		pageSize:20,
		loadFilter : function(res){
			//过滤数据
			var value={
				total:res.data.total,
				rows:res.data.records
			};
			return value;
		},
		columns:[[
			{field:'pointCode',title:'当前测点编码',width:250},
			{field:'pointDesc',title:'当前测点描述',width:350},
			{field:'pointCodeLast',title:'上次测点编码',width:250},
			{field:'pointLastDesc',title:'上次测点',width:350},
			{field:'createTime',title:'修改时间',width:300}
		]],
		onBeforeLoad:function(param){
			param["requestPage.pageNo"] = param.page;
			param["requestPage.limit"] = param.rows;
			delete param.rows;
			delete param.page;
			param.fileName=fileName;
			param.pointId=pointId;
		}
	});
	 var pg=$("#ptab").datagrid('getPager');
	 if(pg){
		 $(pg).pagination({
			 onBeforeRefresh:function(){
				 $("#ptab").datagrid('reload',{
					fileName: $('#fileName').textbox('getValue'),
					pointId:$('#pointId').textbox('getValue')
				 });
				 return false;
			 }
		 })
	 }
	/* $.ajax({
		type: "POST",
		url: api_url+CALCULATION_URL + '/api/diagram/selectSvgPointLog"',
	    contentType: 'application/json',
		data: JSON.stringify({pointId:pointId, fileName: fileName}),
		dataType: "json",
		success: function(response){	
			render(response.result.records);
		},
		error: function() {
			render(null);
			new jBox('Notice').setContent('<font color=red>Server disconnected, please contact the administrator!</font>');
		}
 	}); */
});


/**
 * 获取url参数
 * @param name
 * @returns
 */
 function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
       // return unescape(r[2]);
		return decodeURI(r[2]);   //替换unescape 为 decodeURI   解决中文乱码问题 
    }
    return null;
}