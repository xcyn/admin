var CALCULATION_URL;
var api_url;
//alert("CALCULATION_URL="+CALCULATION_URL);

var nowpoint;//当前测点名称
var pointnames = "";//当前选取的测点名称集
//var cookiePoints="";
var chart = null;
var start = 0;
var end = 0;
var startTime = "";//开始时间
var endTime = "";//结束时间
var flag=1;
var tag=0;//tag为1表示数据、为0表示曲线
var index=0;
/**
 * 分页数据定义
 * */
var pageSize = 50;    //每页显示的记录条数
var curPage=0;        //当前页
var lastPage;        //最后页
var direct=0;        //方向
var len;            //总行数
var page;            //总页数
var begin;
var end;
$(document).ready(function() {
	nowpoint = getQueryString('nowpoint');
	startTime=getQueryString('startTime');
	endTime=getQueryString('endTime');

	/* CALCULATION_URL=getQueryString('CALCULATION_URL');
	api_url=getQueryString('api_url');
	
    
	if(api_url == null || api_url == ''){
		api_url = localStorage.getItem('api_url');
	}
	if(CALCULATION_URL == null || CALCULATION_URL == ''){
		CALCULATION_URL = localStorage.getItem('CALCULATION_URL');
	} */

	api_url = localStorage.getItem('api_url');
	CALCULATION_URL = localStorage.getItem('CALCULATION_URL');
	//alert(api_url + CALCULATION_URL);
	setHighSelect();
	if(nowpoint == null) {
		alert("请指定测点");
		window.close();
	}
	drawCurve(initOptions);//默认画一个空的图形
	//初始化开始和结束日期
	end = new Date().getTime();
	//start = end - 5 * 60 * 1000;
	//$("#startTime").val(new Date(start).format('yyyy-MM-dd hh:mm:ss'));
	if(startTime==''||startTime==null){
		endTime=new Date(end).format('yyyy-MM-dd hh:mm:ss');
		$("#endTime").val(endTime);
		img_3click();//默认选择第一个时间轴按钮
	}
	else if(endTime==null||endTime==''){
		endTime=new Date(end).format('yyyy-MM-dd hh:mm:ss');
	}
	if(startTime!=null&&startTime!=''){
		$("#startTime").val(startTime);
		$("#endTime").val(endTime);
		getAjax();
	}
	//createChart([]);
	//saveChartGroup();onbeforeunload
	$(window).unload(function(){
		//console.log("test");
		clearSelectedPoint();
	});
	loadSelectedPoint();
});
function setHighSelect(){
	var orgHighchartsRangeSelectorPrototypeRender = Highcharts.RangeSelector.prototype.render;
	Highcharts.RangeSelector.prototype.render = function (min, max) {
	 orgHighchartsRangeSelectorPrototypeRender.apply(this, [min, max]);
	 var leftPosition = this.chart.plotLeft,
	  topPosition = this.chart.plotTop+5,
	  space = 2;
	 this.zoomText.attr({
	  x: leftPosition,
	  y: topPosition + 15
	 });
	 leftPosition += this.zoomText.getBBox().width;
	 for (var i = 0; i < this.buttons.length; i++) {
	  this.buttons[i].attr({
	   x: leftPosition,
	   y: topPosition 
	  });
	  leftPosition += this.buttons[i].width + space;
	 }
	};
}

//全局设置highcharts
Highcharts.setOptions({  
                global: {  
                    useUTC: false  
                },
                lang: {
                    rangeSelectorZoom: '' // 不显示 'zoom' 文字
                }
            });

//初始化设置图形
var initOptions = {
	chart: {
		borderWidth: 1,
		plotBorderWidth: 1
	},
	rangeSelector: {
		enabled: false
	},
	series: []
};

/**
 * 画图
 */
function drawCurve(curveOptions) {
	chart = $('#container').highcharts('StockChart', curveOptions);
	return chart;
};
/**
 * 分页显示js
 * **/
function pageSet(){
	 len =$("#mytable tr").length - 1;    // 求这个表的总行数，剔除第一行介绍
     page=len % pageSize==0 ? len/pageSize : Math.floor(len/pageSize)+1;//根据记录条数，计算页数
     // alert("page==="+page);
     curPage=1;    // 设置当前为第一页
     displayPage(1);//显示第一页

     document.getElementById("btn0").innerHTML="当前 " + curPage + "/" + page + " 页    每页 ";    // 显示当前多少页
     document.getElementById("sjzl").innerHTML="数据总量 " + len + "";        // 显示数据量
     document.getElementById("pageSize").value = pageSize;

     

     $("#btn1").click(function firstPage(){    // 首页
         curPage=1;
         direct = 0;
         displayPage();
     });
     $("#btn2").click(function frontPage(){    // 上一页
         direct=-1;
         displayPage();
     });
     $("#btn3").click(function nextPage(){    // 下一页
         direct=1;
         displayPage();
     });
     $("#btn4").click(function lastPage(){    // 尾页
         curPage=page;
         direct = 0;
         displayPage();
     });
     $("#btn5").click(function changePage(){    // 转页
         curPage=document.getElementById("changePage").value * 1;
         if (!/^[1-9]\d*$/.test(curPage)) {
             alert("请输入正整数");
             return ;
         }
         if (curPage > page) {
             alert("超出数据页面");
             return ;
         }
         direct = 0;
         displayPage();
     });

     
     $("#pageSizeSet").click(function setPageSize(){    // 设置每页显示多少条记录
         pageSize = document.getElementById("pageSize").value;    //每页显示的记录条数
         if (!/^[1-9]\d*$/.test(pageSize)) {
             alert("请输入正整数");
             return ;
         }
         len =$("#mytable tr").length - 1;
         page=len % pageSize==0 ? len/pageSize : Math.floor(len/pageSize)+1;//根据记录条数，计算页数
         curPage=1;        //当前页
          direct=0;        //方向
          firstPage();
     });
 }

 function displayPage(){
     if(curPage <=1 && direct==-1){
         direct=0;
         alert("已经是第一页了");
         return;
     } else if (curPage >= page && direct==1) {
         direct=0;
         alert("已经是最后一页了");
         return ;
     }

     lastPage = curPage;

     // 修复当len=1时，curPage计算得0的bug
     if (len > pageSize) {
         curPage = ((curPage + direct + len) % len);
     } else {
         curPage = 1;
     }

     
     document.getElementById("btn0").innerHTML="当前 " + curPage + "/" + page + " 页    每页 ";        // 显示当前多少页

     begin=(curPage-1)*pageSize + 1;// 起始记录号
     end = begin + 1*pageSize - 1;    // 末尾记录号

     
     if(end > len ) end=len;
     $("#mytable tr").hide();    // 首先，设置这行为隐藏
     $("#mytable tr").each(function(i){    // 然后，通过条件判断决定本行是否恢复显示
         if((i>=begin && i<=end) || i==0 )//显示begin<=x<=end的记录
             $(this).show();
     });
}
/**
 * 
 * 加载测点数据
 * */
