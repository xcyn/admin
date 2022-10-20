var treeLoaded = false;
var myChart;
//var pointnames='73440894_7';
//var nowpoint='73440894_7';
var tag=0;
var loca_id='10000';
//var pointcode='';
/**
 * 分页数据定义
 * */
var pageSize =20;    //每页显示的记录条数
var curPage=0;        //当前页
var lastPage;        //最后页
var direct=0;        //方向
var len;            //总行数
var page;            //总页数

var CALCULATION_URL;
var api_url;

$(function() {
	/* api_url=getQueryString('api_url');
	CALCULATION_URL=getQueryString('CALCULATION_URL'); */
	api_url = localStorage.getItem('api_url');
	CALCULATION_URL = localStorage.getItem('CALCULATION_URL');
	//alert("api_url="+api_url);
//	init();
	//initChart();
	//initTestPoint();
	initDlg();
	//initTime();
});





/**
 * 
 * 加载测点数据
 * */
//function queryPointData(){
//	//var data={};
//	//alert(pointnames);
//	tag=1;
//	//setStartTimeAndEndTime();//设置开始和结束时间参数
//	var startTime = $("#startTime").val();
//	var endTime = $("#endTime").val();
//	var guid = rnd();//产生随机数，预防有缓存
//	var reqestUrl = "";//请求地址
//	requestUrl = "../../sis/diagram/showProcessChart.jhtml?" + guid;
//	$.ajax({
//		type:'POST',
//		url:requestUrl,
//		dataType: 'json',
//		data: "pointNames="+pointnames+"&startTime=" + startTime + "&endTime=" + endTime ,
//		success: function(dataList) { 
//			//createChart(dataList);
//			//data=dataList;
//			getData(dataList);
//			$("#loadTip").text("");//清空提示信息
//			//return dataList;
//		},
//		error: function() {
//			alert('获取数据失败');
//			$("#loadTip").text("获取数据失败！");//隐藏提示信息
//		}
//	});
//	//return data;
//}


/**************************************历史趋势查询结束*****************************************************/
/***
 * 查询测点dialog
 * 
 * */
function initDlg(){
	//alert('init');
	$("#dd").dialog({
		title:'查询测点信息',
		width:1500,
		height:750,
		closed:true,
		cache:false,
		modal:true,
		onOpen:function(){
			//initTree();
			initPGrid();
			initSGrid();
		}
	});
   
}
/***
 * 初始化加载选择列表
 * */
function initSGrid(){
	 $('#stab').datagrid({
		 	singleSelect:true,
		 	fitColumns:true,
		 	fit:true,
		 	columns:[[
		 		{field:'pointcode',title:'测点编码',width:250},
		 		{field:'rtm_point_code',title:'实时测点',width:250},
		 		{field:'point_desc',title:'测点描述',width:200},
				{field:'unit',title:'单位',width:100}
		 	]],
	    	onClickRow:function(rowIndex,rowData){
	    		$(this).datagrid('deleteRow',rowIndex);
	    		var len=codes.length;
	    		//alert(len);
	    		var arry=[]
	    		for(var i=0;i<len-1;i++){
	    			if(i<rowIndex)
	    			arry[i]=codes[i];
	    			else if(i>=rowIndex){
	    				arry[i]=codes[i+1];
	    			}
	    		}
	    		//codes[len-1]=null;
	    		codes=arry;
	    	},
	    	toolbar: [{
	    		text:'确认',
	    		iconCls: 'icon-save',
	    		handler: function(){
	    			
	    			var rows=$('#stab').datagrid('getRows');
	    			var len=rows.length;
	    			var pointcodes='';
	    			//var points=pointnames.split(';');  //直接覆盖pointnames 了,  从这里到150行的注释调原来的比较排重逻辑
	    			//var plen=points.length;
	    			for(var i=0;i<len;i++){
	    				var pointcode=rows[i].pointcode;
	    				/* var flag=false;
	    				for(var j=0;j<plen;j++){//去除重复点名
	    					if(pointcode==points[j]){
	    						flag=true;
	    						break;
	    					}
	    				}
	    				if(flag)continue; */
	    				if(i==0)
	    					pointcodes=pointcode;
	    				else 
	    					pointcodes=pointcodes+";"+pointcode;
	    			}
	    			/* if(pointnames.lastIndexOf(";")+1==pointnames.length)
	    			pointnames+=pointcodes;
	    			else pointnames+=";"+pointcodes; */
					pointnames = pointcodes;  
	    			$("#dd").dialog('close');
	    			getAjax();
	    		}
	    	},'-',{
	    		text:'清空',
	    		iconCls: 'icon-clear',
	    		handler: function(){
	    			var len=$('#stab').datagrid('getRows').length;
	    			//alert(len);
	    			for(var i=0;i<len;i++){
	    				$('#stab').datagrid('deleteRow',(len-1)-i);
	    			}
	    			codes=[];
	    		}
	    	},
	    	{
	    		text:'关闭',
	    		iconCls:'icon-cancel',
	    		handler:function(){
	    			$("#dd").dialog('close');
	    		}
	    	}
	    	]
	    });

}
/***
 * 
 * */
function clearData(){
	$("#pcode").textbox('setValue','');
	$("#pname").textbox('setValue','');
	
}
/**
 * 初始化加载测点列表信息
 * */