function queryPointData(){
	//var data={};
	//alert('test');
	tag=1;
	setStartTimeAndEndTime();//设置开始和结束时间参数
	var guid = rnd();//产生随机数，预防有缓存
	var Url =api_url+CALCULATION_URL+"/api/diagram/showProcessChart?" + guid;
	//alert(requestUrl);
	//alert(Url);
	$.ajax({
		type:'post',
		url:Url,
		contentType: 'application/json',
		dataType: 'json',
		async:false,
		//data: "pointNames="+pointnames+"&startTime=" + startTime + "&endTime=" + endTime+"&interval=0&dataType=1"  ,
		data:JSON.stringify({
			pointNames:pointnames,
			startTime:startTime,
			endTime:endTime,
			interval:0,
			dataType:1
		}),
		success: function(dataList) { 
			//console.log(dataList);
			//createChart(dataList);
			//data=dataList;
			if(dataList.code == 0){
				getData(dataList.data);
				$("#loadTip").text("");//清空提示信息
			}else{
				alert(dataList.msg);
			}
			//return dataList;
		},
		error: function() {
			//alert('获取数据失败');
			//$("#loadTip").text("获取数据失败！");//隐藏提示信息
		}
	});
	//return data;
}

/**
 * 加载表格数据
 * */
function getData(data){
	//console.log(data);	
	$("#container").empty();
	var html="";     //"<span>testData</span>";
	html="<div  style='height:50%;position:relative;'><table style='height:100%;width:100%;border:solid 1px;'><tr style='background-color:#DDDDEE;'><td class='btd'><b>点标签</b></td><td class='btd'><b>点名称</b></td><td class='btd'><b>下限</b></td>" +
			"<td class='btd'><b>上限</b></td><td class='btd'><b>单位</b></td><td id='tds' ondblclick='tdClick(this)' class='btd'><b>操作</b></td></tr>";
	if(pointnames==null||pointnames==''){
		pointnames=nowpoint;
	}		
	//console.log(pointnames);
	var points=pointnames.split(";");
	var str="";	
	//console.log(points);	
	for(var i=0;i<points.length;i++){
		if(points[i]=="" || points[i]==null){
			continue;
		}
		var list=getPointMes(points[i]);
		/*  str=str+"<tr id='point"+i+"'><td class='std'>"+points[i]+"</td><td class='std'>"+list[0].pointname+"</td><td ondblclick='tdClick(this)' class='std'>"+list[0].lowerlimit+"</td><td ondblclick='tdClick(this)' class='std'>"+list[0].toplimit+"</td><td class='std'>"+list[0].unit+"</td><td class='std'><img onclick='delPoint(this)'" +
		 		" src='./images/clean.png'></img></td></tr>"; */
		var unit = list[0].unit == null ? "" : list[0].unit;
		str=str+"<tr id='point"+i+"'><td class='std'>"+points[i]+"</td><td class='std'>"+list[0].mpComment+"</td><td ondblclick='tdClick(this)' class='std'>"+list[0].rangeBottom+"</td><td ondblclick='tdClick(this)' class='std'>"+list[0].rangeTop+"</td><td class='std'>"+unit+"</td><td class='std'><img onclick='delPoint(this)'" +
		 		" src='./images/clean.png'></img></td></tr>";
	}
	str=str+"</table></div>";
	html=html+str;
	var tdstr="<div ><table id='mytable' style='border:1px solid;margin-top:15px;width:100%;position:relative;'><tr ><td style='border:solid 1px;text-align:center;height:30px;width:10%;'>时间</td>";
	var pntd="";
	for(var j=0;j<points.length;j++){
		if(points[j]=="" || points[j]==null){
			continue;
		}
		var list=getPointMes(points[j]);
		pntd=pntd+"<td class='ltd'>"+list[0].mpComment+"</td>";
	}
	
	var pvtd="";
	var j=0;
	var max=0;
	var serial=[];
	//var data=queryPointData(requestUrl);
	for(var dname in data){
		serial[j]=data[dname];
		if(max<serial[j].length){
			max=serial[j].length;
		}
		j++;
		/*var serials=data[dname];
		 for(var i=0;i<serials.length;i++){
			 var time=new Date(parseInt(serials[i].timestamp)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
			 pvtd=pvtd+"<tr><td class='ltd'>"+time+"</td><td class='std'>"+serials[i].value+"</td></tr>";
		 }*/
	}
	for(var i=0;i<max;i++){		
		pvtd=pvtd+"<tr>";
		var str="";
		var time=new Date(parseInt(serial[0][i].timestamp)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
		var stt = "<td class='ltd'>"+time+"</td>";
		//console.log(serial[0][i].length);
		for(var k=0;k<j;k++){				
				str=str+"<td class='std'>"+serial[k][i].pointValue+"</td>";							
		}
		str=stt+str;
		pvtd=pvtd+str+"</tr>";
	}	
	tdstr=tdstr+pntd+"</tr>";
	html=html+tdstr;
	html=html+pvtd;
	html=html+"</table></div>";
	var htstr='<div style="bottom:5px;width:100%;position:absolute;background-color:#EEFFFF;"><a id="btn0"></a>'+
'<input id="pageSize" type="text" size="1" maxlength="2" value="getDefaultValue()"/><a> 条 </a> <a href="#" id="pageSizeSet">设置</a> '+
'<a id="sjzl"></a>' +
'<a  href="#" id="btn1">首页</a>'+
'<a  href="#" id="btn2">上一页</a>'+
'<a  href="#" id="btn3">下一页</a>'+
'<a  href="#" id="btn4">尾页</a> '+
'<a>转到 </a>'+
'<input id="changePage" type="text" size="1" maxlength="4"/>'+
'<a>页 </a>'+
'<a  href="#" id="btn5">跳转</a></div>';
	html=html+htstr;
	//console.log(html);
	$("#container").append(html);
	//$.messager.alert("警告","testdata");
	pageSet();
}
/**
 * 删除曲线记录
 * */
function delPoint(jq){
	var id=$(jq).parent().parent().attr("id");
	var txt=$("#"+id).children().eq(0).text();
	//alert(txt);
	$("#"+id).remove();
	//alert(val);
}
/**
 * 根据点名获取点信息
 * 
 * */
function getPointMes(points){
	var data;
	//var guid = rnd();//产生随机数，预防有缓存
	var requestUrl = api_url+CALCULATION_URL+'/api/meaPoint/pageList';//请求地址
	//requestUrl = "../sis/diagram/getPointName.jhtml?" + guid;
	
	$.ajax({
		url:requestUrl,
		type:'POST',
		async:false,
		dataType:'json',
		contentType: "application/json; charset=utf-8",
		//data:"pointId="+points,
		data:JSON.stringify({
			mpNo:points,
			requestPage:{pageNo:1,limit:20}
		}),
		success:function(resp){
			//var list=resp.pointname;
			//data=list;

			data =resp.data.records;
		}
	});
	return data;
}
/**
 * 给表格添加点击事件
 * */
function tdClick(id){
	var val=$(id).find("b").text();
	//alert(val);
	$(id).empty();
	var html="<input type='text' onblur='disblur(this)' value='"+val+"'></input>";
	$(id).append(html);
}
/**
 * 输入框失去焦点事件
 * */
function disblur(en,id){
	//alert('test');
	var val=$(en).val();
	//var name=$(en).parent().attr("id");
	var html="<b>"+val+"</b>";
	var par=$(en).parent();
	par.empty();
	par.append(html);
	//$("#"+name).empty();
	//$("#"+name).append(html);
	
	//alert(name);
	//$(id).append(html);
}
/**
 * 加载曲线
 * */
function getChart(){
	tag=0;
	$("#container").empty();
	getAjax();
}
/**
 * 保存趋势组
 * */
function trendChartGroup(){
	$("#tst").css("display","");
	$("#dlg").window({
		title:'另存为趋势组',
		//collapsed:true,
		//fit:true,
		collapsible:false,
		minimizable:false,
		maximizable:false,
		width:400,
		height:300,
		//closed:false,
		modal:true
	});
	//趋势组
	initSelect();
}
function winClose(){
	$("#dlg").window("close");
}
/**
 * 保存趋势组信息
 * */
function saveTrendChart(){
	var name=$("#in").val();
	var status=$("#check").prop("checked");
	var end_time=$("#endTime").val();
	var upstatus=$('#updateTrend').prop("checked");
	var id='';
	if(upstatus){
		name=$('#selCom').combobox('getText');
		id=$('#selCom').combobox('getValue');
	}
	if(name==''){
		$.messager.alert('提示','请输入或选择一个趋势组');
		return;
	}	
	var points='';
	if(pointnames=="")pointnames=nowpoint;
	 points=pointnames;
	var str=points.split(";");
	var internal=10*60*1000;
	if(status){
		//alert(true);
		var date=new Date().getTime();
		end_time=new Date(date).format("yyyy-MM-dd hh:mm:ss");
		//alert(endTime);
	}
	else {
		end_time=$("#endTime").val();
		//alert(endTime);
	}
	var stime=$('#startTime').val();
	internal=new Date(end_time).getTime()-new Date(stime).getTime();
//	if(flag==1){
//		internal=10*60*1000;
//	}
//	else if(flag==2){
//		internal=30*60*1000;
//	}
//	else if(flag==3){
//		internal=60*60*1000;
//	}
//	else if(flag==4){
//		internal=2*60*60*1000;
//	}
//	else if(flag==5){
//		internal=24*60*60*1000;
//	}
	
	var guid=rnd();
	var reqUrl= "../sis/diagram/saveProcessChartPoint.jhtml?" +guid;
	$.ajax({
		url:reqUrl,
		type:'POST',
		data:"name="+name+"&internal="+internal+"&points="+points+"&endTime="+end_time+"&id="+id,//{'name':name,'internal':internal,'points':points,'endTime':end_time},
		async:false,
		success:function(resp){
			//alert("success");
			$("#dlg").window("close");
		}
	});
}
/**
 * 我的趋势组
 * */
function myTrendDlg(){
//	$("#trendDlg").css("display","inline");
	getTrendGroup();
	$("#myDlg").dialog({
		title:'趋势组',
		width:600,
		height:500,
		maximizable:false,
		minimizable:false,
		collapsible:false,
		modal:true
	});
}
/**
 * 加载趋势组列表
 * */
function getTrendGroup(){
	var datalist=getTrendData('');
	/*$("#bkList").empty();
	for(var i=0;i<datalist.length;i++){
		var html='<li id='+datalist[i].id+' style="cursor:pointer;" onclick="bak_color(this)"><h2 >'+datalist[i].groupname+'</h2></li>';
		$("#bkList").append(html);
	}*/
	$('#trendDlg').datagrid({
//		singleSelect:true,
		checkOnSelect:true,
		selectOnCheck:true,
		fitColumns:true,
		fit:true,
		data:datalist,
		columns:[[
			{field:'ck',title:'全选',checkbox:true},
			{field:'id',hidden:true},
			{field:'NUM',title:'序号',width:50},
			{field:'groupname',title:'趋势组名称',width:100,align:'left'},
			{field:'pointname',title:'测点名',width:100,hidden:true},
			{field:'internal',title:'时间间隔(s)',width:100,align:'right',hidden:true,formatter:function(value,row,index){
				value=parseFloat(value)/1000;
//				value=value.toFixed(2);
				return value;
			}},
			{field:'startTime',title:'开始时间',width:120,align:'center',hidden:true},
			{field:'endTime',title:'结束时间',width:120,align:'center',hidden:true},
			{field:'pointNo',title:'测点数量',width:80,align:'right'}
		]],
		rowStyler:function(index,row){
			if(index%2==0)return 'background-color:#C1FFC1;';
			else return 'background-color:#BFEFFF';
		},
		toolbar: [{
    		text:'查看趋势组',
    		iconCls: 'icon-search',
    		handler: function(){
    			var rows=$('#trendDlg').datagrid('getSelections');
    			if(rows.length>1){
    				$.messager.alert('提示','请选择单条趋势组');
    				return;
    			}
    			var id=rows[0].id;
    				searchTrend(id);
    		}
    	},'-',{
    		text:'删除',
    		iconCls: 'icon-remove',
    		handler: function(){
    			/*var len=$('#stab').datagrid('getRows').length;
    			//alert(len);
    			for(var i=0;i<len;i++){
    				$('#stab').datagrid('deleteRow',(len-1)-i);
    			}
    			codes=[];*/
    			var rows=$('#trendDlg').datagrid('getSelections');
    			//console.log(rows);
    			var len=rows.length;
    			for(var i=0;i<len;i++){
    				var id=rows[i].id;
    				//alert(id);
    				delTrendById(id);//根据ID删除趋势组
    			}
    			
    		}
    	},
    	{
    		text:'关闭',
    		iconCls:'icon-cancel',
    		handler:function(){
    			$("#myDlg").dialog('close');
    		}
    	}
    	]
	});
}
function getTrendData(id){
	var guid=rnd();
	var data='';
	var reqUrl= "../sis/diagram/getTrendGroup.jhtml?" +guid;
	if(id==''||id==null){
		id=null;
	}
	$.ajax({
		url:reqUrl,
		type:'post',
		async:false,
		data:"id="+id,
		success:function(resp){
			data=resp.point;
		}
	});
	return data;
}
/**
 * 选择控制按钮
 * index 1新增2修改
 * **/
function selRadio(index){
	if(index==1){
		$('#inpTrendText').css('display','');
		$('#inpTrend').css('display','');
		$('#selTrendText').css('display','none');
		$('#selTrend').css('display','none');
	}
	else {
		$('#inpTrendText').css('display','none');
		$('#inpTrend').css('display','none');
		$('#selTrendText').css('display','');
		$('#selTrend').css('display','');
	}
	initSelect();
}
/***
 * 初始化趋势组选择项
 * 
 * */
function initSelect(){
	var data=getTrendData('');//查看趋势组
	console.log(data);
	var len=data.length;
	var json='[';
	for(var i=0;i<len;i++){
		var id=data[i].id;
		var groupname=data[i].groupname;
		if(i==0)
		json+='{"id":"'+id+'","text":"'+groupname+'"}';
		else json+=',{"id":"'+id+'","text":"'+groupname+'"}';
	}
	json+=']';
	//console.log(json);
	$('#selCom').combobox({
		data:JSON.parse(json),
		width:180,
		valueField:'id',
		textField:'text'
	})
}
/**
 * 趋势列表选择事件
 * */
function bak_color(jq){
	$("#bkList li").css("background-color","");
	$("#bkList li").attr("name","");
	$(jq).css("background-color","#CAE1FF");
	$(jq).attr("name","bc");
}
/**
 * 查看趋势组
 * */
function searchTrend(id){
	/*var str=$("#bkList li[name='bc']").text();
	var id=$("#bkList li[name='bc']").attr("id");*/
	tag=0;//查看曲线
	//alert(str);
	if(id==null||id==''){
		getTrendData('');
	}else {
		var data=getTrendData(id);
		var point=data[0].pointname;
//		var endTime=data[0].endTime;
//		var internal=data[0].internal;
//		console.info(point);
		pointnames=point;
		//console.info(internal);
		$("#myDlg").window("close");
//		var etime=new Date(endTime);
//		var stime=new Date(etime.getTime()-parseInt(internal)).format("yyyy-MM-dd hh:mm:ss");
//		$("#endTime").val(etime.format("yyyy-MM-dd hh:mm:ss"));
//		$("#startTime").val(stime);
		onebeclick();
//		if(parseInt(internal)==10*60*1000){
//			//console.info('test');
//			onebeclick();
//			img_1click();
//		}
//		else if(parseInt(internal)==30*60*1000){
//			onebeclick();
//			img_2click();
//		}
//		else if(parseInt(internal)==60*60*1000){
//			onebeclick();
//			img_3click();
//		}else if(parseInt(internal)==2*60*60*1000){
//			onebeclick();
//			img_4click();
//		}
//		else if(parseInt(internal)==24*60*60*1000){
//			onebeclick();
//			img_5click();
//		}
		
		
		getAjax();
	}
	
}

/**
 * 删除趋势组
 * */
/*function delGroup(){
	var id=$("#bkList li[name='bc']").attr("id");
	if(id==''||id==null){
		id=null;
	}
	$("#id").remove();
	delTrendById(id);
	$("#myDlg").window("close");
}*/
function delTrendById(id){
	var guid=rnd();
	var reqUrl="../sis/diagram/deleteTrendGroup.jhtml?" +guid;
	$.ajax({
		url:reqUrl,
		type:'POST',
		async:false,
		data:"id="+id,
		success:function(resp){
			if(resp.flag>0){
				alert("删除成功");
				$("#myDlg").dialog('close');
			}
		}
	});
}
	

/**
 *日期格式化
 */
Date.prototype.format = function(format) {
	var o = {
		"M+" : this.getMonth() + 1,
		"d+" : this.getDate(),
		"h+" : this.getHours(),
		"m+" : this.getMinutes(),
		"s+" : this.getSeconds(),
		"q+" : Math.floor((this.getMonth() + 3) / 3),
		"S" : this.getMilliseconds()
	};
	if (/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for ( var k in o) {
		if (new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return format;
};

function jqid(id) { 
	return id.replace(/(:|\.)/g,'\\$1');
};

String.prototype.trim = function(){
    return this.replace(/(^\s*)|(\s*$)/g, "");
};



rnd.today = new Date();
rnd.seed = rnd.today.getTime();
function rnd() {//产生随机数
	rnd.seed = (rnd.seed * 9301 + 49297) % 233280;
	return rnd.seed / (233280.0);
}

/**
 *设置开始和结束日期
 */
function setStartTimeAndEndTime() {
	 $("#startTime").val(startTime);
	$("#endTime").val(endTime);
}

/**
 *异步请求数据
 */
function getAjax() {
	//console.log("getAjax()");
	//设置图形高度
	$('#container').css('min-height', ($(document).height()-250)+'px');
	if($.cookie('cookiePointNames') == null){
		//$('#pointTool').hide();//隐藏测点工具栏
		$('#pointTool').show();//隐藏测点工具栏
	}else{
		$('#pointTool').show();//隐藏测点工具栏
	}
	
	//setStartTimeAndEndTime();//设置开始和结束时间参数
	var stime=$('#startTime').val();
	var etime=$('#endTime').val();
	var guid = rnd();//产生随机数，预防有缓存
	var requestUrl = "";//请求地址
	//requestUrl = "../sis/diagram/showProcessChart.jhtml?" + guid;
	  requestUrl =api_url+CALCULATION_URL+"/api/diagram/showProcessChart?" + guid;
	drawCurve(initOptions);
	$("#loadTip").text("正在获取数据...");//提示信息
	//console.info(pointnames);
	//alert(pointnames);
	if(pointnames === "")pointnames = nowpoint;
	$.ajax({
		type:'POST',
		url:requestUrl,
		contentType: 'application/json',
		dataType: 'json',
		//data: "pointNames="+pointnames+"&startTime=" + stime + "&endTime=" + etime+"&interval=0&dataType=1" ,
		data:JSON.stringify({
			pointNames:pointnames,
			startTime:stime,
			endTime:etime,
			interval:0,
			dataType:1
		}),
		success: function(dataList) { 
			//alert(dataList);
			//console.log(dataList);
			if(dataList.code == 0){//成功
				createChart(dataList.data);
				//Highcharts.RangeSelector.prototype.render('2020-02-21 16:00:00','2020-02-21 17:00:00')
				$("#loadTip").text("");//清空提示信息
				//在表格显示测点值
				doGetPointsDatas(dataList.data);
			}else{
				alert(dataList.msg);
			}
		},
		error: function() {
//			console.log(dataList);
			//alert('获取数据失败');
			//$("#loadTip").text("获取数据失败！");//隐藏提示信息
		}
	});
	//dataList=queryPointData(requestUrl);
	//createChart(dataList);
}
//用来控制x轴值改变后请求后台数据
var _mouseup = true;
function mousedown(event) {
	//alert('down');
	_mouseup = false;
}
function mouseup(event) {
	//alert('up');
	_mouseup = true;
}
//var index=0;
//var color='#7cb5ec';
function createChart(dataList) {
	//console.log(dataList);
	var seriesOptions = [];
	var j=0;
	var yDatas=[];
	var colorData=[];
	for(var pname in dataList){
		var seriesData = [];
		var datas = dataList[pname];
		//console.log(datas);
		if(datas[0]==null||datas[0]=='')continue;
		var pdesc=datas[0].pointDesc;
		//var pdesc="";
		var len=datas.length;
		//console.log('len:'+len);
		for(var i = 1; i < datas.length; i++) {
			var indexData = datas[i];
			//console.log('indexValue:'+indexData.value);
			seriesData.push({"x": parseFloat(indexData.timestamp), "y": indexData.pointValue});
		}
		seriesOptions.push({
			//animation: false,//是否动态渲染，默认是
			turboThreshold: 0,//0表示禁用，如果不设置,默认是1000个点
			type: 'spline',
//	    	name: pname,
			name: pdesc,
			 yAxis:j,
	    	pointInterval: 1000,
	    	tooltip: {
        	  		valueDecimals: 1,
        	  		valueSuffix: ''
                	},	
	    	data: seriesData
		});
		var offset=40+50*j;
		yDatas.push({
			lineColor: '#000',
		    lineWidth: 0.1,
		    tickWidth: 0.1,
		    tickColor: '#CD2626',//'#ac9c9c',
		    offset:offset,
			title: {
				text: ''
			},
			labels:{
				formatter: function (obj) {
//					console.log('==========11111111'+this.axis.offset);
//					console.log(this);
//					var flag=this.isFirst;
//					if(flag){
//						color=get_chartsColor(index);
//						index++;
//					}
					var offset=this.axis.offset;
					var color='#7cb5ec';
					if(offset<0){
						offset=0-offset;
						var index=(offset-40)/50;
						color=get_chartsColor(index);
					}
					//console.log(color);
					//console.log(this.point);
					return '<div style="color:'+color+'">' + this.value + '</div>';
//					index++;
//					if(index<10){
//						color=get_chartsColor(0);
//						return '<div style="color:#7cb5ec">' + this.value + '</div>';
//					}
//					else{
//						color=get_chartsColor(1);
//						return '<div style="color:#7cb5ec">' + this.value + '</div>';
//					} 
					}
			},
		    plotLines: [{
		             value: 0,
		             width: 2,
		             color: '#808080'
		             }],
			plotBands:[{
				color:'#FCFFC5',
                label:{
                	style: {
					color: '#CD2626',
					fontSize:'16px',
					fontFamily:'微软雅黑'
				}
			}
			}]
		});
		j++;
	}
	//console.log(yDatas);
//		console.log(seriesOptions)
	var options = {chart: {
			borderWidth: 1,
        	plotBorderWidth: 1,
        	events: {
				load: function(chart) {
				}
        	},
        	zoomType: 'x'
		},
		navigator : {
		           height:20,
		           xAxis: {
		            		labels: {
					formatter: function() {
				                          var vDate = new Date(this.value);
				                          return (vDate.getMonth()+1)+"-"+vDate.getDate();
			                          } 
				}
			 }
	     },
        /*rangeSelector: {
        		enabled:false
        },*/
        height:200,
 		xAxis: {
         	gridLineWidth: 0.2,
			labels: {
				formatter: function() {
					var vDate = new Date(this.value);
					var hour = vDate.getHours();
					var minute = vDate.getMinutes();
					var second = vDate.getSeconds();
					var year = vDate.getFullYear();
					var mon = vDate.getMonth()+1;
					var day = vDate.getDate();
					var minutes="0";
					var seconds="0";
					if(minute<10){
					   minutes=minutes+minute;
					}else{
					   minutes=minute;
					}
					if(second<10){
					   seconds=seconds+second;
					}else{
					   seconds=second;
					}		
                    return year + "-" + mon+"-"+day+"<br>"+hour+ ":"+minutes+":"+seconds;
	             		} 
	 		},
	 		events:{
    			afterSetExtremes : function(event){
    				var end = event.max;
    				var start = event.min;
    				
    				var dataMax=event.dataMax;
    				var dataMin=event.dataMin;
    				$("#startTime").val(new Date(start).Format('yyyy-MM-dd hh:mm:ss'));
    				$("#endTime").val(new Date(end).Format('yyyy-MM-dd hh:mm:ss'));
    				if(_mouseup){
   					getAjax();//鼠标松开才查询
   				}
   			}
    		}
		},
		yAxis:yDatas,
			/* [
		{
			lineColor: '#ddss',
		    lineWidth: 0.1,
		    tickWidth: 0.1,
		    tickColor: '#accc',
			title: {
				text: ''
			},
		    plotLines: [{
		            value: 0,
		            width: 2,
		            color: '#cccc'
		             }]
		}
		]*/
	    tooltip: {
	    	formatter: function() {
				var vDate = new Date(this.x);
				var s = '时间:<b>' + vDate.getFullYear() + "-" +(vDate.getMonth()+1)+"-"+vDate.getDate()+" "+vDate.getHours()+":"+vDate.getMinutes()+":"+vDate.getSeconds(); +'</b>';
				$.each(this.points, function(i, point) {
					s += '<br/>测点：<font color='+this.series.color+'>'+ this.series.name +"</font>   值：<font color='green'>"+ parseFloat(point.y).toFixed('2') + "</font>";
				});
				return s;
			},
	    	valueDecimals: 2
	    },
	    legend: {
	    	enabled: true,
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'top',
            borderWidth: 0
        },
        rangeSelector: {
        	enabled:true,
        	buttons:[],
        	/*buttonTheme: {
                display: 'none' // 不显示按钮
            },*/
        	inputEnabled: false
//    		inputBoxWidth:200,
//    		inputBoxHeight:18,
//    		inputDateFormat: '%Y-%m-%d %H:%M:%S',
//    		inputEditDateFormat: '%Y-%m-%d %H:%M:%S',
    		// Custom parser to parse the %H:%M:%S.%L format
//    		inputDateParser: function (value) {
//    			value = value.split(/[:\.]/);
//    			return Date.UTC(
//    				1970,
//    				0,
//    				1,
//    				parseInt(value[0], 10),
//    				parseInt(value[1], 10),
//    				parseInt(value[2], 10),
//    				parseInt(value[3], 10)
//    			);
//    		}
    	},
		series: seriesOptions
	};
	drawCurve(options);
	
}
//刷新数据事件
function reFresh(){
	setStartTimeAndEndTime();
	getAjax();
}
//开始时间选择事件
function startTimeSelect(){
	WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss', maxDate:'#F{$dp.$D(\'endTime\')}', readOnly:true, isShowClear:false, onpicked:function(){
		onebeclick();
		startTime=$('#startTime').val();
		//getAjax();
	}});
	
}
//结束时间选择事件
function endTimeSelect(){
//	WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',minDate:'%y-%M-{%d-15} %H:%m:%s', maxDate:'#F{$dp.$D(\'endTime\')}', readOnly:true, isShowClear:false, onpicked:function(){
//		onebeclick();
//		endTime=$('#endTime').val();
//		//getAjax();
//	}})
	WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss', readOnly:true, isShowClear:false, onpicked:function(){
		onebeclick();
		endTime=$('#endTime').val();
		//getAjax();
	}});
}
var img1buff="stay";
var img2buff="stay";
var img3buff="stay";
var img4buff="stay";
var img5buff="stay";
function img_1click()
{ 
	if(img1buff!="click"){
		flag=1
		startTime=makedate(10*60*1000);
		document.getElementById("startTime").value=startTime;
	  	onebeclick();
	  	document.getElementById("img_1").src="images/10m_active.gif";
	  	img1buff="click";
	  	if(tag==0){
	  		getAjax();//获取数据曲线
	  	}
	  	else if(tag==1){
	  		queryPointData();//加载数据表格
	  	}
	  	
  	}
}
function img_1mouseover()
{  
	if(img1buff!="click"){
		document.getElementById("img_1").src="images/10m_hover.gif";
	}
}
function img_1mouseout()
{
	if(img1buff!="click"){
		document.getElementById("img_1").src="images/10m.gif";
	}

}
/////////////////////////////////////////////////////////
function img_2click()
{  
	if(img2buff!="click"){
		flag=2
		startTime=makedate(30*60*1000);
		document.getElementById("startTime").value=startTime;
		onebeclick();
		document.getElementById("img_2").src="images/30m_active.gif";
		img2buff="click";
		if(tag==0){
	  		getAjax();//获取数据曲线
	  	}
	  	else if(tag==1){
	  		queryPointData();//加载数据表格
	  	}
		//getAjax();//获取数据
	}
}
function img_2mouseover()
{  
	if(img2buff!="click"){
		document.getElementById("img_2").src="images/30m_hover.gif";
	}
}
function img_2mouseout()
{
	if(img2buff!="click"){
		document.getElementById("img_2").src="images/30m.gif";
	}

}
/////////////////////////////////////////////////////////
function img_3click()
{  
	if(img3buff!="click"){
		flag=3;
		startTime=makedate(60*60*1000);
		//alert(startTime);
	   	document.getElementById("startTime").value=startTime;
		onebeclick();
		document.getElementById("img_3").src="images/1h_active.gif";
		img3buff="click";
		if(tag==0){
	  		getAjax();//获取数据曲线
	  	}
	  	else if(tag==1){
	  		queryPointData();//加载数据表格
	  	}
		//getAjax();//获取数据
	}
}
function img_3mouseover()
{  
	if(img3buff!="click"){
		document.getElementById("img_3").src="images/1h_hover.gif";
	}
}
function img_3mouseout()
{
	if(img3buff!="click"){
		document.getElementById("img_3").src="images/1h.gif";
	}

}