var codes=[];
function initPGrid(){
	var path = getRootPath();
	var	pointcode=$("#pcode").textbox('getValue');
	var pointname=$("#pname").textbox('getValue');
	$("#ptab").datagrid({
		//url:'../pointSearch/getPointList.cpeam',
		url: api_url+CALCULATION_URL+'/api/meaPoint/getPointList',
		/* queryParams:{
			loca_id:loca_id,
			pointcode:pointcode,
			pointname:pointname
		}, */

		queryParams:{
			mpNo:pointcode,
			mpComment:pointname
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
		/* columns:[[
			{field:'POINTCODE',title:'测点编码',width:250},
			{field:'RTM_POINT_CODE',title:'实时测点编码',width:250},
			{field:'POINT_DESC',title:'测点描述',width:200},
			{field:'UNIT',title:'测点单位',width:100}
		]], */
		columns:[[
			{field:'mpNo',title:'测点编码',width:250},
			{field:'mpDcsNo',title:'实时测点编码',width:250},
			{field:'mpComment',title:'测点描述',width:200},
			{field:'unit',title:'测点单位',width:100}
		]],
		onBeforeLoad:function(param){
			param["requestPage.pageNo"] = param.page;
			param["requestPage.limit"] = param.rows;
			delete param.rows;
			delete param.page;
			//prm.page=
			//alert(loca_id);
			var pointname=$("#pname").val();
			/* param.loca_id=loca_id;
			param.pointcode=pointcode;
			param.pointname=pointname; */
			param.mpNo=pointcode;
			param.mpComment=pointname;
			//alert(loca_id);
			//$("#ptab").datagrid('reload');
		},
		onClickRow:function(rowIndex,rowData){
			/* var code=rowData.POINTCODE;
			var name=rowData.RTM_POINT_CODE;
			var point_desc=rowData.POINT_DESC;
			var unit=rowData.UNIT; */
			var code=rowData.mpNo;
			var name=rowData.mpDcsNo;
			var point_desc=rowData.mpComment;
			var unit=rowData.unit;
			var len=codes.length;
			var flag=false;
			if(len>0){
				for(var i=0;i<len;i++){
					if(code==codes[i]){
						flag=true;
					}
				}
			}
			if(flag){
				//alert('当前记录已选则');
			}
			else {
				$("#stab").datagrid('appendRow',{
					pointcode:code,
					rtm_point_code:name,
					point_desc:point_desc,
					unit:unit
				});
				codes[len]=code;
			}
			
		}
	});
	 var pg=$("#ptab").datagrid('getPager');
	 if(pg){
		 $(pg).pagination({
			 onBeforeRefresh:function(){
				 var pointname=$("#pname").val();
				 //alert(loca_id);
				 $("#ptab").datagrid('reload',{
					/* loca_id:loca_id,
					pointcode:pointcode,
					pointname:pointname */
					mpNo:pointcode,
					mpComment:pointname
				 });
				 return false;
			 }
//			 onChangePageSize:function(){
//				
//				// return false;
//			 },
//			 onSelectPage:function(pageNumber,pageSize){
////				 var pointname=$("#pname").val();
////				 alert(loca_id);
////				 $("#ptab").datagrid('reload',{
////					loca_id:loca_id,
////					pointcode:pointcode,
////					pointname:pointname
////				 });
//			 }
		 })
	 }
}

/**
 * 打开对话框
 * 
 * */
function showDialog(){
	$("#dd").dialog('open');
}
function showMenu() {  
 var jgObj = $("#jgSel");//输入框  
 var jgOffset = $("#jgSel").offset();//获取匹配元素在当前视口的相对偏移  
 //cityOffset.left 元素在当前视口的相对偏移  
 //slideDown 通过高度变化（向下增大）来动态地显示所有匹配的元素，在显示完成后可选地触发一个回调函数。  
 $("#menuContent").css({left:jgOffset.left + "px", top:jgOffset.top + jgObj.outerHeight() + "px"}).slideDown("fast");  
 $("body").bind("mousedown", onBodyDown);//给body绑定鼠标按下事件  
} 

function hideMenu() {  
 $("#menuContent").fadeOut("fast");  
 $("body").unbind("mousedown", onBodyDown);  
}  
//event 代表事件的状态，比如事件在其中发生的元素、键盘按键的状态、鼠标的位置、鼠标按钮的状态。  
//event.target 直接接受事件的目标DOM元素  
function onBodyDown(event) {  
 //如果接受事件的目标DOM元素的id 不是menuBtn（选择） 或 不是menuContent（菜单内容） 或  menuContent对象中元素的个数不大于0  
 //点击不是选择按钮，不是菜单内容的时候就隐藏下拉目录  
 if (!(event.target.id == "menuBtn" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length>0)) {  
     hideMenu();  
 }  
}



//update by guojing 20180620 end


function getRootPath() {
	var strFullPath = window.document.location.href;
	var strPath = window.document.location.pathname;
	var pos = strFullPath.indexOf(strPath);
	var prePath = strFullPath.substring(0, pos);
	var postPath = strPath.substring(0, strPath.substr(1).indexOf('/') + 1);
	return postPath;
}