function img_4click()
{  
	if(img4buff!="click"){
		flag=4;
		startTime=makedate(120*60*1000);
    	document.getElementById("startTime").value=startTime;
  		onebeclick();
  		document.getElementById("img_4").src="images/2h_active.gif";
  		img4buff="click";
  		if(tag==0){
	  		getAjax();//获取数据曲线
	  	}
	  	else if(tag==1){
	  		queryPointData();//加载数据表格
	  	}
  		//getAjax();//获取数据
  	}
}
function img_4mouseover()
{  
	if(img4buff!="click"){
 		document.getElementById("img_4").src="images/2h_hover.gif";
	}
}
function img_4mouseout()
{
	if(img4buff!="click"){
      		document.getElementById("img_4").src="images/2h.gif";
    	}

}
/////////////////////////////////////////////////////////
function img_5click()
{  
	if(img5buff!="click"){
		flag=5;
		startTime=makedate(24*60*60*1000);
    	document.getElementById("startTime").value=startTime;
  		onebeclick();
  		document.getElementById("img_5").src="images/1d_active.gif";
  		img5buff="click";
  		if(tag==0){
	  		getAjax();//获取数据曲线
	  	}
	  	else if(tag==1){
	  		queryPointData();//加载数据表格
	  	}
  		//getAjax();//获取数据
  	}
}
function img_5mouseover()
{  
	if(img5buff!="click"){
		document.getElementById("img_5").src="images/1d_hover.gif";
	}
}
function img_5mouseout()
{
	if(img5buff!="click"){
		document.getElementById("img_5").src="images/1d.gif";
	}

}


////////////////
/**
 * 拼接两位(月日)
 */
function maketwo(num)
{
	if(parseInt(num, 10)<10){
		num="0"+parseInt(num, 10);
	}
	return num;
}

/**
 * 计算时间
 * @param num
 * @returns {String}
 */
function makedate(num)
{
    //将字符串时间转换成日期类型
    var str = document.getElementById("endTime").value;
    str = str.replace(/-/g,"/");
    var newdate=new Date(str);

    //计算时间
    var newtimems=newdate.getTime()-(num);
    newdate.setTime(newtimems);
    //格式化计算后的时间
    var year=newdate.getFullYear();
    var month=newdate.getMonth();
    var day=newdate.getDate();
    var hour=newdate.getHours();
    var mm=newdate.getMinutes();
    var ss=newdate.getSeconds();
    var datestr=year+"-"+maketwo(month+1)+"-"+maketwo(day)+" "+maketwo(hour)+":"+maketwo(mm)+":"+maketwo(ss);
    return datestr;
}

/**
 * 计算开始日期(以前的，未用)
 * @param num
 * @returns {String}
 */
function makedate2(num)
{
	var datx=document.getElementById("endTime").value;//截止时间
	///var d2=new Date(datx.substring(0,4),parseInt(datx.substring(5,7))-1,datx.substring(8,10),datx.substring(11,13),datx.substring(14,16),datx.substring(17,19));
	var cc=parseInt(datx.substring(5,7));//
	if(cc<0){
		var d2=new Date(datx.substring(0,4),(parseInt(datx.substring(5,7).replace("0",""))-1),datx.substring(8,10),datx.substring(11,13),datx.substring(14,16),datx.substring(17,19));
	}else{
		var d2=new Date(datx.substring(0,4),(parseInt(datx.substring(5,7))-1),datx.substring(8,10),datx.substring(11,13),datx.substring(14,16),datx.substring(17,19));
	}
	/*
	if(cc<0){
		var d2=new Date(datx.substring(0,4),(parseInt(datx.substring(5,7).replace("0",""), 10)-1),datx.substring(8,10),datx.substring(11,13),datx.substring(14,16),datx.substring(17,19));
	}else{
		var d2=new Date(datx.substring(0,4),(parseInt(datx.substring(5,7), 10)-1),datx.substring(8,10),datx.substring(11,13),datx.substring(14,16),datx.substring(17,19));
	}
	*/
	var xtim=d2.getTime();
	var btim=xtim-parseInt(num);
	var d1=new Date(btim);
	var year=d1.getFullYear();
	var month=d1.getMonth();
	var day=d1.getDate();
	var hour=d1.getHours();
	var mm=d1.getMinutes();
	var ss=d1.getSeconds();
	var datestr=year+"-"+maketwo(month+1)+"-"+maketwo(day)+" "+maketwo(hour)+":"+maketwo(mm)+":"+maketwo(ss);
	//alert(datestr);
	return datestr;
}

/**
 *单击之前重置所有按钮
 */
function onebeclick()
{
	img1buff="stay";
	img2buff="stay";
	img3buff="stay";
	img4buff="stay";
	img5buff="stay";
	document.getElementById("img_1").src="images/10m.gif";
	document.getElementById("img_2").src="images/30m.gif";
	document.getElementById("img_3").src="images/1h.gif";
	document.getElementById("img_4").src="images/2h.gif";
	document.getElementById("img_5").src="images/1d.gif";
}



/**
 * 加载选取的测点
 */
function loadSelectedPoint(){
//	var cookiePointNames = $.cookie('cookiePointNames');
//	if(!cookiePointNames){
//		alert("请从组态图上选取测点");
//		return;
//	}
	var parent_obj = window.opener||parent;
	try{
	var cookiePointNames= parent_obj.loadSelectedPoint();
	//alert(cookiePointNames);
	if(cookiePointNames.indexOf(nowpoint+";") == -1){//当前测点不在选取测点列表里
		pointnames = nowpoint + ";" + cookiePointNames;
	}else{
		pointnames = cookiePointNames;
	}
	}catch(e){
		console.log(e);
	}
	//alert(pointnames);
	getAjax();//获取数据
}

/**
 * 清除选取测点
 */
function clearSelectedPoint(){
//	$.cookie('cookiePointNames', null , {path: '/'} );
	//window.opener.clearSelectedPoint();
	pointnames = nowpoint + ";";
	getAjax();//获取数据
}

/**
 * 获取url参数
 * @param name
 * @returns
 */
function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        //return unescape(r[2]);
		return decodeURI(r[2]);   //替换unescape 为 decodeURI   解决中文乱码问题 
    }
    return null;
}

/**
 * 获取趋势图表格显示数据
 * @param 查询测点返回的结果
 * @returns
 */
function doGetPointsDatas(resultData){
	console.log(resultData);
	 var tBody=$('#tbody_real_time');	
	    tBody.empty();	
	    var color_num=0;
	for(var p in resultData){		
		//获得图例颜色		
		var tr_color = get_chartsColor(color_num);
		color_num++;		
		var point_color='<div style="width:70%;height:10px;background-color:'+tr_color+';"></div>';
			
		var datas = resultData[p];	
		//该测点最大值
		var max_value=0;
		//该测点最小值
		var min_value=0;		
		//该测点平均值
		var avg_value=0;
		//该测点值的个数
		var num =0;		
		//测点名称
		if(datas[0]==null||datas[0]=='')
			continue;
		var point_name=datas[0].pointName;
		//测点单位
//		var point_unit = getPointMes(point_name)[0].unit;	
		var point_unit = datas[0].unit;
		//测点描述
//		var point_desc = getPointMes(point_name)[0].pointname;	
		var point_desc =  datas[0].pointDesc;
		//求取平均值
		for(var i = 1; i < datas.length; i++) {
			avg_value = avg_value+datas[i].pointValue;
			num++;
		}
		avg_value=(avg_value/num).toFixed(2);	
		
		//寻找最大值
		max_value = datas[1].pointValue;
		var max_value_index=1;
		for(var i = 1; i < datas.length; i++) {			
			if(datas[i].pointValue>max_value){
				max_value=datas[i].pointValue;
				max_value_index=i;
			}
		}
		//寻找最小值
		min_value = datas[1].pointValue;
		var min_value_index=1;
		for(var i = 1; i < datas.length; i++) {			
			if(datas[i].pointValue<min_value){
				min_value=datas[i].pointValue;
				min_value_index=i;
			}
		}
		//获得该测点最大值时间和最小值时间
		//最小值时间
		var min_value_time=datas[min_value_index].timestamp;
		//最大值时间
		var max_value_time=datas[max_value_index].timestamp;			   
	 var temp='<td>[point_color]</td>'
	       +'<td>[point_name]</td>'
	       +'<td>[point_desc]</td>'
	       +'<td>[point_unit]</td>'
	       +'<td>--</td>'
	       +'<td>[min_value]</td>'
	       +'<td>[min_value_time]</td>'
	       +'<td>[max_value]</td>'
	       +'<td>[max_value_time]</td>'
	       +'<td>[avg_value]</td>';	
	  var tr=$('<tr></tr>');//创建一对tr对象				  
		 tr.append(temp
		.replace('[point_color]',point_color) 
        .replace('[point_name]',point_name) 
        .replace('[point_desc]',point_desc)
        .replace('[point_unit]',point_unit)
        .replace('[min_value]',min_value.toFixed(2))
        .replace('[min_value_time]',new Date(min_value_time).toLocaleString())
        .replace('[max_value]',max_value.toFixed(2))
        .replace('[max_value_time]',new Date(max_value_time).toLocaleString())
        .replace('[avg_value]',avg_value)
         );
        tBody.append(tr);//将tr对象追加tbody	
	}
	
}

/**
 * 根据下表循环获得曲线的颜色
 * @param index
 * @returns
 */
function get_chartsColor(index){
	//获得图标的默认显示颜色
	var chars_colors=new Array('#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9', 
			'#f15c80', '#e4d354', '#8085e8', '#8d4653', '#91e8e1');
	return chars_colors[index%10];

}
/***
 * 日期时间格式转换
 * 
 * 
 */
	Date.prototype.Format = function (fmt) {
	    var o = {
	        "M+": this.getMonth() + 1, //月份 
	        "d+": this.getDate(), //日 
	        "h+": this.getHours(), //小时 
	        "m+": this.getMinutes(), //分 
	        "s+": this.getSeconds(), //秒 
	        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
	        "S": this.getMilliseconds() //毫秒 
	    };
	    if (/(y+)/.test(fmt))
	        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	        for (var k in o){
	            if (new RegExp("(" + k + ")").test(fmt)) {
	            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	        }
	    }
	    return fmt;
	}
